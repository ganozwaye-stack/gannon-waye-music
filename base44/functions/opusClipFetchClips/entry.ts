// Safety hold: provider clip retrieval is disabled pending a controlled owner-approved design.
Deno.serve(() => Response.json({
  skipped: true,
  reason: 'Safety hold: provider clip retrieval is disabled. No provider request was made and no media was imported.',
}, { status: 503 }));
