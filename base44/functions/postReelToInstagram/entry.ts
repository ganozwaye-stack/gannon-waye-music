import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';

// Publish a video as an Instagram Reel via the Graph API.
// Payload: { video_url, caption, cover_image_url }
export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user || user.role !== 'admin') return Response.json({ error: 'Admin only' }, { status: 403 });

    const body = await req.json();
    const { video_url, caption, cover_image_url } = body || {};
    if (!video_url || !caption) return Response.json({ error: 'video_url and caption required' }, { status: 400 });

    const conn = await base44.asServiceRole.connectors.getConnection('instagram');
    const accessToken = conn && conn.accessToken;
    if (!accessToken) return Response.json({ error: 'Instagram not connected' }, { status: 400 });

    const meRes = await fetch('https://graph.instagram.com/me?fields=id&access_token=' + accessToken);
    const meData = await meRes.json();
    if (!meData.id) return Response.json({ error: 'Failed to get Instagram user id', details: meData }, { status: 500 });
    const igUserId = meData.id;

    const createBody = { media_type: 'REELS', video_url, caption, access_token: accessToken };
    if (cover_image_url) createBody.cover_url = cover_image_url;

    const createRes = await fetch('https://graph.instagram.com/' + igUserId + '/media', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(createBody)
    });
    const createData = await createRes.json();
    if (!createData.id) return Response.json({ error: 'Failed to create IG Reels container', details: createData }, { status: 500 });
    const creationId = createData.id;

    let ready = false;
    for (let i = 0; i < 10; i++) {
      await new Promise((r) => setTimeout(r, 4000));
      const st = await fetch('https://graph.instagram.com/' + creationId + '?fields=status_code&access_token=' + accessToken);
      const stData = await st.json();
      if (stData.status_code === 'FINISHED') { ready = true; break; }
      if (stData.status_code === 'ERROR') return Response.json({ error: 'IG Reels processing failed', details: stData }, { status: 500 });
    }
    if (!ready) return Response.json({ error: 'IG Reels processing timed out, retry publish later', creation_id: creationId }, { status: 504 });

    const pubRes = await fetch('https://graph.instagram.com/' + igUserId + '/media_publish', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ creation_id: creationId, access_token: accessToken })
    });
    const pubData = await pubRes.json();
    if (!pubData.id) return Response.json({ error: 'Failed to publish IG Reel', details: pubData }, { status: 500 });

    return Response.json({ success: true, media_id: pubData.id, message: 'Reel published to Instagram.' });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}