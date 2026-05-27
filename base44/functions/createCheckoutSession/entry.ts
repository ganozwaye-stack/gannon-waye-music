import Stripe from 'npm:stripe@14.21.0';
import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

const AU_SHIPPING_FLAT = 12.95;
const FREE_SHIPPING_THRESHOLD = 150;

// ALWAYS_INELIGIBLE: these categories can NEVER be discounted
const ALWAYS_INELIGIBLE_CATEGORIES = [
  'cd', 'vinyl', 'song', 'digital', 'support', 'donation', 'shipping',
  'processing', 'fees', 'music', 'limited_edition_music', 'digital_music',
];

const DIGITAL_CATEGORIES = ['digital', 'support', 'donation'];

function isInternational(address) {
  if (!address) return false;
  const lower = address.toLowerCase();
  return ['usa', 'united states', 'uk', 'united kingdom', 'canada', 'new zealand', 'nz', 'europe', 'india', 'singapore'].some(k => lower.includes(k));
}

function isCategoryEligibleForDiscount(category) {
  if (!category) return true; // Default to eligible if unknown
  const cat = category.toLowerCase().trim();
  return !ALWAYS_INELIGIBLE_CATEGORIES.some(c => cat.includes(c));
}

function calcAmountCents({ productPrice, quantity, discountPercent, category, shippingAddress, addSupport }) {
  const isDigital = DIGITAL_CATEGORIES.includes((category || '').toLowerCase());
  const itemTotal = productPrice * quantity;

  // GLOBAL DISCOUNT GUARD: Only apply discount if category is eligible
  const eligible = isCategoryEligibleForDiscount(category);
  const discounted = eligible ? itemTotal * (1 - discountPercent / 100) : itemTotal;

  let shipping = 0;
  if (!isDigital) {
    if (!isInternational(shippingAddress) && discounted < FREE_SHIPPING_THRESHOLD) {
      shipping = AU_SHIPPING_FLAT;
    }
  }

  // Support contribution is never discounted
  const supportAmount = parseFloat(addSupport || 0);

  return Math.round((discounted + shipping + supportAmount) * 100);
}

