import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

// listMetricoolProfiles — admin-only, server-side only, no token exposure
Deno.serve(async (req) => {
  const base44 = createClientFromRequest(req);
  try {
    let user = null;
    try { user = await base44.auth.me(); } catch (_) {}
    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Admin access required.' }, { status: 403 });
    }

    const token  = (Deno.env.get('METRICOOL_API_TOKEN') || '').trim();
    const userId = (Deno.env.get('METRICOOL_USER_ID') || '').trim();
    const blogId = (Deno.env.get('METRICOOL_BLOG_ID') || '').trim();

    if (!token || !userId) {
      return Response.json({ error: 'METRICOOL_API_TOKEN and METRICOOL_USER_ID are required.' });
    }

    const headers = {
      'X-Mc-Auth': token,
      'Content-Type': 'application/json',
    };

    // Try simpleProfiles — returns brand/profile list with blogIds
    const url = `https://app.metricool.com/api/admin/simpleProfiles?userId=${encodeURIComponent(userId)}&blogId=${encodeURIComponent(blogId)}`;
    const resp = await fetch(url, { headers, signal: AbortSignal.timeout(12000) });

    if (!resp.ok) {
      const errText = await resp.text().catch(() => '');
      let errMsg = `HTTP ${resp.status}`;
      try { const j = JSON.parse(errText); errMsg = j.error_description || j.message || j.error || errMsg; } catch (_) {}
      return Response.json({
        profiles: [],
        error: `Metricool returned ${errMsg}`,
        http_status: resp.status,
        hint: resp.status === 401 ? 'Check METRICOOL_API_TOKEN — may be invalid or expired.'
            : resp.status === 403 ? 'Token valid but insufficient permissions — check Metricool plan.'
            : 'Check credentials and try again.',
      });
    }

    const raw = await resp.json().catch(() => []);
    // Normalize — Metricool simpleProfiles returns array of brand objects
    const profiles = Array.isArray(raw) ? raw.map(p => {
      const bId = String(p.blogId || p.id || '');
      const uId = String(p.userId || userId);
      const isDisabled = bId === '6305775' && uId === '4741333';
      return {
        name:    isDisabled ? '[DISABLED] Gannon Waye (Incorrect Profile)' : (p.name || p.blogName || p.username || `Profile`),
        blogId:  bId,
        userId:  uId,
        type:    p.type || p.accountType || '',
        status:  isDisabled ? 'disabled' : (p.status || 'active'),
        avatarUrl: p.avatarUrl || p.logo || null,
      };
    }) : [];

    return Response.json({
      profiles,
      count: profiles.length,
      current_blog_id: blogId || null,
      message: `${profiles.length} profile(s) returned from Metricool.`,
    });

  } catch (error) {
    return Response.json({ error: error.message, profiles: [] }, { status: 500 });
  }
});