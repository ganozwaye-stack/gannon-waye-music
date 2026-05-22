import { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Zap, Activity, Shield, CheckCircle2, XCircle, AlertTriangle, Clock, Play, RefreshCw, Brain, TrendingUp, Loader2, BookOpen, Settings } from 'lucide-react';
import { toast } from 'sonner';

const SCHEDULED_LOOPS = [
  { name: 'Autonomous Research Loop', fn: 'autonomousResearch', interval: 'Every 4 hours', status: 'active', description: 'Rotates through 15+ research topics, saves to KnowledgeVault', lastRun: null },
  { name: 'Trend Engine', fn: 'autonomousTrendEngine', interval: 'Every 6 hours', status: 'active', description: 'Scans viral products, emerging trends, competitor moves', lastRun: null },
  { name: 'Executive Morning Brief', fn: 'executiveMorningBrief', interval: 'Daily 8am AEST', status: 'active', description: 'Generates daily intelligence summary for executive review', lastRun: null },
  { name: 'Site Health Check', fn: 'runSiteHealthCheck', interval: 'Every 12 hours', status: 'active', description: 'Monitors system integrity, detects broken pages and errors', lastRun: null },
  { name: 'Agent Self-Improvement', fn: 'agentSelfImprovement', interval: 'Daily', status: 'active', description: 'Reviews agent outputs and logs learning records for continuous improvement', lastRun: null },
  { name: 'Prompt Evolution Engine', fn: 'agentPromptEvolution', interval: 'Weekly', status: 'active', description: 'Evolves agent system prompts based on approved/rejected patterns', lastRun: null },
  { name: 'Release Calendar Sync', fn: 'releaseCalendarSync', interval: 'Weekly Mon', status: 'active', description: 'Syncs all Release entities to Google Calendar automatically', lastRun: null },
];

const SAFETY_RULES = [
  { rule: 'No financial transactions without approval', enforced: true },
  { rule: 'No public content publishing without approval', enforced: true },
  { rule: 'No pricing changes without approval', enforced: true },
  { rule: 'No supplier contact without approval', enforced: true },
  { rule: 'No legal document changes without approval', enforced: true },
  { rule: 'No refund issuance without approval', enforced: true },
  { rule: 'High/critical risk actions → ApprovalQueue', enforced: true },
  { rule: 'All autonomous actions logged to AgentTaskLog', enforced: true },
];

