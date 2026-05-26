import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

// Normalizes/uploads a media asset to Metricool and returns a mediaId
// Input: { asset_id, public_url, media_type } (media_type: 'image' | 'video')
Deno.serve(async (req) => {
  const base44 = createClientFromRequest(req);

  try {
    let user = null;
    try { user = await base44.auth.me(); } catch (_) {}
    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Admin access required.' }, { status: 403 });
    }

    const token = Deno.env.get('METRICOOL_API_TOKEN');
    const userId = Deno.env.get('METRICOOL_USER_ID');
    const blogId = Deno.env.get('METRICOOL_BLOG_ID');

    if (!token || !userId || !blogId) {
      return Response.json({ error: 'Metricool not configured. Set METRICOOL_API_TOKEN, METRICOOL_USER_ID, METRICOOL_BLOG_ID.' }, { status: 400 });
    }

    let body = {};
    try { body = await req.json(); } catch (_) {}
    const { asset_id, public_url, media_type = 'image' } = body;

    if (!public_url) {
      return Response.json({ error: 'public_url is required' }, { status: 400 });
    }

    // Check asset is approved (not sensitive) if asset_id provided
    if (asset_id) {
      const assets = await base44.asServiceRole.entities.SocialAsset.filter({ id: asset_id }, 'created_date', 1);
      const asset = assets?.[0];
      if (asset && asset.status === 'raw') {
        return Response.json({ error: 'Asset is not approved for use. Mark as "ready" first.', asset_status: asset.status }, { status: 400 });
      }
    }

    // Upload media URL to Metricool media library
    const uploadPayload = {
      url: public_url,
      type: media_type,
      user_id: userId,
      blog_id: blogId,
    };

    const uploadResp = await fetch(`https://app.metricool.com/api/v2/media/upload`, {
      method: 'POST',
      headers: {
        'X-Mc-Auth': token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(uploadPayload),
      signal: AbortSignal.timeout(30000),
    });

    const uploadText = await uploadResp.text();
    let uploadData = null;
    try { uploadData = JSON.parse(uploadText); } catch (_) {}

    if (!uploadResp.ok) {
      await base44.asServiceRole.entities.AdminNotification.create({
        notification_type: 'system',
        severity: 'warning',
        title: '⚠️ Metricool media upload failed',
        summary: `URL: ${public_url} — HTTP ${uploadResp.status}: ${uploadText?.slice(0, 200)}`,
        source: 'metricoolNormalizeMedia',
        requires_action: true,
        linked_route: '/admin/metricool-media-pipeline',
        is_read: false,
      });
      return Response.json({ error: `Metricool media upload failed: HTTP ${uploadResp.status}`, detail: uploadText?.slice(0, 500) }, { status: 400 });
    }

    const mediaId = uploadData?.id || uploadData?.media_id || uploadData?.data?.id;

    // Update asset record with mediaId
    if (asset_id && mediaId) {
      await base44.asServiceRole.entities.SocialAsset.update(asset_id, {
        notes: `metricool_media_id:${mediaId}`,
        status: 'ready',
      });
    }

    return Response.json({
      success: true,
      media_id: mediaId,
      metricool_response: uploadData,
      message: `Media normalized. Metricool mediaId: ${mediaId}`,
    });

  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});