import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

const OWNER_EMAILS = new Set([
  'ganozwaye@gmail.com',
  'gannonwayemusic@gmail.com',
]);

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
  artwork_url?: string;
};

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
    const body = await req.json() as {
      data?: ReleaseRecord;
      old_data?: ReleaseRecord;
    };

    if (body.old_data?.is_published === true || body.data?.is_published !== true) {
      return Response.json({ skipped: true, reason: 'Not a new publication transition' });
    }

    const releaseId = body.data.id;
    if (!releaseId) {
      return Response.json({ skipped: true, reason: 'Missing release id' });
    }

    const matches = await base44.asServiceRole.entities.Release.filter({ id: releaseId }, '', 1) as ReleaseRecord[];
    const release = matches[0];

    if (!isApprovedPublicRelease(release)) {
      return Response.json({
        skipped: true,
        reason: 'Release is not fully owner-approved for public publication',
      });
    }

    const title = release.title?.trim() || 'Approved release';
    const version = release.version_label?.trim() || 'unspecified version';
    const approval = await base44.asServiceRole.entities.ApprovalQueue.create({
      agent_name: 'ReleaseSocialDraft',
      action_title: `Review social announcement draft for "${title}"`,
      action_description: 'A fully owner-approved public Release changed to published. Review the proposed social announcement before any post is scheduled or published.',
      description: 'Draft only. This automation does not access Instagram or any social connector and cannot publish.',
      risk_type: ['publishing', 'brand', 'reputation'],
      risk_level: 'high',
      status: 'pending',
      payload: {
        release_id: release.id,
        release_title: title,
        version_label: version,
        artwork_url: release.artwork_url || null,
        channel: 'social',
        operation: 'draft_only',
      },
      proposed_output: `Prepare, but do not publish, a social announcement for "${title}" (${version}). Use only canonical fields from Release ${release.id} and require a separate send/publish approval.`,
      auto_eligible: false,
      tags: ['release', 'social', 'draft-only', `release:${release.id}`],
    });

    return Response.json({
      drafted: true,
      published: false,
      approval_id: approval.id,
      release_id: release.id,
    });
  } catch (error: unknown) {
    return Response.json({ error: errorMessage(error) }, { status: 500 });
  }
});
