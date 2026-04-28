import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

function buildMimeMessage({ to, subject, htmlBody }) {
  const boundary = `boundary_${Date.now()}`;
  const raw = [
    `From: Gannon Waye <me>`,
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

    if (!data?.email) return Response.json({ skipped: true });

    const { accessToken } = await base44.asServiceRole.connectors.getConnection('gmail');

    const htmlBody = `<!DOCTYPE html><html><body style="background:#0e1117;color:#f0ead6;font-family:Georgia,serif;margin:0;padding:0;">
<div style="max-width:600px;margin:0 auto;padding:40px 24px;">
  <div style="text-align:center;margin-bottom:32px;">
    <img src="https://media.base44.com/images/public/69eb7905ca6eb4180010f794/172f64a6b_0fac46594_generated_image-Edited.png" alt="Gannon Waye" style="height:60px;width:auto;" />
  </div>
  <h1 style="color:#f5d06e;font-size:30px;text-align:center;margin-bottom:8px;">Hey ${data.name || 'there'} 👋</h1>
  <p style="font-size:16px;line-height:1.7;color:#c9b99a;text-align:center;margin-bottom:24px;">Welcome to the Gannon Waye community. I'm so glad you're here.</p>
  <div style="background:#1a1f2e;border:1px solid #2a2f3e;border-radius:12px;padding:28px;margin-bottom:24px;">
    <p style="font-size:15px;line-height:1.8;color:#d4c9a8;margin:0 0 16px;">I write songs about the real, messy parts of being human — grief that transforms you, growth that comes from breaking open, and the quiet power of finally becoming yourself.</p>
    <p style="font-size:15px;line-height:1.8;color:#d4c9a8;margin:0;">My debut single <strong style="color:#f5d06e;">"Thank You"</strong> arrives very soon. You'll be the first to know everything. Keep an eye on your inbox.</p>
  </div>
  <div style="text-align:center;margin-bottom:28px;">
    <a href="https://gannonwaye.com/community" style="display:inline-block;background:linear-gradient(90deg,#c9a84c,#f5d06e,#ffe08a,#f5d06e,#c9a84c);color:#0e1117;padding:14px 32px;border-radius:50px;font-size:14px;font-weight:700;text-decoration:none;letter-spacing:0.1em;text-transform:uppercase;">Join the Community</a>
  </div>
  <div style="text-align:center;margin-bottom:20px;">
    <a href="https://gannonwaye.com/email-preferences" style="display:inline-block;border:1px solid #f5d06e44;color:#f5d06e;padding:10px 24px;border-radius:50px;font-size:13px;text-decoration:none;">Choose what you hear from me →</a>
  </div>
  <p style="font-size:12px;color:#555;text-align:center;line-height:1.6;">You subscribed at gannonwaye.com. <a href="https://gannonwaye.com/email-preferences" style="color:#f5d06e;">Manage preferences</a></p>
</div></body></html>`;

    await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
      method: 'POST',
      headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ raw: buildMimeMessage({ to: data.email, subject: `Welcome to the Gannon Waye community 🎵`, htmlBody }) })
    });

    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});