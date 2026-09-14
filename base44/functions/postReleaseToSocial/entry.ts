// Safety hold: no backend path may publish a release to Instagram automatically.
// Social posts must be prepared as drafts and published only after a separate,
// channel-specific owner approval in the relevant platform.
Deno.serve(async () => Response.json({
  posted: false,
  skipped: true,
  reason: 'Automatic Instagram publication is disabled. Prepare a draft and obtain channel-specific owner approval before posting.',
}));
