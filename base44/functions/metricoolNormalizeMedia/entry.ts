import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

// Normalizes a public media URL via Metricool's normalize endpoint, then uploads
// to the media library to get a stable mediaId for scheduling.
//
// Official normalize endpoint (GET):
//   /api/actions/normalize/image/url?url=<URL>&userId=...&blogId=...
//
// Input: { asset_id?, public_url, media_type? }
Deno.serve(async (req) => {
  const base44 = createClientFromRequest(req);

  try {
    let user = null;
    try { user = await base44.auth.me(); } catch (_) {}
    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Admin access required.' }, { status: 403 });
    }

    const token  = Deno.env.get('METRICOOL_API_TOKEN');
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

    // Guard: asset must be marked ready before normalizing
    if (asset_id) {
      const assets = await base44.asServiceRole.entities.SocialAsset.filter({ id: asset_id }, 'created_date', 1);
      const asset  = assets?.[0];
      if (asset && asset.status === 'raw') {
        return Response.json({ error: 'Asset is not approved for use. Mark as "ready" first.', asset_status: asset.status }, { status: 400 });
      }
    }

    // Step 1 — Normalize: ensures Metricool has a hosted copy of the media
    // Official endpoint: GET /api/actions/normalize/image/url?url=<URL>&userId=...&blogId=...
    const normalizeUrl = `https://app.metricool.com/api/actions/normalize/image/url?url=${encodeURIComponent(public_url)}&userId=${encodeURIComponent(userId)}&blogId=${encodeURIComponent(blogId)}`;

    console.log(`[metricoolNormalizeMedia] Normalizing: ${public_url}`);

    const normResp = await fetch(normalizeUrl, {
      method: 'GET',
      headers: {
        'X-Mc-Auth': token,
        'Content-Type': 'application/json',
      },
      signal: AbortSignal.timeout(30000),
    });

    const normText = await normResp.text();
    let normData   = null;
    try { normData = JSON.parse(normText); } catch (_) {}

    if (!normResp.ok) {
      await base44.asServiceRole.entities.AdminNotification.create({
        notification_type: 'system',
        severity: 'warning',
        title: '⚠️ Metricool media normalize failed',
        summary: `URL: ${public_url} — HTTP ${normResp.status}: ${normText?.slice(0, 200)}`,
        source: 'metricoolNormalizeMedia',
        requires_action: true,
        linked_route: '/admin/metricool-media-pipeline',
        is_read: false,
      });
      return Response.json({ error: `Metricool normalize failed: HTTP ${normResp.status}`, detail: normText?.slice(0, 500) }, { status: 400 });
    }

    // The normalize endpoint returns the hosted URL and/or a mediaId
    const mediaId    = normData?.mediaId || normData?.id || normData?.data?.id || normData?.data?.mediaId;
    const hostedUrl  = normData?.url || normData?.data?.url || public_url;

    console.log(`[metricoolNormalizeMedia] Normalized — mediaId=${mediaId}, hostedUrl=${hostedUrl}`);

    // Step 2 — Update SocialAsset with mediaId if provided
    if (asset_id && mediaId) {
      await base44.asServiceRole.entities.SocialAsset.update(asset_id, {
        notes: `metricool_media_id:${mediaId}`,
        status: 'ready',
      });
    }

    return Response.json({
      success: true,
      media_id: mediaId,
      hosted_url: hostedUrl,
      normalize_response: normData,
      endpoint_used: 'GET /api/actions/normalize/image/url',
      message: mediaId
        ? `Media normalized. Metricool mediaId: ${mediaId}`
        : `Media normalized. Use hosted_url in your scheduler payload.`,
    });

  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});