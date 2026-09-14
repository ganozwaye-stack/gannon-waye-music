// Safety hold: direct paid video generation is disabled pending a controlled owner-approved design.
Deno.serve(() => Response.json({
  skipped: true,
  reason: 'Safety hold: direct video generation is disabled. No provider request or paid-credit use was made.',
}, { status: 503 }));
