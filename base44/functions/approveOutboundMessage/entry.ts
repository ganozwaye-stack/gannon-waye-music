import { createClientFromRequest } from 'npm:@base44/sdk@0.8.48';
import {
  MESSAGING_CONTROL_VERSION,
  exact,
  expectedApprovalPhrase,
  fingerprintOutboundMessage,
  isExactOwner,
  smsBodyComplianceErrors,
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
  const confirmFingerprint = exact(body.confirm_content_fingerprint);
  const confirmPhrase = exact(body.confirm_approval_phrase);
  if (!draftId || !confirmFingerprint || !confirmPhrase) {
    return Response.json({
      error: 'draft_id, confirm_content_fingerprint and confirm_approval_phrase are required.',
    }, { status: 400 });
  }

  const sr = base44.asServiceRole;
  const draft = await sr.entities.OutboundMessageDraft.get(draftId).catch(() => null);
  if (!draft?.id) return Response.json({ error: 'Message draft not found.' }, { status: 404 });

  if (!['draft', 'pending'].includes(exact(draft.approval_status))) {
    return Response.json({ error: 'Only a draft or pending message may be approved.' }, { status: 409 });
  }

  const complianceErrors = smsBodyComplianceErrors(draft);
  if (complianceErrors.length) {
    return Response.json({ error: 'SMS compliance gate failed.', details: complianceErrors }, { status: 409 });
  }

  const fingerprint = await fingerprintOutboundMessage(draft);
  if (fingerprint !== confirmFingerprint) {
    return Response.json({
      error: 'The message changed or the exact content fingerprint was not confirmed.',
      current_content_fingerprint: fingerprint,
    }, { status: 409 });
  }

  const requiredPhrase = expectedApprovalPhrase(draft);
  if (confirmPhrase !== requiredPhrase) {
    return Response.json({
      error: 'The exact approval phrase is required.',
      required_phrase: requiredPhrase,
    }, { status: 409 });
  }

  const approvedAt = new Date().toISOString();
  const actorEmail = exact(user.email).toLowerCase();
  const claimId = crypto.randomUUID();

  const claim = await sr.entities.OutboundMessageDraft.updateMany(
    {
      id: draft.id,
      updated_date: draft.updated_date,
      approval_status: draft.approval_status,
    },
    {
      $set: {
        approval_status: 'claimed',
        content_fingerprint: fingerprint,
        approved_by: actorEmail,
        approved_at: approvedAt,
        claim_id: claimId,
        updated_at: approvedAt,
      },
    },
  );

  if (!casSucceeded(claim)) {
    return Response.json({
      error: 'The draft changed before approval could be claimed. Nothing was approved.',
    }, { status: 409 });
  }

  let receipt: any;
  try {
    receipt = await sr.entities.MessagingApprovalReceipt.create({
      message_draft_id: draft.id,
      channel: exact(draft.channel),
      recipient_scope: exact(draft.recipient_scope),
      recipient_ref: exact(draft.recipient_ref),
      audience_description: exact(draft.audience_description),
      content_fingerprint: fingerprint,
      approved_by: actorEmail,
      approved_at: approvedAt,
      approval_phrase: requiredPhrase,
      approval_note: exact(body.approval_note).slice(0, 1000),
      control_version: MESSAGING_CONTROL_VERSION,
      created_at: approvedAt,
      updated_at: approvedAt,
      created_by: actorEmail,
    });
  } catch {
    await sr.entities.OutboundMessageDraft.updateMany(
      { id: draft.id, approval_status: 'claimed', claim_id: claimId },
      { $set: { approval_status: 'blocked', provider_status: 'blocked', updated_at: new Date().toISOString() } },
    ).catch(() => undefined);
    return Response.json({
      error: 'The immutable approval receipt could not be written. Distribution remains blocked.',
    }, { status: 503 });
  }

  const finalized = await sr.entities.OutboundMessageDraft.updateMany(
    { id: draft.id, approval_status: 'claimed', claim_id: claimId },
    {
      $set: {
        approval_status: 'approved',
        approval_receipt_id: receipt.id,
        provider_status: 'ready',
        updated_at: new Date().toISOString(),
      },
    },
  );

  if (!casSucceeded(finalized)) {
    return Response.json({
      error: 'Approval receipt exists, but the draft could not reach approved state. Distribution remains blocked pending reconciliation.',
      approval_receipt_id: receipt.id,
    }, { status: 503 });
  }

  return Response.json({
    approved: true,
    draft_id: draft.id,
    approval_receipt_id: receipt.id,
    content_fingerprint: fingerprint,
    approved_by: actorEmail,
    approved_at: approvedAt,
    required_send_gate: 'Separate distribution call required. Approval alone sends nothing.',
  });
}
