import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

// Auto-post new release artwork + store link to social media
// when a Release is marked published in the dashboard.
// Triggered by an entity automation on Release update.
// Posts the cover artwork to the connected Instagram Business account
// with a caption linking the release page and store. The function guards
// so it only fires the first time is_published flips to true.

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);

    const body = await req.json();
    const release = body.data;
    const oldData = body.old_data;

    // Only fire when is_published flips to true
    if (!release?.is_published || oldData?.is_published === true) {
      return Response.json({ skipped: true, reason: 'Not a new publish event' });
    }
    if (!release?.artwork_url) {
      return Response.json({ skipped: true, reason: 'No artwork_url — nothing to post' });
    }

    const title = release.title || 'New release';
    const storeLink = 'https://gannonwaye.com/music';
    const releaseLink = release.id ? `https://gannonwaye.com/release/${release.id}` : storeLink;
    const streaming = [
      release.spotify_link ? `Spotify: ${release.spotify_link}` : '',
      release.apple_music_link ? `Apple Music: ${release.apple_music_link}` : '',
      release.youtube_link ? `YouTube: ${release.youtube_link}` : '',
    ].filter(Boolean).join('\n');

    const descSnippet = release.description
      ? release.description.slice(0, 300) + (release.description.length > 300 ? '…' : '') + '\n\n'
      : '';

    const caption = `🎶 NEW RELEASE — "${title}" is out now.\n\n${descSnippet}Listen: ${releaseLink}\nShop the store & support: ${storeLink}\n${streaming ? '\n' + streaming : ''}\n\n#gannonwaye #newrelease #newmusic #independentmusic`;

    // --- Instagram (connected Business account) ---
    const { accessToken } = await base44.asServiceRole.connectors.getConnection('instagram');
    if (!accessToken) return Response.json({ error: 'Instagram not connected' }, { status: 400 });

    const meRes = await fetch(`https://graph.instagram.com/me?fields=id,username&access_token=${accessToken}`);
    const meData = await meRes.json();
    if (!meData.id) return Response.json({ error: 'Failed to get Instagram user ID', details: meData }, { status: 500 });
    const igUserId = meData.id;

    // Step 1: create media container
    const createRes = await fetch(`https://graph.instagram.com/${igUserId}/media`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ image_url: release.artwork_url, caption, access_token: accessToken }),
    });
    const createData = await createRes.json();
    if (!createData.id) return Response.json({ error: 'Failed to create Instagram media container', details: createData }, { status: 500 });
    const creationId = createData.id;

    // Step 2: publish
    const publishRes = await fetch(`https://graph.instagram.com/${igUserId}/media_publish`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ creation_id: creationId, access_token: accessToken }),
    });
    const publishData = await publishRes.json();
    if (!publishData.id) return Response.json({ error: 'Failed to publish Instagram media', details: publishData }, { status: 500 });

    return Response.json({ ok: true, title, media_id: publishData.id, posted: 'instagram' });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});