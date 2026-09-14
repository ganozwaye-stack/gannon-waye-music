// Safety hold: legacy self-improvement work is disabled.
//
// This endpoint intentionally performs no analysis, record writes, network
// requests, model calls, or external actions. It exists solely so a persisted
// legacy schedule fails closed while runtime configuration is reconciled.
const LEGACY_HOLD_CODE = 'legacy_self_improvement_held';

Deno.serve(async (req) => {
  if (req.method !== 'POST') {
    return Response.json({ error: 'POST required' }, { status: 405 });
  }

  return Response.json({
    error: 'Legacy self-improvement work is held. Owner-controlled runtime reconciliation is required.',
    code: LEGACY_HOLD_CODE,
    skipped: true,
    external_actions: 0,
    network_requests: 0,
    internal_records_created: 0,
  }, { status: 503 });
});
