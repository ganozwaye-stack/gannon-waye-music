import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

const OWNER_EMAILS = new Set([
  'ganozwaye@gmail.com',
  'gannonwayemusic@gmail.com',
]);

const ALLOWED_PLATFORMS = new Set([
  'instagram',
  'tiktok',
  'facebook',
  'youtube_shorts',
  'threads',
  'pinterest',
  'twitter_x',
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

type GeneratedPost = {
  hook?: string;
  caption?: string;
  hashtags?: string;
  cta?: string;
  visual_prompt?: string;
  visual_concept?: string;
  predicted_engagement_score?: number;
  predicted_conversion_score?: number;
  predicted_viral_probability?: number;
  emotional_angle?: string;
  risk_notes?: string;
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

    const body = await req.json() as {
      platform?: string;
      campaign?: string;
      angle?: string;
      release_id?: string;
    };

    const platform = ALLOWED_PLATFORMS.has(body.platform || '')
      ? body.platform as string
      : 'instagram';
    const campaign = body.campaign?.trim() || 'evergreen_artist_story';
    const angle = body.angle?.trim() || 'emotional_story';

    if (angle.toLowerCase().includes('presave')) {
      return Response.json(
        { error: 'Presave content requires a separate verified-link disclosure review' },
        { status: 409 },
      );
    }

    let release: ReleaseRecord | undefined;
    const releaseId = body.release_id?.trim();
    if (releaseId) {
      const matches = await base44.asServiceRole.entities.Release.filter({
        id: releaseId,
        is_published: true,
        publishing_safe: true,
        status: 'released',
        public_release_approval_status: 'approved',
      }, '', 1) as ReleaseRecord[];
      release = matches[0];

      if (!isApprovedPublicRelease(release)) {
        return Response.json(
          { error: 'Release is not fully owner-approved for public publication' },
          { status: 409 },
        );
      }
    }

    const releaseContext = release
      ? `Exact approved Release ID: ${release.id}\nTitle: ${release.title || 'Approved release'}\nVersion: ${release.version_label || 'unspecified version'}\nYou may refer only to this exact title and version. You may say it is publicly available. Do not invent dates, lyrics, artwork, links, chart positions, credits, or platform availability.`
      : 'No approved Release was supplied. Do not name or imply any song, album, release date, release status, lyric, artwork, streaming link, presave, launch, or countdown. Keep the post evergreen.';

    const generated = await base44.integrations.Core.InvokeLLM({
      prompt: `You are drafting content for Gannon Waye, an Australian singer-songwriter.
Brand themes: authenticity, warmth, community, creativity, and self-worth.
Platform: ${platform}
Campaign: ${campaign}
Angle: ${angle}

${releaseContext}

Create one production-ready draft. It must remain unpublished until Gannon separately approves it.
Return a JSON object with hook, caption, hashtags, cta, visual_prompt, visual_concept, predicted_engagement_score, predicted_conversion_score, predicted_viral_probability, emotional_angle, and risk_notes.`,
      response_json_schema: {
        type: 'object',
        properties: {
          hook: { type: 'string' },
          caption: { type: 'string' },
          hashtags: { type: 'string' },
          cta: { type: 'string' },
          visual_prompt: { type: 'string' },
          visual_concept: { type: 'string' },
          predicted_engagement_score: { type: 'number' },
          predicted_conversion_score: { type: 'number' },
          predicted_viral_probability: { type: 'number' },
          emotional_angle: { type: 'string' },
          risk_notes: { type: 'string' },
        },
      },
    }) as GeneratedPost;

    if (!generated.hook || !generated.caption) {
      return Response.json({ error: 'LLM did not return a valid draft' }, { status: 500 });
    }

    const post = await base44.entities.ContentPost.create({
      platform,
      campaign,
      status: 'awaiting_approval',
      hook: generated.hook,
      caption: generated.caption,
      hashtags: generated.hashtags || '',
      cta: generated.cta || '',
      visual_prompt: generated.visual_prompt || '',
      predicted_engagement_score: generated.predicted_engagement_score,
      predicted_conversion_score: generated.predicted_conversion_score,
      predicted_viral_probability: generated.predicted_viral_probability,
      generated_by_agent: 'generateContentPost',
      source_chain: 'generateContentPost -> ContentPost -> ApprovalQueue -> owner review',
    });

    const approval = await base44.entities.ApprovalQueue.create({
      agent_name: 'Content Command',
      action_title: `Review ${platform} draft - ${campaign}`,
      action_description: `Draft for ${platform}. Angle: ${angle}. Nothing has been scheduled or published.`,
      description: release
        ? `Uses exact owner-approved Release ${release.id}.`
        : 'Evergreen draft with no Release claim.',
      risk_level: release ? 'high' : 'medium',
      risk_type: ['publishing', 'brand', 'reputation'],
      status: 'pending',
      proposed_output: `HOOK:\n${generated.hook}\n\nCAPTION:\n${generated.caption}\n\nCTA: ${generated.cta || ''}\n\nHASHTAGS: ${generated.hashtags || ''}`,
      tags: ['social_post', platform, campaign, 'draft-only'],
      payload: {
        post_id: post.id,
        platform,
        campaign,
        angle,
        release_id: release?.id || null,
        operation: 'draft_only',
      },
      auto_eligible: false,
    });

    if (generated.visual_prompt) {
      await base44.entities.VisualGenerationQueue.create({
        prompt: generated.visual_prompt,
        visual_concept: generated.visual_concept || '',
        visual_type: platform === 'instagram' || platform === 'pinterest'
          ? 'quote_card'
          : 'reel_concept',
        platform,
        campaign,
        asset_status: 'draft',
        approval_status: 'awaiting_approval',
        linked_content_post_id: post.id,
        source_chain: 'generateContentPost -> VisualGenerationQueue -> owner review',
      }).catch(() => undefined);
    }

    return Response.json({
      success: true,
      post_id: post.id,
      approval_id: approval.id,
      release_id: release?.id || null,
      published: false,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return Response.json({ error: message }, { status: 500 });
  }
});
