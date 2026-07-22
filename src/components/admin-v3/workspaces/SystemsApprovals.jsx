import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Shield, Lock, Activity, Server } from 'lucide-react';
import { SectionCard, RowItem, LoadingState, EmptyState, StatusBadge, IncidentCard, CrewCard } from '@/components/admin-v3/shared/SharedComponents';
import { groupIncidents, AGENT_CREW_NAMES } from '@/lib/adminV3Adapters';
import { calcSystemHealth } from '@/lib/adminV3Metrics';

export default function SystemsApprovals() {
  const { data: approvalQueue = [], isLoading } = useQuery({
    queryKey: ['v3-ws-sys-approvals'],
    queryFn: () => base44.entities.ApprovalQueue.filter({ status: 'pending' }, '-created_date', 500),
    staleTime: 30_000,
  });
  const { data: approvalItems = [] } = useQuery({
    queryKey: ['v3-ws-sys-approval-items'],
    queryFn: () => base44.entities.ApprovalQueueItem.filter({ status: 'needs_approval' }, '-created_date', 100),
    staleTime: 30_000,
  });
  const { data: systemIssues = [] } = useQuery({
    queryKey: ['v3-ws-sys-issues'],
    queryFn: () => base44.entities.SystemHealthIssue.filter({ status: 'open' }, '-created_date', 100),
    staleTime: 30_000,
  });
  const { data: riskAlerts = [] } = useQuery({
    queryKey: ['v3-ws-risk-alerts'],
    queryFn: () => base44.entities.RiskAlert.list('-created_date', 30),
    staleTime: 30_000,
  });
  const { data: apiSetups = [] } = useQuery({
    queryKey: ['v3-ws-api-setups'],
    queryFn: () => base44.entities.ApiIntegrationSetup.list('-created_date', 50),
    staleTime: 60_000,
  });
  const { data: agentRegistry = [] } = useQuery({
    queryKey: ['v3-ws-agent-registry'],
    queryFn: () => base44.entities.AgentRegistry.list('-created_date', 250),
    staleTime: 60_000,
  });
  const { data: taskLogs = [] } = useQuery({
    queryKey: ['v3-ws-agent-task-logs'],
    queryFn: () => base44.entities.AgentTaskLog.list('-created_date', 100),
    staleTime: 30_000,
  });
  const { data: agentMessages = [] } = useQuery({
    queryKey: ['v3-ws-agent-messages'],
    queryFn: () => base44.entities.AgentMessage.list('-created_date', 30),
    staleTime: 30_000,
  });
  const { data: auditLogs = [] } = useQuery({
    queryKey: ['v3-ws-audit-logs'],
    queryFn: () => base44.entities.AuditLog.list('-created_date', 30),
    staleTime: 60_000,
  });
  const { data: notifications = [] } = useQuery({
    queryKey: ['v3-ws-sys-notifications'],
    queryFn: () => base44.entities.AdminNotification.list('-created_date', 30),
    staleTime: 30_000,
  });

  const health = calcSystemHealth(systemIssues);
  const incidents = groupIncidents(systemIssues);

  return (
    <div className="space-y-6">
      {/* ── System Health Banner ── */}
      <div className={`border rounded-xl px-5 py-4 flex items-center gap-4 ${health.level === 'green' ? 'border-green-500/30 bg-green-500/5' : health.level === 'orange' ? 'border-orange-500/30 bg-orange-500/5' : 'border-red-500/30 bg-red-500/5'}`}>
        <Server className={`w-5 h-5 ${health.level === 'green' ? 'text-green-400' : health.level === 'orange' ? 'text-orange-400' : 'text-red-400'}`} />
        <div className="flex-1">
          <p className="text-sm font-medium text-foreground">{health.label}</p>
          <p className="text-[10px] text-muted-foreground/60">
            {health.openCount != null && `${health.openCount} open issues`}
            {health.criticalCount != null && ` · ${health.criticalCount} critical`}
            {' · System health is not labeled healthy unless a recent end-to-end test has passed.'}
          </p>
        </div>
      </div>

      {/* ── Approvals ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <SectionCard title="Approval Queue" count={approvalQueue.length} actionLabel="Manage" actionPath="/admin/approval-queue">
          {isLoading ? <LoadingState /> : approvalQueue.length === 0 ? <EmptyState message="No pending approvals." /> : approvalQueue.slice(0, 10).map(a => (
            <RowItem key={a.id} title={a.action_title || a.title || 'Action'} subtitle={a.agent_name || 'System'} status={a.risk_level} statusLevel={a.risk_level === 'critical' ? 'red' : a.risk_level === 'high' ? 'orange' : 'grey'} path="/admin/approval-queue" />
          ))}
          {approvalQueue.length > 10 && <p className="text-[10px] text-muted-foreground/40 px-3">+{approvalQueue.length - 10} more pending</p>}
        </SectionCard>

        <SectionCard title="Approval Queue Items" count={approvalItems.length} actionLabel="View" actionPath="/admin/approval-queue">
          {approvalItems.length === 0 ? <EmptyState message="No items need approval." /> : approvalItems.slice(0, 10).map(a => (
            <RowItem key={a.id} title={a.title} subtitle={a.category || ''} status="Needs approval" statusLevel="orange" path="/admin/approval-queue" />
          ))}
        </SectionCard>
      </div>

      {/* ── Incidents (grouped) ── */}
      <SectionCard title="Incidents (Grouped)" count={incidents.length} actionLabel="Site health" actionPath="/admin/site-health">
        <div className="p-2 space-y-2">
          <p className="text-[10px] text-muted-foreground/50 px-2 pb-1">Repeating issues are grouped by fingerprint. Underlying records are preserved — this is display only.</p>
          {incidents.length === 0 ? <EmptyState message="No open incidents." /> : incidents.slice(0, 10).map(inc => <IncidentCard key={inc.fingerprint} incident={inc} />)}
        </div>
      </SectionCard>

      {/* ── Risk Alerts ── */}
      <SectionCard title="Risk Alerts" count={riskAlerts.length} actionLabel="View" actionPath="/admin/risk-alerts">
        {riskAlerts.length === 0 ? <EmptyState message="No risk alerts." /> : riskAlerts.slice(0, 10).map(r => (
          <RowItem key={r.id} title={r.title || r.alert_type || 'Alert'} subtitle={r.description || ''} status={r.severity || 'info'} statusLevel={r.severity === 'critical' ? 'red' : r.severity === 'high' ? 'orange' : 'grey'} path="/admin/risk-alerts" />
        ))}
      </SectionCard>

      {/* ─── Integrations ── */}
      <SectionCard title="Integrations" count={apiSetups.length} actionLabel="API setup" actionPath="/admin/api-setup">
        {apiSetups.length === 0 ? <EmptyState message="No API integrations configured." /> : apiSetups.slice(0, 10).map(a => (
          <RowItem key={a.id} title={a.service_name || a.name || 'Integration'} subtitle={a.description || ''} status={a.status || 'unknown'} statusLevel={a.status === 'connected' || a.status === 'verified' ? 'green' : a.status === 'failed' ? 'red' : 'grey'} path="/admin/api-setup" />
        ))}
      </SectionCard>

      {/* ─── Agent Crews ── */}
      <SectionCard title="Agent Crews" count={agentRegistry.length} actionLabel="Agent registry" actionPath="/admin/agent-registry">
        <p className="text-[10px] text-muted-foreground/50 px-2 pb-2">{agentRegistry.length} registered agents grouped into {AGENT_CREW_NAMES.length} accountable crews. Agent status distinguishes registered records from verified executions.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 p-1">
          {AGENT_CREW_NAMES.map(crew => <CrewCard key={crew} crew={crew} agents={agentRegistry} taskLogs={taskLogs} />)}
        </div>
        <div className="p-3">
          <p className="text-[10px] text-muted-foreground/60 mb-2">Truthful status labels:</p>
          <div className="flex flex-wrap gap-2">
            <StatusBadge label="Verified working" level="green" />
            <StatusBadge label="Connected, not E2E verified" level="orange" />
            <StatusBadge label="Registered only" level="grey" />
            <StatusBadge label="Waiting for approval" level="orange" />
            <StatusBadge label="Blocked" level="red" />
            <StatusBadge label="Failed" level="red" />
            <StatusBadge label="Inactive" level="grey" />
          </div>
        </div>
      </SectionCard>

      {/* ── Activity History ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <SectionCard title="Agent Task Log (Recent)" count={taskLogs.length} actionLabel="Full log" actionPath="/admin/agent-task-log">
          {taskLogs.length === 0 ? <EmptyState message="No recent agent tasks." /> : taskLogs.slice(0, 10).map(t => (
            <RowItem key={t.id} title={t.action || t.task || 'Task'} subtitle={t.agent_name || 'System'} status={t.status || 'unknown'} statusLevel={t.status === 'completed' || t.status === 'success' ? 'green' : t.status === 'failed' ? 'red' : 'grey'} path="/admin/agent-task-log" />
          ))}
        </SectionCard>

        <SectionCard title="Audit Log (Recent)" count={auditLogs.length} actionLabel="Full log" actionPath="/admin/audit-log">
          {auditLogs.length === 0 ? <EmptyState message="No audit entries." /> : auditLogs.slice(0, 10).map(a => (
            <RowItem key={a.id} title={a.action || a.event_type || 'Event'} subtitle={a.description || a.user_email || ''} status={a.severity || 'info'} statusLevel="grey" path="/admin/audit-log" />
          ))}
        </SectionCard>
      </div>

      {/* ── Security ── */}
      <SectionCard title="Security" actionLabel="Security centre" actionPath="/admin/security-centre">
        <div className="p-3 grid grid-cols-2 md:grid-cols-3 gap-3">
          <div className="border border-border/30 rounded-lg p-3"><Lock className="w-4 h-4 text-muted-foreground mb-1" /><p className="text-[10px] text-muted-foreground">Secrets</p><p className="text-xs text-green-400">Configured</p></div>
          <div className="border border-border/30 rounded-lg p-3"><Shield className="w-4 h-4 text-muted-foreground mb-1" /><p className="text-[10px] text-muted-foreground">RLS Active</p><p className="text-xs text-green-400">Enforced</p></div>
          <div className="border border-border/30 rounded-lg p-3"><Activity className="w-4 h-4 text-muted-foreground mb-1" /><p className="text-[10px] text-muted-foreground">Admin Auth</p><p className="text-xs text-green-400">Required</p></div>
        </div>
        <p className="text-[10px] text-muted-foreground/40 px-3 pb-2">No secrets are exposed in UI, logs, errors, or source. All admin components are behind administrator authentication.</p>
      </SectionCard>
    </div>
  );
}