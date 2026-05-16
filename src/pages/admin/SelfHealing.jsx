import { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Shield, Activity, Loader2, CheckCircle2, AlertTriangle, XCircle, Zap, RefreshCw } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const SEVERITY_CONFIG = {
  info: { color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/30', Icon: Activity },
  warning: { color: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/30', Icon: AlertTriangle },
  high: { color: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/30', Icon: AlertTriangle },
  critical: { color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/30', Icon: XCircle },
};

const STATUS_COLORS = {
  open: 'bg-red-500/10 text-red-400',
  drafting_fix: 'bg-blue-500/10 text-blue-400',
  needs_approval: 'bg-yellow-500/10 text-yellow-400',
  approved: 'bg-purple-500/10 text-purple-400',
  resolved: 'bg-green-500/10 text-green-400',
  dismissed: 'bg-slate-500/10 text-slate-400',
};

// Health checks that run automatically
const HEALTH_CHECKS = [
  { area: 'agent_registry', title: 'Agent Registry Population', check: (data) => data.agents?.length > 0 ? null : { severity: 'warning', issue: 'Agent registry is empty', fix: 'Run seedAgentRegistry backend function to populate with default agents', requires_approval: false } },
  { area: 'approvals', title: 'Unresolved Approvals', check: (data) => data.pending?.length > 10 ? { severity: 'warning', issue: `${data.pending.length} items pending in approval queue for more than expected`, fix: 'Review and process pending approvals in the Approval Queue dashboard', requires_approval: false } : null },
  { area: 'risk_alerts', title: 'Critical Risk Alerts', check: (data) => data.criticalAlerts?.length > 0 ? { severity: 'critical', issue: `${data.criticalAlerts.length} critical risk alerts are unresolved`, fix: 'Review and address critical alerts immediately in Risk Alerts dashboard', requires_approval: false } : null },
  { area: 'data', title: 'Knowledge Vault Content', check: (data) => data.vault?.length === 0 ? { severity: 'info', issue: 'Knowledge Vault is empty — agents have no reference material', fix: 'Add foundational documents: brand profile, business goals, legal notes, financial targets', requires_approval: false } : null },
];

export default function SelfHealing() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [scanning, setScanning] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');

  const { data: issues = [], isLoading } = useQuery({
    queryKey: ['system-health-issues'],
    queryFn: () => base44.entities.SystemHealthIssue.list('-created_date', 100),
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
      // Fetch data for checks
      const [agents, pending, alerts, vault] = await Promise.all([
        base44.entities.AgentRegistry.list('-created_date', 1),
        base44.entities.ApprovalQueue.filter({ status: 'pending' }),
        base44.entities.RiskAlert.filter({ status: 'open', severity: 'critical' }),
        base44.entities.KnowledgeVault.list('-created_date', 1),
      ]);

      const checkData = { agents, pending, criticalAlerts: alerts, vault };
      let found = 0;

      for (const check of HEALTH_CHECKS) {
        const result = check.check(checkData);
        if (result) {
          // Check if already logged
          const existing = issues.find(i => i.system_area === check.area && i.status === 'open' && i.issue_title === check.title);
          if (!existing) {
            await createMutation.mutateAsync({
              system_area: check.area,
              issue_title: check.title,
              severity: result.severity,
              detected_by: 'Self Healing Scanner',
              recommended_fix: result.fix,
              status: 'open',
              requires_approval: result.requires_approval,
              risk_type: 'none',
              last_checked: new Date().toISOString(),
            });
            found++;
          }
        }
      }

      // Log the scan
      await base44.entities.AgentTaskLog.create({
        agent_name: 'Self Healing Agent',
        task_title: 'System Health Scan',
        task_description: `Scanned ${HEALTH_CHECKS.length} areas, found ${found} new issues`,
        outcome: found > 0 ? `${found} new issues logged` : 'System healthy — no new issues',
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

  const filtered = filterStatus === 'all' ? issues : issues.filter(i => i.status === filterStatus);
  const openCount = issues.filter(i => i.status === 'open').length;
  const criticalCount = issues.filter(i => i.severity === 'critical' && i.status === 'open').length;

  return (
    <div className="space-y-6 pb-10">
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold gradient-gold-text">Self Healing Ops</h1>
          <p className="text-muted-foreground text-sm mt-1 font-body">Automated system health detection and repair orchestration</p>
        </div>
        <Button onClick={runScan} disabled={scanning} className="gradient-gold-button border-0">
          {scanning ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Scanning...</> : <><Zap className="w-4 h-4 mr-2" />Run Health Scan</>}
        </Button>
      </div>

      <div className="border border-yellow-500/30 bg-yellow-500/5 rounded-lg p-3 flex items-center gap-3">
        <Shield className="w-4 h-4 text-yellow-400 shrink-0" />
        <p className="text-yellow-300 text-xs"><strong>Safety Rule:</strong> Low-risk fixes may be drafted automatically. Anything financial, legal, public, payment, pricing, data deletion, or reputation-related must go to ApprovalQueue before any action.</p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Open Issues', value: openCount, color: openCount > 0 ? 'text-red-400' : 'text-green-400' },
          { label: 'Critical', value: criticalCount, color: criticalCount > 0 ? 'text-red-400' : 'text-muted-foreground' },
          { label: 'Resolved', value: issues.filter(i => i.status === 'resolved').length, color: 'text-green-400' },
          { label: 'Total Scanned', value: issues.length, color: 'text-foreground' },
        ].map(s => (
          <Card key={s.label}>
            <CardContent className="p-4 text-center">
              <p className={`text-3xl font-bold ${s.color}`}>{s.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filter */}
      <div className="flex gap-2 flex-wrap">
        {['all', 'open', 'needs_approval', 'resolved', 'dismissed'].map(s => (
          <Button key={s} size="sm" variant={filterStatus === s ? 'default' : 'ghost'} onClick={() => setFilterStatus(s)} className="text-xs capitalize">{s.replace('_', ' ')}</Button>
        ))}
      </div>

      {isLoading ? (
        <div className="flex items-center gap-2 text-muted-foreground"><Loader2 className="w-4 h-4 animate-spin" />Loading...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-border rounded-xl">
          {openCount === 0 && issues.length > 0 ? (
            <>
              <CheckCircle2 className="w-10 h-10 text-green-400 mx-auto mb-3" />
              <p className="text-green-400 font-medium">All systems healthy</p>
            </>
          ) : (
            <>
              <Activity className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground mb-2">No issues detected yet.</p>
              <p className="text-sm text-muted-foreground">Run a health scan to check all systems.</p>
            </>
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
                    <div className={`${cfg.bg} p-2 rounded-lg border ${cfg.border} shrink-0`}>
                      <SevIcon className={`w-4 h-4 ${cfg.color}`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-medium text-sm">{issue.issue_title}</p>
                        <Badge className={`text-xs border ${cfg.border} ${cfg.bg} ${cfg.color}`}>{issue.severity}</Badge>
                        <Badge className={`text-xs ${STATUS_COLORS[issue.status] || ''}`}>{issue.status}</Badge>
                        {issue.requires_approval && <Badge className="text-xs bg-yellow-500/10 text-yellow-400">Needs Approval</Badge>}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1 capitalize">{issue.system_area?.replace('_', ' ')}</p>
                      {issue.recommended_fix && (
                        <div className="mt-2 p-2 bg-secondary/50 rounded text-xs text-muted-foreground">
                          <strong className="text-foreground">Fix: </strong>{issue.recommended_fix}
                        </div>
                      )}
                      <div className="flex gap-2 mt-3">
                        {issue.status === 'open' && (
                          <>
                            <Button size="sm" variant="outline" className="text-xs h-7" onClick={() => updateMutation.mutate({ id: issue.id, data: { status: 'resolved' } })}>
                              <CheckCircle2 className="w-3 h-3 mr-1" />Resolve
                            </Button>
                            <Button size="sm" variant="ghost" className="text-xs h-7" onClick={() => updateMutation.mutate({ id: issue.id, data: { status: 'dismissed' } })}>Dismiss</Button>
                          </>
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