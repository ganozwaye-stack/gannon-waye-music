import { createClientFromRequest } from 'npm:@base44/sdk@0.8.44';
import { buildMimeMessage } from '../../shared/gmailMime.ts';

const REMINDER_TYPE_LABELS = {
  new_release: 'New Release',
  album_drop: 'Album Release',
  next_single: 'Next Single',
  merch_drop: 'Merch Drop',
  tour_date: 'Tour / Live Show',
  general: 'Custom Reminder',
};

const esc = (s) => String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const payload = await req.json();
    const reminder = payload?.data;

    if (!reminder || !reminder.email) {
      return Response.json({ error: 'No reminder data' }, { status: 400 });
    }

    const results = { notification: false, gmail: false, errors: [] };
    const typeLabel = REMINDER_TYPE_LABELS[reminder.reminder_type] || 'Reminder';
    const displayName = reminder.name || reminder.email;

    // 1. Dashboard notification so the registration also shows in the admin bell
    try {
      await base44.asServiceRole.entities.AdminNotification.create({
        notification_type: 'system',
        title: `New release reminder registration from ${displayName}`,
        summary: `${typeLabel} — ${reminder.email}`,
        severity: 'info',
        linked_route: '/admin/fans',
        linked_entity: 'FanReminder',
        source: 'Fan Reminders',
        is_read: false,
      });
      results.notification = true;
    } catch (e) {
      results.errors.push(`Dashboard notification failed: ${e.message}`);
    }

    // 2. Gmail alert to Gannon — sent straight from the fan's registration
    try {
      const { accessToken } = await base44.asServiceRole.connectors.getConnection('gmail');
      const htmlBody = `<!DOCTYPE html><html><body style="background:#0e1117;color:#f0ead6;font-family:sans-serif;padding:32px;">
<h2 style="color:#f5d06e;">New Release Reminder Registration</h2>
<p><strong>Name:</strong> ${esc(reminder.name) || 'Not provided'}</p>
<p><strong>Email:</strong> ${esc(reminder.email)}</p>
<p><strong>Reminder type:</strong> ${esc(typeLabel)}</p>
<p><strong>Remind at:</strong> ${esc(reminder.remind_at) || 'Not specified'}</p>
${reminder.custom_message ? `<div style="background:#1a1f2e;border:1px solid #2a2f3e;border-radius:8px;padding:16px;margin:16px 0;"><p style="margin:0;line-height:1.7;">${esc(reminder.custom_message)}</p></div>` : ''}
<p>A fan just registered for a reminder on the site — another early interest signal for the next release.</p>
<a href="https://gannonwaye.base44.app/admin/fans" style="display:inline-block;background:#f5d06e;color:#0e1117;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:bold;margin-top:8px;">Review in Admin</a>
</body></html>`;

      const gmailRes = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
        method: 'POST',
        headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ raw: buildMimeMessage({
          to: 'gannonwayemusic@gmail.com',
          subject: `New release reminder registration from ${displayName}`,
          htmlBody,
        }) })
      });
      if (gmailRes.ok) {
        results.gmail = true;
      } else {
        results.errors.push(`Gmail send failed (${gmailRes.status})`);
      }
    } catch (e) {
      results.errors.push(`Gmail skipped: ${e.message}`);
    }

    return Response.json({ success: results.notification || results.gmail, channels: results });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}