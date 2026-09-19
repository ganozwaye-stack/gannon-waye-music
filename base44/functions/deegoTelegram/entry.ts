import { createClientFromRequest } from 'npm:@base44/sdk@0.8.48';
import {
  approvalMatchesDraft,
  exact,
  fingerprintOutboundMessage,
  isExactOwner,
  validSendRequestId,
} from '../../shared/messagingControl.ts';

function casSucceeded(result: any) {
  return Boolean(result?.success) && Number(result?.updated) === 1;
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

  const body = await req.json().catch(() => ({}));
  const draftId = exact(body.draft_id);
  const sendRequestId = exact(body.send_request_id);
  if (!draftId || !validSendRequestId(sendRequestId)) {
    return Response.json({ error: 'draft_id and a valid one-time send_request_id are required.' }, { status: 400 });
  }

  const sr = base44.asServiceRole;
  const configs = await sr.entities.MessagingChannelConfig.filter({ channel_key: 'telegram_owner' }, '-created_date', 1);
  const config = configs?.[0];
  if (
    !config
    || config.status !== 'ready'
    || config.send_enabled !== true
    || config.credentials_configured !== true
    || config.destination_configured !== true
  ) {
    return Response.json({
      error: 'Deego Telegram is prepared but not connected and enabled.',
      code: 'telegram_not_configured',
      external_actions: 0,
    }, { status: 503 });
  }

  const token = exact(Deno.env.get('TELEGRAM_BOT_TOKEN'));
  const chatId = exact(Deno.env.get('TELEGRAM_OWNER_CHAT_ID'));
  if (!token || !chatId) {
    return Response.json({
      error: 'Telegram secure secrets are missing.',
      code: 'telegram_secrets_missing',
      external_actions: 0,
    }, { status: 503 });
  }

  const draft = await sr.entities.OutboundMessageDraft.get(draftId).catch(() => null);
  if (!draft?.id) return Response.json({ error: 'Message draft not found.' }, { status: 404 });
  if (draft.channel !== 'telegram_owner' || draft.recipient_scope !== 'owner') {
    return Response.json({ error: 'This draft is not an owner Telegram message.' }, { status: 409 });
  }
  if (draft.approval_status !== 'approved' || !exact(draft.approval_receipt_id)) {
    return Response.json({ error: 'Exact owner approval is required before Telegram distribution.' }, { status: 409 });
  }

  const fingerprint = await fingerprintOutboundMessage(draft);
  if (exact(draft.content_fingerprint) !== fingerprint) {
    return Response.json({ error: 'The approved Telegram content has changed. New approval is required.' }, { status: 409 });
  }

  const receipt = await sr.entities.MessagingApprovalReceipt.get(exact(draft.approval_receipt_id)).catch(() => null);
  if (!approvalMatchesDraft(receipt, draft, fingerprint)) {
    return Response.json({ error: 'The immutable approval receipt does not match this Telegram draft.' }, { status: 409 });
  }

  const prior = await sr.entities.MessagingDeliveryReceipt.filter(
    { message_draft_id: draft.id, send_request_id: sendRequestId },
    '-created_date',
    10,
  );
  if (prior?.some((r: any) => ['accepted', 'delivered'].includes(exact(r.provider_status)))) {
    return Response.json({ sent: true, deduplicated: true, draft_id: draft.id });
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
        updated_at: claimedAt,
      },
    },
  );
  if (!casSucceeded(claim)) {
    return Response.json({ error: 'The draft changed before the send claim was recorded. No Telegram message was sent.' }, { status: 409 });
  }

  try {
    await sr.entities.MessagingDeliveryReceipt.create({
      message_draft_id: draft.id,
      approval_receipt_id: draft.approval_receipt_id,
      channel: 'telegram_owner',
      recipient_ref: 'owner',
      provider: 'telegram_bot',
      provider_status: 'claimed',
      content_fingerprint: fingerprint,
      send_request_id: sendRequestId,
      claim_id: claimId,
      attempted_at: claimedAt,
      detail: 'Owner-approved Telegram dispatch claim recorded before provider call.',
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
    return Response.json({ error: 'Pre-send receipt could not be written. No Telegram message was sent.' }, { status: 503 });
  }

  let providerData: any = null;
  try {
    const response = await fetch('https://api.telegram.org/bot' + token + '/sendMessage', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: String(draft.body ?? ''),
        disable_web_page_preview: true,
      }),
    });
    providerData = await response.json().catch(() => ({}));
    if (!response.ok || providerData?.ok !== true || !providerData?.result?.message_id) {
      throw new Error(exact(providerData?.description) || 'Telegram provider rejected the message.');
    }
  } catch (error) {
    const failedAt = new Date().toISOString();
    const detail = error instanceof Error ? error.message : 'Telegram provider error';
    await sr.entities.MessagingDeliveryReceipt.create({
      message_draft_id: draft.id,
      approval_receipt_id: draft.approval_receipt_id,
      channel: 'telegram_owner',
      recipient_ref: 'owner',
      provider: 'telegram_bot',
      provider_status: 'failed',
      content_fingerprint: fingerprint,
      send_request_id: sendRequestId,
      claim_id: claimId,
      attempted_at: failedAt,
      error_code: 'telegram_provider_failure',
      detail: detail.slice(0, 1500),
      external_actions: 1,
      created_at: failedAt,
      updated_at: failedAt,
      created_by: exact(user.email).toLowerCase(),
    }).catch(() => undefined);
    await sr.entities.OutboundMessageDraft.updateMany(
      { id: draft.id, approval_status: 'claimed', claim_id: claimId },
      { $set: { approval_status: 'blocked', provider_status: 'failed', updated_at: failedAt } },
    ).catch(() => undefined);
    return Response.json({ error: 'Telegram send failed and will not retry automatically.' }, { status: 502 });
  }

  const completedAt = new Date().toISOString();
  const messageId = String(providerData.result.message_id);
  await sr.entities.MessagingDeliveryReceipt.create({
    message_draft_id: draft.id,
    approval_receipt_id: draft.approval_receipt_id,
    channel: 'telegram_owner',
    recipient_ref: 'owner',
    provider: 'telegram_bot',
    provider_message_id: messageId,
    provider_status: 'accepted',
    content_fingerprint: fingerprint,
    send_request_id: sendRequestId,
    claim_id: claimId,
    attempted_at: completedAt,
    detail: 'Telegram Bot API accepted the owner-approved message.',
    external_actions: 1,
    created_at: completedAt,
    updated_at: completedAt,
    created_by: exact(user.email).toLowerCase(),
  });

  const finished = await sr.entities.OutboundMessageDraft.updateMany(
    { id: draft.id, approval_status: 'claimed', claim_id: claimId, send_request_id: sendRequestId },
    {
      $set: {
        approval_status: 'sent',
        provider_status: 'accepted',
        sent_at: completedAt,
        updated_at: completedAt,
      },
    },
  );
  if (!casSucceeded(finished)) {
    return Response.json({
      error: 'Telegram accepted the message but the draft did not reach terminal state. It remains protected from automatic retry.',
      provider_message_id: messageId,
    }, { status: 503 });
  }

  return Response.json({
    sent: true,
    draft_id: draft.id,
    provider_message_id: messageId,
    provider_status: 'accepted',
  });
}
