import { useState } from 'react';
import { Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useMutation } from '@tanstack/react-query';
import { useToast } from '@/components/ui/use-toast';
import { ArrowLeft, CheckCircle2, AlertTriangle, Shield, Zap, Play } from 'lucide-react';

const TOOLS = [
  {
    name: 'createApprovalItem',
    purpose: 'Create an Approval Queue item for any agent-proposed action requiring human review',
    agents: ['All agents'],
    riskLevel: 'low',
    approvalRequired: false,
    reads: ['agent proposal data'],
    writes: ['ApprovalQueue entity'],
    externalImpact: false,
    paidCredits: false,
    function: 'onNewApprovalItem',
  },
  {
    name: 'createBusinessAttentionAlert',
    purpose: 'Create a notification in the Business Attention Centre (AdminNotification)',
    agents: ['Orchestrator', 'All agents'],
    riskLevel: 'low',
    approvalRequired: false,
    reads: ['trigger event data'],
    writes: ['AdminNotification entity'],
    externalImpact: false,
    paidCredits: false,
    function: 'notifyAdmin',
  },
  {
    name: 'createSystemHealthIssue',
    purpose: 'Log a technical issue in System Health for monitoring and resolution',
    agents: ['QA Systems Auditor', 'Orchestrator'],
    riskLevel: 'low',
    approvalRequired: false,
    reads: ['health check data'],
    writes: ['SystemHealthIssue entity'],
    externalImpact: false,
    paidCredits: false,
    function: 'runSiteHealthCheck',
  },
  {
    name: 'createKnowledgeVaultRecord',
    purpose: 'Store a piece of knowledge, insight, or memory in the Knowledge Vault',
    agents: ['All agents'],
    riskLevel: 'low',
    approvalRequired: false,
    reads: ['agent analysis output'],
    writes: ['KnowledgeVault entity'],
    externalImpact: false,
    paidCredits: false,
    function: null,
  },
  {
    name: 'createRevenueOpportunity',
    purpose: 'Log a new revenue opportunity for Gannon review and prioritisation',
    agents: ['Revenue Agent', 'Orchestrator'],
    riskLevel: 'low',
    approvalRequired: false,
    reads: ['orders, subscribers, content data'],
    writes: ['RevenueOpportunity entity'],
    externalImpact: false,
    paidCredits: false,
    function: 'agentProposalScanner',
  },
  {
    name: 'createBundleProposal',
    purpose: 'Draft a bundle offer proposal for Gannon review. Does NOT publish to store.',
    agents: ['Merch Sales Agent', 'Revenue Agent'],
    riskLevel: 'medium',
    approvalRequired: true,
    reads: ['MerchProduct, MerchOrder'],
    writes: ['AgentActionProposal entity'],
    externalImpact: false,
    paidCredits: false,
    function: 'agentProposalScanner',
  },
  {
    name: 'createContentDraft',
    purpose: 'Prepare a social media caption, email copy, or content brief for review',
    agents: ['Social Content Agent', 'Content Revenue Agent'],
    riskLevel: 'low',
    approvalRequired: true,
    reads: ['Release, SocialVideo data'],
    writes: ['KnowledgeVault (draft)'],
    externalImpact: false,
    paidCredits: true,
    function: null,
  },
  {
    name: 'createTikTokDraftProposal',
    purpose: 'Prepare a TikTok draft upload proposal. Requires Gannon approval before upload.',
    agents: ['Social Content Agent'],
    riskLevel: 'high',
    approvalRequired: true,
    reads: ['SocialVideo, Release'],
    writes: ['AgentActionProposal'],
    externalImpact: true,
    paidCredits: false,
    function: 'tiktokUploadDraft',
  },
  {
    name: 'createEmailDraft',
    purpose: 'Draft an email for subscriber campaign review. Does NOT send.',
    agents: ['Email Revenue Agent'],
    riskLevel: 'medium',
    approvalRequired: true,
    reads: ['EmailSubscriber count, Release data'],
    writes: ['KnowledgeVault (draft)'],
    externalImpact: false,
    paidCredits: false,
    function: null,
  },
  {
    name: 'createCoachingResourceDraft',
    purpose: 'Prepare coaching content for private staging. NEVER published publicly.',
    agents: ['Coaching Agent (future)'],
    riskLevel: 'high',
    approvalRequired: true,
    reads: ['Private coaching data'],
    writes: ['KnowledgeVault (private)'],
    externalImpact: false,
    paidCredits: false,
    function: null,
  },
  {
    name: 'createSyncPitchDraft',
    purpose: 'Prepare a sync licensing pitch draft for music supervisor targeting',
    agents: ['Sync Licensing Agent'],
    riskLevel: 'low',
    approvalRequired: true,
    reads: ['Release, KnowledgeVault'],
    writes: ['RevenueOpportunity, KnowledgeVault'],
    externalImpact: false,
    paidCredits: false,
    function: null,
  },
  {
    name: 'createPublishingTargetList',
    purpose: 'Generate a list of publishers, supervisors, or labels for outreach',
    agents: ['Sync Licensing Agent', 'Partnership Agent'],
    riskLevel: 'low',
    approvalRequired: false,
    reads: ['KnowledgeVault, external research'],
    writes: ['KnowledgeVault'],
    externalImpact: false,
    paidCredits: true,
    function: 'autonomousResearch',
  },
  {
    name: 'runClickabilityAudit',
    purpose: 'Catalogue all routes and elements for Playwright QA testing',
    agents: ['QA Systems Auditor'],
    riskLevel: 'low',
    approvalRequired: false,
    reads: ['App.jsx, AdminLayout route map'],
    writes: ['SystemHealthIssue, AdminNotification'],
    externalImpact: false,
    paidCredits: false,
    function: 'automatedSiteTests',
  },
  {
    name: 'runPlaywrightTest',
    purpose: 'Trigger external Playwright test pack. Requires external runner on gannonwaye.com.',
    agents: ['QA Systems Auditor'],
    riskLevel: 'low',
    approvalRequired: false,
    reads: ['test results'],
    writes: ['SystemHealthIssue, AdminNotification'],
    externalImpact: false,
    paidCredits: false,
    function: null,
  },
  {
    name: 'runProfitLossRecalculation',
    purpose: 'Recalculate P&L for all orders using current product cost/delivery data',
    agents: ['Revenue Agent', 'Commerce Agent'],
    riskLevel: 'low',
    approvalRequired: false,
    reads: ['MerchOrder, MerchProduct'],
    writes: ['RevenueOpportunity (summary)'],
    externalImpact: false,
    paidCredits: false,
    function: null,
  },
  {
    name: 'runOrderReconciliation',
    purpose: 'Cross-check Stripe events against MerchOrder records to find gaps',
    agents: ['Revenue Agent'],
    riskLevel: 'medium',
    approvalRequired: false,
    reads: ['StripeEventLog, MerchOrder'],
    writes: ['PaymentDiagnostic, AdminNotification'],
    externalImpact: false,
    paidCredits: false,
    function: 'stripeIntelligenceRouter',
  },
  {
    name: 'runAgentCapabilityAudit',
    purpose: 'Check all registered agents are active and their tool access is correct',
    agents: ['QA Systems Auditor', 'Orchestrator'],
    riskLevel: 'low',
    approvalRequired: false,
    reads: ['AgentRegistry'],
    writes: ['SystemHealthIssue'],
    externalImpact: false,
    paidCredits: false,
    function: 'agentSelfImprovement',
  },
  {
    name: 'runWebsiteEvolutionScan',
    purpose: 'Scan public site pages for UX issues, broken elements, and improvements',
    agents: ['QA Systems Auditor'],
    riskLevel: 'low',
    approvalRequired: false,
    reads: ['Public site pages'],
    writes: ['SystemHealthIssue, RevenueOpportunity'],
    externalImpact: false,
    paidCredits: false,
    function: 'runSiteHealthCheck',
  },
];

