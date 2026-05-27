import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import {
  Brain, RefreshCw, AlertTriangle,
  Play, Eye, TrendingUp, Shield, Star, BarChart2,
  Calendar, Layers, Users, Lock, ChevronRight
} from 'lucide-react';
import { toast } from 'sonner';

const AGENTS = [
  {
    name: 'Social Orchestrator',
    group: 'social',
    icon: Layers,
    color: 'text-primary',
    purpose: 'Coordinates all social content, Metricool scheduling, approvals, assets, performance',
    money_purpose: 'Drives fan growth → merch sales, streaming, support',
    risk: 'low',
    tools: ['ContentCalendarPost', 'ApprovalQueue', 'generateDailyDrafts', 'socialQualityCouncil'],
    run_fn: null,
    path: '/admin/social-agent-os',
  },
  {
    name: 'Trend Research Agent',
    group: 'social',
    icon: TrendingUp,
    color: 'text-cyan-400',
    purpose: 'Researches TikTok, Instagram, YouTube Shorts, Threads trends for Gannon Waye content',
    money_purpose: 'Viral trend alignment → follower growth → revenue',
    risk: 'low',
    tools: ['autonomousTrendEngine', 'KnowledgeVault'],
    run_fn: 'autonomousTrendEngine',
    path: '/admin/trend-monitor',
  },
  {
    name: 'Brand Voice Agent',
    group: 'social',
    icon: Star,
    color: 'text-yellow-400',
    purpose: 'Turns ideas into authentic Gannon Waye content — emotional, cinematic, direct, human',
    money_purpose: 'Brand consistency → fan loyalty → long-term revenue',
    risk: 'low',
    tools: ['generateDailyDrafts', 'ContentCalendarPost'],
    run_fn: 'generateDailyDrafts',
    path: '/admin/daily-post-engine',
  },
  {
    name: 'Content Quality Agent',
    group: 'social',
    icon: BarChart2,
    color: 'text-orange-400',
    purpose: 'Scores brand fit, viral potential, emotional connection, cringe risk, platform fit',
    money_purpose: 'Quality control → protects brand → maintains audience trust',
    risk: 'low',
    tools: ['socialQualityCouncil', 'AgentLearningRecord'],
    run_fn: 'socialQualityCouncil',
    path: '/admin/content-quality-review',
  },
  {
    name: 'Compliance Gatekeeper',
    group: 'security',
    icon: Shield,
    color: 'text-red-400',
    purpose: 'Blocks publishing/scheduling/outreach without approval — no exceptions',
    money_purpose: 'Legal protection, platform safety, reputation shield',
    risk: 'none',
    tools: ['ApprovalQueue', 'AdminNotification'],
    run_fn: null,
    path: '/admin/approval-queue',
  },
  {
    name: 'Supervisor Agent',
    group: 'social',
    icon: Users,
    color: 'text-pink-400',
    purpose: 'Reviews all agent outputs — rejects generic/embarrassing/off-brand content',
    money_purpose: 'Quality assurance → brand protection',
    risk: 'none',
    tools: ['socialQualityCouncil'],
    run_fn: null,
    path: '/admin/social-agent-os',
  },
  {
    name: 'Revenue Intelligence Agent',
    group: 'business',
    icon: TrendingUp,
    color: 'text-emerald-400',
    purpose: 'Connects social content to store, fans, supporters, bookings, merch, releases',
    money_purpose: 'Direct revenue opportunities from content and audience data',
    risk: 'low',
    tools: ['agentProposalScanner', 'RevenueOpportunity', 'ApprovalQueue'],
    run_fn: 'agentProposalScanner',
    path: '/admin/agent-revenue-status',
  },
  {
    name: 'QA Systems Auditor',
    group: 'systems',
    icon: Shield,
    color: 'text-blue-400',
    purpose: 'Audits routes, clicks, data, system health — creates actionable fix records',
    money_purpose: 'System reliability → checkout works → no lost revenue from broken pages',
    risk: 'none',
    tools: ['runSiteHealthCheck', 'SystemHealthIssue', 'AdminNotification'],
    run_fn: 'runSiteHealthCheck',
    path: '/admin/site-health',
  },
  {
    name: 'Music Strategy Agent',
    group: 'music',
    icon: Brain,
    color: 'text-purple-400',
    purpose: 'Release strategy, sprint planning, distribution tracking, sync licensing',
    money_purpose: 'Release monetisation, sync deals, streaming royalties',
    risk: 'low',
    tools: ['generateReleaseSprint', 'MusicAgentMemory'],
    run_fn: 'generateReleaseSprint',
    path: '/admin/music-command',
  },
  {
    name: 'Metricool Scheduling Agent',
    group: 'social',
    icon: Calendar,
    color: 'text-green-400',
    purpose: 'Prepares schedule-ready posts — CANNOT schedule without ApprovalQueue approval',
    money_purpose: 'Consistent posting → audience growth → revenue',
    risk: 'low',
    tools: ['metricoolSchedulePost', 'ApprovalQueue', 'ContentCalendarPost'],
    run_fn: null,
    path: '/admin/metricool-command',
  },
];

const RISK_COLORS = {
  none: 'bg-green-500/10 text-green-400 border-green-500/30',
  low: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
  medium: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
  high: 'bg-red-500/10 text-red-400 border-red-500/30',
};

