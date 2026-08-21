import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

const OWNER_EMAILS = new Set([
  'ganozwaye@gmail.com',
  'gannonwayemusic@gmail.com',
]);

type AuthUser = {
  email?: string;
};

type ReleaseRecord = {
  id?: string;
  title?: string;
  version_label?: string;
  status?: string;
  is_published?: boolean;
  publishing_safe?: boolean;
  public_release_approval_status?: string;
  public_release_approved_by?: string;
  public_release_approved_at?: string;
};

function isOwner(user: AuthUser | null | undefined): boolean {
  return Boolean(user?.email && OWNER_EMAILS.has(user.email.toLowerCase()));
}

function isApprovedPublicRelease(release: ReleaseRecord | undefined): release is ReleaseRecord {
  return Boolean(
    release?.id
      && release.is_published === true
      && release.publishing_safe === true
      && release.status === 'released'
      && release.public_release_approval_status === 'approved'
      && release.public_release_approved_by
      && OWNER_EMAILS.has(release.public_release_approved_by.toLowerCase())
      && release.public_release_approved_at,
  );
}

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : 'Unknown error';
}

Deno.serve(async (req: Request) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me() as AuthUser | null;

    if (!isOwner(user)) {
      return Response.json({ error: 'Forbidden: exact owner account required' }, { status: 403 });
    }

    const body = await req.json() as { release_id?: string };
    const releaseId = body.release_id?.trim();
    if (!releaseId) {
      return Response.json({ error: 'release_id required' }, { status: 400 });
    }

    const matches = await base44.asServiceRole.entities.Release.filter({ id: releaseId }, '', 1) as ReleaseRecord[];
    const release = matches[0];

    if (!release) {
      return Response.json({ error: 'Release not found' }, { status: 404 });
    }
    if (!isApprovedPublicRelease(release)) {
      return Response.json(
        { error: 'Release is not fully owner-approved for public publication' },
        { status: 409 },
      );
    }

    const title = release.title?.trim() || 'Approved release';
    const version = release.version_label?.trim() || 'unspecified version';
    const approval = await base44.asServiceRole.entities.ApprovalQueue.create({
      agent_name: 'RevealNewsletterDraft',
      action_title: `Review reveal newsletter draft for "${title}"`,
      action_description: 'Prepare an owner-reviewed reveal newsletter draft for the exact approved Release. A separate explicit approval is required before any email is sent.',
      description: 'Draft only. No Gmail connector access, subscriber enumeration, scheduling, or sending occurs in this function.',
      risk_type: ['publishing', 'brand', 'reputation'],
      risk_level: 'high',
      status: 'pending',
      payload: {
        release_id: release.id,
        release_title: title,
        version_label: version,
        channel: 'email',
        operation: 'draft_only',
        requested_by: user?.email,
      },
      proposed_output: `Draft a reveal newsletter for "${title}" (${version}) using only canonical fields from Release ${release.id}. Do not send it and do not infer dates, links, artwork, lyrics, or release claims.`,
      auto_eligible: false,
      tags: ['release', 'newsletter', 'draft-only', `release:${release.id}`],
    });

    return Response.json({
      success: true,
      drafted: true,
      sent: 0,
      approval_id: approval.id,
      release_id: release.id,
    });
  } catch (error: unknown) {
    return Response.json({ error: errorMessage(error) }, { status: 500 });
  }
});
