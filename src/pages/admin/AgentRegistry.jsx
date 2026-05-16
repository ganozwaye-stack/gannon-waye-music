import { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Brain, Search, Play, Pause, AlertTriangle } from 'lucide-react';
import { AGENT_REGISTRY_SEED } from '@/lib/agentRegistrySeed';

const GROUPS = ['all','personal','communication','legal','research','creative','website','marketing','social','business','finance','systems','security','orchestrator'];

const STATUS_COLORS = {
  active: 'bg-green-500/10 text-green-400',
  inactive: 'bg-slate-500/10 text-slate-400',
  testing: 'bg-blue-500/10 text-blue-400',
  error: 'bg-red-500/10 text-red-400',
  disabled: 'bg-zinc-500/10 text-zinc-500',
};

const RISK_COLORS = { none: 'text-green-400', low: 'text-yellow-400', medium: 'text-orange-400', high: 'text-red-400' };

// Risk level legend — what each value means in this system
const RISK_LEGEND = [
  { level: 'none', color: 'text-green-400 bg-green-500/10', label: 'None', desc: 'Agent cannot spend money, create legal exposure, or damage reputation in any scenario. Fully safe to automate.' },
  { level: 'low', color: 'text-yellow-400 bg-yellow-500/10', label: 'Low', desc: 'Minor financial or legal footprint possible (e.g. sending an email, tagging a record). Allowed to auto-run with logging.' },
  { level: 'medium', color: 'text-orange-400 bg-orange-500/10', label: 'Medium', desc: 'Could create a real cost, contractual obligation, or public exposure. Requires low-risk auto-approval or Gannon review.' },
  { level: 'high', color: 'text-red-400 bg-red-500/10', label: 'High', desc: 'Direct financial, legal, or reputation risk. Always requires explicit approval before execution. Do-Not-Spend rule enforced.' },
];

export default function AgentRegistry() {
  const [search, setSearch] = useState('');
  const [group, setGroup] = useState('all');
  const [showLegend, setShowLegend] = useState(false);
  const qc = useQueryClient();

  const { data: dbAgents = [], isLoading } = useQuery({
    queryKey: ['agent-registry'],
    queryFn: () => base44.entities.AgentRegistry.list('-created_date', 200),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.AgentRegistry.update(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['agent-registry'] }),
  });

  // Fallback to static seed if DB returns empty
  const usingFallback = !isLoading && dbAgents.length === 0;
  const agents = usingFallback ? AGENT_REGISTRY_SEED : dbAgents;

  const filtered = agents.filter(a => {
    const matchesGroup = group === 'all' || a.group === group;
    const matchesSearch = !search || a.agent_name?.toLowerCase().includes(search.toLowerCase()) || a.purpose?.toLowerCase().includes(search.toLowerCase());
    return matchesGroup && matchesSearch;
  });

  const groupCounts = GROUPS.slice(1).reduce((acc, g) => {
    acc[g] = agents.filter(a => a.group === g).length;
    return acc;
  }, {});

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h1 className="text-2xl font-display font-bold gradient-gold-text">Agent Registry</h1>
          <p className="text-muted-foreground text-sm">{agents.length} agents registered · {agents.filter(a => a.status === 'active').length} active</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {usingFallback && (
            <Badge className="bg-yellow-500/10 text-yellow-400 border-yellow-500/30 flex items-center gap-1">
              <AlertTriangle className="w-3 h-3" /> Base Registry — Not yet activated in DB
            </Badge>
          )}
          <Button size="sm" variant="outline" onClick={() => setShowLegend(!showLegend)}>
            {showLegend ? 'Hide' : 'What do the risk levels mean?'}
          </Button>
        </div>
      </div>

      {/* Risk Legend */}
      {showLegend && (
        <div className="border border-border rounded-lg p-4 bg-secondary/30 space-y-3">
          <p className="text-sm font-semibold text-foreground">Risk Level Reference — Financial Risk</p>
          <p className="text-xs text-muted-foreground mb-3">The <strong className="text-foreground">financial_risk</strong>, <strong className="text-foreground">legal_risk</strong>, and <strong className="text-foreground">reputation_risk</strong> fields all use the same scale:</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {RISK_LEGEND.map(r => (
              <div key={r.level} className={`rounded-lg p-3 border border-border flex gap-3 items-start`}>
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full shrink-0 ${r.color}`}>{r.label}</span>
                <p className="text-xs text-muted-foreground leading-relaxed">{r.desc}</p>
              </div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground border-t border-border pt-3 mt-1">
            <strong className="text-foreground">Approval Level</strong>: &nbsp;
            <span className="text-primary">auto</span> = runs without review &nbsp;·&nbsp;
            <span className="text-yellow-400">low_risk_auto</span> = runs but logs for review &nbsp;·&nbsp;
            <span className="text-orange-400">always_approve</span> = pauses until Gannon explicitly approves
          </p>
        </div>
      )}

      {/* Group Summary */}
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
        <Input
          placeholder="Search agents..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Agent List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {filtered.map((agent, idx) => (
          <Card key={agent.id || `seed-${idx}`} className="hover:border-primary/30 transition-all">
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Brain className="w-4 h-4 text-primary shrink-0" />
                  <p className="font-semibold text-sm">{agent.agent_name}</p>
                </div>
                <Badge className={`text-xs ${STATUS_COLORS[agent.status] || STATUS_COLORS.inactive}`}>
                  {usingFallback ? 'seed' : agent.status}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{agent.purpose}</p>
              <div className="flex items-center justify-between">
                <div className="flex gap-1">
                  <span className="text-xs px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground capitalize">{agent.group}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full bg-secondary ${RISK_COLORS[agent.financial_risk] || 'text-muted-foreground'}`}>
                    $ {agent.financial_risk || 'none'}
                  </span>
                </div>
                {/* Actions disabled in fallback mode */}
                {!usingFallback && agent.id && (
                  <div className="flex gap-1">
                    {agent.status !== 'active' ? (
                      <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => updateMutation.mutate({ id: agent.id, data: { status: 'active' } })}>
                        <Play className="w-3 h-3 text-green-400" />
                      </Button>
                    ) : (
                      <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => updateMutation.mutate({ id: agent.id, data: { status: 'inactive' } })}>
                        <Pause className="w-3 h-3 text-yellow-400" />
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {isLoading && <p className="text-muted-foreground text-center py-8">Loading agents...</p>}
      {!isLoading && filtered.length === 0 && <p className="text-muted-foreground text-center py-8">No agents found.</p>}
    </div>
  );
}