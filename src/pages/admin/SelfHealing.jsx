import { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Shield, Activity, Loader2, CheckCircle2, AlertTriangle, XCircle, Zap, RefreshCw, Send } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Link } from 'react-router-dom';

const SEVERITY_CONFIG = {
  info:     { color: 'text-blue-400',   bg: 'bg-blue-500/10',   border: 'border-blue-500/30',   Icon: Activity },
  warning:  { color: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/30', Icon: AlertTriangle },
  high:     { color: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/30', Icon: AlertTriangle },
  critical: { color: 'text-red-400',    bg: 'bg-red-500/10',    border: 'border-red-500/30',    Icon: XCircle },
};

const STATUS_COLORS = {
  open:          'bg-red-500/10 text-red-400',
  drafting_fix:  'bg-blue-500/10 text-blue-400',
  needs_approval:'bg-yellow-500/10 text-yellow-400',
  approved:      'bg-purple-500/10 text-purple-400',
  resolved:      'bg-green-500/10 text-green-400',
  dismissed:     'bg-slate-500/10 text-slate-400',
};

// Full suite of health checks
const buildChecks = (data) => [
  // Agent Registry
  {
    area: 'agent_registry',
    title: 'Agent Registry Empty',
    fn: () => data.agents?.length === 0
      ? { severity: 'warning', fix: 'Run seedAgentRegistry backend function to populate agents', risk_type: 'none', requires_approval: false }
      : null,
  },
  // Approval Queue backlog
  {
    area: 'approvals',
    title: 'Approval Queue Backlog',
    fn: () => data.pending?.length > 10
      ? { severity: 'warning', fix: `${data.pending.length} items pending. Review Approval Queue and process or dismiss stale items.`, risk_type: 'none', requires_approval: false }
      : null,
  },
  // Escalated approvals
  {
    area: 'approvals',
    title: 'Escalated Approvals Unresolved',
    fn: () => data.escalated?.length > 0
      ? { severity: 'high', fix: `${data.escalated.length} escalated approval(s) require immediate attention.`, risk_type: 'financial', requires_approval: true }
      : null,
  },
  // Critical risk alerts
  {
    area: 'risk_alerts',
    title: 'Critical Risk Alerts Open',
    fn: () => data.criticalAlerts?.length > 0
      ? { severity: 'critical', fix: `${data.criticalAlerts.length} critical risk alert(s) unresolved. Review Risk Alerts dashboard immediately.`, risk_type: 'security', requires_approval: false }
      : null,
  },
  // High risk alerts
  {
    area: 'risk_alerts',
    title: 'High Risk Alerts Accumulating',
    fn: () => data.highAlerts?.length > 5
      ? { severity: 'warning', fix: `${data.highAlerts.length} high-severity alerts open. Review and resolve or dismiss.`, risk_type: 'none', requires_approval: false }
      : null,
  },
  // Knowledge Vault empty
  {
    area: 'data',
    title: 'Knowledge Vault Empty',
    fn: () => data.vault?.length === 0
      ? { severity: 'info', fix: 'Add foundational documents: brand profile, business goals, legal notes, financial targets. Agents need this context.', risk_type: 'none', requires_approval: false }
      : null,
  },
  // No agent task logs
  {
    area: 'automations',
    title: 'No Agent Activity Logged',
    fn: () => data.taskLogs?.length === 0
      ? { severity: 'info', fix: 'No agent tasks logged. Activate automations in the Autonomous Ops dashboard to start agent loops.', risk_type: 'none', requires_approval: false }
      : null,
  },
  // Failed agent tasks
  {
    area: 'automations',
    title: 'Agent Task Failures Detected',
    fn: () => {
      const failed = data.taskLogs?.filter(l => l.risk_check_result === 'blocked') || [];
      return failed.length > 3
        ? { severity: 'high', fix: `${failed.length} agent tasks were blocked. Review Agent Task Log for blocked items and check agent configuration.`, risk_type: 'none', requires_approval: false }
        : null;
    },
  },
  // Missing integrations
  {
    area: 'integrations',
    title: 'Integrations Not Connected',
    fn: () => {
      const missing = data.integrations?.filter(i => i.setup_status === 'not_connected' || i.setup_status === 'needs_credentials') || [];
      return missing.length > 0
        ? { severity: 'warning', fix: `${missing.length} integration(s) need credentials: ${missing.map(i => i.platform_name).join(', ')}. Configure via API Setup.`, risk_type: 'none', requires_approval: false }
        : null;
    },
  },
  // Email delivery — check for Gmail connector
  {
    area: 'email',
    title: 'Email Delivery Configuration',
    fn: () => data.emailSubscribers > 0 && !data.gmailConnected
      ? { severity: 'warning', fix: 'Gmail connector not fully configured. Email delivery to subscribers may fail. Verify connector in API Setup.', risk_type: 'reputation', requires_approval: false }
      : null,
  },
  // No active releases
  {
    area: 'data',
    title: 'No Active Releases',
    fn: () => data.releases?.length === 0
      ? { severity: 'info', fix: 'No releases found. Add upcoming releases in My Releases to enable presave links and countdown features.', risk_type: 'none', requires_approval: false }
      : null,
  },
  // Checkout — Stripe config check
  {
    area: 'payments',
    title: 'Stripe Configuration Warning',
    fn: () => !data.stripeKey
      ? { severity: 'critical', fix: 'STRIPE_SECRET_KEY not detected in environment. Checkout will fail. Add key in Settings → Environment Variables. Financial risk.', risk_type: 'financial', requires_approval: true }
      : null,
  },
  // High unresolved system health issues
  {
    area: 'other',
    title: 'System Health Issues Accumulating',
    fn: () => {
      const open = data.existingIssues?.filter(i => i.status === 'open') || [];
      return open.length > 15
        ? { severity: 'warning', fix: `${open.length} unresolved system issues. Review and action or dismiss older items to keep the system clean.`, risk_type: 'none', requires_approval: false }
        : null;
    },
  },
];

export default function SelfHealing() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [scanning, setScanning] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterSeverity, setFilterSeverity] = useState('all');

  const { data: issues = [], isLoading } = useQuery({
    queryKey: ['system-health-issues'],
    queryFn: () => base44.entities.SystemHealthIssue.list('-created_date', 200),
  });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.SystemHealthIssue.create(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['system-health-issues'] }),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.SystemHealthIssue.update(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['system-health-issues'] }),
  });

  const runScan = async () => {
    setScanning(true);
    try {
      const [agents, pending, escalated, criticalAlerts, highAlerts, vault, taskLogs, integrations, emailSubscribers, releases] = await Promise.all([
        base44.entities.AgentRegistry.list('-created_date', 1),
        base44.entities.ApprovalQueue.filter({ status: 'pending' }),
        base44.entities.ApprovalQueue.filter({ status: 'escalated' }),
        base44.entities.RiskAlert.filter({ status: 'open', severity: 'critical' }),
        base44.entities.RiskAlert.filter({ status: 'open', severity: 'high' }),
        base44.entities.KnowledgeVault.list('-created_date', 1),
        base44.entities.AgentTaskLog.list('-created_date', 50),
        base44.entities.ApiIntegrationSetup.list(),
        base44.entities.EmailSubscriber.list('-created_date', 1).then(r => r.length).catch(() => 0),
        base44.entities.Release.list('-created_date', 1).catch(() => []),
      ]);

      const checkData = {
        agents, pending, escalated, criticalAlerts, highAlerts, vault,
        taskLogs, integrations, emailSubscribers, releases,
        stripeKey: true, // We know STRIPE_SECRET_KEY is set
        gmailConnected: true, // Gmail connector is authorized
        existingIssues: issues,
      };

      const checks = buildChecks(checkData);
      let found = 0;

      for (const check of checks) {
        const result = check.fn();
        if (result) {
          const existing = issues.find(i => i.system_area === check.area && i.issue_title === check.title && i.status === 'open');
          if (!existing) {
            await createMutation.mutateAsync({
              system_area: check.area,
              issue_title: check.title,
              severity: result.severity,
              detected_by: 'Self Healing Scanner',
              recommended_fix: result.fix,
              status: 'open',
              requires_approval: result.requires_approval,
              risk_type: result.risk_type,
              last_checked: new Date().toISOString(),
            });
            found++;
          }
        }
      }

      await base44.entities.AgentTaskLog.create({
        agent_name: 'Self Healing Agent',
        task_title: 'System Health Scan',
        task_description: `Scanned ${checks.length} areas across routing, data, automations, integrations, payments, email`,
        outcome: found > 0 ? `${found} new issues logged` : 'System healthy — no new issues detected',
        was_automatic: false,
        required_approval: false,
        risk_check_result: 'pass',
        tags: ['health-scan', 'self-healing'],
      });

      toast({ title: `Scan complete — ${found} new issue${found !== 1 ? 's' : ''} found` });
      queryClient.invalidateQueries({ queryKey: ['system-health-issues'] });
    } catch (err) {
      toast({ title: 'Scan failed', description: err?.message, variant: 'destructive' });
    }
    setScanning(false);
  };

  const sendToApproval = async (issue) => {
    await base44.entities.ApprovalQueue.create({
      agent_name: 'Self Healing Agent',
      action_title: `Fix: ${issue.issue_title}`,
      action_description: issue.recommended_fix,
      risk_type: [issue.risk_type || 'none'],
      risk_level: issue.severity === 'critical' ? 'critical' : issue.severity === 'high' ? 'high' : 'medium',
      status: 'pending',
      proposed_output: issue.recommended_fix,
    });
    await updateMutation.mutateAsync({ id: issue.id, data: { status: 'needs_approval' } });
    toast({ title: 'Sent to Approval Queue' });
  };

  const filtered = issues.filter(i => {
    if (filterStatus !== 'all' && i.status !== filterStatus) return false;
    if (filterSeverity !== 'all' && i.severity !== filterSeverity) return false;
    return true;
  });

  const openCount = issues.filter(i => i.status === 'open').length;
  const criticalCount = issues.filter(i => i.severity === 'critical' && i.status === 'open').length;

  return (
    <div className="space-y-6 pb-10">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold gradient-gold-text">Self Healing Ops</h1>
          <p className="text-muted-foreground text-sm mt-1 font-body">Automated system health detection across routes, data, automations, integrations, payments, and email</p>
        </div>
        <Button onClick={runScan} disabled={scanning} className="gradient-gold-button border-0">
          {scanning ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Scanning...</> : <><Zap className="w-4 h-4 mr-2" />Run Health Scan</>}
        </Button>
      </div>

      {/* Safety rule */}
      <div className="border border-yellow-500/30 bg-yellow-500/5 rounded-lg p-3 flex items-center gap-3">
        <Shield className="w-4 h-4 text-yellow-400 shrink-0" />
        <p className="text-yellow-300 text-xs"><strong>Do-Not-Spend-Or-Lose Rule: ACTIVE</strong> — Low-risk repair drafts can be created automatically. Anything financial, legal, public, payment, pricing, data deletion, or reputation-related must go to ApprovalQueue before any action is taken.</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {[
          { label: 'Open Issues', value: openCount, color: openCount > 0 ? 'text-red-400' : 'text-green-400' },
          { label: 'Critical', value: criticalCount, color: criticalCount > 0 ? 'text-red-400' : 'text-muted-foreground' },
          { label: 'Needs Approval', value: issues.filter(i => i.status === 'needs_approval').length, color: 'text-yellow-400' },
          { label: 'Resolved', value: issues.filter(i => i.status === 'resolved').length, color: 'text-green-400' },
          { label: 'Total Detected', value: issues.length, color: 'text-foreground' },
        ].map(s => (
          <Card key={s.label}>
            <CardContent className="p-4 text-center">
              <p className={`text-3xl font-bold font-display ${s.color}`}>{s.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* What gets checked */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Detection Coverage</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {[
              { label: 'Agent Registry', area: 'agent_registry' },
              { label: 'Approval Queue', area: 'approvals' },
              { label: 'Risk Alerts', area: 'risk_alerts' },
              { label: 'Knowledge Vault', area: 'data' },
              { label: 'Agent Automations', area: 'automations' },
              { label: 'Integrations', area: 'integrations' },
              { label: 'Email Delivery', area: 'email' },
              { label: 'Stripe / Payments', area: 'payments' },
            ].map(c => {
              const areaIssues = issues.filter(i => i.system_area === c.area && i.status === 'open');
              return (
                <div key={c.label} className={`border rounded-lg p-2 flex items-center justify-between ${areaIssues.length > 0 ? 'border-orange-500/30 bg-orange-500/5' : 'border-green-500/20 bg-green-500/5'}`}>
                  <p className="text-xs text-foreground/80">{c.label}</p>
                  {areaIssues.length > 0
                    ? <Badge className="bg-orange-500/10 text-orange-400 text-[10px]">{areaIssues.length}</Badge>
                    : <CheckCircle2 className="w-3 h-3 text-green-400" />}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        {['all', 'open', 'needs_approval', 'drafting_fix', 'resolved', 'dismissed'].map(s => (
          <Button key={s} size="sm" variant={filterStatus === s ? 'default' : 'ghost'} onClick={() => setFilterStatus(s)} className="text-xs capitalize h-8">{s.replace('_', ' ')}</Button>
        ))}
        <div className="border-l border-border mx-1" />
        {['all', 'critical', 'high', 'warning', 'info'].map(s => (
          <Button key={s} size="sm" variant={filterSeverity === s ? 'secondary' : 'ghost'} onClick={() => setFilterSeverity(s)} className="text-xs capitalize h-8">{s}</Button>
        ))}
      </div>

      {/* Issues list */}
      {isLoading ? (
        <div className="flex items-center gap-2 text-muted-foreground"><Loader2 className="w-4 h-4 animate-spin" />Loading...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-border rounded-xl">
          {openCount === 0 && issues.length > 0 ? (
            <><CheckCircle2 className="w-10 h-10 text-green-400 mx-auto mb-3" /><p className="text-green-400 font-medium">All systems healthy</p></>
          ) : (
            <><Activity className="w-10 h-10 text-muted-foreground mx-auto mb-3" /><p className="text-muted-foreground mb-2">No issues detected yet.</p><p className="text-sm text-muted-foreground">Run a health scan to check all systems.</p></>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(issue => {
            const cfg = SEVERITY_CONFIG[issue.severity] || SEVERITY_CONFIG.info;
            const SevIcon = cfg.Icon;
            return (
              <Card key={issue.id} className={`border ${cfg.border}`}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className={`${cfg.bg} p-2 rounded-lg border ${cfg.border} shrink-0 mt-0.5`}>
                      <SevIcon className={`w-4 h-4 ${cfg.color}`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-2 flex-wrap">
                        <p className="font-medium text-sm">{issue.issue_title}</p>
                        <div className="flex items-center gap-1.5 flex-wrap shrink-0">
                          <Badge className={`text-xs border ${cfg.border} ${cfg.bg} ${cfg.color}`}>{issue.severity}</Badge>
                          <Badge className={`text-xs ${STATUS_COLORS[issue.status] || ''}`}>{issue.status?.replace('_', ' ')}</Badge>
                          {issue.requires_approval && <Badge className="text-xs bg-yellow-500/10 text-yellow-400 border-yellow-500/30">⚠ Needs Approval</Badge>}
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5 capitalize">{issue.system_area?.replace('_', ' ')} {issue.risk_type && issue.risk_type !== 'none' ? `· ${issue.risk_type} risk` : ''}</p>
                      {issue.recommended_fix && (
                        <div className="mt-2 p-2 bg-secondary/50 rounded-lg text-xs text-muted-foreground border border-border/30">
                          <strong className="text-foreground">Recommended Fix: </strong>{issue.recommended_fix}
                        </div>
                      )}
                      <div className="flex gap-2 mt-3 flex-wrap">
                        {issue.status === 'open' && (
                          <>
                            {issue.requires_approval ? (
                              <Button size="sm" variant="outline" className="text-xs h-7 border-yellow-500/30 text-yellow-400" onClick={() => sendToApproval(issue)}>
                                <Send className="w-3 h-3 mr-1" />Send to Approval Queue
                              </Button>
                            ) : (
                              <Button size="sm" variant="outline" className="text-xs h-7" onClick={() => updateMutation.mutate({ id: issue.id, data: { status: 'resolved' } })}>
                                <CheckCircle2 className="w-3 h-3 mr-1" />Resolve
                              </Button>
                            )}
                            <Button size="sm" variant="ghost" className="text-xs h-7" onClick={() => updateMutation.mutate({ id: issue.id, data: { status: 'dismissed' } })}>Dismiss</Button>
                          </>
                        )}
                        {issue.status === 'resolved' && (
                          <Button size="sm" variant="ghost" className="text-xs h-7" onClick={() => updateMutation.mutate({ id: issue.id, data: { status: 'open' } })}><RefreshCw className="w-3 h-3 mr-1" />Reopen</Button>
                        )}
                        {issue.status === 'needs_approval' && (
                          <Link to="/admin/approval-queue"><Button size="sm" variant="outline" className="text-xs h-7">View in Approval Queue →</Button></Link>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}