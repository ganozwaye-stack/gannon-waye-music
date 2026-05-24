import Stripe from 'npm:stripe@14.21.0';
import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

const AU_SHIPPING_FLAT = 12.95;
const FREE_SHIPPING_THRESHOLD = 150;
const DIGITAL_CATEGORIES = ['digital', 'support', 'donation'];

function isInternational(address) {
  if (!address) return false;
  const lower = address.toLowerCase();
  return ['usa', 'united states', 'uk', 'united kingdom', 'canada', 'new zealand', 'nz', 'europe', 'india', 'singapore'].some(k => lower.includes(k));
}

function calcAmountCents({ productPrice, quantity, discountPercent, category, shippingAddress, addSupport }) {
  const isDigital = DIGITAL_CATEGORIES.includes((category || '').toLowerCase());
  const itemTotal = productPrice * quantity;
  const discounted = itemTotal * (1 - discountPercent / 100);
  let shipping = 0;
  if (!isDigital) {
    if (!isInternational(shippingAddress) && discounted < FREE_SHIPPING_THRESHOLD) {
      shipping = AU_SHIPPING_FLAT;
    }
  }
  return Math.round((discounted + shipping + (addSupport || 0)) * 100);
}

Deno.serve(async (req) => {
  try {
    const secretKey = Deno.env.get('STRIPE_SECRET_KEY');
    if (!secretKey || !secretKey.startsWith('sk_')) {
      return Response.json({ error: 'Stripe secret key not configured or invalid' }, { status: 500 });
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

    if (metadata?.product_id) {
      const products = await base44.asServiceRole.entities.MerchProduct.filter({ id: metadata.product_id });
      if (products && products.length > 0) {
        const product = products[0];
        productPrice = product.sale_price ?? product.price ?? 0;
        category = product.category || '';
        const quantity = parseInt(metadata.quantity || '1', 10);
        const discountPercent = parseFloat(metadata.promo_discount_percent || '0');
        const shippingAddress = metadata.shipping_address || '';
        amountCents = calcAmountCents({ productPrice, quantity, discountPercent, category, shippingAddress, addSupport: parseFloat(metadata.add_support || '0') });
      }
    }

    // Fallback to client-provided amount
    if (!amountCents) {
      amountCents = Math.round((amount || 0) * 100);
    }

    if (!amountCents || amountCents <= 0) {
      return Response.json({ error: 'Invalid order amount' }, { status: 400 });
    }

    const origin = req.headers.get('origin') || 'https://gannonwaye.com';

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      customer_email: customerEmail,
      line_items: [
        {
          price_data: {
            currency: 'aud',
            product_data: {
              name: productName || 'Gannon Waye Store',
              description: metadata?.size ? `Size: ${metadata.size}` : undefined,
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
      },
      payment_intent_data: {
        description: `${productName || 'Purchase'} — Gannon Waye`,
        receipt_email: customerEmail,
        metadata: {
          customer_name: customerName || '',
          product_name: productName || '',
          ...(metadata || {}),
        },
      },
    });

    return Response.json({ url: session.url, sessionId: session.id });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});