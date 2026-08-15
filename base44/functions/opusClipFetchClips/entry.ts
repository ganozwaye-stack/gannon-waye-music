import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';
import { secrets } from 'base44:runtime';

// Fetch scored clips for an Opus Clip project, save each as a ReelClip
// (needs_review), and generate a hook + hashtags + first-comment CTA via LLM.
// Payload: { sourceVideoId, projectId }
export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user || user.role !== 'admin') return Response.json({ error: 'Admin only' }, { status: 403 });

    const body = await req.json();
    const { sourceVideoId, projectId } = body || {};
    if (!projectId) return Response.json({ error: 'projectId required' }, { status: 400 });

    const apiKey = secrets.get('OPUS_CLIP_API_KEY');
    if (!apiKey) return Response.json({ error: 'OPUS_CLIP_API_KEY not set' }, { status: 500 });

    const url = 'https://api.opus.pro/api/exportable-clips?q=findByProjectId&projectId=' + encodeURIComponent(projectId);
    const res = await fetch(url, {
      method: 'GET',
      headers: { 'Authorization': 'Bearer ' + apiKey, 'Content-Type': 'application/json' }
    });
    const data = await res.json();
    if (!res.ok) return Response.json({ error: 'Opus Clip fetch error', details: data }, { status: 502 });

    const clips = Array.isArray(data.clips) ? data.clips
      : Array.isArray(data) ? data
      : (Array.isArray(data.data) ? data.data : []);

    let sourceTitle = '';
    if (sourceVideoId) {
      try {
        const sv = await base44.asServiceRole.entities.SourceVideo.get(sourceVideoId);
        if (sv) sourceTitle = sv.title || '';
      } catch (_) {}
    }

    let created = 0;
    for (const clip of clips) {
      const clipUrl = clip.videoUrl || clip.video_url || clip.exportUrl || clip.url;
      if (!clipUrl) continue;
      const score = clip.viralityScore ?? clip.virality_score ?? clip.score ?? 0;
      const opusClipId = clip.id || clip.clipId || '';

      let captionData = {};
      try {
        const llm = await base44.asServiceRole.integrations.Core.InvokeLLM({
          prompt: 'Write a viral short-form reel caption for a clip from a singer-songwriter who writes about grief, healing, self-respect, and rebuilding after abuse. Return JSON with: hook (one punchy first line, max 12 words), caption (2 to 3 warm, human sentences, no em dashes), hashtags (array of 8 to 12 tags including #GannonWaye #YouAreNotAlone #SurvivorSupport #HealingJourney), first_comment (one sentence that sparks a conversation and a call to action supporting people who are experiencing abuse, healing from it, or supporting someone who is, pointing to community and 1800RESPECT).',
          response_json_schema: {
            type: 'object',
            properties: {
              hook: { type: 'string' },
              caption: { type: 'string' },
              hashtags: { type: 'array', items: { type: 'string' } },
              first_comment: { type: 'string' }
            }
          }
        });
        captionData = llm || {};
      } catch (_) {}

      const reel = await base44.asServiceRole.entities.ReelClip.create({
        source_video_id: sourceVideoId || '',
        source_video_title: sourceTitle,
        clip_video_url: clipUrl,
        opus_clip_id: opusClipId,
        virality_score: Number(score) || 0,
        hook: captionData.hook || '',
        caption: captionData.caption || '',
        hashtags: captionData.hashtags || [],
        first_comment: captionData.first_comment || '',
        music_volume_percent: 2,
        platform_targets: ['instagram_reels', 'facebook_reels', 'youtube_shorts', 'tiktok'],
        approval_status: 'needs_review',
        post_status: 'not_posted'
      });
      created++;
      // Send every generated reel to the admin dashboard for personal review before it can touch social media.
      try {
        await base44.asServiceRole.entities.AdminNotification.create({
          notification_type: 'approval',
          severity: (Number(score) || 0) >= 70 ? 'high' : 'info',
          title: `New reel ready for review${sourceTitle ? ': ' + sourceTitle : ''}`,
          summary: captionData.hook
            ? captionData.hook
            : `Virality ${Number(score) || 0}/100 — awaiting your approval before posting.`,
          source: 'Opus Clip',
          requires_action: true,
          linked_entity: 'ReelClip',
          linked_id: reel.id,
          linked_route: '/admin/reel-factory'
        });
      } catch (_) {}
    }

    if (sourceVideoId) {
      await base44.asServiceRole.entities.SourceVideo.update(sourceVideoId, { status: created > 0 ? 'processed' : 'processing' });
    }
    return Response.json({ created, total: clips.length });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}