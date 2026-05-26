import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

// Imports performance metrics from Metricool API for posted content
// Input: { platform, start_date, end_date } — dates as YYYY-MM-DD
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
      return Response.json({ error: 'Metricool not configured.' }, { status: 400 });
    }

    let body = {};
    try { body = await req.json(); } catch (_) {}

    const {
      platform = 'instagram',
      start_date = '2026-05-26',
      end_date = '2026-06-10',
    } = body;

    // Map our platform names to Metricool API endpoints
    const endpointMap = {
      tiktok: 'tiktok',
      instagram: 'instagram',
      instagram_reels: 'instagram',
      instagram_stories: 'instagram',
      twitter_x: 'twitter',
      facebook: 'facebook',
      youtube_shorts: 'youtube',
    };

    const mcPlatform = endpointMap[platform] || platform;

    console.log(`[metricoolImportMetrics] Fetching ${mcPlatform} metrics ${start_date} → ${end_date}`);

    const metricsUrl = `https://app.metricool.com/api/v2/analytics/${mcPlatform}?init_date=${start_date}&end_date=${end_date}&user_id=${userId}&blog_id=${blogId}`;

    const metricsResp = await fetch(metricsUrl, {
      headers: {
        'X-Mc-Auth': token,
        'Content-Type': 'application/json',
      },
      signal: AbortSignal.timeout(15000),
    });

    const metricsText = await metricsResp.text();
    let metricsData = null;
    try { metricsData = JSON.parse(metricsText); } catch (_) {}

    if (!metricsResp.ok) {
      return Response.json({ error: `Metricool metrics fetch failed: HTTP ${metricsResp.status}`, detail: metricsText?.slice(0, 500) }, { status: 400 });
    }

    // Also fetch posts list if available
    let postsData = null;
    try {
      const postsUrl = `https://app.metricool.com/api/v2/analytics/${mcPlatform}/posts?init_date=${start_date}&end_date=${end_date}&user_id=${userId}&blog_id=${blogId}`;
      const postsResp = await fetch(postsUrl, {
        headers: { 'X-Mc-Auth': token, 'Content-Type': 'application/json' },
        signal: AbortSignal.timeout(15000),
      });
      if (postsResp.ok) {
        postsData = await postsResp.json();
      }
    } catch (_) {}

    // Summarize key metrics
    const summary = {
      platform: mcPlatform,
      period: `${start_date} → ${end_date}`,
      raw_metrics: metricsData,
      posts_detail: postsData,
      retrieved_at: new Date().toISOString(),
    };

    // Save an agent memory with the import summary
    const totalReach = metricsData?.reach || metricsData?.total_reach || metricsData?.data?.reach || 0;
    const totalImpressions = metricsData?.impressions || metricsData?.total_impressions || 0;
    const totalEngagement = metricsData?.engagement || metricsData?.engagement_rate || 0;

    if (totalReach || totalImpressions || totalEngagement) {
      await base44.asServiceRole.entities.MusicAgentMemory.create({
        agent_name: 'Content Performance Agent',
        memory_type: 'successful_release',
        summary: `Metricool import — ${mcPlatform} ${start_date}→${end_date}: reach=${totalReach}, impressions=${totalImpressions}, engagement=${totalEngagement}`,
        importance_score: 7,
        confidence_score: 9,
        source: 'metricoolImportMetrics',
        tags: [mcPlatform, 'metricool_import', 'sprint_performance'],
      });
    }

    return Response.json({
      success: true,
      platform: mcPlatform,
      period: { start_date, end_date },
      metrics: metricsData,
      posts: postsData,
      summary,
      message: `Metrics imported for ${mcPlatform} ${start_date} → ${end_date}`,
    });

  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});