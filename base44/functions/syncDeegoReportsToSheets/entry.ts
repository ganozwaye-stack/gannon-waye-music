// Safety hold: this legacy endpoint writes business data to Google Sheets.
// It performs no connector action until an exact-owner, scoped export workflow is implemented.
Deno.serve(async () => Response.json({
  success: false,
  skipped: true,
  reason: 'Safety hold active: Deego report exports to Google Sheets are disabled pending an owner-confirmed controlled export.',
}, { status: 409 }));
