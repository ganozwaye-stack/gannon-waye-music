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

function buildNewsletterHtml(firstName, unsubUrl) {
  return `<!DOCTYPE html><html><body style="background:#0e1117;color:#f0ead6;font-family:Georgia,serif;margin:0;padding:0;">
<div style="max-width:620px;margin:0 auto;padding:40px 24px;">
  <div style="text-align:center;margin-bottom:32px;">
    <img src="https://media.base44.com/images/public/69eb7905ca6eb4180010f794/172f64a6b_0fac46594_generated_image-Edited.png" alt="Gannon Waye" style="height:50px;width:auto;" />
  </div>

  <p style="color:#c9b99a;font-size:16px;line-height:1.8;">Hi ${firstName},</p>
  <p style="color:#c9b99a;font-size:15px;line-height:1.8;">I've been counting down to this moment for a long time. And now, here we are. The artwork is live. THANKYOU is out now. And <em>you</em> are the reason this exists.</p>

  <div style="background:#1a1f2e;border:1px solid #2a2f3e;border-radius:16px;padding:28px;margin:28px 0;text-align:center;">
    <img src="https://media.base44.com/images/public/69eb7905ca6eb4180010f794/a6aefb394_2.jpg" alt="Thank You — Gannon Waye" style="width:200px;height:200px;object-fit:cover;border-radius:12px;margin:0 auto 20px;display:block;" />
    <p style="color:#f5d06e;font-size:13px;letter-spacing:0.25em;text-transform:uppercase;margin:0 0 8px;">Artwork Revealed</p>
    <p style="font-size:32px;color:#f0ead6;font-style:italic;margin:0 0 8px;">"Thank You"</p>
    <p style="color:#999;font-size:13px;margin:0 0 20px;">Gannon Waye · Debut Single · Out Now</p>
    <a href="https://open.spotify.com/search/Gannon%20Waye%20Thank%20You" style="display:inline-block;background:#f5d06e;color:#0e1117;padding:13px 30px;border-radius:50px;text-decoration:none;font-weight:700;font-size:14px;">Listen on Spotify →</a>
  </div>

  <p style="color:#c9b99a;font-size:15px;line-height:1.8;"><strong style="color:#f0ead6;">THANKYOU is officially out now.</strong> Stream it, save it, and share it with someone you love.</p>
  <p style="color:#c9b99a;font-size:15px;line-height:1.8;">Merch is open now at the store — go grab something to wear with pride.</p>

  <div style="border-left:3px solid #f5d06e;padding:16px 20px;margin:28px 0;background:#1a1f2e;border-radius:0 12px 12px 0;">
    <p style="color:#c9b99a;font-size:15px;line-height:1.8;margin:0;">🤍 <strong style="color:#f0ead6;">To every one of you who joined this community:</strong> Thank you. From the very bottom of my heart. You showed up before a single note was publicly played. That means everything.</p>
  </div>

  <p style="color:#c9b99a;font-size:15px;line-height:1.8;">This community is a safe space — a place built on support, encouragement, and kindness. Anyone who jeopardises that warmth will be removed. We protect each other here. Always.</p>

  <p style="color:#c9b99a;font-size:15px;line-height:1.8;font-style:italic;">To those going through something hard right now — I see you. I wrote this song from the middle of my own darkness. The darkness does not win. You are in the middle of your story, not at the end of it.</p>

  <p style="color:#999;font-size:13px;">If you need support: Lifeline <a href="tel:131114" style="color:#f5d06e;">13 11 14</a> · Beyond Blue <a href="tel:1300224636" style="color:#f5d06e;">1300 22 4636</a></p>

  <p style="color:#c9b99a;font-size:15px;line-height:1.8;margin-top:28px;">Over the next 12 months you can expect more music, behind-the-scenes content, live performances, and a community that keeps growing together. This is just the beginning.</p>

  <div style="text-align:center;margin:36px 0 28px;">
    <a href="https://gannonwaye.com/store" style="display:inline-block;background:#f5d06e;color:#0e1117;padding:13px 30px;border-radius:50px;text-decoration:none;font-weight:700;font-size:14px;margin:0 6px 8px;">Shop Merch →</a>
    <a href="https://gannonwaye.com/community" style="display:inline-block;background:transparent;color:#f5d06e;padding:13px 30px;border-radius:50px;text-decoration:none;font-weight:700;font-size:14px;border:1px solid #f5d06e;margin:0 6px 8px;">Join the Community →</a>
  </div>

  <p style="color:#c9b99a;font-size:15px;line-height:1.8;">This is for you.</p>
  <p style="color:#c9b99a;font-size:15px;line-height:1.8;">All my love,</p>
  <p style="color:#f5d06e;font-size:20px;font-style:italic;">Gannon 🤍</p>
  <p style="color:#999;font-size:13px;">P.S. Go stream it. Go buy it. Go share it. Let's get "Thank You" heard. 🎶</p>

  <div style="border-top:1px solid #2a2f3e;margin-top:40px;padding-top:20px;text-align:center;">
    <p style="color:#555;font-size:11px;line-height:1.7;">
      You're receiving this because you subscribed at gannonwaye.com.<br/>
      <a href="${unsubUrl}" style="color:#888;">Manage email preferences</a> ·
      <a href="https://gannonwaye.com" style="color:#888;">gannonwaye.com</a>
    </p>
    <p style="color:#444;font-size:10px;margin-top:6px;">In compliance with the Australian Spam Act 2003. You can unsubscribe at any time.</p>
  </div>
</div></body></html>`;
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (user?.role !== 'admin') {
      return Response.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { accessToken } = await base44.asServiceRole.connectors.getConnection('gmail');
    const subscribers = await base44.asServiceRole.entities.EmailSubscriber.list();

    if (subscribers.length === 0) {
      return Response.json({ success: true, sent: 0, message: 'No subscribers' });
    }

    let sent = 0;
    let failed = 0;
    const errors = [];

    for (const sub of subscribers) {
      const firstName = sub.name ? sub.name.split(' ')[0] : 'beautiful human';
      const unsubUrl = `https://gannonwaye.com/email-preferences`;
      const html = buildNewsletterHtml(firstName, unsubUrl);

      const res = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
        method: 'POST',
        headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ raw: buildMimeMessage({ to: sub.email, subject: `THANKYOU by Gannon Waye is out now`, htmlBody: html }) })
      });

      if (res.ok) {
        sent++;
      } else {
        failed++;
        errors.push(sub.email);
      }

      // Small delay to avoid Gmail rate limits
      await new Promise(r => setTimeout(r, 200));
    }

    return Response.json({ success: true, sent, failed, errors });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});
