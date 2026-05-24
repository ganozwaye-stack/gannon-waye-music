import Stripe from 'npm:stripe@14.21.0';
import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const secretKey = Deno.env.get('STRIPE_SECRET_KEY');
    const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET');

    if (!secretKey || !secretKey.startsWith('sk_')) {
      return Response.json({ error: 'Stripe not configured' }, { status: 500 });
    }

    const stripe = new Stripe(secretKey);
    const body = await req.text();
    const signature = req.headers.get('stripe-signature');

    let event;
    if (webhookSecret && signature) {
      try {
        event = await stripe.webhooks.constructEventAsync(body, signature, webhookSecret);
      } catch (err) {
        return Response.json({ error: 'Webhook signature failed' }, { status: 400 });
      }
    } else {
      // No webhook secret configured — parse raw body (dev/test mode)
      event = JSON.parse(body);
    }

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      const base44 = createClientFromRequest(req);
      const meta = session.metadata || {};

      // Create order record
      try {
        await base44.asServiceRole.entities.MerchOrder.create({
          customer_name: meta.customer_name || session.customer_details?.name || '',
          customer_email: session.customer_email || session.customer_details?.email || '',
          shipping_address: meta.shipping_address || '',
          items: [{
            product_id: meta.product_id || '',
            product_name: meta.product_name || '',
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
          notes: `Stripe Checkout Session: ${session.id}${meta.promo_code ? ` | Promo: ${meta.promo_code}` : ''}`,
        });
      } catch (orderErr) {
        // Log failure as admin notification
        try {
          await base44.asServiceRole.entities.AdminNotification.create({
            notification_type: 'payment_warning',
            severity: 'high',
            title: 'Order creation failed after payment',
            summary: `Payment succeeded (${session.id}) but order record creation failed: ${orderErr.message}`,
            requires_action: true,
            linked_route: '/admin/payment-diagnostics',
            source: 'stripeWebhook',
          });
        } catch {}
      }

      // Record promo usage if applicable
      if (meta.promo_id) {
        try {
          await base44.asServiceRole.entities.PromoCode.update(meta.promo_id, {
            times_used: { $increment: 1 },
          });
        } catch {}
      }

      // Admin notification
      try {
        await base44.asServiceRole.entities.AdminNotification.create({
          notification_type: 'order',
          severity: 'info',
          title: `New order — ${meta.product_name || 'Store purchase'}`,
          summary: `${meta.customer_name || 'Customer'} paid $${((session.amount_total || 0) / 100).toFixed(2)} AUD`,
          requires_action: true,
          linked_route: '/admin/orders',
          source: 'stripeWebhook',
        });
      } catch {}
    }

    if (event.type === 'checkout.session.expired') {
      const session = event.data.object;
      const base44 = createClientFromRequest(req);
      try {
        await base44.asServiceRole.entities.AdminNotification.create({
          notification_type: 'payment_warning',
          severity: 'warning',
          title: 'Checkout session expired',
          summary: `Customer did not complete checkout. Session: ${session.id}`,
          requires_action: false,
          linked_route: '/admin/payment-diagnostics',
          source: 'stripeWebhook',
        });
      } catch {}
    }

    if (event.type === 'payment_intent.payment_failed') {
      const pi = event.data.object;
      const base44 = createClientFromRequest(req);
      try {
        await base44.asServiceRole.entities.AdminNotification.create({
          notification_type: 'payment_warning',
          severity: 'warning',
          title: 'Payment failed',
          summary: `PaymentIntent ${pi.id} failed: ${pi.last_payment_error?.message || 'Unknown error'}`,
          requires_action: false,
          linked_route: '/admin/payment-diagnostics',
          source: 'stripeWebhook',
        });
      } catch {}
    }

    return Response.json({ received: true });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});