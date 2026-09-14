// Safety hold: uploading even a creator draft is an external account action.
// This endpoint remains inert until a controlled, exact-owner approval path is implemented.
Deno.serve(async () => Response.json({
  success: false,
  skipped: true,
  reason: 'Safety hold active: TikTok uploads are disabled pending an exact-owner external-action approval.',
}, { status: 409 }));
