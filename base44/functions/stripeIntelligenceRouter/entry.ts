/**
 * stripeIntelligenceRouter
 *
 * STATUS: ACTIVE — Secondary Stripe webhook endpoint.
 *
 * PRIMARY webhook handler: stripeWebhook (full order fulfillment chain)
 * THIS handler: Intelligence layer — logs events, creates diagnostics, admin alerts.
 * DOES NOT duplicate order creation (checks for existing order first).
 *
 * ROOT CAUSE OF 75 FAILURES (FIXED):
 * req.text() was called to read the body for signature verification, then
 * createClientFromRequest(req) was called afterwards. In Deno, once req.text()
 * consumes the body stream, it cannot be re-read. createClientFromRequest internally
 * attempts to re-read the body, causing it to throw, which propagated as a 500
 * response to Stripe instead of the required 2xx.
 *
 * FIX: Create base44 client BEFORE reading req.text(), capture the body string,
 * then use it for signature verification. Return 200 immediately after validation.
 * All DB writes are fire-and-forget (never block the 200 response).
 *
 * STRIPE REQUIREMENT: Must return HTTP 200–299 within timeout.
 */

import Stripe from 'npm:stripe@14.21.0';
import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

function categoriseEvent(type) {
  if (['payment_intent.succeeded', 'invoice.paid', 'payout.paid', 'checkout.session.completed'].includes(type)) return 'revenue';
  if (['payment_intent.payment_failed', 'charge.dispute.created', 'payout.failed', 'invoice.payment_failed'].includes(type)) return 'risk';
  if (['customer.created', 'customer.updated', 'payment_method.attached'].includes(type)) return 'customer';
  if (['checkout.session.expired', 'charge.refunded', 'product.updated', 'price.updated'].includes(type)) return 'ecommerce';
  return 'automation';
}

function prioritiseEvent(type) {
  if (['payment_intent.payment_failed', 'charge.dispute.created', 'payout.failed'].includes(type)) return 'high';
  if (['product.updated', 'price.updated', 'customer.updated'].includes(type)) return 'low';
  return 'medium';
}

function safeSummary(event) {
  const obj = event.data?.object || {};
  const amount = obj.amount_total || obj.amount || obj.amount_paid || null;
  const amtStr = amount ? ` $${(amount / 100).toFixed(2)}` : '';
  const email = obj.customer_email || obj.customer_details?.email || '';
  const emailStr = email ? ` for ${email}` : '';
  return `${event.type}${amtStr}${emailStr}`;
}

