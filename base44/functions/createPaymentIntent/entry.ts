import Stripe from 'npm:stripe@14.21.0';
import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

// ── Pricing constants (must mirror CheckoutModal) ──────────────────────────
const AU_SHIPPING_FLAT = 12.95;
const FREE_SHIPPING_THRESHOLD = 150;
const DIGITAL_CATEGORIES = ['digital', 'support', 'donation'];

function isInternational(address) {
  if (!address) return false;
  const lower = address.toLowerCase();
  const intlKeywords = ['usa', 'united states', 'uk', 'united kingdom', 'canada', 'new zealand', 'nz', 'europe', 'india', 'singapore'];
  return intlKeywords.some(k => lower.includes(k));
}

function serverCalcTotal({ productPrice, quantity, category, discountPercent, shippingAddress, addSupport }) {
  const isDigital = DIGITAL_CATEGORIES.includes((category || '').toLowerCase());
  const itemTotal = productPrice * quantity;
  const discounted = itemTotal * (1 - discountPercent / 100);

  let shipping = 0;
  if (!isDigital) {
    if (isInternational(shippingAddress)) {
      shipping = 0; // Will be quoted manually — do not block payment
    } else if (discounted >= FREE_SHIPPING_THRESHOLD) {
      shipping = 0;
    } else {
      shipping = AU_SHIPPING_FLAT;
    }
  }

  const total = discounted + shipping + (addSupport || 0);
  return Math.round(total * 100); // cents
}

// ── CD / vinyl / music promo guard ────────────────────────────────────────
const PROMO_EXCLUDED_FROM_MERCH = ['THANKYOU15', 'FAMILYFRIENDS30'];
const MERCH_ONLY_CATEGORIES = ['apparel', 'accessories', 'bundle', 'poster', 'other'];
const MUSIC_CATEGORIES = ['cd', 'vinyl', 'digital'];

function validatePromoForCategory(promoCode, category) {
  if (!promoCode) return true;
  const code = promoCode.toUpperCase();
  if (PROMO_EXCLUDED_FROM_MERCH.includes(code) && MUSIC_CATEGORIES.includes((category || '').toLowerCase())) {
    return false;
  }
  return true;
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
  } catch (_) { /* best-effort — do not crash checkout */ }
}

Deno.serve(async (req) => {
  try {
    // ── Validate Stripe secret inside the handler, not at module load ──────
    const secretKey = (Deno.env.get('STRIPE_SECRET_KEY') || '').trim();

    if (!secretKey || !secretKey.startsWith('sk_')) {
      const issueSummary = 'STRIPE_SECRET_KEY is missing or invalid (must start with sk_) in createPaymentIntent';
      const base44 = createClientFromRequest(req);
      await ensureSingleOpenDiagnostic(base44, issueSummary, {
        admin_message: 'Checkout is unavailable — STRIPE_SECRET_KEY is missing or does not start with sk_. Set it in Base44 → Settings → Environment Variables.',
        recommended_fix: 'Go to Stripe Dashboard → Developers → API Keys → Reveal secret key → copy sk_live_... → add to Base44 Secrets as STRIPE_SECRET_KEY.',
        webhook_processed: false,
        source_chain: 'createPaymentIntent → key_validation_failed',
      });

      return Response.json({
        error: 'Checkout temporarily unavailable',
        friendly_message: 'Checkout is temporarily unavailable while payment settings are being verified. You have not been charged. Please try again shortly.',
        code: 'STRIPE_CONFIG_ERROR',
      }, { status: 503 });
    }

    const stripe = new Stripe(secretKey);
    const base44 = createClientFromRequest(req);
    const body = await req.json();
    const { amount, currency, customerEmail, customerName, productName, metadata, mode } = body;

    if (!customerEmail) {
      return Response.json({ error: 'Missing customerEmail' }, { status: 400 });
    }

    // ── Server-side price recalculation ───────────────────────────────────
    let verifiedAmountCents = null;

    if (metadata?.product_id) {
      // Fetch product from DB to get authoritative price
      const products = await base44.asServiceRole.entities.MerchProduct.filter({ id: metadata.product_id });
      if (products && products.length > 0) {
        const product = products[0];
        const productPrice = product.sale_price ?? product.price ?? 0;
        const quantity = parseInt(metadata.quantity || '1', 10);
        const category = product.category || metadata.product_category || '';

        // Validate promo eligibility for category
        const promoCode = metadata.promo_code || '';
        const discountPercent = validatePromoForCategory(promoCode, category)
          ? parseFloat(metadata.promo_discount_percent || '0')
          : 0;

        const addSupport = parseFloat(metadata.add_support || '0');
        const shippingAddress = metadata.shipping_address || '';

        verifiedAmountCents = serverCalcTotal({
          productPrice,
          quantity,
          category,
          discountPercent,
          shippingAddress,
          addSupport,
        });
      }
    }

    // Fall back to client-provided amount if we can't verify (e.g. support-only orders)
    const clientAmountCents = Math.round((amount || 0) * 100);
    const finalAmountCents = verifiedAmountCents !== null ? verifiedAmountCents : clientAmountCents;

    // ── PRE-ORDER / SETUP MODE ─────────────────────────────────────────────
    if (mode === 'setup') {
      const existing = await stripe.customers.list({ email: customerEmail, limit: 1 });
      const customer = existing.data.length > 0
        ? existing.data[0]
        : await stripe.customers.create({
            email: customerEmail,
            name: customerName || '',
            metadata: { source: 'gannonwaye_preorder' },
          });

      const setupIntent = await stripe.setupIntents.create({
        customer: customer.id,
        usage: 'off_session',
        metadata: {
          customer_name: customerName || '',
          product_name: productName || '',
          charge_amount_cents: String(finalAmountCents),
          ...(metadata || {}),
        },
      });

      return Response.json({
        clientSecret: setupIntent.client_secret,
        setupIntentId: setupIntent.id,
        customerId: customer.id,
        mode: 'setup',
        verified_amount_aud: (finalAmountCents / 100).toFixed(2),
      });
    }

    // ── IMMEDIATE PAYMENT MODE ─────────────────────────────────────────────
    if (!finalAmountCents || finalAmountCents <= 0) {
      return Response.json({ error: 'Amount required for payment mode' }, { status: 400 });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: finalAmountCents,
      currency: currency || 'aud',
      receipt_email: customerEmail,
      description: `${productName || 'Purchase'} — Gannon Waye`,
      metadata: {
        customer_name: customerName || '',
        product_name: productName || '',
        ...(metadata || {}),
      },
      automatic_payment_methods: { enabled: true },
    });

    return Response.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      mode: 'payment',
      verified_amount_aud: (finalAmountCents / 100).toFixed(2),
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});