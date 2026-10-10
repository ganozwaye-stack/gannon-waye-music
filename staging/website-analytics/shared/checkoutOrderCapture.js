import {orderAttribution} from './websiteAnalyticsPolicy.js';
/**
 * Shared checkout-order capture pipeline.
 *
 * The single source of truth for converting a verified paid Stripe checkout
 * session into a MerchOrder. Used by both capture paths:
 *   - stripeWebhook      (push: the checkout.session.completed webhook event)
 *   - verifyCheckoutSession (pull: the checkout success page, which Stripe
 *     always redirects the customer back to, so capture is guaranteed even
 *     when webhook delivery fails)
 *
 * Callers MUST have already verified:
 *   - the session belongs to this store (mode/currency/policy/ABN/amount),
 *   - the session payment_status is 'paid'.
 *
 * Guarantees (inherited from the original webhook implementation):
 * 1. A checkout session can create only one active order (pre-check plus a
 *    post-create concurrent-capture guard that voids any extra).
 * 2. The paid order and the canonical Stripe event are stored before the
 *    caller reports success.
 * 3. GST is recorded as zero while the business is not GST registered.
 * 4. Inventory and customer communication are delegated to the idempotent
 *    order processor (onNewOrderAutomation).
 */

export function parseJsonArray(value) {
  try {
    const parsed = typeof value === 'string' ? JSON.parse(value) : value;
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function numberOr(value, fallback = 0) {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
}

export function formatAddress(session, metadata) {
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

export async function createDiagnostic(base44, issueSummary, extra = {}) {
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

export async function listOrdersForSession(base44, sessionId) {
  try {
    const orders = await base44.asServiceRole.entities.MerchOrder.filter({
      stripe_session_id: sessionId,
    });
    return Array.isArray(orders) ? orders : [];
  } catch {
    return [];
  }
}

export function findActiveOrder(orders) {
  return (orders || []).find(order =>
    order.status !== 'duplicate' && order.financial_status !== 'duplicate_void'
  ) || null;
}

export async function persistStripeEvent(base44, event, session, orderId, duplicate, sourceChainPrefix = 'Stripe -> stripeWebhook') {
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
      ? `${sourceChainPrefix} -> idempotency check -> duplicate skipped`
      : `${sourceChainPrefix} -> checkout.session.completed -> MerchOrder`,
  });
}

export async function persistIdempotence(base44, sessionId, eventId, orderId) {
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

export async function requestOrderProcessing(base44, orderId, eventId, source = 'stripeWebhook') {
  try {
    const response = await base44.asServiceRole.functions.invoke('onNewOrderAutomation', {
      orderId,
      stripeEventId: eventId,
      source,
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
      source_chain: `${source} -> onNewOrderAutomation failed`,
    });
    return { success: false, error: String(error?.message || error) };
  }
}

/**
 * notifyOwnerOfNewOrder
 *
 * One newly captured paid order: an in-app admin notification (bell, badge,
 * chime) plus a Slack push, so the owner can stay on top of shipping.
 * Failure here never blocks order capture; the order fields record the
 * notification outcome.
 */
export async function notifyOwnerOfNewOrder(base44, order) {
  const items = Array.isArray(order.items) ? order.items : [];
  const units = items.reduce((sum, item) => sum + numberOr(item.quantity, 1), 0);
  const lines = items
    .map(item => `${numberOr(item.quantity, 1)} x ${item.product_name}${item.size ? ` (size ${item.size})` : ''}`)
    .join('\\n• ');
  const total = numberOr(order.total_amount).toFixed(2);
  const title = `New merch order: ${order.customer_name}`;
  const summary = `$${total} · ${units} item${units === 1 ? '' : 's'} · ${order.customer_email}`;

  let slackDelivered = false;
  try {
    const res = await base44.asServiceRole.functions.invoke('sendSlackAlert', {
      title: 'New Merch Order',
      urgency: 'high',
      category: 'order',
      message: `New paid merch order from *${order.customer_name}* — $${total}. Ready to ship.`,
      fields: [
        { label: 'Customer', value: `${order.customer_name}\\n${order.customer_email}` },
        { label: 'Items', value: `• ${lines || 'See order'}` },
        { label: 'Ship to', value: order.shipping_address || 'See order' },
      ],
      action_url: 'https://gannonwaye.base44.app/admin/merch-designs',
    });
    const body = res && res.data ? res.data : res;
    slackDelivered = Boolean(body && body.success);
  } catch {
    slackDelivered = false;
  }

  try {
    await base44.asServiceRole.entities.AdminNotification.create({
      notification_type: 'order',
      severity: 'high',
      title,
      summary,
      source: 'store_checkout',
      requires_action: true,
      linked_entity: 'MerchOrder',
      linked_id: order.id,
      linked_route: '/admin/merch-designs',
      delivered_slack: slackDelivered,
    });
  } catch {}

  try {
    await base44.asServiceRole.entities.MerchOrder.update(order.id, {
      admin_notification_sent: true,
      admin_notification_status: 'created',
    });
  } catch {}
}

/**
 * captureOrderFromSession
 *
 * Converts one paid, store-owned Stripe checkout session into a MerchOrder,
 * idempotently. Returns a result object; never throws for expected failures
 * (a critical PaymentDiagnostic is recorded inside instead).
 *
 * Outcomes:
 *  - 'incomplete_metadata'  the paid session cannot become a complete order yet
 *  - 'duplicate'           an active order already exists (or won a concurrent
 *                          race); nothing new was created
 *  - 'created'             the order was created and canonical records stored
 *  - 'create_failed'        order creation failed
 *  - 'persistence_failed'   the order exists but the canonical event record
 *                          did not persist
 *
 * Options:
 *  - orderSource          value stored on the MerchOrder order_source field
 *  - processorSource      source label passed to the idempotent order processor
 *  - sourceChainPrefix    prefix used in diagnostics and event-log chains
 *  - process              when true, the order processor runs before returning
 *                         (webhook behaviour); when false the caller fires it
 *                         in the background (success-page behaviour)
 *  - persistDuplicateEvent when true, a duplicate delivery still persists the
 *                         event and idempotence records (webhook behaviour)
 */
export async function captureOrderFromSession({
  base44,
  session,
  event,
  orderSource = 'stripe_webhook',
  processorSource = 'stripeWebhook',
  sourceChainPrefix = 'Stripe -> stripeWebhook',
  process = true,
  persistDuplicateEvent = true,
}) {
  const metadata = session.metadata || {};
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
      source_chain: `${sourceChainPrefix} -> incomplete paid metadata`,
    });
    return { outcome: 'incomplete_metadata' };
  }

  const existingOrder = findActiveOrder(await listOrdersForSession(base44, session.id));
  if (existingOrder) {
    if (persistDuplicateEvent) {
      try {
        await persistStripeEvent(base44, event, session, existingOrder.id, true, sourceChainPrefix);
        await persistIdempotence(base44, session.id, event.id, existingOrder.id);
      } catch (error) {
        return { outcome: 'persistence_failed', stage: 'duplicate_persist', error: String(error?.message || error) };
      }
    }

    const postProcessing = existingOrder.inventory_adjusted
      ? { success: true, skipped: true }
      : await requestOrderProcessing(base44, existingOrder.id, event.id, processorSource);

    return { outcome: 'duplicate', order: existingOrder, postProcessing };
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
      order_source: orderSource,
      stripe_event_id: event.id,
      stripe_session_id: session.id,
      stripe_payment_intent: typeof session.payment_intent === 'string' ? session.payment_intent : session.payment_intent?.id || '',
      payment_status: 'paid',
      attribution: orderAttribution(metadata),
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
      source_chain: `${sourceChainPrefix} -> MerchOrder create failed`,
    });
    return { outcome: 'create_failed' };
  }

  // Concurrent-capture guard: the webhook and the checkout success page can
  // race on the same session. If another active order slipped in, keep the
  // earliest and void the rest, exactly like the owner-approved duplicate
  // recovery flow, so a session never has two active orders.
  const activeAfterCreate = (await listOrdersForSession(base44, session.id))
    .filter(o => o.status !== 'duplicate' && o.financial_status !== 'duplicate_void');
  if (activeAfterCreate.length > 1) {
    const sorted = activeAfterCreate.slice().sort((a, b) =>
      new Date(a.created_date || 0) - new Date(b.created_date || 0)
    );
    const keep = sorted[0];
    for (const extra of sorted.slice(1)) {
      try {
        await base44.asServiceRole.entities.MerchOrder.update(extra.id, {
          status: 'duplicate',
          financial_status: 'duplicate_void',
          fulfillment_status: 'do_not_ship',
          duplicate_of_order_id: keep.id,
          excluded_from_revenue: true,
          excluded_from_inventory: true,
          excluded_from_profit: true,
          excluded_from_1800respect_donation: true,
          admin_note: `Concurrent capture of session ${session.id} detected via ${sourceChainPrefix}; voided so a single active order remains.`,
        });
      } catch {}
    }
    const postProcessing = keep.inventory_adjusted
      ? { success: true, skipped: true }
      : await requestOrderProcessing(base44, keep.id, event.id, processorSource);
    return { outcome: 'duplicate', order: keep, postProcessing };
  }

  try {
    await persistStripeEvent(base44, event, session, order.id, false, sourceChainPrefix);
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
      source_chain: `${sourceChainPrefix} -> canonical persistence failed`,
    });
    return { outcome: 'persistence_failed', stage: 'canonical_persist' };
  }

  // Owner alert: every newly placed order rings the bell and pushes to Slack.
  await notifyOwnerOfNewOrder(base44, order);

  const postProcessing = process
    ? await requestOrderProcessing(base44, order.id, event.id, processorSource)
    : null;

  return { outcome: 'created', order, postProcessing };
}