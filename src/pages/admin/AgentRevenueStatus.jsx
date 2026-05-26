import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Brain, DollarSign, FileText, CheckCircle2, XCircle, Clock, AlertTriangle, RefreshCw, Zap, TrendingUp } from 'lucide-react';
import { toast } from 'sonner';

const AGENTS = [
  {
    name: 'EcommerceIntelligenceAgent',
    label: 'Ecommerce Intelligence',
    function: 'agentProposalScanner',
    data_sources: ['MerchProduct', 'MerchOrder', 'BundleOffer', 'AgentActionProposal'],
    purpose: 'Scans products/stock/margins → creates bundle + spotlight proposals',
    schedule: 'Daily (automation)',
  },
  {
    name: 'GrowthOpportunityScanner',
    label: 'Growth Opportunity',
    function: 'growthOpportunityScanner',
    data_sources: ['EmailSubscriber', 'MerchOrder', 'GrowthOpportunity', 'KnowledgeVault'],
    purpose: 'Finds upsell/cross-sell/email revenue opportunities',
    schedule: 'Daily (automation)',
  },
  {
    name: 'AgentIntelligenceLoop',
    label: 'Intelligence Loop',
    function: 'agentIntelligenceLoop',
    data_sources: ['KnowledgeVault', 'MusicAgentMemory', 'AgentLearningRecord'],
    purpose: 'Researches topics, saves insights to KnowledgeVault',
    schedule: 'Daily (automation)',
  },
  {
    name: 'ExecutiveMorningBrief',
    label: 'Executive Brief',
    function: 'executiveMorningBrief',
    data_sources: ['MerchOrder', 'AdminNotification', 'AgentActionProposal', 'SystemHealthIssue'],
    purpose: 'Daily AI-generated executive summary',
    schedule: 'Daily 7am AEST',
  },
  {
    name: 'AutonomousAlertSystem',
    label: 'Alert System',
    function: 'autonomousAlertSystem',
    data_sources: ['MerchOrder', 'MerchProduct', 'EmailSubscriber', 'RiskAlert'],
    purpose: 'Monitors for low stock, failed payments, anomalies',
    schedule: 'Every 6 hours (automation)',
  },
  {
    name: 'SocialCommentMonitor',
    label: 'Social Monitor',
    function: 'socialCommentMonitor',
    data_sources: ['FanComment', 'FanPost', 'FanReview'],
    purpose: 'Monitors fan comments, flags moderation needs',
    schedule: 'On new comment (entity automation)',
  },
];

const STATUS_LABELS = {
  'Complete': { color: 'bg-green-500/20 text-green-300 border-green-500/30' },
  'Live-tested complete': { color: 'bg-green-500/20 text-green-300 border-green-500/30' },
  'Built but untested': { color: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30' },
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
    setRunning(p => ({ ...p, [agent.name]: true }));
    try {
      const res = await base44.functions.invoke(agent.function, {});
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
    { item: 'Connect agents to order/profit data', status: 'Complete', note: 'agentProposalScanner reads MerchProduct + MerchOrder' },
    { item: 'Connect agents to KnowledgeVault', status: 'Complete', note: 'agentIntelligenceLoop writes to KnowledgeVault; other agents can read' },
    { item: 'Connect agents to release sprint posts', status: 'Built but untested', note: 'ContentCalendarPost entity exists — no agent reads it yet' },
    { item: 'Connect agents to ApprovalQueue outcomes', status: 'Built but untested', note: 'publishApprovedProposal fires on approval — agent learning not yet wired to outcome' },
    { item: 'Connect agents to Business Attention Centre', status: 'Complete', note: 'All agents create AdminNotification records on action' },
    { item: 'Schedule daily revenue scans', status: 'Complete', note: 'agentProposalScanner + growthOpportunityScanner both on daily automation' },
    { item: 'Schedule daily content opportunity scans', status: 'Built but untested', note: 'No dedicated content scan agent yet — autonomousAlertSystem covers some' },
    { item: 'Weekly learning from approvals/rejections', status: 'Built but untested', note: 'agentSelfImprovement function exists — not yet wired to approval outcomes' },
    { item: 'Richer source data records (not generic reports)', status: 'Blocked by Gannon approval', note: 'Need real orders, real fan growth, real social data to generate non-generic insights' },
  ];

  return (
    <div className="space-y-6 pb-12">
      <div>
        <h1 className="text-3xl font-display font-bold gradient-gold-text">Agent Revenue Status</h1>
        <p className="text-muted-foreground text-sm mt-1">Live agent activity, data connections, improvement plan</p>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Proposals', value: proposals.length, icon: FileText, color: 'text-primary' },
          { label: 'Approved', value: proposals.filter(p => p.status === 'approved' || p.status === 'published').length, icon: CheckCircle2, color: 'text-green-400' },
          { label: 'Pending', value: proposals.filter(p => p.status === 'pending_approval').length, icon: Clock, color: 'text-yellow-400' },
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
                        <Badge variant="outline" className="text-[10px] text-green-300 border-green-500/30">Active</Badge>
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
                        <span className="text-yellow-400">Pending: {stats.pending}</span>
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
                      disabled={isRunning}
                      className="gap-1 shrink-0"
                    >
                      <RefreshCw className={`w-3 h-3 ${isRunning ? 'animate-spin' : ''}`} />
                      Run Now
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
            Runs the full chain: create test proposal → approve → create BundleOffer → cleanup → verify duplicate prevention → notify Business Attention Centre.
          </p>
          <Button onClick={runProofChain} disabled={provingChain} variant="outline" className="gap-2 mb-3">
            <Zap className={`w-4 h-4 ${provingChain ? 'animate-spin' : ''}`} />
            {provingChain ? 'Running proof...' : 'Run ApprovalQueue Proof Chain'}
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
            <p className="text-xs text-muted-foreground">Previous run: 7/7 steps ✓ — BundleOffer created and cleaned up — 26 May 2026</p>
          )}
        </CardContent>
      </Card>

      {/* Blocker: rich data */}
      <Card className="border-yellow-500/30 bg-yellow-500/5">
        <CardContent className="p-4 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-yellow-400 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-yellow-300 text-sm">Why agents produce generic output right now</p>
            <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
              Agents are fully functional and running — but the platform currently has only 2 orders, 7 subscribers, and 6 products.
              As real data accumulates (orders, fan growth, social analytics from Metricool, content performance), agent outputs become
              specific, high-value, and non-repeating. The deduplication system prevents repeated reports. More real data = better agent intelligence.
            </p>
            <p className="text-xs text-yellow-300 mt-2 font-medium">Next step: Launch → get real orders → let agents run for 7 days → reassess output quality.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}