const riskColor = {
  low: 'bg-green-500/20 text-green-300 border-green-500/30',
  medium: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
  high: 'bg-red-500/20 text-red-300 border-red-500/30',
};

export default function AgentToolRegistry() {
  const { toast } = useToast();
  const [selected, setSelected] = useState(TOOLS[0]);
  const [filter, setFilter] = useState('all');

  const filtered = filter === 'all' ? TOOLS
    : filter === 'approval' ? TOOLS.filter(t => t.approvalRequired)
    : filter === 'external' ? TOOLS.filter(t => t.externalImpact)
    : filter === 'paid' ? TOOLS.filter(t => t.paidCredits)
    : TOOLS.filter(t => t.riskLevel === filter);

  const createHealthIssue = useMutation({
    mutationFn: (tool) => base44.entities.SystemHealthIssue.create({
      system_area: 'agents',
      issue_title: `Tool not yet connected: ${tool.name}`,
      severity: tool.riskLevel === 'high' ? 'warning' : 'info',
      detected_by: 'AgentToolRegistry',
      recommended_fix: tool.function ? `Wire to existing function: ${tool.function}` : 'Build backend function for this tool',
      status: 'open',
      requires_approval: tool.approvalRequired,
      risk_type: tool.externalImpact ? 'public_content' : 'data',
      last_checked: new Date().toISOString(),
    }),
    onSuccess: () => toast({ title: 'System Health issue created' }),
  });

  return (
    <div className="space-y-6 pb-10">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-3">
          <Link to="/admin"><Button variant="ghost" size="sm"><ArrowLeft className="w-4 h-4" /></Button></Link>
          <div>
            <h1 className="text-3xl font-display font-bold gradient-gold-text">Agent Tool Registry</h1>
            <p className="text-sm text-muted-foreground mt-1">{TOOLS.length} tools catalogued — what every agent can and cannot do.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          ['Total Tools', TOOLS.length, 'text-foreground'],
          ['Approval Required', TOOLS.filter(t => t.approvalRequired).length, 'text-yellow-400'],
          ['External Impact', TOOLS.filter(t => t.externalImpact).length, 'text-red-400'],
          ['Paid Credits', TOOLS.filter(t => t.paidCredits).length, 'text-primary'],
        ].map(([label, count, color]) => (
          <Card key={label}><CardContent className="p-4">
            <p className={`text-2xl font-bold ${color}`}>{count}</p>
            <p className="text-xs text-muted-foreground">{label}</p>
          </CardContent></Card>
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        {[['all', 'All'], ['approval', 'Needs Approval'], ['external', 'External Impact'], ['paid', 'Uses Credits'], ['low', 'Low Risk'], ['medium', 'Medium Risk'], ['high', 'High Risk']].map(([id, label]) => (
          <Button key={id} size="sm" variant={filter === id ? 'default' : 'outline'} onClick={() => setFilter(id)}>{label}</Button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="space-y-1 overflow-y-auto max-h-[70vh]">
          {filtered.map(tool => (
            <Card key={tool.name} className={`cursor-pointer hover:border-primary/40 transition-colors ${selected?.name === tool.name ? 'border-primary/60' : ''}`} onClick={() => setSelected(tool)}>
              <CardContent className="p-3">
                <div className="flex items-center justify-between gap-2">
                  <p className="font-mono text-xs font-semibold">{tool.name}</p>
                  <Badge className={riskColor[tool.riskLevel]}>{tool.riskLevel}</Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{tool.purpose}</p>
                <div className="flex gap-1 mt-1 flex-wrap">
                  {tool.approvalRequired && <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-500/30 text-xs">Approval</Badge>}
                  {tool.externalImpact && <Badge className="bg-red-500/20 text-red-300 border-red-500/30 text-xs">External</Badge>}
                  {tool.paidCredits && <Badge className="bg-primary/20 text-primary border-primary/30 text-xs">Paid</Badge>}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {selected && (
          <Card className="lg:col-span-2">
            <CardHeader className="pb-2">
              <CardTitle className="font-mono text-base">{selected.name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div><p className="text-xs text-muted-foreground">Purpose</p><p>{selected.purpose}</p></div>

              <div className="flex gap-2 flex-wrap">
                <Badge className={riskColor[selected.riskLevel]}>Risk: {selected.riskLevel}</Badge>
                {selected.approvalRequired && <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-500/30">Requires Approval</Badge>}
                {selected.externalImpact && <Badge className="bg-red-500/20 text-red-300 border-red-500/30">External Impact</Badge>}
                {selected.paidCredits && <Badge className="bg-primary/20 text-primary border-primary/30">Uses Paid Credits</Badge>}
                {!selected.externalImpact && !selected.approvalRequired && <Badge className="bg-green-500/20 text-green-300 border-green-500/30">Safe to Auto-run</Badge>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Agents Allowed</p>
                  <div className="flex flex-wrap gap-1">{selected.agents.map(a => <Badge key={a} variant="outline" className="text-xs">{a}</Badge>)}</div>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Backend Function</p>
                  <p className="font-mono text-xs">{selected.function || 'Not yet wired'}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Data It Reads</p>
                  <div className="flex flex-wrap gap-1">{selected.reads.map(r => <Badge key={r} variant="outline" className="text-xs">{r}</Badge>)}</div>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Data It Writes</p>
                  <div className="flex flex-wrap gap-1">{selected.writes.map(w => <Badge key={w} variant="outline" className="text-xs">{w}</Badge>)}</div>
                </div>
              </div>

              <div className="rounded-lg border border-border/50 p-3 text-xs text-muted-foreground">
                Source chain: Agent request → Tool Registry check → Risk validation → {selected.approvalRequired ? 'Approval Queue → Gannon approves → ' : ''}Execute → {selected.externalImpact ? 'External action → ' : ''}Result stored → Audit log
              </div>

              <div className="flex gap-2 flex-wrap">
                <Button variant="outline" size="sm" onClick={() => createHealthIssue.mutate(selected)}><Shield className="w-3 h-3 mr-1" />Log Health Issue</Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}