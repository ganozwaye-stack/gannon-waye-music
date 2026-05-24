import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

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
    `--${boundary}--`
  ].join('\r\n');
  return btoa(unescape(encodeURIComponent(raw))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

Deno.serve(async (req) => {
  const base44 = createClientFromRequest(req);
  const payload = await req.json();
  const post = payload?.data;

  if (!post) {
    return Response.json({ error: 'No post data' }, { status: 400 });
  }

  const results = { notification: false, gmail: false, slack: false, errors: [] };

  // 1. Create dashboard notification via service role (works without user context)
  try {
    await base44.asServiceRole.entities.AdminNotification.create({
      notification_type: 'comment',
      title: `New community message from ${post.author_name || 'Anonymous'}`,
      summary: (post.content || '').substring(0, 150),
      severity: 'info',
      linked_route: '/admin/fans',
      linked_entity: 'FanPost',
      linked_id: post.id,
      requires_action: true,
      source: 'Community',
      is_read: false,
    });
    results.notification = true;
  } catch (e) {
    results.errors.push(`Dashboard notification failed: ${e.message}`);
  }

  // 2. Try Gmail via connector
  try {
    const { accessToken } = await base44.asServiceRole.connectors.getConnection('gmail');
    const htmlBody = `<!DOCTYPE html><html><body style="background:#0e1117;color:#f0ead6;font-family:sans-serif;padding:32px;">
<h2 style="color:#f5d06e;">💬 New Fan Message!</h2>
<p><strong>From:</strong> ${post.author_name || 'Anonymous'}</p>
<p><strong>Email:</strong> ${post.author_email || 'Not provided'}</p>
<p><strong>Type:</strong> ${post.type || 'message'}</p>
<div style="background:#1a1f2e;border:1px solid #2a2f3e;border-radius:8px;padding:16px;margin:16px 0;">
  <p style="margin:0;line-height:1.7;">${post.content}</p>
</div>
<a href="https://gannonwaye.base44.app/admin/fans" style="display:inline-block;background:#f5d06e;color:#0e1117;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:bold;margin-top:8px;">Review in Admin →</a>
</body></html>`;

    const gmailRes = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
      method: 'POST',
      headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ raw: buildMimeMessage({
        to: 'gannonwayemusic@gmail.com',
        subject: `💬 New fan message from ${post.author_name || 'Anonymous'}`,
        htmlBody,
      }) })
    });
    if (gmailRes.ok) {
      results.gmail = true;
    } else {
      const err = await gmailRes.text();
      results.errors.push(`Gmail send failed (${gmailRes.status}): ${err.substring(0, 200)}`);
    }
  } catch (e) {
    results.errors.push(`Gmail skipped: ${e.message}`);
  }

  // 3. Try Slack alert
  try {
    const { accessToken } = await base44.asServiceRole.connectors.getConnection('slack');
    const slackRes = await fetch('https://slack.com/api/chat.postMessage', {
      method: 'POST',
      headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        channel: '#gannon-alerts',
        text: `💬 New fan message from *${post.author_name || 'Anonymous'}*: ${(post.content || '').substring(0, 200)}`,
      })
    });
    const slackData = await slackRes.json();
    if (slackData.ok) results.slack = true;
    else results.errors.push(`Slack failed: ${slackData.error}`);
  } catch (e) {
    results.errors.push(`Slack skipped: ${e.message}`);
  }

  return Response.json({
    success: results.notification || results.gmail || results.slack,
    channels: results,
    post_id: post.id,
  });
});