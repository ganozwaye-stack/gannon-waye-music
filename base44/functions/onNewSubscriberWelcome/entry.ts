import { createClientFromRequest } from 'npm:@base44/sdk@0.8.30';

Deno.serve(async (req) => {
  createClientFromRequest(req);
  return Response.json({
    success: true,
    skipped: true,
    reason: 'Automatic subscriber email sending is paused. New consent records may be saved, but no message may be sent without an exact owner-approved campaign or transactional rule.',
    external_actions_performed: false,
  });
});
