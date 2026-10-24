// Social Studio publisher: real Instagram publishing through the authorized
// Instagram Business connector. A post is only ever marked published after
// Instagram's media_publish returns a media id. Every other channel is
// recorded as skipped (channel_not_connected) with no fake publishing.
import { createClientFromRequest } from 'npm:@base44/sdk@0.8.54';

const IG_API = 'https://graph.instagram.com/v23.0';

async function igGet(token, path, params = {}) {
  const url = new URL(`${IG_API}/${path}`);
  url.searchParams.set('access_token', token);
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, String(v));
  const res = await fetch(url, { signal: AbortSignal.timeout(15000) });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error((data && data.error && data.error.message) || `Instagram API error ${res.status}`);
  return data;
}

async function igPost(token, path, body) {
  const form = new URLSearchParams({ access_token: token, ...body });
  const res = await fetch(`${IG_API}/${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: form,
    signal: AbortSignal.timeout(30000),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error((data && data.error && data.error.message) || `Instagram API error ${res.status}`);
  return data;
}

async function pollContainer(token, containerId) {
  for (let i = 0; i < 9; i++) {
    const st = await igGet(token, containerId, { fields: 'status_code,status' });
    if (st.status_code === 'FINISHED') return { finished: true };
    if (st.status_code === 'ERROR') throw new Error(st.status || 'Instagram rejected the media');
    await new Promise((resolve) => setTimeout(resolve, 5000));
  }
  return { finished: false };
}

async function publishInstagram(post, token) {
  const me = await igGet(token, 'me', { fields: 'id,username' });
  const mediaUrl = (post.media_urls || []).filter(Boolean)[0];
  if (!mediaUrl) throw new Error('No media attached. Instagram needs an image or video from the asset library.');
  const caption = [post.caption || '', post.hashtags || ''].filter((s) => s.trim()).join('\n\n');
  let params;
  if (post.post_type === 'reel' || post.post_type === 'video') params = { media_type: 'REELS', video_url: mediaUrl, caption };
  else if (post.post_type === 'story') params = { media_type: 'STORIES', image_url: mediaUrl };
  else params = { image_url: mediaUrl, caption };
  const container = await igPost(token, `${me.id}/media`, params);
  const poll = await pollContainer(token, container.id);
  if (!poll.finished) {
    return { platform: 'instagram', status: 'processing', provider_ref: container.id, attempted_at: new Date().toISOString(), note: 'Instagram is still processing the media. Use Check status to finish.' };
  }
  const published = await igPost(token, `${me.id}/media_publish`, { creation_id: container.id });
  let permalink = '';
  try { permalink = (await igGet(token, published.id, { fields: 'permalink' })).permalink || ''; } catch {}
  return { platform: 'instagram', status: 'published', provider_ref: published.id, permalink, attempted_at: new Date().toISOString() };
}

async function checkInstagram(entry, token) {
  const me = await igGet(token, 'me', { fields: 'id' });
  const poll = await pollContainer(token, entry.provider_ref);
  if (!poll.finished) return { ...entry, status: 'processing', attempted_at: new Date().toISOString() };
  const published = await igPost(token, `${me.id}/media_publish`, { creation_id: entry.provider_ref });
  let permalink = '';
  try { permalink = (await igGet(token, published.id, { fields: 'permalink' })).permalink || ''; } catch {}
  return { ...entry, status: 'published', provider_ref: published.id, permalink, attempted_at: new Date().toISOString() };
}

async function publishPost(base44, post, recheck) {
  const api = base44.asServiceRole.entities;
  const { accessToken } = await base44.asServiceRole.connectors.getConnection('instagram');
  const previous = Array.isArray(post.publish_results) ? post.publish_results : [];
  const igPrev = previous.find((r) => r.platform === 'instagram');

  let igResult;
  if (recheck === true && igPrev && igPrev.status === 'processing' && igPrev.provider_ref) {
    try { igResult = await checkInstagram(igPrev, accessToken); }
    catch (error) { igResult = { ...igPrev, status: 'failed', error: error.message, attempted_at: new Date().toISOString() }; }
  } else if (igPrev && igPrev.status === 'published') {
    igResult = igPrev;
  } else {
    try { igResult = await publishInstagram(post, accessToken); }
    catch (error) { igResult = { platform: 'instagram', status: 'failed', error: error.message, attempted_at: new Date().toISOString() }; }
  }
  const results = [igResult];

  for (const platform of post.platforms || []) {
    if (platform === 'instagram') continue;
    if (!results.find((r) => r.platform === platform)) {
      results.push({ platform, status: 'skipped', note: 'channel_not_connected', attempted_at: new Date().toISOString() });
    }
  }
  for (const r of previous) {
    if (!results.find((n) => n.platform === r.platform)) results.push(r);
  }

  const igStatus = igResult.status;
  const newStatus = igStatus === 'published' ? 'published' : igStatus === 'processing' ? 'processing' : 'failed';
  await api.SocialStudioPost.update(post.id, { status: newStatus, publish_results: results });

  const eventType = igStatus === 'published' ? 'publish_success' : igStatus === 'processing' ? 'publish_attempt' : 'publish_failure';
  await api.SocialStudioEvent.create({
    event_type: eventType,
    platform: 'instagram',
    author_name: 'Social Studio',
    content: `${igStatus === 'published' ? 'Published' : igStatus === 'processing' ? 'Processing' : 'Failed'}: ${post.title}`,
    related_post_id: post.id,
    permalink: igResult.permalink || '',
    occurred_at: new Date().toISOString(),
    external_id: `publish_${post.id}_${Date.now()}`,
    status: 'read',
  });

  return { status: newStatus, instagram: igResult, results };
}

export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });
    if (user.role !== 'admin') return Response.json({ error: 'Forbidden' }, { status: 403 });
    const api = base44.asServiceRole.entities;
    const body = await req.json().catch(() => ({}));
    const action = body.action || 'publish';

    if (action === 'run') {
      // Scheduled pickup: approved posts whose scheduled time has arrived.
      const now = new Date().toISOString();
      const page = await api.SocialStudioPost.filter({ status: 'scheduled', approval_status: 'approved' }, '-scheduled_at', 20);
      const items = (page && page.items) || page || [];
      const due = items.filter((p) => p.scheduled_at && p.scheduled_at <= now && (p.platforms || []).includes('instagram')).slice(0, 3);
      const results = [];
      for (const p of due) {
        const r = await publishPost(base44, p, false);
        results.push({ post_id: p.id, title: p.title, status: r.status });
      }
      return Response.json({ ok: true, mode: 'run', published: results.length, results });
    }

    if (!body.post_id) return Response.json({ error: 'post_id required' }, { status: 400 });
    const post = await api.SocialStudioPost.get(body.post_id);
    if (!post) return Response.json({ error: 'Post not found' }, { status: 404 });
    if (post.approval_status !== 'approved') {
      return Response.json({ error: 'Post must be approved before publishing. Approve it first.' }, { status: 400 });
    }
    if ((post.platforms || []).length === 0) {
      return Response.json({ error: 'Select at least one platform first.' }, { status: 400 });
    }
    const result = await publishPost(base44, post, body.recheck === true);
    return Response.json({ ok: true, post_id: post.id, ...result });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}