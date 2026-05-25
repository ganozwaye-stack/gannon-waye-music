/**
 * Stripe Intelligence Router
 * PUBLIC endpoint - verified by Stripe webhook signature only.
 * Do NOT add base44.auth.me() or admin checks here.
 * Stripe calls this as a server-to-server POST from their infrastructure.
 */

import Stripe from 'npm:stripe@14.21.0';
import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

// Categorise Stripe event types
function categoriseEvent(type) {
  if (['payment_intent.succeeded', 'invoice.paid', 'payout.paid', 'checkout.session.completed'].includes(type)) return 'revenue';
  if (['payment_intent.payment_failed', 'charge.dispute.created', 'payout.failed', 'invoice.payment_failed'].includes(type)) return 'risk';
  if (['customer.created', 'customer.updated', 'payment_method.attached', 'customer.subscription.created', 'customer.subscription.updated', 'customer.subscription.deleted'].includes(type)) return 'customer';
  if (['checkout.session.expired', 'charge.refunded', 'product.updated', 'price.updated'].includes(type)) return 'ecommerce';
  return 'automation';
}

function prioritiseEvent(type) {
  const high = ['payment_intent.payment_failed', 'charge.dispute.created', 'payout.failed', 'invoice.payment_failed'];
  const low = ['product.updated', 'price.updated', 'customer.updated', 'payment_method.attached'];
  if (high.includes(type)) return 'high';
  if (low.includes(type)) return 'low';
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

  if (!secretKey) {
    return Response.json({ error: 'Stripe not configured' }, { status: 500 });
  }

  const stripe = new Stripe(secretKey);
  const body = await req.text();
  const signature = req.headers.get('stripe-signature');

  let event;

  // Signature verification
  if (webhookSecret && signature) {
    try {
      event = await stripe.webhooks.constructEventAsync(body, signature, webhookSecret);
    } catch (err) {
      // Log signature failure — create diagnostic without auth
      try {
        const base44 = createClientFromRequest(req);
        await base44.asServiceRole.entities.PaymentDiagnostic.create({
          diagnostic_type: 'webhook_signature_failure',
          severity: 'critical',
          status: 'open',
          issue_summary: `Stripe webhook signature verification failed: ${err.message}`,
          admin_message: 'A webhook arrived with an invalid signature. This could indicate a misconfigured STRIPE_WEBHOOK_SECRET or a forged request.',
          recommended_fix: 'Check STRIPE_WEBHOOK_SECRET matches the signing secret in Stripe Dashboard → Webhooks → your endpoint.',
          webhook_processed: false,
          source_chain: 'Stripe → stripeIntelligenceRouter → signature_failed',
        });
        await base44.asServiceRole.entities.AdminNotification.create({
          notification_type: 'payment_warning',
          severity: 'critical',
          title: 'Stripe webhook signature verification FAILED',
          summary: `Invalid signature received. Possible misconfiguration or spoofed request. ${err.message}`,
          requires_action: true,
          linked_route: '/admin/webhook-health',
          source: 'stripeIntelligenceRouter',
        });
      } catch {}
      return Response.json({ error: 'Webhook signature failed' }, { status: 400 });
    }
  } else if (!webhookSecret) {
    // No secret configured — accept in dev but log warning
    try {
      event = JSON.parse(body);
      const base44 = createClientFromRequest(req);
      await base44.asServiceRole.entities.PaymentDiagnostic.create({
        diagnostic_type: 'missing_stripe_config',
        severity: 'high',
        status: 'open',
        issue_summary: 'STRIPE_WEBHOOK_SECRET is not set. Webhooks are unverified.',
        recommended_fix: 'Set STRIPE_WEBHOOK_SECRET in app secrets from Stripe Dashboard → Webhooks → your endpoint → Signing secret.',
        source_chain: 'stripeIntelligenceRouter → no_secret_configured',
      });
    } catch {
      return Response.json({ error: 'Invalid payload and no webhook secret' }, { status: 400 });
    }
  } else {
    return Response.json({ error: 'No signature provided' }, { status: 400 });
  }

  // Respond to Stripe immediately — process async
  const base44 = createClientFromRequest(req);
  const eventId = event.id;
  const eventType = event.type;
  const category = categoriseEvent(eventType);
  const priority = prioritiseEvent(eventType);

  // Deduplication check
  try {
    const existing = await base44.asServiceRole.entities.StripeEventLog.filter({ stripe_event_id: eventId });
    if (existing && existing.length > 0) {
      await base44.asServiceRole.entities.StripeEventLog.create({
        stripe_event_id: eventId,
        event_type: eventType,
        category,
        priority,
        processing_status: 'duplicate',
        duplicate_detected: true,
        safe_summary: `Duplicate event ignored: ${eventId}`,
        received_at: receivedAt,
        processed_at: new Date().toISOString(),
        source_chain: 'Stripe → stripeIntelligenceRouter → duplicate_skipped',
      });
      return Response.json({ received: true, duplicate: true });
    }
  } catch {}

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
      checkout_session_id: eventType.startsWith('checkout.') ? obj.id : (obj.metadata?.checkout_session_id || ''),
      payment_intent_id: obj.payment_intent || (eventType.startsWith('payment_intent') ? obj.id : ''),
      customer_id: obj.customer || '',
      amount: (obj.amount_total || obj.amount || obj.amount_paid || 0) / 100,
      currency: obj.currency || 'aud',
      safe_summary: safeSummary(event),
      received_at: receivedAt,
      source_chain: `Stripe → stripeIntelligenceRouter → ${eventType}`,
    });
    logId = logRecord?.id;
  } catch {}

  // ---- EVENT ROUTING ----

  if (eventType === 'checkout.session.completed') {
    const session = event.data.object;
    const meta = session.metadata || {};

    // Check for duplicate order
    let existingOrder = null;
    try {
      const orders = await base44.asServiceRole.entities.MerchOrder.filter({ stripe_session_id: session.id });
      if (orders && orders.length > 0) existingOrder = orders[0];
    } catch {}

    if (!existingOrder) {
      try {
        const order = await base44.asServiceRole.entities.MerchOrder.create({
          customer_name: meta.customer_name || session.customer_details?.name || '',
          customer_email: session.customer_email || session.customer_details?.email || '',
          shipping_address: meta.shipping_address || '',
          items: [{
            product_id: meta.product_id || '',
            product_name: meta.product_name || 'Store Purchase',
            size: meta.size || '',
            quantity: parseInt(meta.quantity || '1', 10),
            price: parseFloat(meta.sale_price || '0'),
          }],
          total_amount: (session.amount_total || 0) / 100,
          promo_code: meta.promo_code || null,
          stripe_session_id: session.id,
          stripe_payment_intent: session.payment_intent || '',
          status: 'confirmed',
          payment_status: 'paid',
          notes: `Stripe Checkout: ${session.id}`,
        });

        if (logId) {
          try {
            await base44.asServiceRole.entities.StripeEventLog.update(logId, {
              order_id: order?.id || '',
              records_created: 'MerchOrder',
              processing_status: 'processed',
              processed_at: new Date().toISOString(),
              automation_triggered: 'order_creation,admin_notification',
            });
          } catch {}
        }

        // Promo usage
        if (meta.promo_id) {
          try { await base44.asServiceRole.entities.PromoCode.update(meta.promo_id, { times_used: (await base44.asServiceRole.entities.PromoCode.filter({ id: meta.promo_id }))?.[0]?.times_used + 1 || 1 }); } catch {}
        }

        // Admin notification
        await base44.asServiceRole.entities.AdminNotification.create({
          notification_type: 'order',
          severity: 'info',
          title: `New sale — ${meta.product_name || 'Store purchase'}`,
          summary: `${meta.customer_name || 'Customer'} paid $${((session.amount_total || 0) / 100).toFixed(2)} AUD`,
          requires_action: true,
          linked_route: '/admin/orders',
          linked_entity: 'MerchOrder',
          linked_id: order?.id || '',
          source: 'stripeIntelligenceRouter',
        });

      } catch (orderErr) {
        // Payment received but order creation failed — critical diagnostic
        try {
          await base44.asServiceRole.entities.PaymentDiagnostic.create({
            diagnostic_type: 'payment_without_order',
            severity: 'critical',
            status: 'open',
            customer_email: session.customer_email || session.customer_details?.email || '',
            customer_name: session.customer_details?.name || '',
            stripe_event_id: eventId,
            checkout_session_id: session.id,
            payment_intent_id: session.payment_intent || '',
            amount: (session.amount_total || 0) / 100,
            currency: 'aud',
            issue_summary: `Payment succeeded but order creation failed: ${orderErr.message}`,
            admin_message: `Stripe session ${session.id} completed payment but MerchOrder could not be created. Manual intervention required.`,
            customer_safe_message: 'Your payment was received. We are processing your order and will confirm shortly.',
            recommended_fix: 'Check MerchOrder entity, create order manually in /admin/orders.',
            webhook_processed: false,
            source_chain: `Stripe → stripeIntelligenceRouter → checkout.session.completed → order_creation_failed`,
          });
          await base44.asServiceRole.entities.AdminNotification.create({
            notification_type: 'payment_warning',
            severity: 'critical',
            title: 'Payment received — order creation FAILED',
            summary: `Session ${session.id}: payment confirmed but no order was created. ${orderErr.message}`,
            requires_action: true,
            linked_route: '/admin/payment-diagnostics',
            source: 'stripeIntelligenceRouter',
          });
        } catch {}
      }
    }
  }

  if (eventType === 'payment_intent.succeeded') {
    const pi = event.data.object;
    if (logId) {
      try {
        await base44.asServiceRole.entities.StripeEventLog.update(logId, {
          processing_status: 'processed',
          processed_at: new Date().toISOString(),
        });
      } catch {}
    }
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
        currency: pi.currency || 'aud',
        issue_summary: `Payment failed: ${pi.last_payment_error?.message || 'Unknown error'}`,
        admin_message: `PaymentIntent ${pi.id} failed. Error: ${pi.last_payment_error?.message || 'unknown'}. Code: ${pi.last_payment_error?.code || 'none'}`,
        customer_safe_message: 'Your payment could not be processed. Please check your card details and try again.',
        recommended_fix: 'Customer should retry with a different card. Check Stripe Dashboard for decline reason.',
        retry_available: true,
        webhook_processed: true,
        source_chain: `Stripe → stripeIntelligenceRouter → payment_intent.payment_failed`,
      });
      await base44.asServiceRole.entities.AdminNotification.create({
        notification_type: 'payment_warning',
        severity: 'high',
        title: 'Payment failed',
        summary: `PaymentIntent ${pi.id}: ${pi.last_payment_error?.message || 'Unknown error'}`,
        requires_action: false,
        linked_route: '/admin/payment-diagnostics',
        source: 'stripeIntelligenceRouter',
      });
    } catch {}
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
        issue_summary: `Chargeback/dispute created: ${dispute.reason || 'unknown reason'}`,
        admin_message: `Stripe dispute ${dispute.id} opened. Reason: ${dispute.reason}. Amount: $${(dispute.amount / 100).toFixed(2)}. Respond by: ${dispute.evidence_details?.due_by ? new Date(dispute.evidence_details.due_by * 1000).toLocaleDateString() : 'check Stripe'}`,
        recommended_fix: 'Go to Stripe Dashboard → Disputes and submit evidence immediately.',
        webhook_processed: true,
        source_chain: `Stripe → stripeIntelligenceRouter → charge.dispute.created`,
      });
      await base44.asServiceRole.entities.AdminNotification.create({
        notification_type: 'payment_warning',
        severity: 'critical',
        title: 'DISPUTE / CHARGEBACK received',
        summary: `Dispute ${dispute.id}: ${dispute.reason}. $${(dispute.amount / 100).toFixed(2)} at risk. Check Stripe immediately.`,
        requires_action: true,
        linked_route: '/admin/payment-diagnostics',
        source: 'stripeIntelligenceRouter',
      });
    } catch {}
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
        currency: charge.currency || 'aud',
        issue_summary: `Refund issued: $${(charge.amount_refunded / 100).toFixed(2)}`,
        admin_message: `Charge ${charge.id} was refunded. Total refunded: $${(charge.amount_refunded / 100).toFixed(2)}.`,
        recommended_fix: 'Update MerchOrder status to refunded if applicable.',
        webhook_processed: true,
        source_chain: `Stripe → stripeIntelligenceRouter → charge.refunded`,
      });
    } catch {}
  }

  if (eventType === 'checkout.session.expired') {
    const session = event.data.object;
    try {
      await base44.asServiceRole.entities.PaymentDiagnostic.create({
        diagnostic_type: 'checkout_timeout',
        severity: 'info',
        status: 'open',
        stripe_event_id: eventId,
        checkout_session_id: session.id,
        issue_summary: `Checkout session expired without payment`,
        admin_message: `Session ${session.id} expired. Customer did not complete purchase.`,
        customer_safe_message: 'Your checkout session expired. You have not been charged. Please return to the store to try again.',
        recommended_fix: 'No action required unless this is frequent — check /admin/payment-diagnostics for patterns.',
        webhook_processed: true,
        source_chain: `Stripe → stripeIntelligenceRouter → checkout.session.expired`,
      });
    } catch {}
  }

  if (['invoice.payment_failed', 'payout.failed'].includes(eventType)) {
    const obj = event.data.object;
    try {
      await base44.asServiceRole.entities.AdminNotification.create({
        notification_type: 'payment_warning',
        severity: 'high',
        title: `${eventType} — needs attention`,
        summary: `${eventType}: ${obj.id}. Amount: $${((obj.amount || obj.amount_due || 0) / 100).toFixed(2)}`,
        requires_action: true,
        linked_route: '/admin/payment-diagnostics',
        source: 'stripeIntelligenceRouter',
      });
    } catch {}
  }

  // Update log to processed
  if (logId) {
    try {
      await base44.asServiceRole.entities.StripeEventLog.update(logId, {
        processing_status: 'processed',
        processed_at: new Date().toISOString(),
      });
    } catch {}
  }

  return Response.json({ received: true });
});