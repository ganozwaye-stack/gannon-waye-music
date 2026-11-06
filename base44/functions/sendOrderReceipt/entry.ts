// Order receipt sender for paid merchandise orders.
//
// Nothing here is callable by a stranger who finds the URL: every request must
// carry order_id, timestamp (epoch seconds) and an HMAC-SHA256 signature over
// `${order_id}.${timestamp}`, signed with RECEIPT_TRIGGER_SECRET, and must
// arrive inside a 300 second window. The signature is compared in constant time.
//
// The receipt prints only what the order record actually stored: item lines,
// subtotal, postage and total. Gannon is not registered for the consumption
// charge, so no charge line and no amount of that kind is added or shown.
import { createClientFromRequest } from 'npm:@base44/sdk@0.8.54';

const DIGITAL_CATEGORIES = new Set(['digital', 'digital download', 'digital_music', 'song', 'music']);
const DOWNLOAD_LINK_TTL_SECONDS = 72 * 60 * 60;
const MAX_SKEW_SECONDS = 300;
const FROM_ADDRESS = 'gannonwayemusic@gmail.com';
const SITE_URL = 'https://gannonwaye.com';

const emptyResult = () => ({ sent: false, skipped: false, reason: '', order_number: '', to: '' });

const escapeHtml = (value: string) => String(value ?? '').replace(/[&<>"']/g, (char) => (
  { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' } as Record<string, string>
)[char]);

const money = (value: unknown) => `$${(Number(value) || 0).toFixed(2)} AUD`;

function toHex(buffer: ArrayBuffer) {
  return Array.from(new Uint8Array(buffer)).map((byte) => byte.toString(16).padStart(2, '0')).join('');
}

function toBase64Url(buffer: ArrayBuffer) {
  let binary = '';
  for (const byte of new Uint8Array(buffer)) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

// Length-independent, branch-free comparison of two signature strings.
function constantTimeEqual(a: string, b: string) {
  const left = new TextEncoder().encode(a);
  const right = new TextEncoder().encode(b);
  let difference = left.length ^ right.length;
  const length = Math.max(left.length, right.length);
  for (let index = 0; index < length; index += 1) {
    difference |= (left[index] ?? 0) ^ (right[index] ?? 0);
  }
  return difference === 0;
}

async function signPayload(secret: string, payload: string) {
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  const digest = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(payload));
  return { hex: toHex(digest), base64Url: toBase64Url(digest) };
}

function buildMimeMessage({ to, subject, text, html }: { to: string; subject: string; text: string; html: string }) {
  const boundary = `boundary_${crypto.randomUUID()}`;
  const raw = [
    `From: Gannon Waye Music <${FROM_ADDRESS}>`,
    `To: ${to}`,
    `Subject: ${subject}`,
    'MIME-Version: 1.0',
    `Content-Type: multipart/alternative; boundary="${boundary}"`,
    '',
    `--${boundary}`,
    'Content-Type: text/plain; charset=UTF-8',
    '',
    text,
    `--${boundary}`,
    'Content-Type: text/html; charset=UTF-8',
    '',
    html,
    `--${boundary}--`,
  ].join('\r\n');
  return btoa(unescape(encodeURIComponent(raw))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

async function resolveDownloadLink(base44: ReturnType<typeof createClientFromRequest>, item: Record<string, unknown>, cache: Map<string, Record<string, unknown> | null>) {
  let fileUri = String(item.digital_file_uri || '').trim();
  const productId = String(item.product_id || '').trim();
  if (!fileUri && productId) {
    if (!cache.has(productId)) {
      cache.set(productId, await base44.asServiceRole.entities.MerchProduct.get(productId).catch(() => null));
    }
    fileUri = String((cache.get(productId) || {})?.digital_file_uri || '').trim();
  }
  if (!fileUri) return '';
  const signed = await base44.asServiceRole.integrations.Core.CreateFileSignedUrl({
    file_uri: fileUri,
    expires_in: DOWNLOAD_LINK_TTL_SECONDS,
  }).catch(() => null);
  const url = String(signed?.signed_url || '');
  return url.startsWith('https://') ? url : '';
}

export default async function (req: Request) {
  const startedAt = Date.now();
  const result = emptyResult();
  const base44 = createClientFromRequest(req);

  const logTask = async ({ title, description, outcome, risk }: { title: string; description: string; outcome: string; risk: string }) => {
    try {
      await base44.asServiceRole.entities.AgentTaskLog.create({
        agent_name: 'sendOrderReceipt',
        task_title: title,
        task_description: description,
        description: description.slice(0, 1000),
        outcome,
        was_automatic: true,
        required_approval: false,
        source_used: 'gmail',
        risk_check_result: risk,
        duration_ms: Date.now() - startedAt,
      });
    } catch (logError) {
      console.log(`sendOrderReceipt could not write an AgentTaskLog entry: ${(logError as Error)?.message || logError}`);
    }
  };

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return Response.json({ ...result, reason: 'Invalid JSON body' }, { status: 400 });
  }

  const orderId = typeof body?.order_id === 'string' ? body.order_id.trim() : '';
  const timestamp = Number(body?.timestamp);
  const signature = typeof body?.signature === 'string' ? body.signature.trim() : '';

  if (!orderId || !Number.isFinite(timestamp) || !signature) {
    return Response.json({ ...result, reason: 'order_id, timestamp and signature are required' }, { status: 400 });
  }

  const secret = Deno.env.get('RECEIPT_TRIGGER_SECRET');
  if (!secret) {
    return Response.json({ ...result, reason: 'RECEIPT_TRIGGER_SECRET is not configured' }, { status: 500 });
  }

  const expected = await signPayload(secret, `${orderId}.${timestamp}`);
  const signatureMatches = constantTimeEqual(expected.hex, signature.toLowerCase())
    || constantTimeEqual(expected.base64Url, signature);
  if (!signatureMatches) {
    return Response.json({ ...result, reason: 'Invalid signature' }, { status: 401 });
  }

  const age = Math.floor(Date.now() / 1000) - timestamp;
  if (age > MAX_SKEW_SECONDS || age < -MAX_SKEW_SECONDS) {
    return Response.json({ ...result, reason: 'Timestamp outside the 300 second window' }, { status: 401 });
  }

  let order: Record<string, unknown>;
  try {
    order = await base44.asServiceRole.entities.MerchOrder.get(orderId);
  } catch {
    result.reason = 'Order not found';
    await logTask({ title: 'Order receipt not sent', description: `Order ${orderId} could not be read.`, outcome: 'failed: order not found', risk: 'escalated' });
    return Response.json({ ...result, error: result.reason }, { status: 404 });
  }

  const orderNumber = `GW-${String(order.id || orderId).slice(-8).toUpperCase()}`;
  const to = String(order.customer_email || '').trim();
  result.order_number = orderNumber;
  result.to = to;

  // A repeat webhook event is harmless: an order is only ever receipted once.
  if (order.receipt_sent_at) {
    result.skipped = true;
    result.reason = 'already sent';
    return Response.json(result);
  }

  if (!to) {
    result.reason = 'Order has no customer email address';
    await logTask({ title: 'Order receipt not sent', description: `Order ${orderNumber} has no customer email address.`, outcome: 'failed: missing customer email', risk: 'escalated' });
    return Response.json({ ...result, error: result.reason });
  }

  try {
    const items = Array.isArray(order.items) ? order.items as Record<string, unknown>[] : [];
    const productCache = new Map<string, Record<string, unknown> | null>();
    const rows: string[] = [];
    const digitalLines: string[] = [];
    const dispatchLines: string[] = [];

    for (const item of items) {
      const quantity = Number(item.quantity) || 1;
      const unitPrice = Number(item.price) || 0;
      const name = String(item.product_name || 'Item');
      const size = item.size ? ` (${item.size})` : '';

      rows.push(
        `<tr>`
        + `<td style="padding:10px 12px;border-bottom:1px solid #2b2419;">${escapeHtml(name)}${escapeHtml(size)}</td>`
        + `<td style="padding:10px 12px;border-bottom:1px solid #2b2419;text-align:center;">${quantity}</td>`
        + `<td style="padding:10px 12px;border-bottom:1px solid #2b2419;text-align:right;">${money(unitPrice)}</td>`
        + `<td style="padding:10px 12px;border-bottom:1px solid #2b2419;text-align:right;">${money(unitPrice * quantity)}</td>`
        + `</tr>`,
      );

      const category = String(item.category || '').trim().toLowerCase();
      if (DIGITAL_CATEGORIES.has(category)) {
        const link = await resolveDownloadLink(base44, item, productCache);
        digitalLines.push(link
          ? `<li style="margin-bottom:8px;"><strong>${escapeHtml(name)}</strong>: <a href="${escapeHtml(link)}" style="color:#d2ae37;">Download your copy</a> (this link expires in 72 hours).</li>`
          : `<li style="margin-bottom:8px;"><strong>${escapeHtml(name)}</strong>: your download link will follow in a separate email to this address.</li>`);
      } else {
        dispatchLines.push(`<li style="margin-bottom:8px;"><strong>${escapeHtml(name)}</strong> is packed and dispatched from Australia. You will receive a tracking email as soon as it is on its way.</li>`);
      }
    }

    const orderDate = order.created_date
      ? new Date(String(order.created_date)).toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' })
      : '';

    const html = `<!DOCTYPE html>
<html><body style="margin:0;padding:24px;background:#0d0f12;font-family:Poppins,Helvetica,Arial,sans-serif;color:#f1e9da;">
<div style="max-width:600px;margin:0 auto;background:#14161a;border:1px solid #25272d;border-radius:4px;overflow:hidden;">
  <div style="background:#f1e9da;color:#0d0f12;padding:20px 28px;">
    <p style="margin:0;font-size:13px;letter-spacing:3px;text-transform:uppercase;">Gannon Waye Music</p>
  </div>
  <div style="padding:28px;">
    <h1 style="margin:0 0 6px;font-family:'Playfair Display',Georgia,serif;font-size:26px;">Thank you kindly, ${escapeHtml(order.customer_name || 'friend')}.</h1>
    <p style="margin:0 0 20px;font-size:14px;line-height:1.6;color:#af9f83;">Here is your receipt for order ${escapeHtml(orderNumber)}${orderDate ? `, placed ${escapeHtml(orderDate)}` : ''}.</p>
    <table style="width:100%;border-collapse:collapse;font-size:14px;">
      <thead><tr style="background:#1c1f25;">
        <th style="padding:10px 12px;text-align:left;font-weight:600;">Item</th>
        <th style="padding:10px 12px;text-align:center;font-weight:600;">Qty</th>
        <th style="padding:10px 12px;text-align:right;font-weight:600;">Price</th>
        <th style="padding:10px 12px;text-align:right;font-weight:600;">Line total</th>
      </tr></thead>
      <tbody>${rows.join('')}</tbody>
    </table>
    <table style="width:100%;border-collapse:collapse;font-size:14px;margin-top:16px;">
      <tr><td style="padding:6px 12px;color:#af9f83;">Subtotal</td><td style="padding:6px 12px;text-align:right;">${money(order.subtotal_amount)}</td></tr>
      <tr><td style="padding:6px 12px;color:#af9f83;">Postage</td><td style="padding:6px 12px;text-align:right;">${money(order.shipping_amount)}</td></tr>
      <tr><td style="padding:10px 12px;border-top:1px solid #2b2419;font-weight:700;">Total paid</td><td style="padding:10px 12px;border-top:1px solid #2b2419;text-align:right;font-weight:700;color:#d2ae37;">${money(order.total_amount)}</td></tr>
    </table>
    ${digitalLines.length ? `<div style="margin-top:24px;"><p style="margin:0 0 8px;font-size:13px;letter-spacing:2px;text-transform:uppercase;color:#d2ae37;">Your downloads</p><ul style="margin:0;padding-left:18px;font-size:14px;line-height:1.6;color:#f1e9da;">${digitalLines.join('')}</ul></div>` : ''}
    ${dispatchLines.length ? `<div style="margin-top:24px;"><p style="margin:0 0 8px;font-size:13px;letter-spacing:2px;text-transform:uppercase;color:#d2ae37;">Dispatch</p><ul style="margin:0;padding-left:18px;font-size:14px;line-height:1.6;color:#f1e9da;">${dispatchLines.join('')}</ul></div>` : ''}
    <p style="margin:24px 0 0;font-size:13px;line-height:1.6;color:#af9f83;">Any questions, reply to this email or write to ${FROM_ADDRESS} and quote order ${escapeHtml(orderNumber)}.</p>
  </div>
  <div style="padding:16px 28px;border-top:1px solid #25272d;font-size:12px;color:#af9f83;">
    <a href="${SITE_URL}" style="color:#d2ae37;text-decoration:none;">gannonwaye.com</a>
  </div>
</div>
</body></html>`;

    const text = [
      `Thank you kindly, ${order.customer_name || 'friend'}.`,
      '',
      `Receipt for order ${orderNumber}${orderDate ? `, placed ${orderDate}` : ''}`,
      '',
      ...items.map((item) => {
        const quantity = Number(item.quantity) || 1;
        const unitPrice = Number(item.price) || 0;
        const size = item.size ? ` (${item.size})` : '';
        return `${item.product_name || 'Item'}${size} x${quantity} — ${money(unitPrice)} each, ${money(unitPrice * quantity)}`;
      }),
      '',
      `Subtotal: ${money(order.subtotal_amount)}`,
      `Postage: ${money(order.shipping_amount)}`,
      `Total paid: ${money(order.total_amount)}`,
      ...(digitalLines.length ? ['', 'Your downloads: see the link in the HTML version of this email.'] : []),
      '',
      `Questions? Reply to this email or write to ${FROM_ADDRESS} and quote order ${orderNumber}.`,
      SITE_URL,
    ].join('\r\n');

    const { accessToken } = await base44.asServiceRole.connectors.getConnection('gmail');
    const response = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
      method: 'POST',
      headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        raw: buildMimeMessage({
          to,
          subject: `Your Gannon Waye Music receipt — order ${orderNumber}`,
          text,
          html,
        }),
      }),
      signal: AbortSignal.timeout(30000),
    });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(payload?.error?.message || `Gmail rejected the message (${response.status})`);
    }

    const sentAt = new Date().toISOString();
    await base44.asServiceRole.entities.MerchOrder.update(order.id as string, {
      receipt_sent_at: sentAt,
      receipt_sent: true,
      receipt_status: 'sent',
      receipt_message_id: String(payload?.id || ''),
    });

    result.sent = true;
    await logTask({ title: 'Order receipt sent', description: `Receipt for order ${orderNumber} sent to ${to}.`, outcome: 'sent', risk: 'pass' });
    return Response.json(result);
  } catch (error) {
    // No automatic retry: the failure is returned and logged for the owner.
    result.reason = (error as Error)?.message || 'Unknown error';
    await logTask({ title: 'Order receipt failed', description: `Receipt for order ${orderNumber} failed: ${result.reason}`, outcome: `failed: ${result.reason}`, risk: 'escalated' });
    return Response.json({ ...result, error: result.reason });
  }
}