export default function AgentWorkbench() {
  const queryClient = useQueryClient();
  const [running, setRunning] = useState(null);
  const [filter, setFilter] = useState('all');

  const { data: approvals = [] } = useQuery({
    queryKey: ['agent-workbench-approvals'],
    queryFn: () => base44.entities.ApprovalQueue.filter({ status: 'pending' }, '-created_date', 5),
  });
  const { data: drafts = [] } = useQuery({
    queryKey: ['agent-workbench-drafts'],
    queryFn: () => base44.entities.ContentCalendarPost.filter({ status: 'draft' }, '-created_date', 5),
  });

  const runAgent = async (agent) => {
    if (!agent.run_fn) { toast.info(`${agent.name} runs automatically as part of workflows`); return; }
    setRunning(agent.name);
    try {
      const payload = agent.run_fn === 'generateDailyDrafts'
        ? { date: new Date().toISOString().slice(0, 10), post_count: 2 }
        : {};
      const res = await base44.functions.invoke(agent.run_fn, payload);
      queryClient.invalidateQueries({ queryKey: ['agent-workbench-drafts'] });
      queryClient.invalidateQueries({ queryKey: ['agent-workbench-approvals'] });
      toast.success(`${agent.name}: ${res.data?.message || 'complete'}`);
    } catch (e) {
      toast.error(`${agent.name}: ${e?.response?.data?.error || e.message}`);
    }
    setRunning(null);
  };

  const groups = ['all', 'social', 'business', 'music', 'systems', 'security'];
  const filtered = filter === 'all' ? AGENTS : AGENTS.filter(a => a.group === filter);

  return (
    <div className="space-y-6 pb-12">
      <div>
        <p className="font-body text-xs tracking-[0.3em] uppercase gradient-gold-glow mb-1">Intelligence System</p>
        <h1 className="font-display text-3xl font-bold gradient-gold-text">Agent Workbench</h1>
        <p className="text-muted-foreground text-sm mt-1">All agents · Run controls · Approval gates · Output tracking</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Total Agents', value: AGENTS.length, color: 'text-primary' },
          { label: 'Pending Approvals', value: approvals.length, color: 'text-amber-400' },
          { label: 'Draft Posts', value: drafts.length, color: 'text-blue-400' },
          { label: 'Auto-Post Risk', value: 'ZERO', color: 'text-green-400' },
        ].map(s => (
          <Card key={s.label}><CardContent className="p-4">
            <p className={`text-2xl font-bold font-display ${s.color}`}>{s.value}</p>
            <p className="text-xs text-muted-foreground">{s.label}</p>
          </CardContent></Card>
        ))}
      </div>

      {/* Approval Alert */}
      {approvals.length > 0 && (
        <Card className="border-amber-500/30 bg-amber-500/5">
          <CardContent className="p-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
              <p className="text-sm text-amber-400 font-semibold">{approvals.length} agent outputs awaiting your approval</p>
            </div>
            <Link to="/admin/approval-queue">
              <Button size="sm" variant="outline" className="border-amber-500/40 text-amber-400 gap-1">
                Review <ChevronRight className="w-3 h-3" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}

      {/* Filter */}
      <div className="flex gap-2 flex-wrap">
        {groups.map(g => (
          <Button key={g} size="sm" variant={filter === g ? 'default' : 'outline'} onClick={() => setFilter(g)} className="capitalize">
            {g}
          </Button>
        ))}
      </div>

      {/* Agent Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map(agent => (
          <Card key={agent.name} className="hover:border-primary/30 transition-all">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <agent.icon className={`w-4 h-4 shrink-0 ${agent.color}`} />
                {agent.name}
                <Badge variant="outline" className={`ml-auto text-[10px] border ${RISK_COLORS[agent.risk]}`}>
                  risk: {agent.risk}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0 space-y-3">
              <p className="text-xs text-muted-foreground leading-relaxed">{agent.purpose}</p>
              <div className="text-xs text-emerald-400 flex items-start gap-1.5">
                <TrendingUp className="w-3 h-3 shrink-0 mt-0.5" />
                <span>{agent.money_purpose}</span>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                {agent.tools.slice(0, 3).map(t => (
                  <Badge key={t} variant="outline" className="text-[10px]">{t}</Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={() => runAgent(agent)}
                  disabled={running === agent.name}
                  className="gap-1 flex-1"
                >
                  {running === agent.name
                    ? <RefreshCw className="w-3 h-3 animate-spin" />
                    : <Play className="w-3 h-3" />}
                  {agent.run_fn ? 'Run Now' : 'Auto-runs'}
                </Button>
                <Link to={agent.path}>
                  <Button size="sm" variant="outline" className="gap-1">
                    <Eye className="w-3 h-3" /> View
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Zero auto-posting policy */}
      <Card className="border-green-500/20 bg-green-500/5">
        <CardContent className="p-4 flex items-start gap-3">
          <Lock className="w-5 h-5 text-green-400 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-green-400">Zero Auto-Posting Policy — Non-Negotiable</p>
            <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
              All agent outputs go to ApprovalQueue. No content, schedule, email, or action reaches the outside world without explicit Gannon approval.
              Compliance Gatekeeper blocks all risky actions regardless of agent confidence.
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-2 flex-wrap">
        <Link to="/admin/social-agent-os"><Button variant="outline" size="sm">Social Agent OS</Button></Link>
        <Link to="/admin/approval-queue"><Button variant="outline" size="sm">Approval Queue</Button></Link>
        <Link to="/admin/daily-post-engine"><Button variant="outline" size="sm">Daily Post Engine</Button></Link>
        <Link to="/admin/agent-learning"><Button variant="outline" size="sm">Agent Learning</Button></Link>
      </div>
    </div>
  );
}