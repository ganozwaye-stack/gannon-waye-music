import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

// AI Message Bus Router — routes AgentMessages to the correct assistant.
// Admin-only. Never auto-posts, auto-pays, or deploys.

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (user?.role !== 'admin') {
      return Response.json({ error: 'Forbidden: Admin only' }, { status: 403 });
    }

    const body = await req.json();
    const { message_id, action = 'route' } = body;

    if (action === 'status') {
      // Return message bus health summary
      const messages = await base44.asServiceRole.entities.AgentMessage.list('-created_date', 50);
      const byStatus = messages.reduce((acc, m) => {
        acc[m.status] = (acc[m.status] || 0) + 1;
        return acc;
      }, {});
      const byType = messages.reduce((acc, m) => {
        acc[m.message_type] = (acc[m.message_type] || 0) + 1;
        return acc;
      }, {});
      return Response.json({
        total: messages.length,
        by_status: byStatus,
        by_type: byType,
        last_message: messages[0] || null,
      });
    }

    if (action === 'create') {
      const { from_system, to_system, message_type, priority, subject, summary, payload_json, linked_route, requires_approval, risk_level } = body;
      const msg = await base44.asServiceRole.entities.AgentMessage.create({
        from_system, to_system, message_type,
        priority: priority || 'medium',
        subject, summary, payload_json,
        linked_route: linked_route || '/admin/agent-message-bus',
        status: 'new',
        requires_approval: requires_approval || false,
        created_by_agent: from_system || 'openAIMessageRouter',
        risk_level: risk_level || 'low',
        cost_estimate: 0,
      });
      return Response.json({ success: true, message_id: msg.id });
    }

    if (action === 'resolve' && message_id) {
      await base44.asServiceRole.entities.AgentMessage.update(message_id, {
        status: 'resolved',
        resolved_date: new Date().toISOString(),
      });
      return Response.json({ success: true, resolved: message_id });
    }

    return Response.json({ error: 'Unknown action. Use: status, create, resolve' }, { status: 400 });

  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});