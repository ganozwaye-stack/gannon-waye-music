import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });
    if (user.role !== 'admin') return Response.json({ error: 'Forbidden — admin only' }, { status: 403 });

    const body = await req.json();
    const { image_url, caption } = body;
    if (!image_url || !caption) {
      return Response.json({ error: 'image_url and caption are required' }, { status: 400 });
    }

    // Get Instagram access token from the shared connector
    const { accessToken } = await base44.asServiceRole.connectors.getConnection('instagram');
    if (!accessToken) return Response.json({ error: 'Instagram not connected' }, { status: 400 });

    // Step 1: Get Instagram user ID
    const meRes = await fetch(`https://graph.instagram.com/me?fields=id,username&access_token=${accessToken}`);
    const meData = await meRes.json();
    if (!meData.id) {
      return Response.json({ error: 'Failed to get Instagram user ID', details: meData }, { status: 500 });
    }
    const igUserId = meData.id;

    // Step 2: Create media container
    const createRes = await fetch(`https://graph.instagram.com/${igUserId}/media`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        image_url: image_url,
        caption: caption,
        access_token: accessToken,
      }),
    });
    const createData = await createRes.json();
    if (!createData.id) {
      return Response.json({ error: 'Failed to create Instagram media container', details: createData }, { status: 500 });
    }
    const creationId = createData.id;

    // Step 3: Publish the media
    const publishRes = await fetch(`https://graph.instagram.com/${igUserId}/media_publish`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        creation_id: creationId,
        access_token: accessToken,
      }),
    });
    const publishData = await publishRes.json();
    if (!publishData.id) {
      return Response.json({ error: 'Failed to publish Instagram media', details: publishData }, { status: 500 });
    }

    return Response.json({ success: true, media_id: publishData.id, message: 'Posted to Instagram successfully.' });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});