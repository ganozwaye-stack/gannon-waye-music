import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

function buildMimeMessage({ to, subject, htmlBody, fromName }) {
  const boundary = `boundary_${Date.now()}`;
  const raw = [
    `From: ${fromName || 'Gannon Waye'} <me>`,
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

    if (!data || data.status !== 'shipped') {
      return Response.json({ skipped: true });
    }

    const { accessToken } = await base44.asServiceRole.connectors.getConnection('gmail');

    const trackingInfo = data.tracking_number
      ? `<div style="background:#1a1f2e;border:1px solid #f5d06e33;border-radius:12px;padding:20px;margin:20px 0;text-align:center;">
           <p style="color:#999;font-size:12px;margin:0 0 8px;text-transform:uppercase;letter-spacing:0.1em;">Tracking Number</p>
           <p style="color:#f5d06e;font-size:22px;font-weight:bold;margin:0;">${data.tracking_number}</p>
         </div>`
      : `<p style="color:#c9b99a;text-align:center;">Tracking details will be sent separately once available.</p>`;

    const items = (data.items || []);
    const itemsHtml = items.map(i =>
      `<tr><td style="padding:8px 12px;border-bottom:1px solid #2a2f3e;">${i.product_name}${i.size ? ` (${i.size})` : ''}</td><td style="padding:8px 12px;border-bottom:1px solid #2a2f3e;color:#f5d06e;">$${i.price}</td></tr>`
    ).join('');

    const htmlBody = `<!DOCTYPE html><html><body style="background:#0e1117;color:#f0ead6;font-family:Georgia,serif;margin:0;padding:0;">
<div style="max-width:600px;margin:0 auto;padding:40px 24px;">
  <div style="text-align:center;margin-bottom:28px;">
    <img src="https://media.base44.com/images/public/69eb7905ca6eb4180010f794/172f64a6b_0fac46594_generated_image-Edited.png" alt="Gannon Waye" style="height:50px;width:auto;" />
  </div>
  <h1 style="color:#f5d06e;font-size:26px;text-align:center;">Your order is on its way! 📦</h1>
  <p style="text-align:center;color:#c9b99a;font-size:15px;">Hey ${data.customer_name}, your Gannon Waye merch has shipped.</p>

  ${trackingInfo}

  <div style="background:#1a1f2e;border:1px solid #2a2f3e;border-radius:12px;padding:24px;margin:20px 0;">
    <p style="color:#999;font-size:12px;margin:0 0 12px;text-transform:uppercase;letter-spacing:0.1em;">Your Order</p>
    <table style="width:100%;border-collapse:collapse;">${itemsHtml}</table>
    <p style="color:#f5d06e;font-size:18px;margin-top:16px;margin-bottom:0;"><strong>Total: $${(data.total_amount || 0).toFixed(2)} AUD</strong></p>
  </div>

  <div style="background:#1a1f2e;border:1px solid #2a2f3e;border-radius:12px;padding:20px;margin:16px 0;">
    <p style="color:#999;font-size:12px;margin:0 0 4px;">Shipping to:</p>
    <p style="margin:0;">${data.shipping_address}</p>
  </div>

  <p style="color:#c9b99a;font-size:14px;line-height:1.7;text-align:center;">
    Thank you so much for your support. It genuinely means the world. 🤍
  </p>
  <p style="text-align:center;color:#666;font-size:12px;margin-top:24px;">
    Questions? Visit <a href="https://gannonwaye.com" style="color:#f5d06e;">gannonwaye.com</a>
  </p>
</div></body></html>`;

    await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
      method: 'POST',
      headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ raw: buildMimeMessage({ to: data.customer_email, subject: `Your Gannon Waye order has shipped! 📦`, htmlBody }) })
    });

    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});