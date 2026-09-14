import { createClientFromRequest } from 'npm:@base44/sdk@0.8.48';
import { collectFanEmailAudience } from '../../shared/fanEmailAudience.ts';
import {
  OWNER_EMAILS,
  RELEASE_CONTROL_VERSION,
  exact,
  fingerprintReleaseControl,
  fingerprintReleaseEmailDraft,
  isExactOwner,
  releaseEvidenceErrors,
  validSendRequestId,
} from '../../shared/releaseControl.ts';

// Sends one manually confirmed release email only after compare-and-set claims
// are durable. A claimed or blocked send is never retried automatically.

const MAX_RECIPIENTS = 250;

function errorMessage(error: unknown) {
  return error instanceof Error ? error.message : 'Unknown error';
}

function casSucceeded(result: any) {
  return Boolean(result?.success) && Number(result?.updated) === 1;
}

function approvalMatches(receipt: any, release: any, fingerprint: string) {
  return Boolean(
    receipt
    && exact(receipt.release_id) === exact(release.id)
    && exact(receipt.release_title) === exact(release.title)
    && exact(receipt.version_label) === exact(release.version_label)
    && exact(receipt.content_fingerprint) === fingerprint
    && exact(receipt.approved_by).toLowerCase() === exact(release.public_release_approved_by).toLowerCase()
    && receipt.approved_at === release.public_release_approved_at
    && receipt.control_version === RELEASE_CONTROL_VERSION,
  );
}

async function blockClaim(sr: any, draft: any, release: any, claimId: string, requestId: string, actorEmail: string, releaseFingerprint: string, draftFingerprint: string, detail: string) {
  const now = new Date().toISOString();
  await sr.entities.ReleaseEmailDraft.updateMany(
    { id: draft.id, send_state: 'claimed', send_claim_id: claimId },
    {
      $set: {
        approval_status: 'send_failed',
        send_state: 'blocked',
        send_blocked_at: now,
      },
    },
  ).catch(() => undefined);
  await sr.entities.Release.updateMany(
    { id: release.id, release_email_dispatch_state: 'claimed', release_email_dispatch_claim_id: claimId },
    { $set: { release_email_dispatch_state: 'blocked' } },
  ).catch(() => undefined);
  await sr.entities.ReleaseEmailSendReceipt.create({
    release_id: release.id,
    release_title: exact(release.title),
    draft_id: draft.id,
    status: exact(draft.status),
    receipt_type: 'blocked',
    claim_id: claimId,
    send_request_id: requestId,
    release_fingerprint: releaseFingerprint,
    draft_fingerprint: draftFingerprint,
    claimed_by: actorEmail,
    recorded_at: now,
    detail: detail.slice(0, 1000),
    control_version: RELEASE_CONTROL_VERSION,
  }).catch(() => undefined);
}

