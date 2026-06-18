import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

// generateContentPost — AI-powered per-post generation with platform rules
// Input: { platform, campaign, angle }
// Output: ContentPost record + ApprovalQueue item created, returns post data
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
      platform = 'instagram',
      campaign = 'thank_you_june5',
      angle = 'emotional_story',
    } = body;

    const PLATFORM_RULES = {
      instagram:      'Focus: saves, shares, carousels. Write for hearts. Use line breaks, emotional weight, strong hook, CTA to save/share. Max 2200 chars.',
      tiktok:         'Focus: hooks, watch time, replays. First 1-2 seconds must stop scroll. Keep caption short. Use trending audio context. Drive comments/follows.',
      facebook:       'Focus: emotional storytelling, shares. Write longer, personal, narrative. Invite discussion. Drive community shares.',
      youtube_shorts: 'Focus: retention, curiosity. Create open loop in first second. Payoff at end. Optimise for replay value.',
      threads:        'Focus: conversational vulnerability. Write like a personal journal entry shared with friends. Drive replies.',
      pinterest:      'Focus: evergreen emotional inspiration. Write titles and descriptions that resonate across time. Include merch/product angle naturally.',
      twitter_x:      'Focus: punchy emotional statements. Under 280 chars for the hook. High repostability. Controversial or deeply relatable.',
    };

    const ANGLE_GUIDES = {
      emotional_story:  'Tell a vulnerable, real story from Gannon\'s journey — country Victoria, Brazilian roots, music as healing.',
      viral_hook:       'Create the most scroll-stopping, emotionally triggering opening possible. Think: what would make someone stop and watch?',
      merch_cta:        'Drive to the store. Authentic connection between product and music/story. Never feel like an ad.',
      community:        'Celebrate and uplift fans. Make them feel seen. Invite participation. Thank them.',
      behind_scenes:    'Show the real creative process — recording, writing, production. Raw and authentic.',
      presave:          'Drive streams, saves, shares, comments, and emotional connection for THANKYOU. Keep it human, not pushy.',
      vulnerability:    'Most personal, most human. Share something Gannon has never shared publicly. Trust and authenticity.',
    };

    const platformRule = PLATFORM_RULES[platform] || PLATFORM_RULES.instagram;
    const angleGuide = ANGLE_GUIDES[angle] || ANGLE_GUIDES.emotional_story;

    const prompt = `You are the Brand Voice Agent for Gannon Waye, Australian singer-songwriter.

Artist profile: Indie/pop, Country Victoria roots, Brazilian heritage. Debut single "Thank You" — June 5 2026.
Brand pillars: authenticity, vulnerability, warmth, community, healing, safe spaces.
Style: Real. Human. NOT generic, NOT cringe, NOT corporate.

Campaign: ${campaign}
Platform: ${platform}
Content angle: ${angle} — ${angleGuide}

Platform rules: ${platformRule}

Generate a single production-ready social post. Return JSON:
{
  "hook": "First 1-3 seconds / first line. Must stop scroll immediately.",
  "caption": "Full platform-appropriate caption. Gannon's authentic voice. Correct length for ${platform}.",
  "hashtags": "12-18 targeted hashtags (niche + mid + broad). No spaces between #tags.",
  "cta": "Single clear call to action.",
  "visual_prompt": "CapCut/Runway/Canva prompt for the ideal visual asset for this post.",
  "visual_concept": "2-3 sentence creative direction for what to film/photograph.",
  "predicted_engagement_score": 8,
  "predicted_conversion_score": 7,
  "predicted_viral_probability": 0.15,
  "emotional_angle": "What emotion this triggers and why it works.",
  "risk_notes": "Any content risks or sensitivities — or 'none'."
}`;

    const generated = await base44.integrations.Core.InvokeLLM({
      prompt,
      response_json_schema: {
        type: 'object',
        properties: {
          hook: { type: 'string' }, caption: { type: 'string' },
          hashtags: { type: 'string' }, cta: { type: 'string' },
          visual_prompt: { type: 'string' }, visual_concept: { type: 'string' },
          predicted_engagement_score: { type: 'number' },
          predicted_conversion_score: { type: 'number' },
          predicted_viral_probability: { type: 'number' },
          emotional_angle: { type: 'string' }, risk_notes: { type: 'string' },
        },
      },
    });

    if (!generated?.hook) {
      return Response.json({ error: 'LLM did not return a valid post.' }, { status: 500 });
    }

    // Create ContentPost
    const post = await base44.entities.ContentPost.create({
      platform,
      campaign,
      status: 'awaiting_approval',
      hook: generated.hook,
      caption: generated.caption,
      hashtags: generated.hashtags,
      cta: generated.cta,
      visual_prompt: generated.visual_prompt,
      predicted_engagement_score: generated.predicted_engagement_score,
      predicted_conversion_score: generated.predicted_conversion_score,
      predicted_viral_probability: generated.predicted_viral_probability,
      generated_by_agent: 'generateContentPost',
      source_chain: `ContentCommand → generateContentPost/${platform}/${angle} → ApprovalQueue`,
    });

    // Create ApprovalQueue item
    await base44.entities.ApprovalQueue.create({
      agent_name: 'Content Command',
      action_title: `[${platform}] ${angle.replace(/_/g, ' ')} — ${campaign}`,
      action_description: `Generated post for ${platform}. Angle: ${angle}. Campaign: ${campaign}.\n\nEmotional angle: ${generated.emotional_angle}\nRisk notes: ${generated.risk_notes}`,
      risk_level: 'low',
      risk_type: ['publishing'],
      status: 'pending',
      proposed_output: `HOOK:\n${generated.hook}\n\nCAPTION:\n${generated.caption}\n\nCTA: ${generated.cta}\n\nHASHTAGS: ${generated.hashtags}`,
      tags: ['social_post', platform, campaign],
      payload: { post_id: post.id, platform, campaign, angle },
    });

    // Queue visual if concept was generated
    if (generated.visual_prompt) {
      await base44.entities.VisualGenerationQueue.create({
        prompt: generated.visual_prompt,
        visual_concept: generated.visual_concept,
        visual_type: platform === 'instagram' || platform === 'pinterest' ? 'quote_card' : 'reel_concept',
        platform,
        campaign,
        asset_status: 'draft',
        approval_status: 'awaiting_approval',
        linked_content_post_id: post.id,
        source_chain: `generateContentPost → VisualGenerationQueue`,
      }).catch(() => {});
    }

    return Response.json({
      ...post,
      visual_concept: generated.visual_concept,
      visual_prompt: generated.visual_prompt,
      emotional_angle: generated.emotional_angle,
    });

  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});