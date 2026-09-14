// Safety hold: financial reconciliation helper is disabled pending a controlled owner-approved design.
Deno.serve(() => Response.json({
  skipped: true,
  reason: 'Safety hold: financial reconciliation is disabled. No payment-provider request or order record change was made.',
}, { status: 503 }));
