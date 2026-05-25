import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

// TikTok OAuth handler — handles connect, callback token exchange, refresh, status, disconnect
Deno.serve(async (req) => {
  const base44 = createClientFromRequest(req);
  const body = await req.json().catch(() => ({}));
  const { action } = body;

  // All actions require admin
  try {
    const user = await base44.auth.me();
    if (user?.role !== 'admin') {
      return Response.json({ error: 'Forbidden' }, { status: 403 });
    }
  } catch (_) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const CLIENT_KEY = Deno.env.get('TIKTOK_CLIENT_KEY') || '';
  const CLIENT_SECRET = Deno.env.get('TIKTOK_CLIENT_SECRET') || '';
  const REDIRECT_URI = 'https://gannonwaye.com/tiktok-callback';

  // ── GET AUTH URL ──────────────────────────────────────────────────────────
  if (action === 'get_auth_url') {
    // SUBMISSION SCOPES: Login Kit (user.info.basic) + Content Posting API (video.upload) ONLY
    const scopes = ['user.info.basic', 'video.upload'].join(',');
    const state = crypto.randomUUID();
    const url = `https://www.tiktok.com/v2/auth/authorize/?client_key=${CLIENT_KEY}&response_type=code&scope=${encodeURIComponent(scopes)}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&state=${state}`;
    return Response.json({ url, state });
  }

  // ── EXCHANGE CODE FOR TOKEN ───────────────────────────────────────────────
  if (action === 'exchange_code') {
    const { code } = body;
    if (!code) return Response.json({ error: 'code required' }, { status: 400 });

    const tokenRes = await fetch('https://open.tiktokapis.com/v2/oauth/token/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_key: CLIENT_KEY,
        client_secret: CLIENT_SECRET,
        code,
        grant_type: 'authorization_code',
        redirect_uri: REDIRECT_URI,
      }).toString(),
    });
    const tokenData = await tokenRes.json();

    if (tokenData.error) {
      return Response.json({ error: tokenData.error_description || tokenData.error }, { status: 400 });
    }

    // Fetch user info immediately
    let userInfo = null;
    try {
      const infoRes = await fetch('https://open.tiktokapis.com/v2/user/info/?fields=open_id,union_id,avatar_url,display_name,username,follower_count,following_count,likes_count,video_count', {
        headers: { 'Authorization': `Bearer ${tokenData.access_token}` },
      });
      const infoData = await infoRes.json();
      userInfo = infoData.data?.user || null;
    } catch (_) {}

    // Store connection in a KnowledgeVault record (encrypted via service role)
    await base44.asServiceRole.entities.KnowledgeVault.create({
      title: 'TikTok OAuth Connection',
      category: 'system',
      content: JSON.stringify({
        access_token: tokenData.access_token,
        refresh_token: tokenData.refresh_token,
        open_id: tokenData.open_id,
        scope: tokenData.scope,
        expires_in: tokenData.expires_in,
        connected_at: new Date().toISOString(),
        display_name: userInfo?.display_name || null,
        username: userInfo?.username || null,
        avatar_url: userInfo?.avatar_url || null,
        follower_count: userInfo?.follower_count || 0,
      }),
      source: 'tiktok_oauth',
      tags: ['tiktok', 'oauth', 'connection'],
    });

    return Response.json({
      success: true,
      open_id: tokenData.open_id,
      display_name: userInfo?.display_name,
      username: userInfo?.username,
      avatar_url: userInfo?.avatar_url,
      follower_count: userInfo?.follower_count,
    });
  }

  // ── GET CONNECTION STATUS ─────────────────────────────────────────────────
  if (action === 'get_status') {
    const records = await base44.asServiceRole.entities.KnowledgeVault.filter({
      source: 'tiktok_oauth',
    }, '-created_date', 1);

    if (!records.length) {
      return Response.json({ connected: false });
    }

    try {
      const stored = JSON.parse(records[0].content);
      return Response.json({
        connected: true,
        display_name: stored.display_name,
        username: stored.username,
        avatar_url: stored.avatar_url,
        follower_count: stored.follower_count,
        open_id: stored.open_id,
        connected_at: stored.connected_at,
        scope: stored.scope,
        record_id: records[0].id,
      });
    } catch (_) {
      return Response.json({ connected: false });
    }
  }

  // ── GET USER STATS ────────────────────────────────────────────────────────
  if (action === 'get_user_stats') {
    const records = await base44.asServiceRole.entities.KnowledgeVault.filter({
      source: 'tiktok_oauth',
    }, '-created_date', 1);

    if (!records.length) return Response.json({ error: 'Not connected' }, { status: 401 });

    const stored = JSON.parse(records[0].content);
    const statsRes = await fetch('https://open.tiktokapis.com/v2/user/info/?fields=open_id,display_name,username,avatar_url,follower_count,following_count,likes_count,video_count', {
      headers: { 'Authorization': `Bearer ${stored.access_token}` },
    });
    const statsData = await statsRes.json();

    if (statsData.error?.code && statsData.error.code !== 'ok') {
      return Response.json({ error: statsData.error.message }, { status: 400 });
    }

    return Response.json({ success: true, user: statsData.data?.user });
  }

  // ── GET VIDEO LIST ────────────────────────────────────────────────────────
  if (action === 'get_video_list') {
    const records = await base44.asServiceRole.entities.KnowledgeVault.filter({
      source: 'tiktok_oauth',
    }, '-created_date', 1);

    if (!records.length) return Response.json({ error: 'Not connected' }, { status: 401 });

    const stored = JSON.parse(records[0].content);
    const videosRes = await fetch('https://open.tiktokapis.com/v2/video/list/?fields=id,title,cover_image_url,share_url,video_description,duration,height,width,size,resolve_mention_enabled,embed_link,embed_html,like_count,comment_count,share_count,view_count,create_time', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${stored.access_token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ max_count: 20 }),
    });
    const videosData = await videosRes.json();

    if (videosData.error?.code && videosData.error.code !== 'ok') {
      return Response.json({ error: videosData.error.message }, { status: 400 });
    }

    return Response.json({ success: true, videos: videosData.data?.videos || [] });
  }

  // ── DISCONNECT ────────────────────────────────────────────────────────────
  if (action === 'disconnect') {
    const records = await base44.asServiceRole.entities.KnowledgeVault.filter({
      source: 'tiktok_oauth',
    }, '-created_date', 10);

    for (const r of records) {
      await base44.asServiceRole.entities.KnowledgeVault.delete(r.id);
    }

    return Response.json({ success: true });
  }

  return Response.json({ error: 'Unknown action' }, { status: 400 });
});