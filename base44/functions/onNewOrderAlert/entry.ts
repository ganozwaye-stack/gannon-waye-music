import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

function makeEmail(raw) {
  const encoded = btoa(unescape(encodeURIComponent(raw)))
    .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  return encoded;
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json();

    const order = body?.data;
    if (!order) return Response.json({ ok: true, skipped: 'no order data' });

    const { accessToken } = await base44.asServiceRole.connectors.getConnection('gmail');

    const items = (order.items || []).map(i =>
      `• ${i.product_name}${i.size ? ` (${i.size})` : ''} × ${i.quantity} — $${(i.price * i.quantity).toFixed(2)}`
    ).join('\n');

    const subject = `🛒 New Merch Order — ${order.customer_name || 'Unknown'}`;
    const bodyText = `New order received!\n\nCustomer: ${order.customer_name}\nEmail: ${order.customer_email}\nAddress: ${order.shipping_address || 'Not provided'}\n\nItems:\n${items}\n\nTotal: $${(order.total_amount || 0).toFixed(2)}\nStatus: ${order.status || 'pending'}\n\nLog in to the admin dashboard to manage this order.`;

    const mime = [
      `From: me`,
      `To: ganozwaye@gmail.com`,
      `Subject: ${subject}`,
      `Content-Type: text/plain; charset=utf-8`,
      ``,
      bodyText,
    ].join('\r\n');

    await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
      method: 'POST',
      headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ raw: makeEmail(mime) }),
    });

    return Response.json({ ok: true });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});