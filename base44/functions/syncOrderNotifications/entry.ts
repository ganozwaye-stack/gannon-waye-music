import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

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
    const body = await req.json();

    // Handle entity automation payload (body.data) or manual call (body.order_data)
    const orderData = body.data || body.order_data || {};
    const orderId = body.event?.entity_id || body.order_id || orderData.id || '';

    const customerName = orderData.customer_name || 'Unknown';
    const customerEmail = orderData.customer_email || '';
    const shippingAddress = orderData.shipping_address || '';
    const items = orderData.items || [];
    const totalAmount = orderData.total_amount || orderData.total || 0;

    // 1. Create admin notification
    await base44.asServiceRole.entities.AdminNotification.create({
      notification_type: 'order',
      severity: 'info',
      title: `New Order: ${customerName} — $${totalAmount.toFixed(2)}`,
      summary: `Order from ${customerName} — $${totalAmount.toFixed(2)} AUD`,
      source: 'order_sync',
      requires_action: true,
      linked_entity: 'MerchOrder',
      linked_id: orderId,
    });

    // 2. Send email via Gmail API
    const adminEmail = 'gannonwayemusic@gmail.com';

    const itemsHtml = items.map(i =>
      `<tr><td style="padding:8px;border-bottom:1px solid #2a2f3e;">${i.product_name || 'Item'}</td><td style="padding:8px;border-bottom:1px solid #2a2f3e;">${i.size || '—'}</td><td style="padding:8px;border-bottom:1px solid #2a2f3e;">x${i.quantity || 1}</td><td style="padding:8px;border-bottom:1px solid #2a2f3e;">$${(i.price || 0).toFixed(2)}</td></tr>`
    ).join('');

    const htmlBody = `
<!DOCTYPE html><html><body style="background:#0e1117;color:#f0ead6;font-family:sans-serif;padding:32px;">
<h2 style="color:#f5d06e;">🛍️ New Merch Order!</h2>
<p><strong>Customer:</strong> ${customerName}</p>
<p><strong>Email:</strong> ${customerEmail}</p>
<p><strong>Address:</strong> ${shippingAddress}</p>
<table style="width:100%;border-collapse:collapse;margin:16px 0;">
  <thead><tr style="background:#1a1f2e;">
    <th style="padding:8px;text-align:left;">Product</th>
    <th style="padding:8px;text-align:left;">Size</th>
    <th style="padding:8px;text-align:left;">Qty</th>
    <th style="padding:8px;text-align:left;">Price</th>
  </tr></thead>
  <tbody>${itemsHtml}</tbody>
</table>
<p style="font-size:20px;color:#f5d06e;"><strong>Total: $${totalAmount.toFixed(2)} AUD</strong></p>
<a href="https://gannonwaye.com/admin/orders" style="display:inline-block;background:#f5d06e;color:#0e1117;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:bold;margin-top:16px;">View in Admin</a>
</body></html>`;

    const { accessToken } = await base44.asServiceRole.connectors.getConnection('gmail');
    const message = buildMimeMessage({
      to: adminEmail,
      subject: `🛍️ New Order from ${customerName} — $${totalAmount.toFixed(2)}`,
      htmlBody
    });

    await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
      method: 'POST',
      headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ raw: message })
    });

    return Response.json({ success: true, synced: true });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});