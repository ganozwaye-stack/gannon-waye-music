const LEGACY_HOLD_CODE = 'legacy_growth_opportunity_scanner_held';

Deno.serve(async (req) => {
  if (req.method !== 'POST') {
    return Response.json({ error: 'Method not allowed.' }, { status: 405 });
  }

  return Response.json({
    error: 'Legacy growth scanning is held. Owner-controlled runtime reconciliation is required before any internal review can be designed.',
    code: LEGACY_HOLD_CODE,
    skipped: true,
    external_actions: 0,
    network_requests: 0,
    internal_records_created: 0,
  }, { status: 503 });
});
