// Safety hold: social-account OAuth connection is disabled pending a controlled owner-approved design.
Deno.serve(() => Response.json({
  skipped: true,
  reason: 'Safety hold: social-account connection is disabled. No provider request was made and no credential was stored.',
}, { status: 503 }));
