/**
 * stripeIntelligenceRouter
 *
 * STATUS: SECONDARY / OPTIONAL — intelligence layer only.
 *
 * PRIMARY webhook handler: stripeWebhook (full order fulfillment chain)
 *   → https://api.base44.app/api/v2/apps/69eb7905ca6eb4180010f794/functions/stripeWebhook
 *
 * THIS handler: Supplemental intelligence — logs events, creates diagnostics,
 * admin alerts. Does NOT create orders (that is exclusively stripeWebhook's job).
 *
 * SECURITY: In live mode (sk_live_), STRIPE_WEBHOOK_SECRET is required and
 * unsigned payloads are rejected. In test mode without a secret, unsigned
 * payloads are accepted for local development only.
 *
 * STRIPE REQUIREMENT: Must return HTTP 200–299 within timeout.
 * Returns 200 immediately; all processing is fire-and-forget.
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
  // CRITICAL: Create base44 client BEFORE consuming req body.
  const base44 = createClientFromRequest(req);

  const secretKey = (Deno.env.get('STRIPE_SECRET_KEY') || '').trim();
  const webhookSecret = (Deno.env.get('STRIPE_WEBHOOK_SECRET') || '').trim();
  const receivedAt = new Date().toISOString();
  const isLiveMode = secretKey.startsWith('sk_live_');

  if (!secretKey || !secretKey.startsWith('sk_')) {
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

  // ── Signature verification ────────────────────────────────────────────
  // Live mode: STRIPE_WEBHOOK_SECRET is REQUIRED. Reject unsigned payloads.
  if (isLiveMode) {
    if (!webhookSecret) {
      return new Response(JSON.stringify({ error: 'STRIPE_WEBHOOK_SECRET not configured — live mode requires signed webhooks' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    if (!signature) {
      (async () => {
        try {
          await base44.asServiceRole.entities.PaymentDiagnostic.create({
            diagnostic_type: 'webhook_signature_failure',
            severity: 'critical',
            status: 'open',
            issue_summary: 'stripeIntelligenceRouter: missing stripe-signature header in live mode',
            admin_message: 'A webhook arrived without a signature. Stripe keeps retrying until it receives 2xx. Verify STRIPE_WEBHOOK_SECRET matches the Stripe Dashboard endpoint signing secret.',
            recommended_fix: 'Rotate the endpoint signing secret in Stripe Dashboard → Webhooks and update STRIPE_WEBHOOK_SECRET in app secrets.',
            webhook_processed: false,
            source_chain: 'Stripe → stripeIntelligenceRouter → missing_signature',
          });
        } catch (_) {}
      })();
      // Ack 2xx so Stripe stops retrying / disabling the endpoint. Diagnostic logged above.
      return new Response(JSON.stringify({ received: true, verified: false }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    try {
      event = await stripe.webhooks.constructEventAsync(body, signature, webhookSecret);
    } catch (err) {
      (async () => {
        try {
          await base44.asServiceRole.entities.PaymentDiagnostic.create({
            diagnostic_type: 'webhook_signature_failure',
            severity: 'critical',
            status: 'open',
            issue_summary: `stripeIntelligenceRouter signature failed: ${err.message}`,
            admin_message: 'A webhook arrived with invalid signature. Possible: wrong STRIPE_WEBHOOK_SECRET or wrong endpoint.',
            recommended_fix: 'Verify STRIPE_WEBHOOK_SECRET in app secrets matches Stripe Dashboard → Webhooks → endpoint signing secret.',
            webhook_processed: false,
            source_chain: 'Stripe → stripeIntelligenceRouter → signature_failed',
          });
          await base44.asServiceRole.functions.invoke('notifyAdmin', {
            notification_type: 'payment_warning',
            severity: 'critical',
            title: '🚨 Stripe Webhook Signature Failed',
            summary: `stripeIntelligenceRouter verification failed: ${err.message}. Check your signing secrets.`,
            requires_action: true,
            linked_route: '/admin/webhook-health',
            source: 'stripeIntelligenceRouter',
          });
        } catch (_) {}
      })();
      // Ack 2xx so Stripe stops retrying / disabling the endpoint. Critical diagnostic logged above.
      return new Response(JSON.stringify({ received: true, verified: false }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  } else if (webhookSecret && signature) {
    // Test mode with secret configured — verify signature
    try {
      event = await stripe.webhooks.constructEventAsync(body, signature, webhookSecret);
    } catch (err) {
      (async () => {
        try {
          await base44.asServiceRole.entities.PaymentDiagnostic.create({
            diagnostic_type: 'webhook_signature_failure',
            severity: 'critical',
            status: 'open',
            issue_summary: `stripeIntelligenceRouter signature failed (test mode): ${err.message}`,
            webhook_processed: false,
            source_chain: 'Stripe → stripeIntelligenceRouter → signature_failed',
          });
        } catch (_) {}
      })();
      // Ack 2xx so Stripe stops retrying / disabling the endpoint. Diagnostic logged above.
      return new Response(JSON.stringify({ received: true, verified: false }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  } else {
    // Dev/fallback: no secret or no signature — accept raw JSON (dev only)
    try {
      event = JSON.parse(body);
    } catch {
      return new Response(JSON.stringify({ error: 'Invalid JSON payload' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  }

  // ✅ RETURN 200 TO STRIPE IMMEDIATELY — all processing is fire-and-forget
  const response200 = new Response(JSON.stringify({ received: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });

  // Fire-and-forget async processing — INTELLIGENCE ONLY, no order creation
  (async () => {
    const eventId = event.id;
    const eventType = event.type;
    const category = categoriseEvent(eventType);
    const priority = prioritiseEvent(eventType);

    // Deduplication check — skip if already processed by stripeWebhook
    try {
      const existing = await base44.asServiceRole.entities.StripeEventLog.filter({ stripe_event_id: eventId });
      if (existing && existing.length > 0) {
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
    // Order creation is handled EXCLUSIVELY by stripeWebhook.
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
            admin_message: `Session ${session.id} completed. If no MerchOrder exists within 60s, use /admin/webhook-health to recover.`,
            recommended_fix: 'Check /admin/orders. If missing, use order recovery scan in /admin/webhook-health.',
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
        await base44.asServiceRole.functions.invoke('notifyAdmin', {
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