export default async function (req: Request) {
  let sr: any = null;
  let claimedDraft: any = null;
  let claimedRelease: any = null;
  let claimId = '';
  let requestId = '';
  let actorEmail = '';
  let releaseFingerprint = '';
  let draftFingerprint = '';

  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me().catch(() => null);
    if (!isExactOwner(user)) {
      return Response.json({ error: 'Exact owner sign-in is required.' }, { status: 403 });
    }
    actorEmail = exact(user.email).toLowerCase();

    const body = await req.json().catch(() => ({}));
    const draftId = exact(body.draft_id);
    requestId = exact(body.send_request_id);
    if (!draftId || !validSendRequestId(requestId)) {
      return Response.json({ error: 'draft_id and a valid one-time send_request_id are required.' }, { status: 400 });
    }

    sr = base44.asServiceRole;
    const draft = await sr.entities.ReleaseEmailDraft.get(draftId).catch(() => null);
    if (!draft?.id) return Response.json({ error: 'Draft not found.' }, { status: 404 });

    if (exact(draft.send_request_id) === requestId && draft.send_state === 'sent') {
      return Response.json({
        sent: true,
        deduplicated: true,
        draft_id: draft.id,
        sent_count: Number(draft.sent_count || 0),
        failed_count: Number(draft.failed_count || 0),
      });
    }
    if (exact(draft.send_request_id) === requestId && draft.send_state === 'claimed') {
      return Response.json({
        in_progress: true,
        deduplicated: true,
        reason: 'This exact send request is already claimed. It will not be retried automatically.',
      }, { status: 409 });
    }
    if (draft.send_state !== 'ready' || draft.approval_status !== 'draft') {
      return Response.json({
        error: 'This draft is not eligible for a new send. Claimed, blocked, or historical drafts require manual reconciliation.',
      }, { status: 409 });
    }

    const release = await sr.entities.Release.get(exact(draft.release_id)).catch(() => null);
    if (!release?.id) return Response.json({ error: 'Release not found.' }, { status: 404 });
    claimedRelease = release;

    const evidenceErrors = releaseEvidenceErrors(release);
    releaseFingerprint = await fingerprintReleaseControl(release);
    const publicGate = release.is_published === true
      && release.publishing_safe === true
      && release.status === 'released'
      && release.public_release_approval_status === 'approved'
      && OWNER_EMAILS.has(exact(release.public_release_approved_by).toLowerCase())
      && Boolean(release.public_release_approved_at)
      && exact(release.public_release_approval_fingerprint) === releaseFingerprint
      && exact(draft.release_fingerprint) === releaseFingerprint
      && exact(draft.publication_approval_id) === exact(release.public_release_approval_id)
      && exact(release.release_email_dispatch_state) === 'idle';
    if (!publicGate || evidenceErrors.length) {
      return Response.json({
        error: 'A fan email can be sent only for a fully approved, current public release with complete evidence.',
      }, { status: 409 });
    }

    const approvals = await sr.entities.ReleasePublicationApproval.filter(
      { id: exact(release.public_release_approval_id) },
      '',
      1,
    );
    if (!approvalMatches(approvals?.[0], release, releaseFingerprint)) {
      return Response.json({
        error: 'The immutable publication approval does not match the current release snapshot.',
      }, { status: 409 });
    }

    draftFingerprint = await fingerprintReleaseEmailDraft(draft, releaseFingerprint);
    if (
      exact(draft.content_fingerprint) !== draftFingerprint
      || exact(body.confirm_title) !== exact(release.title)
      || exact(body.confirm_version_label) !== exact(release.version_label)
      || exact(body.confirm_release_fingerprint) !== releaseFingerprint
      || exact(body.confirm_draft_fingerprint) !== draftFingerprint
    ) {
      return Response.json({
        error: 'Exact title, version, release fingerprint, and email-content fingerprint confirmation are required.',
      }, { status: 409 });
    }

    const existingReceipts = await sr.entities.ReleaseEmailSendReceipt.filter(
      { release_id: release.id, status: exact(draft.status) },
      '-created_date',
      10,
    );
    if (existingReceipts?.length) {
      return Response.json({
        error: 'A release-email dispatch receipt already exists for this status. No additional email will be sent.',
      }, { status: 409 });
    }

    claimId = crypto.randomUUID();
    const claimedAt = new Date().toISOString();
    const draftClaim = await sr.entities.ReleaseEmailDraft.updateMany(
      {
        id: draft.id,
        approval_status: 'draft',
        send_state: 'ready',
        content_fingerprint: draftFingerprint,
        release_fingerprint: releaseFingerprint,
        publication_approval_id: exact(release.public_release_approval_id),
      },
      {
        $set: {
          approval_status: 'sending',
          approved_by: actorEmail,
          approved_at: claimedAt,
          send_state: 'claimed',
          send_request_id: requestId,
          send_claim_id: claimId,
          send_claimed_at: claimedAt,
        },
      },
    );
    if (!casSucceeded(draftClaim)) {
      return Response.json({
        error: 'The email draft changed before the send claim was recorded. No email was sent.',
      }, { status: 409 });
    }
    claimedDraft = { ...draft, send_claim_id: claimId };

    const releaseClaim = await sr.entities.Release.updateMany(
      {
        id: release.id,
        is_published: true,
        publishing_safe: true,
        status: 'released',
        public_release_approval_status: 'approved',
        public_release_approval_id: exact(release.public_release_approval_id),
        public_release_approval_fingerprint: releaseFingerprint,
        release_email_dispatch_state: 'idle',
      },
      {
        $set: {
          release_email_dispatch_state: 'claimed',
          release_email_dispatch_status: exact(draft.status),
          release_email_dispatch_claim_id: claimId,
          release_email_dispatch_fingerprint: releaseFingerprint,
        },
      },
    );
    if (!casSucceeded(releaseClaim)) {
      await blockClaim(
        sr, draft, release, claimId, requestId, actorEmail, releaseFingerprint, draftFingerprint,
        'The global release-email claim was unavailable. No outbound email was started.',
      );
      return Response.json({
        error: 'The release-wide email claim was unavailable. No email was sent.',
      }, { status: 409 });
    }

    try {
      await sr.entities.ReleaseEmailSendReceipt.create({
        release_id: release.id,
        release_title: exact(release.title),
        draft_id: draft.id,
        status: exact(draft.status),
        receipt_type: 'claimed',
        claim_id: claimId,
        send_request_id: requestId,
        release_fingerprint: releaseFingerprint,
        draft_fingerprint: draftFingerprint,
        claimed_by: actorEmail,
        recorded_at: claimedAt,
        detail: 'Owner-confirmed dispatch claim recorded before outbound delivery.',
        control_version: RELEASE_CONTROL_VERSION,
      });
    } catch {
      await blockClaim(
        sr, draft, release, claimId, requestId, actorEmail, releaseFingerprint, draftFingerprint,
        'The immutable pre-send receipt could not be recorded. No outbound email was started.',
      );
      return Response.json({
        error: 'The immutable pre-send receipt was unavailable. No email was sent.',
      }, { status: 503 });
    }

    let recipients: string[];
    try {
      recipients = await collectFanEmailAudience(sr);
    } catch {
      await blockClaim(
        sr, draft, release, claimId, requestId, actorEmail, releaseFingerprint, draftFingerprint,
        'The audience could not be loaded after the claim. No outbound email was started.',
      );
      return Response.json({
        error: 'The audience could not be loaded. The claimed draft is blocked for manual reconciliation; no email was sent.',
      }, { status: 503 });
    }

    const capped = recipients.length > MAX_RECIPIENTS;
    const sendList = recipients.slice(0, MAX_RECIPIENTS);
    let sent = 0;
    const failures: string[] = [];

    for (const email of sendList) {
      try {
        await sr.integrations.Core.SendEmail({
          to: email,
          subject: draft.subject,
          html: draft.body_html,
          text: draft.body_text,
        });
        sent += 1;
      } catch (error) {
        failures.push(errorMessage(error).slice(0, 120));
      }
    }

    const completedAt = new Date().toISOString();
    try {
      await sr.entities.ReleaseEmailSendReceipt.create({
        release_id: release.id,
        release_title: exact(release.title),
        draft_id: draft.id,
        status: exact(draft.status),
        receipt_type: 'completed',
        claim_id: claimId,
        send_request_id: requestId,
        release_fingerprint: releaseFingerprint,
        draft_fingerprint: draftFingerprint,
        claimed_by: actorEmail,
        recorded_at: completedAt,
        recipient_count: recipients.length,
        sent_count: sent,
        failed_count: failures.length,
        detail: failures.length || capped
          ? 'Delivery completed with exceptions. Manual reconciliation is required before any replacement draft.'
          : 'Delivery completed.',
        control_version: RELEASE_CONTROL_VERSION,
      });
    } catch {
      return Response.json({
        error: 'Outbound delivery may have occurred, but its terminal receipt was unavailable. The draft remains claimed and will not be retried automatically.',
      }, { status: 503 });
    }

    const terminalStatus = failures.length ? 'send_failed' : 'sent';
    const draftCompleted = await sr.entities.ReleaseEmailDraft.updateMany(
      { id: draft.id, send_state: 'claimed', send_claim_id: claimId, send_request_id: requestId },
      {
        $set: {
          approval_status: terminalStatus,
          send_state: 'sent',
          sent_at: completedAt,
          send_completed_at: completedAt,
          sent_count: sent,
          failed_count: failures.length,
          recipient_count: recipients.length,
        },
      },
    );
    if (!casSucceeded(draftCompleted)) {
      return Response.json({
        error: 'Outbound delivery completed but the draft record did not reach its terminal state. It remains locked from retry.',
      }, { status: 503 });
    }

    const releaseCompleted = await sr.entities.Release.updateMany(
      { id: release.id, release_email_dispatch_state: 'claimed', release_email_dispatch_claim_id: claimId },
      { $set: { release_email_dispatch_state: 'sent' } },
    );
    if (!casSucceeded(releaseCompleted)) {
      return Response.json({
        error: 'Outbound delivery completed but the release dispatch record did not reach its terminal state. It remains locked from retry.',
      }, { status: 503 });
    }

    await sr.entities.AdminNotification.create({
      notification_type: 'system',
      severity: failures.length || capped ? 'warning' : 'info',
      requires_action: failures.length > 0 || capped,
      title: 'Fan update sent: ' + exact(draft.release_title),
      summary: String(sent) + ' fans received the ' + exact(draft.status).replace(/_/g, ' ')
        + ' update for "' + exact(draft.release_title) + '".'
        + (failures.length ? ' ' + String(failures.length) + ' failed.' : '')
        + (capped ? ' List exceeded ' + String(MAX_RECIPIENTS) + '.' : ''),
      source: 'sendReleaseEmailDraft',
      linked_entity: 'ReleaseEmailDraft',
      linked_id: draft.id,
      linked_route: '/admin/release-email-studio',
    }).catch(() => undefined);

    return Response.json({
      sent: true,
      draft_id: draft.id,
      sent_count: sent,
      recipient_count: recipients.length,
      failed_count: failures.length,
      capped,
      manual_reconciliation_required: failures.length > 0 || capped,
    });
  } catch {
    if (sr && claimedDraft && claimedRelease && claimId && requestId) {
      await blockClaim(
        sr,
        claimedDraft,
        claimedRelease,
        claimId,
        requestId,
        actorEmail,
        releaseFingerprint,
        draftFingerprint,
        'The send path stopped after acquiring a claim. It is blocked from automatic retry.',
      );
    }
    return Response.json({
      error: 'Release-email sending failed closed. Any claimed draft is blocked from automatic retry.',
    }, { status: 500 });
  }
}
