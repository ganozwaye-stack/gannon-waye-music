import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

// Schedules an approved ContentCalendarPost to Metricool via API
// Input: { post_id, schedule_datetime, media_ids? }
Deno.serve(async (req) => {
  const base44 = createClientFromRequest(req);

  try {
    let user = null;
    try { user = await base44.auth.me(); } catch (_) {}
    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Admin access required.' }, { status: 403 });
    }

    const token = Deno.env.get('METRICOOL_API_TOKEN');
    const userId = Deno.env.get('METRICOOL_USER_ID');
    const blogId = Deno.env.get('METRICOOL_BLOG_ID');

    if (!token || !userId || !blogId) {
      return Response.json({ error: 'Metricool not configured.' }, { status: 400 });
    }

    let body = {};
    try { body = await req.json(); } catch (_) {}
    const { post_id, schedule_datetime, media_ids = [] } = body;

    if (!post_id) {
      return Response.json({ error: 'post_id is required' }, { status: 400 });
    }

    // Fetch the post
    const posts = await base44.asServiceRole.entities.ContentCalendarPost.filter({ id: post_id }, 'created_date', 1);
    const post = posts?.[0];

    if (!post) {
      return Response.json({ error: 'Post not found' }, { status: 404 });
    }

    // HARD GATE: Only approved posts can be scheduled
    if (!['approved', 'scheduled'].includes(post.status)) {
      await base44.asServiceRole.entities.AdminNotification.create({
        notification_type: 'approval',
        severity: 'warning',
        title: '⚠️ Schedule blocked — post not approved',
        summary: `Post ${post_id} has status "${post.status}". Must be "approved" before scheduling to Metricool.`,
        source: 'metricoolSchedulePost',
        requires_action: true,
        linked_route: '/admin/approval-queue',
        is_read: false,
      });
      return Response.json({
        error: `Post status is "${post.status}". Only "approved" posts can be scheduled. Go to the Approval Queue first.`,
        hint: 'approval_required',
      }, { status: 400 });
    }

    // Map platform to Metricool network type
    const platformMap = {
      tiktok: 'tiktok',
      instagram_reels: 'instagram',
      instagram_stories: 'instagram',
      instagram_feed: 'instagram',
      twitter_x: 'twitter',
      facebook: 'facebook',
      youtube_shorts: 'youtube',
    };

    const network = platformMap[post.platform] || post.platform;
    const postText = post.metricool_export || `${post.caption || ''}\n\n${post.hashtags || ''}`.trim();
    const scheduledAt = schedule_datetime || `${post.scheduled_date}T09:00:00`;

    // Build Metricool API payload
    const metricoolPayload = {
      user_id: userId,
      blog_id: blogId,
      network,
      text: postText,
      date: scheduledAt,
      ...(media_ids.length > 0 && { media: media_ids.map(id => ({ id })) }),
      ...(post.platform === 'instagram_stories' && { type: 'story' }),
      ...(post.platform === 'instagram_reels' && { type: 'reel' }),
    };

    console.log(`[metricoolSchedulePost] Scheduling post ${post_id} to ${network} at ${scheduledAt}`);

    const schedResp = await fetch(`https://app.metricool.com/api/v2/post`, {
      method: 'POST',
      headers: {
        'X-Mc-Auth': token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(metricoolPayload),
      signal: AbortSignal.timeout(20000),
    });

    const schedText = await schedResp.text();
    let schedData = null;
    try { schedData = JSON.parse(schedText); } catch (_) {}

    if (!schedResp.ok) {
      await base44.asServiceRole.entities.AdminNotification.create({
        notification_type: 'system',
        severity: 'high',
        title: '❌ Metricool schedule failed',
        summary: `Post ${post_id} (${post.platform} Day ${post.sprint_day}) — HTTP ${schedResp.status}: ${schedText?.slice(0, 200)}`,
        source: 'metricoolSchedulePost',
        requires_action: true,
        linked_route: '/admin/metricool-scheduler-queue',
        is_read: false,
      });
      return Response.json({ error: `Metricool schedule failed: HTTP ${schedResp.status}`, detail: schedText?.slice(0, 500) }, { status: 400 });
    }

    const metricoolPostId = schedData?.id || schedData?.data?.id;

    // Update post status to scheduled
    await base44.asServiceRole.entities.ContentCalendarPost.update(post_id, {
      status: 'scheduled',
      content_notes: `${post.content_notes || ''}\nMetricool post ID: ${metricoolPostId} | Scheduled: ${scheduledAt}`.trim(),
      source_chain: `${post.source_chain || ''} → MetricoolSchedulerQueue → Metricool`,
    });

    console.log(`[metricoolSchedulePost] Scheduled — metricool_id=${metricoolPostId}`);

    return Response.json({
      success: true,
      metricool_post_id: metricoolPostId,
      platform: network,
      scheduled_at: scheduledAt,
      source_chain: 'SocialAsset → ContentCalendarPost → QualityReview → ApprovalQueue → MetricoolSchedulerQueue → Metricool → ContentPerformance',
      message: `Post scheduled to Metricool. ID: ${metricoolPostId}`,
    });

  } catch (error) {
    console.log(`[metricoolSchedulePost] ERROR: ${error.message}`);
    return Response.json({ error: error.message }, { status: 500 });
  }
});