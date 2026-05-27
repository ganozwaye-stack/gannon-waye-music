import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

// Seeds SystemHealthIssue records for all known open blockers
// Safe to run multiple times — checks for existing issues before creating
Deno.serve(async (req) => {
  const base44 = createClientFromRequest(req);

  try {
    let user = null;
    try { user = await base44.auth.me(); } catch (_) {}
    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Admin access required.' }, { status: 403 });
    }

    const existing = await base44.asServiceRole.entities.SystemHealthIssue.list('-created_date', 50);
    const existingTitles = new Set(existing.map(e => e.issue_title));

    const ISSUES = [
      {
        system_area: 'payments',
        issue_title: 'STRIPE_WEBHOOK_SECRET needs rotation',
        severity: 'critical',
        detected_by: 'SystemAudit',
        recommended_fix: 'Open dashboard.stripe.com/webhooks → find your endpoint → click "Roll signing secret" → copy new whsec_... value → paste into Base44 Settings → Environment Variables → STRIPE_WEBHOOK_SECRET. Never paste into chat.',
        status: 'open',
        risk_type: 'payment',
      },
      {
        system_area: 'integrations',
        issue_title: 'TIKTOK_CLIENT_KEY may have leading/trailing space',
        severity: 'high',
        detected_by: 'SystemAudit',
        recommended_fix: 'Open developers.tiktok.com → your app → copy Client Key fresh → paste into Base44 Settings → TIKTOK_CLIENT_KEY with NO spaces. Then test OAuth at /admin/tiktok-platform-review.',
        status: 'open',
        risk_type: 'reputation',
      },
      {
        system_area: 'integrations',
        issue_title: 'TikTok OAuth live test not yet completed',
        severity: 'high',
        detected_by: 'SystemAudit',
        recommended_fix: 'After updating TIKTOK_CLIENT_KEY and TIKTOK_CLIENT_SECRET: go to /admin/tiktok-platform-review → click Connect TikTok → complete consent flow → confirm creator profile appears.',
        status: 'open',
        risk_type: 'reputation',
      },
      {
        system_area: 'payments',
        issue_title: 'Live checkout flow not yet end-to-end tested',
        severity: 'high',
        detected_by: 'SystemAudit',
        recommended_fix: 'After Stripe webhook rotation: go to gannonwaye.com/store → complete a real purchase → verify order in /admin/orders, receipt email sent, webhook event in Stripe dashboard.',
        status: 'open',
        risk_type: 'payment',
      },
      {
        system_area: 'other',
        issue_title: 'Playwright browser QA not yet run',
        severity: 'warning',
        detected_by: 'SystemAudit',
        recommended_fix: 'Download test pack from /admin/playwright-test-centre → run against gannonwaye.com from a terminal with Node.js/Playwright installed → import results.',
        status: 'open',
        risk_type: 'none',
      },
      {
        system_area: 'approvals',
        issue_title: 'ApprovalQueue full-chain proof not completed',
        severity: 'warning',
        detected_by: 'SystemAudit',
        recommended_fix: 'Go to /admin/approval-queue → find a pending bundle proposal → click Approve → confirm BundleOffer appears in /admin/offer-engine. This proves the full auto-action chain.',
        status: 'open',
        risk_type: 'none',
      },
    ];

    const created = [];
    for (const issue of ISSUES) {
      if (!existingTitles.has(issue.issue_title)) {
        await base44.asServiceRole.entities.SystemHealthIssue.create({
          ...issue,
          last_checked: new Date().toISOString(),
        });
        created.push(issue.issue_title);
      }
    }

    // Also create AdminNotifications for critical ones if not already present
    const existingNotifs = await base44.asServiceRole.entities.AdminNotification.filter({ is_read: false }, '-created_date', 20);
    const existingNotifTitles = new Set(existingNotifs.map(n => n.title));

    const NOTIFS = [
      {
        notification_type: 'payment_warning',
        severity: 'critical',
        title: '🔴 ACTION REQUIRED: Rotate Stripe Webhook Secret',
        summary: 'Open dashboard.stripe.com/webhooks → roll signing secret → paste into Base44 Secrets. Do this before any live checkout testing.',
        source: 'SystemAudit',
        requires_action: true,
        linked_route: '/admin/guided-setup-concierge',
        is_read: false,
      },
      {
        notification_type: 'system',
        severity: 'high',
        title: '🟡 ACTION REQUIRED: TikTok Client Key needs re-entry (no spaces)',
        summary: 'Go to developers.tiktok.com → copy Client Key → re-enter in Base44 Secrets with NO spaces. Then test OAuth at /admin/tiktok-platform-review.',
        source: 'SystemAudit',
        requires_action: true,
        linked_route: '/admin/guided-setup-concierge',
        is_read: false,
      },
    ];

    const notifsCreated = [];
    for (const notif of NOTIFS) {
      if (!existingNotifTitles.has(notif.title)) {
        await base44.asServiceRole.entities.AdminNotification.create(notif);
        notifsCreated.push(notif.title);
      }
    }

    return Response.json({
      success: true,
      issues_created: created,
      notifications_created: notifsCreated,
      issues_skipped: ISSUES.length - created.length,
      message: `Health seed complete. ${created.length} new issues, ${notifsCreated.length} new notifications.`,
    });

  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});