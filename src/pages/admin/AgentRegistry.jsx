import { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Brain, Search, AlertTriangle, ChevronRight, Activity, MessageSquare, CheckCircle2, Clock } from 'lucide-react';
import { AGENT_REGISTRY_SEED } from '@/lib/agentRegistrySeed';
import { Link } from 'react-router-dom';

const GROUPS = ['all','personal','communication','legal','research','creative','website','marketing','social','business','finance','systems','security','orchestrator'];

const STATUS_COLORS = {
  active: 'bg-green-500/10 text-green-400 border-green-500/30',
  inactive: 'bg-slate-500/10 text-slate-400 border-slate-500/30',
  testing: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
  error: 'bg-red-500/10 text-red-400 border-red-500/30',
  disabled: 'bg-zinc-500/10 text-zinc-500 border-zinc-500/30',
};

const RISK_COLORS = { none: 'text-green-400', low: 'text-primary', medium: 'text-orange-400', high: 'text-red-400' };

const RISK_LEGEND = [
  { level: 'none', color: 'text-green-400 bg-green-500/10', label: 'None', desc: 'Fully safe to automate. Cannot spend money or create legal exposure.' },
  { level: 'low', color: 'text-primary bg-primary/10', label: 'Low', desc: 'Minor footprint possible. Allowed to auto-run with logging.' },
  { level: 'medium', color: 'text-orange-400 bg-orange-500/10', label: 'Medium', desc: 'Real cost or public exposure possible. Requires your review.' },
  { level: 'high', color: 'text-red-400 bg-red-500/10', label: 'High', desc: 'Direct financial/legal/reputation risk. Always requires explicit approval.' },
];

// What agents need to be "ready" and useful
const READINESS_CHECKLIST = {
  orchestrator: [
    'Agent is active and connected',
    'You have had at least one conversation with the Orchestrator to brief it on your goals',
    'Risk rules are understood by the agent',
  ],
  marketing: [
    'Social media handles are set in Site Settings',
    'Approval Queue is monitored — all social posts need your approval first',
    'Release date is confirmed (June 5, 2026)',
  ],
  social: [
    'TikTok, Instagram, YouTube handles confirmed',
    'Content calendar discussed with Orchestrator',
    'Approval Queue reviewed daily',
  ],
  research: [
    'Agent will use web search to find real-time information',
    'Store findings in Knowledge Vault for future reference',
    'Brief the agent with your specific research questions',
  ],
  creative: [
    'Share your music files or ideas directly in Orchestrator Chat',
    'Review all creative outputs before publishing',
  ],
  legal: [
    'Add your court case details to Knowledge Vault (marked sensitive)',
    'Legal Dashboard tracks all legal timelines',
    'Always approve before any legal agent takes action',
  ],
  finance: [
    'Connect Stripe (already active) for revenue tracking',
    'Do-Not-Spend rule blocks all financial actions without your approval',
  ],
};

