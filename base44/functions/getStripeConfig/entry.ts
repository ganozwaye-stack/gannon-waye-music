// Public endpoint — returns publishable key with format validation
Deno.serve(async (req) => {
  try {
    const key = Deno.env.get('STRIPE_PUBLISHABLE_KEY');
    if (!key) {
      return Response.json({ error: 'Stripe publishable key not configured' }, { status: 500 });
    }
    // Validate key format — must start with pk_live_ or pk_test_
    if (!key.startsWith('pk_live_') && !key.startsWith('pk_test_')) {
      return Response.json({ error: 'STRIPE_PUBLISHABLE_KEY is invalid — must start with pk_live_ or pk_test_' }, { status: 500 });
    }
    return Response.json({ publishableKey: key });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});