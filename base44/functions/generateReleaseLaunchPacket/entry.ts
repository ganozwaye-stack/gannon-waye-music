// Safety hold: private release creation must remain quiet by default.
//
// This legacy endpoint intentionally creates no campaign material, internal
// records, network requests, or external actions. Individual drafts can be
// prepared later only through separately reviewed owner-controlled steps.
const HOLD_CODE = 'private_launch_packet_generation_held';

export default async function(req) {
  if (req.method !== 'POST') {
    return Response.json({ error: 'POST required' }, { status: 405 });
  }

  return Response.json({
    error: 'Automatic launch-packet creation is held. Create and approve individual private drafts when you choose.',
    code: HOLD_CODE,
    skipped: true,
    external_actions: 0,
    network_requests: 0,
    internal_records_created: 0,
  }, { status: 503 });
}
