import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';

// Publish an approved ReelClip to its selected platforms.
// Nothing posts unless the clip approval_status is 'approved'.
// Payload: { reelClipId }
export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user || user.role !== 'admin') return Response.json({ error: 'Admin only' }, { status: 403 });

    const body = await req.json();
    const { reelClipId } = body || {};
    if (!reelClipId) return Response.json({ error: 'reelClipId required' }, { status: 400 });

    const clip = await base44.asServiceRole.entities.ReelClip.get(reelClipId);
    if (!clip) return Response.json({ error: 'Clip not found' }, { status: 404 });
    if (clip.approval_status !== 'approved') return Response.json({ error: 'Clip must be approved before posting' }, { status: 400 });

    const tags = (clip.hashtags || []).map((h) => (h.startsWith('#') ? h : '#' + h)).join(' ');
    const caption = [clip.hook, clip.caption, tags].filter(Boolean).join('\n\n');
    const targets = clip.platform_targets || [];

    await base44.asServiceRole.entities.ReelClip.update(reelClipId, { post_status: 'posting' });

    const log = {};
    let okCount = 0, failCount = 0;

    for (const t of targets) {
      try {
        if (t === 'instagram_reels') {
          const r = await base44.asServiceRole.functions.invoke('postReelToInstagram', {
            video_url: clip.clip_video_url, caption, cover_image_url: clip.cover_image_url
          });
          log.instagram_reels = { ok: true, data: r.data };
          okCount++;
        } else if (t === 'tiktok') {
          const r = await base44.asServiceRole.functions.invoke('tiktokUploadDraft', {
            video_url: clip.clip_video_url, caption, privacy_level: 'SELF_ONLY'
          });
          log.tiktok = { ok: true, data: r.data };
          okCount++;
        } else {
          log[t] = { ok: false, reason: 'Connector not configured yet' };
          failCount++;
        }
      } catch (e) {
        log[t] = { ok: false, error: e.message };
        failCount++;
      }
    }

    const postStatus = okCount > 0 && failCount === 0 ? 'posted' : okCount > 0 ? 'partial' : 'failed';
    await base44.asServiceRole.entities.ReelClip.update(reelClipId, { post_status: postStatus, post_log: JSON.stringify(log) });
    return Response.json({ postStatus, log });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}