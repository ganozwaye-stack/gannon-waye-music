// Disabled fail-closed: the legacy scheduled brief read private and unapproved Release
// titles and dates. Public release countdowns require the complete owner approval contract.
Deno.serve(() => Response.json({
  success: true,
  skipped: true,
  reason: 'Release countdown brief disabled pending a fully approved Release record',
}));