// Safety hold: provider callback processing is disabled pending a controlled owner-approved design.
Deno.serve(() => Response.json({
  skipped: true,
  reason: 'Safety hold: provider callback processing is disabled. No records were changed and no external message was sent.',
}, { status: 503 }));
