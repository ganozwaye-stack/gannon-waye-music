import { createClientFromRequest } from 'npm:@base44/sdk@0.8.38';

const HEYGEN_API_BASE = 'https://api.heygen.com';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const { script, avatar_id, voice_id, topic, related_release, dimension } = body;

    if (!script && !topic) return Response.json({ error: 'script or topic is required' }, { status: 400 });

    // If topic provided but no script, generate a script using InvokeLLM
    let finalScript = script;
    if (!script && topic) {
      const scriptResult = await base44.integrations.Core.InvokeLLM({
        prompt: `Write a 30-60 second video script for a social media video for independent music artist Gannon Waye.
Topic: ${topic}
${related_release ? `Related release: ${related_release}` : ''}

Rules:
- Conversational, authentic, warm tone
- Hook in the first 3 seconds
- Clear call-to-action at the end
- 60-90 words max (30-60 seconds spoken)
- No stage directions, just the spoken words

Return only the script text.`,
      });
      finalScript = typeof scriptResult === 'string' ? scriptResult : scriptResult?.content || String(scriptResult);
    }

    const apiKey = Deno.env.get('HEYGEN_API_KEY');
    if (!apiKey) return Response.json({ error: 'HEYGEN_API_KEY not set' }, { status: 500 });

    // Default avatar and voice if not provided
    const finalAvatarId = avatar_id || 'Anna_public_3_9d8e6e066f'; // Default public avatar
    const finalVoiceId = voice_id || '0776d3e0d0e04776926ab1b1893975c1'; // Default natural voice

    // Create video via HeyGen API
    const videoResponse = await fetch(`${HEYGEN_API_BASE}/v2/video/generate`, {
      method: 'POST',
      headers: {
        'X-Api-Key': apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        video_inputs: [{
          character: {
            type: 'avatar',
            avatar_id: finalAvatarId,
            avatar_style: 'normal',
          },
          voice: {
            type: 'text',
            input_text: finalScript,
            voice_id: finalVoiceId,
          },
          background: {
            type: 'color',
            value: '#000000',
          },
        }],
        dimension: dimension || { width: 1080, height: 1920 },
        test: false,
      }),
    });

    if (!videoResponse.ok) {
      const errorText = await videoResponse.text();
      return Response.json({ error: `HeyGen API error: ${errorText}` }, { status: 502 });
    }

    const videoData = await videoResponse.json();

    // Save to SocialVideo entity for tracking
    let socialVideo = null;
    try {
      socialVideo = await base44.entities.SocialVideo.create({
        title: `${topic || 'HeyGen Video'} — ${new Date().toLocaleDateString('en-AU')}`,
        description: finalScript,
        status: 'generating',
        related_release: related_release || null,
        notes: `HeyGen video_id: ${videoData.data?.video_id}`,
        sort_order: 0,
      });
    } catch (e) {
      // SocialVideo entity may not have a status field — try without
      try {
        socialVideo = await base44.entities.SocialVideo.create({
          title: `${topic || 'HeyGen Video'} — ${new Date().toLocaleDateString('en-AU')}`,
          description: finalScript,
          notes: `HeyGen video_id: ${videoData.data?.video_id}`,
          sort_order: 0,
        });
      } catch (e2) {
        // Entity might not exist — continue without saving
      }
    }

    return Response.json({
      status: 'success',
      video_id: videoData.data?.video_id,
      script: finalScript,
      social_video_id: socialVideo?.id,
      message: 'Video generation started. You will be notified when it is ready.',
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});