import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Brain, FileText, CheckCircle2, Clock, AlertTriangle, RefreshCw, Zap, TrendingUp } from 'lucide-react';
import { toast } from 'sonner';

const SAFETY_HOLD_ACTIVE = true;

const AGENTS = [
  {
    name: 'EcommerceIntelligenceAgent',
    label: 'Ecommerce Intelligence',
    function: 'agentProposalScanner',
    data_sources: ['MerchProduct', 'MerchOrder', 'BundleOffer', 'AgentActionProposal'],
    purpose: 'Paused pending an owner guard, AI-cost review, and controlled internal test.',
    schedule: 'Safety hold active; not runnable',
    status: 'Safety hold active',
    disabled: true,
  },
  {
    name: 'GrowthOpportunityScanner',
    label: 'Growth Opportunity',
    function: 'growthOpportunityScanner',
    data_sources: ['EmailSubscriber', 'MerchOrder', 'GrowthOpportunity', 'KnowledgeVault'],
    purpose: 'Paused pending an owner guard, AI-cost review, and controlled internal test.',
    schedule: 'Safety hold active; not runnable',
    status: 'Safety hold active',
    disabled: true,
  },
  {
    name: 'AgentIntelligenceLoop',
    label: 'Intelligence Loop',
    function: 'agentIntelligenceLoop',
    data_sources: ['DailyDashboardTask', 'ActionItem', 'AdminNotification'],
    purpose: 'Owner-triggered, no-spend task supervision that records internal follow-up alerts',
    schedule: 'Manual owner-only; automated schedule paused',
    status: 'Paused pending owner test',
    invokeArgs: { mode: 'admin_supervisor' },
    requiresConfirmation: true,
    confirmationMessage: 'Run the internal Deego supervisor? It creates only internal task alerts and does not call paid AI, send Slack or email, publish, post, submit, or make a payment.',
  },
  {
    name: 'ExecutiveMorningBrief',
    label: 'Executive Brief',
    function: 'executiveMorningBrief',
    data_sources: ['RiskAlert', 'ApprovalQueue', 'AgentTaskLog', 'IdeaOpportunity'],
    purpose: 'Legacy briefing runner is held pending owner-controlled runtime reconciliation.',
    schedule: 'Safety hold active; not runnable',
    status: 'Safety hold active',
    disabled: true,
  },
  {
    name: 'AutonomousAlertSystem',
    label: 'Alert System',
    function: 'autonomousAlertSystem',
    data_sources: ['MerchOrder', 'MerchProduct', 'EmailSubscriber', 'RiskAlert'],
    purpose: 'Paused pending connector-scope correction, owner guard, and controlled internal test.',
    schedule: 'Safety hold active; not runnable',
    status: 'Safety hold active',
    disabled: true,
  },
  {
    name: 'SocialCommentMonitor',
    label: 'Social Monitor',
    function: 'socialCommentMonitor',
    data_sources: ['FanComment', 'FanPost', 'FanReview'],
    purpose: 'Paused pending an owner guard, AI-cost review, and controlled internal test.',
    schedule: 'Safety hold active; not runnable',
    status: 'Safety hold active',
    disabled: true,
  },
];

const STATUS_LABELS = {
  'Complete': { color: 'bg-green-500/20 text-green-300 border-green-500/30' },
  'Live-tested complete': { color: 'bg-green-500/20 text-green-300 border-green-500/30' },
  'Built but untested': { color: 'bg-primary/20 text-primary border-primary/30' },
  'Paused pending owner test': { color: 'bg-primary/20 text-primary border-primary/30' },
  'Safety hold active': { color: 'bg-orange-500/20 text-orange-300 border-orange-500/30' },
  'Blocked by external login': { color: 'bg-orange-500/20 text-orange-300 border-orange-500/30' },
  'Blocked by secret rotation': { color: 'bg-red-500/20 text-red-300 border-red-500/30' },
  'Blocked by Gannon approval': { color: 'bg-blue-500/20 text-blue-300 border-blue-500/30' },
  'Failed and needs fix': { color: 'bg-red-500/20 text-red-400 border-red-500/30' },
};

