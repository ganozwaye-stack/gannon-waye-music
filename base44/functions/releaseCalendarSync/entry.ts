// Disabled fail-closed: this former weekly automation copied private Release
// titles and dates to Google Calendar. Re-enable only with an exact owner-approved
// public Release contract and a separate calendar-disclosure approval.
Deno.serve(() => Response.json({
  success: true,
  skipped: true,
  synced: 0,
  reason: 'Release calendar sync disabled pending explicit owner-approved disclosure workflow',
}));
