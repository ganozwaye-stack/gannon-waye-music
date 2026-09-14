// Safety hold: provider webhook registration is disabled pending a controlled owner-approved design.
Deno.serve(() => Response.json({
  skipped: true,
  reason: 'Safety hold: provider webhook registration is disabled. No provider configuration was changed and no secret was returned.',
}, { status: 503 }));
