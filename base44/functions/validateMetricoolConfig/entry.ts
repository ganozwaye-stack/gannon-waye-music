import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

// Validates Metricool API credentials using the correct REST API spec
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

    const missing = [];
    if (!token)  missing.push('METRICOOL_API_TOKEN');
    if (!userId) missing.push('METRICOOL_USER_ID');
    if (!blogId) missing.push('METRICOOL_BLOG_ID');

    if (missing.length > 0) {
      await base44.asServiceRole.entities.SystemHealthIssue.create({
        system_area: 'integrations',
        issue_title: `Metricool config missing: ${missing.join(', ')}`,
        severity: 'high',
        detected_by: 'validateMetricoolConfig',
        recommended_fix: `Set these secrets in Base44 Settings → Secrets: ${missing.join(', ')}. Find values in Metricool → Account Settings → API.`,
        status: 'open',
        risk_type: 'none',
      });
      await base44.asServiceRole.entities.AdminNotification.create({
        notification_type: 'system',
        severity: 'high',
        title: '⚠️ Metricool API not configured',
        summary: `Missing secrets: ${missing.join(', ')}. Add them in Base44 Settings → Secrets.`,
        source: 'validateMetricoolConfig',
        requires_action: true,
        linked_route: '/admin/metricool-api-setup',
        is_read: false,
      });
      return Response.json({ valid: false, missing, message: `Missing secrets: ${missing.join(', ')}` });
    }

    // Official connection test: GET /api/admin/simpleProfiles?userId=...&blogId=...
    // userId + blogId go as query params; token goes in X-Mc-Auth header
    let apiStatus = 'unknown';
    let apiError  = null;
    let profiles  = null;

    try {
      const url = `https://app.metricool.com/api/admin/simpleProfiles?userId=${encodeURIComponent(userId)}&blogId=${encodeURIComponent(blogId)}`;
      const resp = await fetch(url, {
        method: 'GET',
        headers: {
          'X-Mc-Auth': token,
          'Content-Type': 'application/json',
        },
        signal: AbortSignal.timeout(10000),
      });

      if (resp.status === 401 || resp.status === 403) {
        apiStatus = 'auth_failed';
        apiError  = `HTTP ${resp.status} — invalid token or userId`;
      } else if (resp.ok) {
        apiStatus = 'connected';
        try { profiles = await resp.json(); } catch (_) {}
      } else {
        const body = await resp.text().catch(() => '');
        apiStatus = 'error';
        apiError  = `HTTP ${resp.status}: ${body.slice(0, 200)}`;
      }
    } catch (fetchErr) {
      apiStatus = 'unreachable';
      apiError  = fetchErr.message;
    }

    const valid = apiStatus === 'connected';

    if (!valid) {
      await base44.asServiceRole.entities.SystemHealthIssue.create({
        system_area: 'integrations',
        issue_title: `Metricool API connection failed: ${apiStatus}`,
        severity: 'high',
        detected_by: 'validateMetricoolConfig',
        recommended_fix: `API error: ${apiError}. Verify METRICOOL_API_TOKEN, METRICOOL_USER_ID, METRICOOL_BLOG_ID in Metricool → Account Settings → API.`,
        status: 'open',
        risk_type: 'none',
      });
    }

    return Response.json({
      valid,
      api_status: apiStatus,
      api_error: apiError,
      profiles_returned: Array.isArray(profiles) ? profiles.length : null,
      secrets_present: { token: !!token, userId: !!userId, blogId: !!blogId },
      endpoint_tested: 'GET /api/admin/simpleProfiles?userId=...&blogId=...',
      message: valid
        ? `Metricool API connected ✓ — ${Array.isArray(profiles) ? profiles.length : 0} brand(s) returned`
        : `API test failed: ${apiStatus} — ${apiError}`,
    });

  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});