/**
 * Integration Health Check — ADMIN ONLY
 * Run manually from the admin dashboard to check all integrations.
 * Do NOT use this as the Stripe webhook receiver.
 */
import Stripe from 'npm:stripe@14.21.0';
import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (user?.role !== 'admin') {
      return Response.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
    }

    const checks = [];
    const alerts = [];
    const now = new Date().toISOString();

    const addAlert = (type, severity, message, route = '/admin/api-setup') => {
      alerts.push({ type, severity, message, route });
    };

    // 1. Stripe Secret Key
    const stripeSecret = Deno.env.get('STRIPE_SECRET_KEY');
    if (!stripeSecret) {
      addAlert('stripe_key_missing', 'critical', 'STRIPE_SECRET_KEY is not set.', '/admin/stripe-command-centre');
    } else if (!stripeSecret.startsWith('sk_live_')) {
      addAlert('stripe_not_live', 'high', 'STRIPE_SECRET_KEY is in test mode (sk_test_). Switch to sk_live_ for production.', '/admin/stripe-command-centre');
    } else {
      checks.push({ platform: 'Stripe Secret Key', status: 'live' });
    }

    // 2. Stripe Publishable Key
    const stripePk = Deno.env.get('STRIPE_PUBLISHABLE_KEY');
    if (!stripePk) {
      addAlert('stripe_pk_missing', 'critical', 'STRIPE_PUBLISHABLE_KEY is not set.', '/admin/stripe-command-centre');
    } else if (!stripePk.startsWith('pk_live_')) {
      addAlert('stripe_pk_test', 'high', 'STRIPE_PUBLISHABLE_KEY is in test mode. Switch to pk_live_ for production.', '/admin/stripe-command-centre');
    } else {
      checks.push({ platform: 'Stripe Publishable Key', status: 'live' });
    }

    // 3. Stripe Webhook Secret
    const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET');
    if (!webhookSecret) {
      addAlert('webhook_secret_missing', 'critical', 'STRIPE_WEBHOOK_SECRET not set. Webhooks cannot be verified. Set it from Stripe Dashboard → Webhooks → your endpoint → Signing secret.', '/admin/webhook-health');
    } else {
      checks.push({ platform: 'Stripe Webhook Secret', status: 'configured' });
    }

    // 4. Stripe API connectivity test
    if (stripeSecret) {
      try {
        const stripe = new Stripe(stripeSecret);
        await stripe.balance.retrieve();
        checks.push({ platform: 'Stripe API', status: 'connected' });
      } catch (stripeErr) {
        addAlert('stripe_api_fail', 'critical', `Stripe API test failed: ${stripeErr.message}`, '/admin/stripe-command-centre');
      }
    }

    // 5. TikTok keys
    const tiktokKey = Deno.env.get('TIKTOK_CLIENT_KEY');
    const tiktokSecret = Deno.env.get('TIKTOK_CLIENT_SECRET');
    if (!tiktokKey) {
      addAlert('tiktok_key_missing', 'warning', 'TIKTOK_CLIENT_KEY not set. TikTok integration disabled.');
    } else {
      checks.push({ platform: 'TikTok Client Key', status: 'configured' });
    }
    if (!tiktokSecret) {
      addAlert('tiktok_secret_missing', 'warning', 'TIKTOK_CLIENT_SECRET not set.');
    } else {
      checks.push({ platform: 'TikTok Client Secret', status: 'configured' });
    }

    // 6. Slack connector
    try {
      const slackStatus = await base44.asServiceRole.connectors.getConnection('slack');
      if (slackStatus?.accessToken) {
        checks.push({ platform: 'Slack', status: 'authorized' });
      }
    } catch {
      addAlert('slack_not_authorized', 'warning', 'Slack connector not authorized. Admin alerts will not send to Slack.');
    }

    // 7. Gmail connector
    try {
      const gmailStatus = await base44.asServiceRole.connectors.getConnection('gmail');
      if (gmailStatus?.accessToken) {
        checks.push({ platform: 'Gmail', status: 'authorized' });
      }
    } catch {
      addAlert('gmail_not_authorized', 'warning', 'Gmail connector not authorized. Emails will not send.');
    }

    // 8. Check for PaymentDiagnostics with open/critical status
    let openDiagnostics = 0;
    try {
      const diags = await base44.asServiceRole.entities.PaymentDiagnostic.filter({ status: 'open' });
      openDiagnostics = diags?.length || 0;
      if (openDiagnostics > 0) {
        addAlert('open_diagnostics', 'high', `${openDiagnostics} open payment diagnostic(s) require attention.`, '/admin/payment-diagnostics');
      }
    } catch {}

    // 9. Check for unread webhook signature failures
    try {
      const sigFails = await base44.asServiceRole.entities.PaymentDiagnostic.filter({
        diagnostic_type: 'webhook_signature_failure',
        status: 'open'
      });
      if (sigFails?.length > 0) {
        addAlert('webhook_sig_failures', 'critical', `${sigFails.length} webhook signature verification failure(s) recorded.`, '/admin/webhook-health');
      }
    } catch {}

    // Create AdminNotification for all alerts
    if (alerts.length > 0) {
      const criticalCount = alerts.filter(a => a.severity === 'critical').length;
      const highCount = alerts.filter(a => a.severity === 'high').length;
      const topSeverity = criticalCount > 0 ? 'critical' : highCount > 0 ? 'high' : 'warning';

      await base44.asServiceRole.entities.AdminNotification.create({
        notification_type: 'system',
        severity: topSeverity,
        title: `Integration Health: ${alerts.length} issue(s) found`,
        summary: `${criticalCount} critical, ${highCount} high, ${alerts.filter(a => a.severity === 'warning').length} warning. Run: /admin/api-setup`,
        requires_action: criticalCount > 0 || highCount > 0,
        linked_route: '/admin/api-setup',
        source: 'integrationHealthCheck',
        is_read: false,
      });

      // Create SystemHealthIssue records for critical alerts
      for (const alert of alerts.filter(a => a.severity === 'critical' || a.severity === 'high')) {
        try {
          await base44.asServiceRole.entities.SystemHealthIssue.create({
            issue_type: alert.type,
            severity: alert.severity,
            description: alert.message,
            status: 'open',
            linked_route: alert.route,
            source: 'integrationHealthCheck',
            detected_at: now,
          });
        } catch {}
      }
    }

    return Response.json({
      success: true,
      checked_at: now,
      passed_checks: checks.length,
      alert_count: alerts.length,
      open_diagnostics: openDiagnostics,
      checks,
      alerts,
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});