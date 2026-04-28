import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

// Encode email body to base64url for Gmail API
function encodeEmail(to, subject, body) {
  const email = [
    `To: ${to}`,
    `Subject: ${subject}`,
    `MIME-Version: 1.0`,
    `Content-Type: text/html; charset=UTF-8`,
    ``,
    body,
  ].join('\r\n');

  return btoa(unescape(encodeURIComponent(email)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

function buildEmailBody(release) {
  const streamingLinks = [
    release.spotify_link ? `<a href="${release.spotify_link}" style="color:#c9a84c;text-decoration:none;margin-right:12px;">🎧 Spotify</a>` : '',
    release.apple_music_link ? `<a href="${release.apple_music_link}" style="color:#c9a84c;text-decoration:none;margin-right:12px;">🍎 Apple Music</a>` : '',
    release.youtube_link ? `<a href="${release.youtube_link}" style="color:#c9a84c;text-decoration:none;">▶️ YouTube</a>` : '',
  ].filter(Boolean).join('');

  return `
    <div style="background:#0d0f14;color:#ede8dc;font-family:Georgia,serif;max-width:600px;margin:0 auto;padding:40px 32px;">
      <p style="font-size:11px;letter-spacing:0.25em;text-transform:uppercase;color:#c9a84c;margin:0 0 8px;">New Release</p>
      <h1 style="font-size:36px;margin:0 0 8px;color:#ede8dc;">${release.title}</h1>
      <p style="font-size:12px;letter-spacing:0.15em;text-transform:uppercase;color:#c9a84c;margin:0 0 24px;">${release.type}</p>

      ${release.description ? `<p style="font-size:15px;line-height:1.7;color:#b0a88e;margin:0 0 28px;">${release.description}</p>` : ''}

      ${streamingLinks ? `<div style="margin:0 0 32px;">${streamingLinks}</div>` : ''}

      <div style="border-top:1px solid #2a2e3a;padding-top:24px;margin-top:24px;">
        <a href="https://gannonwaye.com/music" style="color:#c9a84c;font-size:12px;letter-spacing:0.15em;text-transform:uppercase;text-decoration:none;">View all music →</a>
      </div>

      <p style="font-size:11px;color:#555c6b;margin-top:32px;line-height:1.6;">
        You're receiving this because you subscribed to updates from Gannon Waye.<br/>
        <a href="https://gannonwaye.com/email-preferences" style="color:#555c6b;">Manage your preferences</a>
      </p>
    </div>
  `;
}

Deno.serve(async (req) => {
  const base44 = createClientFromRequest(req);

  const body = await req.json();
  const release = body.data;

  // Only act when is_published flips to true
  if (!release?.is_published || body.old_data?.is_published === true) {
    return Response.json({ skipped: true, reason: 'Not a new publish event' });
  }

  const { accessToken } = await base44.asServiceRole.connectors.getConnection('gmail');
  const authHeader = { Authorization: `Bearer ${accessToken}` };

  const subscribers = await base44.asServiceRole.entities.EmailSubscriber.list();

  if (!subscribers.length) {
    return Response.json({ sent: 0, message: 'No subscribers found' });
  }

  const subject = `🎵 New from Gannon Waye: "${release.title}" is out now`;
  const htmlBody = buildEmailBody(release);

  let sent = 0;
  let failed = 0;

  for (const subscriber of subscribers) {
    const raw = encodeEmail(subscriber.email, subject, htmlBody);
    const res = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
      method: 'POST',
      headers: { ...authHeader, 'Content-Type': 'application/json' },
      body: JSON.stringify({ raw }),
    });

    if (res.ok) {
      sent++;
    } else {
      failed++;
      console.error(`Failed to send to ${subscriber.email}:`, await res.text());
    }
  }

  return Response.json({ sent, failed, total: subscribers.length });
});