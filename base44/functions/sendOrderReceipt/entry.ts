import { createClientFromRequest } from 'npm:@base44/sdk@0.8.30';

function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function numberOr(value, fallback = 0) {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
}

function buildMimeMessage({ to, subject, htmlBody }) {
  const boundary = `boundary_${Date.now()}`;
  const raw = [
    'From: Gannon Waye Music <me>',
    'Reply-To: gannonwayemusic@gmail.com',
    `To: ${to}`,
    `Subject: ${subject}`,
    'MIME-Version: 1.0',
    `Content-Type: multipart/alternative; boundary="${boundary}"`,
    '',
    `--${boundary}`,
    'Content-Type: text/html; charset=UTF-8',
    '',
    htmlBody,
    `--${boundary}--`,
  ].join('\r\n');
  return btoa(unescape(encodeURIComponent(raw)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

async function setReceiptFailure(base44, orderId, lock, error) {
  await base44.asServiceRole.entities.MerchOrder.update(orderId, {
    receipt_status: 'failed',
  }).catch(() => {});

  if (lock?.id) {
    await base44.asServiceRole.entities.IdempotenceLog.update(lock.id, {
      result: {
        status: 'failed',
        order_id: orderId,
        failed_at: new Date().toISOString(),
        error: String(error?.message || error).slice(0, 1000),
      },
    }).catch(() => {});
  }
}

Deno.serve(async (req) => {
  const base44 = createClientFromRequest(req);
  let orderId = '';
  let receiptLock = null;

  try {
    const body = await req.json();
    orderId = String(body?.orderId || body?.data?.id || '').trim();
    if (!orderId) return Response.json({ error: 'Order ID is required.' }, { status: 400 });

    const order = await base44.asServiceRole.entities.MerchOrder.get(orderId);
    if (!order) return Response.json({ error: 'Order not found.' }, { status: 404 });

    if (order.receipt_sent || order.receipt_status === 'sent') {
      return Response.json({ success: true, skipped: true, reason: 'Receipt was already sent.', message_id: order.receipt_message_id || null });
    }

    if (order.excluded_from_revenue || order.status === 'duplicate' || order.payment_status !== 'paid') {
      await base44.asServiceRole.entities.MerchOrder.update(orderId, {
        receipt_status: 'not_required',
      });
      return Response.json({ success: true, skipped: true, reason: 'Receipt is not required for this record.' });
    }

    const receiptKey = `receipt_order:${orderId}`;
    const existingLocks = await base44.asServiceRole.entities.IdempotenceLog.filter({
      idempotence_key: receiptKey,
    });
    receiptLock = Array.isArray(existingLocks) ? existingLocks[0] : null;

    if (receiptLock?.result?.status === 'completed') {
      await base44.asServiceRole.entities.MerchOrder.update(orderId, {
        receipt_sent: true,
        receipt_status: 'sent',
        receipt_message_id: receiptLock.result.message_id || order.receipt_message_id || '',
      });
      return Response.json({ success: true, skipped: true, reason: 'Receipt completion was recovered from the idempotence record.' });
    }

    if (receiptLock?.result?.status === 'processing') {
      return Response.json({
        success: false,
        needs_review: true,
        error: 'A receipt send is already locked. No second email was sent.',
      }, { status: 409 });
    }

    if (!receiptLock) {
      receiptLock = await base44.asServiceRole.entities.IdempotenceLog.create({
        idempotence_key: receiptKey,
        created_at: new Date().toISOString(),
        description: `Transactional receipt lock for paid order ${orderId}`,
        result: { status: 'processing', order_id: orderId },
      });
    } else {
      await base44.asServiceRole.entities.IdempotenceLog.update(receiptLock.id, {
        result: { status: 'processing', order_id: orderId, retry_started_at: new Date().toISOString() },
      });
    }

    const connection = await base44.asServiceRole.connectors.getConnection('gmail');
    const accessToken = connection?.accessToken;
    if (!accessToken) {
      throw new Error('The Gmail connector used for transactional order receipts is not authorised.');
    }

    const itemRows = (order.items || []).map(item => {
      const quantity = numberOr(item.quantity, 1);
      const unitPrice = numberOr(item.price);
      return `
        <tr>
          <td style="padding:12px;border-bottom:1px solid #2a2f3e;color:#f0ead6;">
            <strong>${escapeHtml(item.product_name)}</strong>
            ${item.size ? `<div style="font-size:12px;color:#999;margin-top:4px;">Size: ${escapeHtml(item.size)}</div>` : ''}
            <div style="font-size:12px;color:#999;margin-top:4px;">Quantity: ${quantity}</div>
          </td>
          <td style="padding:12px;border-bottom:1px solid #2a2f3e;text-align:right;color:#f5d06e;">$${(unitPrice * quantity).toFixed(2)}</td>
        </tr>`;
    }).join('');

    const subtotal = numberOr(order.subtotal_amount, (order.items || []).reduce((sum, item) =>
      sum + numberOr(item.price) * numberOr(item.quantity, 1), 0
    ));
    const delivery = numberOr(order.shipping_amount);
    const total = numberOr(order.total_amount, subtotal + delivery);
    const orderNumber = String(order.id).slice(-8).toUpperCase();

    const htmlBody = `<!DOCTYPE html>
<html>
<body style="background:#0e1117;color:#f0ead6;font-family:Arial,sans-serif;margin:0;padding:0;">
  <div style="max-width:620px;margin:0 auto;padding:36px 22px;">
    <div style="text-align:center;margin-bottom:28px;">
      <h1 style="font-family:Georgia,serif;color:#f5d06e;font-size:28px;margin:0 0 8px;">Order Receipt</h1>
      <p style="color:#999;font-size:13px;margin:0;">Gannon Waye Music</p>
      <p style="color:#777;font-size:12px;margin:5px 0 0;">ABN 22 931 809 349</p>
    </div>

    <div style="background:#1a1f2e;border:1px solid #2a2f3e;border-radius:12px;padding:20px;margin-bottom:18px;">
      <p style="margin:0 0 8px;"><strong>Order:</strong> ${escapeHtml(orderNumber)}</p>
      <p style="margin:0 0 8px;"><strong>Date:</strong> ${new Date(order.created_date || Date.now()).toLocaleDateString('en-AU', { dateStyle: 'long' })}</p>
      <p style="margin:0 0 8px;"><strong>Customer:</strong> ${escapeHtml(order.customer_name)}</p>
      <p style="margin:0;"><strong>Delivery address:</strong> ${escapeHtml(order.shipping_address)}</p>
    </div>

    <table style="width:100%;border-collapse:collapse;background:#1a1f2e;border-radius:10px;overflow:hidden;">
      <thead>
        <tr style="background:#252a3a;">
          <th style="padding:12px;text-align:left;color:#f5d06e;font-size:12px;">Item</th>
          <th style="padding:12px;text-align:right;color:#f5d06e;font-size:12px;">Amount AUD</th>
        </tr>
      </thead>
      <tbody>${itemRows}</tbody>
    </table>

    <div style="background:#1a1f2e;border:1px solid #2a2f3e;border-radius:12px;padding:20px;margin-top:18px;">
      <div style="display:flex;justify-content:space-between;margin-bottom:10px;color:#bbb;"><span>Products</span><span>$${subtotal.toFixed(2)}</span></div>
      <div style="display:flex;justify-content:space-between;margin-bottom:10px;color:#bbb;"><span>Delivery</span><span>$${delivery.toFixed(2)}</span></div>
      <div style="display:flex;justify-content:space-between;margin-bottom:12px;color:#999;"><span>GST</span><span>Not charged</span></div>
      <div style="display:flex;justify-content:space-between;border-top:1px solid #f5d06e;padding-top:14px;color:#f5d06e;font-size:20px;font-weight:700;"><span>Total paid</span><span>$${total.toFixed(2)}</span></div>
    </div>

    <div style="background:#10151f;border:1px solid #2a2f3e;border-radius:12px;padding:18px;margin-top:18px;">
      <p style="margin:0;color:#c9b99a;font-size:13px;line-height:1.6;">Your payment has been received and your order has been recorded. You will receive a separate update when the order is dispatched.</p>
    </div>

    <p style="text-align:center;color:#777;font-size:12px;line-height:1.6;margin-top:28px;">
      Questions about this order can be sent to gannonwayemusic@gmail.com.<br>
      This is a transactional receipt for your purchase, not a marketing email.
    </p>
  </div>
</body>
</html>`;

    const gmailResponse = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        raw: buildMimeMessage({
          to: order.customer_email,
          subject: `Gannon Waye Music order receipt ${orderNumber}`,
          htmlBody,
        }),
      }),
    });

    const gmailData = await gmailResponse.json().catch(() => ({}));
    if (!gmailResponse.ok || !gmailData?.id) {
      throw new Error(`Gmail receipt send failed with HTTP ${gmailResponse.status}: ${JSON.stringify(gmailData).slice(0, 600)}`);
    }

    const completedAt = new Date().toISOString();
    await base44.asServiceRole.entities.MerchOrder.update(orderId, {
      receipt_sent: true,
      receipt_status: 'sent',
      receipt_message_id: gmailData.id,
    });
    await base44.asServiceRole.entities.IdempotenceLog.update(receiptLock.id, {
      result: {
        status: 'completed',
        order_id: orderId,
        message_id: gmailData.id,
        completed_at: completedAt,
      },
    });

    return Response.json({
      success: true,
      order_id: orderId,
      message_id: gmailData.id,
      sent_at: completedAt,
    });
  } catch (error) {
    if (orderId) await setReceiptFailure(base44, orderId, receiptLock, error);
    return Response.json({
      success: false,
      order_id: orderId || null,
      error: String(error?.message || error),
    }, { status: 503 });
  }
});
