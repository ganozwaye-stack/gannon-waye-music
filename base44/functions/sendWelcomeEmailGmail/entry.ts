import { createClientFromRequest } from 'npm:@base44/sdk@0.8.30';

Deno.serve(async (req) => {
  createClientFromRequest(req);
  return Response.json({
    success: true,
    skipped: true,
    reason: 'Automatic Gmail welcome messages are paused. An exact owner-approved message is required before any subscriber email is sent.',
    external_actions_performed: false,
  });
});
