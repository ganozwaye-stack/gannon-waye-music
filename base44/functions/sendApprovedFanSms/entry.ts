import { createClientFromRequest } from 'npm:@base44/sdk@0.8.48';
import {
  approvalMatchesDraft,
  exact,
  fingerprintOutboundMessage,
  isExactOwner,
  smsBodyComplianceErrors,
  twilioBasicAuth,
  validE164,
  validSendRequestId,
} from '../../shared/messagingControl.ts';

const MAX_RECIPIENTS = 250;

function casSucceeded(result: any) {
  return Boolean(result?.success) && Number(result?.updated) === 1;
}

function dedupeConsents(rows: any[]) {
  const byPhone = new Map<string, any>();
  for (const row of rows || []) {
    const phone = exact(row?.phone_number);
    if (!validE164(phone) || row?.consent_status !== 'opted_in' || row?.channel !== 'sms') continue;
    if (!byPhone.has(phone)) byPhone.set(phone, row);
  }
  return Array.from(byPhone.values());
}

export default async function(req: Request) {
  if (req.method !== 'POST') {
    return Response.json({ error: 'POST required' }, { status: 405 });
  }

  const base44 = createClientFromRequest(req);
  const user = await base44.auth.me().catch(() => null);
  if (!isExactOwner(user)) {
    return Response.json({ error: 'Exact owner sign-in is required.' }, { status: 403 });
  }

  const request = await req.json().catch(() => ({}));
  const draftId = exact(request.draft_id);
  const sendRequestId = exact(request.send_request_id);
  if (!draftId || !validSendRequestId(sendRequestId)) {
    return Response.json({ error: 'draft_id and a valid one-time send_request_id are required.' }, { status: 400 });
  }

  const sr = base44.asServiceRole;
  const configs = await sr.entities.MessagingChannelConfig.filter({ channel_key: 'sms_fan' }, '-created_date', 1);
  const config = configs?.[0];
  if (
    !config
    || config.status !== 'ready'
    || config.send_enabled !== true
    || config.credentials_configured !== true
    || config.destination_configured !== true
  ) {
    return Response.json({
      error: 'Fan SMS is prepared but the provider and business number are not connected and enabled.',
      code: 'sms_not_configured',
      external_actions: 0,
    }, { status: 503 });
  }

  const accountSid = exact(Deno.env.get('TWILIO_ACCOUNT_SID'));
  const authToken = exact(Deno.env.get('TWILIO_AUTH_TOKEN'));
  const fromNumber = exact(Deno.env.get('TWILIO_PHONE_NUMBER'));
  const statusCallback = exact(Deno.env.get('TWILIO_STATUS_CALLBACK_URL'));
  if (!accountSid || !authToken || !validE164(fromNumber)) {
    return Response.json({
      error: 'Twilio secure credentials or the sending number are missing.',
      code: 'twilio_secrets_missing',
      external_actions: 0,
    }, { status: 503 });
  }

  const draft = await sr.entities.OutboundMessageDraft.get(draftId).catch(() => null);
  if (!draft?.id) return Response.json({ error: 'Message draft not found.' }, { status: 404 });
  if (draft.channel !== 'sms_fan') {
    return Response.json({ error: 'This draft is not a fan SMS message.' }, { status: 409 });
  }
  if (!['individual', 'opted_in_sms_segment'].includes(exact(draft.recipient_scope))) {
    return Response.json({ error: 'Unsupported SMS recipient scope.' }, { status: 409 });
  }
  if (draft.approval_status !== 'approved' || !exact(draft.approval_receipt_id)) {
    return Response.json({ error: 'Exact owner approval is required before fan SMS distribution.' }, { status: 409 });
  }

  const complianceErrors = smsBodyComplianceErrors(draft);
  if (complianceErrors.length) {
    return Response.json({ error: 'SMS compliance gate failed.', details: complianceErrors }, { status: 409 });
  }

  const fingerprint = await fingerprintOutboundMessage(draft);
  if (exact(draft.content_fingerprint) !== fingerprint) {
    return Response.json({ error: 'The approved SMS content has changed. New approval is required.' }, { status: 409 });
  }

  const approvalReceipt = await sr.entities.MessagingApprovalReceipt.get(exact(draft.approval_receipt_id)).catch(() => null);
  if (!approvalMatchesDraft(approvalReceipt, draft, fingerprint)) {
    return Response.json({ error: 'The immutable approval receipt does not match this SMS draft.' }, { status: 409 });
  }

  const prior = await sr.entities.MessagingDeliveryReceipt.filter(
    { message_draft_id: draft.id, send_request_id: sendRequestId },
    '-created_date',
    50,
  );
  if (prior?.some((r: any) => ['accepted', 'delivered'].includes(exact(r.provider_status)))) {
    return Response.json({
      sent: true,
      deduplicated: true,
      draft_id: draft.id,
      reason: 'This exact send request already has a provider acceptance receipt.',
    });
  }

  let consentRows: any[] = [];
  if (draft.recipient_scope === 'individual') {
    const phone = exact(draft.recipient_ref);
    if (!validE164(phone)) {
      return Response.json({ error: 'The individual recipient must be an E.164 phone number.' }, { status: 409 });
    }
    consentRows = await sr.entities.FanMessagingConsent.filter(
      { contact_key: phone, channel: 'sms', consent_status: 'opted_in' },
      '-created_date',
      10,
    );
    consentRows = consentRows.filter((row: any) => exact(row.phone_number) === phone);
  } else {
    consentRows = await sr.entities.FanMessagingConsent.filter(
      { channel: 'sms', consent_status: 'opted_in' },
      '-created_date',
      500,
    );
  }

  const recipients = dedupeConsents(consentRows);
  if (!recipients.length) {
    return Response.json({
      error: 'No recipient with explicit active SMS consent matched this approved audience.',
      external_actions: 0,
    }, { status: 409 });
  }
  if (recipients.length > MAX_RECIPIENTS) {
    return Response.json({
      error: 'Approved audience exceeds the safety cap. Split the audience and approve each exact segment separately.',
      recipient_count: recipients.length,
      max_recipients: MAX_RECIPIENTS,
      external_actions: 0,
    }, { status: 409 });
  }

  const claimId = crypto.randomUUID();
  const claimedAt = new Date().toISOString();
  const claim = await sr.entities.OutboundMessageDraft.updateMany(
    { id: draft.id, updated_date: draft.updated_date, approval_status: 'approved' },
    {
      $set: {
        approval_status: 'claimed',
        send_request_id: sendRequestId,
        claim_id: claimId,
        provider_status: 'attempted',
        recipient_count_estimate: recipients.length,
        updated_at: claimedAt,
      },
    },
  );
  if (!casSucceeded(claim)) {
    return Response.json({ error: 'The draft changed before the send claim was recorded. No SMS was sent.' }, { status: 409 });
  }

  try {
    await sr.entities.MessagingDeliveryReceipt.create({
      message_draft_id: draft.id,
      approval_receipt_id: draft.approval_receipt_id,
      channel: 'sms_fan',
      recipient_ref: draft.recipient_scope === 'individual' ? exact(draft.recipient_ref) : 'approved_opted_in_segment',
      provider: 'twilio',
      provider_status: 'claimed',
      content_fingerprint: fingerprint,
      send_request_id: sendRequestId,
      claim_id: claimId,
      attempted_at: claimedAt,
      detail: 'Owner-approved SMS dispatch claim recorded before provider calls. Audience count: ' + String(recipients.length) + '.',
      external_actions: 0,
      created_at: claimedAt,
      updated_at: claimedAt,
      created_by: exact(user.email).toLowerCase(),
    });
  } catch {
    await sr.entities.OutboundMessageDraft.updateMany(
      { id: draft.id, approval_status: 'claimed', claim_id: claimId },
      { $set: { approval_status: 'blocked', provider_status: 'blocked', updated_at: new Date().toISOString() } },
    ).catch(() => undefined);
    return Response.json({ error: 'Pre-send receipt could not be written. No SMS was sent.' }, { status: 503 });
  }

  let accepted = 0;
  let failed = 0;
  const endpoint = 'https://api.twilio.com/2010-04-01/Accounts/' + encodeURIComponent(accountSid) + '/Messages.json';

  for (const consent of recipients) {
    const phone = exact(consent.phone_number);
    const attemptedAt = new Date().toISOString();
    try {
      const form = new URLSearchParams();
      form.set('To', phone);
      form.set('From', fromNumber);
      form.set('Body', String(draft.body ?? ''));
      if (statusCallback) form.set('StatusCallback', statusCallback);

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          authorization: twilioBasicAuth(accountSid, authToken),
          'content-type': 'application/x-www-form-urlencoded',
        },
        body: form.toString(),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok || !exact(data?.sid)) {
        throw new Error(exact(data?.message) || 'Twilio rejected the SMS.');
      }

      accepted += 1;
      await sr.entities.MessagingDeliveryReceipt.create({
        message_draft_id: draft.id,
        approval_receipt_id: draft.approval_receipt_id,
        channel: 'sms_fan',
        recipient_ref: phone,
        consent_record_id: consent.id,
        provider: 'twilio',
        provider_message_id: exact(data.sid),
        provider_status: 'accepted',
        content_fingerprint: fingerprint,
        send_request_id: sendRequestId,
        claim_id: claimId,
        attempted_at: attemptedAt,
        detail: 'Twilio accepted the SMS for an explicitly opted-in recipient.',
        external_actions: 1,
        created_at: attemptedAt,
        updated_at: attemptedAt,
        created_by: exact(user.email).toLowerCase(),
      });
    } catch (error) {
      failed += 1;
      const detail = error instanceof Error ? error.message : 'Twilio provider error';
      await sr.entities.MessagingDeliveryReceipt.create({
        message_draft_id: draft.id,
        approval_receipt_id: draft.approval_receipt_id,
        channel: 'sms_fan',
        recipient_ref: phone,
        consent_record_id: consent.id,
        provider: 'twilio',
        provider_status: 'failed',
        content_fingerprint: fingerprint,
        send_request_id: sendRequestId,
        claim_id: claimId,
        attempted_at: attemptedAt,
        error_code: 'twilio_provider_failure',
        detail: detail.slice(0, 1500),
        external_actions: 1,
        created_at: attemptedAt,
        updated_at: attemptedAt,
        created_by: exact(user.email).toLowerCase(),
      }).catch(() => undefined);
    }
  }

  const completedAt = new Date().toISOString();
  const finalProviderStatus = failed ? 'failed' : 'accepted';
  const finished = await sr.entities.OutboundMessageDraft.updateMany(
    { id: draft.id, approval_status: 'claimed', claim_id: claimId, send_request_id: sendRequestId },
    {
      $set: {
        approval_status: 'sent',
        provider_status: finalProviderStatus,
        sent_at: completedAt,
        updated_at: completedAt,
      },
    },
  );

  if (!casSucceeded(finished)) {
    return Response.json({
      error: 'Provider calls completed but the draft did not reach terminal state. It will not retry automatically.',
      accepted_count: accepted,
      failed_count: failed,
    }, { status: 503 });
  }

  return Response.json({
    sent: true,
    draft_id: draft.id,
    recipient_count: recipients.length,
    accepted_count: accepted,
    failed_count: failed,
    provider_status: finalProviderStatus,
    no_automatic_retry: true,
  });
}
