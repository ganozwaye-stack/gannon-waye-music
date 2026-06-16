import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

const SHEET_ID = '1Un_w0_vESILCXp41xYM7BfUeFbjqs5GnIMYbhwfv0z8';
const SHEET_TAB = 'All Orders';

function buildMimeMessage({ to, subject, htmlBody, replyTo }) {
  const boundary = `boundary_${Date.now()}`;
  const raw = [
    `From: Gannon Waye <me>`,
    `Reply-To: ${replyTo || 'ganozwaye@gmail.com'}`,
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

function buildShippingEmail(order, tracking_number, carrier, estimated_delivery) {
  const itemsHtml = (order.items || []).map(item => `
    <tr>
      <td style="padding:12px 16px;border-bottom:1px solid #1e1e1e;color:#f0ead6;">
        <strong>${item.product_name}</strong>
        ${item.size ? `<br/><span style="font-size:12px;color:#999;">Size: ${item.size}</span>` : ''}
        <br/><span style="font-size:12px;color:#999;">Qty: ${item.quantity}</span>
      </td>
      <td style="padding:12px 16px;border-bottom:1px solid #1e1e1e;text-align:right;color:#f5d06e;font-weight:700;">$${(item.price || 0).toFixed(2)}</td>
    </tr>
  `).join('');

  const trackingBlock = tracking_number
    ? `
      <div style="background:#1a1a0a;border:1px solid #f5d06e;border-radius:12px;padding:20px;margin:24px 0;text-align:center;">
        <p style="color:#999;font-size:11px;letter-spacing:0.2em;text-transform:uppercase;margin:0 0 8px;">Tracking Number</p>
        <p style="color:#f5d06e;font-size:22px;font-weight:800;letter-spacing:0.08em;margin:0 0 4px;font-family:monospace;">${tracking_number}</p>
        ${carrier ? `<p style="color:#999;font-size:12px;margin:4px 0 0;">via ${carrier}</p>` : ''}
        ${estimated_delivery ? `<p style="color:#c9b99a;font-size:13px;margin:12px 0 0;">Estimated delivery: <strong>${estimated_delivery}</strong></p>` : ''}
      </div>`
    : `
      <div style="background:#1a1a1a;border:1px solid #333;border-radius:12px;padding:20px;margin:24px 0;text-align:center;">
        <p style="color:#999;font-size:14px;margin:0;">Tracking information coming soon — we'll send it through once your parcel is scanned.</p>
      </div>`;

  return `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="background:#0a0a0a;margin:0;padding:0;font-family:Georgia,serif;">
  <div style="max-width:600px;margin:0 auto;padding:40px 20px;">

    <div style="text-align:center;margin-bottom:32px;">
      <p style="color:#555;font-size:10px;letter-spacing:0.3em;text-transform:uppercase;margin:0 0 12px;">Gannon Waye Music</p>
      <h1 style="color:#f5d06e;font-size:32px;margin:0 0 8px;letter-spacing:0.05em;">Your Order is on its Way ✈</h1>
      <p style="color:#777;font-size:14px;margin:0;">Hi ${order.customer_name || 'there'} — your merch has been packed and shipped.</p>
    </div>

    ${trackingBlock}

    <div style="background:#111;border:1px solid #222;border-radius:12px;margin:24px 0;overflow:hidden;">
      <div style="background:#1a1a1a;padding:12px 16px;border-bottom:1px solid #222;">
        <p style="color:#f5d06e;font-size:11px;letter-spacing:0.2em;text-transform:uppercase;margin:0;">Your Order Items</p>
      </div>
      <table style="width:100%;border-collapse:collapse;">${itemsHtml}</table>
      <div style="padding:12px 16px;border-top:1px solid #222;text-align:right;">
        <p style="color:#999;font-size:12px;margin:0 0 4px;">Total paid</p>
        <p style="color:#f5d06e;font-size:20px;font-weight:700;margin:0;">$${(order.total_amount || 0).toFixed(2)} AUD</p>
      </div>
    </div>

    <div style="background:#0d0d0d;border:1px solid #1e1e1e;border-radius:12px;padding:20px;margin:24px 0;">
      <p style="color:#999;font-size:11px;letter-spacing:0.2em;text-transform:uppercase;margin:0 0 8px;">Shipping To</p>
      <p style="color:#c9b99a;font-size:14px;line-height:1.7;margin:0;">${order.shipping_address || '—'}</p>
    </div>

    <div style="text-align:center;margin:32px 0;">
      <p style="color:#777;font-size:13px;margin:0 0 16px;">While you wait, stream on your favourite platform:</p>
      <div style="display:inline-flex;gap:12px;flex-wrap:wrap;justify-content:center;">
        <a href="https://open.spotify.com/artist/1tu7INPvRAcRihgaEvBVAz" style="display:inline-block;background:#1DB954;color:#000;padding:10px 22px;border-radius:999px;text-decoration:none;font-size:12px;font-weight:700;letter-spacing:0.08em;">▶ Spotify</a>
        <a href="https://music.apple.com/au/artist/gannon-waye/1776984127" style="display:inline-block;background:linear-gradient(135deg,#fc3c44,#a2298c);color:#fff;padding:10px 22px;border-radius:999px;text-decoration:none;font-size:12px;font-weight:700;letter-spacing:0.08em;">♪ Apple Music</a>
      </div>
    </div>

    <div style="text-align:center;border-top:1px solid #1a1a1a;padding-top:24px;margin-top:32px;">
      <p style="color:#555;font-size:12px;margin:0 0 6px;">Questions? Reply to this email or contact <a href="mailto:ganozwaye@gmail.com" style="color:#f5d06e;text-decoration:none;">ganozwaye@gmail.com</a></p>
      <p style="color:#333;font-size:11px;margin:0;">Order #${order.id ? order.id.slice(-6) : '—'} · gannonwaye.com</p>
    </div>
  </div>
</body>
</html>`;
}

async function appendSheetRow(accessToken, order, tracking_number) {
  const HEADERS = ['order_id','date','customer_name','email','products','qty','size','total','status','promo_code','address','tracking_number','stripe_payment_intent','profit_estimate','notes'];

  // Ensure header row
  const checkRes = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${encodeURIComponent(SHEET_TAB)}!A1:O1`,
    { headers: { Authorization: `Bearer ${accessToken}` } }
  );
  const checkData = await checkRes.json();
  if (!checkData.values || checkData.values.length === 0) {
    await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${encodeURIComponent(SHEET_TAB)}!A1:O1?valueInputOption=RAW`,
      {
        method: 'PUT',
        headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ values: [HEADERS] })
      }
    );
  }

  const items = order.items || [];
  const products = items.map(i => i.product_name).join(', ');
  const qty = items.map(i => i.quantity).join(', ');
  const sizes = items.map(i => i.size || '—').join(', ');
  const profit = items.reduce((sum, i) => sum + ((i.price || 0) * (i.quantity || 1) * 0.4), 0);

  const row = [
    order.id || '',
    order.created_date ? new Date(order.created_date).toLocaleDateString('en-AU') : new Date().toLocaleDateString('en-AU'),
    order.customer_name || '',
    order.customer_email || '',
    products,
    qty,
    sizes,
    `$${(order.total_amount || 0).toFixed(2)}`,
    'shipped',
    order.promo_code || '',
    order.shipping_address || '',
    tracking_number || '',
    order.stripe_payment_intent || '',
    `$${profit.toFixed(2)}`,
    order.notes || '',
  ];

  const appendRes = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${encodeURIComponent(SHEET_TAB)}!A:O:append?valueInputOption=RAW&insertDataOption=INSERT_ROWS`,
    {
      method: 'POST',
      headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ values: [row] })
    }
  );
  const appendData = await appendRes.json();
  return appendData.updates?.updatedRows > 0 || !!appendData.updates;
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Admin access required' }, { status: 403 });
    }

    const body = await req.json();
    const { order_id, tracking_number, carrier, estimated_delivery, fulfilled_by } = body;

    if (!order_id) {
      return Response.json({ error: 'order_id is required' }, { status: 400 });
    }

    const checklist = {
      step1_fetch_order: false,
      step2_guard_status: false,
      step3_update_order: false,
      step4_send_email: false,
      step5_sheet_synced: false,
      step6_audit_log: false,
      step7_admin_notification: false,
    };

    // STEP 1 — Fetch order
    let order;
    try {
      order = await base44.asServiceRole.entities.MerchOrder.get(order_id);
      if (!order) throw new Error('Not found');
      checklist.step1_fetch_order = true;
    } catch (e) {
      return Response.json({ success: false, error: `Order not found: ${e.message}`, checklist }, { status: 404 });
    }

    // STEP 2 — Guard
    const blockedStatuses = ['shipped', 'delivered', 'cancelled', 'duplicate'];
    if (blockedStatuses.includes(order.status)) {
      return Response.json({
        success: false,
        error: `Order is already "${order.status}" — cannot re-fulfil.`,
        checklist
      }, { status: 409 });
    }
    checklist.step2_guard_status = true;

    // STEP 3 — Update order
    const fulfilledAt = new Date().toISOString();
    await base44.asServiceRole.entities.MerchOrder.update(order_id, {
      status: 'shipped',
      tracking_number: tracking_number || null,
      fulfilled_at: fulfilledAt,
      fulfilled_by: fulfilled_by || user.full_name || 'Admin',
    });
    checklist.step3_update_order = true;

    // STEP 4 — Send customer email
    let emailSent = false;
    try {
      const { accessToken: gmailToken } = await base44.asServiceRole.connectors.getConnection('gmail');
      const htmlBody = buildShippingEmail(order, tracking_number, carrier, estimated_delivery);
      const emailRes = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
        method: 'POST',
        headers: { Authorization: `Bearer ${gmailToken}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          raw: buildMimeMessage({
            to: order.customer_email,
            subject: `Your Gannon Waye order is on its way! ${tracking_number ? `(${tracking_number})` : ''}`.trim(),
            htmlBody,
            replyTo: 'ganozwaye@gmail.com',
          })
        })
      });
      emailSent = emailRes.ok;
      checklist.step4_send_email = emailSent;
    } catch (emailErr) {
      checklist.step4_send_email = false;
    }

    // STEP 5 — Sync to Google Sheet
    let sheetSynced = false;
    try {
      const { accessToken: sheetsToken } = await base44.asServiceRole.connectors.getConnection('googlesheets');
      sheetSynced = await appendSheetRow(sheetsToken, order, tracking_number);
      checklist.step5_sheet_synced = sheetSynced;
    } catch (sheetErr) {
      checklist.step5_sheet_synced = false;
    }

    // STEP 6 — Audit log
    try {
      await base44.asServiceRole.entities.AuditLog.create({
        entity_name: 'MerchOrder',
        entity_id: order_id,
        action: 'fulfil_order',
        performed_by: fulfilled_by || user.full_name || 'Admin',
        details: JSON.stringify({
          order_id,
          customer: order.customer_name,
          email: order.customer_email,
          tracking_number: tracking_number || null,
          carrier: carrier || null,
          estimated_delivery: estimated_delivery || null,
          fulfilled_at: fulfilledAt,
          email_sent: emailSent,
          sheet_synced: sheetSynced,
        }),
      });
      checklist.step6_audit_log = true;
    } catch (auditErr) {
      checklist.step6_audit_log = false;
    }

    // STEP 7 — Admin notification
    try {
      await base44.asServiceRole.entities.AdminNotification.create({
        notification_type: 'order',
        severity: 'info',
        title: `Order Fulfilled — ${order.customer_name}`,
        summary: `Order #${order_id.slice(-6)} marked shipped${tracking_number ? ` with tracking ${tracking_number}` : ''}. Email sent: ${emailSent}. Sheet: ${sheetSynced}.`,
        linked_entity: 'MerchOrder',
        linked_id: order_id,
        linked_route: `/admin/orders`,
        is_read: false,
        source: 'fulfilOrderAndNotify',
      });
      checklist.step7_admin_notification = true;
    } catch (notifErr) {
      checklist.step7_admin_notification = false;
    }

    const allPassed = Object.values(checklist).every(Boolean);

    return Response.json({
      success: true,
      order_id,
      new_status: 'shipped',
      customer_email_sent: emailSent,
      google_sheet_synced: sheetSynced,
      checklist,
      message: allPassed
        ? `✅ Order ${order_id.slice(-6)} fully fulfilled — all steps passed.`
        : `⚠️ Order fulfilled with some warnings — check checklist.`,
    });

  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
});