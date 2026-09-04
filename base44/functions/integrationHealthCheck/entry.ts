/**
 * Integration Health Check — ADMIN ONLY
 * Run manually from the admin dashboard to check all integrations.
 * Do NOT use this as the Stripe webhook receiver.
 */
import Stripe from 'npm:stripe@14.21.0';
import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

const PRINTFUL_EXPECTED_STORE = 'Gannon Waye POD Store';
const PRINTFUL_EXPECTED_SETUP_SCOPES = [
  'orders/read',
  'sync_products',
  'file_library',
  'webhooks',
];

async function fetchPrintfulJson(url, token) {
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
      signal: AbortSignal.timeout(15000),
    });

    const text = await response.text();
    let body = null;
    try {
      body = text ? JSON.parse(text) : null;
    } catch {
      body = null;
    }

    return {
      ok: response.ok,
      status: response.status,
      body,
      error_type: response.ok ? null : `http_${response.status}`,
    };
  } catch (error) {
    return {
      ok: false,
      status: 0,
      body: null,
      error_type: error?.name === 'TimeoutError' ? 'timeout' : 'network_error',
    };
  }
}

function normalizePrintfulScopes(body) {
  const v2Scopes = Array.isArray(body?.data)
    ? body.data.map((entry) => entry?.value)
    : [];
  const legacyScopes = Array.isArray(body?.result?.scopes)
    ? body.result.scopes.map((entry) => typeof entry === 'string' ? entry : entry?.scope)
    : [];

  return [...new Set([...v2Scopes, ...legacyScopes].filter(Boolean))].sort();
}

function normalizePrintfulStores(body) {
  const rawStores = Array.isArray(body?.data)
    ? body.data
    : Array.isArray(body?.result)
      ? body.result
      : [];

  return rawStores.map((store) => ({
    id: store?.id == null ? null : String(store.id),
    name: store?.name || '',
    type: store?.type || null,
  }));
}

