/**
 * reconcileStripeOrders
 *
 * Scheduled-safe money reconciliation. The primary webhook (stripeWebhook)
 * creates orders when Stripe delivers events, but webhooks can be delayed or
 * dropped. This function scans recent PAID Stripe checkout sessions directly
 * and creates a MerchOrder for any paid session that has no active order.
 *
 * Guarantees:
 *  - Idempotent: skips any session that already has an active MerchOrder.
 *  - Create-only: never modifies, voids or deletes existing records.
 *  - Bounded: only looks at sessions from the last 30 days.
 *
 * Runs every 6 hours via the "Retry failed Stripe events" workflow
 * (repurposed as the Stripe reconciliation safety net).
 */

import Stripe from 'npm:stripe@14.21.0';
import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  const base44 = createClientFromRequest(req);

  const secretKey = (Deno.env.get('STRIPE_SECRET_KEY') || '').trim();
  if (!secretKey.startsWith('sk_')) {
    return Response.json({ error: 'STRIPE_SECRET_KEY not configured' }, { status: 500 });
  }

  const stripe = new Stripe(secretKey);
  const thirtyDaysAgo = Math.floor(Date.now() / 1000) - 30 * 24 * 60 * 60;

  let sessions = [];
  try {
    const result = await stripe.checkout.sessions.list({
      limit: 100,
      status: 'complete',
      created: { gte: thirtyDaysAgo },
    });
    sessions = result.data || [];
  } catch (e) {
    return Response.json({ error: `Failed to list Stripe sessions: ${e.message}` }, { status: 500 });
  }

  const recovered = [];
  const alreadyTracked = [];

  for (const session of sessions) {
    if (session.payment_status !== 'paid') continue;

    // Idempotency: any active (non-void) order for this session means it is
    // already tracked — skip. Duplicate-voided orders do not count as active.
    let existing = [];
    try {
      existing = await base44.asServiceRole.entities.MerchOrder.filter({
        stripe_session_id: session.id,
      }) || [];
    } catch (_) {}

    const active = existing.filter(
      (o) => o.status !== 'duplicate' && o.financial_status !== 'duplicate_void'
    );
    if (active.length > 0) {
      alreadyTracked.push(session.id);
      continue;
    }

    // Paid session with no active order — reconcile it.
    const meta = session.metadata || {};
    const customerEmail = session.customer_email || session.customer_details?.email || meta.customer_email || '';
    const totalPaid = (session.amount_total || 0) / 100;

    let cartItems = [];
    try {
      if (meta.items) cartItems = JSON.parse(meta.items);
    } catch (_) {}
    if (cartItems.length === 0 && meta.product_id) {
      cartItems = [{
        product_id: meta.product_id,
        product_name: meta.product_name || '',
        price: parseFloat(meta.sale_price || '0'),
        quantity: parseInt(meta.quantity || '1', 10),
        size: meta.size || '',
        category: meta.product_category || '',
      }];
    }

    let orderId = null;
    try {
      const order = await base44.asServiceRole.entities.MerchOrder.create({
        customer_name: meta.customer_name || session.customer_details?.name || '',
        customer_email: customerEmail,
        shipping_address: meta.shipping_address || '',
        items: cartItems.map((item) => ({
          product_id: item.product_id || '',
          product_name: item.product_name || '',
          size: item.size || '',
          quantity: item.quantity || 1,
          price: item.price || 0,
          category: item.category || '',
        })),
        total_amount: totalPaid,
        promo_code: meta.promo_code || null,
        discount_amount: parseFloat(meta.discount_amount || '0'),
        shipping_amount: parseFloat(meta.shipping_amount_aud || '0'),
        stripe_session_id: session.id,
        stripe_payment_intent: session.payment_intent || '',
        status: 'confirmed',
        payment_status: 'paid',
        notes: [
          `RECONCILED by scheduled reconciliation on ${new Date().toISOString()}`,
          `Stripe Session: ${session.id}`,
          `Original session created: ${new Date(session.created * 1000).toISOString()}`,
          meta.promo_code ? `Promo: ${meta.promo_code}` : null,
          'source_chain: reconcileStripeOrders → scheduled_reconciliation',
        ].filter(Boolean).join(' | '),
      });
      orderId = order?.id;
    } catch (e) {
      // Log the failure but keep scanning — one bad session must not stop
      // the rest of the reconciliation.
      try {
        await base44.asServiceRole.entities.PaymentDiagnostic.create({
          diagnostic_type: 'reconciliation_failed',
          severity: 'high',
          status: 'open',
          checkout_session_id: session.id,
          amount: totalPaid,
          currency: session.currency || 'aud',
          issue_summary: `Reconciliation could not create order for paid session ${session.id}: ${e.message}`,
          admin_message: `A paid Stripe session ($${totalPaid.toFixed(2)}) has no order and automatic reconciliation failed. Recover manually via /admin/payment-diagnostics.`,
          recommended_fix: 'Use the order recovery scan in /admin/payment-diagnostics.',
          webhook_processed: false,
          source_chain: 'reconcileStripeOrders → order_create_failed',
        });
      } catch (_) {}
      continue;
    }

    recovered.push({ session_id: session.id, order_id: orderId, amount: totalPaid });

    // Audit log entry — one row per reconciliation, visible in the inbox.
    try {
      await base44.asServiceRole.entities.StripeEventLog.create({
        stripe_event_id: `reconciliation_${session.id}_${Date.now()}`,
        event_type: 'checkout.session.completed',
        category: 'revenue',
        priority: 'high',
        processing_status: 'processed',
        stripe_object_id: session.id,
        checkout_session_id: session.id,
        payment_intent_id: session.payment_intent || '',
        customer_id: customerEmail,
        order_id: orderId || '',
        amount: totalPaid,
        currency: session.currency || 'aud',
        safe_summary: `RECONCILED ORDER — ${meta.customer_name || customerEmail} $${totalPaid.toFixed(2)} — session ${session.id}`,
        records_created: `MerchOrder:${orderId}`,
        received_at: new Date().toISOString(),
        processed_at: new Date().toISOString(),
        source_chain: 'reconcileStripeOrders → scheduled_reconciliation',
      });
    } catch (_) {}

    // The owner needs to know whenever the safety net had to catch something.
    try {
      await base44.asServiceRole.entities.AdminNotification.create({
        notification_type: 'order',
        severity: 'warning',
        title: `Reconciliation caught a missed order — $${totalPaid.toFixed(2)} AUD`,
        summary: `Paid session ${session.id} had no order. It was reconciled automatically for ${meta.customer_name || customerEmail}. If this happens often, the webhook chain needs attention.`,
        requires_action: true,
        linked_route: '/admin/orders',
        linked_entity: 'MerchOrder',
        linked_id: orderId || '',
        source: 'reconcileStripeOrders',
      });
    } catch (_) {}
  }

  return Response.json({
    scanned_sessions: sessions.length,
    paid_sessions: alreadyTracked.length + recovered.length,
    already_tracked: alreadyTracked.length,
    recovered_orders: recovered.length,
    recovered: recovered,
    stripe_mode: secretKey.startsWith('sk_live_') ? 'live' : 'test',
    reconciled_at: new Date().toISOString(),
  });
});