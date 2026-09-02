import Stripe from 'npm:stripe@14.21.0';
import { createClientFromRequest } from 'npm:@base44/sdk@0.8.30';
import {
  calculateShippingQuote,
  fromCents,
  toCents,
} from '../../shared/shippingQuote.js';

const ALLOWED_ORIGINS = new Set([
  'https://gannonwaye.com',
  'https://www.gannonwaye.com',
  'https://gannonwaye.base44.app',
]);

async function ensureSingleOpenDiagnostic(base44, issueSummary, extra = {}) {
  try {
    const existing = await base44.asServiceRole.entities.PaymentDiagnostic.filter({
      issue_summary: issueSummary,
      status: 'open',
    });
    if (Array.isArray(existing) && existing.length > 0) return existing[0];
    return await base44.asServiceRole.entities.PaymentDiagnostic.create({
      diagnostic_type: 'session_creation_failure',
      severity: 'high',
      status: 'open',
      issue_summary: issueSummary,
      ...extra,
    });
  } catch {
    return null;
  }
}

function safeOrigin(req) {
  const origin = req.headers.get('origin') || '';
  return ALLOWED_ORIGINS.has(origin) ? origin : 'https://gannonwaye.com';
}

function parseCartItems(raw) {
  if (!raw) return [];
  try {
    const parsed = typeof raw === 'string' ? JSON.parse(raw) : raw;
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function aggregateRequestedItems(items) {
  const aggregated = new Map();
  for (const item of items) {
    const productId = String(item?.product_id || '').trim();
    const size = String(item?.size || '').trim();
    const quantity = Number(item?.quantity || 0);
    if (!productId || !Number.isInteger(quantity) || quantity <= 0) {
      throw new Error('Cart contains an invalid product or quantity.');
    }
    const key = `${productId}::${size}`;
    const current = aggregated.get(key) || { product_id: productId, size, quantity: 0 };
    current.quantity += quantity;
    aggregated.set(key, current);
  }
  return [...aggregated.values()];
}

Deno.serve(async (req) => {
  let base44;
  try {
    base44 = createClientFromRequest(req);
    const secretKey = String(Deno.env.get('STRIPE_SECRET_KEY') || '').trim();
    const publishableKey = String(Deno.env.get('STRIPE_PUBLISHABLE_KEY') || '').trim();

    if (!secretKey.startsWith('sk_') || !publishableKey.startsWith('pk_')) {
      const issueSummary = 'Stripe API keys are missing or invalid in createCheckoutSession';
      await ensureSingleOpenDiagnostic(base44, issueSummary, {
        diagnostic_type: 'missing_stripe_config',
        severity: 'critical',
        admin_message: 'Checkout was stopped before a Stripe session was created.',
        recommended_fix: 'Verify the production Stripe secret and publishable keys in Base44 secrets. Do not rotate credentials without owner approval.',
        source_chain: 'createCheckoutSession -> key_validation_failed',
      });
      return Response.json({
        error: 'Checkout is temporarily unavailable.',
        friendly_message: 'Checkout is temporarily unavailable while payment settings are verified. You have not been charged.',
        external_actions_performed: false,
      }, { status: 503 });
    }

    const secretIsLive = secretKey.startsWith('sk_live_');
    const publishableIsLive = publishableKey.startsWith('pk_live_');
    const secretIsTest = secretKey.startsWith('sk_test_');
    const publishableIsTest = publishableKey.startsWith('pk_test_');
    if ((secretIsLive && !publishableIsLive) || (secretIsTest && !publishableIsTest)) {
      const issueSummary = 'Stripe key mode mismatch in createCheckoutSession';
      await ensureSingleOpenDiagnostic(base44, issueSummary, {
        diagnostic_type: 'missing_stripe_config',
        severity: 'critical',
        admin_message: 'Checkout was stopped because the Stripe secret and publishable keys use different modes.',
        recommended_fix: 'Verify that both configured keys are either test keys or live keys. Do not change credentials without owner approval.',
        source_chain: 'createCheckoutSession -> key_mode_mismatch',
      });
      return Response.json({
        error: 'Checkout is temporarily unavailable.',
        friendly_message: 'Checkout is temporarily unavailable while payment settings are verified. You have not been charged.',
        external_actions_performed: false,
      }, { status: 503 });
    }

    const body = await req.json();
    const customerEmail = String(body?.customerEmail || '').trim().toLowerCase();
    const customerName = String(body?.customerName || '').trim();
    const metadata = body?.metadata || {};

    if (!customerName || !customerEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerEmail)) {
      return Response.json({
        error: 'A valid customer name and email are required.',
        external_actions_performed: false,
      }, { status: 400 });
    }

    if (metadata.shipping_country !== 'Australia') {
      return Response.json({
        error: 'Current checkout is available within Australia only.',
        external_actions_performed: false,
      }, { status: 400 });
    }

    const prohibitedClientFields = [
      metadata.promo_code,
      metadata.promo_discount_percent,
      metadata.promo_override,
      metadata.promo_free_shipping,
      metadata.add_support,
    ].filter(value => value !== undefined && value !== null && String(value) !== '' && String(value) !== '0' && String(value) !== 'false');

    if (prohibitedClientFields.length > 0) {
      return Response.json({
        error: 'Discounts, free shipping and support add-ons are paused during the stage one checkout.',
        external_actions_performed: false,
      }, { status: 400 });
    }

    const requestedItems = aggregateRequestedItems(parseCartItems(metadata.items));
    if (requestedItems.length === 0 || requestedItems.length > 10) {
      return Response.json({
        error: 'Cart is empty or exceeds the current checkout limit.',
        external_actions_performed: false,
      }, { status: 400 });
    }

    const verifiedItems = [];

    for (const requested of requestedItems) {
      const products = await base44.asServiceRole.entities.MerchProduct.filter({ id: requested.product_id });
      const product = Array.isArray(products) ? products[0] : null;
      const issues = [];

      if (!product) issues.push('Product record not found.');
      if (product && (!product.is_active || product.publication_status !== 'live' || product.is_stage_one_sale !== true)) {
        issues.push('Product is not approved for the current sale.');
      }
      if (product && (!product.approved_by || !product.approved_at)) issues.push('Human product approval is missing.');
      if (product && product.inventory_source !== 'owned_stock') issues.push('Only verified owned stock is permitted during stage one.');
      if (product && (!product.stock_verified_at || !product.stock_verification_note)) issues.push('Owned stock verification is missing.');
      if (product && !['owner_approved_recorded_cost', 'invoice_verified'].includes(product.cost_verification_status)) {
        issues.push('Recorded product cost has not been approved for use.');
      }
      if (product && !product.cost_verification_note) issues.push('Cost verification note is missing.');
      if (product && product.shipping_policy !== 'customer_pays') issues.push('Customer-paid delivery policy is not approved.');
      if (product && (!Number.isFinite(product.sale_price) || Number(product.sale_price) <= 0)) issues.push('Retail price is missing.');
      if (product && (!Number.isFinite(product.cost_price) || Number(product.cost_price) < 0)) issues.push('Recorded product cost is missing.');
      if (product && (!product.image_url || !Array.isArray(product.images_array) || product.images_array.length === 0)) issues.push('Approved product images are missing.');

      if (product) {
        const sizes = Array.isArray(product.sizes_available) ? product.sizes_available : [];
        if (sizes.length > 0) {
          if (!requested.size || !sizes.includes(requested.size)) issues.push('A valid size is required.');
          const variantStock = Number(product.stock_by_variant?.[requested.size]);
          if (!Number.isFinite(variantStock) || requested.quantity > variantStock) issues.push('Requested size quantity exceeds verified stock.');
        } else if (requested.quantity > Number(product.stock_quantity || 0)) {
          issues.push('Requested quantity exceeds verified stock.');
        }
      }

      if (issues.length > 0) {
        return Response.json({
          error: 'Checkout blocked because a cart item is not ready.',
          product_id: requested.product_id,
          issues,
          external_actions_performed: false,
        }, { status: 400 });
      }

      verifiedItems.push({
        product_id: product.id,
        product_name: product.name,
        price: Number(product.sale_price),
        quantity: requested.quantity,
        size: requested.size,
        category: product.category,
        inventory_source: product.inventory_source,
        recorded_unit_cost: Number(product.cost_price),
        recorded_packaging_cost: Number(product.packaging_cost || 0),
      });
    }

    const subtotalAmountCents = verifiedItems.reduce(
      (sum, item) => sum + toCents(item.price) * item.quantity,
      0,
    );
    const shippingQuote = await calculateShippingQuote({
      base44,
      destination: 'australia',
      items: verifiedItems.map(item => ({ category: item.category, quantity: item.quantity })),
      cartSubtotalCents: subtotalAmountCents,
      freeShippingOverride: false,
    });

    if (!shippingQuote.ok) {
      return Response.json({
        error: shippingQuote.error || 'No approved Australian delivery rule is available.',
        external_actions_performed: false,
      }, { status: 400 });
    }

    const shippingAmountCents = shippingQuote.shippingCostCents;
    const shippingAmount = fromCents(shippingAmountCents);
    const displayedShippingAmountCents = toCents(metadata.displayed_shipping_amount);

    if (displayedShippingAmountCents !== shippingAmountCents) {
      return Response.json({
        error: 'Delivery changed while the order was being prepared. Please return to the review page and try again.',
        expected_shipping_amount: shippingAmount,
        external_actions_performed: false,
      }, { status: 409 });
    }

    const lineItems = verifiedItems.map(item => ({
      price_data: {
        currency: 'aud',
        product_data: {
          name: item.product_name,
          description: item.size ? `Size: ${item.size}` : undefined,
        },
        unit_amount: toCents(item.price),
      },
      quantity: item.quantity,
    }));

    if (shippingAmountCents > 0) {
      lineItems.push({
        price_data: {
          currency: 'aud',
          product_data: {
            name: 'Australian delivery',
            description: 'Combined package delivery calculated from the approved live shipping rule',
          },
          unit_amount: shippingAmountCents,
        },
        quantity: 1,
      });
    }

    const totalAmountCents = subtotalAmountCents + shippingAmountCents;
    const subtotalAmount = fromCents(subtotalAmountCents);
    const totalAmount = fromCents(totalAmountCents);
    const stripe = new Stripe(secretKey);
    const origin = safeOrigin(req);
    const shippingAddress = String(metadata.shipping_address || '').trim();

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      customer_email: customerEmail,
      customer_creation: 'always',
      billing_address_collection: 'required',
      shipping_address_collection: { allowed_countries: ['AU'] },
      automatic_tax: { enabled: false },
      line_items: lineItems,
      success_url: `${origin}/checkout-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/store/checkout?checkout=cancelled`,
      metadata: {
        customer_name: customerName,
        customer_email: customerEmail,
        items: JSON.stringify(verifiedItems),
        shipping_address: shippingAddress,
        shipping_country: 'Australia',
        shipping_amount_aud: shippingAmount.toFixed(2),
        subtotal_amount_aud: subtotalAmount.toFixed(2),
        discount_amount_aud: '0.00',
        support_contribution_aud: '0.00',
        total_amount_aud: totalAmount.toFixed(2),
        shipping_rule_id: shippingQuote.selectedRuleId || '',
        shipping_rule_name: String(shippingQuote.selectedRuleName || '').slice(0, 120),
        shipping_rule_method: shippingQuote.method || '',
        checkout_policy: 'stage_one_owned_stock_v1',
        gst_amount_aud: '0.00',
        abn: '22931809349',
      },
      payment_intent_data: {
        description: 'Gannon Waye Music merchandise order',
        receipt_email: customerEmail,
        metadata: {
          checkout_policy: 'stage_one_owned_stock_v1',
          shipping_amount_aud: shippingAmount.toFixed(2),
          gst_amount_aud: '0.00',
          abn: '22931809349',
        },
      },
    });

    return Response.json({
      url: session.url,
      sessionId: session.id,
      subtotal_amount: Number(subtotalAmount.toFixed(2)),
      shipping_amount: shippingAmount,
      total_amount: totalAmount,
      currency: 'aud',
      gst_amount: 0,
    });
  } catch (error) {
    if (base44) {
      await ensureSingleOpenDiagnostic(base44, `Checkout session creation failed: ${String(error?.message || error).slice(0, 300)}`, {
        diagnostic_type: 'session_creation_failure',
        severity: 'high',
        admin_message: 'No successful checkout response was returned. Confirm the Stripe session list before assuming a customer was charged.',
        recommended_fix: 'Review the function trace and resolve the exact error. Do not retry a customer charge manually without checking Stripe first.',
        source_chain: 'createCheckoutSession -> unhandled_error',
      });
    }
    return Response.json({
      error: 'Checkout could not be prepared.',
      friendly_message: 'Checkout could not be prepared. You have not been charged. Please try again or contact support.',
      external_actions_performed: false,
      details: String(error?.message || error),
    }, { status: 500 });
  }
});
