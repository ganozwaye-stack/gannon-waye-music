import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';
import crypto from 'node:crypto';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { subscriber_email, subscriber_name } = await req.json();

    if (!subscriber_email) {
      return Response.json({ error: 'Email is required' }, { status: 400 });
    }

    // Generate unique token for personal checklist access
    const checklist_token = crypto.randomBytes(16).toString('hex');

    // Create tracker record
    const tracker = await base44.asServiceRole.entities.GiftRequirementTracker.create({
      subscriber_email,
      subscriber_name,
      status: 'not_started',
      checklist_token,
    });

    return Response.json({
      success: true,
      tracker_id: tracker.id,
      checklist_token,
      checklist_url: `${Deno.env.get('BASE44_APP_URL')}/gift-checklist?token=${checklist_token}`,
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});