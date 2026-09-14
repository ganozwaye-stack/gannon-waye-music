// Legacy operational audit hard stop.
//
// This endpoint intentionally performs no connector, network, model, scheduler,
// or entity work. It exists only to make any persisted legacy scheduler fail
// closed while the replacement receipt lane is tested and deployed.
const LEGACY_HOLD_CODE = 'legacy_operational_audit_held';

Deno.serve(async (req) => {
  if (req.method !== 'POST') {
    return Response.json({ error: 'POST required' }, { status: 405 });
  }

  return Response.json({
    error: 'Legacy operational audit is held. Use the owner-controlled Deego internal receipt test instead.',
    code: LEGACY_HOLD_CODE,
    external_actions: 0,
    network_requests: 0,
  }, { status: 503 });
});