Deno.serve(async (req) => {
  try {
    const secretKey = Deno.env.get('STRIPE_SECRET_KEY');
    const publishableKey = Deno.env.get('STRIPE_PUBLISHABLE_KEY');

    // Stripe mode validation - CRITICAL BLOCK
    if (!secretKey || !secretKey.startsWith('sk_')) {
      try {
        const base44 = createClientFromRequest(req);
        await base44.asServiceRole.entities.PaymentDiagnostic.create({
          diagnostic_type: 'missing_stripe_config',
          severity: 'critical',
          issue_summary: 'STRIPE_SECRET_KEY missing or invalid',
          admin_message: 'Checkout blocked: STRIPE_SECRET_KEY not configured or invalid',
          status: 'open',
          retry_available: false,
        });
      } catch (_) {}
      return Response.json({
        error: 'Checkout temporarily unavailable',
        friendly_message: 'Checkout is temporarily unavailable while payment settings are being verified. You have not been charged. Please try again shortly.',
        code: 'STRIPE_CONFIG_ERROR'
      }, { status: 503 });
    }

    // Check for key mismatch
    const isSecretLive = secretKey.startsWith('sk_live_');
    const isPublishableLive = publishableKey?.startsWith('pk_live_');
    const isSecretTest = secretKey.startsWith('sk_test_');
    const isPublishableTest = publishableKey?.startsWith('pk_test_');

    if ((isSecretLive && !isPublishableLive) || (isSecretTest && !isPublishableTest)) {
      try {
        const base44 = createClientFromRequest(req);
        await base44.asServiceRole.entities.PaymentDiagnostic.create({
          diagnostic_type: 'missing_stripe_config',
          severity: 'critical',
          issue_summary: `STRIPE KEY MISMATCH: secret=${isSecretLive ? 'live' : 'test'}, publishable=${publishableKey ? (isPublishableLive ? 'live' : 'test') : 'missing'}`,
          admin_message: 'Checkout blocked: Stripe keys are in different modes (test vs live)',
          status: 'open',
          retry_available: false,
        });
      } catch (_) {}
      return Response.json({
        error: 'Checkout temporarily unavailable',
        friendly_message: 'Checkout is temporarily unavailable while payment settings are being verified. You have not been charged. Please try again shortly.',
        code: 'STRIPE_MODE_MISMATCH'
      }, { status: 503 });
    }

    const stripe = new Stripe(secretKey);
    const base44 = createClientFromRequest(req);
    const body = await req.json();
    const { customerEmail, customerName, productName, metadata, amount, addSupport } = body;

    if (!customerEmail) {
      return Response.json({ error: 'Missing customerEmail' }, { status: 400 });
    }

    // Server-side price verification
    let amountCents = 0;
    let productPrice = 0;
    let category = '';
    let discountGuardInfo = null;

    if (metadata?.product_id) {
      const products = await base44.asServiceRole.entities.MerchProduct.filter({ id: metadata.product_id });
      if (products && products.length > 0) {
        const product = products[0];
        productPrice = product.sale_price ?? product.price ?? 0;
        category = product.category || '';
        const quantity = parseInt(metadata.quantity || '1', 10);
        const rawDiscountPercent = parseFloat(metadata.promo_discount_percent || '0');

        // === OWNER OVERRIDE CHECK: skip guard, apply to everything including shipping ===
        const isOwnerOverride = metadata?.promo_override === 'true';

        // === GLOBAL DISCOUNT GUARD: enforce server-side (skipped for owner override) ===
        const eligible = isOwnerOverride ? true : isCategoryEligibleForDiscount(category);
        const effectiveDiscountPercent = eligible ? rawDiscountPercent : 0;

        if (rawDiscountPercent > 0 && !eligible) {
          // Log attempted discount on ineligible item
          discountGuardInfo = {
            attempted_discount: rawDiscountPercent,
            blocked: true,
            reason: `Category "${category}" is ineligible for discounts per global discount guard`,
            category,
          };
          // Update metadata to reflect guard blocked the discount
          if (metadata) metadata.promo_discount_blocked = 'true';
        }

        const shippingAddress = metadata.shipping_address || '';

        if (isOwnerOverride) {
          // Owner override: apply discount to grand total (items + no shipping charge)
          const itemTotal = productPrice * quantity;
          const discountedTotal = itemTotal * (1 - effectiveDiscountPercent / 100);
          amountCents = Math.max(50, Math.round(discountedTotal * 100)); // min 50c for Stripe
        } else {
          amountCents = calcAmountCents({
            productPrice,
            quantity,
            discountPercent: effectiveDiscountPercent,
            category,
            shippingAddress,
            addSupport: parseFloat(metadata.add_support || '0'),
          });
        }
      }
    }

    // Fallback to client-provided amount (no discount recalc)
    if (!amountCents) {
      amountCents = Math.round((amount || 0) * 100);
    }

    if (!amountCents || amountCents <= 0) {
      return Response.json({ error: 'Invalid order amount' }, { status: 400 });
    }

    const origin = req.headers.get('origin') || 'https://gannonwaye.com';

    // Build description with discount guard info
    let description = metadata?.size ? `Size: ${metadata.size}` : undefined;
    if (discountGuardInfo?.blocked) {
      description = (description ? description + ' | ' : '') + `Note: Discount blocked (${discountGuardInfo.reason})`;
    }

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      customer_email: customerEmail,
      line_items: [
        {
          price_data: {
            currency: 'aud',
            product_data: {
              name: productName || 'Gannon Waye Store',
              description,
            },
            unit_amount: amountCents,
          },
          quantity: 1,
        },
      ],
      success_url: `${origin}/checkout-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/store?checkout=cancelled`,
      metadata: {
        customer_name: customerName || '',
        product_name: productName || '',
        ...(metadata || {}),
        discount_guard_version: '1.0',
        discount_guard_blocked: discountGuardInfo?.blocked ? 'true' : 'false',
      },
      payment_intent_data: {
        description: `${productName || 'Purchase'} — Gannon Waye`,
        receipt_email: customerEmail,
        metadata: {
          customer_name: customerName || '',
          product_name: productName || '',
          ...(metadata || {}),
          discount_guard_version: '1.0',
        },
      },
    });

    return Response.json({ url: session.url, sessionId: session.id });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});