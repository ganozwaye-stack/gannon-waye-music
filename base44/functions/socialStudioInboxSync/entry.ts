// Pulls recent comments on the connected Instagram account into the Social
// Studio unified inbox (SocialStudioEvent), deduplicated by provider id.
// Read-only: uses the instagram_business_basic scope. Direct messages need a
// messaging scope that is not authorized, so the inbox records comments only.
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

export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });
    if (user.role !== 'admin') return Response.json({ error: 'Forbidden' }, { status: 403 });
    const api = base44.asServiceRole.entities;
    const { accessToken } = await base44.asServiceRole.connectors.getConnection('instagram');
    const me = await igGet(accessToken, 'me', { fields: 'id,username' });
    const media = await igGet(accessToken, `${me.id}/media`, { fields: 'id,permalink,timestamp', limit: 12 });
    const mediaList = Array.isArray(media.data) ? media.data : [];
    const commentGroups = await Promise.allSettled(
      mediaList.map((m) => igGet(accessToken, `${m.id}/comments`, { fields: 'id,text,username,timestamp', limit: 50 }))
    );
    const events = [];
    for (let i = 0; i < commentGroups.length; i++) {
      const group = commentGroups[i];
      if (group.status !== 'fulfilled' || !Array.isArray(group.value.data)) continue;
      for (const c of group.value.data) {
        events.push({
          event_type: 'comment',
          platform: 'instagram',
          author_name: c.username || 'unknown',
          content: c.text || '',
          external_id: c.id,
          permalink: (mediaList[i] && mediaList[i].permalink) || '',
          occurred_at: c.timestamp || '',
          status: 'new',
        });
      }
    }
    let created = 0;
    for (const ev of events) {
      const existing = await api.SocialStudioEvent.filter({ external_id: ev.external_id, platform: 'instagram' }, { limit: 1 });
      const rows = (existing && existing.items) || existing || [];
      if (rows.length === 0) {
        await api.SocialStudioEvent.create(ev);
        created++;
      }
    }
    return Response.json({ ok: true, account: me.username, comments_seen: events.length, new_events: created });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}