export default function AgentRevenueStatus() {
  const [running, setRunning] = useState({});
  const [results, setResults] = useState({});

  const { data: proposals = [] } = useQuery({
    queryKey: ['agent-proposals'],
    queryFn: () => base44.entities.AgentActionProposal.list('-created_date', 50),
  });

  const { data: opportunities = [] } = useQuery({
    queryKey: ['growth-opps'],
    queryFn: () => base44.entities.GrowthOpportunity.list('-created_date', 20),
  });

  const { data: kvEntries = [] } = useQuery({
    queryKey: ['kv-entries'],
    queryFn: () => base44.entities.KnowledgeVault.list('-created_date', 5),
  });

  const [provingChain, setProvingChain] = useState(false);
  const [chainResult, setChainResult] = useState(null);

  const runProofChain = async () => {
    if (SAFETY_HOLD_ACTIVE) {
      toast.error('Safety hold active — the ApprovalQueue proof chain is disabled pending a controlled owner test.');
      return;
    }
    setProvingChain(true);
    try {
      const res = await base44.functions.invoke('proofApprovalChain', {});
      setChainResult({ ok: true, data: res.data });
      toast.success(`Approval chain proven — ${res.data?.steps_completed}/7 steps ✓`);
    } catch (e) {
      setChainResult({ ok: false, error: e.message });
      toast.error('Chain proof failed');
    }
    setProvingChain(false);
  };

  const runAgent = async (agent) => {
    if (agent.disabled) {
      toast.error('Safety hold active — this runner is unavailable pending its owner guard and controlled test.');
      return;
    }
    if (agent.requiresConfirmation && !window.confirm(agent.confirmationMessage)) return;
    setRunning(p => ({ ...p, [agent.name]: true }));
    try {
      const res = await base44.functions.invoke(agent.function, agent.invokeArgs || {});
      setResults(p => ({ ...p, [agent.name]: { ok: true, data: res.data } }));
      toast.success(`${agent.label} ran successfully`);
    } catch (e) {
      setResults(p => ({ ...p, [agent.name]: { ok: false, error: e.message } }));
      toast.error(`${agent.label} failed`);
    }
    setRunning(p => ({ ...p, [agent.name]: false }));
  };

  const getAgentStats = (agentName) => {
    const agentProposals = proposals.filter(p => p.agent_name === agentName);
    return {
      proposals: agentProposals.length,
      approved: agentProposals.filter(p => p.status === 'approved' || p.status === 'published').length,
      rejected: agentProposals.filter(p => p.status === 'rejected').length,
      pending: agentProposals.filter(p => p.status === 'pending_approval').length,
    };
  };

  // Improvement plan items
  const IMPROVEMENT_PLAN = [
    { item: 'Connect agents to Metricool performance data', status: 'Built but untested', note: 'metricoolImportMetrics function exists — needs scheduling + agent read access' },
    { item: 'Connect agents to order/profit data', status: 'Safety hold active', note: 'Source reads exist, but owner guards, AI-cost review, and a controlled internal test are required before any runner is enabled.' },
    { item: 'Connect Deego audit evidence to KnowledgeVault', status: 'Built but untested', note: 'The state-deduplicated audit can save internal reports; verify a controlled owner run before calling it operational.' },
    { item: 'Connect agents to release sprint posts', status: 'Built but untested', note: 'ContentCalendarPost entity exists — no agent reads it yet' },
    { item: 'Connect agents to ApprovalQueue outcomes', status: 'Built but untested', note: 'publishApprovedProposal fires on approval — agent learning not yet wired to outcome' },
    { item: 'Connect agents to Business Attention Centre', status: 'Built but untested', note: 'Internal notification code exists; no held agent runner is currently permitted to invoke it.' },
    { item: 'Schedule daily revenue scans', status: 'Safety hold active', note: 'All scheduled scans are false-held until individual owner-approved controlled tests pass.' },
    { item: 'Schedule daily content opportunity scans', status: 'Built but untested', note: 'No dedicated content scan agent yet — autonomousAlertSystem covers some' },
    { item: 'Weekly learning from approvals/rejections', status: 'Safety hold active', note: 'Legacy improvement runner is held until owner-controlled runtime reconciliation is complete.' },
    { item: 'Richer source data records (not generic reports)', status: 'Blocked by Gannon approval', note: 'Need real orders, real fan growth, real social data to generate non-generic insights' },
  ];

  return (
    <div className="space-y-6 pb-12">
      <div>
        <h1 className="text-3xl font-display font-bold gradient-gold-text">Agent Revenue Status</h1>
        <p className="text-muted-foreground text-sm mt-1">Agent readiness, internal evidence, and the safety-hold recovery plan</p>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Proposals', value: proposals.length, icon: FileText, color: 'text-primary' },
          { label: 'Approved', value: proposals.filter(p => p.status === 'approved' || p.status === 'published').length, icon: CheckCircle2, color: 'text-green-400' },
          { label: 'Pending', value: proposals.filter(p => p.status === 'pending_approval').length, icon: Clock, color: 'text-primary' },
          { label: 'KV Insights', value: kvEntries.length, icon: Brain, color: 'text-cyan-400' },
        ].map(s => {
          const Icon = s.icon;
          return (
            <Card key={s.label}>
              <CardContent className="p-4 flex items-center gap-3">
                <Icon className={`w-5 h-5 ${s.color}`} />
                <div>
                  <p className="text-2xl font-bold">{s.value}</p>
                  <p className="text-xs text-muted-foreground">{s.label}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Agent status table */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Brain className="w-4 h-4 text-cyan-400" />
            Agent Dashboard
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-3">
            {AGENTS.map(agent => {
              const stats = getAgentStats(agent.name);
              const result = results[agent.name];
              const isRunning = running[agent.name];
              return (
                <div key={agent.name} className="border border-border/40 rounded-xl p-4">
                  <div className="flex items-start justify-between gap-3 flex-wrap">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <p className="text-sm font-semibold">{agent.label}</p>
                        <Badge
                          variant="outline"
                          className={agent.status === 'Paused pending owner test' || agent.status === 'Safety hold active'
                            ? 'text-[10px] text-amber-300 border-amber-500/30'
                            : 'text-[10px] text-muted-foreground border-border/50'}
                        >
                          {agent.status || 'Configured'}
                        </Badge>
                        <Badge variant="outline" className="text-[10px] text-muted-foreground">{agent.schedule}</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mb-2">{agent.purpose}</p>
                      <div className="flex flex-wrap gap-1 mb-2">
                        {agent.data_sources.map(ds => (
                          <Badge key={ds} variant="outline" className="text-[10px]">{ds}</Badge>
                        ))}
                      </div>
                      <div className="flex gap-4 text-xs">
                        <span className="text-muted-foreground">Proposals: <span className="text-foreground font-medium">{stats.proposals}</span></span>
                        <span className="text-green-400">Approved: {stats.approved}</span>
                        <span className="text-primary">Pending: {stats.pending}</span>
                        <span className="text-red-400">Rejected: {stats.rejected}</span>
                      </div>
                      {result && (
                        <div className={`mt-2 p-2 rounded-lg text-xs ${result.ok ? 'bg-green-500/10 text-green-300' : 'bg-red-500/10 text-red-300'}`}>
                          {result.ok
                            ? `✓ ${result.data?.message || result.data?.proposals_created !== undefined ? `${result.data.proposals_created} proposals created` : 'Success'}`
                            : `✗ ${result.error}`}
                        </div>
                      )}
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => runAgent(agent)}
                      disabled={isRunning || agent.disabled}
                      className="gap-1 shrink-0"
                    >
                      <RefreshCw className={`w-3 h-3 ${isRunning ? 'animate-spin' : ''}`} />
                      {isRunning ? 'Running…' : (agent.buttonLabel || 'Run Now')}
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Improvement plan */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-primary" />
            Agent Improvement Plan
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0 space-y-2">
          {IMPROVEMENT_PLAN.map((item, i) => {
            const cfg = STATUS_LABELS[item.status] || STATUS_LABELS['Built but untested'];
            return (
              <div key={i} className="flex items-start gap-3 p-3 rounded-lg border border-border/30 hover:bg-secondary/20">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-0.5">
                    <p className="text-sm">{item.item}</p>
                    <Badge className={`text-[10px] border ${cfg.color}`}>{item.status}</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">{item.note}</p>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* ApprovalQueue chain proof */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-green-400" />
            ApprovalQueue Auto-Action Proof
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <p className="text-sm text-muted-foreground mb-3">
            This production-data proof chain is disabled by the safety hold. It needs an isolated fixture, owner approval, and a verified zero-external-effect test before use.
          </p>
          <Button onClick={runProofChain} disabled={SAFETY_HOLD_ACTIVE || provingChain} variant="outline" className="gap-2 mb-3">
            <Zap className={`w-4 h-4 ${provingChain ? 'animate-spin' : ''}`} />
            {SAFETY_HOLD_ACTIVE ? 'Safety hold active' : (provingChain ? 'Running proof...' : 'Run ApprovalQueue Proof Chain')}
          </Button>
          {chainResult && (
            <div className={`p-3 rounded-lg text-sm ${chainResult.ok ? 'bg-green-500/10 border border-green-500/20' : 'bg-red-500/10 border border-red-500/20'}`}>
              {chainResult.ok ? (
                <>
                  <p className="text-green-300 font-semibold mb-1">✓ {chainResult.data?.steps_completed}/7 steps complete</p>
                  <ul className="text-xs text-muted-foreground space-y-0.5">
                    {chainResult.data?.logs?.filter(l => l.startsWith('✓')).map((l, i) => <li key={i}>{l}</li>)}
                  </ul>
                </>
              ) : (
                <p className="text-red-300">✗ {chainResult.error}</p>
              )}
            </div>
          )}
          {!chainResult && (
            <p className="text-xs text-muted-foreground">Historical result only: a proof run is recorded from 26 May 2026. It is not evidence that the current production chain is safe or enabled.</p>
          )}
        </CardContent>
      </Card>

      {/* Blocker: rich data */}
      <Card className="border-primary/30 bg-primary/5">
        <CardContent className="p-4 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-primary text-sm">Why agents produce generic output right now</p>
            <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
              Agent source exists, but the unguarded and scheduled runners are intentionally paused. Before any one is enabled, it needs an owner guard, an AI-cost disclosure where relevant, a controlled internal fixture, and evidence that it cannot send, post, spend, or mutate external systems.
            </p>
            <p className="text-xs text-primary mt-2 font-medium">Next step: approve one controlled no-spend owner test, then re-enable only the tested path.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}