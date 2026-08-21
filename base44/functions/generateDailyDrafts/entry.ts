import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

const OWNER_EMAILS = new Set([
  'ganozwaye@gmail.com',
  'gannonwayemusic@gmail.com',
]);

function hasPublicReleaseApproval(release: Record<string, unknown>): boolean {
  const approver = typeof release.public_release_approved_by === 'string'
    ? release.public_release_approved_by.toLowerCase()
    : '';
  return release.is_published === true
    && release.publishing_safe === true
    && release.status === 'released'
    && release.public_release_approval_status === 'approved'
    && OWNER_EMAILS.has(approver)
    && typeof release.public_release_approved_at === 'string'
    && release.public_release_approved_at.length > 0;
}

// Generates 2-3 daily social post drafts via AI
// All drafts go to ApprovalQueue — NOTHING is auto-posted
// Input: { date?, campaign?, post_count? }
Deno.serve(async (req) => {
  const base44 = createClientFromRequest(req);

  try {
    let user = null;
    try { user = await base44.auth.me(); } catch (_) {}
    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Admin access required.' }, { status: 403 });
    }

    let body = {};
    try { body = await req.json(); } catch (_) {}

    const {
      date = new Date().toISOString().slice(0, 10),
      campaign = 'evergreen_daily',
      post_count = 3,
    } = body;

    // Fetch context
    const [products, releases, recentPosts, existingPosts] = await Promise.all([
      base44.asServiceRole.entities.MerchProduct.filter({ is_active: true }, 'created_date', 10),
      base44.asServiceRole.entities.Release.filter({
        is_published: true,
        publishing_safe: true,
        status: 'released',
        public_release_approval_status: 'approved',
      }, '-created_date', 5),
      base44.asServiceRole.entities.ContentCalendarPost.filter({ campaign }, '-created_date', 10),
      base44.asServiceRole.entities.ContentCalendarPost.filter({ scheduled_date: date }, 'created_date', 20),
    ]);

    if (existingPosts.length >= post_count) {
      return Response.json({
        skipped: true,
        message: `Already have ${existingPosts.length} drafts for ${date}. Skipping generation.`,
        existing_count: existingPosts.length,
      });
    }

    const productNames = products.map(p => p.name).join(', ');
    const safeReleases = releases.filter(hasPublicReleaseApproval);
    const releaseTitles = safeReleases.map(r => r.title).filter(Boolean).join(', ');
    const recentHooks = recentPosts.slice(0, 3).map(p => p.hook).filter(Boolean).join(' | ');

    const todayDate = new Date(date);
    const dayOfWeek = todayDate.toLocaleDateString('en-AU', { weekday: 'long' });

    const POST_TYPES = [
      { type: 'emotional_story', platform: 'instagram_reels', content_type: 'fan_engagement', label: 'Emotional Story / Community' },
      { type: 'release_progress', platform: 'tiktok', content_type: 'behind_scenes', label: 'Music Progress / Behind Scenes' },
      { type: 'community_fan', platform: 'instagram_stories', content_type: 'community_cta', label: 'Community / Fan Connection' },
      { type: 'merch_support', platform: 'instagram_feed', content_type: 'merch_cta', label: 'Merch / Support CTA' },
      { type: 'journey_origin', platform: 'tiktok', content_type: 'video_hook', label: 'Country Victoria / Brazil Journey' },
    ];

    const selectedTypes = POST_TYPES.slice(0, post_count);
    const createdPosts = [];

    for (const postType of selectedTypes) {
      const prompt = `You are the Brand Voice Agent for Gannon Waye — an Australian indie artist from Country Victoria with Brazilian roots.
Style: emotional, cinematic, direct, human, real. NOT generic, NOT cringe, NOT corporate.
Supporters and honest storytelling are the emotional centrepiece. Do not invent or imply any song title, release date, release status, lyric, streaming link, or presave claim.

Create a social post draft for ${dayOfWeek} ${date}.

Post type: ${postType.label}
Platform: ${postType.platform}
Campaign: ${postType.campaign || campaign}
Recent hooks used (avoid repeating): ${recentHooks || 'none yet'}
Products available: ${productNames || 'merch items'}
Owner-approved public releases: ${releaseTitles || 'none'}
If this list is "none", keep the draft evergreen and make no song or release claim.

Output a JSON object with exactly these fields:
{
  "hook": "first 1-3 seconds hook (punchy, stops scroll)",
  "caption": "full post caption (authentic Gannon voice, 150-300 chars)",
  "hashtags": "8-12 relevant hashtags",
  "cta": "clear call to action",
  "on_screen_text": "text overlay for video if applicable",
  "visual_direction": "what the video/image should show",
  "emotional_angle": "what emotion this triggers in fans",
  "brand_fit_score": 8,
  "viral_potential_score": 7,
  "cringe_risk": 2,
  "platform_fit_score": 9,
  "quality_score": 8,
  "quality_notes": "brief quality notes",
  "risk_notes": "any content risks or sensitivities",
  "metricool_export": "formatted for Metricool copy-paste: caption + hashtags"
}`;

      let draft = null;
      try {
        draft = await base44.asServiceRole.integrations.Core.InvokeLLM({
          prompt,
          response_json_schema: {
            type: 'object',
            properties: {
              hook: { type: 'string' },
              caption: { type: 'string' },
              hashtags: { type: 'string' },
              cta: { type: 'string' },
              on_screen_text: { type: 'string' },
              visual_direction: { type: 'string' },
              emotional_angle: { type: 'string' },
              brand_fit_score: { type: 'number' },
              viral_potential_score: { type: 'number' },
              cringe_risk: { type: 'number' },
              platform_fit_score: { type: 'number' },
              quality_score: { type: 'number' },
              quality_notes: { type: 'string' },
              risk_notes: { type: 'string' },
              metricool_export: { type: 'string' },
            },
          },
        });
      } catch (e) {
        console.log(`[generateDailyDrafts] LLM error for ${postType.type}: ${e.message}`);
        continue;
      }

      if (!draft?.hook) continue;

      // Quality gate: reject cringe risk > 6 or quality score < 5
      if ((draft.cringe_risk || 0) > 6 || (draft.quality_score || 0) < 5) {
        console.log(`[generateDailyDrafts] Draft rejected — cringe:${draft.cringe_risk} quality:${draft.quality_score}`);
        continue;
      }

      // Create ContentCalendarPost as draft
      const post = await base44.asServiceRole.entities.ContentCalendarPost.create({
        campaign,
        scheduled_date: date,
        platform: postType.platform,
        content_type: postType.content_type,
        hook: draft.hook,
        caption: draft.caption,
        hashtags: draft.hashtags,
        cta: draft.cta,
        on_screen_text: draft.on_screen_text,
        broll_ideas: draft.visual_direction,
        content_notes: `Emotional angle: ${draft.emotional_angle || ''} | Brand fit: ${draft.brand_fit_score}/10 | Viral: ${draft.viral_potential_score}/10 | Cringe risk: ${draft.cringe_risk}/10 | Quality: ${draft.quality_score}/10\n${draft.quality_notes || ''}\nRisk notes: ${draft.risk_notes || 'none'}`,
        metricool_export: draft.metricool_export,
        status: 'draft',
        generated_by: 'generateDailyDrafts',
        source_chain: `DailyDraftEngine → BrandVoiceAgent → QualityGate → ContentCalendarPost`,
      });

      // Create ApprovalQueue item
      await base44.asServiceRole.entities.ApprovalQueue.create({
        action_title: `[Social Draft] ${postType.label} — ${postType.platform} — ${date}`,
        action_description: `Hook: ${draft.hook}\n\nCaption: ${draft.caption}\n\nCTA: ${draft.cta}\n\nHashtags: ${draft.hashtags}`,
        risk_level: (draft.cringe_risk || 0) > 4 ? 'medium' : 'low',
        status: 'pending',
        agent_name: 'DailyDraftEngine',
        tags: ['social_post', postType.platform, date],
        proposed_output: `${draft.hook}\n\n${draft.caption}\n\n${draft.hashtags}`,
        payload: { post_id: post.id, platform: postType.platform, date, type: postType.type },
      });

      createdPosts.push({
        post_id: post.id,
        platform: postType.platform,
        type: postType.type,
        hook: draft.hook,
        quality_score: draft.quality_score,
        cringe_risk: draft.cringe_risk,
        status: 'draft_pending_approval',
      });
    }

    // Notify admin
    if (createdPosts.length > 0) {
      await base44.asServiceRole.entities.AdminNotification.create({
        notification_type: 'system',
        severity: 'info',
        title: `📱 ${createdPosts.length} social drafts ready for review`,
        summary: `Daily drafts for ${date}: ${createdPosts.map(p => p.platform).join(', ')}. Review in Approval Queue.`,
        source: 'generateDailyDrafts',
        requires_action: true,
        linked_route: '/admin/approval-queue',
        is_read: false,
      });
    }

    return Response.json({
      success: true,
      date,
      posts_created: createdPosts.length,
      posts: createdPosts,
      approval_required: true,
      scheduling_blocked_until_approved: true,
      message: `${createdPosts.length} draft(s) created for ${date}. All require ApprovalQueue approval before Metricool scheduling.`,
      source_chain: 'DailyDraftEngine → BrandVoiceAgent → QualityGate → ContentCalendarPost → ApprovalQueue → [awaiting approval] → MetricoolScheduler',
    });

  } catch (error) {
    console.log(`[generateDailyDrafts] ERROR: ${error.message}`);
    return Response.json({ error: error.message }, { status: 500 });
  }
});