// Safety hold: order fulfilment and notification helper is disabled pending a signed internal-trigger design.
Deno.serve(() => Response.json({
  skipped: true,
  reason: 'Safety hold: order fulfilment and notification is disabled. No order was changed and no external message or record sync was sent.',
}, { status: 503 }));
