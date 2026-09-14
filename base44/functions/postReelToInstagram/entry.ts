// Safety hold: direct Instagram Graph API publication is disabled.
// A generic admin role or an editable clip status can never authorize a public post.
export default async function() {
  return Response.json({
    success: false,
    skipped: true,
    reason: 'Safety hold active: direct Instagram publication is disabled pending an exact-owner external-action approval.',
  }, { status: 409 });
}
