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
    const { orderId } = await req.json();

    if (!orderId) {
      return Response.json({ error: 'Order ID required' }, { status: 400 });
    }

    const { accessToken } = await base44.asServiceRole.connectors.getConnection('gmail');
    const order = await base44.asServiceRole.entities.MerchOrder.get(orderId);

    if (!order) {
      return Response.json({ error: 'Order not found' }, { status: 404 });
    }

    // Get product details for images
    const products = await base44.asServiceRole.entities.MerchProduct.list();
    
    const itemsHtml = order.items?.map(item => {
      const product = products.find(p => p.id === item.product_id);
      return `
        <tr>
          <td style="padding:12px;border-bottom:1px solid #2a2f3e;">
            <div style="flex items-center gap-12px;">
              ${product?.image_url ? `<img src="${product.image_url}" style="width:60px;height:60px;object-fit:cover;border-radius:8px;" />` : '<div style="width:60px;height:60px;background:#1a1f2e;border-radius:8px;"></div>'}
              <div>
                <p style="margin:0 0 4px 0;font-weight:600;color:#f0ead6;">${item.product_name}</p>
                ${item.size ? `<p style="margin:0;font-size:12px;color:#999;">Size: ${item.size}</p>` : ''}
                <p style="margin:0;font-size:12px;color:#999;">Qty: ${item.quantity}</p>
              </div>
            </div>
          </td>
          <td style="padding:12px;border-bottom:1px solid #2a2f3e;text-align:right;color:#f5d06e;font-weight:600;">$${(item.price || 0).toFixed(2)}</td>
        </tr>
      `;
    }).join('') || '';

    const subtotal = order.items?.reduce((sum, item) => sum + (item.price * item.quantity), 0) || 0;
    const gst = subtotal * 0.1;
    const total = order.total_amount || subtotal + gst;

    const htmlBody = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { background:#0e1117; color:#f0ead6; font-family:Georgia,serif; margin:0; padding:0; }
    .container { max-width:600px; margin:0 auto; padding:40px 24px; }
    .logo { text-align:center; margin-bottom:28px; }
    .header { text-align:center; margin-bottom:32px; }
    .info-box { background:#1a1f2e; border:1px solid #2a2f3e; border-radius:12px; padding:20px; margin:20px 0; }
    .items-table { width:100%; border-collapse:collapse; background:#1a1f2e; border-radius:8px; overflow:hidden; }
    .total-box { background:linear-gradient(135deg, rgba(245,208,110,0.1), rgba(201,168,76,0.05)); border:1px solid #f5d06e; border-radius:12px; padding:20px; margin:24px 0; }
    .footer { text-align:center; color:#666; font-size:12px; margin-top:32px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="logo">
      <img src="https://media.base44.com/images/public/69eb7905ca6eb4180010f794/172f64a6b_0fac46594_generated_image-Edited.png" alt="Gannon Waye" style="height:50px;width:auto;" />
    </div>
    
    <div class="header">
      <h1 style="color:#f5d06e;font-size:28px;margin:0 0 8px 0;">Order Receipt</h1>
      <p style="color:#999;font-size:14px;margin:0;">Thank you for your support!</p>
    </div>

    <div class="info-box">
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;">
        <div>
          <p style="color:#999;font-size:12px;margin:0 0 4px 0;">Order Number</p>
          <p style="margin:0;font-weight:600;font-size:16px;">#${order.id.slice(-6)}</p>
        </div>
        <div>
          <p style="color:#999;font-size:12px;margin:0 0 4px 0;">Order Date</p>
          <p style="margin:0;font-weight:600;">${order.created_date ? new Date(order.created_date).toLocaleDateString('en-AU', { dateStyle: 'long' }) : '—'}</p>
        </div>
        <div>
          <p style="color:#999;font-size:12px;margin:0 0 4px 0;">Customer</p>
          <p style="margin:0;font-weight:600;">${order.customer_name}</p>
        </div>
        <div>
          <p style="color:#999;font-size:12px;margin:0 0 4px 0;">Status</p>
          <p style="margin:0;font-weight:600;color:#f5d06e;">${order.status}</p>
        </div>
      </div>
    </div>

    <div class="info-box">
      <p style="color:#999;font-size:12px;margin:0 0 8px 0;">Shipping Address</p>
      <p style="margin:0;line-height:1.6;">${order.shipping_address}</p>
    </div>

    <table class="items-table">
      <thead>
        <tr style="background:#252a3a;">
          <th style="padding:12px;text-align:left;color:#f5d06e;font-size:12px;">Product</th>
          <th style="padding:12px;text-align:right;color:#f5d06e;font-size:12px;">Price</th>
        </tr>
      </thead>
      <tbody>
        ${itemsHtml}
      </tbody>
    </table>

    <div class="total-box">
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:12px;">
        <div style="color:#999;font-size:13px;">Subtotal:</div>
        <div style="text-align:right;color:#f0ead6;">$${subtotal.toFixed(2)} AUD</div>
        <div style="color:#999;font-size:13px;">GST (10%):</div>
        <div style="text-align:right;color:#f0ead6;">$${gst.toFixed(2)} AUD</div>
      </div>
      <div style="border-top:1px solid #f5d06e;padding-top:12px;margin-top:12px;display:grid;grid-template-columns:1fr 1fr;gap:12px;">
        <div style="color:#f5d06e;font-size:16px;font-weight:700;">Total:</div>
        <div style="text-align:right;color:#f5d06e;font-size:24px;font-weight:700;">$${total.toFixed(2)} AUD</div>
      </div>
    </div>

    <div class="info-box" style="text-align:center;">
      <p style="color:#c9b99a;font-size:14px;margin:0 0 8px 0;">Payment Status</p>
      <p style="margin:0;font-size:13px;color:#999;">
        ${order.status === 'delivered' ? 'Payment complete. Thank you!' : 'Payment will be charged when your order ships.'}
      </p>
    </div>

    <div class="footer">
      <p style="margin:0 0 8px 0;">Questions? Reply to this email or visit <a href="https://gannonwaye.com" style="color:#f5d06e;text-decoration:none;">gannonwaye.com</a></p>
      <p style="margin:0;color:#555;">You're receiving this because you placed an order at gannonwaye.com</p>
    </div>
  </div>
</body>
</html>`;

    await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
      method: 'POST',
      headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ raw: buildMimeMessage({ 
        to: order.customer_email, 
        subject: `Your Gannon Waye Order Receipt #${order.id.slice(-6)}`, 
        htmlBody 
      }) })
    });

    return Response.json({ success: true, message: 'Receipt sent successfully' });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});