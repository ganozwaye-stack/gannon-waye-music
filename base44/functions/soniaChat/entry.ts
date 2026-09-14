// Safety hold: direct paid-generation route is disabled pending a controlled owner-approved design.
Deno.serve(() => Response.json({
  skipped: true,
  reason: 'Safety hold: this direct external-action endpoint is disabled. No paid generation or external request was made.',
}, { status: 503 }));
