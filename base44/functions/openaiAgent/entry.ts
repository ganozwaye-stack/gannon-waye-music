// Safety hold: direct data-analysis route is disabled pending a controlled owner-approved design.
Deno.serve(() => Response.json({
  skipped: true,
  reason: 'Safety hold: direct data analysis is disabled. No private records were read and no external request was made.',
}, { status: 503 }));
