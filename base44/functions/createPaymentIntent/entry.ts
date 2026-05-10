import Stripe from 'npm:stripe@14.21.0';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY'));

Deno.serve(async (req) => {
  try {
    const { amount, currency, customerEmail, customerName, productName, metadata, mode } = await req.json();

    if (!customerEmail) {
      return Response.json({ error: 'Missing customerEmail' }, { status: 400 });
    }

    // ── PRE-ORDER / SETUP MODE ──────────────────────────────────────────────
    // Saves the card now. Actual charge happens June 1 2026 (off-session).
    if (mode === 'setup') {
      // Find or create Stripe customer so we can charge off-session later
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
          charge_amount_cents: String(Math.round((amount || 0) * 100)),
          charge_date: '2026-06-01',
          ...(metadata || {}),
        },
      });

      return Response.json({
        clientSecret: setupIntent.client_secret,
        setupIntentId: setupIntent.id,
        customerId: customer.id,
        mode: 'setup',
      });
    }

    // ── IMMEDIATE PAYMENT MODE ──────────────────────────────────────────────
    if (!amount) {
      return Response.json({ error: 'Amount required for payment mode' }, { status: 400 });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
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
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});