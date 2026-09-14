// Safety hold: release-status changes never send fan email automatically.
// The only allowed sending path is sendReleaseEmailDraft after a Gannon-owned,
// fully approved ReleaseEmailDraft has been reviewed in the Release Email Studio.
Deno.serve(async () => Response.json({
  sent: false,
  skipped: true,
  reason: 'Automatic fan release-status email is disabled. Prepare and review a Release Email Studio draft before any send.',
}));
