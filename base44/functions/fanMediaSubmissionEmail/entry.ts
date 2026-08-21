// Disabled fail-closed: entity automations must not send external email without an
// authenticated, owner-approved action. Fan submissions remain stored for admin review.
Deno.serve(() => Response.json({
  success: true,
  skipped: true,
  reason: 'Automatic fan-submission email disabled pending explicit owner approval',
}));