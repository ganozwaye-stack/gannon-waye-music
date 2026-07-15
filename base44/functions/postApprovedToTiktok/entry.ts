import { createClientFromRequest } from 'npm:@base44/sdk@0.8.38';

// Entity automation: fires when a ContentStudioRecord's approval_status changes to "approved"
// Takes the approved content and posts it to TikTok as a draft via the tiktokUploadDraft function.

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const { event, data, old_data, changed_fields } = body;

    // Only proceed if approval_status changed to "approved"
    if (!changed_fields?.includes('approval_status') || data?.approval_status !== 'approved') {
      return Response.json({ status: 'skipped', message: 'Not an approval event' });
    }

    if (!data) {
      return Response.json({ status: 'skipped', message: 'No data in payload' });
    }

    // Build the content to post — use caption or hook or on_screen_text
    const script = data.caption || data.hook || data.on_screen_text || '';
    if (!script) {
      return Response.json({ status: 'skipped', message: 'No content to post' });
    }

    // Invoke the TikTok upload draft function
    let tiktokResult = null;
    try {
      const result = await base44.asServiceRole.functions.invoke('tiktokUploadDraft', {
        title: data.song || data.release || 'Gannon Waye Content',
        description: script,
        tags: ['gannonwaye', 'music', 'singer', 'songwriter'],
        content_id: data.id,
      });
      tiktokResult = result?.data || result;
    } catch (err) {
      tiktokResult = { error: err.message };
    }

    // Update the ContentStudioRecord with the TikTok posting status
    await base44.asServiceRole.entities.ContentStudioRecord.update(data.id, {
      metricool_status: tiktokResult?.error ? 'failed' : 'published',
      notes: (data.notes || '') + `\n[TikTok Auto-Post ${new Date().toISOString()}] ${tiktokResult?.error ? 'Failed: ' + tiktokResult.error : 'Posted as draft: ' + JSON.stringify(tiktokResult?.tiktok_video_id || tiktokResult)}`,
    });

    // Create an admin notification
    await base44.asServiceRole.entities.AdminNotification.create({
      notification_type: 'system',
      severity: tiktokResult?.error ? 'warning' : 'info',
      title: tiktokResult?.error ? 'TikTok Auto-Post Failed' : 'TikTok Draft Created',
      summary: tiktokResult?.error
        ? `Failed to post "${data.song || data.id}" to TikTok: ${tiktokResult.error}`
        : `Content "${data.song || data.id}" was auto-posted to TikTok as a draft.`,
      source: 'tiktok_auto_poster',
      linked_entity: 'ContentStudioRecord',
      linked_id: data.id,
      is_read: false,
      requires_action: tiktokResult?.error ? true : false,
    });

    return Response.json({
      status: tiktokResult?.error ? 'partial_error' : 'success',
      message: tiktokResult?.error
        ? `Content approved but TikTok posting failed: ${tiktokResult.error}`
        : 'Content approved and posted to TikTok as a draft.',
      tiktok_result: tiktokResult,
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});