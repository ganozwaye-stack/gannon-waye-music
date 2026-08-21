// Disabled fail-closed: this legacy publisher could create or update a public GitHub
// repository containing hard-coded song availability and release-date claims.
Deno.serve(() => Response.json({
  success: true,
  skipped: true,
  reason: 'Public brand-kit publishing disabled pending owner-approved, data-driven content',
}));