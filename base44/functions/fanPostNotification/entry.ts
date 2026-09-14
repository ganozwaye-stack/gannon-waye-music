// Safety hold: this legacy external-action endpoint is disabled.
Deno.serve(() => Response.json({
  skipped: true,
  reason: 'Safety hold: fan-post email and alert delivery is disabled. No external action was taken.',
}));
