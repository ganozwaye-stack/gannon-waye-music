import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);

    // Fetch recent data for context
    const [alerts, pending, recentLogs, ideas] = await Promise.all([
      base44.asServiceRole.entities.RiskAlert.filter({ status: 'open' }),
      base44.asServiceRole.entities.ApprovalQueue.filter({ status: 'pending' }),
      base44.asServiceRole.entities.AgentTaskLog.list('-created_date', 20),
      base44.asServiceRole.entities.IdeaOpportunity.filter({ status: 'new' }),
    ]);

    const today = new Date().toLocaleDateString('en-AU', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

    const contextSummary = `
Today is ${today}.
Open risk alerts: ${alerts.length} (${alerts.filter(a => a.severity === 'critical').length} critical)
Pending approvals: ${pending.length}
Recent agent actions (last 24h): ${recentLogs.length}
New opportunities in pipeline: ${ideas.length}

Critical alerts: ${alerts.filter(a => a.severity === 'critical').map(a => a.title).join(', ') || 'None'}
Pending items: ${pending.slice(0, 3).map(p => p.action_title).join(', ') || 'None'}
Top new idea: ${ideas.sort((a, b) => (b.opportunity_score || 0) - (a.opportunity_score || 0))[0]?.title || 'None yet'}
    `.trim();

    const briefResult = await base44.asServiceRole.integrations.Core.InvokeLLM({
      prompt: `You are the Gannon Core AI Executive Briefing System. Based on the following system data, generate a daily executive morning brief for the artist/business owner.

System Data:
${contextSummary}

Generate a concise Daily Executive Brief covering:
1. TODAY'S TOP PRIORITY (single most important thing to do today)
2. BEST MONEY OPPORTUNITY (highest ROI action available right now)
3. BIGGEST RISK (most urgent risk to address)
4. BEST CONTENT IDEA (viral/engagement opportunity for today)
5. BEST SYSTEM IMPROVEMENT (one automation or workflow improvement)
6. BEST CLIENT/SERVICE OPPORTUNITY (commercial or partnership lead)
7. WHAT TO IGNORE TODAY (things that can wait or be deprioritized)
8. WHAT NEEDS APPROVAL (items requiring human decision)

Format: Clear headings, concise bullets, action-oriented language. Keep total under 400 words.`,
    });

    // Save to Knowledge Vault
    const briefDate = new Date().toISOString().split('T')[0];
    await base44.asServiceRole.entities.KnowledgeVault.create({
      title: `Daily Executive Brief — ${briefDate}`,
      category: 'decision_history',
      content: briefResult,
      summary: `Executive brief for ${briefDate}. ${alerts.length} alerts, ${pending.length} pending approvals.`,
      source: 'Executive Morning Brief (Scheduled)',
      access_level: 'admin_only',
      is_sensitive: false,
      tags: ['daily-brief', 'executive', briefDate],
    });

    // Log the task
    await base44.asServiceRole.entities.AgentTaskLog.create({
      agent_name: 'Executive Brief Agent',
      task_title: `Daily Executive Brief — ${briefDate}`,
      task_description: `Generated morning brief with ${alerts.length} alerts and ${pending.length} approvals`,
      outcome: 'Saved to Knowledge Vault',
      was_automatic: true,
      required_approval: false,
      risk_check_result: 'pass',
      tags: ['daily-brief', 'scheduled'],
    });

    // Send brief to Slack
    try {
      const slackSummary = briefResult.substring(0, 800).replace(/\n{3,}/g, '\n\n');
      await base44.asServiceRole.functions.invoke('sendSlackAlert', {
        channel: '#gannon-alerts',
        title: `Daily Brief — ${briefDate}`,
        urgency: alerts.filter(a => a.severity === 'critical').length > 0 ? 'high' : 'normal',
        message: `*📋 Today's Executive Brief*\n\n${slackSummary}${briefResult.length > 800 ? '\n\n_...see Knowledge Vault for full brief_' : ''}`,
        fields: [
          { label: '🚨 Open Alerts', value: String(alerts.length) },
          { label: '⏳ Pending Approvals', value: String(pending.length) },
          { label: '💡 New Ideas', value: String(ideas.length) },
        ],
        action_url: 'https://gannonwaye.base44.app/admin/executive-feed',
        category: 'brief',
      });
    } catch (_slackErr) {
      // Slack alert is non-blocking — brief still succeeds if Slack fails
    }

    return Response.json({
      success: true,
      date: briefDate,
      brief: briefResult,
      context: { alerts: alerts.length, pending: pending.length, ideas: ideas.length },
    });

  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});