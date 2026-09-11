import { createClientFromRequest } from 'npm:@base44/sdk@0.8.44';
import { buildMimeMessage } from '../../shared/gmailMime.ts';

// Readable labels for the reminder types fans choose on the /fan-reminders page.
const REMINDER_LABELS = {
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

    // Invoked by the Fan Reminder Registration workflow (no user token):
    // this endpoint only ever notifies the owner and reads nothing sensitive.
    const body = await req.json();
    const d = body?.data || body;

    if (!d || !d.email) {
      return Response.json({ error: 'No reminder data' }, { status: 400 });
    }

    const name = String(d.name || '').trim() || 'A fan';
    const email = String(d.email || '').trim();
    const type = REMINDER_LABELS[d.reminder_type] || d.reminder_type || 'Reminder';
    const remindAt = d.remind_at
      ? new Date(d.remind_at).toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric' })
      : 'the right time';
    const message = String(d.custom_message || '').trim();

    const { accessToken } = await base44.asServiceRole.connectors.getConnection('gmail');
    const adminEmail = 'gannonwayemusic@gmail.com';

    const htmlBody = `
      <!DOCTYPE html><html><body style="background:#0e0b08;color:#f0ead6;font-family:sans-serif;padding:32px;">
        <p style="font-size:11px;letter-spacing:0.25em;text-transform:uppercase;color:#c9a84c;margin:0 0 12px;">Fan Reminder Registered</p>
        <h2 style="color:#f5d06e;margin:0 0 20px;">Someone new is waiting to hear from you</h2>
        <table style="width:100%;border-collapse:collapse;margin:0 0 20px;">
          <tr><td style="padding:8px;border-bottom:1px solid #2a251c;color:#b8ab8a;width:140px;">Name</td><td style="padding:8px;border-bottom:1px solid #2a251c;">${esc(name)}</td></tr>
          <tr><td style="padding:8px;border-bottom:1px solid #2a251c;color:#b8ab8a;">Email</td><td style="padding:8px;border-bottom:1px solid #2a251c;">${esc(email)}</td></tr>
          <tr><td style="padding:8px;border-bottom:1px solid #2a251c;color:#b8ab8a;">Wants</td><td style="padding:8px;border-bottom:1px solid #2a251c;">${esc(type)}</td></tr>
          <tr><td style="padding:8px;border-bottom:1px solid #2a251c;color:#b8ab8a;">Remind from</td><td style="padding:8px;border-bottom:1px solid #2a251c;">${esc(remindAt)}</td></tr>
          ${message ? `<tr><td style="padding:8px;border-bottom:1px solid #2a251c;color:#b8ab8a;vertical-align:top;">Their note</td><td style="padding:8px;border-bottom:1px solid #2a251c;">${esc(message)}</td></tr>` : ''}
        </table>
        <p style="font-size:12px;color:#b8ab8a;">Registered just now from the Fan Reminders page. No action needed — this is your interest tracker.</p>
      </body></html>`;

    const raw = buildMimeMessage({
      to: adminEmail,
      subject: `New fan reminder — ${name} (${type})`,
      htmlBody
    });

    const sendRes = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
      method: 'POST',
      headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ raw })
    });

    // Also ring the admin bell so it is never missed in the dashboard.
    await base44.asServiceRole.entities.AdminNotification.create({
      notification_type: 'system',
      severity: 'info',
      title: `New fan reminder: ${name}`,
      summary: `${type} reminder registered by ${name} (${email}).`,
      source: 'fan_reminders_page',
      linked_route: '/fan-reminders',
      linked_entity: 'FanReminder',
      is_read: false
    }).catch(() => {});

    if (!sendRes.ok) {
      const errText = await sendRes.text();
      return Response.json({ success: false, error: errText }, { status: 502 });
    }

    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}