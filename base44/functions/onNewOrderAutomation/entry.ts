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

    if (!data) return Response.json({ skipped: true });

    // IDEMPOTENCE: Check if already processed
    const idempotenceKey = `order_${data.id}`;
    const existing = await base44.asServiceRole.entities.IdempotenceLog.filter({
      idempotence_key: idempotenceKey,
    });
    
    if (existing.length > 0) {
      return Response.json({ skipped: true, reason: 'Already processed', cached: existing[0].result });
    }

    // PRE-FETCH & REFRESH TOKENS before long operation
    const gmailConn = await base44.asServiceRole.connectors.getConnection('gmail');
    const sheetsConn = await base44.asServiceRole.connectors.getConnection('googlesheets');
    
    const { accessToken } = gmailConn;
    const { accessToken: sheetAccessToken } = sheetsConn;
    const sheetId = Deno.env.get('GOOGLE_SHEET_ID');

    // Always notify the primary owner email
    const adminEmail = 'gannonwayemusic@gmail.com';

    const items = (data.items || []);
    const itemsHtml = items.map(i =>
      `<tr><td style="padding:8px 12px;border-bottom:1px solid #2a2f3e;">${i.product_name}</td><td style="padding:8px 12px;border-bottom:1px solid #2a2f3e;">${i.size || '—'}</td><td style="padding:8px 12px;border-bottom:1px solid #2a2f3e;">x${i.quantity || 1}</td><td style="padding:8px 12px;border-bottom:1px solid #2a2f3e;color:#f5d06e;">$${Number(i.price).toFixed(2)}</td></tr>`
    ).join('');

    // 1) Decrement stock for each item ordered
    for (const item of items) {
      if (!item.product_id) continue;
      const products = await base44.asServiceRole.entities.MerchProduct.list();
      const product = products.find(p => p.id === item.product_id);
      if (product && product.stock_quantity > 0) {
        const newQty = Math.max(0, product.stock_quantity - (item.quantity || 1));
        await base44.asServiceRole.entities.MerchProduct.update(item.product_id, { stock_quantity: newQty });
      }
    }

    // 2) Admin alert email
    const adminHtml = `<!DOCTYPE html><html><body style="background:#0e1117;color:#f0ead6;font-family:sans-serif;padding:32px;margin:0;">
<div style="max-width:520px;margin:0 auto;">
  <h2 style="color:#f5d06e;margin-bottom:4px;">🛍️ New Merch Order!</h2>
  <p style="color:#999;font-size:13px;margin-top:0;">${new Date().toLocaleDateString('en-AU', { dateStyle: 'full' })}</p>
  <div style="background:#1a1f2e;border:1px solid #2a2f3e;border-radius:12px;padding:20px;margin:20px 0;">
    <p style="margin:4px 0;"><strong>Customer:</strong> ${data.customer_name}</p>
    <p style="margin:4px 0;"><strong>Email:</strong> ${data.customer_email}</p>
    <p style="margin:4px 0;"><strong>Address:</strong> ${data.shipping_address}</p>
    ${data.notes ? `<p style="margin:4px 0;color:#999;font-size:12px;"><strong>Notes:</strong> ${data.notes}</p>` : ''}
  </div>
  <table style="width:100%;border-collapse:collapse;background:#1a1f2e;border-radius:8px;overflow:hidden;">
    <thead><tr style="background:#252a3a;">
      <th style="padding:10px 12px;text-align:left;color:#f5d06e;font-size:12px;">Product</th>
      <th style="padding:10px 12px;text-align:left;color:#f5d06e;font-size:12px;">Size</th>
      <th style="padding:10px 12px;text-align:left;color:#f5d06e;font-size:12px;">Qty</th>
      <th style="padding:10px 12px;text-align:left;color:#f5d06e;font-size:12px;">Price</th>
    </tr></thead>
    <tbody>${itemsHtml}</tbody>
  </table>
  <p style="font-size:22px;color:#f5d06e;margin:20px 0;"><strong>Total: $${(data.total_amount || 0).toFixed(2)} AUD</strong></p>
  <a href="https://gannonwaye.com/admin/orders" style="display:inline-block;background:#f5d06e;color:#0e1117;padding:12px 28px;border-radius:50px;text-decoration:none;font-weight:700;font-size:14px;">View in Admin →</a>
</div></body></html>`;

    await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
      method: 'POST',
      headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ raw: buildMimeMessage({ to: adminEmail, subject: `🛍️ New Order — ${data.customer_name} ($${(data.total_amount || 0).toFixed(2)})`, htmlBody: adminHtml }) })
    });

    // 3) Customer confirmation email with unsubscribe link
    const unsubUrl = `https://gannonwaye.com/email-preferences`;
    const customerHtml = `<!DOCTYPE html><html><body style="background:#0e1117;color:#f0ead6;font-family:Georgia,serif;margin:0;padding:0;">
<div style="max-width:600px;margin:0 auto;padding:40px 24px;">
  <div style="text-align:center;margin-bottom:28px;">
    <img src="https://media.base44.com/images/public/69eb7905ca6eb4180010f794/172f64a6b_0fac46594_generated_image-Edited.png" alt="Gannon Waye" style="height:50px;width:auto;" />
  </div>
  <h1 style="color:#f5d06e;font-size:26px;text-align:center;">Preorder Confirmed! 🎉</h1>
  <p style="text-align:center;color:#c9b99a;font-size:15px;">Thanks ${data.customer_name}, your preorder is locked in.</p>
  <div style="background:#1a1f2e;border:1px solid #2a2f3e;border-radius:12px;padding:24px;margin:24px 0;">
    <table style="width:100%;border-collapse:collapse;">${itemsHtml}</table>
    <p style="color:#f5d06e;font-size:18px;margin-top:16px;margin-bottom:0;"><strong>Total: $${(data.total_amount || 0).toFixed(2)} AUD</strong></p>
  </div>
  <div style="background:#1a1f2e;border:1px solid #2a2f3e;border-radius:12px;padding:20px;margin:16px 0;">
    <p style="color:#999;font-size:12px;margin:0 0 4px;">Shipping to:</p>
    <p style="margin:0;">${data.shipping_address}</p>
  </div>
  <p style="color:#c9b99a;font-size:14px;line-height:1.7;text-align:center;">Payment won't be charged until <strong style="color:#f5d06e;">1 June 2026</strong>. We'll send shipping details when your order is on its way.</p>
  <p style="text-align:center;color:#666;font-size:12px;margin-top:32px;">Questions? Reply to this email or visit <a href="https://gannonwaye.com" style="color:#f5d06e;">gannonwaye.com</a></p>
  <p style="text-align:center;color:#555;font-size:11px;margin-top:16px;">
    You're receiving this because you placed an order at gannonwaye.com.<br/>
    <a href="${unsubUrl}" style="color:#888;">Manage email preferences</a>
  </p>
</div></body></html>`;

    await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
      method: 'POST',
      headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ raw: buildMimeMessage({ to: data.customer_email, subject: `Your Gannon Waye preorder is confirmed ✨`, htmlBody: customerHtml }) })
    });

    // 4) Sync to Google Sheet — fix URL (use slash not colon before append)
    const checkRes = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/Sheet1!A1`,
      { headers: { Authorization: `Bearer ${sheetAccessToken}` } }
    );
    const checkData = await checkRes.json();
    if (!checkData.values || checkData.values.length === 0) {
      await fetch(
        `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/Sheet1!A1:H1?valueInputOption=RAW`,
        {
          method: 'PUT',
          headers: { Authorization: `Bearer ${sheetAccessToken}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({ values: [['Date', 'Customer Name', 'Email', 'Address', 'Items', 'Total (AUD)', 'Status', 'Order ID']] })
        }
      );
    }

    const itemsText = items.map(i => `${i.product_name}${i.size ? ` (${i.size})` : ''} x${i.quantity || 1}`).join('; ');
    await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/Sheet1!A1:append?valueInputOption=RAW&insertDataOption=INSERT_ROWS`,
      {
        method: 'POST',
        headers: { Authorization: `Bearer ${sheetAccessToken}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ values: [[new Date().toLocaleDateString('en-AU'), data.customer_name, data.customer_email, data.shipping_address, itemsText, `$${(data.total_amount || 0).toFixed(2)}`, data.status, data.id]] })
      }
    );

    // RECORD IDEMPOTENCE for retry safety
    await base44.asServiceRole.entities.IdempotenceLog.create({
      idempotence_key: idempotenceKey,
      result: { success: true, timestamp: new Date().toISOString() },
    });

    // Central notification
    await base44.asServiceRole.functions.invoke('notifyAdmin', {
      notification_type: 'order',
      title: `New order from ${data.customer_name} — $${(data.total_amount || 0).toFixed(2)}`,
      summary: items.map(i => `${i.product_name}${i.size ? ` (${i.size})` : ''} x${i.quantity || 1}`).join(', '),
      severity: 'info',
      linked_route: '/admin/orders',
      linked_entity: 'MerchOrder',
      linked_id: data.id,
      requires_action: false,
      source: 'MerchOrder',
    });

    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});