function AgentDetailModal({ agent, onClose }) {

  // DB queries for memories and learning records
  const { data: memories = [] } = useQuery({
    queryKey: ['agent-memories', agent.agent_name],
    queryFn: () => base44.entities.AgentMemory.filter({ agent_name: agent.agent_name }),
    enabled: !!agent.agent_name,
  });

  const { data: learnings = [] } = useQuery({
    queryKey: ['agent-learnings', agent.agent_name],
    queryFn: () => base44.entities.AgentLearningRecord.filter({ agent_name: agent.agent_name }),
    enabled: !!agent.agent_name,
  });

  if (!agent) return null;

  const readinessItems = READINESS_CHECKLIST[agent.group] || [
    'Verify that a real executor is attached before treating this registry record as operational',
    'Brief the Orchestrator on what this agent should focus on',
    'Use the internal execution receipt, not a registry label, as proof of activity',
  ];

  // Dynamic Credentials Audit
  const getMissingCredentials = (group) => {
    switch (group) {
      case 'social':
        return ['TikTok Business API Access Token', 'Meta/Instagram OAuth Sign-in'];
      case 'marketing':
        return ['Metricool API Key (scheduler access)'];
      case 'finance':
        return ['Stripe Webhook Signing Secret', 'Stripe Live Mode Restricted API Key'];
      case 'business':
        return ['eBay Marketplace Developer OAuth Token'];
      default:
        return [];
    }
  };

  const missingCreds = getMissingCredentials(agent.group);
  const registryMarkedActive = agent.status === 'active';
  const currentTask = agent.current_task || 'No verified executor is attached to this registry record.';
  const whyIdle = agent.why_idle || 'Registry status alone does not start, connect, or run an agent.';

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display text-xl flex items-center gap-2">
            <Brain className="w-5 h-5 text-primary" />
            {agent.agent_name}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5 mt-2">
          {/* Status & Risk Row */}
          <div className="flex flex-wrap gap-2 items-center">
            <Badge className={`${STATUS_COLORS[agent.status] || STATUS_COLORS.inactive}`}>
              {agent.status || 'inactive'}
            </Badge>
            <Badge className="bg-secondary text-secondary-foreground capitalize">{agent.group}</Badge>
            <Badge className={`bg-secondary ${RISK_COLORS[agent.financial_risk] || 'text-muted-foreground'}`}>
              💰 Financial: {agent.financial_risk || 'none'}
            </Badge>
            <Badge className={`bg-secondary ${RISK_COLORS[agent.legal_risk] || 'text-muted-foreground'}`}>
              ⚖️ Legal: {agent.legal_risk || 'none'}
            </Badge>
            <Badge className={`bg-secondary ${RISK_COLORS[agent.reputation_risk] || 'text-muted-foreground'}`}>
              📢 Reputation: {agent.reputation_risk || 'none'}
            </Badge>
          </div>

          {/* Purpose */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Purpose</p>
            <p className="text-sm text-foreground/80 leading-relaxed">{agent.purpose}</p>
          </div>

          {/* Task Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-3 bg-secondary/10 border border-border/40 rounded-xl">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Current Task</p>
              <p className="text-xs text-foreground/90">{currentTask}</p>
            </div>
            <div className="p-3 bg-secondary/10 border border-border/40 rounded-xl">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Why Idle</p>
              <p className="text-xs text-foreground/75">{whyIdle}</p>
            </div>
          </div>

          {/* Missing Credentials */}
          {missingCreds.length > 0 && (
            <div className="p-3 bg-primary/10 border border-primary/20 rounded-xl">
              <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-1">Missing Credentials</p>
              <ul className="list-disc pl-4 space-y-0.5">
                {missingCreds.map(c => (
                  <li key={c} className="text-xs text-primary/80">{c}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Readiness Panel */}
          <div className={`rounded-xl p-4 border ${registryMarkedActive ? 'border-green-500/20 bg-green-500/5' : 'border-primary/20 bg-primary/5'}`}>
            <div className="flex items-center gap-2 mb-3">
              {registryMarkedActive
                ? <CheckCircle2 className="w-4 h-4 text-green-400" />
                : <Clock className="w-4 h-4 text-primary" />
              }
              <p className={`text-sm font-semibold ${registryMarkedActive ? 'text-primary' : 'text-primary'}`}>
                {registryMarkedActive ? 'Registry record marked active' : 'Registry record not verified'}
              </p>
            </div>
            <ul className="space-y-1.5 mb-3">
              {readinessItems.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-foreground/70">
                  <span className="mt-0.5 text-muted-foreground">→</span>
                  {item}
                </li>
              ))}
            </ul>
            <p className="text-xs text-muted-foreground">
              This registry is descriptive only. It cannot activate, connect, or execute an agent. Use the controlled internal task lane after its deployment verification creates a real receipt.
            </p>
          </div>

          {/* Last Action */}
          {agent.last_action && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Last Action</p>
              <p className="text-sm text-foreground/70">{agent.last_action}</p>
            </div>
          )}
          {agent.last_output && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Last Output</p>
              <p className="text-sm text-foreground/70 bg-secondary/40 rounded-lg p-3">{agent.last_output}</p>
            </div>
          )}

          {/* Connected Systems */}
          {agent.connected_systems?.length > 0 && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Connected Systems</p>
              <div className="flex flex-wrap gap-1">
                {agent.connected_systems.map(s => (
                  <Badge key={s} className="bg-primary/10 text-primary text-xs">{s}</Badge>
                ))}
              </div>
            </div>
          )}

          {/* Memory Records */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Memory Records ({memories.length})</p>
            {memories.length > 0 ? (
              <div className="space-y-2 max-h-40 overflow-y-auto border border-border/40 rounded-lg p-2.5 bg-black/20">
                {memories.map(m => (
                  <div key={m.id} className="text-xs border-b border-border/30 pb-1.5 last:border-0 last:pb-0">
                    <span className="font-semibold text-primary capitalize">{m.memory_type?.replace('_', ' ')}</span>: {m.summary}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-muted-foreground italic">No permanent memory banks compiled yet.</p>
            )}
          </div>

          {/* Learning Records */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Learning Records ({learnings.length})</p>
            {learnings.length > 0 ? (
              <div className="space-y-2 max-h-40 overflow-y-auto border border-border/40 rounded-lg p-2.5 bg-black/20">
                {learnings.map(l => (
                  <div key={l.id} className="text-xs border-b border-border/30 pb-1.5 last:border-0 last:pb-0">
                    <span className="font-semibold text-purple-400 capitalize">{l.lesson_type?.replace('_', ' ')}</span>: {l.what_worked || l.improvement}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-muted-foreground italic">No historical learning logs generated.</p>
            )}
          </div>

          {/* Quick Links */}
          <div className="flex flex-wrap gap-2 pt-2 border-t border-border">
            <Link to="/admin/orchestrator-chat" onClick={onClose}>
              <Button size="sm" variant="outline" className="gap-1 border-primary/30 text-primary">
                <MessageSquare className="w-3 h-3" /> Chat with Orchestrator about this agent
              </Button>
            </Link>
            <Link to="/admin/agent-task-log" onClick={onClose}>
              <Button size="sm" variant="outline" className="gap-1">
                <Activity className="w-3 h-3" /> View Task Log
              </Button>
            </Link>
          </div>

          {/* Notes */}
          {agent.notes && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Notes</p>
              <p className="text-sm text-foreground/70">{agent.notes}</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

export default function AgentRegistry() {
  const [search, setSearch] = useState('');
  const [group, setGroup] = useState('all');
  const [activeLetter, setActiveLetter] = useState('');
  const [showLegend, setShowLegend] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState(null);
  const { data: dbAgents = [], isLoading } = useQuery({
    queryKey: ['agent-registry'],
    queryFn: () => base44.entities.AgentRegistry.list('-created_date', 200),
  });

  const usingFallback = !isLoading && dbAgents.length === 0;
  const agents = usingFallback ? AGENT_REGISTRY_SEED : dbAgents;

  const filtered = agents
    .filter(a => {
      const matchesGroup = group === 'all' || a.group === group;
      const matchesSearch = !search || a.agent_name?.toLowerCase().includes(search.toLowerCase()) || a.purpose?.toLowerCase().includes(search.toLowerCase());
      const matchesLetter = !activeLetter || a.agent_name?.toUpperCase().startsWith(activeLetter);
      return matchesGroup && matchesSearch && matchesLetter;
    })
    .sort((a, b) => (a.agent_name || '').localeCompare(b.agent_name || ''));

  const groupCounts = GROUPS.slice(1).reduce((acc, g) => {
    acc[g] = agents.filter(a => a.group === g).length;
    return acc;
  }, {});

  const activeCount = agents.filter(a => a.status === 'active').length;
  const inactiveCount = agents.filter(a => a.status !== 'active').length;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h1 className="text-2xl font-display font-bold gradient-gold-text">Agent Registry</h1>
          <p className="text-muted-foreground text-sm">
            {agents.length} registry records · <span className="text-primary">{activeCount} labelled active</span> · <span className="text-muted-foreground">{inactiveCount} not labelled active</span>
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {usingFallback && (
            <Badge className="bg-primary/10 text-primary border-primary/30 flex items-center gap-1">
              <AlertTriangle className="w-3 h-3" /> Base Registry — descriptive records only
            </Badge>
          )}
          <Button size="sm" variant="outline" onClick={() => setShowLegend(!showLegend)}>
            {showLegend ? 'Hide Legend' : 'Risk Level Guide'}
          </Button>
        </div>
      </div>

      {/* How This Works banner */}
      <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 text-sm text-foreground/70 leading-relaxed">
        <p className="font-semibold text-foreground mb-1">👆 Click any agent card to see full details</p>
        <p>You'll see the intended role, registry label, historical records, and risk controls. A registry label is not proof of an active connection or executor.</p>
      </div>

      {showLegend && (
        <div className="border border-border rounded-lg p-4 bg-secondary/30 space-y-3">
          <p className="text-sm font-semibold text-foreground">Risk Level Reference</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {RISK_LEGEND.map(r => (
              <div key={r.level} className="rounded-lg p-3 border border-border flex gap-3 items-start">
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full shrink-0 ${r.color}`}>{r.label}</span>
                <p className="text-xs text-muted-foreground leading-relaxed">{r.desc}</p>
              </div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground border-t border-border pt-3">
            <strong className="text-foreground">Approval Level</strong>: &nbsp;
            <span className="text-primary">auto</span> = runs without review &nbsp;·&nbsp;
            <span className="text-primary">low_risk_auto</span> = runs but logs for review &nbsp;·&nbsp;
            <span className="text-orange-400">always_approve</span> = pauses until you explicitly approve
          </p>
        </div>
      )}

      {/* Group Filter */}
      <div className="flex flex-wrap gap-2">
        {GROUPS.map(g => (
          <button
            key={g}
            onClick={() => setGroup(g)}
            className={`px-3 py-1 rounded-full text-xs font-medium border transition-all ${group === g ? 'bg-primary text-primary-foreground border-primary' : 'border-border text-muted-foreground hover:border-primary/40'}`}
          >
            {g === 'all' ? `All (${agents.length})` : `${g} (${groupCounts[g] || 0})`}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
        <Input placeholder="Search agents by name or purpose..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
      </div>

      {/* A–Z Filter Strip */}
      <div className="flex flex-wrap gap-1">
        <button
          onClick={() => setActiveLetter('')}
          className={`px-2 py-0.5 rounded text-xs font-mono font-bold border transition-all ${!activeLetter ? 'bg-primary text-primary-foreground border-primary' : 'border-border text-muted-foreground hover:border-primary/40'}`}
        >All</button>
        {ALPHABET.map(l => {
          const hasAgents = agents.some(a => a.agent_name?.toUpperCase().startsWith(l));
          return (
            <button
              key={l}
              onClick={() => setActiveLetter(activeLetter === l ? '' : l)}
              disabled={!hasAgents}
              className={`px-2 py-0.5 rounded text-xs font-mono font-bold border transition-all ${activeLetter === l ? 'bg-primary text-primary-foreground border-primary' : hasAgents ? 'border-border text-muted-foreground hover:border-primary/40' : 'border-border/20 text-muted-foreground/30 cursor-not-allowed'}`}
            >{l}</button>
          );
        })}
      </div>

      {/* Agent Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {filtered.map((agent, idx) => (
          <Card
            key={agent.id || `seed-${idx}`}
            onClick={() => setSelectedAgent(agent)}
            className={`cursor-pointer hover:border-primary/50 hover:shadow-lg transition-all group ${agent.status === 'active' ? 'border-green-500/20' : ''}`}
          >
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Brain className="w-4 h-4 text-primary shrink-0" />
                  <p className="font-semibold text-sm">{agent.agent_name}</p>
                </div>
                <div className="flex items-center gap-1">
                  <Badge className={`text-xs ${STATUS_COLORS[agent.status] || STATUS_COLORS.inactive}`}>
                    {usingFallback ? 'seed' : (agent.status || 'inactive')}
                  </Badge>
                  <ChevronRight className="w-3 h-3 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
              </div>
              <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{agent.purpose}</p>
              <div className="flex items-center justify-between">
                <div className="flex gap-1 flex-wrap">
                  <span className="text-xs px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground capitalize">{agent.group}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full bg-secondary ${RISK_COLORS[agent.financial_risk] || 'text-muted-foreground'}`}>
                    💰 {agent.financial_risk || 'none'}
                  </span>
                </div>
                {agent.status !== 'active' && (
                  <span className="text-xs text-primary">Tap for registry details →</span>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {isLoading && <p className="text-muted-foreground text-center py-8">Loading agents...</p>}
      {!isLoading && filtered.length === 0 && <p className="text-muted-foreground text-center py-8">No agents found.</p>}

      {/* Detail Modal */}
      {selectedAgent && (
        <AgentDetailModal
          agent={selectedAgent}
          onClose={() => setSelectedAgent(null)}
        />
      )}
    </div>
  );
}