import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

// Called by entity automation when a new ApprovalQueue item is created
Deno.serve(async (req) => {
  const base44 = createClientFromRequest(req);
  const payload = await req.json();
  const item = payload?.data;

  if (!item) {
    return Response.json({ error: 'No data' }, { status: 400 });
  }

  await base44.asServiceRole.entities.AdminNotification.create({
    notification_type: 'approval',
    title: `Approval Required: ${item.title || item.task_title || 'New Item'}`,
    summary: item.description || item.reason || 'A new approval queue item needs your review.',
    severity: item.risk_level === 'high' ? 'high' : 'info',
    requires_action: true,
    linked_route: '/admin/approval-queue',
    linked_entity: 'ApprovalQueue',
    linked_id: item.id,
    source: item.agent_name || 'System',
    is_read: false,
  });

  return Response.json({ success: true });
});