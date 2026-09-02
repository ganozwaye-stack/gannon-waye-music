import { createClientFromRequest } from 'npm:@base44/sdk@0.8.30';

Deno.serve(async (req) => {
  createClientFromRequest(req);
  return Response.json({
    success: true,
    skipped: true,
    reason: 'Automatic subscriber welcome emails and admin emails are paused. Consent records may be saved without any external message.',
    external_actions_performed: false,
  });
});
