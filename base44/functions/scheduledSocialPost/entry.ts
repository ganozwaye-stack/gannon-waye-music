import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

// Generates evergreen social drafts for review. It never schedules or publishes.
Deno.serve(async (req: Request) => {
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
Today is ${today}.

Generate three evergreen social media drafts for today:
1. TikTok caption under 150 characters.
2. Instagram caption of two or three sentences.
3. Motivational post under 280 characters.

Use authentic themes such as creativity, community, self-worth, music-making, or personal reflection.
Do not name or imply any song, album, release date, release status, lyric, artwork, streaming link, presave, launch, or countdown.
Do not say music is out now or coming soon.
These are drafts only and require separate owner approval before any scheduling or publication.`,
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

    const proposedOutput = [
      `Theme: ${result.theme_of_day || 'Evergreen artist story'}`,
      `TikTok: ${result.tiktok || ''}`,
      `Instagram: ${result.instagram || ''}`,
      `Twitter/X: ${result.twitter || ''}`,
      `Suggested time: ${result.best_posting_time || 'Owner to decide'}`,
    ].join('\n\n');

    const approval = await base44.asServiceRole.entities.ApprovalQueue.create({
      agent_name: 'Social Post Agent',
      action_title: `Evergreen social drafts - ${today}`,
      action_description: 'Three evergreen social drafts are ready for review. They contain no release-specific claims.',
      description: 'Draft only. No social connector is accessed and nothing is scheduled or published.',
      risk_type: ['publishing', 'brand', 'reputation'],
      risk_level: 'medium',
      status: 'pending',
      proposed_output: proposedOutput,
      payload: {
        operation: 'draft_only',
        generated_for: today,
      },
      auto_eligible: false,
      tags: ['social', 'evergreen', 'draft-only'],
    });

    await base44.asServiceRole.entities.AdminNotification.create({
      notification_type: 'approval',
      severity: 'info',
      title: 'Daily evergreen social drafts ready',
      summary: 'Review the generic artist and community drafts in Approval Queue.',
      source: 'scheduledSocialPost',
      requires_action: true,
      linked_entity: 'ApprovalQueue',
      linked_id: approval.id,
      linked_route: '/admin/approval-queue',
      is_read: false,
    });

    return Response.json({
      success: true,
      drafted: true,
      published: false,
      approval_id: approval.id,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return Response.json({ error: message }, { status: 500 });
  }
});
