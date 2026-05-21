import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (user?.role !== 'admin') {
      return Response.json({ error: 'Forbidden' }, { status: 403 });
    }

    const checks = [];
    const alerts = [];

    // 1. Check Stripe live mode
    const stripeSecret = Deno.env.get('STRIPE_SECRET_KEY');
    const stripePk = Deno.env.get('STRIPE_PUBLISHABLE_KEY');
    if (!stripeSecret?.startsWith('sk_live_') || !stripePk?.startsWith('pk_live_')) {
      alerts.push({
        type: 'stripe_not_live',
        severity: 'critical',
        message: 'Stripe is not in live mode. Secret and publishable keys must start with sk_live_ and pk_live_',
      });
    } else {
      checks.push({ platform: 'Stripe', status: 'live' });
    }

    // 2. Check Toolost API key
    const toolostKey = Deno.env.get('TOOLOST_API_KEY');
    if (!toolostKey) {
      alerts.push({
        type: 'toolost_missing',
        severity: 'warning',
        message: 'TOOLOST_API_KEY not set. Cannot sync catalog/royalties.',
      });
    } else {
      checks.push({ platform: 'Toolost', status: 'configured' });
    }

    // 3. Check Slack connector + #gannon-alerts channel
    try {
      const slackStatus = await base44.asServiceRole.connectors.getConnection('slack');
      if (slackStatus.accessToken) {
        checks.push({ platform: 'Slack', status: 'authorized' });
      }
    } catch {
      alerts.push({
        type: 'slack_not_authorized',
        severity: 'warning',
        message: 'Slack connector not authorized. Admin alerts will not send to Slack.',
      });
    }

    // 4. Check for webhook secret
    const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET');
    if (!webhookSecret) {
      alerts.push({
        type: 'webhook_secret_missing',
        severity: 'high',
        message: 'STRIPE_WEBHOOK_SECRET not configured. Payment webhooks will not verify correctly.',
      });
    } else {
      checks.push({ platform: 'Stripe Webhooks', status: 'configured' });
    }

    // Fire notifications for alerts
    if (alerts.length > 0) {
      const criticalAlerts = alerts.filter(a => a.severity === 'critical');
      const highAlerts = alerts.filter(a => a.severity === 'high');

      await base44.asServiceRole.functions.invoke('notifyAdmin', {
        notification_type: 'system',
        title: `Integration Health Check: ${alerts.length} issue(s)`,
        summary: `${criticalAlerts.length} critical, ${highAlerts.length} high. See integration setup.`,
        severity: criticalAlerts.length > 0 ? 'critical' : 'high',
        source: 'IntegrationHealthCheck',
        linked_route: '/admin/api-setup',
        requires_action: true,
      });
    }

    return Response.json({
      success: true,
      passed_checks: checks.length,
      alerts: alerts.length,
      checks,
      alerts,
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});