import Stripe from 'npm:stripe@14.21.0';
import { createClientFromRequest } from 'npm:@base44/sdk@0.8.30';

const AU_SHIPPING_FLAT = 12.95;
const FREE_SHIPPING_THRESHOLD = 150;

// ALWAYS_INELIGIBLE: these categories can NEVER be discounted
const ALWAYS_INELIGIBLE_CATEGORIES = [
  'cd', 'vinyl', 'song', 'digital', 'support', 'donation', 'shipping',
  'processing', 'fees', 'music', 'limited_edition_music', 'digital_music',
];

// cd and vinyl are physical goods — they require shipping
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

function isProductEligibleForDiscount(product, category) {
  if (!product) return false;
  if (product.discount_excluded || product.exclude_from_discounts || product.promo_eligible === false) return false;
  return isCategoryEligibleForDiscount(category);
}

function needsShipping(category) {
  if (!category) return true;
  const cat = category.toLowerCase().trim();
  return !NO_SHIPPING_CATEGORIES.some(c => cat.includes(c));
}

async function createPaymentDiagnosticOnce(base44, record) {
  try {
    const existing = await base44.asServiceRole.entities.PaymentDiagnostic.filter({
      diagnostic_type: record.diagnostic_type,
      status: 'open',
    });
    const alreadyOpen = (existing || []).some(d => d.issue_summary === record.issue_summary);
    if (!alreadyOpen) {
      await base44.asServiceRole.entities.PaymentDiagnostic.create(record);
    }
  } catch (_) {}
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const secretKey = Deno.env.get('STRIPE_SECRET_KEY');
    const publishableKey = Deno.env.get('STRIPE_PUBLISHABLE_KEY');

    // Stripe mode validation - CRITICAL BLOCK
    if (!secretKey || !secretKey.startsWith('sk_')) {
      await createPaymentDiagnosticOnce(base44, {
        diagnostic_type: 'missing_stripe_config',
        severity: 'critical',
        issue_summary: 'STRIPE_SECRET_KEY missing or invalid',
        admin_message: 'Checkout blocked: STRIPE_SECRET_KEY not configured or invalid',
        recommended_fix: 'Set STRIPE_SECRET_KEY in Base44 Secrets using a valid sk_live_ or sk_test_ key. Match it with STRIPE_PUBLISHABLE_KEY from the same Stripe mode.',
        status: 'open',
        retry_available: false,
      });
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
      await createPaymentDiagnosticOnce(base44, {
        diagnostic_type: 'missing_stripe_config',
        severity: 'critical',
        issue_summary: `STRIPE KEY MISMATCH: secret=${isSecretLive ? 'live' : 'test'}, publishable=${publishableKey ? (isPublishableLive ? 'live' : 'test') : 'missing'}`,
        admin_message: 'Checkout blocked: Stripe keys are in different modes (test vs live)',
        recommended_fix: 'Set STRIPE_SECRET_KEY and STRIPE_PUBLISHABLE_KEY from the same Stripe environment: both test or both live.',
        status: 'open',
        retry_available: false,
      });
      return Response.json({
        error: 'Checkout temporarily unavailable',
        friendly_message: 'Checkout is temporarily unavailable while payment settings are being verified. You have not been charged. Please try again shortly.',
        code: 'STRIPE_MODE_MISMATCH'
      }, { status: 503 });
    }

    const stripe = new Stripe(secretKey);
    const body = await req.json();
    const { customerEmail, customerName, metadata } = body;

    // Parse multi-item cart or single-item fallback
    let cartItems = [];
    let shippingAddress = metadata?.shipping_address || '';
    let rawDiscountPercent = parseFloat(metadata?.promo_discount_percent || '0');
    let promoCode = metadata?.promo_code || '';
    let isOwnerOverride = metadata?.promo_override === 'true';
    
    if (metadata?.items) {
      try {
        cartItems = JSON.parse(metadata.items);
      } catch (e) {
        cartItems = [];
      }
    }
    
    // Fallback to single-item format
    if (cartItems.length === 0 && metadata?.product_id) {
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
    }

    // Build line items and calculate totals
    let merchAmountCents = 0;
    let shippingAmountCents = 0;
    let discountGuardInfo = null;
    let internationalShipping = false;
    const lineItems = [];

    if (cartItems.length > 0) {
      // Validate each item and build line items
      for (const item of cartItems) {
        const products = await base44.asServiceRole.entities.MerchProduct.filter({ id: item.product_id });
        if (products && products.length > 0) {
          const product = products[0];
          const verifiedPrice = product.sale_price ?? product.price ?? 0;
          const category = product.category || '';
          const quantity = item.quantity || 1;
          
          // === GLOBAL DISCOUNT GUARD ===
          const eligible = isOwnerOverride ? true : isProductEligibleForDiscount(product, category);
          const effectiveDiscountPercent = eligible ? rawDiscountPercent : 0;
          
          if (rawDiscountPercent > 0 && !eligible) {
            discountGuardInfo = {
              attempted_discount: rawDiscountPercent,
              blocked: true,
              reason: product.discount_lock_reason || `Category "${category}" is ineligible for discounts`,
              category,
            };
          }
          
          // Calculate item amount (discounted if eligible)
          const itemTotal = verifiedPrice * quantity;
          const discounted = eligible ? itemTotal * (1 - effectiveDiscountPercent / 100) : itemTotal;
          merchAmountCents += Math.round(discounted * 100);
          
          // Add support contribution if present (only once per order)
          if (metadata?.add_support && !item.add_support_added) {
            const supportAmount = parseFloat(metadata.add_support);
            if (supportAmount > 0) {
              merchAmountCents += Math.round(supportAmount * 100);
              item.add_support_added = true;
            }
          }
          
          // Build line item
          let description = item.size ? `Size: ${item.size}` : undefined;
          if (discountGuardInfo?.blocked && !eligible) {
            description = (description ? description + ' | ' : '') + `Discount blocked`;
          }
          
          lineItems.push({
            price_data: {
              currency: 'aud',
              product_data: {
                name: item.product_name || product.name || 'Gannon Waye Store',
                description,
              },
              unit_amount: Math.max(50, Math.round(discounted * 100)),
              tax_behavior: 'inclusive',
            },
            quantity: quantity,
          });
        }
      }
      
      // Calculate combined shipping for entire cart
      const totalQty = cartItems.reduce((sum, item) => sum + (item.quantity || 1), 0);
      const hasPhysicalItems = cartItems.some(item => needsShipping(item.category || ''));
      
      if (hasPhysicalItems) {
        internationalShipping = isInternational(shippingAddress);
        
        if (!internationalShipping) {
          const merchTotalAUD = merchAmountCents / 100;
          
          // Free shipping threshold
          if (merchTotalAUD >= FREE_SHIPPING_THRESHOLD) {
            shippingAmountCents = 0;
          } else {
            // Combined package: base + increment per additional item
            const base = AU_SHIPPING_FLAT;
            const additionalPerItem = 2.00;
            const combinedShipping = totalQty <= 1 ? base : base + (totalQty - 1) * additionalPerItem;
            shippingAmountCents = Math.round(combinedShipping * 100);
          }
        }
      }
    }

    // Fallback to client-provided amount
    if (!merchAmountCents) {
      merchAmountCents = Math.round((metadata?.amount || 0) * 100);
    }

    if (!merchAmountCents || merchAmountCents <= 0) {
      return Response.json({ error: 'Invalid order amount' }, { status: 400 });
    }

    const origin = req.headers.get('origin') || 'https://gannonwaye.com';

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

    // Determine if order has physical items for shipping address collection
    const orderHasPhysical = cartItems.length > 0
      ? cartItems.some(item => needsShipping(item.category || ''))
      : true; // fallback: assume physical

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
      success_url: `${origin}/checkout-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/store?checkout=cancelled`,
      metadata: {
        customer_name: customerName || '',
        items: metadata?.items || '',
        promo_code: promoCode || '',
        discount_percent: String(rawDiscountPercent),
        shipping_address: shippingAddress,
        add_support: metadata?.add_support || '0',
        discount_guard_version: '2.0',
        discount_guard_blocked: discountGuardInfo?.blocked ? 'true' : 'false',
        shipping_amount_aud: String((shippingAmountCents / 100).toFixed(2)),
        shipping_combined: 'true',
        shipping_method: internationalShipping ? 'international_quote' : (shippingAmountCents === 0 ? 'free' : 'combined_package'),
        total_amount_aud: String((totalAmountCents / 100).toFixed(2)),
      },
      payment_intent_data: {
        description: `Gannon Waye Store Order`,
        receipt_email: customerEmail,
        metadata: {
          customer_name: customerName || '',
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
