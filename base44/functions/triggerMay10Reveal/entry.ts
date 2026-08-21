// Disabled fail-closed: SiteReveal is not an authoritative Release source.
// Public release visibility is controlled only by the owner-approved Release workflow.
Deno.serve(() => Response.json({
  success: true,
  skipped: true,
  reason: 'Legacy reveal trigger disabled; use the exact Release approval workflow',
}));
