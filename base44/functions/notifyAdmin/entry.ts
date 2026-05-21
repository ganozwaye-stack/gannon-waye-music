import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

// Central admin notification dispatcher
// Creates AdminNotification + sends Slack + sends Email
// Call from any function: invoke('notifyAdmin', { type, title, summary, severity, route, entity, id, requiresAction })

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json().catch(() => ({}));

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
    } = body;

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

    // 2. Send Slack
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

    // 3. Send Email for high/critical
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
    await base44.asServiceRole.entities.AdminNotification.update(notification.id, {
      delivered_slack: slackSent,
      delivered_email: emailSent,
    });

    return Response.json({ success: true, notification_id: notification.id, slack_sent: slackSent, email_sent: emailSent });

  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});