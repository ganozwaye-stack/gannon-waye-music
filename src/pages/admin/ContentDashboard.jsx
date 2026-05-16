import { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Bot, Brain, TrendingUp, AlertTriangle, CheckCircle2, Clock,
  Zap, BookOpen, MessageSquare, RefreshCw, Loader2, Copy, Eye,
  Play, ChevronRight, Activity, Shield, Lightbulb, Search
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { toast } from 'sonner';

// ── Bot Interaction Rules ─────────────────────────────────────────────────────
const BOT_RULES = [
  { id: 1, rule: 'Never spend, subscribe, or commit money without Gannon approval', category: 'financial', enforced: true },
  { id: 2, rule: 'Never publish content publicly without Gannon approval', category: 'publishing', enforced: true },
  { id: 3, rule: 'Auto-respond to general positive fan comments', category: 'social', enforced: true },
  { id: 4, rule: 'Escalate business opportunities, press, and collabs to Gannon', category: 'social', enforced: true },
  { id: 5, rule: 'Ignore trolls — no response, no energy', category: 'moderation', enforced: true },
  { id: 6, rule: 'Research every hour, save all findings to Knowledge Vault', category: 'learning', enforced: true },
  { id: 7, rule: 'Generate daily trend report + money opportunity by 7am', category: 'learning', enforced: true },
  { id: 8, rule: 'Log every action to AgentTaskLog — full transparency', category: 'governance', enforced: true },
  { id: 9, rule: 'Never give legal advice — flag and escalate to professional', category: 'legal', enforced: true },
  { id: 10, rule: 'Never delete data without explicit Gannon approval', category: 'data', enforced: true },
  { id: 11, rule: 'Draft responses in Gannon\'s brand voice: warm, direct, authentic', category: 'voice', enforced: true },
  { id: 12, rule: 'Always protect fan privacy — no sharing of personal data', category: 'privacy', enforced: true },
];

const RULE_COLORS = {
  financial: 'bg-green-500/10 text-green-400',
  publishing: 'bg-blue-500/10 text-blue-400',
  social: 'bg-purple-500/10 text-purple-400',
  moderation: 'bg-red-500/10 text-red-400',
  learning: 'bg-amber-500/10 text-amber-400',
  governance: 'bg-cyan-500/10 text-cyan-400',
  legal: 'bg-orange-500/10 text-orange-400',
  data: 'bg-rose-500/10 text-rose-400',
  voice: 'bg-pink-500/10 text-pink-400',
  privacy: 'bg-indigo-500/10 text-indigo-400',
};

// ── Bot Workflow Map ──────────────────────────────────────────────────────────
const BOT_WORKFLOW = [
  {
    step: 1, label: 'Perceive', icon: Eye, color: 'text-blue-400',
    desc: 'Agents monitor: social comments, research topics, trend signals, approval queue, risk alerts',
  },
  {
    step: 2, label: 'Classify', icon: Brain, color: 'text-purple-400',
    desc: 'AI categorises every input: is this general, important, a risk, an opportunity, or a threat?',
  },
  {
    step: 3, label: 'Risk Check', icon: Shield, color: 'text-yellow-400',
    desc: 'Do-Not-Spend rule enforced: could this cost money, create legal risk, or damage reputation?',
  },
  {
    step: 4, label: 'Act or Escalate', icon: Zap, color: 'text-green-400',
    desc: 'Low-risk → auto-handle and log. High-risk → pause, create ApprovalQueue entry, notify Gannon',
  },
  {
    step: 5, label: 'Learn & Log', icon: BookOpen, color: 'text-amber-400',
    desc: 'Every action is logged to AgentTaskLog. Research findings saved to Knowledge Vault automatically',
  },
];

export default function ContentDashboard() {
  const [generatingIdea, setGeneratingIdea] = useState(false);
  const [freshIdea, setFreshIdea] = useState(null);
  const qc = useQueryClient();

  // Live data
  const { data: recentResearch = [], isLoading: loadingResearch } = useQuery({
    queryKey: ['vault-research-feed'],
    queryFn: () => base44.entities.KnowledgeVault.filter({ category: 'research' }, '-created_date', 10),
  });
  const { data: creativeDocs = [] } = useQuery({
    queryKey: ['vault-creative-feed'],
    queryFn: () => base44.entities.KnowledgeVault.filter({ category: 'creative' }, '-created_date', 10),
  });
  const { data: recentLogs = [] } = useQuery({
    queryKey: ['bot-task-logs'],
    queryFn: () => base44.entities.AgentTaskLog.list('-created_date', 15),
  });
  const { data: openAlerts = [] } = useQuery({
    queryKey: ['open-alerts-dash'],
    queryFn: () => base44.entities.RiskAlert.filter({ status: 'open' }),
  });
  const { data: pendingApprovals = [] } = useQuery({
    queryKey: ['pending-approvals-dash'],
    queryFn: () => base44.entities.ApprovalQueue.filter({ status: 'pending' }),
  });

  const generateIdea = async () => {
    setGeneratingIdea(true);
    setFreshIdea(null);
    const res = await base44.integrations.Core.InvokeLLM({
      prompt: `You are an elite creative strategist for Gannon Waye, an Australian LGBTQIA+ affirming pop artist with debut single "Thank You".

Generate ONE breakthrough content idea right now. Make it:
- Specific and executable today
- Viral potential with low/no budget
- Authentic to Gannon's brand (warm, vulnerable, real, safe-space)
- Either for TikTok, Instagram Reels, or YouTube Shorts

Format:
🎯 IDEA TITLE (bold, punchy)
Platform: [platform]
Hook: [opening 3 seconds or caption hook]
Execution: [exactly what to film/post]
Why it'll work: [algorithm + emotional reason]
Revenue potential: [how this converts to sales/fans]`,
      add_context_from_internet: true,
    });
    setFreshIdea(res);
    setGeneratingIdea(false);
    // Save to vault
    await base44.entities.KnowledgeVault.create({
      title: `Fresh Idea — ${new Date().toLocaleTimeString('en-AU')}`,
      category: 'creative',
      content: res,
      summary: 'On-demand creative idea generated',
      tags: ['idea', 'creative', 'on-demand'],
      source: 'ContentDashboard',
      access_level: 'admin_only',
    });
    qc.invalidateQueries({ queryKey: ['vault-creative-feed'] });
  };

  const dismissAlert = useMutation({
    mutationFn: ({ id }) => base44.entities.RiskAlert.update(id, { status: 'dismissed' }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['open-alerts-dash'] }),
  });

  const resolveApproval = useMutation({
    mutationFn: ({ id, status }) => base44.entities.ApprovalQueue.update(id, {
      status,
      decided_by: 'Gannon Waye',
      decided_at: new Date().toISOString(),
    }),
    onSuccess: (_, v) => {
      qc.invalidateQueries({ queryKey: ['pending-approvals-dash'] });
      toast.success(`Action ${v.status}`);
    },
  });

  const autoRunResearch = async () => {
    toast.info('Triggering research agent...');
    const res = await base44.functions.invoke('autonomousResearch', {});
    toast.success(`Research complete: ${res.data?.saved || 'Saved to vault'}`);
    qc.invalidateQueries({ queryKey: ['vault-research-feed'] });
  };

  const autoRunTrends = async () => {
    toast.info('Running trend engine...');
    const res = await base44.functions.invoke('autonomousTrendEngine', {});
    toast.success('Trend report saved to Knowledge Vault');
    qc.invalidateQueries({ queryKey: ['vault-creative-feed'] });
    qc.invalidateQueries({ queryKey: ['pending-approvals-dash'] });
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-display font-bold gradient-gold-text">Content Dashboard</h1>
          <p className="text-muted-foreground text-sm">Bot activity, research feed, alerts, and creative engine — all in one</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Button size="sm" onClick={autoRunResearch} variant="outline">
            <Search className="w-3 h-3 mr-1" /> Run Research Now
          </Button>
          <Button size="sm" onClick={autoRunTrends} variant="outline">
            <TrendingUp className="w-3 h-3 mr-1" /> Run Trend Engine Now
          </Button>
        </div>
      </div>

      {/* Status Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card className="border-amber-500/20">
          <CardContent className="p-3 flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-400" />
            <div><p className="text-xl font-bold">{openAlerts.length}</p><p className="text-xs text-muted-foreground">Open Alerts</p></div>
          </CardContent>
        </Card>
        <Card className="border-yellow-500/20">
          <CardContent className="p-3 flex items-center gap-3">
            <Clock className="w-5 h-5 text-yellow-400" />
            <div><p className="text-xl font-bold">{pendingApprovals.length}</p><p className="text-xs text-muted-foreground">Pending Approvals</p></div>
          </CardContent>
        </Card>
        <Card className="border-green-500/20">
          <CardContent className="p-3 flex items-center gap-3">
            <Activity className="w-5 h-5 text-green-400" />
            <div><p className="text-xl font-bold">{recentLogs.length}</p><p className="text-xs text-muted-foreground">Recent Bot Actions</p></div>
          </CardContent>
        </Card>
        <Card className="border-blue-500/20">
          <CardContent className="p-3 flex items-center gap-3">
            <BookOpen className="w-5 h-5 text-blue-400" />
            <div><p className="text-xl font-bold">{recentResearch.length + creativeDocs.length}</p><p className="text-xs text-muted-foreground">Vault Entries</p></div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="alerts">
        <TabsList className="flex flex-wrap h-auto gap-1">
          <TabsTrigger value="alerts">🚨 Alerts & Approvals</TabsTrigger>
          <TabsTrigger value="research">📚 Research Feed</TabsTrigger>
          <TabsTrigger value="creative">💡 Creative Engine</TabsTrigger>
          <TabsTrigger value="activity">⚡ Bot Activity</TabsTrigger>
          <TabsTrigger value="workflow">🗺 Bot Workflow</TabsTrigger>
          <TabsTrigger value="rules">📋 Interaction Rules</TabsTrigger>
        </TabsList>

        {/* ALERTS & APPROVALS */}
        <TabsContent value="alerts" className="space-y-4 mt-4">
          {openAlerts.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold mb-2 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-400" /> Risk Alerts
              </h3>
              <div className="space-y-2">
                {openAlerts.map(a => (
                  <Card key={a.id} className={`border ${a.severity === 'critical' ? 'border-red-500/30' : a.severity === 'high' ? 'border-orange-500/30' : 'border-yellow-500/20'}`}>
                    <CardContent className="p-3 flex items-start gap-3">
                      <AlertTriangle className={`w-4 h-4 shrink-0 mt-0.5 ${a.severity === 'critical' ? 'text-red-400' : 'text-orange-400'}`} />
                      <div className="flex-1">
                        <div className="flex gap-2 mb-1 flex-wrap">
                          <Badge className={`text-xs ${a.severity === 'critical' ? 'bg-red-500/10 text-red-400' : 'bg-orange-500/10 text-orange-400'}`}>{a.severity}</Badge>
                          <Badge className="text-xs bg-secondary text-secondary-foreground">{a.alert_type}</Badge>
                        </div>
                        <p className="text-sm font-medium">{a.title}</p>
                        <p className="text-xs text-muted-foreground">{a.description}</p>
                        {a.recommended_action && <p className="text-xs text-primary mt-1">→ {a.recommended_action}</p>}
                      </div>
                      <Button size="sm" variant="ghost" className="text-xs h-7 shrink-0" onClick={() => dismissAlert.mutate({ id: a.id })}>Dismiss</Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {pendingApprovals.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold mb-2 flex items-center gap-2">
                <Clock className="w-4 h-4 text-yellow-400" /> Pending Approvals
              </h3>
              <div className="space-y-2">
                {pendingApprovals.map(item => (
                  <Card key={item.id} className="border-yellow-500/20">
                    <CardContent className="p-3">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <p className="text-sm font-medium">{item.action_title}</p>
                          <p className="text-xs text-muted-foreground mb-2">{item.agent_name} · Risk: {item.risk_level}</p>
                          {item.proposed_output && <p className="text-xs text-foreground/70 bg-secondary/40 rounded p-2 line-clamp-3">{item.proposed_output}</p>}
                        </div>
                      </div>
                      <div className="flex gap-2 mt-3">
                        <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white h-7 text-xs" onClick={() => resolveApproval.mutate({ id: item.id, status: 'approved' })}>
                          <CheckCircle2 className="w-3 h-3 mr-1" /> Approve
                        </Button>
                        <Button size="sm" variant="destructive" className="h-7 text-xs" onClick={() => resolveApproval.mutate({ id: item.id, status: 'rejected' })}>
                          Reject
                        </Button>
                        <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => resolveApproval.mutate({ id: item.id, status: 'archived' })}>
                          Archive
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {openAlerts.length === 0 && pendingApprovals.length === 0 && (
            <div className="text-center py-16">
              <CheckCircle2 className="w-12 h-12 text-green-400 mx-auto mb-3" />
              <p className="text-foreground font-medium">All clear — no alerts or pending items</p>
              <p className="text-muted-foreground text-sm mt-1">Bots are running autonomously within safe parameters</p>
            </div>
          )}
        </TabsContent>

        {/* RESEARCH FEED */}
        <TabsContent value="research" className="mt-4">
          <div className="space-y-3">
            {loadingResearch && <div className="text-center py-8"><Loader2 className="w-6 h-6 animate-spin text-primary mx-auto" /></div>}
            {[...recentResearch, ...creativeDocs].sort((a, b) => new Date(b.created_date) - new Date(a.created_date)).map(item => (
              <Card key={item.id} className="hover:border-primary/30 transition-all">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <Badge className="text-xs bg-primary/10 text-primary">{item.category?.replace(/_/g, ' ')}</Badge>
                        {item.tags?.slice(0, 3).map(t => <Badge key={t} className="text-xs bg-secondary text-secondary-foreground">{t}</Badge>)}
                      </div>
                      <p className="text-sm font-medium">{item.title}</p>
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{item.summary}</p>
                      <p className="text-xs text-muted-foreground/50 mt-1">{item.source} · {new Date(item.created_date).toLocaleString('en-AU')}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            {recentResearch.length === 0 && creativeDocs.length === 0 && !loadingResearch && (
              <div className="text-center py-12">
                <Brain className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground">Research is running automatically every hour. Click "Run Research Now" above to trigger immediately.</p>
              </div>
            )}
          </div>
        </TabsContent>

        {/* CREATIVE ENGINE */}
        <TabsContent value="creative" className="space-y-4 mt-4">
          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <Lightbulb className="w-5 h-5 text-primary" />
                <p className="font-semibold text-sm">Fresh Idea Generator</p>
              </div>
              <p className="text-xs text-muted-foreground mb-4">Generate a single breakthrough content idea on demand, using live trend data.</p>
              <Button onClick={generateIdea} disabled={generatingIdea} className="gradient-gold-button">
                {generatingIdea ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Generating...</> : <><Zap className="w-4 h-4 mr-2" />Generate Fresh Idea</>}
              </Button>
            </CardContent>
          </Card>

          {freshIdea && (
            <Card className="border-primary/30">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <Badge className="bg-primary/10 text-primary">Fresh Idea</Badge>
                  <Button size="sm" variant="outline" onClick={() => { navigator.clipboard.writeText(freshIdea); toast.success('Copied!'); }}>
                    <Copy className="w-3 h-3 mr-1" /> Copy
                  </Button>
                </div>
                <ReactMarkdown className="text-sm prose prose-sm prose-invert max-w-none">{freshIdea}</ReactMarkdown>
              </CardContent>
            </Card>
          )}

          <div>
            <h3 className="text-sm font-semibold mb-2">Saved Creative Docs</h3>
            <div className="space-y-2">
              {creativeDocs.map(item => (
                <Card key={item.id} className="hover:border-primary/20 transition-all">
                  <CardContent className="p-3 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">{item.title}</p>
                      <p className="text-xs text-muted-foreground line-clamp-1">{item.summary}</p>
                    </div>
                    <Badge className="text-xs bg-secondary text-secondary-foreground shrink-0 ml-2">{new Date(item.created_date).toLocaleDateString('en-AU')}</Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* BOT ACTIVITY */}
        <TabsContent value="activity" className="mt-4">
          <div className="space-y-2">
            {recentLogs.map(log => (
              <Card key={log.id}>
                <CardContent className="p-3 flex items-center gap-3">
                  <Bot className="w-4 h-4 text-primary shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{log.task_title}</p>
                    <p className="text-xs text-muted-foreground">{log.agent_name} · {log.outcome}</p>
                  </div>
                  <div className="flex gap-1 shrink-0">
                    <Badge className={log.was_automatic ? 'bg-green-500/10 text-green-400 text-xs' : 'bg-yellow-500/10 text-yellow-400 text-xs'}>
                      {log.was_automatic ? 'Auto' : 'Manual'}
                    </Badge>
                    <Badge className={`text-xs ${log.risk_check_result === 'pass' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                      {log.risk_check_result || 'pass'}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
            {recentLogs.length === 0 && (
              <div className="text-center py-12">
                <Activity className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground text-sm">No bot activity yet. Agents will start logging here automatically.</p>
              </div>
            )}
          </div>
        </TabsContent>

        {/* BOT WORKFLOW */}
        <TabsContent value="workflow" className="mt-4">
          <div className="space-y-3">
            {BOT_WORKFLOW.map((step, i) => (
              <Card key={step.step}>
                <CardContent className="p-4 flex items-start gap-4">
                  <div className="flex flex-col items-center">
                    <div className={`w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-sm font-bold ${step.color}`}>{step.step}</div>
                    {i < BOT_WORKFLOW.length - 1 && <div className="w-px h-6 bg-border mt-1" />}
                  </div>
                  <div className="flex-1 pt-1">
                    <div className="flex items-center gap-2 mb-1">
                      <step.icon className={`w-4 h-4 ${step.color}`} />
                      <p className="font-semibold text-sm">{step.label}</p>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">{step.desc}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* INTERACTION RULES */}
        <TabsContent value="rules" className="mt-4">
          <div className="space-y-2">
            {BOT_RULES.map(rule => (
              <Card key={rule.id}>
                <CardContent className="p-3 flex items-center gap-3">
                  <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0" />
                  <p className="text-sm flex-1">{rule.rule}</p>
                  <Badge className={`text-xs shrink-0 ${RULE_COLORS[rule.category] || 'bg-secondary text-secondary-foreground'}`}>
                    {rule.category}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-4 text-center">All 12 rules enforced 24/7 across all agents. These cannot be overridden by any agent autonomously.</p>
        </TabsContent>
      </Tabs>
    </div>
  );
}