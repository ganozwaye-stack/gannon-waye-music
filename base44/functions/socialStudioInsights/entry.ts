// Lightweight analytics for the Social Studio's connected channels.
// Instagram: account profile counts plus per-media engagement via the
// instagram_business_basic scope. Facebook Pages: page follower counts from
// the read-only pages scopes. Returns only what the provider actually
// reports, so nothing is invented.
import { createClientFromRequest } from 'npm:@base44/sdk@0.8.54';

async function getJson(url) {
  const res = await fetch(url, { signal: AbortSignal.timeout(15000) });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error((data && data.error && data.error.message) || `API error ${res.status}`);
  return data;
}

export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });
    if (user.role !== 'admin') return Response.json({ error: 'Forbidden' }, { status: 403 });
    const body = await req.json().catch(() => ({}));
    const channel = body.channel || 'instagram';

    if (channel === 'facebook_pages') {
      const { accessToken } = await base44.asServiceRole.connectors.getConnection('facebook_pages');
      const data = await getJson(`https://graph.facebook.com/v25.0/me/accounts?fields=id,name,fan_count,followers_count&access_token=${accessToken}`);
      return Response.json({ channel, pages: Array.isArray(data.data) ? data.data : [] });
    }

    const { accessToken } = await base44.asServiceRole.connectors.getConnection('instagram');
    const me = await getJson(`https://graph.instagram.com/v23.0/me?fields=id,username,followers_count,follows_count,media_count,profile_picture_url&access_token=${accessToken}`);
    const media = await getJson(`https://graph.instagram.com/v23.0/${me.id}/media?fields=id,caption,media_type,permalink,timestamp,like_count,comments_count&limit=12&access_token=${accessToken}`);
    return Response.json({
      channel: 'instagram',
      account: me,
      media: Array.isArray(media.data) ? media.data : [],
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}