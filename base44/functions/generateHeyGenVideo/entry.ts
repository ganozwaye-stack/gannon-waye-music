import { createClientFromRequest } from 'npm:@base44/sdk@0.8.38';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const { script, title, avatar_id, voice_id, resolution, aspect_ratio, engine, related_release, related_content_item_id, agent_generated_by, callback_id } = body;

    if (!script) return Response.json({ error: 'script is required' }, { status: 400 });
    if (!avatar_id) return Response.json({ error: 'avatar_id is required — pass a HeyGen Digital Twin look ID' }, { status: 400 });
    if (!voice_id) return Response.json({ error: 'voice_id is required — pass a HeyGen voice ID' }, { status: 400 });

    const apiKey = Deno.env.get('HEYGEN_API_KEY');
    if (!apiKey) return Response.json({ error: 'HEYGEN_API_KEY secret is not set' }, { status: 500 });

    // ─── CREATE PRODUCTION JOB RECORD ────────────────────────────────────────
    const finalCallbackId = callback_id || `gw_${Date.now()}`;
    const finalEngine = engine || 'avatar_iv';
    const finalResolution = resolution || '1080p';
    const finalAspectRatio = aspect_ratio || '9:16';

    const job = await base44.entities.ContentProductionJob.create({
      title: title || `HeyGen Video — ${script.slice(0, 50)}`,
      description: `AI avatar video generated via HeyGen ${finalEngine} engine`,
      job_type: 'heygen_video',
      status: 'queued',
      script,
      heygen_avatar_id: avatar_id,
      heygen_voice_id: voice_id,
      heygen_engine: finalEngine,
      resolution: finalResolution,
      aspect_ratio: finalAspectRatio,
      related_release: related_release || null,
      related_content_item_id: related_content_item_id || null,
      agent_generated_by: agent_generated_by || null,
      agent_generated: !!agent_generated_by,
      callback_id: finalCallbackId,
      platform_target: 'instagram',
      approval_status: 'needs_review',
      sort_order: 0,
    });

    // ─── CALL HEYGEN API TO CREATE VIDEO ────────────────────────────────────
    const webhookUrl = `https://api.base44.app/api/v2/apps/${Deno.env.get('BASE44_APP_ID')}/webhook/heygen`;

    const heygenBody = {
      type: 'avatar',
      avatar_id: avatar_id,
      script: script,
      voice_id: voice_id,
      title: title || `GW Video ${finalCallbackId}`,
      resolution: finalResolution,
      aspect_ratio: finalAspectRatio,
      engine: { type: finalEngine },
      callback_url: webhookUrl,
      callback_id: finalCallbackId,
    };

    const heygenResponse = await fetch('https://api.heygen.com/v3/videos', {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(heygenBody),
    });

    const heygenData = await heygenResponse.json();

    if (!heygenResponse.ok) {
      // Update job to failed
      const errorMsg = typeof heygenData?.message === 'string' ? heygenData.message
        : typeof heygenData?.error === 'string' ? heygenData.error
        : JSON.stringify(heygenData?.error || heygenData) || 'HeyGen API error';
      await base44.entities.ContentProductionJob.update(job.id, {
        status: 'failed',
        error_message: errorMsg.slice(0, 2000),
      });

      return Response.json({
        status: 'error',
        error: errorMsg,
        heygen_response: heygenData,
        job_id: job.id,
      }, { status: 502 });
    }

    const heygenVideoId = heygenData?.data?.video_id;

    // ─── UPDATE JOB WITH HEYGEN VIDEO ID ─────────────────────────────────────
    await base44.entities.ContentProductionJob.update(job.id, {
      status: 'processing',
      heygen_video_id: heygenVideoId,
    });

    return Response.json({
      status: 'success',
      message: 'HeyGen video generation started. You will receive a webhook callback when it is ready.',
      job_id: job.id,
      heygen_video_id: heygenVideoId,
      callback_id: finalCallbackId,
      webhook_url: webhookUrl,
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});