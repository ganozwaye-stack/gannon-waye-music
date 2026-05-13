// Public endpoint — no auth required, just returns the publishable key
Deno.serve(async (req) => {
  try {
    const key = Deno.env.get('STRIPE_PUBLISHABLE_KEY');
    if (!key) {
      return Response.json({ error: 'Stripe not configured' }, { status: 500 });
    }
    return Response.json({ publishableKey: key });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});