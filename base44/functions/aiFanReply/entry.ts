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

    if (!data?.content) return Response.json({ skipped: true });
    if (!data?.author_email) return Response.json({ skipped: 'no email' });

    // Use LLM to classify sentiment and generate a personalised reply
    const analysis = await base44.asServiceRole.integrations.Core.InvokeLLM({
      prompt: `You are Gannon Waye, an singer-songwriter. A fan left this message on your community wall:

"${data.content}"

Analyse the emotional tone and generate a short, warm, human reply from Gannon.

Rules:
- Maximum 2-3 sentences
- Speak in first person as Gannon
- Tone: warm, human, real — never robotic
- If the message is deeply emotional or shares personal pain → respond with deep empathy and acknowledgement
- If the message is supportive/encouraging → express genuine gratitude
- If the message is short/casual (e.g. "wow", "this hit", "love this") → keep reply brief and warm
- Never use generic phrases like "Thank you for your comment"
- Sign off with "Gannon 🤍" on a new line

Return JSON: { "reply": "...", "tone": "deep_emotional | supportive | casual" }`,
      response_json_schema: {
        type: 'object',
        properties: {
          reply: { type: 'string' },
          tone: { type: 'string' }
        }
      }
    });

    const replyText = analysis?.reply || "I see you 🤍\n\nGannon 🤍";
    const firstName = data.author_name ? data.author_name.split(' ')[0] : 'beautiful human';

    const htmlBody = `<!DOCTYPE html><html><body style="background:#0e1117;color:#f0ead6;font-family:Georgia,serif;margin:0;padding:0;">
<div style="max-width:600px;margin:0 auto;padding:40px 24px;">
  <div style="text-align:center;margin-bottom:32px;">
    <img src="https://media.base44.com/images/public/69eb7905ca6eb4180010f794/172f64a6b_0fac46594_generated_image-Edited.png" alt="Gannon Waye" style="height:50px;width:auto;" />
  </div>

  <p style="color:#c9b99a;font-size:16px;line-height:1.7;">Hey ${firstName},</p>

  ${replyText.split('\n').map(line => `<p style="color:#c9b99a;font-size:16px;line-height:1.8;">${line}</p>`).join('')}

  <div style="border-top:1px solid #2a2f3e;margin-top:40px;padding-top:24px;text-align:center;">
    <a href="https://gannonwaye.com/back-this" style="display:inline-block;background:linear-gradient(90deg,#c9a84c,#f5d06e,#ffe08a,#f5d06e,#c9a84c);color:#0e1117;padding:14px 32px;border-radius:50px;font-size:13px;font-weight:700;text-decoration:none;letter-spacing:0.1em;text-transform:uppercase;margin-bottom:16px;">
      Support This Project →
    </a>
    <p style="color:#555;font-size:11px;margin-top:16px;">
      You received this because you left a message on gannonwaye.com.<br/>
      <a href="https://gannonwaye.com/community" style="color:#888;">Visit the community</a>
    </p>
  </div>
</div></body></html>`;

    const { accessToken } = await base44.asServiceRole.connectors.getConnection('gmail');

    await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
      method: 'POST',
      headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ raw: buildMimeMessage({ to: data.author_email, subject: `A message from Gannon 🤍`, htmlBody }) })
    });

    return Response.json({ success: true, tone: analysis?.tone });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});