// Disabled fail-closed: the legacy endpoint accepted unauthenticated release IDs and
// could disclose private titles to records and Slack. Re-enable only behind exact-owner
// authentication and the complete public Release approval contract.
Deno.serve(() => Response.json({
  success: true,
  skipped: true,
  reason: 'Release feedback intake disabled pending an authenticated owner-approved workflow',
}));