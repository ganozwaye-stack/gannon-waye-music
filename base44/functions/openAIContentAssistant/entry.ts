import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

// OpenAI Content Assistant
// Generates approval-gated social post drafts. Admin-only. Never auto-posts.

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (user?.role !== 'admin') {
      return Response.json({ error: 'Forbidden: Admin only' }, { status: 403 });
    }

    const body = await req.json();
    const {
      platform = 'instagram',
      campaign = 'evergreen_artist_content',
      context = '',
      content_type = 'caption',
      max_variants = 2,
    } = body;

    const apiKey = Deno.env.get('OPENAI_API_KEY');
    if (!apiKey) {
      return Response.json({ error: 'OPENAI_API_KEY not set' }, { status: 400 });
    }

    const platformGuide = {
      instagram: 'emotional storytelling, saves + shares, carousel-friendly',
      tiktok: 'strong hook first 3 seconds, authenticity, watch-time hooks',
      facebook: 'emotional story, supporter community focus',
      youtube_shorts: 'curiosity + retention, emotional payoff',
      threads: 'conversational, vulnerable, community replies',
      twitter_x: 'punchy, emotional, re-postable',
      pinterest: 'evergreen, merch/product discovery',
    }[platform] || 'emotional, engaging';

    const prompt = `You are a music marketing expert for indie artist Gannon Waye.

Platform: ${platform} (${platformGuide})
Campaign: ${campaign}
Context: ${context || 'Evergreen artist story, creativity, community, merch store, and supporter connection. No release-specific claim is authorised.'}

Generate ${max_variants} post variant(s) in JSON:
{
  "variants": [
    {
      "hook": "opening line / first 3 seconds",
      "caption": "full post caption (max 300 chars for ${platform})",
      "hashtags": "space-separated hashtags",
      "cta": "clear call to action",
      "visual_direction": "brief CapCut/Canva visual concept",
      "predicted_viral_probability": 0.0-1.0
    }
  ]
}

Rules: No profanity. Emotionally authentic. Gannon's voice. Always includes a CTA. Never auto-post. Do not name or imply any song, album, release date, release status, lyric, artwork, streaming link, presave, launch, or countdown, even if unverified context asks for one.`;

    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 600,
        response_format: { type: 'json_object' },
      }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      return Response.json({ error: err?.error?.message || `OpenAI error ${res.status}` }, { status: 500 });
    }

    const data = await res.json();
    let result = { variants: [] };
    try { result = JSON.parse(data.choices[0].message.content); } catch {}

    // Create ContentPost drafts in awaiting_approval state
    const created = [];
    for (const v of (result.variants || [])) {
      const post = await base44.asServiceRole.entities.ContentPost.create({
        platform,
        campaign,
        status: 'awaiting_approval',
        hook: v.hook,
        caption: v.caption,
        hashtags: v.hashtags,
        cta: v.cta,
        visual_prompt: v.visual_direction,
        predicted_viral_probability: v.predicted_viral_probability || 0,
        generated_by_agent: 'openAIContentAssistant',
        source_chain: `openAIContentAssistant → awaiting_approval → ApprovalQueue → Metricool`,
      }).catch(() => null);
      if (post) created.push(post.id);
    }

    // Create AgentMessage
    await base44.asServiceRole.entities.AgentMessage.create({
      from_system: 'openAIContentAssistant',
      to_system: 'content_command',
      message_type: 'content_task',
      priority: 'medium',
      subject: `${created.length} ${platform} drafts created for ${campaign}`,
      summary: `${created.length} posts awaiting approval. No auto-posting.`,
      linked_route: '/admin/content-command',
      status: 'awaiting_approval',
      requires_approval: true,
      created_by_agent: 'openAIContentAssistant',
      cost_estimate: (data.usage?.total_tokens || 0) * 0.00000015,
      risk_level: 'low',
    }).catch(() => {});

    return Response.json({
      success: true,
      drafts_created: created.length,
      post_ids: created,
      tokens_used: data.usage?.total_tokens || 0,
      estimated_cost_usd: ((data.usage?.total_tokens || 0) * 0.00000015).toFixed(6),
      approval_required: true,
      note: 'Posts created as awaiting_approval. No auto-posting will occur.',
    });

  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});