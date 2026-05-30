/**
 * recoverStripeOrders
 *
 * Admin-only recovery tool.
 * Scans recent Stripe checkout sessions and identifies any that succeeded
 * but do not have a matching MerchOrder in the database.
 *
 * Use this to recover orders missed during the webhook failure window
 * (May 26 – resolved date).
 *
 * POST body:
 *   { action: 'scan' }          — list missing orders (no DB writes)
 *   { action: 'recover', session_id: 'cs_...' } — recover one order (admin-approved)
 */

import Stripe from 'npm:stripe@14.21.0';
import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  const base44 = createClientFromRequest(req);

  // Admin-only
  let user;
  try {
    user = await base44.auth.me();
  } catch (_) {}

  if (!user || user.role !== 'admin') {
    return Response.json({ error: 'Admin access required' }, { status: 403 });
  }

  const secretKey = Deno.env.get('STRIPE_SECRET_KEY');
  if (!secretKey) {
    return Response.json({ error: 'STRIPE_SECRET_KEY not configured' }, { status: 500 });
  }

  const stripe = new Stripe(secretKey);
  const body = await req.json().catch(() => ({}));
  const { action, session_id, limit = 50 } = body;

  // ── SCAN: list Stripe sessions that have no MerchOrder ──
  if (!action || action === 'scan') {
    let stripeSessions = [];
    try {
      const result = await stripe.checkout.sessions.list({
        limit: Math.min(limit, 100),
        status: 'complete',
      });
      stripeSessions = result.data || [];
    } catch (e) {
      return Response.json({ error: `Failed to list Stripe sessions: ${e.message}` }, { status: 500 });
    }

    // Compare against MerchOrder records
    const missing = [];
    const found = [];

    for (const session of stripeSessions) {
      let orderExists = false;
      try {
        const orders = await base44.asServiceRole.entities.MerchOrder.filter({ stripe_session_id: session.id });
        orderExists = orders && orders.length > 0;
      } catch (_) {}

      const meta = session.metadata || {};
      const sessionData = {
        session_id: session.id,
        payment_intent: session.payment_intent,
        amount_total: (session.amount_total || 0) / 100,
        currency: session.currency || 'aud',
        customer_email: session.customer_email || session.customer_details?.email || '',
        customer_name: meta.customer_name || session.customer_details?.name || '',
        items_summary: meta.items ? (() => {
          try {
            const items = JSON.parse(meta.items);
            return items.map(i => `${i.product_name} ×${i.quantity}`).join(', ');
          } catch { return meta.product_name || 'Unknown'; }
        })() : (meta.product_name || 'Unknown'),
        created: new Date(session.created * 1000).toISOString(),
        order_exists: orderExists,
        promo_code: meta.promo_code || '',
        shipping_address: meta.shipping_address || '',
      };

      if (orderExists) {
        found.push(sessionData);
      } else {
        missing.push(sessionData);
      }
    }

    return Response.json({
      scanned: stripeSessions.length,
      orders_found: found.length,
      orders_missing: missing.length,
      missing_sessions: missing,
      found_sessions: found,
      recovery_needed: missing.length > 0,
      stripe_mode: secretKey.startsWith('sk_live_') ? 'live' : 'test',
      scan_timestamp: new Date().toISOString(),
    });
  }

  // ── RECOVER: create MerchOrder from a specific Stripe session ──
  if (action === 'recover' && session_id) {
    // Idempotency check
    try {
      const existing = await base44.asServiceRole.entities.MerchOrder.filter({ stripe_session_id: session_id });
      if (existing && existing.length > 0) {
        return Response.json({
          success: false,
          reason: 'order_already_exists',
          message: `MerchOrder already exists for session ${session_id}`,
          order_id: existing[0].id,
        });
      }
    } catch (_) {}

    // Fetch full session from Stripe
    let session;
    try {
      session = await stripe.checkout.sessions.retrieve(session_id, {
        expand: ['line_items'],
      });
    } catch (e) {
      return Response.json({ error: `Failed to retrieve session: ${e.message}` }, { status: 500 });
    }

    if (session.payment_status !== 'paid') {
      return Response.json({
        success: false,
        reason: 'not_paid',
        message: `Session ${session_id} payment_status is "${session.payment_status}" — not recovering unpaid session`,
      });
    }

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
        items: cartItems.map(item => ({
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
          `RECOVERED by admin on ${new Date().toISOString()}`,
          `Stripe Session: ${session.id}`,
          `Original session created: ${new Date(session.created * 1000).toISOString()}`,
          meta.promo_code ? `Promo: ${meta.promo_code}` : null,
          `source_chain: recoverStripeOrders → admin_recovery`,
        ].filter(Boolean).join(' | '),
      });
      orderId = order?.id;
    } catch (e) {
      return Response.json({ error: `Order creation failed: ${e.message}` }, { status: 500 });
    }

    // Log the recovery
    try {
      await base44.asServiceRole.entities.StripeEventLog.create({
        stripe_event_id: `recovery_${session.id}_${Date.now()}`,
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
        currency: 'aud',
        safe_summary: `RECOVERED ORDER — ${meta.customer_name || 'Customer'} $${totalPaid.toFixed(2)} — session ${session.id}`,
        records_created: `MerchOrder:${orderId}`,
        received_at: new Date().toISOString(),
        processed_at: new Date().toISOString(),
        source_chain: 'recoverStripeOrders → admin_manual_recovery',
      });
    } catch (_) {}

    // Admin notification
    try {
      await base44.asServiceRole.entities.AdminNotification.create({
        notification_type: 'order',
        severity: 'warning',
        title: `RECOVERED order — $${totalPaid.toFixed(2)} AUD`,
        summary: `Order recovered for ${meta.customer_name || customerEmail}. Session: ${session.id}. Recovered at ${new Date().toISOString()}.`,
        requires_action: true,
        linked_route: '/admin/orders',
        linked_entity: 'MerchOrder',
        linked_id: orderId || '',
        source: 'recoverStripeOrders',
      });
    } catch (_) {}

    return Response.json({
      success: true,
      order_id: orderId,
      session_id: session.id,
      customer_email: customerEmail,
      amount: totalPaid,
      items: cartItems,
      recovered_at: new Date().toISOString(),
      message: `Order successfully recovered from Stripe session ${session.id}`,
    });
  }

  return Response.json({ error: 'Invalid action. Use: scan, recover' }, { status: 400 });
});