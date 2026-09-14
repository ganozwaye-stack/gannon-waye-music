// Safety hold: an editable approval status is not authority to publish.
// This endpoint cannot post or invoke a social connector until a controlled
// exact-owner, content-bound, one-use approval workflow is implemented and tested.
export default async function() {
  return Response.json({
    success: false,
    skipped: true,
    reason: 'Safety hold active: Reel publication is disabled pending an exact-owner external-action approval.',
  }, { status: 409 });
}
