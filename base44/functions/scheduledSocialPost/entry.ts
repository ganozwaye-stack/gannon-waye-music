import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

// Scheduled social post automation - drafts content for approval.
// All posts require ApprovalQueue approval before going live.
Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (user?.role !== 'admin') {
      return Response.json({ error: 'Admin only' }, { status: 403 });
    }

    const today = new Date().toLocaleDateString('en-AU', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
    });

    const result = await base44.integrations.Core.InvokeLLM({
      prompt: `You are the social media voice for Gannon Waye, an Australian singer-songwriter.
Today is ${today}. The debut single "THANKYOU" by Gannon Waye is out now after its official 05 June 2026 release.

Generate 3 social media post drafts for TODAY. Each should be emotionally resonant, authentic, and platform-appropriate.

Post 1 (TikTok caption - under 150 chars, use 3-5 relevant hashtags like #GannonWaye #THANKYOU #IndieMusic #NewMusic #Singer):
Post 2 (Instagram caption - 2-3 sentences, emotional, with hashtags):
Post 3 (Short motivational quote tweet - under 280 chars, no hashtags):

All posts should drive streams, saves, shares, comments, UGC, community growth, or store visits while staying human-first.
Use active post-release CTAs such as "Stream now", "Save it", "Share it with someone who needs it", "Comment your story", or "Join the journey".
Do NOT use pre-save, coming soon, not released, or countdown wording for THANKYOU.
Gannon's social handles: Instagram @ganozwaye, TikTok @gannonwaye, YouTube @gannonwaye.`,
      response_json_schema: {
        type: 'object',
        properties: {
          tiktok: { type: 'string' },
          instagram: { type: 'string' },
          twitter: { type: 'string' },
          best_posting_time: { type: 'string' },
          theme_of_day: { type: 'string' },
        },
      },
    });

    const approval = await base44.asServiceRole.entities.ApprovalQueue.create({
      agent_name: 'Social Post Agent',
      action_title: `Daily Social Posts - ${today}`,
      action_type: 'social_post',
      proposed_action: `Theme: ${result.theme_of_day || 'Music journey'}\n\nTikTok: ${result.tiktok}\n\nInstagram: ${result.instagram}\n\nTwitter/X: ${result.twitter}\n\nBest posting time: ${result.best_posting_time || 'Between 7-9pm AEST'}`,
      status: 'pending',
      risk_level: 'low',
    });

    await base44.asServiceRole.entities.AdminNotification.create({
      notification_type: 'approval',
      severity: 'info',
      title: 'Daily Social Posts Ready for Approval',
      summary: `${result.theme_of_day || 'Music/release content'} - post-release growth drafts ready. Review and approve in Approval Queue.`,
      source: 'scheduledSocialPost',
      requires_action: true,
      linked_entity: 'ApprovalQueue',
      linked_id: approval.id,
      linked_route: '/admin/approval-queue',
      is_read: false,
    });

    return Response.json({
      success: true,
      approval_id: approval.id,
      posts: result,
      campaign_mode: 'post_release_growth',
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});
