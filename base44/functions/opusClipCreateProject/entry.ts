import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';
import { secrets } from 'base44:runtime';

// Submit a source video to Opus Clip to start a clipping project.
// Payload: { sourceVideoId, videoUrl, topicKeywords }
export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user || user.role !== 'admin') return Response.json({ error: 'Admin only' }, { status: 403 });

    const body = await req.json();
    const { sourceVideoId, videoUrl, topicKeywords } = body || {};
    if (!videoUrl) return Response.json({ error: 'videoUrl required' }, { status: 400 });

    const apiKey = secrets.get('OPUS_CLIP_API_KEY');
    if (!apiKey) return Response.json({ error: 'OPUS_CLIP_API_KEY not set' }, { status: 500 });

    const curationPref = { clipDurations: [[0, 90]], genre: 'Auto' };
    if (Array.isArray(topicKeywords) && topicKeywords.length) curationPref.topicKeywords = topicKeywords;

    const res = await fetch('https://api.opus.pro/api/clip-projects', {
      method: 'POST',
      headers: { 'Authorization': 'Bearer ' + apiKey, 'Content-Type': 'application/json' },
      body: JSON.stringify({ videoUrl, curationPref })
    });
    const data = await res.json();
    if (!res.ok) return Response.json({ error: 'Opus Clip error', details: data }, { status: 502 });

    const projectId = data.id || data.projectId || data.project_id;
    if (sourceVideoId && projectId) {
      await base44.asServiceRole.entities.SourceVideo.update(sourceVideoId, { opus_project_id: projectId, status: 'submitted' });
    }
    return Response.json({ projectId, raw: data });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}