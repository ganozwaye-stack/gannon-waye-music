// Safety hold: this legacy external-action endpoint is disabled.
Deno.serve(() => Response.json({
  skipped: true,
  reason: 'Safety hold: fan auto-reply and mail sending is disabled. No external action was taken.',
}));
