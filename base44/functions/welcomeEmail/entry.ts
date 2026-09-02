import { createClientFromRequest } from 'npm:@base44/sdk@0.8.30';

Deno.serve(async (req) => {
  createClientFromRequest(req);
  return Response.json({
    success: true,
    skipped: true,
    reason: 'Automatic welcome email sending is paused. This function performs no external action.',
    external_actions_performed: false,
  });
});
