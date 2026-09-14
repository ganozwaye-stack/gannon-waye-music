// Safety hold: legacy trend generation could consume model credits and create
// internal records from a UI click. It has no approved execution lane.
Deno.serve(() => Response.json({
  skipped: true,
  reason: 'Safety hold: legacy trend generation is disabled. Use a reviewed, owner-approved workflow after the internal dispatcher is verified.',
}, { status: 503 }));
