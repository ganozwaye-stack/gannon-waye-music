import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

const TIME_ZONE = 'Australia/Melbourne';
const PRIORITY_ORDER = { critical: 0, high: 1, medium: 2, low: 3 };
const STATUS_ORDER = {
  in_progress: 0,
  needs_approval: 1,
  blocked: 2,
  scheduled: 3,
  not_started: 4,
  deferred: 5,
  complete: 6,
};

const PUBLIC_SITES = [
  { name: 'gannonwaye.com', url: 'https://gannonwaye.com/' },
  { name: 'Gannon Waye Base44', url: 'https://gannonwaye.base44.app/' },
  { name: 'GanozMix Direct', url: 'https://ganozmixdirect.base44.app/' },
];

function localParts(date = new Date()) {
  const parts = new Intl.DateTimeFormat('en-AU', {
    timeZone: TIME_ZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(date);
  const value = (type) => parts.find((part) => part.type === type)?.value || '';
  return {
    year: Number(value('year')),
    month: Number(value('month')),
    day: Number(value('day')),
    hour: Number(value('hour')),
    minute: Number(value('minute')),
  };
}

function localLabel(date = new Date()) {
  return new Intl.DateTimeFormat('en-AU', {
    timeZone: TIME_ZONE,
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).format(date);
}

function scheduleAllowsRun(parts, force) {
  if (force) return true;
  if (parts.hour >= 9 && parts.hour <= 15) return true;
  return parts.hour % 2 === 0;
}

function taskSort(a, b) {
  const priorityDifference = (PRIORITY_ORDER[a.priority] ?? 9) - (PRIORITY_ORDER[b.priority] ?? 9);
  if (priorityDifference !== 0) return priorityDifference;

  const statusDifference = (STATUS_ORDER[a.status] ?? 9) - (STATUS_ORDER[b.status] ?? 9);
  if (statusDifference !== 0) return statusDifference;

  const aDue = a.due_date ? Date.parse(`${a.due_date}T00:00:00`) : Number.MAX_SAFE_INTEGER;
  const bDue = b.due_date ? Date.parse(`${b.due_date}T00:00:00`) : Number.MAX_SAFE_INTEGER;
  if (aDue !== bDue) return aDue - bDue;

  return Number(a.sort_order || 0) - Number(b.sort_order || 0);
}

function taskLine(task) {
  const details = [task.priority?.toUpperCase(), task.status?.replaceAll('_', ' ')];
  if (task.due_date) details.push(`due ${task.due_date}`);
  if (task.owner) details.push(task.owner);
  return `1. ${task.title} (${details.filter(Boolean).join(', ')})${task.next_action ? `\n   Next: ${task.next_action}` : ''}`;
}

async function parsePayload(req) {
  try {
    if (!req.body) return {};
    return await req.json();
  } catch {
    return {};
  }
}

async function checkSite(site) {
  const started = Date.now();
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 12000);
  try {
    const response = await fetch(site.url, {
      method: 'GET',
      redirect: 'follow',
      signal: controller.signal,
      headers: { 'User-Agent': 'DeegoOperationalAudit/1.0' },
    });
    return {
      ...site,
      ok: response.ok,
      status: response.status,
      latency_ms: Date.now() - started,
      final_url: response.url,
    };
  } catch (error) {
    return {
      ...site,
      ok: false,
      status: 0,
      latency_ms: Date.now() - started,
      error: error.message,
    };
  } finally {
    clearTimeout(timer);
  }
}

async function gmailSnapshot(base44) {
  try {
    const connection = await base44.asServiceRole.connectors.getConnection('gmail');
    const accessToken = connection?.accessToken;
    if (!accessToken) {
      return { connected: false, messages: [], error: 'Gmail connector is not authorised.' };
    }

    const query = 'newer_than:2d -in:spam -in:trash {Base44 eBay stock listing Deego Codex Claude Gemini gannonwaye.com automation payment}';
    const listUrl = `https://gmail.googleapis.com/gmail/v1/users/me/messages?maxResults=12&q=${encodeURIComponent(query)}`;
    const listResponse = await fetch(listUrl, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!listResponse.ok) {
      return {
        connected: true,
        messages: [],
        error: `Gmail search failed with HTTP ${listResponse.status}.`,
      };
    }

    const listData = await listResponse.json();
    const ids = (listData.messages || []).slice(0, 8).map((item) => item.id);
    const messages = await Promise.all(ids.map(async (id) => {
      try {
        const url = `https://gmail.googleapis.com/gmail/v1/users/me/messages/${id}?format=metadata&metadataHeaders=Subject&metadataHeaders=From&metadataHeaders=Date`;
        const response = await fetch(url, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        if (!response.ok) return null;
        const data = await response.json();
        const headers = data.payload?.headers || [];
        const header = (name) => headers.find((item) => item.name?.toLowerCase() === name.toLowerCase())?.value || '';
        return {
          id,
          subject: header('Subject') || '(no subject)',
          from: header('From') || '(unknown sender)',
          date: header('Date') || '',
          snippet: data.snippet || '',
          unread: Array.isArray(data.labelIds) && data.labelIds.includes('UNREAD'),
        };
      } catch {
        return null;
      }
    }));

    return {
      connected: true,
      messages: messages.filter(Boolean),
      error: null,
    };
  } catch (error) {
    return { connected: false, messages: [], error: error.message };
  }
}

function safeDate(value) {
  const time = value ? Date.parse(value) : NaN;
  return Number.isFinite(time) ? time : 0;
}

Deno.serve(async (req) => {
  const startedAt = new Date();
  const payload = await parsePayload(req);
  const parts = localParts(startedAt);
  const force = payload?.force === true;

  if (!scheduleAllowsRun(parts, force)) {
    return Response.json({
      success: true,
      skipped: true,
      reason: 'Outside the requested reporting slot. The next eligible Melbourne hour will run automatically.',
      local_time: localLabel(startedAt),
    });
  }

  const base44 = createClientFromRequest(req);
  let runRecord = null;

  try {
    runRecord = await base44.asServiceRole.entities.DeegoAutomationRun.create({
      run_name: 'Deego Operational Audit Check Up',
      mode_key: 'operational_audit',
      trigger_source: payload?.local_snapshot ? 'handoff' : 'scheduled',
      started_at: startedAt.toISOString(),
      status: 'running',
      summary: `Operational audit started at ${localLabel(startedAt)}.`,
      approval_items_created: 0,
      revenue_items_created: 0,
      design_items_created: 0,
      blockers: [],
    });

    const [
      allTasks,
      approvalItems,
      blockedItems,
      riskAlerts,
      taskLogs,
      recentRuns,
      paymentDiagnostics,
      siteChecks,
      gmail,
    ] = await Promise.all([
      base44.asServiceRole.entities.DailyDashboardTask.list('sort_order', 500),
      base44.asServiceRole.entities.ApprovalQueueItem.list('-created_date', 200),
      base44.asServiceRole.entities.BlockedItem.list('-created_date', 200),
      base44.asServiceRole.entities.RiskAlert.list('-created_date', 100),
      base44.asServiceRole.entities.AgentTaskLog.list('-created_date', 100),
      base44.asServiceRole.entities.DeegoAutomationRun.list('-started_at', 30),
      base44.asServiceRole.entities.PaymentDiagnostic.list('-created_date', 100),
      Promise.all(PUBLIC_SITES.map(checkSite)),
      gmailSnapshot(base44),
    ]);

    const nowMs = startedAt.getTime();
    const reportWindowHours = parts.hour >= 9 && parts.hour <= 15 ? 1.25 : 2.25;
    const reportWindowStart = nowMs - reportWindowHours * 60 * 60 * 1000;

    const openTasks = allTasks
      .filter((task) => task.status !== 'complete' && task.status !== 'deferred')
      .sort(taskSort);
    const completedRecently = allTasks
      .filter((task) => task.status === 'complete' && safeDate(task.updated_date) >= reportWindowStart)
      .sort((a, b) => safeDate(b.updated_date) - safeDate(a.updated_date));
    const processing = openTasks.filter((task) => ['in_progress', 'scheduled'].includes(task.status));
    const waiting = openTasks.filter((task) => ['blocked', 'needs_approval'].includes(task.status));

    const openApprovals = approvalItems.filter((item) => !['complete', 'approved', 'rejected', 'deferred', 'cancelled'].includes(item.status));
    const activeBlockers = blockedItems.filter((item) => !['complete', 'resolved', 'dismissed'].includes(item.status));
    const openRisks = riskAlerts.filter((item) => !['resolved', 'dismissed', 'closed'].includes(item.status));
    const openPayments = paymentDiagnostics.filter((item) => item.status === 'open');

    const recentAgentWork = taskLogs.filter((item) => safeDate(item.created_date) >= reportWindowStart);
    const failedRecentRuns = recentRuns.filter((item) =>
      item.id !== runRecord?.id &&
      ['failed', 'blocked'].includes(item.status) &&
      safeDate(item.started_at || item.created_date) >= nowMs - 24 * 60 * 60 * 1000
    );

    const topTasks = openTasks.slice(0, 12);
    const criticalTasks = openTasks.filter((task) => task.priority === 'critical');
    const failedSites = siteChecks.filter((site) => !site.ok);
    const laptopSnapshot = payload?.local_snapshot || null;

    const completedLines = [
      ...completedRecently.slice(0, 8).map(taskLine),
      ...recentAgentWork.slice(0, 8).map((item) => `1. ${item.task_title || item.agent_name || 'Agent work'}${item.outcome ? `: ${item.outcome}` : ''}`),
    ];

    const processingLines = processing.slice(0, 10).map(taskLine);
    const missingLines = [
      ...waiting.slice(0, 10).map(taskLine),
      ...failedSites.map((site) => `1. ${site.name} did not pass the public health check${site.status ? ` (HTTP ${site.status})` : ''}.`),
      ...failedRecentRuns.slice(0, 5).map((run) => `1. Automation run failed or was blocked: ${run.run_name}. ${run.summary || ''}`),
    ];

    if (!gmail.connected || gmail.error) {
      missingLines.push(`1. Gmail audit coverage needs attention: ${gmail.error || 'connector unavailable'}`);
    }
    if (!laptopSnapshot) {
      missingLines.push('1. Laptop activity snapshot is not connected to this run. Install and enable the local Deego audit runner to include browser activity, running apps, recent files and Git work.');
    }
    missingLines.push('1. Outlook, ChatGPT, Gemini, Codex and Claude private conversation contents are not available to this Base44 function. The audit can record local site activity and connection status, but it does not read passwords, keystrokes or private message text.');

    const gmailLines = gmail.messages.length > 0
      ? gmail.messages.map((message) => `1. ${message.unread ? 'UNREAD: ' : ''}${message.subject} from ${message.from}`).join('\n')
      : 'No matching recent operational email metadata was returned.';

    const siteLines = siteChecks
      .map((site) => `1. ${site.name}: ${site.ok ? 'online' : 'FAILED'}${site.status ? `, HTTP ${site.status}` : ''}, ${site.latency_ms} ms`)
      .join('\n');

    const localLines = laptopSnapshot
      ? `Local runner supplied ${laptopSnapshot.recent_files_count || 0} recent files, ${laptopSnapshot.running_work_count || 0} running work signals and ${laptopSnapshot.browser_activity_count || 0} tracked browser activity records.`
      : 'No local laptop snapshot was supplied.';

    const reportTitle = `Deego Operational Audit — ${localLabel(startedAt)}`;
    const reportContent = `# ${reportTitle}\n\n## Completed since the previous reporting window\n${completedLines.length ? completedLines.join('\n') : 'No newly completed Deego task was recorded in this reporting window.'}\n\n## Being processed\n${processingLines.length ? processingLines.join('\n') : 'No task is currently marked in progress or scheduled.'}\n\n## Missing, blocked or needing help\n${missingLines.length ? missingLines.join('\n') : 'No active blocker was detected.'}\n\n## Highest priority continually updated to do list\n${topTasks.length ? topTasks.map(taskLine).join('\n') : 'No open Deego tasks.'}\n\n## Platform and site health\n${siteLines}\n\n## Recent operational Gmail metadata\n${gmailLines}\n\n## Laptop activity coverage\n${localLines}\n\n## Counts\n1. Open tasks: ${openTasks.length}\n1. Critical tasks: ${criticalTasks.length}\n1. Open approvals: ${openApprovals.length}\n1. Active blockers: ${activeBlockers.length}\n1. Open risks: ${openRisks.length}\n1. Open payment diagnostics: ${openPayments.length}\n1. Recent agent actions: ${recentAgentWork.length}\n`;

    const vaultRecord = await base44.asServiceRole.entities.KnowledgeVault.create({
      title: reportTitle,
      category: 'action_history',
      content: reportContent,
      summary: `${openTasks.length} open tasks, ${criticalTasks.length} critical, ${openApprovals.length} approvals, ${activeBlockers.length} blockers. Top priority: ${topTasks[0]?.title || 'none'}.`,
      source: 'Deego Operational Audit Check Up',
      access_level: 'admin_only',
      is_sensitive: true,
      tags: ['deego-audit', 'operational-check-up', `${parts.year}-${String(parts.month).padStart(2, '0')}-${String(parts.day).padStart(2, '0')}`],
      linked_agent: 'deego_operations_controller',
    });

    const severity = criticalTasks.length > 0 || failedSites.length > 0 || failedRecentRuns.length > 0
      ? 'critical'
      : waiting.length > 0 || openApprovals.length > 0
        ? 'high'
        : 'info';

    await base44.asServiceRole.entities.AdminNotification.create({
      notification_type: failedRecentRuns.length > 0 ? 'automation_failed' : 'system',
      severity,
      title: `Deego audit: ${topTasks[0]?.title || 'No open tasks'}`,
      summary: `${openTasks.length} open, ${processing.length} processing, ${waiting.length} blocked or awaiting approval. Full report saved to Knowledge Vault.`,
      source: 'autonomousAlertSystem',
      requires_action: severity === 'critical' || severity === 'high',
      linked_entity: 'KnowledgeVault',
      linked_id: vaultRecord.id,
      linked_route: '/admin/knowledge-vault',
      is_read: false,
      delivered_slack: false,
      delivered_email: false,
    });

    const blockers = [
      ...waiting.slice(0, 10).map((task) => task.title),
      ...failedSites.map((site) => `${site.name} health check failed`),
      ...failedRecentRuns.map((run) => `${run.run_name} ${run.status}`),
      ...(!laptopSnapshot ? ['Local laptop runner not connected'] : []),
    ].slice(0, 20);

    await base44.asServiceRole.entities.DeegoAutomationRun.update(runRecord.id, {
      completed_at: new Date().toISOString(),
      status: waiting.length > 0 || failedSites.length > 0 || failedRecentRuns.length > 0 ? 'needs_approval' : 'success',
      summary: `${openTasks.length} open tasks. ${processing.length} processing. ${completedRecently.length} recently completed. ${waiting.length} blocked or awaiting approval. Top priority: ${topTasks[0]?.title || 'none'}.`,
      approval_items_created: 0,
      revenue_items_created: 0,
      design_items_created: 0,
      blockers,
      next_run_hint: parts.hour >= 9 && parts.hour < 15 ? 'Next hourly Melbourne check.' : 'Next eligible Melbourne schedule slot.',
    });

    return Response.json({
      success: true,
      local_time: localLabel(startedAt),
      report_id: vaultRecord.id,
      run_id: runRecord.id,
      counts: {
        open_tasks: openTasks.length,
        critical_tasks: criticalTasks.length,
        processing: processing.length,
        completed_recently: completedRecently.length,
        waiting: waiting.length,
        approvals: openApprovals.length,
        blockers: activeBlockers.length,
        failed_sites: failedSites.length,
        gmail_messages: gmail.messages.length,
      },
      top_priorities: topTasks.slice(0, 5).map((task) => ({
        title: task.title,
        priority: task.priority,
        status: task.status,
        due_date: task.due_date || null,
        next_action: task.next_action || null,
      })),
      coverage: {
        gmail: gmail.connected && !gmail.error,
        public_sites: true,
        laptop_snapshot: Boolean(laptopSnapshot),
        outlook_private_content: false,
        chat_private_content: false,
      },
    });
  } catch (error) {
    if (runRecord?.id) {
      try {
        await base44.asServiceRole.entities.DeegoAutomationRun.update(runRecord.id, {
          completed_at: new Date().toISOString(),
          status: 'failed',
          summary: `Operational audit failed: ${error.message}`,
          blockers: [error.message],
          next_run_hint: 'Review function logs, fix the failure and re-enable the scheduled automation if Base44 pauses it.',
        });
      } catch {
        // Preserve the original failure.
      }
    }

    return Response.json({
      success: false,
      error: error.message,
      local_time: localLabel(startedAt),
    }, { status: 500 });
  }
});
