import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

// Core alert dispatcher — evaluates system state and triggers Slack/email alerts
// Called by automations or scheduled tasks to assess risks and notify
Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);

    const [
      alerts,
      pendingApprovals,
      recentErrors,
      agentActivity,
    ] = await Promise.all([
      base44.asServiceRole.entities.RiskAlert.filter({ status: 'open' }),
      base44.asServiceRole.entities.ApprovalQueue.filter({ status: 'pending' }),
      base44.asServiceRole.entities.AgentTaskLog.filter({ risk_check_result: { $in: ['blocked', 'escalated'] } }, '-created_date', 10),
      base44.asServiceRole.entities.AgentTaskLog.list('-created_date', 20),
    ]);

    const criticalAlerts = alerts.filter(a => a.severity === 'critical');
    const highAlerts = alerts.filter(a => a.severity === 'high');

    // ── ACTIVE MONITORING: PLATFORM DISCONNECTS ──
    let slackConnected = false;
    let gmailConnected = false;
    try {
      const slack = await base44.asServiceRole.connectors.getConnection('slack');
      if (slack?.accessToken) slackConnected = true;
    } catch (_) {}
    try {
      const gmail = await base44.asServiceRole.connectors.getConnection('gmail');
      if (gmail?.accessToken) gmailConnected = true;
    } catch (_) {}

    if (!slackConnected) {
      const existing = await base44.asServiceRole.entities.SystemHealthIssue.filter({
        issue_title: 'Slack Connector Disconnected',
        status: 'open'
      });
      if (existing.length === 0) {
        await base44.asServiceRole.entities.SystemHealthIssue.create({
          issue_title: 'Slack Connector Disconnected',
          system_area: 'integrations',
          severity: 'warning',
          status: 'open',
          recommended_fix: 'Reauthorize Slack integration in Base44 Dashboard.',
          detected_by: 'autonomousAlertSystem',
          last_checked: new Date().toISOString(),
        });
        await base44.asServiceRole.functions.invoke('notifyAdmin', {
          notification_type: 'platform_disconnect',
          severity: 'warning',
          title: '🔌 Slack Disconnected',
          summary: 'Slack connector is not authorized. Alerts cannot be delivered to Slack.',
          requires_action: true,
          linked_route: '/admin/api-setup',
          source: 'autonomousAlertSystem',
        }).catch(() => {});
      }
    }

    if (!gmailConnected) {
      const existing = await base44.asServiceRole.entities.SystemHealthIssue.filter({
        issue_title: 'Gmail Connector Disconnected',
        status: 'open'
      });
      if (existing.length === 0) {
        await base44.asServiceRole.entities.SystemHealthIssue.create({
          issue_title: 'Gmail Connector Disconnected',
          system_area: 'integrations',
          severity: 'warning',
          status: 'open',
          recommended_fix: 'Reauthorize Gmail integration in Base44 Dashboard.',
          detected_by: 'autonomousAlertSystem',
          last_checked: new Date().toISOString(),
        });
        await base44.asServiceRole.functions.invoke('notifyAdmin', {
          notification_type: 'platform_disconnect',
          severity: 'warning',
          title: '🔌 Gmail Disconnected',
          summary: 'Gmail connector is not authorized. Emails cannot be sent to subscribers or admin.',
          requires_action: true,
          linked_route: '/admin/api-setup',
          source: 'autonomousAlertSystem',
        }).catch(() => {});
      }
    }

    // Check TikTok connection in KnowledgeVault
    const tiktokVault = await base44.asServiceRole.entities.KnowledgeVault.filter({
      source: 'tiktok_oauth'
    }, '-created_date', 1);
    if (tiktokVault.length === 0) {
      const existing = await base44.asServiceRole.entities.SystemHealthIssue.filter({
        issue_title: 'TikTok OAuth Disconnected',
        status: 'open'
      });
      if (existing.length === 0) {
        await base44.asServiceRole.entities.SystemHealthIssue.create({
          issue_title: 'TikTok OAuth Disconnected',
          system_area: 'integrations',
          severity: 'warning',
          status: 'open',
          recommended_fix: 'Reconnect TikTok OAuth in Gannon Waye Admin panel.',
          detected_by: 'autonomousAlertSystem',
          last_checked: new Date().toISOString(),
        });
        await base44.asServiceRole.functions.invoke('notifyAdmin', {
          notification_type: 'platform_disconnect',
          severity: 'warning',
          title: '🔌 TikTok Disconnected',
          summary: 'TikTok OAuth connection is not found. Automated posting and video fetching are disabled.',
          requires_action: true,
          linked_route: '/admin/api-setup',
          source: 'autonomousAlertSystem',
        }).catch(() => {});
      }
    }

    // ── ACTIVE MONITORING: STRIPE/WEBHOOK ISSUES ──
    const openDiagnostics = await base44.asServiceRole.entities.PaymentDiagnostic.filter({
      status: 'open',
      diagnostic_type: { $in: ['webhook_signature_failure', 'webhook_processing_error'] }
    });
    if (openDiagnostics.length > 0) {
      await base44.asServiceRole.functions.invoke('notifyAdmin', {
        notification_type: 'payment_warning',
        severity: 'critical',
        title: '⚠️ Active Stripe Webhook Issues',
        summary: `Detected ${openDiagnostics.length} unresolved Stripe webhook signature/processing errors.`,
        requires_action: true,
        linked_route: '/admin/webhook-health',
        source: 'autonomousAlertSystem',
      }).catch(() => {});
    }

    // ── ACTIVE MONITORING: CONVERSION SPIKES ──
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    const recentOrders = await base44.asServiceRole.entities.MerchOrder.filter({
      created_date: { $gte: oneDayAgo }
    });
    if (recentOrders.length >= 5) {
      await base44.asServiceRole.functions.invoke('notifyAdmin', {
        notification_type: 'growth_spike',
        severity: 'high',
        title: '🔥 Store Conversion Spike Detected!',
        summary: `We have received ${recentOrders.length} orders in the last 24 hours. Checkouts are converting rapidly.`,
        requires_action: false,
        linked_route: '/admin/orders',
        source: 'autonomousAlertSystem',
      }).catch(() => {});
    }

    // ── ACTIVE MONITORING: ENGAGEMENT SPIKES ──
    const recentMemories = await base44.asServiceRole.entities.MusicAgentMemory.filter({
      tags: { $in: ['metricool_import'] },
      created_date: { $gte: oneDayAgo }
    });
    for (const mem of recentMemories) {
      if (mem.summary.includes('reach=') || mem.summary.includes('engagement=')) {
        const reachMatch = mem.summary.match(/reach=(\d+)/);
        const reach = reachMatch ? parseInt(reachMatch[1], 10) : 0;
        if (reach > 10000) {
          await base44.asServiceRole.functions.invoke('notifyAdmin', {
            notification_type: 'growth_spike',
            severity: 'high',
            title: '📈 Social Engagement Spike!',
            summary: `Social reach has spiked to ${reach} on ${mem.tags[0] || 'socials'}.`,
            requires_action: false,
            linked_route: '/admin/social-analytics',
            source: 'autonomousAlertSystem',
          }).catch(() => {});
        }
      }
    }

    // ── ACTIVE MONITORING: PLAYLIST SUPPORT ──
    const playlistMemories = await base44.asServiceRole.entities.MusicAgentMemory.filter({
      tags: { $in: ['playlist', 'pitch_success'] },
      created_date: { $gte: oneDayAgo }
    });
    for (const mem of playlistMemories) {
      await base44.asServiceRole.functions.invoke('notifyAdmin', {
        notification_type: 'growth_spike',
        severity: 'info',
        title: '🎵 Playlist Placement Success!',
        summary: `Gannon's track was added to a new playlist: ${mem.summary}`,
        requires_action: false,
        linked_route: '/admin/growth-engine',
        source: 'autonomousAlertSystem',
      }).catch(() => {});
    }

    // ── ORIGINAL SUMMARY AND SLACK NOTIFICATION ──
    const alertSummary = {
      timestamp: new Date().toISOString(),
      total_open_alerts: alerts.length,
      critical_count: criticalAlerts.length,
      high_count: highAlerts.length,
      pending_approvals: pendingApprovals.length,
      recent_errors: recentErrors.length,
      agent_active: agentActivity.length > 0,
    };

    if (criticalAlerts.length > 0 || recentErrors.length > 0) {
      const criticalList = criticalAlerts.map(a => `• ${a.title} (${a.alert_type})`).join('\n');
      const escalatedList = recentErrors.map(e => `• ${e.task_title}`).join('\n');

      try {
        await base44.asServiceRole.functions.invoke('sendSlackAlert', {
          channel: '#gannon-alerts',
          title: '🚨 System Alert Summary',
          urgency: 'critical',
          message: `*${criticalAlerts.length} Critical Issues Detected*\n\n${criticalList || 'None'}\n\n*Recent Escalations:*\n${escalatedList || 'None'}`,
          fields: [
            { label: '🚨 Critical', value: String(criticalAlerts.length) },
            { label: '⚠️ High', value: String(highAlerts.length) },
            { label: '⏳ Pending', value: String(pendingApprovals.length) },
          ],
          action_url: 'https://gannonwaye.com/admin/risk-alerts',
        });
      } catch (_) {
        // Slack optional — don't fail the alert system
      }
    }

    return Response.json({ success: true, summary: alertSummary });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});