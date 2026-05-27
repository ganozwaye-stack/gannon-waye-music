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
const NO_SHIPPING_CATEGORIES = ['digital', 'support', 'donation', 'song', 'music', 'digital_music'];

function isInternational(address) {
  if (!address) return false;
  const lower = address.toLowerCase();
  return ['usa', 'united states', 'uk', 'united kingdom', 'canada', 'new zealand', 'nz', 'europe', 'india', 'singapore'].some(k => lower.includes(k));
}

function isCategoryEligibleForDiscount(category) {
  if (!category) return true;
  const cat = category.toLowerCase().trim();
  return !ALWAYS_INELIGIBLE_CATEGORIES.some(c => cat.includes(c));
}

function needsShipping(category) {
  if (!category) return true;
  const cat = category.toLowerCase().trim();
  return !NO_SHIPPING_CATEGORIES.some(c => cat.includes(c));
}

/**
 * Calculate COMBINED shipping for a single-product checkout.
 * Shipping is always ONE charge for the whole order — never multiplied per item.
 * Returns shipping amount in AUD (not cents).
 */
function calcCombinedShipping({ productPrice, quantity, discountedTotal, category, shippingAddress, isOwnerOverride }) {
  if (isOwnerOverride) return 0;
  if (!needsShipping(category)) return 0;
  if (isInternational(shippingAddress)) return 0; // quote required

  // Combined package: one base rate regardless of quantity
  // Additional items get a small increment (not full rate) — default $2/item after first
  const base = AU_SHIPPING_FLAT;
  const additionalPerItem = 2.00;
  const combinedShipping = quantity <= 1 ? base : base + (quantity - 1) * additionalPerItem;

  // Free shipping if discounted merch total meets threshold
  if (discountedTotal >= FREE_SHIPPING_THRESHOLD) return 0;

  return combinedShipping;
}

function calcMerchAmountCents({ productPrice, quantity, discountPercent, category, isOwnerOverride }) {
  const itemTotal = productPrice * quantity;
  const eligible = isOwnerOverride ? true : isCategoryEligibleForDiscount(category);
  const discounted = eligible ? itemTotal * (1 - discountPercent / 100) : itemTotal;
  return Math.round(discounted * 100);
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
    // customerEmail is optional — Stripe collects it on the hosted page if not provided

    // Server-side price verification
    let merchAmountCents = 0;
    let shippingAmountCents = 0;
    let productPrice = 0;
    let category = '';
    let discountGuardInfo = null;
    let shippingNeeded = false;
    let internationalShipping = false;

    if (metadata?.product_id) {
      const products = await base44.asServiceRole.entities.MerchProduct.filter({ id: metadata.product_id });
      if (products && products.length > 0) {
        const product = products[0];
        productPrice = product.sale_price ?? product.price ?? 0;
        category = product.category || '';
        const quantity = parseInt(metadata.quantity || '1', 10);
        const rawDiscountPercent = parseFloat(metadata.promo_discount_percent || '0');
        const isOwnerOverride = metadata?.promo_override === 'true';
        const shippingAddress = metadata.shipping_address || '';

        // === GLOBAL DISCOUNT GUARD ===
        const eligible = isOwnerOverride ? true : isCategoryEligibleForDiscount(category);
        const effectiveDiscountPercent = eligible ? rawDiscountPercent : 0;

        if (rawDiscountPercent > 0 && !eligible) {
          discountGuardInfo = {
            attempted_discount: rawDiscountPercent,
            blocked: true,
            reason: `Category "${category}" is ineligible for discounts per global discount guard`,
            category,
          };
          if (metadata) metadata.promo_discount_blocked = 'true';
        }

        // Merch amount (discounted if eligible)
        merchAmountCents = calcMerchAmountCents({ productPrice, quantity, discountPercent: effectiveDiscountPercent, category, isOwnerOverride });

        // Support contribution (never discounted, added to merch line)
        const supportAmount = parseFloat(metadata.add_support || '0');
        if (supportAmount > 0) {
          merchAmountCents += Math.round(supportAmount * 100);
        }

        // Shipping: COMBINED package rate, separate from merch
        shippingNeeded = needsShipping(category) && !isOwnerOverride;
        internationalShipping = isInternational(shippingAddress);

        if (shippingNeeded && !internationalShipping) {
          const discountedMerchAUD = merchAmountCents / 100;
          const shippingAUD = calcCombinedShipping({
            productPrice,
            quantity,
            discountedTotal: discountedMerchAUD,
            category,
            shippingAddress,
            isOwnerOverride,
          });
          shippingAmountCents = Math.round(shippingAUD * 100);
        }
      }
    }

    // Fallback to client-provided amount (no separate shipping)
    if (!merchAmountCents) {
      merchAmountCents = Math.round((amount || 0) * 100);
    }

    if (!merchAmountCents || merchAmountCents <= 0) {
      return Response.json({ error: 'Invalid order amount' }, { status: 400 });
    }

    const origin = req.headers.get('origin') || 'https://gannonwaye.com';

    let description = metadata?.size ? `Size: ${metadata.size}` : undefined;
    if (discountGuardInfo?.blocked) {
      description = (description ? description + ' | ' : '') + `Note: Discount blocked (${discountGuardInfo.reason})`;
    }

    // Build line items: merch first, then shipping as separate line (NEVER discountable)
    const lineItems = [
      {
        price_data: {
          currency: 'aud',
          product_data: {
            name: productName || 'Gannon Waye Store',
            description,
          },
          unit_amount: Math.max(50, merchAmountCents),
        },
        quantity: 1,
      },
    ];

    if (shippingAmountCents > 0) {
      lineItems.push({
        price_data: {
          currency: 'aud',
          product_data: {
            name: 'Shipping (Combined Package — Australia)',
            description: 'All items shipped together in one package',
          },
          unit_amount: shippingAmountCents,
          // tax_behavior: 'inclusive' could be added later
        },
        quantity: 1,
      });
    }

    const totalAmountCents = lineItems.reduce((sum, li) => sum + li.price_data.unit_amount, 0);

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      ...(customerEmail ? { customer_email: customerEmail } : {}),
      // allow_promotion_codes: true is intentionally REMOVED to prevent Stripe promo codes
      // from discounting shipping. Promo codes are applied server-side before this session.
      line_items: lineItems,
      success_url: `${origin}/checkout-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/store?checkout=cancelled`,
      metadata: {
        customer_name: customerName || '',
        product_name: productName || '',
        ...(metadata || {}),
        discount_guard_version: '2.0',
        discount_guard_blocked: discountGuardInfo?.blocked ? 'true' : 'false',
        shipping_amount_aud: String((shippingAmountCents / 100).toFixed(2)),
        shipping_combined: 'true',
        shipping_method: internationalShipping ? 'international_quote' : (shippingAmountCents === 0 ? 'free' : 'combined_package'),
        total_amount_aud: String((totalAmountCents / 100).toFixed(2)),
      },
      payment_intent_data: {
        description: `${productName || 'Purchase'} — Gannon Waye`,
        receipt_email: customerEmail,
        metadata: {
          customer_name: customerName || '',
          product_name: productName || '',
          ...(metadata || {}),
          discount_guard_version: '2.0',
          shipping_amount_aud: String((shippingAmountCents / 100).toFixed(2)),
          shipping_combined: 'true',
        },
      },
    });

    return Response.json({ url: session.url, sessionId: session.id });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});