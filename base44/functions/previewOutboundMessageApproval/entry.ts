import { createClientFromRequest } from 'npm:@base44/sdk@0.8.48';
import {
  exact,
  expectedApprovalPhrase,
  fingerprintOutboundMessage,
  isExactOwner,
  smsBodyComplianceErrors,
} from '../../shared/messagingControl.ts';

export default async function(req: Request) {
  if (req.method !== 'POST') {
    return Response.json({ error: 'POST required' }, { status: 405 });
  }

  const base44 = createClientFromRequest(req);
  const user = await base44.auth.me().catch(() => null);
  if (!isExactOwner(user)) {
    return Response.json({ error: 'Exact owner sign-in is required.' }, { status: 403 });
  }

  const body = await req.json().catch(() => ({}));
  const draftId = exact(body.draft_id);
  if (!draftId) return Response.json({ error: 'draft_id is required.' }, { status: 400 });

  const sr = base44.asServiceRole;
  const draft = await sr.entities.OutboundMessageDraft.get(draftId).catch(() => null);
  if (!draft?.id) return Response.json({ error: 'Message draft not found.' }, { status: 404 });

  const fingerprint = await fingerprintOutboundMessage(draft);
  const complianceErrors = smsBodyComplianceErrors(draft);
  let eligibleRecipientCount = 0;

  if (draft.channel === 'sms_fan') {
    if (draft.recipient_scope === 'individual') {
      const rows = await sr.entities.FanMessagingConsent.filter(
        {
          contact_key: exact(draft.recipient_ref),
          channel: 'sms',
          consent_status: 'opted_in',
        },
        '-created_date',
        10,
      ).catch(() => []);
      eligibleRecipientCount = rows?.length ? 1 : 0;
    } else if (draft.recipient_scope === 'opted_in_sms_segment') {
      const rows = await sr.entities.FanMessagingConsent.filter(
        { channel: 'sms', consent_status: 'opted_in' },
        '-created_date',
        500,
      ).catch(() => []);
      eligibleRecipientCount = new Set(
        (rows || []).map((row: any) => exact(row.phone_number)).filter(Boolean),
      ).size;
    }
  } else if (draft.channel === 'telegram_owner' && draft.recipient_scope === 'owner') {
    eligibleRecipientCount = 1;
  }

  const configs = await sr.entities.MessagingChannelConfig.filter(
    { channel_key: draft.channel },
    '-created_date',
    1,
  ).catch(() => []);

  const config = configs?.[0] || null;

  return Response.json({
    draft_id: draft.id,
    channel: draft.channel,
    message_type: draft.message_type,
    title: draft.title,
    body: draft.body,
    recipient_scope: draft.recipient_scope,
    recipient_ref: draft.recipient_ref,
    audience_description: draft.audience_description,
    current_approval_status: draft.approval_status,
    content_fingerprint: fingerprint,
    required_approval_phrase: expectedApprovalPhrase(draft),
    compliance_errors: complianceErrors,
    eligible_recipient_count: eligibleRecipientCount,
    channel_status: config?.status || 'not_configured',
    channel_send_enabled: config?.send_enabled === true,
    provider_ready: Boolean(
      config
      && config.status === 'ready'
      && config.send_enabled === true
      && config.credentials_configured === true
      && config.destination_configured === true
    ),
    note: 'Preview only. No communication was distributed.',
  });
}
