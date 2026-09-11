import { createClientFromRequest } from 'npm:@base44/sdk@0.8.30';

// Notifies Gannon (Gmail + admin bell) whenever a fan registers a release
// reminder on the public Fan Reminders page. Called by the
// "Fan Reminder Registration → Owner Alert" workflow on every FanReminder create.

const OWNER_EMAIL = 'ganozwaye@gmail.com';

const REMINDER_TYPE_LABELS = {
  new_release: 'New release',
  album_drop: 'Album drop',
  next_single: 'Next single',
  tour_date: 'Tour date',
  merch_drop: 'Merch drop',
  general: 'General',
};

function esc(value) {
  return String(value ?? '').replace(/[&<>"']/g, (c) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  }[c]));
}

function buildMimeMessage({ to, subject, htmlBody }) {
  const boundary = `boundary_${Date.now()}`;
  const raw = [
    `From: Gannon Waye Site <me>`,
    `To: ${to}`,
    `Subject: ${subject}`,
    `MIME-Version: 1.0`,
    `Content-Type: multipart/alternative; boundary="${boundary}"`,
    ``,
    `--${boundary}`,
    `Content-Type: text/html; charset=UTF-8`,
    ``,
    htmlBody,
    `--${boundary}--`,
  ].join('\r\n');
  return btoa(unescape(encodeURIComponent(raw))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);

    // Security: admins may call directly; service-role automations (workflows) have no user.
    const user = await base44.auth.me().catch(() => null);
    if (user && user.role !== 'admin') {
      return Response.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await req.json().catch(() => ({}));
    const payload = body.data || {};
    const reminderId = body.reminder_id || payload.id || null;

    // Re-fetch the record by id when the trigger payload was trimmed.
    let reminder = payload.email ? payload : null;
    if (!reminder && reminderId) {
      reminder = await base44.asServiceRole.entities.FanReminder.get(reminderId).catch(() => null);
    }
    if (!reminder || !reminder.email) {
      return Response.json({ skipped: true, reason: 'Fan reminder record not found.' });
    }

    const typeLabel = REMINDER_TYPE_LABELS[reminder.reminder_type] || 'General';
    const remindAt = reminder.remind_at
      ? new Date(reminder.remind_at).toLocaleString('en-AU', { dateStyle: 'full', timeStyle: 'short' })
      : 'Not set';

    // Admin notification bell entry
    await base44.asServiceRole.entities.AdminNotification.create({
      notification_type: 'system',
      severity: 'info',
      title: 'New fan reminder registration',
      summary: `${reminder.name || reminder.email} signed up for a ${typeLabel.toLowerCase()} reminder${reminder.related_release ? ` (${reminder.related_release})` : ''}.`,
      source: 'fan_reminders_page',
      requires_action: false,
      linked_entity: 'FanReminder',
      linked_id: reminderId || '',
      linked_route: '/admin/fans',
    }).catch(() => null);

    const htmlBody = `<!DOCTYPE html><html><body style="background:#0e1117;color:#f0ead6;font-family:sans-serif;padding:32px;">
<h2 style="color:#f5d06e;">New Fan Reminder Registration</h2>
<p>A fan just registered a release reminder so you can track interest.</p>
<table style="width:100%;border-collapse:collapse;margin:16px 0;">
  <tr><td style="padding:8px;border-bottom:1px solid #2a2f3e;color:#f5d06e;">Fan</td><td style="padding:8px;border-bottom:1px solid #2a2f3e;">${esc(reminder.name || '—')}</td></tr>
  <tr><td style="padding:8px;border-bottom:1px solid #2a2f3e;color:#f5d06e;">Email</td><td style="padding:8px;border-bottom:1px solid #2a2f3e;">${esc(reminder.email)}</td></tr>
  <tr><td style="padding:8px;border-bottom:1px solid #2a2f3e;color:#f5d06e;">Reminder type</td><td style="padding:8px;border-bottom:1px solid #2a2f3e;">${esc(typeLabel)}</td></tr>
  <tr><td style="padding:8px;border-bottom:1px solid #2a2f3e;color:#f5d06e;">Related release</td><td style="padding:8px;border-bottom:1px solid #2a2f3e;">${esc(reminder.related_release || '—')}</td></tr>
  <tr><td style="padding:8px;border-bottom:1px solid #2a2f3e;color:#f5d06e;">Reminder date</td><td style="padding:8px;border-bottom:1px solid #2a2f3e;">${esc(remindAt)}</td></tr>
  ${reminder.custom_message ? `<tr><td style="padding:8px;border-bottom:1px solid #2a2f3e;color:#f5d06e;">Their note</td><td style="padding:8px;border-bottom:1px solid #2a2f3e;">${esc(reminder.custom_message)}</td></tr>` : ''}
</table>
<p style="font-size:12px;color:#8a8f9e;">The Daily Fan Reminder Sender will email the fan automatically on their reminder date.</p>
</body></html>`;

    const { accessToken } = await base44.asServiceRole.connectors.getConnection('gmail');
    const message = buildMimeMessage({
      to: OWNER_EMAIL,
      subject: `New Fan Reminder — ${reminder.name || reminder.email}`,
      htmlBody,
    });

    const sendRes = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
      method: 'POST',
      headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ raw: message }),
    });

    if (!sendRes.ok) {
      const errText = await sendRes.text().catch(() => '');
      return Response.json({ success: false, gmail_status: sendRes.status, error: errText.slice(0, 300) });
    }

    return Response.json({ success: true, notified: OWNER_EMAIL });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}