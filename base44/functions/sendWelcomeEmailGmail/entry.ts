import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

function buildMimeMessage({ to, subject, htmlBody, fromName }) {
  const boundary = `boundary_${Date.now()}`;
  const raw = [
    `From: ${fromName} <me>`,
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
    const { email, name } = body.data || body;

    const { accessToken } = await base44.asServiceRole.connectors.getConnection('gmail');

    const htmlBody = `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"></head>
<body style="background:#0e1117;color:#f0ead6;font-family:'Georgia',serif;margin:0;padding:0;">
  <div style="max-width:600px;margin:0 auto;padding:40px 24px;">
    <div style="text-align:center;margin-bottom:32px;">
      <img src="https://media.base44.com/images/public/69eb7905ca6eb4180010f794/172f64a6b_0fac46594_generated_image-Edited.png" alt="Gannon Waye" style="height:60px;width:auto;" />
    </div>
    <h1 style="color:#f5d06e;font-size:28px;text-align:center;margin-bottom:8px;">Hey ${name || 'there'} 👋</h1>
    <p style="font-size:16px;line-height:1.7;color:#c9b99a;text-align:center;margin-bottom:24px;">
      Welcome to the Gannon Waye community. I'm so glad you're here.
    </p>
    <div style="background:#1a1f2e;border:1px solid #2a2f3e;border-radius:12px;padding:28px;margin-bottom:28px;">
      <p style="font-size:15px;line-height:1.8;color:#d4c9a8;">
        I write songs about the real, messy parts of being human — grief that transforms you, growth that comes from breaking open, and the quiet power of finally becoming yourself.
      </p>
      <p style="font-size:15px;line-height:1.8;color:#d4c9a8;margin-top:16px;">
        My debut single <strong style="color:#f5d06e;">"Thank You"</strong> is out now. Check out the site, join the community wall, and stream it today!
      </p>
    </div>
    <div style="background:#0e1a0e;border:1px solid #2a3e2a;border-radius:12px;padding:24px;margin-bottom:28px;">
      <p style="color:#7ecf7e;font-size:13px;letter-spacing:0.2em;text-transform:uppercase;margin:0 0 12px;">🎁 A thank-you gift — if you'd like one</p>
      <p style="font-size:14px;line-height:1.8;color:#c9b99a;margin:0;">For a further discounted rate: You must have subscribed to the website <a href="https://www.gannonwaye.com" style="color:#f5d06e;">www.gannonwaye.com</a>, follow Gannon on Instagram <a href="https://www.instagram.com/ganozwaye" style="color:#f5d06e;">@ganozwaye</a> and also on TikTok <a href="https://www.tiktok.com/@gannonwaye" style="color:#f5d06e;">@gannonwaye</a>, like, comment and share the pinned <em>"Sing Along Here"</em> video tagging Gannon. Send <strong style="color:#f5d06e;">'DONE'</strong> and a message of support in response to this welcome email and when reviewed. The gift will be advised via email, sent after manual approval. Instagram and TikTok actions are not automatically verified. Do the steps in order or the offer may not be approved.</p>
    </div>
    <div style="text-align:center;margin-bottom:28px;">
      <a href="https://gannonwaye.com/community" style="display:inline-block;background:linear-gradient(90deg,#c9a84c,#f5d06e,#ffe08a,#f5d06e,#c9a84c);color:#0e1117;padding:14px 32px;border-radius:50px;font-size:14px;font-weight:600;text-decoration:none;letter-spacing:0.1em;text-transform:uppercase;">
        Join the Community
      </a>
    </div>
    <p style="font-size:13px;color:#666;text-align:center;line-height:1.6;">
      You're receiving this because you subscribed at gannonwaye.com.<br/>
      <a href="https://gannonwaye.com/email-preferences" style="color:#f5d06e;">Manage your preferences</a>
    </p>
  </div>
</body>
</html>`;

    const message = buildMimeMessage({
      to: email,
      subject: `Welcome to the Gannon Waye community 🎵`,
      htmlBody,
      fromName: 'Gannon Waye'
    });

    await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
      method: 'POST',
      headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ raw: message })
    });

    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});