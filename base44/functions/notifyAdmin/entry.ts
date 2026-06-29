import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

// Central admin notification dispatcher
// Creates AdminNotification + sends Slack + sends Email
// Handles both direct invocation ({title, summary, ...}) and entity automation payloads ({event, data})

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json().catch(() => ({}));

    // Handle entity automation payloads: { event, data, old_data, changed_fields }
    let fields = body;
    if (body.event && body.data) {
      const eventType = body.event.type;
      const entityName = body.event.entity_name;
      const data = body.data;
      const entityTitle = data.title || data.name || data.metric_name || data.keyword || data.business_name || entityName;
      const verb = eventType === 'create' ? 'Created' : eventType === 'update' ? 'Updated' : eventType === 'delete' ? 'Deleted' : 'Changed';
      fields = {
        notification_type: 'system',
        title: `${entityName} ${verb}: ${entityTitle}`,
        summary: data.description || data.summary || data.notes || data.blocker_reason || data.next_action || '',
        severity: data.severity || data.priority === 'critical' ? 'critical' : data.priority === 'high' ? 'high' : 'info',
        linked_entity: entityName,
        linked_id: body.event.entity_id || data.id || '',
        requires_action: data.approval_required || data.status === 'needs_approval' || false,
        source: `Automation: ${entityName}`,
      };
    }

    const {
      notification_type = 'system',
      title,
      summary = '',
      severity = 'info',
      linked_route = '',
      linked_entity = '',
      linked_id = '',
      requires_action = false,
      source = 'System',
      slack_message = null,
    } = fields;

    if (!title) return Response.json({ error: 'title is required' }, { status: 400 });

    // 1. Save AdminNotification
    const notification = await base44.asServiceRole.entities.AdminNotification.create({
      notification_type,
      title,
      summary,
      severity,
      linked_route,
      linked_entity,
      linked_id,
      requires_action,
      source,
      is_read: false,
      delivered_slack: false,
      delivered_email: false,
    });

    // 2. Send Slack (optional — don't fail if Slack unavailable)
    const severityEmoji = { critical: '🚨', high: '⚠️', warning: '⚡', info: 'ℹ️' }[severity] || 'ℹ️';
    const slackText = slack_message || `${severityEmoji} *${title}*\n${summary || ''}${linked_route ? `\n→ ${linked_route}` : ''}`;

    let slackSent = false;
    try {
      await base44.asServiceRole.functions.invoke('sendSlackAlert', {
        message: slackText,
        channel: '#gannon-alerts',
      });
      slackSent = true;
    } catch (_) {
      // Slack optional
    }

    // 3. Send Email for high/critical (optional)
    let emailSent = false;
    if (severity === 'high' || severity === 'critical' || requires_action) {
      try {
        await base44.asServiceRole.integrations.Core.SendEmail({
          to: 'gannonwayemusic@gmail.com',
          from_name: 'Gannon Core',
          subject: `${severityEmoji} ${title}`,
          body: `<div style="font-family:sans-serif;max-width:600px;margin:auto;padding:20px;">
  <h2 style="color:#c9a84c">${title}</h2>
  ${summary ? `<p>${summary}</p>` : ''}
  ${linked_route ? `<p><strong>Action required:</strong> <a href="https://gannonwaye.com${linked_route}">${linked_route}</a></p>` : ''}
  <hr style="border:none;border-top:1px solid #333;margin:20px 0"/>
  <p style="font-size:12px;color:#666">Sent from Gannon Core · ${source}</p>
</div>`,
        });
        emailSent = true;
      } catch (_) {
        // Email optional
      }
    }

    // Update delivery flags
    try {
      await base44.asServiceRole.entities.AdminNotification.update(notification.id, {
        delivered_slack: slackSent,
        delivered_email: emailSent,
      });
    } catch (_) {
      // Non-critical
    }

    return Response.json({ success: true, notification_id: notification.id, slack_sent: slackSent, email_sent: emailSent });

  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});