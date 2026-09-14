// Safety hold: legacy autonomous research could consume model credits and create
// internal records without a verified receipt-producing dispatcher.
Deno.serve(() => Response.json({
  skipped: true,
  reason: 'Safety hold: legacy autonomous research is disabled. Use a reviewed, owner-approved workflow after the internal dispatcher is verified.',
}, { status: 503 }));
