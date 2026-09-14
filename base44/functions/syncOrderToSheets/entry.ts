// Safety hold: this legacy external-action endpoint is disabled.
Deno.serve(() => Response.json({
  skipped: true,
  reason: 'Safety hold: automatic order spreadsheet sync is disabled. No external action was taken.',
}));
