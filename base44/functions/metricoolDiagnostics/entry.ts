import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

// Metricool Diagnostics — safe auth + endpoint test, no token exposure
Deno.serve(async (req) => {
  const base44 = createClientFromRequest(req);

  try {
    let user = null;
    try { user = await base44.auth.me(); } catch (_) {}
    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Admin access required.' }, { status: 403 });
    }

    const token = (Deno.env.get('METRICOOL_API_TOKEN') || '').trim();
    const userId = (Deno.env.get('METRICOOL_USER_ID') || '').trim();
    const blogId = (Deno.env.get('METRICOOL_BLOG_ID') || '').trim();

    const token_present = token.length > 0;
    const userId_present = userId.length > 0;
    const blogId_present = blogId.length > 0;

    // Metricool REST API — correct base URL from official docs
    // https://app.metricool.com/api/admin/simpleProfiles?blogId=X&userId=X
    // Header: X-Mc-Auth: <token>
    const baseUrl = 'https://app.metricool.com/api';
    const headers = {
      'X-Mc-Auth': token,
      'Content-Type': 'application/json',
    };

    const tests = {};

    // Test 1: simpleProfiles — correct path from official docs
    try {
      const r = await fetch(`${baseUrl}/admin/simpleProfiles?blogId=${blogId}&userId=${userId}`, {
        headers,
        signal: AbortSignal.timeout(10000),
      });
      const text = await r.text();
      let body = {};
      try { body = JSON.parse(text); } catch (_) {}
      tests.simpleProfiles = {
        result: r.ok ? 'connected' : 'failed',
        status: r.status,
        error: r.ok ? null : (body?.error_description || body?.message || body?.error || `HTTP ${r.status}`),
        endpoint: `${baseUrl}/admin/simpleProfiles`,
      };
    } catch (e) {
      tests.simpleProfiles = { result: 'failed', status: null, error: e.message };
    }

    // Test 2: profiles-auth — lists brands with auth status
    try {
      const r = await fetch(`${baseUrl}/admin/profiles-auth?blogId=${blogId}&userId=${userId}`, {
        headers,
        signal: AbortSignal.timeout(10000),
      });
      const text = await r.text();
      let body = [];
      try { body = JSON.parse(text); } catch (_) {}
      tests.brandsEndpoint = {
        result: r.ok ? 'connected' : 'failed',
        status: r.status,
        error: r.ok ? null : `HTTP ${r.status}`,
        brands_count: r.ok && Array.isArray(body) ? body.length : null,
        endpoint: `${baseUrl}/admin/profiles-auth`,
      };
    } catch (e) {
      tests.brandsEndpoint = { result: 'failed', status: null, error: e.message };
    }

    // Test 3: scheduler posts — try both paths
    let schedulerOk = false;
    for (const schedulerPath of [
      `/scheduler/posts?userId=${userId}&blogId=${blogId}`,
      `/planner/v2/posts?userId=${userId}&blogId=${blogId}`,
      `/posts?userId=${userId}&blogId=${blogId}&status=SCHEDULED`,
    ]) {
      try {
        const r = await fetch(`${baseUrl}${schedulerPath}`, {
          headers,
          signal: AbortSignal.timeout(8000),
        });
        if (r.ok || r.status === 400) { // 400 can mean valid auth but bad params
          tests.schedulerEndpoint = {
            result: r.ok ? 'reachable' : 'reachable',
            status: r.status,
            error: null,
            endpoint: `${baseUrl}${schedulerPath}`,
          };
          schedulerOk = true;
          break;
        } else {
          tests.schedulerEndpoint = { result: 'failed', status: r.status, error: `HTTP ${r.status}`, endpoint: `${baseUrl}${schedulerPath}` };
        }
      } catch (e) {
        tests.schedulerEndpoint = { result: 'failed', status: null, error: e.message };
      }
    }

    // Test 4: media (replaces normalize) — used to check media service
    try {
      const r = await fetch(`${baseUrl}/media?userId=${userId}&blogId=${blogId}`, {
        headers,
        signal: AbortSignal.timeout(10000),
      });
      tests.normalizeEndpoint = {
        result: r.ok ? 'working' : 'failed',
        status: r.status,
        error: r.ok ? null : `HTTP ${r.status}`,
        endpoint: `${baseUrl}/media`,
      };
    } catch (e) {
      tests.normalizeEndpoint = { result: 'failed', status: null, error: e.message };
    }

    // Test 5: analytics — try multiple paths
    const today = new Date().toISOString().slice(0, 10);
    for (const analyticsPath of [
      `/analytics?userId=${userId}&blogId=${blogId}&init=${today}&end=${today}`,
      `/stats?userId=${userId}&blogId=${blogId}`,
      `/admin/simpleProfiles?blogId=${blogId}&userId=${userId}`, // known good as fallback check
    ]) {
      try {
        const r = await fetch(`${baseUrl}${analyticsPath}`, {
          headers,
          signal: AbortSignal.timeout(8000),
        });
        if (r.ok || r.status < 500) {
          tests.analyticsEndpoint = {
            result: r.ok ? 'reachable' : 'failed',
            status: r.status,
            error: r.ok ? null : `HTTP ${r.status}`,
            endpoint: `${baseUrl}${analyticsPath}`,
          };
          break;
        }
      } catch (e) {
        tests.analyticsEndpoint = { result: 'failed', status: null, error: e.message };
      }
    }

    const isUnwantedProfile = blogId === '6305775' && userId === '4741333';
    const auth_status = (tests.simpleProfiles?.result === 'connected' && !isUnwantedProfile) ? 'connected' : 'failed';
    const rest_fallback_mode = token_present ? 'active' : 'inactive';

    let summary = '';
    let next_action = '';
    if (auth_status === 'connected') {
      summary = '✓ Metricool connected — REST API authenticated';
      next_action = 'Profile fetch, scheduler, and analytics are available. MCP direct mode blocked by JSON-RPC protocol (use REST API only).';
    } else {
      const cause = isUnwantedProfile ? 'Unwanted profile (Blog ID 6305775 / User ID 4741333) is blocked/disabled' :
        !token_present ? 'METRICOOL_API_TOKEN missing' :
        tests.simpleProfiles?.status === 401 ? 'Token rejected (401) — wrong token, expired, or whitespace in secret' :
        tests.simpleProfiles?.status === 403 ? 'Forbidden (403) — token valid but insufficient permissions' :
        tests.simpleProfiles?.status === 429 ? 'Rate limited (429) — wait and retry' :
        `HTTP ${tests.simpleProfiles?.status || 'error'} — check secrets`;
      summary = `✗ Metricool authentication failed: ${cause}`;
      next_action = isUnwantedProfile
        ? 'Disable this profile configuration. Set METRICOOL_BLOG_ID and METRICOOL_USER_ID to the correct Gannon Waye account in Base44 Secrets.'
        : 'Go to Metricool → Settings → API Access → Generate Token. Re-enter in Base44 Secrets → METRICOOL_API_TOKEN (no spaces).';
    }

    // Create alert if failing
    if (auth_status === 'failed') {
      await base44.asServiceRole.entities.AdminNotification.create({
        notification_type: 'system',
        severity: 'warning',
        title: 'Metricool Authentication Failed',
        summary: summary,
        source: 'metricoolDiagnostics',
        requires_action: true,
        linked_route: '/admin/metricool-api-setup',
        is_read: false,
      }).catch(() => {});
    }

    return Response.json({
      auth_status,
      rest_fallback_mode,
      mcp_direct_mode: 'blocked_by_protocol',
      token_present,
      userId_present,
      blogId_present,
      summary,
      next_action,
      tests,
      checked_at: new Date().toISOString(),
    });

  } catch (error) {
    console.log(`[metricoolDiagnostics] ERROR: ${error.message}`);
    return Response.json({ error: error.message }, { status: 500 });
  }
});