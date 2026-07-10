import Stripe from 'npm:stripe@14.21.0';
import { createClientFromRequest } from 'npm:@base44/sdk@0.8.30';

const ALWAYS_INELIGIBLE_CATEGORIES = [
  'cd', 'vinyl', 'song', 'digital', 'support', 'donation', 'shipping',
  'processing', 'fees', 'music', 'limited_edition_music', 'digital_music',
];

function isCategoryEligibleForDiscount(category) {
  if (!category) return true;
  const cat = category.toLowerCase().trim();
  return !ALWAYS_INELIGIBLE_CATEGORIES.some(c => cat.includes(c));
}

Deno.serve(async (req) => {
  // CRITICAL: Create base44 client BEFORE reading body stream.
  // Deno's Request body can only be read once. createClientFromRequest reads headers only,
  // but must be called before req.text() to avoid any internal body consumption issues.
  const base44 = createClientFromRequest(req);

  const secretKey = Deno.env.get('STRIPE_SECRET_KEY');
  const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET');

  if (!secretKey || !secretKey.startsWith('sk_')) {
    return Response.json({ error: 'Stripe not configured' }, { status: 500 });
  }

  const isLiveMode = secretKey.startsWith('sk_live_');
  if (isLiveMode && !webhookSecret) {
    try {
      await base44.asServiceRole.entities.PaymentDiagnostic.create({
        diagnostic_type: 'webhook_failure',
        severity: 'critical',
        status: 'open',
        issue_summary: 'STRIPE_WEBHOOK_SECRET missing for live Stripe webhook',
        admin_message: 'Live Stripe webhook rejected because STRIPE_WEBHOOK_SECRET is missing. This prevents accepting unverified live payment events.',
        recommended_fix: 'Open Stripe Dashboard → Developers → Webhooks → stripeWebhook endpoint → Reveal signing secret → update STRIPE_WEBHOOK_SECRET in Base44 Secrets.',
        webhook_processed: false,
        source_chain: 'Stripe → stripeWebhook → live_signature_required',
      });
    } catch (_) {}
    return Response.json({ error: 'Stripe webhook signing secret required for live mode' }, { status: 500 });
  }

  // Read raw body AFTER SDK client creation
  let body;
  try {
    body = await req.text();
  } catch (e) {
    return Response.json({ error: 'Failed to read body' }, { status: 400 });
  }

  const signature = req.headers.get('stripe-signature');
  const stripe = new Stripe(secretKey);

  let event;
  if (webhookSecret && signature) {
    try {
      event = await stripe.webhooks.constructEventAsync(body, signature, webhookSecret);
    } catch (err) {
      // Log signature failure and notify admin
      (async () => {
        try {
          await base44.asServiceRole.entities.PaymentDiagnostic.create({
            diagnostic_type: 'webhook_signature_failure',
            severity: 'critical',
            status: 'open',
            issue_summary: `stripeWebhook signature failed: ${err.message}`,
            admin_message: 'Webhook arrived with invalid signature. Check STRIPE_WEBHOOK_SECRET matches Stripe Dashboard → Webhooks → Signing secret.',
            recommended_fix: 'Open Stripe Dashboard → Developers → Webhooks → stripeWebhook endpoint → Reveal signing secret → update STRIPE_WEBHOOK_SECRET in Base44 Secrets.',
            webhook_processed: false,
            source_chain: 'Stripe → stripeWebhook → signature_failed',
          });
          await base44.asServiceRole.functions.invoke('notifyAdmin', {
            notification_type: 'payment_warning',
            severity: 'critical',
            title: '🚨 Stripe Webhook Signature Failed',
            summary: `stripeWebhook verification failed: ${err.message}. Check your signing secrets.`,
            requires_action: true,
            linked_route: '/admin/webhook-health',
            source: 'stripeWebhook',
          });
        } catch (_) {}
      })();
      return Response.json({ error: 'Webhook signature failed' }, { status: 400 });
    }
  } else if (!webhookSecret) {
    // No secret configured — accept (dev/fallback only)
    try {
      event = JSON.parse(body);
    } catch {
      return Response.json({ error: 'Invalid JSON payload' }, { status: 400 });
    }
  } else {
    // Secret configured but no signature header
    return Response.json({ error: 'Missing stripe-signature header' }, { status: 400 });
  }

  // ✅ Return 200 IMMEDIATELY — all heavy processing below is fire-and-forget
  const response200 = Response.json({ received: true });

  // Fire-and-forget: all order fulfillment runs async, never blocks the 200
  (async () => {
  try {

    // =============================================
    // CHECKOUT SESSION COMPLETED — full order chain
    // =============================================
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      const meta = session.metadata || {};

      // Email from Stripe (authoritative) or metadata
      const customerEmail =
        session.customer_details?.email ||
        session.customer_email ||
        meta.customer_email ||
        '';
      const emailMissing = !customerEmail;

      // Parse cart items from metadata
      let cartItems = [];
      try {
        if (meta.items) cartItems = JSON.parse(meta.items);
      } catch (_) {}

      // Fallback to legacy single-item format
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

      const totalPaid = (session.amount_total || 0) / 100;
      const promoCode = meta.promo_code || '';
      const discountAmount = parseFloat(meta.discount_amount || '0');
      const shippingCharged = parseFloat(meta.shipping_amount_aud || '0');
      const supportContribution = parseFloat(meta.add_support || '0');

      // === IDEMPOTENCY CHECK — skip if order already exists for this session ===
      try {
        const existingOrders = await base44.asServiceRole.entities.MerchOrder.filter({ stripe_session_id: session.id });
        const activeExisting = (existingOrders || []).filter(o => o.status !== 'duplicate' && o.financial_status !== 'duplicate_void');
        if (activeExisting.length > 0) {
          // Already processed — log duplicate skipped and return 200
          await base44.asServiceRole.entities.StripeEventLog.create({
            stripe_event_id: event.id,
            event_type: event.type,
            category: 'revenue',
            priority: 'low',
            processing_status: 'duplicate',
            duplicate_detected: true,
            stripe_object_id: session.id,
            checkout_session_id: session.id,
            safe_summary: `Duplicate skipped — active MerchOrder ${activeExisting[0].id} already exists for session ${session.id}`,
            received_at: new Date().toISOString(),
            processed_at: new Date().toISOString(),
            source_chain: 'stripeWebhook → idempotency_check → duplicate_skipped',
          }).catch(() => {});
          return Response.json({ received: true, duplicate_skipped: true, existing_order_id: activeExisting[0].id });
        }
      } catch (_) {}

      // === CREATE MERCH ORDER ===
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
          promo_code: promoCode || null,
          discount_amount: discountAmount,
          shipping_amount: shippingCharged,
          support_contribution: supportContribution,
          stripe_session_id: session.id,
          stripe_payment_intent: session.payment_intent || '',
          status: emailMissing ? 'needs_admin_review' : 'confirmed',
          payment_status: 'paid',
          notes: [
            `Stripe Session: ${session.id}`,
            promoCode ? `Promo: ${promoCode} — $${discountAmount.toFixed(2)} off` : null,
            shippingCharged > 0 ? `Shipping charged: $${shippingCharged.toFixed(2)} AUD` : null,
            supportContribution > 0 ? `Support contribution: $${supportContribution.toFixed(2)} AUD` : null,
            emailMissing ? 'WARNING: Customer email missing — needs admin review' : null,
            `source_chain: stripeWebhook:checkout.session.completed`,
          ].filter(Boolean).join(' | '),
        });
        orderId = order?.id || null;
      } catch (orderErr) {
        try {
          await base44.asServiceRole.functions.invoke('notifyAdmin', {
            notification_type: 'payment_warning',
            severity: 'high',
            title: 'Order creation failed after payment',
            summary: `Payment succeeded (${session.id}) but order record failed: ${orderErr.message}`,
            requires_action: true,
            linked_route: '/admin/payment-diagnostics',
            source: 'stripeWebhook',
          });
          await base44.asServiceRole.entities.SystemHealthIssue.create({
            system_area: 'payments',
            issue_title: `Order creation failed for session ${session.id}`,
            severity: 'critical',
            detected_by: 'stripeWebhook',
            recommended_fix: `Manually create MerchOrder for session ${session.id}. Customer: ${customerEmail}`,
            status: 'open',
            risk_type: 'financial',
          });
        } catch (_) {}
      }

      // === INVENTORY DECREMENT + PROFIT CALCULATION per item ===
      for (const item of cartItems) {
        if (!item.product_id) continue;
        const quantity = item.quantity || 1;
        const itemRevenue = (item.price || 0) * quantity;

        try {
          // Fetch product to get current stock and cost
          const products = await base44.asServiceRole.entities.MerchProduct.filter({ id: item.product_id });
          if (products && products.length > 0) {
            const product = products[0];
            const currentStock = product.stock_quantity || 0;
            const newStock = Math.max(0, currentStock - quantity);

            // Decrement stock
            await base44.asServiceRole.entities.MerchProduct.update(item.product_id, {
              stock_quantity: newStock,
            });

            // Low stock alert
            if (newStock === 0) {
              await base44.asServiceRole.functions.invoke('notifyAdmin', {
                notification_type: 'system',
                severity: 'high',
                title: `SOLD OUT: ${product.name}`,
                summary: `${product.name} is now out of stock after order ${session.id}`,
                requires_action: true,
                linked_route: '/admin/merch',
                source: 'stripeWebhook',
              });
            } else if (newStock <= 5) {
              await base44.asServiceRole.functions.invoke('notifyAdmin', {
                notification_type: 'system',
                severity: 'warning',
                title: `Low stock: ${product.name} (${newStock} left)`,
                summary: `Only ${newStock} units remaining after order ${session.id}`,
                requires_action: false,
                linked_route: '/admin/merch',
                source: 'stripeWebhook',
              });
            }

            // === PROFIT CALCULATION ===
            const costPrice = product.cost_price || 0;
            const deliveryCost = product.delivery_cost || 0;
            const merchantFeePercent = product.merchant_fee_percent || 3.5;

            const itemCost = costPrice * quantity;
            const itemDeliveryCost = deliveryCost * quantity;
            const merchantFee = (itemRevenue * merchantFeePercent) / 100;

            // Promo discount allocated proportionally to eligible items
            let itemDiscount = 0;
            if (discountAmount > 0 && isCategoryEligibleForDiscount(item.category || product.category || '')) {
              const eligibleCartTotal = cartItems
                .filter(ci => isCategoryEligibleForDiscount(ci.category || ''))
                .reduce((sum, ci) => sum + (ci.price || 0) * (ci.quantity || 1), 0);
              if (eligibleCartTotal > 0) {
                itemDiscount = (itemRevenue / eligibleCartTotal) * discountAmount;
              }
            }

            // Shipping allocated proportionally
            const itemShippingContrib = cartItems.length > 1 && shippingCharged > 0
              ? shippingCharged * (quantity / cartItems.reduce((s, ci) => s + (ci.quantity || 1), 0))
              : shippingCharged;

            const grossProfit = (itemRevenue - itemDiscount) - itemCost - itemDeliveryCost - merchantFee;
            const profitMargin = itemRevenue > 0 ? (grossProfit / itemRevenue) * 100 : 0;

            // Create StripeEventLog with profit data
            await base44.asServiceRole.entities.StripeEventLog.create({
              stripe_event_id: `${event.id}_item_${item.product_id}`,
              event_type: 'checkout.item.fulfilled',
              category: 'revenue',
              priority: 'high',
              processing_status: 'processed',
              stripe_object_id: session.id,
              checkout_session_id: session.id,
              payment_intent_id: session.payment_intent || '',
              customer_id: customerEmail,
              order_id: orderId || '',
              amount: itemRevenue,
              currency: 'aud',
              safe_summary: `${product.name} × ${quantity} | Revenue: $${itemRevenue.toFixed(2)} | Gross profit: $${grossProfit.toFixed(2)} | Margin: ${profitMargin.toFixed(1)}%`,
              records_created: `MerchOrder:${orderId}`,
              records_updated: `MerchProduct:${item.product_id} stock ${currentStock}→${newStock}`,
              received_at: new Date().toISOString(),
              processed_at: new Date().toISOString(),
              source_chain: 'stripeWebhook → inventory_decrement → profit_calc',
            });
          }
        } catch (itemErr) {
          // Log item processing failure but don't abort others
          try {
            await base44.asServiceRole.entities.SystemHealthIssue.create({
              system_area: 'payments',
              issue_title: `Inventory/profit processing failed for ${item.product_name || item.product_id}`,
              severity: 'warning',
              detected_by: 'stripeWebhook',
              recommended_fix: `Manually decrement stock for ${item.product_id} (qty: ${quantity}). Order: ${session.id}. Error: ${itemErr.message}`,
              status: 'open',
              risk_type: 'financial',
            });
          } catch (_) {}
        }
      }

      // === EMAIL MISSING — flag for admin ===
      if (emailMissing) {
        try {
          await base44.asServiceRole.functions.invoke('notifyAdmin', {
            notification_type: 'payment_warning',
            severity: 'warning',
            title: 'Order missing customer email',
            summary: `Session ${session.id} completed but no customer email captured. Order marked needs_admin_review.`,
            requires_action: true,
            linked_route: '/admin/orders',
            source: 'stripeWebhook',
          });
        } catch (_) {}
      }

      // === ADMIN NOTIFICATION — new order ===
      try {
        const itemsSummary = cartItems.map(i => `${i.product_name} ×${i.quantity}`).join(', ');
        await base44.asServiceRole.functions.invoke('notifyAdmin', {
          notification_type: 'order',
          severity: 'info',
          title: `New order — $${totalPaid.toFixed(2)} AUD`,
          summary: `${meta.customer_name || 'Customer'} — ${itemsSummary}${promoCode ? ` | Promo: ${promoCode}` : ''}${discountAmount > 0 ? ` (-$${discountAmount.toFixed(2)})` : ''}`,
          requires_action: true,
          linked_route: '/admin/orders',
          source: 'stripeWebhook',
        });
      } catch (_) {}

      // === RECORD PROMO USAGE ===
      if (promoCode && discountAmount > 0) {
        try {
          await base44.asServiceRole.functions.invoke('recordPromoUsage', {
            code: promoCode,
            email: customerEmail,
            order_id: orderId || session.id,
          });
        } catch (_) {}
      }

      // === SEND ORDER RECEIPT ===
      if (customerEmail) {
        try {
          await base44.asServiceRole.functions.invoke('sendOrderReceipt', {
            order_id: orderId || '',
            session_id: session.id,
            customer_email: customerEmail,
            customer_name: meta.customer_name || '',
            items: cartItems,
            total_amount: totalPaid,
            promo_code: promoCode,
            discount_amount: discountAmount,
            shipping_amount: shippingCharged,
          });
        } catch (_) {}
      }
    }

    // =============================================
    // SESSION EXPIRED
    // =============================================
    if (event.type === 'checkout.session.expired') {
      const session = event.data.object;
      try {
        await base44.asServiceRole.functions.invoke('notifyAdmin', {
          notification_type: 'payment_warning',
          severity: 'warning',
          title: 'Checkout session expired',
          summary: `Customer did not complete checkout. Session: ${session.id}`,
          requires_action: false,
          linked_route: '/admin/payment-diagnostics',
          source: 'stripeWebhook',
        });
      } catch (_) {}
    }

    // =============================================
    // PAYMENT FAILED
    // =============================================
    if (event.type === 'payment_intent.payment_failed') {
      const pi = event.data.object;
      try {
        await base44.asServiceRole.functions.invoke('notifyAdmin', {
          notification_type: 'payment_warning',
          severity: 'warning',
          title: 'Payment failed',
          summary: `PaymentIntent ${pi.id} failed: ${pi.last_payment_error?.message || 'Unknown error'}`,
          requires_action: false,
          linked_route: '/admin/payment-diagnostics',
          source: 'stripeWebhook',
        });
      } catch (_) {}
    }

  } catch (error) {
    // Log unexpected errors but don't crash — 200 already sent
    base44.asServiceRole.entities.PaymentDiagnostic.create({
      diagnostic_type: 'webhook_processing_error',
      severity: 'high',
      status: 'open',
      issue_summary: `stripeWebhook async processing error: ${error.message}`,
      webhook_processed: false,
      source_chain: 'Stripe → stripeWebhook → async_processing_error',
    }).catch(() => {});
  }
  })();

  return response200;
});
