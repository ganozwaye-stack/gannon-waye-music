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

      // === EMAIL CAPTURE: prefer Stripe-collected email over any pre-supplied email ===
      const customerEmail =
        session.customer_details?.email ||
        session.customer_email ||
        meta.customer_email ||
        '';
      const emailMissing = !customerEmail;

      // === DISCOUNT DATA CAPTURE from Stripe session ===
      let discountData = null;
      let promotionCodeUsed = null;
      let couponId = null;
      let discountAmountTotal = 0;

      if (session.total_details?.amount_discount > 0) {
        discountAmountTotal = session.total_details.amount_discount / 100;
      }

      // Retrieve full session with discounts expanded if possible
      try {
        const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY'));
        const fullSession = await stripe.checkout.sessions.retrieve(session.id, {
          expand: ['total_details.breakdown'],
        });
        const discounts = fullSession.total_details?.breakdown?.discounts || [];
        if (discounts.length > 0) {
          const d = discounts[0];
          couponId = d.discount?.coupon?.id || null;
          promotionCodeUsed = d.discount?.promotion_code || null;
          discountData = {
            coupon_id: couponId,
            promotion_code_id: typeof promotionCodeUsed === 'string' ? promotionCodeUsed : promotionCodeUsed?.id || null,
            discount_amount_aud: discountAmountTotal,
            breakdown_note: discounts.length > 1 ? 'MULTIPLE_DISCOUNTS' : 'SINGLE_DISCOUNT',
          };
        }
      } catch (_) {
        // If expand fails, store what we have
        if (discountAmountTotal > 0) {
          discountData = {
            discount_amount_aud: discountAmountTotal,
            breakdown_note: 'LIMITED_BY_STRIPE_DATA',
          };
        }
      }

      // === ORDER RECORD CREATION ===
      const orderData = {
        customer_name: meta.customer_name || session.customer_details?.name || '',
        customer_email: customerEmail,
        shipping_address: meta.shipping_address || '',
        items: [{
          product_id: meta.product_id || '',
          product_name: meta.product_name || '',
          size: meta.size || '',
          quantity: parseInt(meta.quantity || '1', 10),
          price: parseFloat(meta.sale_price || '0'),
        }],
        total_amount: (session.amount_total || 0) / 100,
        promo_code: discountData?.promotion_code_id || meta.promo_code || null,
        stripe_session_id: session.id,
        stripe_payment_intent: session.payment_intent || '',
        status: emailMissing ? 'needs_admin_review' : 'confirmed',
        payment_status: 'paid',
        notes: [
          `Stripe Checkout Session: ${session.id}`,
          discountData ? `Discount: $${discountAmountTotal.toFixed(2)} AUD | Coupon: ${discountData.coupon_id || 'n/a'} | PromoCode: ${discountData.promotion_code_id || 'n/a'}` : null,
          discountData?.breakdown_note === 'LIMITED_BY_STRIPE_DATA' ? 'WARNING: Discount breakdown limited by Stripe data' : null,
          emailMissing ? 'WARNING: Customer email missing — needs_admin_review' : null,
          meta.product_category ? `Category: ${meta.product_category}` : null,
          meta.shipping_amount ? `Shipping: $${meta.shipping_amount} AUD` : null,
          meta.add_support ? `Support contribution: $${meta.add_support} AUD` : null,
          `source_chain: stripeWebhook:checkout.session.completed`,
        ].filter(Boolean).join(' | '),
      };

      try {
        await base44.asServiceRole.entities.MerchOrder.create(orderData);
      } catch (orderErr) {
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

      // Flag missing email as admin action required
      if (emailMissing) {
        try {
          await base44.asServiceRole.entities.AdminNotification.create({
            notification_type: 'payment_warning',
            severity: 'warning',
            title: 'Order missing customer email',
            summary: `Session ${session.id} completed but no customer email captured. Order marked needs_admin_review.`,
            requires_action: true,
            linked_route: '/admin/orders',
            source: 'stripeWebhook',
          });
        } catch {}
      }

      // Admin notification
      try {
        await base44.asServiceRole.entities.AdminNotification.create({
          notification_type: 'order',
          severity: 'info',
          title: `New order — ${meta.product_name || 'Store purchase'}`,
          summary: `${meta.customer_name || 'Customer'} paid $${((session.amount_total || 0) / 100).toFixed(2)} AUD${discountAmountTotal > 0 ? ` (discount: $${discountAmountTotal.toFixed(2)})` : ''}`,
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