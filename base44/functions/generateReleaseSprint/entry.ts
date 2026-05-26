import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

// Generates the full 11-day June 5 release sprint content calendar
// All posts go to ApprovalQueue — nothing posts externally without admin approval
Deno.serve(async (req) => {
  const base44 = createClientFromRequest(req);

  try {
    const user = await base44.auth.me();
    if (user?.role !== 'admin') {
      return Response.json({ error: 'Admin only' }, { status: 403 });
    }

    const body = await req.json().catch(() => ({}));
    const { day, regenerate } = body;

    const RELEASE_DATE = new Date('2026-06-05T00:00:00+10:00');
    const now = new Date();
    const daysUntilRelease = Math.max(0, Math.ceil((RELEASE_DATE - now) / (1000 * 60 * 60 * 24)));

    const THEMES = [
      'Kickoff — emotional reveal, the gratitude angle',
      'Raw story — what the song is really about',
      'Behind the scenes — writing/studio process',
      'Merch + CD pre-order CTA',
      'Fan community love and appreciation',
      'Lyric teaser — most emotional line',
      'Countdown urgency — 5 days to go',
      'Personal message to supporters',
      'Final push — T-minus 2 days',
      'June 4 — studio/recording day, release eve content',
      'RELEASE DAY — June 5: Thank You is out now',
    ];

    // Sprint plan: 11 days May 26 → June 5 (release day)
    const sprintDays = Array.from({ length: 11 }, (_, i) => {
      const d = new Date(RELEASE_DATE);
      d.setDate(d.getDate() - (10 - i)); // Day 1 = May 26, Day 11 = June 5
      return {
        day: i + 1,
        date: d.toISOString().split('T')[0],
        theme: THEMES[i],
        isReleaseDay: i === 10,
        // 2-3 platforms per day
        platforms: i === 10
          ? ['tiktok', 'instagram_reels', 'instagram_stories']
          : i === 9
          ? ['tiktok', 'instagram_reels', 'instagram_stories']
          : i % 2 === 0
          ? ['tiktok', 'instagram_reels', 'instagram_stories']
          : ['tiktok', 'instagram_reels'],
      };
    });

    const targetDay = day ? sprintDays.find(d => d.day === Number(day)) : null;
    const daysToGenerate = targetDay ? [targetDay] : sprintDays;

    const created = [];
    const skipped = [];
    const errors = [];

    for (const sprintDay of daysToGenerate) {
      try {
        const daysUntilThisDay = Math.max(0, Math.ceil((new Date(sprintDay.date) - now) / (1000 * 60 * 60 * 24)));

        // Duplicate protection: skip platforms that already have a post for this day unless regenerate=true
        const existingPosts = await base44.asServiceRole.entities.ContentCalendarPost.filter({
          campaign: 'thank_you_june5_sprint',
          sprint_day: sprintDay.day,
        }, 'created_date', 50);

        const existingPlatforms = new Set(existingPosts.map(p => p.platform));
        const platformsToGenerate = regenerate
          ? sprintDay.platforms
          : sprintDay.platforms.filter(p => !existingPlatforms.has(p));

        if (platformsToGenerate.length === 0) {
          skipped.push(`Day ${sprintDay.day}: all platforms already generated`);
          continue;
        }

        const prompt = `You are a premium music marketing strategist for Gannon Waye, Australian singer-songwriter.

Release: "Thank You" — June 5, 2026 (${daysUntilRelease} days from today).
Sprint Day ${sprintDay.day}/11 — Date: ${sprintDay.date} — Theme: ${sprintDay.theme}
${sprintDay.isReleaseDay
  ? 'THIS IS RELEASE DAY. The song is officially OUT. Use "Listen Now", "Out Now", "Available Everywhere".'
  : 'Song is NOT released yet. Never say "Out Now" or "Listen Now". Use "Pre-Save", "Coming June 5", "Drop date: June 5".'}

Platforms to generate for: ${platformsToGenerate.join(', ')}

Generate a complete content brief for EACH platform listed. For each platform return:
- hook: Stop-the-scroll first 1-3 seconds (specific, emotional, pattern-interrupt)
- caption: Full platform-appropriate caption with line breaks, story, and CTA
- on_screen_text: Text overlay sequence with timing cues (e.g. "0:00 — 'This song was never meant to exist'")
- shot_list: Specific ordered shots — framing, lighting, action
- edit_rhythm: Cut timing, transitions, music sync points
- broll_ideas: Specific B-roll ideas relevant to Gannon's story (no generic placeholders)
- cta: One clear final action
- hashtags: 15-20 targeted hashtags — niche + mid + broad mix
- metricool_export: Ready-to-paste text for Metricool (caption + hashtags formatted, no instructions, no labels)
- content_notes: Production and posting notes for admin

Brand values: authenticity, vulnerability, warmth, community, safe spaces. No generic AI filler. Be specific to this artist's story.`;

        const schema = { type: 'object', properties: {} };
        for (const plat of platformsToGenerate) {
          schema.properties[plat] = {
            type: 'object',
            properties: {
              hook: { type: 'string' }, caption: { type: 'string' },
              on_screen_text: { type: 'string' }, shot_list: { type: 'string' },
              edit_rhythm: { type: 'string' }, broll_ideas: { type: 'string' },
              cta: { type: 'string' }, hashtags: { type: 'string' },
              metricool_export: { type: 'string' }, content_notes: { type: 'string' },
            }
          };
        }

        let llmResult;
        try {
          llmResult = await base44.integrations.Core.InvokeLLM({
            prompt,
            response_json_schema: schema,
          });
        } catch (llmErr) {
          const errMsg = `Day ${sprintDay.day} LLM error: ${llmErr.message}`;
          errors.push(errMsg);
          // Log health issue
          await base44.asServiceRole.entities.SystemHealthIssue.create({
            system_area: 'integrations',
            issue_title: `Release Sprint LLM failure — Day ${sprintDay.day}`,
            severity: 'high',
            detected_by: 'generateReleaseSprint',
            recommended_fix: `Check InvokeLLM integration credits and function timeout. Error: ${llmErr.message}`,
            status: 'open',
          });
          continue;
        }

        for (const plat of platformsToGenerate) {
          const postData = llmResult?.[plat];
          if (!postData || !postData.hook) {
            errors.push(`Day ${sprintDay.day}/${plat}: LLM returned no data`);
            continue;
          }

          const post = await base44.asServiceRole.entities.ContentCalendarPost.create({
            campaign: 'thank_you_june5_sprint',
            sprint_day: sprintDay.day,
            scheduled_date: sprintDay.date,
            platform: plat,
            content_type: sprintDay.isReleaseDay ? 'release_day' : 'video_hook',
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
            source_chain: `generateReleaseSprint → Day${sprintDay.day} → ${plat} → ApprovalQueue → QualityReview → ScheduleQueue → Metricool`,
            generated_by: 'generateReleaseSprint',
          });

          created.push({ id: post.id, day: sprintDay.day, platform: plat });

          // Create approval queue item using correct schema fields
          const approval = await base44.asServiceRole.entities.ApprovalQueue.create({
            agent_name: 'Release Sprint Generator',
            action_title: `Day ${sprintDay.day} · ${sprintDay.date} · ${plat} — ${sprintDay.theme}`,
            action_description: `HOOK: ${postData.hook}\n\nCAPTION:\n${postData.caption}\n\nCTA: ${postData.cta}\n\nHASHTAGS: ${postData.hashtags}\n\nMETRICOOL READY:\n${postData.metricool_export}`,
            proposed_output: postData.caption,
            status: 'pending',
            risk_level: 'low',
            risk_type: ['publishing'],
            tags: [`sprint_day_${sprintDay.day}`, plat, 'thank_you_sprint'],
          });

          // Link approval back to post
          await base44.asServiceRole.entities.ContentCalendarPost.update(post.id, {
            approval_id: approval.id,
          });
        }

        // One notification per day
        await base44.asServiceRole.entities.AdminNotification.create({
          notification_type: 'approval',
          severity: daysUntilThisDay <= 3 ? 'high' : 'info',
          title: `📅 Sprint Day ${sprintDay.day} Content Ready — ${sprintDay.date}`,
          summary: `${sprintDay.theme} · ${platformsToGenerate.length} platform drafts awaiting approval before Metricool scheduling.`,
          source: 'generateReleaseSprint',
          requires_action: true,
          linked_entity: 'ContentCalendarPost',
          linked_route: '/admin/release-sprint',
          is_read: false,
        });

      } catch (dayErr) {
        errors.push(`Day ${sprintDay.day} failed: ${dayErr.message}`);
      }
    }

    return Response.json({
      success: true,
      days_generated: daysToGenerate.length,
      posts_created: created.length,
      posts_skipped: skipped.length,
      errors,
      skipped,
      posts: created,
      source_chain: 'generateReleaseSprint → ContentCalendarPost → ApprovalQueue → QualityReview → ScheduleQueue → Metricool',
      message: `${created.length} posts created across ${daysToGenerate.length} sprint day(s). ${skipped.length} skipped (already generated). ${errors.length} errors.`,
    });

  } catch (error) {
    // Log to SystemHealthIssue and AdminNotification
    try {
      await base44.asServiceRole.entities.SystemHealthIssue.create({
        system_area: 'integrations',
        issue_title: 'Release Sprint Generation Failed',
        severity: 'critical',
        detected_by: 'generateReleaseSprint',
        recommended_fix: `Error: ${error.message}. Check auth, entity permissions, and LLM integration.`,
        status: 'open',
      });
      await base44.asServiceRole.entities.AdminNotification.create({
        notification_type: 'automation_failed',
        severity: 'critical',
        title: '🚨 Release Sprint Generation Failed',
        summary: error.message,
        source: 'generateReleaseSprint',
        requires_action: true,
        linked_route: '/admin/release-sprint',
        is_read: false,
      });
    } catch (_) { /* ignore secondary errors */ }

    return Response.json({
      error: error.message,
      hint: 'Check admin auth, LLM integration credits, and entity write permissions.',
    }, { status: 500 });
  }
});