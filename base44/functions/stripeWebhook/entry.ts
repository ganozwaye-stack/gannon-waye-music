/**
 * Primary Stripe webhook for paid merchandise orders.
 *
 * Core guarantees:
 * 1. Live events require a valid Stripe signature.
 * 2. A checkout session can create only one active order.
 * 3. The paid order and canonical Stripe event are stored before a 2xx response.
 * 4. GST is recorded as zero while the business is not GST registered.
 * 5. Inventory and customer communication are delegated to an idempotent order processor.
 */

import Stripe from 'npm:stripe@14.21.0';
import { createClientFromRequest } from 'npm:@base44/sdk@0.8.30';

function parseJsonArray(value) {
  try {
    const parsed = typeof value === 'string' ? JSON.parse(value) : value;
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function formatAddress(session, metadata) {
  const address = (
    session?.collected_information?.shipping_details?.address ||
    session?.shipping_details?.address ||
    session?.customer_details?.address
  );
  if (address) {
    return [
      address.line1,
      address.line2,
      address.city,
      address.state,
      address.postal_code,
      address.country,
    ].filter(Boolean).join(', ');
  }
  return String(metadata?.shipping_address || '').trim();
}

function numberOr(value, fallback = 0) {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
}

async function createDiagnostic(base44, issueSummary, extra = {}) {
  try {
    const existing = await base44.asServiceRole.entities.PaymentDiagnostic.filter({
      issue_summary: issueSummary,
      status: 'open',
    });
    if (Array.isArray(existing) && existing.length > 0) return existing[0];
    return await base44.asServiceRole.entities.PaymentDiagnostic.create({
      diagnostic_type: 'webhook_failure',
      severity: 'critical',
      status: 'open',
      issue_summary: issueSummary,
      ...extra,
    });
  } catch {
    return null;
  }
}

async function persistStripeEvent(base44, event, session, orderId, duplicate) {
  const existing = await base44.asServiceRole.entities.StripeEventLog.filter({
    stripe_event_id: event.id,
  });
  if (Array.isArray(existing) && existing.length > 0) return existing[0];

  const totalPaid = numberOr(session.amount_total) / 100;
  return base44.asServiceRole.entities.StripeEventLog.create({
    stripe_event_id: event.id,
    event_type: event.type,
    category: 'revenue',
    priority: duplicate ? 'low' : 'high',
    processing_status: duplicate ? 'duplicate' : 'processed',
    duplicate_detected: duplicate,
    stripe_object_id: session.id,
    checkout_session_id: session.id,
    payment_intent_id: typeof session.payment_intent === 'string' ? session.payment_intent : session.payment_intent?.id || '',
    customer_id: typeof session.customer === 'string' ? session.customer : session.customer?.id || '',
    order_id: orderId,
    amount: totalPaid,
    currency: session.currency || 'aud',
    safe_summary: duplicate
      ? `Duplicate Stripe delivery skipped. Existing order ${orderId} remains authoritative.`
      : `Paid checkout captured automatically. Order ${orderId} created for session ${session.id}.`,
    records_created: duplicate ? '' : `MerchOrder:${orderId}`,
    records_updated: duplicate ? `MerchOrder:${orderId} unchanged` : '',
    received_at: new Date().toISOString(),
    processed_at: new Date().toISOString(),
    source_chain: duplicate
      ? 'Stripe -> stripeWebhook -> idempotency check -> duplicate skipped'
      : 'Stripe -> stripeWebhook -> checkout.session.completed -> MerchOrder',
  });
}

async function persistIdempotence(base44, sessionId, eventId, orderId) {
  const key = `stripe_checkout_session:${sessionId}`;
  const existing = await base44.asServiceRole.entities.IdempotenceLog.filter({ idempotence_key: key });
  if (Array.isArray(existing) && existing.length > 0) return existing[0];
  return base44.asServiceRole.entities.IdempotenceLog.create({
    idempotence_key: key,
    created_at: new Date().toISOString(),
    description: `Stripe checkout session ${sessionId} mapped to MerchOrder ${orderId}`,
    result: {
      status: 'processed',
      stripe_event_id: eventId,
      stripe_session_id: sessionId,
      order_id: orderId,
    },
  });
}

async function requestOrderProcessing(base44, orderId, eventId) {
  try {
    const response = await base44.asServiceRole.functions.invoke('onNewOrderAutomation', {
      orderId,
      stripeEventId: eventId,
      source: 'stripeWebhook',
    });
    return { success: true, response };
  } catch (error) {
    await createDiagnostic(base44, `Paid order ${orderId} needs post-payment processing`, {
      diagnostic_type: 'order_creation_failure',
      severity: 'critical',
      order_id: orderId,
      stripe_event_id: eventId,
      admin_message: `The paid order was stored, but stock or receipt processing did not complete: ${String(error?.message || error).slice(0, 500)}`,
      recommended_fix: 'Open the paid order, run the idempotent order processor, and confirm stock adjusted exactly once before fulfilment.',
      source_chain: 'Stripe -> stripeWebhook -> MerchOrder -> onNewOrderAutomation failed',
    });
    return { success: false, error: String(error?.message || error) };
  }
}

Deno.serve(async (req) => {
  const base44 = createClientFromRequest(req);
  const secretKey = String(Deno.env.get('STRIPE_SECRET_KEY') || '').trim();
  const webhookSecret = String(Deno.env.get('STRIPE_WEBHOOK_SECRET') || '').trim();
  const isLiveMode = secretKey.startsWith('sk_live_');

  if (!secretKey.startsWith('sk_')) {
    return Response.json({ error: 'Stripe is not configured.' }, { status: 500 });
  }

  let rawBody;
  try {
    rawBody = await req.text();
  } catch {
    return Response.json({ error: 'Unable to read webhook body.' }, { status: 400 });
  }

  const stripe = new Stripe(secretKey);
  const signature = req.headers.get('stripe-signature');
  let event;

  try {
    if (isLiveMode) {
      if (!webhookSecret) {
        return Response.json({ error: 'Live webhook signing secret is not configured.' }, { status: 500 });
      }
      if (!signature) {
        return Response.json({ error: 'Missing Stripe signature.' }, { status: 400 });
      }
      event = await stripe.webhooks.constructEventAsync(rawBody, signature, webhookSecret);
    } else if (webhookSecret && signature) {
      event = await stripe.webhooks.constructEventAsync(rawBody, signature, webhookSecret);
    } else {
      event = JSON.parse(rawBody);
    }
  } catch (error) {
    await createDiagnostic(base44, `stripeWebhook signature or payload verification failed: ${String(error?.message || error).slice(0, 240)}`, {
      diagnostic_type: 'webhook_signature_failure',
      severity: 'critical',
      admin_message: 'The webhook was rejected before any order or payment record was created.',
      recommended_fix: 'Verify the Stripe endpoint signing secret and endpoint URL. Do not rotate credentials without owner approval.',
      source_chain: 'Stripe -> stripeWebhook -> verification failed',
    });
    return Response.json({ error: 'Webhook verification failed.' }, { status: 400 });
  }

  if (event.type !== 'checkout.session.completed') {
    return Response.json({
      received: true,
      stripe_event_id: event.id,
      event_type: event.type,
      order_action: 'not_applicable',
    });
  }

  const session = event.data?.object;
  if (!session?.id) {
    return Response.json({ error: 'Checkout session is missing.' }, { status: 400 });
  }

  if (session.payment_status !== 'paid') {
    await createDiagnostic(base44, `Checkout session ${session.id} completed without paid status`, {
      diagnostic_type: 'webhook_failure',
      severity: 'high',
      checkout_session_id: session.id,
      stripe_event_id: event.id,
      admin_message: 'No paid order was created because Stripe did not mark the checkout as paid.',
      recommended_fix: 'Review the checkout session in Stripe before taking any fulfilment action.',
      source_chain: 'Stripe -> stripeWebhook -> checkout not paid',
    });
    return Response.json({ received: true, processed: false, reason: 'checkout_not_paid' });
  }

  const metadata = session.metadata || {};
  const belongsToThisStore = (
    session.mode === 'payment' &&
    String(session.currency || '').toLowerCase() === 'aud' &&
    metadata.checkout_policy === 'stage_one_owned_stock_v1' &&
    metadata.abn === '22931809349' &&
    Number(session.amount_total || 0) > 0
  );

  if (!belongsToThisStore) {
    return Response.json({
      received: true,
      processed: false,
      reason: 'checkout_not_owned_by_this_store',
    });
  }

  const items = parseJsonArray(metadata.items);
  const customerEmail = String(
    session.customer_details?.email || session.customer_email || metadata.customer_email || ''
  ).trim().toLowerCase();
  const customerName = String(metadata.customer_name || session.customer_details?.name || '').trim();

  if (items.length === 0 || !customerEmail || !customerName) {
    await createDiagnostic(base44, `Paid checkout ${session.id} has incomplete order metadata`, {
      diagnostic_type: 'payment_without_order',
      severity: 'critical',
      checkout_session_id: session.id,
      payment_intent_id: typeof session.payment_intent === 'string' ? session.payment_intent : '',
      stripe_event_id: event.id,
      amount: numberOr(session.amount_total) / 100,
      admin_message: 'Payment succeeded but the checkout cannot yet be converted into a complete order record.',
      recommended_fix: 'Review the Stripe checkout session and create the order from the verified line items. Do not charge the customer again.',
      source_chain: 'Stripe -> stripeWebhook -> incomplete paid metadata',
    });
    return Response.json({ error: 'Paid checkout has incomplete order metadata.' }, { status: 500 });
  }

  const existingOrders = await base44.asServiceRole.entities.MerchOrder.filter({
    stripe_session_id: session.id,
  });
  const existingOrder = (existingOrders || []).find(order =>
    order.status !== 'duplicate' && order.financial_status !== 'duplicate_void'
  );

  if (existingOrder) {
    try {
      await persistStripeEvent(base44, event, session, existingOrder.id, true);
      await persistIdempotence(base44, session.id, event.id, existingOrder.id);
    } catch (error) {
      return Response.json({ error: `Duplicate event persistence failed: ${error.message}` }, { status: 500 });
    }

    const postProcessing = existingOrder.inventory_adjusted
      ? { success: true, skipped: true }
      : await requestOrderProcessing(base44, existingOrder.id, event.id);

    return Response.json({
      received: true,
      duplicate: true,
      order_id: existingOrder.id,
      post_processing: postProcessing.success ? 'complete_or_queued' : 'needs_attention',
    });
  }

  const subtotal = numberOr(metadata.subtotal_amount_aud, items.reduce((sum, item) =>
    sum + numberOr(item.price) * numberOr(item.quantity, 1), 0
  ));
  const shipping = numberOr(metadata.shipping_amount_aud);
  const paidTotal = numberOr(session.amount_total) / 100;
  const expectedTotal = subtotal + shipping;
  const totalMismatch = Math.abs(paidTotal - expectedTotal) > 0.01;

  let order;
  try {
    order = await base44.asServiceRole.entities.MerchOrder.create({
      customer_name: customerName,
      customer_email: customerEmail,
      shipping_address: formatAddress(session, metadata),
      items: items.map(item => ({
        product_id: String(item.product_id || ''),
        product_name: String(item.product_name || ''),
        size: String(item.size || ''),
        quantity: numberOr(item.quantity, 1),
        price: numberOr(item.price),
        category: String(item.category || ''),
        recorded_unit_cost: numberOr(item.recorded_unit_cost),
        recorded_packaging_cost: numberOr(item.recorded_packaging_cost),
      })),
      total_amount: paidTotal,
      subtotal_amount: subtotal,
      shipping_amount: shipping,
      discount_amount: 0,
      support_contribution: 0,
      gst_amount: 0,
      abn: '22931809349',
      shipping_rule_id: String(metadata.shipping_rule_id || ''),
      shipping_rule_name: String(metadata.shipping_rule_name || ''),
      checkout_policy: String(metadata.checkout_policy || 'stage_one_owned_stock_v1'),
      order_source: 'stripe_webhook',
      stripe_event_id: event.id,
      stripe_session_id: session.id,
      stripe_payment_intent: typeof session.payment_intent === 'string' ? session.payment_intent : session.payment_intent?.id || '',
      payment_status: 'paid',
      status: totalMismatch ? 'needs_admin_review' : 'confirmed',
      financial_status: totalMismatch ? 'captured_total_mismatch_review' : 'captured',
      fulfillment_status: 'unfulfilled',
      inventory_adjusted: false,
      profit_status: 'pending_costs',
      receipt_sent: false,
      receipt_status: 'not_attempted',
      admin_notification_sent: false,
      admin_notification_status: 'not_attempted',
      ledger_sync_status: 'not_attempted',
      excluded_from_1800respect_donation: true,
      notes: [
        `Stripe event: ${event.id}`,
        `Stripe session: ${session.id}`,
        `Checkout policy: ${metadata.checkout_policy || 'stage_one_owned_stock_v1'}`,
        totalMismatch ? `WARNING: paid total ${paidTotal.toFixed(2)} differs from metadata total ${expectedTotal.toFixed(2)}` : null,
      ].filter(Boolean).join(' | '),
    });
  } catch (error) {
    await createDiagnostic(base44, `Paid order creation failed for session ${session.id}`, {
      diagnostic_type: 'payment_without_order',
      severity: 'critical',
      checkout_session_id: session.id,
      payment_intent_id: typeof session.payment_intent === 'string' ? session.payment_intent : '',
      stripe_event_id: event.id,
      amount: paidTotal,
      admin_message: `Stripe recorded a paid checkout, but MerchOrder creation failed: ${String(error?.message || error).slice(0, 500)}`,
      recommended_fix: 'Create the order from this Stripe session and do not charge the customer again.',
      source_chain: 'Stripe -> stripeWebhook -> MerchOrder create failed',
    });
    return Response.json({ error: 'Paid order creation failed.' }, { status: 500 });
  }

  try {
    await persistStripeEvent(base44, event, session, order.id, false);
    await persistIdempotence(base44, session.id, event.id, order.id);
  } catch {
    await createDiagnostic(base44, `Canonical event persistence failed after order ${order.id}`, {
      diagnostic_type: 'webhook_failure',
      severity: 'critical',
      order_id: order.id,
      stripe_event_id: event.id,
      checkout_session_id: session.id,
      admin_message: 'The order exists, but the canonical Stripe event or idempotence record did not persist.',
      recommended_fix: 'Retry the Stripe event after checking that the existing order remains the only active order for the session.',
      source_chain: 'Stripe -> stripeWebhook -> canonical persistence failed',
    });
    return Response.json({ error: 'Canonical event persistence failed.' }, { status: 500 });
  }

  const postProcessing = await requestOrderProcessing(base44, order.id, event.id);

  return Response.json({
    received: true,
    order_id: order.id,
    stripe_event_id: event.id,
    post_processing: postProcessing.success ? 'complete_or_queued' : 'needs_attention',
  });
});
