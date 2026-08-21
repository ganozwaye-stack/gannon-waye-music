import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';

const OWNER_EMAILS = new Set([
  'ganozwaye@gmail.com',
  'gannonwayemusic@gmail.com',
]);

function exact(value) {
  return String(value || '').trim();
}

async function setLinkedLyricsPublication(sr, releaseId, approved) {
  return sr.entities.Lyric.updateMany(
    { release_id: releaseId },
    { $set: { release_publication_approved: approved } }
  );
}

export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const ownerEmail = exact(user.email).toLowerCase();
    if (user.role !== 'admin' || !OWNER_EMAILS.has(ownerEmail)) {
      return Response.json({ error: 'Only Gannon can approve, publish, or revoke a public release' }, { status: 403 });
    }

    const body = await req.json().catch(() => ({}));
    const releaseId = exact(body.release_id);
    const action = exact(body.action || 'publish').toLowerCase();
    const confirmTitle = exact(body.confirm_title);
    const confirmVersion = exact(body.confirm_version_label);
    const approvalNote = exact(body.approval_note);

    if (!releaseId) {
      return Response.json({ error: 'release_id required' }, { status: 400 });
    }
    if (!['approve', 'publish', 'revoke'].includes(action)) {
      return Response.json({ error: 'action must be approve, publish, or revoke' }, { status: 400 });
    }

    const sr = base44.asServiceRole;
    const release = await sr.entities.Release.get(releaseId);
    if (!release) return Response.json({ error: 'Release not found' }, { status: 404 });

    const exactTitle = exact(release.title);
    const exactVersion = exact(release.version_label);
    if (confirmTitle !== exactTitle || confirmVersion !== exactVersion) {
      return Response.json({
        error: 'Exact title/version confirmation required',
        expected_title: exactTitle,
        expected_version_label: exactVersion,
      }, { status: 409 });
    }

    const changedAt = new Date().toISOString();

    if (action === 'revoke') {
      await sr.entities.Release.update(releaseId, {
        publishing_safe: false,
        public_release_approval_status: 'revoked',
        is_published: false,
        is_current_single: false,
        public_release_approval_note:
          `Revoked by ${ownerEmail} at ${changedAt}${approvalNote ? `: ${approvalNote}` : ''}`,
      });
      await setLinkedLyricsPublication(sr, releaseId, false);
      return Response.json({
        ok: true,
        release_id: releaseId,
        approval: 'revoked',
        published: false,
      });
    }

    if (action === 'approve') {
      if (!['ready', 'released'].includes(release.status)) {
        return Response.json({
          error: 'Release must be ready or released before owner approval',
        }, { status: 409 });
      }

      // Approval and publication are deliberately separate. Legacy published
      // rows remain private until Gannon completes both exact actions.
      await sr.entities.Release.update(releaseId, {
        publishing_safe: true,
        public_release_approval_status: 'approved',
        is_published: false,
        is_current_single: false,
        public_release_approved_by: ownerEmail,
        public_release_approved_at: changedAt,
        public_release_approval_note:
          approvalNote || `Exact title/version approved by Gannon at ${changedAt}`,
      });
      await setLinkedLyricsPublication(sr, releaseId, false);

      return Response.json({
        ok: true,
        release_id: releaseId,
        approval: 'approved',
        published: false,
        approved_at: changedAt,
      });
    }

    if (
      release.publishing_safe !== true ||
      release.public_release_approval_status !== 'approved' ||
      !OWNER_EMAILS.has(exact(release.public_release_approved_by).toLowerCase()) ||
      !release.public_release_approved_at
    ) {
      return Response.json({
        error: 'Release does not have a valid Gannon owner approval',
      }, { status: 409 });
    }
    if (!['ready', 'released'].includes(release.status)) {
      return Response.json({
        error: 'Release must be ready or released before it can be published',
      }, { status: 409 });
    }

    await sr.entities.Release.update(releaseId, {
      is_published: true,
      status: 'released',
    });
    await setLinkedLyricsPublication(sr, releaseId, true);

    return Response.json({
      ok: true,
      release_id: releaseId,
      approval: 'approved',
      published: true,
      current_single: release.is_current_single === true,
    });
  } catch (error) {
    return Response.json({ error: error?.message || 'Unknown error' }, { status: 500 });
  }
}
