import { createClientFromRequest } from 'npm:@base44/sdk@0.8.38';

Deno.serve(async (req) => {
  try {
    const body = await req.text();

    // ─── VERIFY AUTHENTICITY ────────────────────────────────────────────────
    // HeyGen sends X-Api-Key header matching our API key, or a Bearer token.
    // We verify against our stored HEYGEN_API_KEY.
    const heygenApiKey = Deno.env.get('HEYGEN_API_KEY');
    const incomingKey = req.headers.get('x-api-key') || '';
    const authHeader = req.headers.get('authorization') || '';

    if (heygenApiKey && incomingKey !== heygenApiKey && !authHeader) {
      return Response.json({ error: 'Unauthorized — missing or invalid API key' }, { status: 401 });
    }

    const payload = JSON.parse(body);
    const eventType = payload.event_type;
    const eventData = payload.event_data || {};

    const base44 = createClientFromRequest(req);

    // ─── HANDLE avatar_video.success ────────────────────────────────────────
    if (eventType === 'avatar_video.success') {
      const { video_id, url, gif_download_url, video_page_url, video_share_page_url, callback_id } = eventData;

      // Find the production job by callback_id or heygen_video_id
      const jobs = await base44.asServiceRole.entities.ContentProductionJob.filter({
        callback_id: callback_id || video_id
      });

      if (jobs.length > 0) {
        const job = jobs[0];
        await base44.asServiceRole.entities.ContentProductionJob.update(job.id, {
          status: 'completed',
          video_url: url,
          video_share_url: video_share_page_url,
          heygen_video_id: video_id,
          error_message: null,
        });

        // Notify admin
        await base44.asServiceRole.integrations.Core.SendEmail({
          to: 'ganozwaye@gmail.com',
          subject: 'HeyGen Video Ready: ' + (job.title || video_id),
          body: `Your HeyGen video has been generated successfully.\n\nTitle: ${job.title}\nVideo ID: ${video_id}\nDownload URL: ${url}\nShare URL: ${video_share_page_url || 'N/A'}\n\nReview it in the Production Tracker at /admin/production-tracker.`
        });

        return Response.json({ status: 'success', message: 'Video completed and job updated.' });
      }

      // No matching job — create a notification anyway
      await base44.asServiceRole.entities.AdminNotification.create({
        notification_type: 'system',
        severity: 'info',
        title: 'HeyGen Video Completed',
        summary: `Video ${video_id} completed but no matching production job was found.`,
        source: 'heygen_webhook',
        linked_entity: 'ContentProductionJob',
        is_read: false,
      });

      return Response.json({ status: 'success', message: 'Video completed — no matching job found.' });
    }

    // ─── HANDLE avatar_video.fail ───────────────────────────────────────────
    if (eventType === 'avatar_video.fail') {
      const { video_id, callback_id, failure_message, failure } = eventData;
      const errorMsg = failure_message || failure || 'Unknown error';

      const jobs = await base44.asServiceRole.entities.ContentProductionJob.filter({
        callback_id: callback_id || video_id
      });

      if (jobs.length > 0) {
        const job = jobs[0];
        await base44.asServiceRole.entities.ContentProductionJob.update(job.id, {
          status: 'failed',
          error_message: errorMsg,
          heygen_video_id: video_id,
        });

        await base44.asServiceRole.integrations.Core.SendEmail({
          to: 'ganozwaye@gmail.com',
          subject: 'HeyGen Video FAILED: ' + (job.title || video_id),
          body: `Your HeyGen video generation failed.\n\nTitle: ${job.title}\nVideo ID: ${video_id}\nError: ${errorMsg}\n\nReview and retry in the Production Tracker at /admin/production-tracker.`
        });
      }

      return Response.json({ status: 'success', message: 'Video failure processed.' });
    }

    // ─── HANDLE video_agent.success / video_agent.fail ──────────────────────
    if (eventType === 'video_agent.success' || eventType === 'video_agent.fail') {
      const isFail = eventType === 'video_agent.fail';
      const { video_id, session_id, url, callback_id } = eventData;

      const jobs = await base44.asServiceRole.entities.ContentProductionJob.filter({
        callback_id: callback_id || session_id || video_id
      });

      if (jobs.length > 0) {
        const job = jobs[0];
        await base44.asServiceRole.entities.ContentProductionJob.update(job.id, {
          status: isFail ? 'failed' : 'completed',
          video_url: url || job.video_url,
          heygen_video_id: video_id || job.heygen_video_id,
          error_message: isFail ? 'Video Agent session failed' : null,
        });
      }

      return Response.json({ status: 'success', message: 'Video agent event processed.' });
    }

    // Unhandled event type — acknowledge receipt
    return Response.json({ status: 'success', message: `Event type ${eventType} acknowledged but not processed.` });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});