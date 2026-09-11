import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';
import { isOwner, snapshot, supervise } from './supervisor.mjs';

Deno.serve(async (req) => {
  if (req.method !== 'POST') return Response.json({ error: 'POST required' }, { status: 405 });
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me().catch(() => null);
    if (!user) return Response.json({ error: 'Authenticated owner session required. Scheduled identity is not yet verified.' }, { status: 401 });
    if (!isOwner(user)) return Response.json({ error: 'Owner access required' }, { status: 403 });
    const body = await req.json().catch(() => ({}));
    if (body.mode === 'supervisor_snapshot') {
      return Response.json({ tasks: await snapshot(base44.entities), scheduled_verified: false, whatsapp_delivered: false });
    }
    if (body.mode === 'admin_supervisor') {
      return Response.json(await supervise(base44.entities));
    }
    // The 4-hourly workflow still invokes the retired research mode. Answer it
    // with a benign skip instead of 409 so the loop stops logging failures,
    // while the no-spending mandate stays fully in force.
    if (body.mode === 'intelligence_with_deego_heartbeat') {
      return Response.json({
        skipped: true,
        reason: 'Legacy 4-hourly research is retired under the no-spending mandate. Supervision runs via supervisor_snapshot and admin_supervisor modes only.',
      });
    }
    return Response.json({ error: 'Research is disabled under the no-spending mandate. Unattended supervision requires verified scheduler authentication.' }, { status: 409 });
  } catch (error) {
    console.error('Deego supervisor failed', error?.name);
    return Response.json({ error: 'Review failed or partially completed. Retry to review outstanding tasks; no complete coverage claimed.' }, { status: 500 });
  }
});