async function runPrintfulReadOnlyCheck() {
  const checkedAt = new Date().toISOString();
  const token = Deno.env.get('PRINTFUL_API_TOKEN');

  if (!token) {
    return {
      success: false,
      mode: 'printful_read_only',
      checked_at: checkedAt,
      secret_present: false,
      safe_for_setup: false,
      issue: 'PRINTFUL_API_TOKEN is not available to the deployed backend function.',
      actions_performed: ['No Printful API request was made.'],
      actions_not_performed: [
        'No order, product, file, webhook, payment, wallet, fulfilment, shipping, publishing, or database action was performed.',
      ],
    };
  }

  let scopesEndpoint = 'https://api.printful.com/v2/oauth-scopes';
  let scopesResponse = await fetchPrintfulJson(scopesEndpoint, token);

  // Read-only compatibility fallback for accounts still returning the legacy OAuth resource.
  if (!scopesResponse.ok && [404, 405].includes(scopesResponse.status)) {
    scopesEndpoint = 'https://api.printful.com/oauth/scopes';
    scopesResponse = await fetchPrintfulJson(scopesEndpoint, token);
  }

  const storesEndpoint = 'https://api.printful.com/v2/stores?limit=100&offset=0';
  const storesResponse = await fetchPrintfulJson(storesEndpoint, token);

  const scopes = normalizePrintfulScopes(scopesResponse.body);
  const stores = normalizePrintfulStores(storesResponse.body);
  const missingExpectedScopes = PRINTFUL_EXPECTED_SETUP_SCOPES.filter((scope) => !scopes.includes(scope));
  const unexpectedScopes = scopes.filter((scope) => !PRINTFUL_EXPECTED_SETUP_SCOPES.includes(scope));
  const forbiddenOrderWriteScopePresent = scopes.includes('orders');
  const expectedStoreFound = stores.some((store) => store.name === PRINTFUL_EXPECTED_STORE);
  const onlyExpectedStoreVisible = stores.length === 1 && expectedStoreFound;

  const safeForSetup = Boolean(
    scopesResponse.ok
    && storesResponse.ok
    && onlyExpectedStoreVisible
    && missingExpectedScopes.length === 0
    && unexpectedScopes.length === 0
    && !forbiddenOrderWriteScopePresent
  );

  return {
    success: scopesResponse.ok && storesResponse.ok,
    mode: 'printful_read_only',
    checked_at: checkedAt,
    secret_present: true,
    safe_for_setup: safeForSetup,
    scopes_endpoint: {
      method: 'GET',
      path: new URL(scopesEndpoint).pathname,
      status: scopesResponse.status,
      error_type: scopesResponse.error_type,
    },
    stores_endpoint: {
      method: 'GET',
      path: new URL(storesEndpoint).pathname,
      status: storesResponse.status,
      error_type: storesResponse.error_type,
    },
    granted_scopes: scopes,
    expected_scopes: PRINTFUL_EXPECTED_SETUP_SCOPES,
    missing_expected_scopes: missingExpectedScopes,
    unexpected_scopes: unexpectedScopes,
    forbidden_scopes_present: forbiddenOrderWriteScopePresent ? ['orders'] : [],
    accessible_store_count: stores.length,
    accessible_stores: stores,
    expected_store: PRINTFUL_EXPECTED_STORE,
    expected_store_found: expectedStoreFound,
    only_expected_store_visible: onlyExpectedStoreVisible,
    actions_performed: [
      `GET ${new URL(scopesEndpoint).pathname}`,
      `GET ${new URL(storesEndpoint).pathname}`,
    ],
    actions_not_performed: [
      'No order was read, created, changed, confirmed, cancelled, or submitted.',
      'No product or file was read, created, changed, synced, or published.',
      'No webhook was read, created, changed, or deleted.',
      'No payment, wallet, billing, fulfilment, or shipping action was performed.',
      'No database record, notification, or audit item was created by this check.',
    ],
    verification_limit: 'One visible store is the documented result for a store-level token. If the Printful account itself contains only one store, the store list alone cannot independently distinguish that token from an account-level token.',
  };
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (user?.role !== 'admin') {
      return Response.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
    }

    const requestBody = await req.clone().json().catch(() => ({}));
    const requestedMode = requestBody?.mode || requestBody?.data?.mode;

    // Explicit one-time diagnostic path. It performs only authenticated GET requests
    // to Printful, creates no records, and returns before the normal health check.
    if (requestedMode === 'printful_read_only') {
      const result = await runPrintfulReadOnlyCheck();
      return Response.json(result, {
        headers: { 'Cache-Control': 'no-store' },
      });
    }

    const checks = [];
    const alerts = [];
    const now = new Date().toISOString();

    const addAlert = (type, severity, message, route = '/admin/api-setup') => {
      alerts.push({ type, severity, message, route });
    };

    // 1. Stripe Secret Key — validate format, then report mode
    const stripeSecret = Deno.env.get('STRIPE_SECRET_KEY');
    const secretValidFormat = stripeSecret && (stripeSecret.startsWith('sk_live_') || stripeSecret.startsWith('sk_test_'));
    if (!stripeSecret) {
      addAlert('stripe_key_missing', 'critical', 'STRIPE_SECRET_KEY is not set.', '/admin/stripe-command-centre');
    } else if (!secretValidFormat) {
      addAlert('stripe_key_invalid', 'critical', 'STRIPE_SECRET_KEY format is invalid — must start with sk_live_ or sk_test_.', '/admin/stripe-command-centre');
    } else if (stripeSecret.startsWith('sk_test_')) {
      addAlert('stripe_not_live', 'high', 'STRIPE_SECRET_KEY is in test mode (sk_test_). Switch to sk_live_ for production.', '/admin/stripe-command-centre');
      checks.push({ platform: 'Stripe Secret Key', status: 'test' });
    } else {
      checks.push({ platform: 'Stripe Secret Key', status: 'live' });
    }

    // 2. Stripe Publishable Key — validate format, then report mode
    const stripePk = Deno.env.get('STRIPE_PUBLISHABLE_KEY');
    const pkValidFormat = stripePk && (stripePk.startsWith('pk_live_') || stripePk.startsWith('pk_test_'));
    if (!stripePk) {
      addAlert('stripe_pk_missing', 'critical', 'STRIPE_PUBLISHABLE_KEY is not set.', '/admin/stripe-command-centre');
    } else if (!pkValidFormat) {
      addAlert('stripe_pk_invalid', 'critical', 'STRIPE_PUBLISHABLE_KEY format is invalid — must start with pk_live_ or pk_test_.', '/admin/stripe-command-centre');
    } else if (stripePk.startsWith('pk_test_')) {
      addAlert('stripe_pk_test', 'high', 'STRIPE_PUBLISHABLE_KEY is in test mode. Switch to pk_live_ for production.', '/admin/stripe-command-centre');
      checks.push({ platform: 'Stripe Publishable Key', status: 'test' });
    } else {
      checks.push({ platform: 'Stripe Publishable Key', status: 'live' });
    }

    // 2b. Check for live/test key mismatch — only when both formats are valid
    if (secretValidFormat && pkValidFormat) {
      const secretIsLive = stripeSecret.startsWith('sk_live_');
      const pkIsLive = stripePk.startsWith('pk_live_');
      if (secretIsLive !== pkIsLive) {
        addAlert('stripe_key_mismatch', 'critical',
          `STRIPE KEY MISMATCH: STRIPE_SECRET_KEY is ${secretIsLive ? 'LIVE' : 'TEST'} but STRIPE_PUBLISHABLE_KEY is ${pkIsLive ? 'LIVE' : 'TEST'}. Do NOT process payments until fixed.`,
          '/admin/stripe-command-centre'
        );
        checks.push({ platform: 'Stripe Key Mode', status: 'mismatch', secret_mode: secretIsLive ? 'live' : 'test', pk_mode: pkIsLive ? 'live' : 'test' });
      } else {
        checks.push({ platform: 'Stripe Key Mode', status: secretIsLive ? 'live' : 'test' });
      }
    }

    // 3. Stripe Webhook Secret
    const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET');
    if (!webhookSecret) {
      addAlert('webhook_secret_missing', 'critical', 'STRIPE_WEBHOOK_SECRET not set. Webhooks cannot be verified. Set it from Stripe Dashboard → Webhooks → your endpoint → Signing secret.', '/admin/webhook-health');
    } else {
      checks.push({ platform: 'Stripe Webhook Secret', status: 'configured' });
    }

    // 4. Stripe API connectivity test
    if (secretValidFormat) {
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

      for (const alert of alerts.filter(a => a.severity === 'critical' || a.severity === 'high')) {
        try {
          await base44.asServiceRole.entities.SystemHealthIssue.create({
            issue_title: alert.message,
            system_area: 'integrations',
            severity: alert.severity,
            status: 'open',
            linked_route: alert.route,
            detected_by: 'integrationHealthCheck',
            recommended_fix: `Check ${alert.route} and resolve the integration issue.`,
            last_checked: now,
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