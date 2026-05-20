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
    const data = body.data || body;

    if (!data?.email) {
      return Response.json({ error: 'No email provided' }, { status: 400 });
    }

    const { accessToken } = await base44.asServiceRole.connectors.getConnection('gmail');
    const firstName = data.name ? data.name.split(' ')[0] : 'Friend';

    const htmlBody = `<!DOCTYPE html>
<html>
<body style="background:#0e1117;color:#f0ead6;font-family:Georgia,serif;margin:0;padding:0;">
<div style="max-width:600px;margin:0 auto;padding:40px 24px;">
  <div style="text-align:center;margin-bottom:32px;">
    <img src="https://media.base44.com/images/public/69eb7905ca6eb4180010f794/172f64a6b_0fac46594_generated_image-Edited.png" alt="Gannon Waye" style="height:50px;width:auto;" />
  </div>

  <h1 style="color:#f5d06e;font-size:28px;text-align:center;margin:0 0 8px 0;">Hey ${firstName} 🤍</h1>
  <p style="color:#c9b99a;font-size:16px;line-height:1.7;text-align:center;">Welcome. I'm so glad you're here.</p>

  <p style="color:#c9b99a;font-size:15px;line-height:1.8;">My debut single <strong style="color:#f5d06e;">"Thank You"</strong> is out now. Thank you for being part of this from the beginning — it means more than I can say.</p>

  <div style="border:1px solid #2a2f3e;border-radius:12px;padding:20px;margin:24px 0;background:#1a1f2e;">
    <p style="color:#999;font-size:12px;margin:0 0 12px 0;text-transform:uppercase;letter-spacing:0.1em;">Find me on socials</p>
    <p style="margin:6px 0;"><a href="https://www.tiktok.com/@ganozwaye" style="color:#f5d06e;text-decoration:none;">📱 TikTok: @ganozwaye</a></p>
    <p style="margin:6px 0;"><a href="https://www.instagram.com/ganozwaye" style="color:#f5d06e;text-decoration:none;">📷 Instagram: @ganozwaye</a></p>
    <p style="margin:6px 0;"><a href="https://www.facebook.com/gannonwaye" style="color:#f5d06e;text-decoration:none;">📘 Facebook: Gannon Waye</a></p>
  </div>

  <div style="border:1px solid #f5d06e33;border-radius:12px;padding:20px;margin:24px 0;background:linear-gradient(135deg,rgba(245,208,110,0.05),rgba(201,168,76,0.02));">
    <p style="color:#f5d06e;font-size:13px;font-weight:700;margin:0 0 8px 0;text-transform:uppercase;letter-spacing:0.1em;">🎁 A Thank-You Gift — If You'd Like One</p>
    <p style="color:#c9b99a;font-size:13px;line-height:1.7;margin:0;">For a further discounted rate: You must have subscribed to the website <a href="https://gannonwaye.com" style="color:#f5d06e;">gannonwaye.com</a>, follow Gannon on Instagram @ganozwaye and also on TikTok @ganozwaye, like, comment and share the pinned "Sing Along Here" video tagging Gannon. Send <strong style="color:#f5d06e;">'DONE'</strong> and a message of support in reply to this email and when reviewed, the gift will be advised via email — sent after manual approval. Actions are not automatically verified. Do the steps in order or the offer may not be approved.</p>
  </div>

  <p style="color:#c9b99a;font-size:14px;line-height:1.8;text-align:center;">All are welcome here — regardless of who you are, who you love, or where you've been. The only thing that isn't welcome is cruelty.</p>

  <p style="color:#c9b99a;font-size:15px;text-align:center;">With love,<br/><strong style="color:#f5d06e;">Gannon 🤍</strong></p>

  <div style="border-top:1px solid #2a2f3e;margin-top:32px;padding-top:24px;text-align:center;">
    <p style="color:#555;font-size:11px;margin:0;">You're receiving this because you signed up at <a href="https://gannonwaye.com" style="color:#888;">gannonwaye.com</a><br/>
    <a href="https://gannonwaye.com/email-preferences" style="color:#888;">Manage email preferences</a></p>
  </div>
</div>
</body>
</html>`;

    await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
      method: 'POST',
      headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ raw: buildMimeMessage({ to: data.email, subject: `Hey ${firstName} — welcome 🤍`, htmlBody }) })
    });

    // Also notify admin of new subscriber
    const adminHtml = `<html><body style="background:#0e1117;color:#f0ead6;font-family:sans-serif;padding:32px;">
<h2 style="color:#f5d06e;">📧 New Subscriber!</h2>
<p><strong>Name:</strong> ${data.name || '—'}</p>
<p><strong>Email:</strong> ${data.email}</p>
<p><strong>Phone:</strong> ${data.phone || '—'}</p>
<p><strong>How found:</strong> ${data.how_found || '—'}</p>
<a href="https://gannonwaye.com/admin/subscribers" style="display:inline-block;background:#f5d06e;color:#0e1117;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:bold;margin-top:16px;">View in Admin →</a>
</body></html>`;

    await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
      method: 'POST',
      headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ raw: buildMimeMessage({ to: 'gannonwayemusic@gmail.com', subject: `📧 New Subscriber — ${data.name || data.email}`, htmlBody: adminHtml }) })
    });

    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});