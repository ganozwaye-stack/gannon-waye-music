import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

// Autonomous social posting scheduler
// Analyzes trending topics, generates content, and queues posts for approval
Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);

    // Fetch latest viral opportunities and creative ideas
    const [viralOps, ideas, socialVideos] = await Promise.all([
      base44.asServiceRole.entities.ViralOpportunity.filter({ status: 'new' }, '-created_date', 3),
      base44.asServiceRole.entities.IdeaOpportunity.filter({ category: 'social', status: 'new' }, '-created_date', 2),
      base44.asServiceRole.entities.SocialVideo.list('-created_date', 5),
    ]);

    if (viralOps.length === 0) {
      return Response.json({ success: true, message: 'No viral opportunities to post' });
    }

    // Generate social content via LLM
    const topOpportunity = viralOps[0];
    const contentPrompt = `You are Gannon Waye's social media strategist. Generate 3 viral TikTok/Instagram Reels hooks for this trend:

Trend: ${topOpportunity.trend}
Platform: ${topOpportunity.platform}
Recommended Angle: ${topOpportunity.recommended_angle}
Recommended Hook: ${topOpportunity.recommended_hook}

Generate 3 short, punchy hooks (max 15 words each) that align with Gannon's brand (authentic, emotional, independent artist).`;

    const hookResult = await base44.asServiceRole.integrations.Core.InvokeLLM({
      prompt: contentPrompt,
    });

    // Create social content draft
    const socialDraft = await base44.asServiceRole.entities.SocialVideo.create({
      title: `Auto-Draft: ${topOpportunity.trend}`,
      platform: topOpportunity.platform,
      content_hooks: hookResult,
      status: 'draft',
      source_trend: topOpportunity.trend,
    });

    // Log to Knowledge Vault for agent learning
    await base44.asServiceRole.entities.KnowledgeVault.create({
      title: `Social Post Draft — ${topOpportunity.trend}`,
      category: 'creative',
      content: hookResult,
      summary: `Auto-generated for trend: ${topOpportunity.trend} on ${topOpportunity.platform}`,
      source: 'AutonomousSocialPoster',
      tags: ['social-draft', 'auto-generated', topOpportunity.platform],
    });

    // Create approval request
    await base44.asServiceRole.entities.ApprovalQueue.create({
      agent_name: 'SocialPosterAgent',
      action_title: `Post on ${topOpportunity.platform}: "${topOpportunity.trend}"`,
      action_description: hookResult,
      risk_type: ['publishing'],
      risk_level: 'low',
      status: 'pending',
      payload: { viral_op_id: topOpportunity.id, video_id: socialDraft.id },
      proposed_output: `3 hook variations generated for "${topOpportunity.trend}" trend. Ready for manual review & posting.`,
    });

    // Notify via Slack
    await base44.asServiceRole.functions.invoke('sendSlackAlert', {
      channel: '#gannon-alerts',
      title: '📱 New Social Post Draft Ready',
      urgency: 'normal',
      message: `*Trend: ${topOpportunity.trend}*\n\n${hookResult.substring(0, 300)}`,
      action_url: 'https://gannonwaye.base44.app/admin/approval-queue',
      category: 'social',
    });

    return Response.json({ success: true, draft_id: socialDraft.id, hooks: hookResult });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});