export default function AutonomousOps() {
  const [triggering, setTriggering] = useState(null);
  const qc = useQueryClient();

  const { data: logs = [], refetch: refetchLogs } = useQuery({
    queryKey: ['auto-ops-logs'],
    queryFn: () => base44.entities.AgentTaskLog.filter({ was_automatic: true }, '-created_date', 50),
    refetchInterval: 30000,
  });

  const { data: pending = [] } = useQuery({
    queryKey: ['auto-ops-pending'],
    queryFn: () => base44.entities.ApprovalQueue.filter({ status: 'pending' }, '-created_date', 20),
  });

  const { data: blocked = [] } = useQuery({
    queryKey: ['auto-ops-blocked'],
    queryFn: () => base44.entities.ApprovalQueue.filter({ status: 'escalated' }, '-created_date', 10),
  });

  const { data: alerts = [] } = useQuery({
    queryKey: ['auto-ops-alerts'],
    queryFn: () => base44.entities.RiskAlert.filter({ status: 'open' }, '-created_date', 20),
  });

  const { data: researchFeed = [] } = useQuery({
    queryKey: ['auto-ops-research'],
    queryFn: () => base44.entities.KnowledgeVault.list('-created_date', 8),
    refetchInterval: 60000,
  });

  const { data: evolvedPrompts = [] } = useQuery({
    queryKey: ['evolved-prompts'],
    queryFn: async () => {
      const all = await base44.entities.KnowledgeVault.list('-created_date', 50);
      return all.filter(i => i.tags?.includes('evolved-prompt'));
    },
    refetchInterval: 120000,
  });

  const triggerFn = async (fn, name) => {
    setTriggering(fn);
    try {
      await base44.functions.invoke(fn, {});
      toast.success(`${name} triggered successfully`);
      refetchLogs();
    } catch {
      toast.error(`Failed to trigger ${name}`);
    }
    setTriggering(null);
  };

  const updateApproval = useMutation({
    mutationFn: ({ id, status }) => base44.entities.ApprovalQueue.update(id, { status }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['auto-ops-pending'] }); toast.success('Updated'); },
  });

  const todayAutoLogs = logs.filter(l => {
    const d = new Date(l.created_date);
    return d.toDateString() === new Date().toDateString();
  });

  const blockedLogs = logs.filter(l => l.risk_check_result === 'blocked' || l.risk_check_result === 'escalated');

  return (
    <div className="space-y-6 pb-10">
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold gradient-gold-text">Autonomous Ops</h1>
          <p className="text-muted-foreground text-sm mt-1">Active loops, agent collaboration chains, risk escalations, pending approvals</p>
        </div>
        <Button variant="outline" onClick={() => refetchLogs()} className="gap-2 text-xs">
          <RefreshCw className="w-3 h-3" />Refresh
        </Button>
      </div>

      {/* Safety Banner */}
      <div className="border border-yellow-500/30 bg-yellow-500/5 rounded-lg p-3 flex items-start gap-3">
        <Shield className="w-4 h-4 text-yellow-400 shrink-0 mt-0.5" />
        <p className="text-yellow-300 text-xs"><strong>Do-Not-Spend-Or-Lose Rule: ACTIVE</strong> — All financial, legal, publishing, pricing, and supplier actions are blocked from automatic execution. They go to ApprovalQueue.</p>
      </div>

      {/* Status Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Loops Active', value: SCHEDULED_LOOPS.length, icon: Play, color: 'text-green-400', bg: 'bg-green-500/10' },
          { label: 'Actions Today', value: todayAutoLogs.length, icon: Zap, color: 'text-amber-400', bg: 'bg-amber-500/10' },
          { label: 'Pending Approvals', value: pending.length, icon: Clock, color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
          { label: 'Blocked Actions', value: blockedLogs.length, icon: XCircle, color: 'text-red-400', bg: 'bg-red-500/10' },
        ].map(s => (
          <Card key={s.label}>
            <CardContent className="p-4 flex items-center gap-3">
              <div className={`${s.bg} p-2 rounded-lg`}><s.icon className={`w-5 h-5 ${s.color}`} /></div>
              <div>
                <p className="text-2xl font-bold">{s.value}</p>
                <p className="text-xs text-muted-foreground">{s.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Active Research Loops */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2"><Play className="w-4 h-4 text-green-400" />Active Automation Loops</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {SCHEDULED_LOOPS.map(loop => (
            <div key={loop.fn} className="flex items-center gap-3 p-3 border border-border rounded-lg">
              <div className="w-2 h-2 rounded-full bg-green-400 shrink-0 animate-pulse" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-sm font-medium">{loop.name}</p>
                  <Badge className="text-xs bg-green-500/10 text-green-400">{loop.interval}</Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">{loop.description}</p>
              </div>
              <Button size="sm" variant="ghost" className="text-xs h-7 shrink-0" disabled={triggering === loop.fn}
                onClick={() => triggerFn(loop.fn, loop.name)}>
                {triggering === loop.fn ? <Loader2 className="w-3 h-3 animate-spin" /> : <Play className="w-3 h-3" />}
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Agent Collaboration Chains */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2"><Brain className="w-4 h-4 text-cyan-400" />Agent Collaboration Chains</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {[
              { chain: 'Trend Agent → Product Scout → ROI Scorer → Ideas Engine', status: 'active' },
              { chain: 'Research Agent → Audience Analyzer → Hook Generator → Approval Queue', status: 'active' },
              { chain: 'Competitor Monitor → Gap Analyzer → Opportunity Scorer → Executive Feed', status: 'active' },
              { chain: 'Risk Agent → Legal Check → Escalation → ApprovalQueue → Executive Alert', status: 'active' },
            ].map(c => (
              <div key={c.chain} className="flex items-center gap-2 text-xs p-2 rounded border border-border">
                <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0" />
                <span className="text-muted-foreground flex-1">{c.chain}</span>
                <Badge className="text-xs bg-green-500/10 text-green-400 shrink-0">{c.status}</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending Approvals */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Clock className="w-4 h-4 text-yellow-400" />Pending Approvals
              {pending.length > 0 && <Badge className="bg-yellow-500/10 text-yellow-400 ml-auto text-xs">{pending.length}</Badge>}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 max-h-72 overflow-y-auto">
            {pending.length === 0 ? (
              <div className="text-center py-6">
                <CheckCircle2 className="w-8 h-8 text-green-400 mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">No pending approvals</p>
              </div>
            ) : pending.map(item => (
              <div key={item.id} className="border border-yellow-500/20 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-1">
                  <Badge className="text-xs bg-yellow-500/10 text-yellow-400">{item.risk_level}</Badge>
                  <span className="text-xs text-muted-foreground">{item.agent_name}</span>
                </div>
                <p className="text-sm font-medium">{item.action_title}</p>
                <div className="flex gap-2 mt-2">
                  <Button size="sm" className="h-6 text-xs gradient-gold-button border-0" onClick={() => updateApproval.mutate({ id: item.id, status: 'approved' })}>Approve</Button>
                  <Button size="sm" variant="ghost" className="h-6 text-xs" onClick={() => updateApproval.mutate({ id: item.id, status: 'rejected' })}>Reject</Button>
                </div>
              </div>
            ))}
            {pending.length > 0 && <Link to="/admin/approval-queue" className="text-xs text-primary block text-center pt-1">View all →</Link>}
          </CardContent>
        </Card>

        {/* Risk Escalations */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-400" />Risk Escalations
              {alerts.filter(a => a.severity === 'critical').length > 0 && (
                <Badge className="bg-red-500/10 text-red-400 ml-auto text-xs animate-pulse">{alerts.filter(a => a.severity === 'critical').length} critical</Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 max-h-72 overflow-y-auto">
            {alerts.length === 0 ? (
              <div className="text-center py-6">
                <CheckCircle2 className="w-8 h-8 text-green-400 mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">No open risk alerts</p>
              </div>
            ) : alerts.slice(0, 6).map(alert => (
              <div key={alert.id} className={`border rounded-lg p-3 ${alert.severity === 'critical' ? 'border-red-500/30' : alert.severity === 'high' ? 'border-orange-500/30' : 'border-border'}`}>
                <div className="flex items-center gap-2 mb-1">
                  <Badge className={`text-xs ${alert.severity === 'critical' ? 'bg-red-500/10 text-red-400' : 'bg-orange-500/10 text-orange-400'}`}>{alert.severity}</Badge>
                  <Badge variant="outline" className="text-xs">{alert.alert_type}</Badge>
                </div>
                <p className="text-sm font-medium">{alert.title}</p>
                {alert.recommended_action && <p className="text-xs text-primary mt-1">→ {alert.recommended_action}</p>}
              </div>
            ))}
            {alerts.length > 0 && <Link to="/admin/risk-alerts" className="text-xs text-primary block text-center pt-1">View all alerts →</Link>}
          </CardContent>
        </Card>
      </div>

      {/* Safety Enforcement Rules */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2"><Shield className="w-4 h-4 text-green-400" />Safety Enforcement Rules</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {SAFETY_RULES.map(r => (
              <div key={r.rule} className="flex items-center gap-2 text-xs p-2 rounded border border-green-500/10 bg-green-500/5">
                <CheckCircle2 className="w-3 h-3 text-green-400 shrink-0" />
                <span className="text-muted-foreground">{r.rule}</span>
                <Badge className="text-xs bg-green-500/10 text-green-400 ml-auto shrink-0">enforced</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Research Feed */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <Brain className="w-4 h-4 text-purple-400" />Live Research Feed
            <Badge className="ml-auto text-xs bg-purple-500/10 text-purple-400">{researchFeed.length} items</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 max-h-72 overflow-y-auto">
          {researchFeed.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">No research yet. Trigger Autonomous Research Loop above.</p>
          ) : researchFeed.map(item => (
            <Link key={item.id} to="/admin/research-grid">
              <div className="border border-border rounded-lg p-3 hover:border-primary/40 hover:bg-secondary/30 transition-all cursor-pointer">
                <p className="text-sm font-medium leading-tight">{item.title}</p>
                <div className="flex items-center gap-2 mt-1 flex-wrap">
                  <Badge variant="outline" className="text-[10px]">{item.category}</Badge>
                  <span className="text-xs text-muted-foreground">{new Date(item.created_date).toLocaleString('en-AU', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</span>
                </div>
                {item.summary && <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{item.summary}</p>}
              </div>
            </Link>
          ))}
        </CardContent>
      </Card>

      {/* Evolved Prompts */}
      {evolvedPrompts.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-cyan-400" />Evolved Agent Prompts
              <Badge className="ml-auto text-xs bg-cyan-500/10 text-cyan-400">{evolvedPrompts.length} versions</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 max-h-48 overflow-y-auto">
            {evolvedPrompts.map(p => (
              <div key={p.id} className="flex items-center justify-between p-2 border border-border rounded-lg text-xs">
                <span className="text-foreground/80">{p.title}</span>
                <div className="flex items-center gap-2 shrink-0">
                  <Badge variant="outline" className="text-[10px]">v{p.version || 1}</Badge>
                  <span className="text-muted-foreground">{new Date(p.created_date).toLocaleDateString('en-AU')}</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* API Setup Queue Trigger */}
      <Card className="border-primary/20">
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <Settings className="w-4 h-4 text-primary" />Integration Setup Queue
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-xs text-muted-foreground mb-3">Queue all pending API/integration setup tasks to Approval Queue so you can guide each one with your approval.</p>
          <Button size="sm" variant="outline" disabled={triggering === 'queueApiSetupTasks'} onClick={() => triggerFn('queueApiSetupTasks', 'API Setup Tasks')}>
            {triggering === 'queueApiSetupTasks' ? <Loader2 className="w-3 h-3 animate-spin mr-1" /> : <Zap className="w-3 h-3 mr-1" />}
            Queue All Integration Tasks → Approval
          </Button>
          <p className="text-xs text-muted-foreground mt-2">Covers: Toolost, Slack, Gmail, Google Calendar, Sheets, Stripe, TikTok/Instagram APIs, Notion</p>
        </CardContent>
      </Card>

      {/* Recent Autonomous Activity */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2"><Activity className="w-4 h-4 text-blue-400" />System Learning Activity</CardTitle>
            <Link to="/admin/agent-task-log"><Button size="sm" variant="ghost" className="text-xs gap-1">View All <Activity className="w-3 h-3" /></Button></Link>
          </div>
        </CardHeader>
        <CardContent className="space-y-2 max-h-80 overflow-y-auto">
          {logs.slice(0, 20).map(log => (
            <Link key={log.id} to="/admin/agent-task-log">
              <div className="flex items-start gap-3 p-2 border border-border rounded-lg text-xs hover:border-primary/40 hover:bg-secondary/30 transition-all cursor-pointer group">
                <div className={`w-2 h-2 rounded-full mt-1 shrink-0 ${log.risk_check_result === 'pass' ? 'bg-green-400' : log.risk_check_result === 'blocked' ? 'bg-red-400' : 'bg-yellow-400'}`} />
                <div className="flex-1 min-w-0">
                  <p className="font-medium">{log.task_title}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-muted-foreground">{log.agent_name}</span>
                    {log.was_automatic && <Badge className="text-[10px] bg-blue-500/10 text-blue-400">auto</Badge>}
                    <span className="text-muted-foreground ml-auto">{new Date(log.created_date).toLocaleString('en-AU')}</span>
                  </div>
                  {log.outcome && <p className="text-muted-foreground mt-0.5 line-clamp-1">{log.outcome}</p>}
                </div>
              </div>
            </Link>
          ))}
          {logs.length === 0 && <p className="text-sm text-muted-foreground text-center py-4">No autonomous activity yet.</p>}
        </CardContent>
      </Card>
    </div>
  );
}