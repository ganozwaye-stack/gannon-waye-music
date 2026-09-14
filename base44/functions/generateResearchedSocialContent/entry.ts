// Safety hold: this legacy metered content-generation endpoint is disabled.
Deno.serve(() => Response.json({
  skipped: true,
  reason: 'Safety hold: automatic research and content generation is disabled. No external action was taken.',
}));
