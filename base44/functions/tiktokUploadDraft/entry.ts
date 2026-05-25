import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

// Upload an approved draft to TikTok as a creator draft (requires creator review before publishing)
Deno.serve(async (req) => {
  const base44 = createClientFromRequest(req);

  try {
    const user = await base44.auth.me();
    if (user?.role !== 'admin') {
      return Response.json({ error: 'Forbidden' }, { status: 403 });
    }
  } catch (_) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  const { proposal_id, video_url, title, caption, privacy_level = 'SELF_ONLY' } = body;

  if (!video_url || !caption) {
    return Response.json({ error: 'video_url and caption are required' }, { status: 400 });
  }

  // Get stored TikTok token
  const records = await base44.asServiceRole.entities.KnowledgeVault.filter({
    source: 'tiktok_oauth',
  }, '-created_date', 1);

  if (!records.length) {
    return Response.json({ error: 'TikTok not connected. Please connect your TikTok account first.' }, { status: 401 });
  }

  const stored = JSON.parse(records[0].content);
  const access_token = stored.access_token;

  // Step 1: Initialize upload
  const initRes = await fetch('https://open.tiktokapis.com/v2/post/publish/video/init/', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${access_token}`,
      'Content-Type': 'application/json; charset=UTF-8',
    },
    body: JSON.stringify({
      post_info: {
        title: caption.slice(0, 150),
        privacy_level,
        disable_duet: false,
        disable_comment: false,
        disable_stitch: false,
      },
      source_info: {
        source: 'PULL_FROM_URL',
        video_url,
      },
    }),
  });

  const initData = await initRes.json();

  if (initData.error?.code && initData.error.code !== 'ok') {
    return Response.json({
      error: initData.error.message || 'TikTok upload initialization failed',
      tiktok_error: initData.error,
    }, { status: 400 });
  }

  const publish_id = initData.data?.publish_id;

  // Log the upload event
  await base44.asServiceRole.entities.AdminNotification.create({
    notification_type: 'system',
    title: `TikTok Draft Uploaded: ${title || 'Untitled'}`,
    summary: `Draft uploaded to TikTok. Publish ID: ${publish_id}. Status: Awaiting creator review in TikTok app.`,
    severity: 'info',
    requires_action: false,
    linked_route: '/admin/tiktok-review-demo',
    source: 'TikTokDraftUpload',
    is_read: false,
  });

  // Update proposal status if provided
  if (proposal_id) {
    await base44.asServiceRole.entities.AgentActionProposal.update(proposal_id, {
      status: 'published',
      published_at: new Date().toISOString(),
      decision_note: `Uploaded to TikTok as draft. Publish ID: ${publish_id}. Awaiting creator review.`,
    });
  }

  return Response.json({
    success: true,
    publish_id,
    status: 'AWAITING_CREATOR_REVIEW',
    message: 'Draft uploaded to TikTok. Open TikTok app to complete publishing.',
  });
});