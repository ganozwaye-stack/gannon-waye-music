// Safety hold: this legacy external-action endpoint is disabled.
Deno.serve(() => Response.json({
  skipped: true,
  reason: 'Safety hold: Drive webhook processing is disabled. No external action was taken.',
}));
