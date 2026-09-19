import { createClientFromRequest } from 'npm:@base44/sdk@0.8.48';
import { exact } from '../../shared/messagingControl.ts';
import { twimlEmptyResponse, validateTwilioFormRequest } from '../../shared/twilioWebhook.ts';

const DELIVERED = new Set(['delivered']);
const FAILED = new Set(['failed', 'undelivered', 'canceled']);

export default async function(req: Request) {
  if (req.method !== 'POST') return twimlEmptyResponse(405);

  const authToken = exact(Deno.env.get('TWILIO_AUTH_TOKEN'));
  if (!authToken) return twimlEmptyResponse(503);

  const raw = await req.text();
  const params = new URLSearchParams(raw);
  const valid = await validateTwilioFormRequest(req, params, authToken);
  if (!valid) return twimlEmptyResponse(403);

  const sid = exact(params.get('MessageSid'));
  const status = exact(params.get('MessageStatus')).toLowerCase();
  const errorCode = exact(params.get('ErrorCode'));
  if (!sid || (!DELIVERED.has(status) && !FAILED.has(status))) {
    return twimlEmptyResponse(200);
  }

  const base44 = createClientFromRequest(req);
  const sr = base44.asServiceRole;
  const existing = await sr.entities.MessagingDeliveryReceipt.filter(
    { provider: 'twilio', provider_message_id: sid },
    '-created_date',
    20,
  ).catch(() => []);

  const source = existing?.[0];
  if (!source?.id) return twimlEmptyResponse(200);

  const terminal = DELIVERED.has(status) ? 'delivered' : 'failed';
  if (existing.some((r: any) => exact(r.provider_status) === terminal)) {
    return twimlEmptyResponse(200);
  }

  const now = new Date().toISOString();
  await sr.entities.MessagingDeliveryReceipt.create({
    message_draft_id: source.message_draft_id,
    approval_receipt_id: source.approval_receipt_id,
    channel: 'sms_fan',
    recipient_ref: source.recipient_ref,
    consent_record_id: source.consent_record_id,
    provider: 'twilio',
    provider_message_id: sid,
    provider_status: terminal,
    content_fingerprint: source.content_fingerprint,
    send_request_id: source.send_request_id,
    claim_id: source.claim_id,
    attempted_at: source.attempted_at || now,
    delivered_at: terminal === 'delivered' ? now : null,
    error_code: errorCode || (terminal === 'failed' ? status : ''),
    detail: terminal === 'delivered'
      ? 'Twilio delivery callback confirmed delivery.'
      : 'Twilio delivery callback reported ' + status + '.',
    external_actions: 0,
    created_at: now,
    updated_at: now,
    created_by: 'twilio_status_webhook',
  }).catch(() => undefined);

  return twimlEmptyResponse(200);
}
