// dailyContentPublisher — the only daily Instagram publisher.
//
// Guardrails, in order:
//  1. It publishes from ONE approved SocialPost record and nothing else. No copy
//     is ever composed or improvised here: if no approved record exists, nothing
//     is published.
//  2. A record missing caption, call_to_action, hashtags or media_url is skipped
//     whole ("incomplete record") — no partial posts.
//  3. The caption itself must carry a clear call to action and "gannonwaye.com",
//     otherwise the post is skipped and the reason is logged.
//  4. A confirmed publish is written back to the same record (posted_at,
//     status "posted", Instagram media id, permalink) so every post is traceable.
//  5. Any error raises an AdminNotification and is never retried automatically.
//  6. The caller always receives { published, mediaId, permalink, skippedReason, error }.
import { createClientFromRequest } from 'npm:@base44/sdk@0.8.54';

const IG_API = 'https://graph.instagram.com/v23.0';

// A clear call to action, in plain words, that must already appear in the caption.
const CTA_PATTERN = /\b(listen|stream|pre-?save|buy|shop|order|get|grab|visit|follow|share|watch|download|join|tap|comment|link in bio)\b/i;

const REQUIRED_FIELDS = ['caption', 'call_to_action', 'hashtags', 'media_url'];

async function igGet(token: string, path: string, params: Record<string, string> = {}) {
  const url = new URL(`${IG_API}/${path}`);
  url.searchParams.set('access_token', token);
  for (const [key, value] of Object.entries(params)) url.searchParams.set(key, String(value));
  const res = await fetch(url.toString(), { signal: AbortSignal.timeout(15000) });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error((data && data.error && data.error.message) || `Instagram API error ${res.status}`);
  return data;
}

async function igPost(token: string, path: string, body: Record<string, string>) {
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

async function waitForContainer(token: string, containerId: string) {
  for (let attempt = 0; attempt < 8; attempt += 1) {
    const state = await igGet(token, containerId, { fields: 'status_code,status' });
    if (state.status_code === 'FINISHED') return;
    if (state.status_code === 'ERROR') throw new Error(state.status || 'Instagram rejected the media');
    await new Promise((resolve) => setTimeout(resolve, 5000));
  }
  throw new Error('Instagram is still processing the media, so the post was not confirmed.');
}

async function publishToInstagram(record: Record<string, unknown>, accessToken: string) {
  const caption = [record.caption, record.hashtags].filter((part) => String(part || '').trim()).join('\n\n');
  const mediaUrl = String(record.media_url);
  const mediaType = String(record.media_type || 'image');
  const account = await igGet(accessToken, 'me', { fields: 'id' });

  let params: Record<string, string>;
  if (mediaType === 'reel') params = { media_type: 'REELS', video_url: mediaUrl, caption };
  else if (mediaType === 'story') params = { media_type: 'STORIES', image_url: mediaUrl };
  else params = { image_url: mediaUrl, caption };

  const container = await igPost(accessToken, `${account.id}/media`, params);
  await waitForContainer(accessToken, container.id);
  const published = await igPost(accessToken, `${account.id}/media_publish`, { creation_id: container.id });

  let permalink = '';
  try {
    permalink = (await igGet(accessToken, published.id, { fields: 'permalink' })).permalink || '';
  } catch {
    permalink = '';
  }
  return { mediaId: String(published.id), permalink };
}

export default async function (req: Request) {
  const result = { published: false, mediaId: '', permalink: '', skippedReason: '', error: '' };
  let base44: ReturnType<typeof createClientFromRequest> | null = null;

  try {
    base44 = createClientFromRequest(req);

    // Admins only when a person calls it; the daily scheduled run carries no user token.
    const user = await base44.auth.me().catch((error) => (error.status === 401 ? null : Promise.reject(error)));
    if (user && user.role !== 'admin') {
      return Response.json({ ...result, error: 'Forbidden' }, { status: 403 });
    }

    const api = base44.asServiceRole.entities;

    // 1. One approved record is the only source of truth.
    const page = await api.SocialPost.filter({ status: 'approved' }, '-created_date', 1);
    const record = (Array.isArray(page) ? page : page?.items || [])[0];
    if (!record) {
      result.skippedReason = 'no approved record';
      console.log('dailyContentPublisher skipped: no SocialPost record with status "approved". Nothing published.');
      return Response.json(result);
    }

    // 2. Never publish a partially written record.
    const missing = REQUIRED_FIELDS.filter((field) => !String(record[field] ?? '').trim());
    if (missing.length > 0) {
      result.skippedReason = 'incomplete record';
      console.log(`dailyContentPublisher skipped ${record.id} (incomplete record): missing ${missing.join(', ')}. Nothing published.`);
      return Response.json(result);
    }

    // 3. The approved caption must itself carry the call to action and the site.
    const caption = String(record.caption);
    const hasCallToAction = CTA_PATTERN.test(caption);
    const hasSite = caption.toLowerCase().includes('gannonwaye.com');
    if (!hasCallToAction || !hasSite) {
      const reasons = [];
      if (!hasCallToAction) reasons.push('no clear call to action in the caption');
      if (!hasSite) reasons.push('caption does not contain "gannonwaye.com"');
      result.skippedReason = reasons.join('; ');
      console.log(`dailyContentPublisher skipped ${record.id}: ${result.skippedReason}. Nothing published.`);
      return Response.json(result);
    }

    const { accessToken } = await base44.asServiceRole.connectors.getConnection('instagram');
    const { mediaId, permalink } = await publishToInstagram(record, accessToken);

    // 4. Write the publish back to the same record so the post is traceable.
    await api.SocialPost.update(record.id, {
      status: 'posted',
      posted_at: new Date().toISOString(),
      instagram_media_id: mediaId,
      permalink,
    });

    result.published = true;
    result.mediaId = mediaId;
    result.permalink = permalink;
    console.log(`dailyContentPublisher published ${record.id} as Instagram media ${mediaId} (${permalink || 'no permalink returned'}).`);
    return Response.json(result);
  } catch (error) {
    // 5. Log the failure for the owner and stop. Nothing is retried here.
    result.error = (error && error.message) || 'Unknown error';
    console.log(`dailyContentPublisher failed: ${result.error}`);
    try {
      if (base44) {
        await base44.asServiceRole.entities.AdminNotification.create({
          notification_type: 'automation_failed',
          severity: 'high',
          title: 'Daily Instagram publish failed',
          summary: result.error,
          source: 'dailyContentPublisher',
          requires_action: true,
          linked_route: '/admin/social-studio',
          is_read: false,
        });
      }
    } catch (notifyError) {
      console.log(`dailyContentPublisher could not raise an AdminNotification: ${(notifyError && notifyError.message) || notifyError}`);
    }
    return Response.json(result);
  }
}