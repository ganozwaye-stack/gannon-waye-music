import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

// Generates the full 10-day June 5 release sprint content calendar
// All posts go to ApprovalQueue — nothing posts externally without admin approval
Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (user?.role !== 'admin') {
      return Response.json({ error: 'Admin only' }, { status: 403 });
    }

    const { day, platform, content_type, regenerate } = await req.json().catch(() => ({}));
    const RELEASE_DATE = new Date('2026-06-05T00:00:00+10:00');
    const now = new Date();
    const daysUntilRelease = Math.max(0, Math.ceil((RELEASE_DATE - now) / (1000 * 60 * 60 * 24)));

    // Sprint plan: 10 days leading up to June 5
    const sprintDays = Array.from({ length: 10 }, (_, i) => {
      const d = new Date(RELEASE_DATE);
      d.setDate(d.getDate() - (9 - i)); // Day 10 = June 5 (release day), Day 1 = May 27
      return {
        day: i + 1,
        date: d.toISOString().split('T')[0],
        theme: [
          'Emotional reveal — the gratitude angle',
          'Raw story — what the song is really about',
          'Behind the scenes — writing/studio process',
          'Merch + CD pre-order CTA',
          'Fan community love and appreciation',
          'Lyric teaser — most emotional line',
          'Countdown urgency — 5 days to go',
          'Personal message to supporters',
          'Final push — release eve (June 4 studio/recording day)',
          'RELEASE DAY — June 5: Thank You is out now'
        ][i],
        platforms: i === 9
          ? ['tiktok', 'instagram_reels', 'instagram_stories', 'twitter_x']
          : i % 3 === 0
          ? ['tiktok', 'instagram_reels', 'instagram_stories']
          : ['tiktok', 'instagram_reels'],
      };
    });

    const targetDay = day ? sprintDays.find(d => d.day === day) : null;
    const daysToGenerate = targetDay ? [targetDay] : sprintDays;

    const created = [];
    const approvalIds = [];

    for (const sprintDay of daysToGenerate) {
      // Generate content for this day using LLM
      const isReleaseDay = sprintDay.day === 10;
      const daysUntilThisDay = Math.max(0, Math.ceil((new Date(sprintDay.date) - now) / (1000 * 60 * 60 * 24)));

      const prompt = `You are a premium music marketing strategist for Gannon Waye, Australian singer-songwriter.

Release: "Thank You" — June 5, 2026. ${daysUntilRelease} days from today.
Sprint Day ${sprintDay.day}/10 — Date: ${sprintDay.date} — Theme: ${sprintDay.theme}
${isReleaseDay ? 'THIS IS RELEASE DAY. The song is officially OUT. Use "Listen Now", "Out Now", "Available Everywhere".' : 'Song is NOT released yet. Never say "Out Now" or "Listen Now". Use "Pre-Save", "Coming June 5", "Drop date: June 5".'}

Platforms to generate for: ${sprintDay.platforms.join(', ')}

Generate a complete content brief for EACH platform. For each platform return:
- hook: Stop-the-scroll first 1-3 seconds
- caption: Full platform-appropriate caption with line breaks and CTA  
- on_screen_text: Text overlay sequence with timing cues
- shot_list: Specific ordered shots, framing, lighting
- edit_rhythm: Cut timing, transitions, music sync
- broll_ideas: Specific B-roll (no generics)
- cta: One clear final action
- hashtags: 15-20 targeted hashtags
- metricool_export: Ready-to-paste text for Metricool (caption + hashtags formatted, no instructions)
- content_notes: Production/posting notes

Brand values: authenticity, vulnerability, warmth, community, safe spaces. No generic AI filler.`;

      const schema = {
        type: 'object',
        properties: {}
      };
      for (const plat of sprintDay.platforms) {
        schema.properties[plat] = {
          type: 'object',
          properties: {
            hook: { type: 'string' },
            caption: { type: 'string' },
            on_screen_text: { type: 'string' },
            shot_list: { type: 'string' },
            edit_rhythm: { type: 'string' },
            broll_ideas: { type: 'string' },
            cta: { type: 'string' },
            hashtags: { type: 'string' },
            metricool_export: { type: 'string' },
            content_notes: { type: 'string' }
          }
        };
      }

      const llmResult = await base44.integrations.Core.InvokeLLM({
        prompt,
        response_json_schema: schema
      });

      // Save each platform post to ContentCalendarPost
      for (const plat of sprintDay.platforms) {
        const postData = llmResult[plat];
        if (!postData) continue;

        const post = await base44.asServiceRole.entities.ContentCalendarPost.create({
          campaign: 'thank_you_june5_sprint',
          sprint_day: sprintDay.day,
          scheduled_date: sprintDay.date,
          platform: plat,
          content_type: isReleaseDay ? 'release_day' : 'video_hook',
          hook: postData.hook,
          caption: postData.caption,
          hashtags: postData.hashtags,
          cta: postData.cta,
          shot_list: postData.shot_list,
          on_screen_text: postData.on_screen_text,
          edit_rhythm: postData.edit_rhythm,
          broll_ideas: postData.broll_ideas,
          content_notes: postData.content_notes,
          metricool_export: postData.metricool_export,
          status: 'pending_approval',
          source_chain: `generateReleaseSprint → Day${sprintDay.day} → ${plat} → ApprovalQueue`,
          generated_by: 'generateReleaseSprint',
        });

        created.push(post.id);

        // Create approval item
        const approval = await base44.asServiceRole.entities.ApprovalQueue.create({
          agent_name: 'Release Sprint Generator',
          action_title: `Day ${sprintDay.day} · ${sprintDay.date} · ${plat} — ${sprintDay.theme}`,
          action_type: 'social_post',
          proposed_action: `PLATFORM: ${plat}\n\nHOOK: ${postData.hook}\n\nCAPTION:\n${postData.caption}\n\nCTA: ${postData.cta}\n\nHASHTAGS: ${postData.hashtags}\n\nMETRICOOL READY:\n${postData.metricool_export}`,
          proposed_output: postData.caption,
          status: 'pending',
          risk_level: 'low',
          requires_human_review: true,
          source_chain: `Day${sprintDay.day}/${plat}`,
        });

        approvalIds.push(approval.id);

        // Link approval back to post
        await base44.asServiceRole.entities.ContentCalendarPost.update(post.id, {
          approval_id: approval.id
        });
      }

      // Admin notification per day
      await base44.asServiceRole.entities.AdminNotification.create({
        notification_type: 'approval',
        severity: daysUntilThisDay <= 3 ? 'high' : 'info',
        title: `📅 Sprint Day ${sprintDay.day} Content Ready — ${sprintDay.date}`,
        summary: `${sprintDay.theme} · ${sprintDay.platforms.length} platform drafts awaiting your approval before scheduling in Metricool.`,
        source: 'generateReleaseSprint',
        requires_action: true,
        linked_entity: 'ContentCalendarPost',
        linked_route: '/admin/release-sprint',
        is_read: false,
      });
    }

    return Response.json({
      success: true,
      days_generated: daysToGenerate.length,
      posts_created: created.length,
      approval_items: approvalIds.length,
      posts: created,
      source_chain: 'generateReleaseSprint → ContentCalendarPost → ApprovalQueue → Admin Approval → Metricool',
      message: `${created.length} content posts created across ${daysToGenerate.length} sprint day(s). All pending your approval before Metricool scheduling.`
    });

  } catch (error) {
    return Response.json({ error: error.message, stack: error.stack }, { status: 500 });
  }
});