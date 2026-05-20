import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

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

    const alertSummary = {
      timestamp: new Date().toISOString(),
      total_open_alerts: alerts.length,
      critical_count: criticalAlerts.length,
      high_count: highAlerts.length,
      pending_approvals: pendingApprovals.length,
      recent_errors: recentErrors.length,
      agent_active: agentActivity.length > 0,
    };

    // Trigger Slack notification if there are critical alerts or escalations
    if (criticalAlerts.length > 0 || recentErrors.length > 0) {
      const criticalList = criticalAlerts.map(a => `• ${a.title} (${a.alert_type})`).join('\n');
      const escalatedList = recentErrors.map(e => `• ${e.task_title}`).join('\n');

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
        action_url: 'https://gannonwaye.base44.app/admin/risk-alerts',
      });
    }

    return Response.json({ success: true, summary: alertSummary });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});