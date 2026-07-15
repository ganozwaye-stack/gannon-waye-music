import { createClientFromRequest } from 'npm:@base44/sdk@0.8.38';

// Replay protection — reject deliveries older than 5 minutes
const MAX_SKEW_SECONDS = 300;

// In-memory dedup set for Heygen-Event-Id (survives within a single warm instance)
const deliveredEventIds = new Set();

Deno.serve(async (req) => {
  try {
    const rawBody = await req.text();

    // ─── SIGNATURE VERIFICATION (per HeyGen webhook docs) ───────────────────
    const webhookSecret = Deno.env.get('HEYGEN_WEBHOOK_SECRET');
    const signature = req.headers.get('heygen-signature') || '';
    const timestamp = req.headers.get('heygen-timestamp') || '';
    const eventId = req.headers.get('heygen-event-id') || '';

    // If the webhook secret is configured, enforce HMAC verification
    if (webhookSecret) {
      if (!signature || !timestamp) {
        return Response.json({ error: 'Missing signature headers' }, { status: 400 });
      }

      // Replay defense — reject stale timestamps
      const now = Math.floor(Date.now() / 1000);
      if (Math.abs(now - Number(timestamp)) > MAX_SKEW_SECONDS) {
        return Response.json({ error: 'Stale timestamp' }, { status: 400 });
      }

      // Dedup by event ID — events can be redelivered on retry
      if (eventId && deliveredEventIds.has(eventId)) {
        return Response.json({ status: 'success', message: 'Duplicate event already processed.' });
      }

      // Compute HMAC-SHA256 of the raw body using the webhook secret
      const key = await crypto.subtle.importKey(
        'raw',
        new TextEncoder().encode(webhookSecret),
        { name: 'HMAC', hash: 'SHA-256' },
        false,
        ['sign']
      );
      const sigBuf = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(rawBody));
      const expected = Array.from(new Uint8Array(sigBuf))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');

      // Constant-time comparison
      const sigBytes = new Uint8Array(Array.from(signature.match(/.{1,2}/g)?.map(b => parseInt(b, 16)) || []));
      const expBytes = new Uint8Array(Array.from(expected.match(/.{1,2}/g)?.map(b => parseInt(b, 16)) || []));
      if (sigBytes.length !== expBytes.length) {
        return Response.json({ error: 'Bad signature' }, { status: 401 });
      }
      let diff = 0;
      for (let i = 0; i < sigBytes.length; i++) {
        diff |= sigBytes[i] ^ expBytes[i];
      }
      if (diff !== 0) {
        return Response.json({ error: 'Bad signature' }, { status: 401 });
      }

      // Mark event as processed
      if (eventId) {
        deliveredEventIds.add(eventId);
        // Prevent unbounded growth
        if (deliveredEventIds.size > 1000) {
          const first = deliveredEventIds.values().next().value;
          if (first) deliveredEventIds.delete(first);
        }
      }
    } else {
      // Fallback: API key check (for initial setup before webhook secret is configured)
      const heygenApiKey = Deno.env.get('HEYGEN_API_KEY');
      const incomingKey = req.headers.get('x-api-key') || '';
      const authHeader = req.headers.get('authorization') || '';
      if (heygenApiKey && incomingKey !== heygenApiKey && !authHeader) {
        return Response.json({ error: 'Unauthorized — configure HEYGEN_WEBHOOK_SECRET for secure verification' }, { status: 401 });
      }
    }

    const payload = JSON.parse(rawBody);
    const eventType = payload.event_type;
    const eventData = payload.event_data || {};

    const base44 = createClientFromRequest(req);

    // ─── HANDLE avatar_video.success ────────────────────────────────────────
    if (eventType === 'avatar_video.success') {
      const { video_id, url, gif_download_url, video_page_url, video_share_page_url, callback_id } = eventData;

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

        await base44.asServiceRole.integrations.Core.SendEmail({
          to: 'ganozwaye@gmail.com',
          subject: 'HeyGen Video Ready: ' + (job.title || video_id),
          body: `Your HeyGen video has been generated successfully.\n\nTitle: ${job.title}\nVideo ID: ${video_id}\nDownload URL: ${url}\nShare URL: ${video_share_page_url || 'N/A'}\n\nReview it in the Production Tracker at /admin/production-tracker.`
        });

        return Response.json({ status: 'success', message: 'Video completed and job updated.' });
      }

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
      const errorMsg = typeof failure_message === 'string' ? failure_message
        : typeof failure === 'string' ? failure
        : JSON.stringify(failure || failure_message) || 'Unknown error';

      const jobs = await base44.asServiceRole.entities.ContentProductionJob.filter({
        callback_id: callback_id || video_id
      });

      if (jobs.length > 0) {
        const job = jobs[0];
        await base44.asServiceRole.entities.ContentProductionJob.update(job.id, {
          status: 'failed',
          error_message: errorMsg.slice(0, 2000),
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

    // ─── HANDLE photo avatar events ──────────────────────────────────────────
    if (eventType === 'photo_avatar_train.success' || eventType === 'photo_avatar_train.fail' ||
        eventType === 'photo_avatar_generation.success' || eventType === 'photo_avatar_generation.fail' ||
        eventType === 'instant_avatar.success' || eventType === 'instant_avatar.fail') {
      const isFail = eventType.includes('.fail');
      const { avatar_id, photo_avatar_id, callback_id } = eventData;
      const avatarId = avatar_id || photo_avatar_id;

      // Find the production job tracking this avatar
      const jobs = await base44.asServiceRole.entities.ContentProductionJob.filter({
        heygen_avatar_id: avatarId
      });

      if (jobs.length > 0) {
        const job = jobs[0];
        await base44.asServiceRole.entities.ContentProductionJob.update(job.id, {
          status: isFail ? 'failed' : 'completed',
          error_message: isFail ? `Photo avatar training failed: ${eventType}` : null,
          notes: (job.notes || '') + `\n[Avatar Event ${new Date().toISOString()}] ${eventType} — avatar_id: ${avatarId}`,
        });

        await base44.asServiceRole.integrations.Core.SendEmail({
          to: 'ganozwaye@gmail.com',
          subject: isFail ? 'HeyGen Avatar Training FAILED' : 'HeyGen Avatar Ready! 🎬',
          body: isFail
            ? `Photo avatar training failed.\n\nAvatar ID: ${avatarId}\nEvent: ${eventType}\n\nCheck your HeyGen dashboard for details.`
            : `Your HeyGen photo avatar is ready!\n\nAvatar ID: ${avatarId}\n\nYou can now use this avatar ID in video generation scripts. Review it in the Production Tracker at /admin/production-tracker.`
        });
      }

      return Response.json({ status: 'success', message: `Photo avatar event ${eventType} processed.` });
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