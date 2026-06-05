import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

// Scheduled social post automation — runs daily, drafts content for approval
// All posts require ApprovalQueue approval before going live (safety rule)
Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (user?.role !== 'admin') {
      return Response.json({ error: 'Admin only' }, { status: 403 });
    }

    // Generate today's social post draft using LLM
    const today = new Date().toLocaleDateString('en-AU', { weekday: 'long', month: 'long', day: 'numeric' });
    const daysUntilRelease = Math.max(0, Math.ceil((new Date('2026-06-05') - new Date()) / (1000 * 60 * 60 * 24)));

    const result = await base44.integrations.Core.InvokeLLM({
      prompt: `You are the social media voice for Gannon Waye — Australian singer-songwriter. 
Today is ${today}. The debut single "Thank You" releases June 5, 2026 (${daysUntilRelease} days away).

Generate 3 social media post drafts for TODAY. Each should be emotionally resonant, authentic, and platform-appropriate.

Post 1 (TikTok caption — under 150 chars, use 3-5 relevant hashtags like #GannonWaye #ThankYouSingle #IndieMusic #NewMusic #Singer):
Post 2 (Instagram caption — 2-3 sentences, emotional, with hashtags):
Post 3 (Short motivational quote tweet — under 280 chars, no hashtags):

All posts should hint at the upcoming release, personal vulnerability, self-love themes, or music journey. 
Do NOT use phrases like "Listen Now" — use "Pre-Save Now" or "Coming June 5".
Gannon's social handles: Instagram and TikTok are @gann0nwaye, YouTube is @gannonwayeofficial.`,
      response_json_schema: {
        type: "object",
        properties: {
          tiktok: { type: "string" },
          instagram: { type: "string" },
          twitter: { type: "string" },
          best_posting_time: { type: "string" },
          theme_of_day: { type: "string" }
        }
      }
    });

    // Save to ApprovalQueue — nothing posts without admin approval
    const approval = await base44.asServiceRole.entities.ApprovalQueue.create({
      agent_name: 'Social Post Agent',
      action_title: `Daily Social Posts — ${today}`,
      action_type: 'social_post',
      proposed_action: `Theme: ${result.theme_of_day || 'Music journey'}\n\nTikTok: ${result.tiktok}\n\nInstagram: ${result.instagram}\n\nTwitter/X: ${result.twitter}\n\nBest posting time: ${result.best_posting_time || 'Between 7–9pm AEST'}`,
      status: 'pending',
      risk_level: 'low',
    });

    // Notify admin
    await base44.asServiceRole.entities.AdminNotification.create({
      notification_type: 'approval',
      severity: 'info',
      title: `📱 Daily Social Posts Ready for Approval`,
      summary: `${result.theme_of_day || 'Music/release content'} — ${daysUntilRelease} days until release. Review and approve in Approval Queue.`,
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
      days_until_release: daysUntilRelease
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});