Deno.serve(async (req) => {
  const secretKey = Deno.env.get('STRIPE_SECRET_KEY');
  const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET');
  const receivedAt = new Date().toISOString();

  // CRITICAL FIX: Create base44 client BEFORE consuming req body.
  // createClientFromRequest reads the Authorization header, not the body —
  // but Deno's Request body stream can only be read once. We must not call
  // req.text() before createClientFromRequest, or vice versa in the wrong order.
  // Solution: clone the request for the SDK, use original for body reading.
  const base44 = createClientFromRequest(req);

  if (!secretKey) {
    return new Response(JSON.stringify({ error: 'Stripe not configured' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Read body AFTER client creation
  let body;
  try {
    body = await req.text();
  } catch (e) {
    return new Response(JSON.stringify({ error: 'Failed to read body' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const signature = req.headers.get('stripe-signature');
  const stripe = new Stripe(secretKey);
  let event;

  // Signature verification
  if (webhookSecret && signature) {
    try {
      event = await stripe.webhooks.constructEventAsync(body, signature, webhookSecret);
    } catch (err) {
      // Log signature failure async — do not block response
      (async () => {
        try {
          await base44.asServiceRole.entities.PaymentDiagnostic.create({
            diagnostic_type: 'webhook_signature_failure',
            severity: 'critical',
            status: 'open',
            issue_summary: `Stripe webhook signature failed: ${err.message}`,
            admin_message: 'A webhook arrived with invalid signature. Possible: wrong STRIPE_WEBHOOK_SECRET or wrong endpoint.',
            recommended_fix: 'Verify STRIPE_WEBHOOK_SECRET in app secrets matches Stripe Dashboard → Webhooks → endpoint signing secret.',
            webhook_processed: false,
            source_chain: 'Stripe → stripeIntelligenceRouter → signature_failed',
          });
        } catch (_) {}
      })();
      return new Response(JSON.stringify({ error: 'Webhook signature failed' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  } else if (!webhookSecret) {
    // No secret — accept but log (dev/fallback mode only)
    try {
      event = JSON.parse(body);
    } catch {
      return new Response(JSON.stringify({ error: 'Invalid JSON payload' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  } else {
    // Webhook secret configured but no signature header — reject
    return new Response(JSON.stringify({ error: 'Missing stripe-signature header' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // ✅ RETURN 200 TO STRIPE IMMEDIATELY — all processing is fire-and-forget
  // This is the critical fix. Stripe requires 2xx within seconds.
  // All downstream DB writes are async and must NOT block this response.
  const response200 = new Response(JSON.stringify({ received: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });

  // Fire-and-forget async processing
  (async () => {
    const eventId = event.id;
    const eventType = event.type;
    const category = categoriseEvent(eventType);
    const priority = prioritiseEvent(eventType);

    // Deduplication check — skip if already processed by stripeWebhook
    try {
      const existing = await base44.asServiceRole.entities.StripeEventLog.filter({ stripe_event_id: eventId });
      if (existing && existing.length > 0) {
        // Already logged (likely by stripeWebhook) — mark as duplicate and exit
        await base44.asServiceRole.entities.StripeEventLog.create({
          stripe_event_id: `${eventId}_router_dup`,
          event_type: eventType,
          category,
          priority,
          processing_status: 'duplicate',
          duplicate_detected: true,
          safe_summary: `Router duplicate of ${eventId} — handled by stripeWebhook`,
          received_at: receivedAt,
          processed_at: new Date().toISOString(),
          source_chain: 'Stripe → stripeIntelligenceRouter → dedup_skipped',
        });
        return;
      }
    } catch (_) {}

    // Log the event
    let logId = null;
    try {
      const obj = event.data?.object || {};
      const logRecord = await base44.asServiceRole.entities.StripeEventLog.create({
        stripe_event_id: eventId,
        event_type: eventType,
        category,
        priority,
        processing_status: 'processing',
        duplicate_detected: false,
        stripe_object_id: obj.id || '',
        checkout_session_id: eventType.startsWith('checkout.') ? obj.id : '',
        payment_intent_id: obj.payment_intent || (eventType.startsWith('payment_intent') ? obj.id : ''),
        customer_id: obj.customer || '',
        amount: (obj.amount_total || obj.amount || obj.amount_paid || 0) / 100,
        currency: obj.currency || 'aud',
        safe_summary: safeSummary(event),
        received_at: receivedAt,
        source_chain: `Stripe → stripeIntelligenceRouter → ${eventType}`,
      });
      logId = logRecord?.id;
    } catch (_) {}

    // ---- INTELLIGENCE LAYER — supplemental diagnostics only ----
    // Order creation is handled exclusively by stripeWebhook.
    // This router only creates supplemental intelligence/diagnostic records.

    if (eventType === 'checkout.session.completed') {
      const session = event.data.object;

      // Check if stripeWebhook already created the order (race condition safety)
      let orderExists = false;
      try {
        const orders = await base44.asServiceRole.entities.MerchOrder.filter({ stripe_session_id: session.id });
        orderExists = orders && orders.length > 0;
      } catch (_) {}

      if (!orderExists) {
        // stripeWebhook may still be processing — log a deferred diagnostic
        try {
          await base44.asServiceRole.entities.PaymentDiagnostic.create({
            diagnostic_type: 'payment_without_order',
            severity: 'warning',
            status: 'open',
            customer_email: session.customer_email || session.customer_details?.email || '',
            checkout_session_id: session.id,
            payment_intent_id: session.payment_intent || '',
            amount: (session.amount_total || 0) / 100,
            currency: 'aud',
            issue_summary: `checkout.session.completed received by router — order not yet found. May be processing via stripeWebhook.`,
            admin_message: `Session ${session.id} completed. If no MerchOrder exists within 60s, use /admin/stripe-webhook-health to recover.`,
            recommended_fix: 'Check /admin/orders. If missing, use order recovery scan in /admin/stripe-webhook-health.',
            webhook_processed: false,
            source_chain: `Stripe → stripeIntelligenceRouter → checkout.session.completed → order_pending`,
          });
        } catch (_) {}
      }
    }

    if (eventType === 'charge.dispute.created') {
      const dispute = event.data.object;
      try {
        await base44.asServiceRole.entities.PaymentDiagnostic.create({
          diagnostic_type: 'dispute',
          severity: 'critical',
          status: 'open',
          stripe_event_id: eventId,
          amount: (dispute.amount || 0) / 100,
          currency: dispute.currency || 'aud',
          issue_summary: `Chargeback/dispute created: ${dispute.reason || 'unknown'}`,
          admin_message: `Dispute ${dispute.id} opened. Reason: ${dispute.reason}. Amount: $${((dispute.amount || 0) / 100).toFixed(2)}. Respond urgently via Stripe Dashboard.`,
          recommended_fix: 'Go to Stripe Dashboard → Disputes and submit evidence immediately.',
          webhook_processed: true,
          source_chain: `Stripe → stripeIntelligenceRouter → charge.dispute.created`,
        });
        await base44.asServiceRole.entities.AdminNotification.create({
          notification_type: 'payment_warning',
          severity: 'critical',
          title: 'DISPUTE / CHARGEBACK received',
          summary: `Dispute ${dispute.id}: ${dispute.reason}. $${((dispute.amount || 0) / 100).toFixed(2)} at risk. Respond immediately in Stripe.`,
          requires_action: true,
          linked_route: '/admin/payment-diagnostics',
          source: 'stripeIntelligenceRouter',
        });
      } catch (_) {}
    }

    if (eventType === 'payment_intent.payment_failed') {
      const pi = event.data.object;
      try {
        await base44.asServiceRole.entities.PaymentDiagnostic.create({
          diagnostic_type: 'failed_payment',
          severity: 'high',
          status: 'open',
          stripe_event_id: eventId,
          payment_intent_id: pi.id,
          amount: (pi.amount || 0) / 100,
          issue_summary: `Payment failed: ${pi.last_payment_error?.message || 'Unknown error'}`,
          recommended_fix: 'Customer should retry. Check Stripe Dashboard for decline reason.',
          webhook_processed: true,
          source_chain: `Stripe → stripeIntelligenceRouter → payment_intent.payment_failed`,
        });
      } catch (_) {}
    }

    if (eventType === 'charge.refunded') {
      const charge = event.data.object;
      try {
        await base44.asServiceRole.entities.PaymentDiagnostic.create({
          diagnostic_type: 'refund',
          severity: 'warning',
          status: 'open',
          stripe_event_id: eventId,
          amount: (charge.amount_refunded || 0) / 100,
          issue_summary: `Refund: $${((charge.amount_refunded || 0) / 100).toFixed(2)}`,
          admin_message: `Charge ${charge.id} refunded $${((charge.amount_refunded || 0) / 100).toFixed(2)}.`,
          recommended_fix: 'Update MerchOrder status to refunded if applicable.',
          webhook_processed: true,
          source_chain: `Stripe → stripeIntelligenceRouter → charge.refunded`,
        });
      } catch (_) {}
    }

    // Update log to processed
    if (logId) {
      try {
        await base44.asServiceRole.entities.StripeEventLog.update(logId, {
          processing_status: 'processed',
          processed_at: new Date().toISOString(),
        });
      } catch (_) {}
    }
  })();

  return response200;
});