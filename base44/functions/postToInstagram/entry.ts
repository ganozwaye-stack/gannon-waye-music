// Disabled fail-closed: this legacy direct publisher did not verify the exact owner-approved
// Release contract and could publish release claims from generic approved content.
Deno.serve(() => Response.json({
  success: true,
  skipped: true,
  reason: 'Direct publisher disabled; use a claim-aware owner-approved draft workflow',
}));