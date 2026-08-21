// Disabled fail-closed: unverified entity-event payloads must never publish directly
// to Instagram. Merch and release-adjacent social content must enter an owner approval queue.
Deno.serve(() => Response.json({
  success: true,
  skipped: true,
  reason: 'Automatic Instagram publishing disabled; use an owner-approved draft workflow',
}));