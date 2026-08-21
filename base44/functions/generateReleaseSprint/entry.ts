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

type PlatformDraft = {
  hook?: string;
  caption?: string;
  cta?: string;
  hashtags?: string;
  visual_direction?: string;
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

Deno.serve(async (req: Request) => {
  const base44 = createClientFromRequest(req);

  try {
    const user = await base44.auth.me() as AuthUser | null;
    if (!isOwner(user)) {
      return Response.json({ error: 'Forbidden: exact owner account required' }, { status: 403 });
    }

    const body = await req.json() as { release_id?: string };
    const releaseId = body.release_id?.trim();
    if (!releaseId) {
      return Response.json({ error: 'release_id required' }, { status: 400 });
    }

    const matches = await base44.asServiceRole.entities.Release.filter({
      id: releaseId,
      is_published: true,
      publishing_safe: true,
      status: 'released',
      public_release_approval_status: 'approved',
    }, '', 1) as ReleaseRecord[];
    const release = matches[0];

    if (!isApprovedPublicRelease(release)) {
      return Response.json(
        { error: 'Release is not fully owner-approved for public publication' },
        { status: 409 },
      );
    }

    const title = release.title?.trim() || 'Approved release';
    const version = release.version_label?.trim() || 'unspecified version';
    const platforms = ['tiktok', 'instagram_reels'];

    const generated = await base44.integrations.Core.InvokeLLM({
      prompt: `Create two draft-only social content briefs for the exact owner-approved public Release below.

Release ID: ${release.id}
Title: ${title}
Version: ${version}
Platforms: ${platforms.join(', ')}

You may say the exact Release is publicly available because its canonical record passed every public gate.
Do not invent a release date, lyric, artwork, story, link, chart position, presave, platform availability, or campaign fact.
Use only the title and version supplied above.
Nothing may be scheduled or published automatically. Each draft requires separate owner review.`,
      response_json_schema: {
        type: 'object',
        properties: {
          tiktok: {
            type: 'object',
            properties: {
              hook: { type: 'string' },
              caption: { type: 'string' },
              cta: { type: 'string' },
              hashtags: { type: 'string' },
              visual_direction: { type: 'string' },
            },
          },
          instagram_reels: {
            type: 'object',
            properties: {
              hook: { type: 'string' },
              caption: { type: 'string' },
              cta: { type: 'string' },
              hashtags: { type: 'string' },
              visual_direction: { type: 'string' },
            },
          },
        },
      },
    }) as Record<string, PlatformDraft>;

    const created: Array<{ post_id: string; approval_id: string; platform: string }> = [];
    const today = new Date().toISOString().slice(0, 10);

    for (const platform of platforms) {
      const draft = generated[platform];
      if (!draft?.hook || !draft.caption) continue;

      const post = await base44.asServiceRole.entities.ContentCalendarPost.create({
        campaign: `approved_release_${release.id}`,
        scheduled_date: today,
        platform,
        content_type: 'release_content',
        hook: draft.hook,
        caption: draft.caption,
        hashtags: draft.hashtags || '',
        cta: draft.cta || '',
        broll_ideas: draft.visual_direction || '',
        content_notes: `Exact approved Release: ${release.id}. Draft only; owner review required.`,
        status: 'draft',
        generated_by: 'generateReleaseSprint',
        source_chain: 'generateReleaseSprint -> ContentCalendarPost -> ApprovalQueue -> owner review',
      });

      const approval = await base44.asServiceRole.entities.ApprovalQueue.create({
        agent_name: 'Approved Release Content Generator',
        action_title: `Review ${platform} draft for "${title}"`,
        action_description: `Review the draft for exact Release ${release.id}. Nothing is scheduled or published by this function.`,
        description: 'Draft only. A separate explicit owner approval is required before external publication.',
        risk_type: ['publishing', 'brand', 'reputation'],
        risk_level: 'high',
        status: 'pending',
        proposed_output: `${draft.hook}\n\n${draft.caption}\n\n${draft.cta || ''}\n\n${draft.hashtags || ''}`,
        payload: {
          release_id: release.id,
          release_title: title,
          version_label: version,
          post_id: post.id,
          platform,
          operation: 'draft_only',
        },
        auto_eligible: false,
        tags: ['release', platform, 'draft-only', `release:${release.id}`],
      });

      await base44.asServiceRole.entities.ContentCalendarPost.update(post.id, {
        approval_id: approval.id,
      });
      created.push({ post_id: post.id, approval_id: approval.id, platform });
    }

    return Response.json({
      success: true,
      release_id: release.id,
      drafts_created: created.length,
      published: false,
      drafts: created,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return Response.json({ error: message }, { status: 500 });
  }
});
