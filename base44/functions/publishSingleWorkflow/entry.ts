import { createClientFromRequest } from 'npm:@base44/sdk@0.8.48';
import {
  OWNER_EMAILS,
  RELEASE_CONTROL_VERSION,
  exact,
  fingerprintReleaseControl,
  isExactOwner,
  releaseControlSnapshot,
  releaseEvidenceErrors,
} from '../../shared/releaseControl.ts';

// The only public-release control path. It is intentionally fail-closed:
// a durable owner approval receipt must bind one exact content/evidence
// fingerprint before a private record can be made public.

function evidenceCandidate(release: any, body: any) {
  return {
    ...release,
    rights_evidence_reference: exact(body.rights_evidence_reference || release.rights_evidence_reference),
    master_evidence_reference: exact(body.master_evidence_reference || release.master_evidence_reference),
    delivery_evidence_reference: exact(body.delivery_evidence_reference || release.delivery_evidence_reference),
    public_link_evidence_url: exact(body.public_link_evidence_url || release.public_link_evidence_url),
  };
}

function validApprovalReceipt(receipt: any, release: any, fingerprint: string) {
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

function requiredActionPhrase(action: string, title: unknown) {
  const verb = exact(action).toUpperCase();
  return ['APPROVE', 'PUBLISH'].includes(verb) ? verb + ' ' + exact(title) : '';
}

function requireExactConfirmation(body: any, release: any, fingerprint: string, action: string) {
  if (
    exact(body.confirm_title) !== exact(release.title)
    || exact(body.confirm_version_label) !== exact(release.version_label)
    || exact(body.confirm_release_fingerprint) !== fingerprint
  ) {
    return 'Exact title, version, and current release fingerprint confirmation are required.';
  }

  const expectedPhrase = requiredActionPhrase(action, release.title);
  const submittedPhrase = action === 'approve'
    ? exact(body.confirm_approval_phrase)
    : exact(body.confirm_publish_phrase);
  if (!expectedPhrase || submittedPhrase !== expectedPhrase) {
    return 'The exact typed ' + exact(action) + ' phrase is required.';
  }
  return '';
}

function casSucceeded(result: any) {
  return Boolean(result?.success) && Number(result?.updated) === 1;
}

async function setLinkedLyricsPublication(sr: any, releaseId: string, approved: boolean) {
  return sr.entities.Lyric.updateMany(
    { release_id: releaseId },
    { $set: { release_publication_approved: approved } },
  );
}

async function reconcileLinkedLyricsPublication(sr: any, release: any, approved: boolean, action: string) {
  try {
    const result = await setLinkedLyricsPublication(sr, release.id, approved);
    if (result?.success === false) throw new Error('Linked lyric update was not acknowledged.');
    return { linked_lyrics_reconciled: true, manual_reconciliation_required: false };
  } catch {
    await sr.entities.AdminNotification.create({
      notification_type: 'system',
      severity: 'warning',
      requires_action: true,
      title: 'Release lyric reconciliation required: ' + exact(release.title),
      summary: 'The release ' + exact(action) + ' was recorded, but linked lyric visibility needs manual reconciliation. No automatic retry was started.',
      source: 'publishSingleWorkflow',
      linked_entity: 'Release',
      linked_id: release.id,
      linked_route: '/admin/release-control',
    }).catch(() => undefined);
    return { linked_lyrics_reconciled: false, manual_reconciliation_required: true };
  }
}

export default async function(req: Request) {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me().catch(() => null);
    if (!isExactOwner(user)) {
      return Response.json({ error: 'Exact owner sign-in is required for release control.' }, { status: 403 });
    }

    const body = await req.json().catch(() => ({}));
    const releaseId = exact(body.release_id);
    const action = exact(body.action || 'review').toLowerCase();
    if (!releaseId) return Response.json({ error: 'release_id required' }, { status: 400 });
    if (!['review', 'approve', 'publish', 'revoke', 'save_evidence'].includes(action)) {
      return Response.json({ error: 'action must be review, approve, publish, revoke, or save_evidence' }, { status: 400 });
    }

    const sr = base44.asServiceRole;
    const release = await sr.entities.Release.get(releaseId).catch(() => null);
    if (!release?.id) return Response.json({ error: 'Release not found' }, { status: 404 });

    // Evidence is mutable only while the record is private and not approved.
    // Once approval begins, evidence is frozen so publication cannot reuse an
    // approval receipt for a later snapshot.
    if (action === 'save_evidence') {
      const candidate = evidenceCandidate(release, body);
      const evidenceState = exact(release.public_release_approval_status) || 'pending';
      if (
        release.is_published === true
        || release.publishing_safe === true
        || !['pending', 'revoked'].includes(evidenceState)
      ) {
        return Response.json({
          error: 'Evidence is frozen after approval begins. Revoke, then save, review, and approve again.',
        }, { status: 409 });
      }

      const savedEvidence = await sr.entities.Release.updateMany(
        {
          id: release.id,
          updated_date: release.updated_date,
          is_published: false,
          publishing_safe: false,
          public_release_approval_status: evidenceState,
        },
        {
          $set: {
            rights_evidence_reference: exact(candidate.rights_evidence_reference),
            master_evidence_reference: exact(candidate.master_evidence_reference),
            delivery_evidence_reference: exact(candidate.delivery_evidence_reference),
            public_link_evidence_url: exact(candidate.public_link_evidence_url),
          },
        },
      );
      if (!casSucceeded(savedEvidence)) {
        return Response.json({ error: 'The private evidence changed before this exact save. Reload and review again; nothing was published.' }, { status: 409 });
      }
      return Response.json({
        ok: true,
        release_id: release.id,
        saved: 'evidence',
        published: false,
        exact_snapshot_guard: 'updated_date',
      });
    }

    if (action === 'revoke') {
      const revokeFingerprint = await fingerprintReleaseControl(release);
      const revokePhrase = 'REVOKE ' + exact(release.title);
      if (
        exact(body.confirm_title) !== exact(release.title)
        || exact(body.confirm_version_label) !== exact(release.version_label)
        || exact(body.confirm_release_fingerprint) !== revokeFingerprint
        || exact(body.confirm_revoke_phrase) !== revokePhrase
      ) {
        return Response.json({
          error: 'Exact title, version, current release fingerprint, and revoke phrase are required to revoke.',
        }, { status: 409 });
      }

      const revokedAt = new Date().toISOString();
      const revoked = await sr.entities.Release.updateMany(
        { id: release.id, updated_date: release.updated_date },
        {
          $set: {
            publishing_safe: false,
            public_release_approval_status: 'revoked',
            is_published: false,
            is_current_single: false,
            public_release_approval_id: '',
            public_release_approval_fingerprint: '',
            public_release_approved_by: '',
            public_release_approved_at: '',
            release_email_dispatch_state: 'blocked',
            public_release_approval_note:
              'Revoked by ' + exact(user.email).toLowerCase() + ' at ' + revokedAt
              + (exact(body.approval_note) ? ': ' + exact(body.approval_note) : ''),
          },
        },
      );
      if (!casSucceeded(revoked)) {
        return Response.json({ error: 'Revocation was not durably recorded. The release was not changed.' }, { status: 409 });
      }
      const lyricReconciliation = await reconcileLinkedLyricsPublication(sr, release, false, 'revocation');
      return Response.json({
        ok: true,
        release_id: release.id,
        approval: 'revoked',
        published: false,
        ...lyricReconciliation,
      });
    }

    const candidate = evidenceCandidate(release, body);
    const evidenceErrors = releaseEvidenceErrors(candidate);
    const fingerprint = await fingerprintReleaseControl(candidate);

    if (action === 'review') {
      return Response.json({
        ok: true,
        release_id: release.id,
        title: exact(release.title),
        version_label: exact(release.version_label),
        release_fingerprint: fingerprint,
        ready_for_approval: evidenceErrors.length === 0 && ['ready', 'released'].includes(exact(release.status)),
        missing_requirements: [
          ...evidenceErrors,
          ...(['ready', 'released'].includes(exact(release.status))
            ? []
            : ['Release status must be ready or released before approval.']),
        ],
      });
    }

    if (evidenceErrors.length) {
      return Response.json({
        error: 'Required rights, master, delivery, or public-link evidence is missing or invalid.',
        missing_requirements: evidenceErrors,
      }, { status: 409 });
    }

    const confirmationError = requireExactConfirmation(body, candidate, fingerprint, action);
    if (confirmationError) {
      return Response.json({ error: confirmationError }, { status: 409 });
    }

    if (action === 'approve') {
      if (!['ready', 'released'].includes(exact(release.status))) {
        return Response.json({ error: 'Release must be ready or released before owner approval.' }, { status: 409 });
      }
      if (release.is_published === true) {
        return Response.json({ error: 'Revoke this public release before recording a replacement approval.' }, { status: 409 });
      }

      const priorState = exact(release.public_release_approval_status) || 'pending';
      if (!['pending', 'approved', 'revoked'].includes(priorState)) {
        return Response.json({
          error: 'A release approval is already being recorded or needs manual reconciliation. No public state changed.',
        }, { status: 409 });
      }

      const approvalClaimed = await sr.entities.Release.updateMany(
        {
          id: release.id,
          updated_date: release.updated_date,
          public_release_approval_status: priorState,
          is_published: false,
          publishing_safe: false,
        },
        {
          $set: {
            publishing_safe: false,
            public_release_approval_status: 'approval_claimed',
            is_current_single: false,
            public_release_approval_note: 'Approval receipt is being recorded. The release remains private until this completes.',
          },
        },
      );
      if (!casSucceeded(approvalClaimed)) {
        return Response.json({
          error: 'Approval could not acquire the private-record claim. Reload and review again; nothing was published.',
        }, { status: 409 });
      }

      const approvedAt = new Date().toISOString();
      let approvalReceipt: any;
      try {
        approvalReceipt = await sr.entities.ReleasePublicationApproval.create({
          release_id: release.id,
          release_title: exact(candidate.title),
          version_label: exact(candidate.version_label),
          content_fingerprint: fingerprint,
          rights_evidence_reference: exact(candidate.rights_evidence_reference),
          master_evidence_reference: exact(candidate.master_evidence_reference),
          delivery_evidence_reference: exact(candidate.delivery_evidence_reference),
          public_link_evidence_url: exact(candidate.public_link_evidence_url),
          approved_by: exact(user.email).toLowerCase(),
          approved_at: approvedAt,
          approval_note: exact(body.approval_note),
          control_version: RELEASE_CONTROL_VERSION,
        });
      } catch {
        return Response.json({
          error: 'The immutable approval receipt was not durably recorded. The release remains private and requires reconciliation.',
        }, { status: 503 });
      }

      const approvalRecorded = await sr.entities.Release.updateMany(
        { id: release.id, public_release_approval_status: 'approval_claimed', is_published: false },
        {
          $set: {
            rights_evidence_reference: exact(candidate.rights_evidence_reference),
            master_evidence_reference: exact(candidate.master_evidence_reference),
            delivery_evidence_reference: exact(candidate.delivery_evidence_reference),
            public_link_evidence_url: exact(candidate.public_link_evidence_url),
            publishing_safe: true,
            public_release_approval_status: 'approved',
            public_release_approval_id: approvalReceipt.id,
            public_release_approval_fingerprint: fingerprint,
            public_release_approved_by: exact(user.email).toLowerCase(),
            public_release_approved_at: approvedAt,
            public_release_approval_note:
              exact(body.approval_note) || 'Exact release snapshot approved at ' + approvedAt,
            is_published: false,
            is_current_single: false,
          },
        },
      );
      if (!casSucceeded(approvalRecorded)) {
        return Response.json({
          error: 'The immutable approval receipt exists, but the private release record was not updated. Manual reconciliation is required; nothing was published.',
          approval_receipt_id: approvalReceipt.id,
        }, { status: 503 });
      }

      const lyricReconciliation = await reconcileLinkedLyricsPublication(sr, release, false, 'approval');
      return Response.json({
        ok: true,
        release_id: release.id,
        approval: 'approved',
        published: false,
        approval_receipt_id: approvalReceipt.id,
        release_fingerprint: fingerprint,
        release_snapshot: releaseControlSnapshot(candidate),
        ...lyricReconciliation,
      });
    }

    if (
      release.publishing_safe !== true
      || release.public_release_approval_status !== 'approved'
      || !OWNER_EMAILS.has(exact(release.public_release_approved_by).toLowerCase())
      || !release.public_release_approved_at
      || exact(release.public_release_approval_fingerprint) !== fingerprint
      || !exact(release.public_release_approval_id)
    ) {
      return Response.json({
        error: 'This release does not have a current immutable owner approval for its exact content and evidence.',
      }, { status: 409 });
    }

    const receipts = await sr.entities.ReleasePublicationApproval.filter(
      { id: exact(release.public_release_approval_id) },
      '',
      1,
    );
    const receipt = receipts?.[0];
    if (!validApprovalReceipt(receipt, release, fingerprint)) {
      return Response.json({
        error: 'The immutable approval receipt does not match the current release snapshot. Review and approve again.',
      }, { status: 409 });
    }

    if (!['ready', 'released'].includes(exact(release.status))) {
      return Response.json({ error: 'Release must be ready or released before publication.' }, { status: 409 });
    }

    const published = await sr.entities.Release.updateMany(
      {
        id: release.id,
        is_published: false,
        publishing_safe: true,
        public_release_approval_status: 'approved',
        public_release_approval_id: receipt.id,
        public_release_approval_fingerprint: fingerprint,
        updated_date: release.updated_date,
        status: release.status,
      },
      { $set: { is_published: true, status: 'released' } },
    );
    if (!casSucceeded(published)) {
      return Response.json({
        error: 'Publication could not acquire the exact approved snapshot. Reload and review again; nothing was published.',
      }, { status: 409 });
    }

    const lyricReconciliation = await reconcileLinkedLyricsPublication(sr, release, true, 'publication');
    return Response.json({
      ok: true,
      release_id: release.id,
      approval: 'approved',
      published: true,
      release_fingerprint: fingerprint,
      ...lyricReconciliation,
    });
  } catch {
    return Response.json({
      error: 'Release control failed closed. No publication, delivery, social post, or fan email was started.',
    }, { status: 500 });
  }
}