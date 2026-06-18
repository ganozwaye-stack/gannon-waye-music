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

    if (!data?.email) return Response.json({ skipped: true });

    // IDEMPOTENCE CHECK
    const idempotenceKey = `welcome_${data.email}`;
    const existing = await base44.asServiceRole.entities.IdempotenceLog.filter({
      idempotence_key: idempotenceKey,
    });
    
    if (existing.length > 0) {
      return Response.json({ skipped: true, reason: 'Already sent' });
    }

    const { accessToken } = await base44.asServiceRole.connectors.getConnection('gmail');
    const unsubUrl = `https://gannonwaye.com/email-preferences`;
    const firstName = data.name ? data.name.split(' ')[0] : 'beautiful human';

    const html = `<!DOCTYPE html><html><body style="background:#0e1117;color:#f0ead6;font-family:Georgia,serif;margin:0;padding:0;">
<div style="max-width:600px;margin:0 auto;padding:40px 24px;">
  <div style="text-align:center;margin-bottom:32px;">
    <img src="https://media.base44.com/images/public/69eb7905ca6eb4180010f794/172f64a6b_0fac46594_generated_image-Edited.png" alt="Gannon Waye" style="height:50px;width:auto;" />
  </div>

  <h1 style="color:#f5d06e;font-size:28px;text-align:center;font-style:italic;">You're in. 🤍</h1>
  <p style="text-align:center;color:#c9b99a;font-size:15px;margin-bottom:28px;">Welcome, ${firstName}.</p>

  <p style="color:#c9b99a;font-size:15px;line-height:1.8;">I'm genuinely glad you're here. This isn't just a mailing list — it's a community of people who believe in something honest, something real, something that matters.</p>

  <p style="color:#c9b99a;font-size:15px;line-height:1.8;">My debut single <strong style="color:#f5d06e;">"Thank You"</strong> is out now. Thank you for being part of this. Check out the site, join the community wall, and know that showing up here means the world to me. Truly.</p>

  <div style="background:#1a1f2e;border:1px solid #2a2f3e;border-radius:12px;padding:24px;margin:28px 0;">
    <p style="color:#f5d06e;font-size:13px;letter-spacing:0.2em;text-transform:uppercase;margin:0 0 16px;">Find me on socials</p>
    <p style="color:#c9b99a;font-size:14px;margin:0 0 10px;">📱 TikTok: <a href="https://www.tiktok.com/@gannonwaye" style="color:#f5d06e;">@gannonwaye</a></p>
    <p style="color:#c9b99a;font-size:14px;margin:0;">📷 Instagram: <a href="https://www.instagram.com/ganozwaye" style="color:#f5d06e;">@ganozwaye</a></p>
  </div>

  <div style="background:#0e1a0e;border:1px solid #2a3e2a;border-radius:12px;padding:24px;margin:28px 0;">
    <p style="color:#7ecf7e;font-size:13px;letter-spacing:0.2em;text-transform:uppercase;margin:0 0 12px;">🎁 A thank-you gift — if you'd like one</p>
    <p style="color:#c9b99a;font-size:14px;line-height:1.8;margin:0 0 12px;">For a further discounted rate: You must have subscribed to the website <a href="https://www.gannonwaye.com" style="color:#f5d06e;">www.gannonwaye.com</a>, follow Gannon on Instagram <a href="https://www.instagram.com/ganozwaye" style="color:#f5d06e;">@ganozwaye</a> and also on TikTok <a href="https://www.tiktok.com/@gannonwaye" style="color:#f5d06e;">@gannonwaye</a>, like, comment and share the pinned <em>"Sing Along Here"</em> video tagging Gannon. Send <strong style="color:#f5d06e;">'DONE'</strong> and a message of support in response to this welcome email and when reviewed. The gift will be advised via email, sent after manual approval. Instagram and TikTok actions are not automatically verified. Do the steps in order or the offer may not be approved.</p>
  </div>

  <div style="text-align:center;margin:32px 0;">
    <a href="https://gannonwaye.com/community" style="display:inline-block;background:#f5d06e;color:#0e1117;padding:14px 32px;border-radius:50px;text-decoration:none;font-weight:700;font-size:14px;letter-spacing:0.1em;margin-right:12px;">Join the Community →</a>
    <a href="https://gannonwaye.com/back-this" style="display:inline-block;background:transparent;color:#f5d06e;border:2px solid #f5d06e;padding:12px 24px;border-radius:50px;text-decoration:none;font-weight:600;font-size:14px;letter-spacing:0.1em;">Back This 🤍</a>
  </div>

  <p style="color:#c9b99a;font-size:15px;line-height:1.8;">All are welcome here — regardless of who you are, who you love, or where you've been. The only thing that isn't welcome is cruelty.</p>

  <p style="color:#c9b99a;font-size:15px;line-height:1.8;margin-top:28px;">With so much love,</p>
  <p style="color:#f5d06e;font-size:20px;font-style:italic;margin-top:4px;">Gannon 🤍</p>
  <p style="color:#888;font-size:13px;margin-top:4px;">Instagram: <a href="https://www.instagram.com/ganozwaye" style="color:#f5d06e;">@ganozwaye</a> &nbsp;·&nbsp; TikTok: <a href="https://www.tiktok.com/@gannonwaye" style="color:#f5d06e;">@gannonwaye</a></p>

  <div style="border-top:1px solid #2a2f3e;margin-top:40px;padding-top:20px;text-align:center;">
    <p style="color:#555;font-size:11px;line-height:1.7;">
      You're receiving this because you subscribed at gannonwaye.com.<br/>
      <a href="${unsubUrl}" style="color:#888;">Manage your email preferences</a> · 
      <a href="https://gannonwaye.com" style="color:#888;">gannonwaye.com</a>
    </p>
    <p style="color:#444;font-size:10px;margin-top:8px;">
      In compliance with the Australian Spam Act 2003. You can unsubscribe at any time.
    </p>
  </div>
</div></body></html>`;

    await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
      method: 'POST',
      headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ raw: buildMimeMessage({ to: data.email, subject: `Welcome to the inner circle 🤍 — Gannon Waye`, htmlBody: html }) })
    });

    // RECORD IDEMPOTENCE
    await base44.asServiceRole.entities.IdempotenceLog.create({
      idempotence_key: idempotenceKey,
      result: { success: true, email: data.email },
    });

    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});