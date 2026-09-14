// Safety hold: downstream order automation is disabled pending a signed internal-trigger design.
Deno.serve(() => Response.json({
  skipped: true,
  reason: 'Safety hold: downstream order automation is disabled. No inventory was changed and no receipt or external message was sent.',
}, { status: 503 }));
