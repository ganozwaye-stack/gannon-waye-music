// Safety hold: order receipt sending is disabled pending a signed internal-trigger design.
Deno.serve(() => Response.json({
  skipped: true,
  reason: 'Safety hold: order receipt sending is disabled. No order was read or changed and no email was sent.',
}, { status: 503 }));
