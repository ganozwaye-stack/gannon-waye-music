const IMPORTER_HOLD_CODE = 'distributor_importer_held';

Deno.serve(async (req) => {
  if (req.method !== 'POST') {
    return Response.json({ error: 'POST required' }, { status: 405 });
  }

  // Safety hold: importer access, credential use, network requests, and
  // Release-record mutation are all disabled until a separately approved
  // owner-controlled workflow is implemented and reviewed.
  return Response.json(
    {
      error: 'Distributor importer is held. Release records remain private until the owner-approved release workflow completes.',
      code: IMPORTER_HOLD_CODE,
      skipped: true,
      external_actions: 0,
      network_requests: 0,
    },
    { status: 503 },
  );
});

