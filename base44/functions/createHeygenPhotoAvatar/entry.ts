// Safety hold: provider avatar creation is disabled pending a controlled owner-approved design.
Deno.serve(() => Response.json({
  skipped: true,
  reason: 'Safety hold: provider avatar creation is disabled. No provider request or paid-credit use was made.',
}, { status: 503 }));
