import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

// Validates Metricool API credentials and creates health/alert records
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

    const missing = [];
    if (!token) missing.push('METRICOOL_API_TOKEN');
    if (!userId) missing.push('METRICOOL_USER_ID');
    if (!blogId) missing.push('METRICOOL_BLOG_ID');

    if (missing.length > 0) {
      // Create SystemHealth issue
      await base44.asServiceRole.entities.SystemHealthIssue.create({
        system_area: 'integrations',
        issue_title: `Metricool config missing: ${missing.join(', ')}`,
        severity: 'high',
        detected_by: 'validateMetricoolConfig',
        recommended_fix: `Set these secrets in Base44 dashboard → Settings → Secrets: ${missing.join(', ')}. Find values in Metricool Account Settings → API.`,
        status: 'open',
        risk_type: 'none',
      });

      // Create AdminNotification
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

      return Response.json({
        valid: false,
        missing,
        message: `Missing secrets: ${missing.join(', ')}`,
      });
    }

    // Test actual API connection
    let apiStatus = 'unknown';
    let apiError = null;
    let userData = null;

    try {
      const resp = await fetch(`https://app.metricool.com/api/v2/analytics/instagram?init_date=2024-01-01&end_date=2024-01-02&user_id=${userId}&blog_id=${blogId}`, {
        method: 'GET',
        headers: {
          'X-Mc-Auth': token,
          'Content-Type': 'application/json',
        },
        signal: AbortSignal.timeout(10000),
      });

      if (resp.status === 401 || resp.status === 403) {
        apiStatus = 'auth_failed';
        apiError = `HTTP ${resp.status} — invalid token or user ID`;
      } else if (resp.status === 200 || resp.status === 404 || resp.status === 422) {
        // 404/422 means connected but no data — still valid auth
        apiStatus = 'connected';
        try { userData = await resp.json(); } catch (_) {}
      } else {
        apiStatus = 'error';
        apiError = `HTTP ${resp.status}`;
      }
    } catch (fetchErr) {
      apiStatus = 'unreachable';
      apiError = fetchErr.message;
    }

    const valid = apiStatus === 'connected';

    if (!valid) {
      await base44.asServiceRole.entities.SystemHealthIssue.create({
        system_area: 'integrations',
        issue_title: `Metricool API connection failed: ${apiStatus}`,
        severity: 'high',
        detected_by: 'validateMetricoolConfig',
        recommended_fix: `API error: ${apiError}. Verify METRICOOL_API_TOKEN and METRICOOL_USER_ID in Metricool Account Settings → API.`,
        status: 'open',
        risk_type: 'none',
      });
    }

    return Response.json({
      valid,
      api_status: apiStatus,
      api_error: apiError,
      secrets_present: { token: !!token, userId: !!userId, blogId: !!blogId },
      message: valid ? 'Metricool API connected and authenticated ✓' : `API test failed: ${apiStatus} — ${apiError}`,
    });

  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});