import Stripe from 'npm:stripe@14.21.0';
import { createClientFromRequest } from 'npm:@base44/sdk@0.8.30';

const AU_SHIPPING_FLAT = 12.95;
const FREE_SHIPPING_THRESHOLD = 150;
const ADDITIONAL_SHIPPING_PER_ITEM = 2.00;

// Categories that can NEVER be discounted (except owner override)
const ALWAYS_INELIGIBLE_CATEGORIES = [
  'cd', 'vinyl', 'song', 'digital', 'support', 'donation', 'shipping',
  'processing', 'fees', 'music', 'limited_edition_music', 'digital_music',
  'bundle', 'bundles',
];

// Categories that don't require shipping
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

// ── Deduped PaymentDiagnostic — prevents spamming duplicates ──────────────
async function ensureSingleOpenDiagnostic(base44, issueSummary, extra) {
  try {
    const existing = await base44.asServiceRole.entities.PaymentDiagnostic.filter({
      issue_summary: issueSummary,
      status: 'open',
    });
    if (existing && existing.length > 0) return existing[0];
    return await base44.asServiceRole.entities.PaymentDiagnostic.create({
      diagnostic_type: 'missing_stripe_config',
      severity: 'critical',
      status: 'open',
      issue_summary: issueSummary,
      ...extra,
    });
  } catch (_) { /* best-effort — do not block checkout */ }
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const secretKey = (Deno.env.get('STRIPE_SECRET_KEY') || '').trim();
    const publishableKey = (Deno.env.get('STRIPE_PUBLISHABLE_KEY') || '').trim();

    // ── Validate secret key format ───────────────────────────────────────
    if (!secretKey || !secretKey.startsWith('sk_')) {
      const issueSummary = 'STRIPE_SECRET_KEY is missing or invalid (must start with sk_) in createCheckoutSession';
      await ensureSingleOpenDiagnostic(base44, issueSummary, {
        admin_message: 'Checkout is unavailable — STRIPE_SECRET_KEY is missing or does not start with sk_.',
        recommended_fix: 'Go to Stripe Dashboard → Developers → API Keys → Reveal secret key → add sk_live_... to Base44 Secrets.',
        webhook_processed: false,
        source_chain: 'createCheckoutSession → secret_key_validation_failed',
      });
      return Response.json({
        error: 'Checkout temporarily unavailable',
        friendly_message: 'Checkout is temporarily unavailable while payment settings are being verified. You have not been charged. Please try again shortly.',
        code: 'STRIPE_CONFIG_ERROR',
      }, { status: 503 });
    }

    // ── Validate publishable key format ──────────────────────────────────
    if (!publishableKey || !publishableKey.startsWith('pk_')) {
      const issueSummary = 'STRIPE_PUBLISHABLE_KEY is missing or invalid (must start with pk_) in createCheckoutSession';
      await ensureSingleOpenDiagnostic(base44, issueSummary, {
        admin_message: 'Checkout is unavailable — STRIPE_PUBLISHABLE_KEY is missing or does not start with pk_.',
        recommended_fix: 'Go to Stripe Dashboard → Developers → API Keys → Copy publishable key → add pk_live_... to Base44 Secrets.',
        webhook_processed: false,
        source_chain: 'createCheckoutSession → publishable_key_validation_failed',
      });
      return Response.json({
        error: 'Checkout temporarily unavailable',
        friendly_message: 'Checkout is temporarily unavailable while payment settings are being verified. You have not been charged. Please try again shortly.',
        code: 'STRIPE_CONFIG_ERROR',
      }, { status: 503 });
    }

    // ── Mode-match: sk_live_ with pk_live_ OR sk_test_ with pk_test_ ─────
    const isSecretLive = secretKey.startsWith('sk_live_');
    const isPublishableLive = publishableKey.startsWith('pk_live_');
    const isSecretTest = secretKey.startsWith('sk_test_');
    const isPublishableTest = publishableKey.startsWith('pk_test_');

    if ((isSecretLive && !isPublishableLive) || (isSecretTest && !isPublishableTest)) {
      const issueSummary = 'STRIPE key mode mismatch: secret is ' + (isSecretLive ? 'live' : 'test') + ' but publishable is ' + (isPublishableLive ? 'live' : 'test');
      await ensureSingleOpenDiagnostic(base44, issueSummary, {
        admin_message: 'Checkout is unavailable — STRIPE_SECRET_KEY is ' + (isSecretLive ? 'live' : 'test') + ' mode but STRIPE_PUBLISHABLE_KEY is ' + (isPublishableLive ? 'live' : 'test') + ' mode. Both must match.',
        recommended_fix: 'Update both keys to the same mode in Base44 Secrets. Use sk_live_ + pk_live_ for production.',
        webhook_processed: false,
        source_chain: 'createCheckoutSession → key_mode_mismatch',
      });
      return Response.json({
        error: 'Checkout temporarily unavailable',
        friendly_message: 'Checkout is temporarily unavailable while payment settings are being verified. You have not been charged. Please try again shortly.',
        code: 'STRIPE_MODE_MISMATCH',
      }, { status: 503 });
    }

    const stripe = new Stripe(secretKey);
    const body = await req.json();
    const { customerEmail, customerName, metadata } = body;

    // Parse cart items
    let cartItems = [];
    if (metadata?.items) {
      try { cartItems = JSON.parse(metadata.items); } catch (_) { cartItems = []; }
    }

    // Fallback to single-item format
    if (cartItems.length === 0 && metadata?.product_id) {
      try {
        const products = await base44.asServiceRole.entities.MerchProduct.filter({ id: metadata.product_id });
        if (products && products.length > 0) {
          const product = products[0];
          cartItems = [{
            product_id: product.id,
            product_name: product.name,
            price: product.sale_price ?? product.price ?? 0,
            quantity: parseInt(metadata.quantity || '1', 10),
            size: metadata.size,
            category: product.category || ''
          }];
        }
      } catch (_) { /* invalid ID format */ }
    }

    const shippingAddress = metadata?.shipping_address || '';
    const rawDiscountPercent = parseFloat(metadata?.promo_discount_percent || '0');
    const promoCode = metadata?.promo_code || '';
    const isOwnerOverride = metadata?.promo_override === 'true';
    const promoFreeShipping = metadata?.promo_free_shipping === 'true';
    const supportAmount = parseFloat(metadata?.add_support || '0');

    // Build line items — PER-UNIT pricing (not total × quantity)
    const lineItems = [];
    let discountGuardInfo = null;
    let internationalShipping = false;

    for (const item of cartItems) {
      let product = null;
      try {
        const products = await base44.asServiceRole.entities.MerchProduct.filter({ id: item.product_id });
        if (products && products.length > 0) product = products[0];
      } catch (_) { /* invalid product ID is rejected by the publication gate below */ }

      const quantity = Number(item.quantity || 1);
      const publicationIssues = [];
      if (!product) publicationIssues.push('Product record not found.');
      if (product && (!product.is_active || product.publication_status !== 'live')) publicationIssues.push('Product is not approved for public sale.');
      if (product && (!product.approved_by || !product.approved_at)) publicationIssues.push('Human product approval is missing.');
      if (product && (!product.cost_verified_at || !product.stock_verified_at)) publicationIssues.push('Cost or stock verification is missing.');
      if (product && (!product.supplier_url || !/^https?:\/\//i.test(product.supplier_url))) publicationIssues.push('Direct supplier or print provider evidence is missing.');
      if (product && (!Number.isFinite(product.sale_price) || product.sale_price <= 0)) publicationIssues.push('Verified retail price is missing.');
      if (product && (!Number.isFinite(product.cost_price) || product.cost_price <= 0)) publicationIssues.push('Verified unit cost is missing.');
      if (product && (!Number.isFinite(product.delivery_cost) || product.delivery_cost < 0)) publicationIssues.push('Verified delivery cost is missing.');
      if (product && (!Number.isInteger(quantity) || quantity <= 0 || quantity > product.stock_quantity)) publicationIssues.push('Requested quantity is invalid or exceeds verified stock.');
      if (product) {
        const fee = Number(product.sale_price || 0) * Number(product.merchant_fee_percent || 0) / 100;
        if (Number(product.sale_price || 0) <= Number(product.cost_price || 0) + Number(product.delivery_cost || 0) + fee) publicationIssues.push('Retail price does not cover landed cost and merchant fee.');
      }
      if (publicationIssues.length > 0) {
        return Response.json({
          error: 'Checkout blocked because a cart item is not publication ready.',
          product_id: item.product_id,
          issues: publicationIssues,
          external_actions_performed: false,
        }, { status: 400 });
      }

      const verifiedPrice = product.sale_price;
      const category = (product.category || '').toLowerCase().trim();
      const productName = product.name;

      // === DISCOUNT GUARD ===
      const eligible = isOwnerOverride ? true : isCategoryEligibleForDiscount(category);

      if (rawDiscountPercent > 0 && !eligible && !discountGuardInfo) {
        discountGuardInfo = {
          attempted_discount: rawDiscountPercent,
          blocked: true,
          reason: 'Category "' + category + '" is ineligible for discounts',
          category,
        };
      }

      // Per-unit discount calculation (in cents, matches frontend exactly)
      const discountedPerUnit = eligible && rawDiscountPercent > 0
        ? verifiedPrice * (1 - rawDiscountPercent / 100)
        : verifiedPrice;
      const unitAmountCents = Math.max(50, Math.round(discountedPerUnit * 100));

      // Build description
      let description = item.size ? 'Size: ' + item.size : undefined;
      if (rawDiscountPercent > 0 && !eligible) {
        description = (description ? description + ' | ' : '') + 'Discount blocked';
      }

      lineItems.push({
        price_data: {
          currency: 'aud',
          product_data: { name: productName, description },
          unit_amount: unitAmountCents,
          tax_behavior: 'inclusive',
        },
        quantity: quantity,
      });
    }

    // Add support contribution as separate line item
    if (supportAmount > 0) {
      lineItems.push({
        price_data: {
          currency: 'aud',
          product_data: { name: 'Support Contribution 🤍' },
          unit_amount: Math.round(supportAmount * 100),
          tax_behavior: 'inclusive',
        },
        quantity: 1,
      });
    }

    // Calculate shipping — uses UNDISCOUNTED merch total for threshold (matches frontend)
    let shippingAmountCents = 0;
    const hasPhysicalItems = cartItems.some(item => needsShipping(item.category || ''));

    if (hasPhysicalItems) {
      if (promoFreeShipping) {
        shippingAmountCents = 0;
      } else {
        internationalShipping = isInternational(shippingAddress);
        if (!internationalShipping) {
          const undiscountedMerchCents = cartItems.reduce((s, item) => {
            const price = item.price ?? 0;
            return s + Math.round(price * 100) * (item.quantity || 1);
          }, 0);

          if (undiscountedMerchCents / 100 >= FREE_SHIPPING_THRESHOLD) {
            shippingAmountCents = 0;
          } else {
            const totalQty = cartItems.reduce((sum, item) => sum + (item.quantity || 1), 0);
            const combinedShipping = totalQty <= 1
              ? AU_SHIPPING_FLAT
              : AU_SHIPPING_FLAT + (totalQty - 1) * ADDITIONAL_SHIPPING_PER_ITEM;
            shippingAmountCents = Math.round(combinedShipping * 100);
          }
        }
      }
    }

    // Add shipping as separate line item (NEVER discountable)
    if (shippingAmountCents > 0) {
      lineItems.push({
        price_data: {
          currency: 'aud',
          product_data: {
            name: 'Shipping (Combined Package)',
            description: 'All items shipped together',
          },
          unit_amount: shippingAmountCents,
          tax_behavior: 'inclusive',
        },
        quantity: 1,
      });
    }

    const totalAmountCents = lineItems.reduce((sum, li) => sum + li.price_data.unit_amount * li.quantity, 0);

    if (totalAmountCents <= 0) {
      return Response.json({ error: 'Invalid order amount' }, { status: 400 });
    }

    const origin = req.headers.get('origin') || 'https://gannonwaye.com';

    const orderHasPhysical = cartItems.length > 0
      ? cartItems.some(item => needsShipping(item.category || ''))
      : true;

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      ...(customerEmail ? { customer_email: customerEmail } : {}),
      customer_creation: 'always',
      billing_address_collection: 'required',
      ...(orderHasPhysical ? {
        shipping_address_collection: {
          allowed_countries: ['AU', 'NZ', 'US', 'GB', 'CA', 'SG', 'IN'],
        },
      } : {}),
      automatic_tax: { enabled: false },
      line_items: lineItems,
      success_url: origin + '/checkout-success?session_id={CHECKOUT_SESSION_ID}',
      cancel_url: origin + '/store?checkout=cancelled',
      metadata: {
        customer_name: customerName || '',
        items: metadata?.items || '',
        promo_code: promoCode || '',
        discount_percent: String(rawDiscountPercent),
        shipping_address: shippingAddress,
        add_support: metadata?.add_support || '0',
        discount_guard_version: '3.0',
        discount_guard_blocked: discountGuardInfo?.blocked ? 'true' : 'false',
        shipping_amount_aud: String((shippingAmountCents / 100).toFixed(2)),
        shipping_combined: 'true',
        shipping_method: internationalShipping ? 'international_quote' : (shippingAmountCents === 0 ? 'free' : 'combined_package'),
        total_amount_aud: String((totalAmountCents / 100).toFixed(2)),
      },
      payment_intent_data: {
        description: 'Gannon Waye Store Order',
        receipt_email: customerEmail,
        metadata: {
          customer_name: customerName || '',
          discount_guard_version: '3.0',
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