// Safety hold: publication changes never create subscriber-send work automatically.
// The Release Status Update workflow may prepare one reviewable draft only after
// full public-release approval; sending remains a separate owner action.
Deno.serve(async () => Response.json({
  drafted: false,
  sent: 0,
  skipped: true,
  reason: 'Automatic subscriber notification is disabled. Use the approved Release Email Studio workflow.',
}));
