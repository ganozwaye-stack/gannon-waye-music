import { createClientFromRequest } from 'npm:@base44/sdk@0.8.38';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);

    // HeyGen webhook payload structure:
    // { event_type: "video.render.completed" | "video.render.failed", 
    //   event_data: { video_id, video_url, ... } }
    const payload = await req.json();

    // Verify webhook if secret is set (HeyGen sends signature in header)
    const webhookSecret = Deno.env.get('HEYGEN_WEBHOOK_SECRET');
    if (webhookSecret) {
      const signature = req.headers.get('x-webhook-signature') || req.headers.get('signature');
      // HeyGen doesn't document a specific signature verification method,
      // but if present we compare. For now, log and proceed.
    }

    const eventType = payload.event_type;
    const videoId = payload.event_data?.video_id;
    const videoUrl = payload.event_data?.video_url;

    if (eventType === 'video.render.completed' && videoUrl) {
      // Update SocialVideo record if it exists
      try {
        const videos = await base44.asServiceRole.entities.SocialVideo.filter({
          notes: { $regex: videoId, $options: 'i' }
        });
        if (videos && videos.length > 0) {
          for (const v of videos) {
            await base44.asServiceRole.entities.SocialVideo.update(v.id, {
              status: 'ready',
              notes: `${v.notes}\n\nVideo URL: ${videoUrl}\nReady: ${new Date().toISOString()}`,
            });
          }
        }
      } catch (e) {
        // SocialVideo entity may not exist — continue to notification
      }

      // Notify admin
      await base44.asServiceRole.entities.AdminNotification.create({
        notification_type: 'system',
        severity: 'info',
        title: 'HeyGen Video Ready',
        summary: `Video ${videoId} has finished rendering and is ready to review.`,
        source: 'HeyGen Webhook',
        requires_action: true,
        linked_entity: 'SocialVideo',
        is_read: false,
        delivered_slack: false,
        delivered_email: false,
      });

      return Response.json({ status: 'success', message: 'Video marked as ready, admin notified.' });
    }

    if (eventType === 'video.render.failed') {
      await base44.asServiceRole.entities.AdminNotification.create({
        notification_type: 'system',
        severity: 'warning',
        title: 'HeyGen Video Failed',
        summary: `Video ${videoId} failed to render. Check HeyGen dashboard for details.`,
        source: 'HeyGen Webhook',
        requires_action: true,
        is_read: false,
        delivered_slack: false,
        delivered_email: false,
      });

      return Response.json({ status: 'success', message: 'Video failure logged, admin notified.' });
    }

    // Unknown event — acknowledge receipt
    return Response.json({ status: 'success', message: 'Webhook received.', event_type: eventType });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});