import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

function buildMimeMessage({ to, subject, htmlBody }) {
  const boundary = `boundary_${Date.now()}`;
  const raw = [
    `From: Gannon Waye <me>`,
    `Reply-To: hello@gannonwaye.com`,
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
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json();
    const data = body.data;

    if (!data) return Response.json({ skipped: true });

    // FanMedia entity has name + file_url but no email by default.
    // We check if an email was passed (future-proof) or skip.
    const toEmail = data.email || data.author_email;
    if (!toEmail) return Response.json({ skipped: 'no email on submission' });

    const firstName = data.name ? data.name.split(' ')[0] : 'there';

    const htmlBody = `<!DOCTYPE html><html><body style="background:#0e1117;color:#f0ead6;font-family:Georgia,serif;margin:0;padding:0;">
<div style="max-width:600px;margin:0 auto;padding:40px 24px;">
  <div style="text-align:center;margin-bottom:32px;">
    <img src="https://media.base44.com/images/public/69eb7905ca6eb4180010f794/172f64a6b_0fac46594_generated_image-Edited.png" alt="Gannon Waye" style="height:50px;width:auto;" />
  </div>

  <h1 style="color:#f5d06e;font-size:26px;text-align:center;font-style:italic;">You're part of this now 🤍</h1>

  <p style="color:#c9b99a;font-size:15px;line-height:1.8;">Hey ${firstName},</p>
  <p style="color:#c9b99a;font-size:15px;line-height:1.8;">Your submission just landed. It's now part of something bigger than one song — it's part of a community of people who showed up and said yes to something real.</p>
  <p style="color:#c9b99a;font-size:15px;line-height:1.8;">Thank you for being here. Genuinely.</p>

  <div style="background:#1a1f2e;border:1px solid #2a2f3e;border-radius:12px;padding:24px;margin:28px 0;text-align:center;">
    <p style="color:#f5d06e;font-size:13px;letter-spacing:0.15em;text-transform:uppercase;margin:0 0 8px;">The Thank You Project</p>
    <p style="color:#c9b99a;font-size:14px;margin:0;">Debut single · Artwork reveal May 10, 2026</p>
  </div>

  <div style="text-align:center;margin:32px 0;">
    <a href="https://gannonwaye.com/back-this" style="display:inline-block;background:linear-gradient(90deg,#c9a84c,#f5d06e,#ffe08a,#f5d06e,#c9a84c);color:#0e1117;padding:14px 32px;border-radius:50px;font-size:13px;font-weight:700;text-decoration:none;letter-spacing:0.1em;text-transform:uppercase;">
      If this means something to you → Support it here
    </a>
  </div>

  <p style="color:#c9b99a;font-size:15px;line-height:1.8;">With love,</p>
  <p style="color:#f5d06e;font-size:18px;font-style:italic;margin-top:4px;">Gannon 🤍</p>

  <div style="border-top:1px solid #2a2f3e;margin-top:40px;padding-top:20px;text-align:center;">
    <p style="color:#555;font-size:11px;line-height:1.7;">
      You received this because you submitted to the fan wall at gannonwaye.com.<br/>
      <a href="https://gannonwaye.com/community" style="color:#888;">Visit the community</a>
    </p>
  </div>
</div></body></html>`;

    const { accessToken } = await base44.asServiceRole.connectors.getConnection('gmail');

    await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
      method: 'POST',
      headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ raw: buildMimeMessage({ to: toEmail, subject: `You're part of this 🤍 — Gannon Waye`, htmlBody }) })
    });

    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});