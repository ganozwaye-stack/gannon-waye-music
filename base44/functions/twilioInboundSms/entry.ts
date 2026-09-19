import { createClientFromRequest } from 'npm:@base44/sdk@0.8.48';
import { exact, validE164 } from '../../shared/messagingControl.ts';
import { twimlEmptyResponse, validateTwilioFormRequest } from '../../shared/twilioWebhook.ts';

const STOP_WORDS = new Set(['STOP', 'UNSUBSCRIBE', 'CANCEL', 'END', 'QUIT', 'STOPALL']);
const START_WORDS = new Set(['START', 'UNSTOP']);

function normaliseKeyword(body: string) {
  return body.trim().toUpperCase().replace(/\s+/g, ' ');
}

export default async function(req: Request) {
  if (req.method !== 'POST') return twimlEmptyResponse(405);

  const authToken = exact(Deno.env.get('TWILIO_AUTH_TOKEN'));
  if (!authToken) return twimlEmptyResponse(503);

  const raw = await req.text();
  const params = new URLSearchParams(raw);
  const valid = await validateTwilioFormRequest(req, params, authToken);
  if (!valid) return twimlEmptyResponse(403);

  const from = exact(params.get('From'));
  const messageSid = exact(params.get('MessageSid'));
  const body = exact(params.get('Body'));
  const optOutType = exact(params.get('OptOutType')).toUpperCase();
  if (!validE164(from)) return twimlEmptyResponse(200);

  const base44 = createClientFromRequest(req);
  const sr = base44.asServiceRole;
  const now = new Date().toISOString();
  const keyword = normaliseKeyword(body);

  const isStop = optOutType === 'STOP' || STOP_WORDS.has(keyword);
  const isStart = optOutType === 'START' || START_WORDS.has(keyword);

  if (isStop) {
    const updated = await sr.entities.FanMessagingConsent.updateMany(
      { contact_key: from, channel: 'sms' },
      {
        $set: {
          phone_number: from,
          consent_status: 'opted_out',
          revoked_at: now,
          last_inbound_keyword: keyword || 'STOP',
          suppression_reason: 'Recipient opted out by inbound SMS.',
          updated_at: now,
        },
      },
    ).catch(() => null);

    if (!updated || Number(updated.updated || 0) === 0) {
      await sr.entities.FanMessagingConsent.create({
        contact_key: from,
        phone_number: from,
        channel: 'sms',
        consent_status: 'opted_out',
        consent_source: 'twilio_inbound_opt_out',
        consent_evidence: 'Inbound opt-out recorded from Twilio webhook. MessageSid: ' + messageSid,
        revoked_at: now,
        last_inbound_keyword: keyword || 'STOP',
        suppression_reason: 'Recipient opted out by inbound SMS.',
        created_at: now,
        updated_at: now,
        created_by: 'twilio_webhook',
      }).catch(() => undefined);
    }

    await sr.entities.AdminNotification.create({
      notification_type: 'system',
      severity: 'info',
      title: 'SMS opt-out recorded',
      summary: 'A recipient opted out of Gannon Waye SMS updates. The number is now suppressed from approved fan campaigns.',
      source: 'twilioInboundSms',
      requires_action: false,
      linked_entity: 'FanMessagingConsent',
    }).catch(() => undefined);

    return twimlEmptyResponse(200);
  }

  if (isStart) {
    const existing = await sr.entities.FanMessagingConsent.filter(
      { contact_key: from, channel: 'sms' },
      '-created_date',
      10,
    ).catch(() => []);

    if (existing?.length) {
      await sr.entities.FanMessagingConsent.updateMany(
        { contact_key: from, channel: 'sms' },
        {
          $set: {
            phone_number: from,
            consent_status: 'opted_in',
            consent_source: 'twilio_inbound_start',
            consent_evidence: 'Inbound START recorded from Twilio webhook. MessageSid: ' + messageSid,
            consent_at: now,
            revoked_at: null,
            last_inbound_keyword: keyword || 'START',
            suppression_reason: '',
            updated_at: now,
          },
        },
      ).catch(() => undefined);
    } else {
      await sr.entities.FanMessagingConsent.create({
        contact_key: from,
        phone_number: from,
        channel: 'sms',
        consent_status: 'opted_in',
        consent_source: 'twilio_inbound_start',
        consent_evidence: 'Inbound START recorded from Twilio webhook. MessageSid: ' + messageSid,
        consent_at: now,
        last_inbound_keyword: keyword || 'START',
        created_at: now,
        updated_at: now,
        created_by: 'twilio_webhook',
      }).catch(() => undefined);
    }

    await sr.entities.AdminNotification.create({
      notification_type: 'system',
      severity: 'info',
      title: 'SMS opt-in recorded',
      summary: 'A recipient opted in to Gannon Waye SMS updates through the business number.',
      source: 'twilioInboundSms',
      requires_action: false,
      linked_entity: 'FanMessagingConsent',
    }).catch(() => undefined);

    return twimlEmptyResponse(200);
  }

  await sr.entities.AdminNotification.create({
    notification_type: 'reply',
    severity: 'info',
    title: 'Inbound business SMS received',
    summary: 'A message arrived on the Gannon Waye business SMS channel. No automated reply was sent.',
    source: 'twilioInboundSms',
    requires_action: true,
    linked_entity: 'BusinessPhoneNumber',
  }).catch(() => undefined);

  return twimlEmptyResponse(200);
}
