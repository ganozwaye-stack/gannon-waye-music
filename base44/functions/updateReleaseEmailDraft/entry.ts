import { createClientFromRequest } from 'npm:@base44/sdk@0.8.48';
import {
  RELEASE_CONTROL_VERSION,
  exact,
  fingerprintReleaseControl,
  fingerprintReleaseEmailDraft,
  isExactOwner,
  releaseEvidenceErrors,
} from '../../shared/releaseControl.ts';

// Owner-only edit path for a private release-email draft. Browser clients never
// alter an approved or claimed outbound draft directly.

function buildEditedEmailHtml(value: unknown) {
  const escaped = String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/\\n/g, '<br />');
  return '<!doctype html><html lang="en"><body style="margin:0;padding:32px;background:#0a0a0e;color:#f0e6c8;font-family:Arial,Helvetica,sans-serif;line-height:1.6;"><div style="max-width:600px;margin:0 auto;padding:32px;background:#12121a;border:1px solid #3d3420;border-radius:16px;"><p style="white-space:normal;">'
    + escaped
    + '</p></div></body></html>';
}

function casSucceeded(result: any) {
  return Boolean(result?.success) && Number(result?.updated) === 1;
}

function hasMatchingApproval(receipt: any, release: any, fingerprint: string) {
  return Boolean(
    receipt
    && exact(receipt.release_id) === exact(release.id)
    && exact(receipt.content_fingerprint) === fingerprint
    && receipt.control_version === RELEASE_CONTROL_VERSION
    && receipt.approved_at === release.public_release_approved_at,
  );
}

export default async function(req: Request) {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me().catch(() => null);
    if (!isExactOwner(user)) {
      return Response.json({ error: 'Exact owner sign-in is required to edit a release email draft.' }, { status: 403 });
    }

    const body = await req.json().catch(() => ({}));
    const draftId = exact(body.draft_id);
    const expectedFingerprint = exact(body.expected_content_fingerprint);
    const subject = exact(body.subject);
    const bodyText = String(body.body_text ?? '');
    if (!draftId || !expectedFingerprint) {
      return Response.json({ error: 'draft_id and expected_content_fingerprint are required.' }, { status: 400 });
    }
    if (!subject || !bodyText.trim() || subject.length > 200 || bodyText.length > 30000) {
      return Response.json({ error: 'A non-empty subject and body within the allowed length are required.' }, { status: 400 });
    }

    const sr = base44.asServiceRole;
    const draft = await sr.entities.ReleaseEmailDraft.get(draftId).catch(() => null);
    if (!draft?.id) return Response.json({ error: 'Draft not found.' }, { status: 404 });
    if (
      draft.approval_status !== 'draft'
      || draft.send_state !== 'ready'
      || exact(draft.content_fingerprint) !== expectedFingerprint
    ) {
      return Response.json({
        error: 'This draft is no longer editable. Reload it before taking any further action.',
      }, { status: 409 });
    }

    const release = await sr.entities.Release.get(exact(draft.release_id)).catch(() => null);
    if (!release?.id) return Response.json({ error: 'Release not found.' }, { status: 404 });
    const releaseFingerprint = await fingerprintReleaseControl(release);
    if (
      releaseEvidenceErrors(release).length
      || release.is_published !== true
      || release.publishing_safe !== true
      || release.status !== 'released'
      || release.public_release_approval_status !== 'approved'
      || exact(release.public_release_approval_fingerprint) !== releaseFingerprint
      || exact(draft.release_fingerprint) !== releaseFingerprint
      || exact(draft.publication_approval_id) !== exact(release.public_release_approval_id)
    ) {
      return Response.json({
        error: 'The public-release approval changed or is incomplete. This draft cannot be edited or sent.',
      }, { status: 409 });
    }

    const approvals = await sr.entities.ReleasePublicationApproval.filter(
      { id: exact(release.public_release_approval_id) },
      '',
      1,
    );
    if (!hasMatchingApproval(approvals?.[0], release, releaseFingerprint)) {
      return Response.json({
        error: 'The immutable publication approval does not match this release. This draft cannot be edited.',
      }, { status: 409 });
    }

    const nextDraft = {
      ...draft,
      subject,
      body_text: bodyText,
      body_html: buildEditedEmailHtml(bodyText),
    };
    const nextFingerprint = await fingerprintReleaseEmailDraft(nextDraft, releaseFingerprint);
    const updated = await sr.entities.ReleaseEmailDraft.updateMany(
      {
        id: draft.id,
        approval_status: 'draft',
        send_state: 'ready',
        content_fingerprint: expectedFingerprint,
        release_fingerprint: releaseFingerprint,
        publication_approval_id: exact(release.public_release_approval_id),
      },
      {
        $set: {
          subject,
          body_text: bodyText,
          body_html: nextDraft.body_html,
          content_fingerprint: nextFingerprint,
        },
      },
    );
    if (!casSucceeded(updated)) {
      return Response.json({
        error: 'The draft changed while it was being edited. Reload it before taking any further action.',
      }, { status: 409 });
    }

    return Response.json({
      ok: true,
      draft_id: draft.id,
      content_fingerprint: nextFingerprint,
    });
  } catch {
    return Response.json({ error: 'Draft edit failed closed. No email was sent.' }, { status: 500 });
  }
}
