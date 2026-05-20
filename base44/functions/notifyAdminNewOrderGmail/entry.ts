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
  try {
    const base44 = createClientFromRequest(req);

    // Security: only callable by authenticated admin users or service-role automations
    const user = await base44.auth.me().catch(() => null);
    if (user && user.role !== 'admin') {
      return Response.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await req.json();
    const data = body.data || body;

    const { accessToken } = await base44.asServiceRole.connectors.getConnection('gmail');

    // Always notify the primary owner email
    const adminEmail = 'gannonwayemusic@gmail.com';

    const items = (data.items || []).map(i =>
      `<tr><td style="padding:8px;border-bottom:1px solid #2a2f3e;">${i.product_name}</td><td style="padding:8px;border-bottom:1px solid #2a2f3e;">${i.size || '—'}</td><td style="padding:8px;border-bottom:1px solid #2a2f3e;">x${i.quantity || 1}</td><td style="padding:8px;border-bottom:1px solid #2a2f3e;">$${i.price}</td></tr>`
    ).join('');

    const htmlBody = `
<!DOCTYPE html><html><body style="background:#0e1117;color:#f0ead6;font-family:sans-serif;padding:32px;">
<h2 style="color:#f5d06e;">🛍️ New Merch Order!</h2>
<p><strong>Customer:</strong> ${data.customer_name}</p>
<p><strong>Email:</strong> ${data.customer_email}</p>
<p><strong>Address:</strong> ${data.shipping_address}</p>
<table style="width:100%;border-collapse:collapse;margin:16px 0;">
  <thead><tr style="background:#1a1f2e;">
    <th style="padding:8px;text-align:left;">Product</th>
    <th style="padding:8px;text-align:left;">Size</th>
    <th style="padding:8px;text-align:left;">Qty</th>
    <th style="padding:8px;text-align:left;">Price</th>
  </tr></thead>
  <tbody>${items}</tbody>
</table>
<p style="font-size:20px;color:#f5d06e;"><strong>Total: $${(data.total_amount || 0).toFixed(2)} AUD</strong></p>
<a href="https://gannonwaye.com/admin/orders" style="display:inline-block;background:#f5d06e;color:#0e1117;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:bold;margin-top:16px;">View in Admin</a>
</body></html>`;

    const message = buildMimeMessage({
      to: adminEmail,
      subject: `🛍️ New Order from ${data.customer_name} — $${(data.total_amount || 0).toFixed(2)}`,
      htmlBody
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