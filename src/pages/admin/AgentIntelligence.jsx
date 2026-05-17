import { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Brain, TrendingUp, Activity, Zap, Star, BookOpen, Shield, Loader2, RefreshCw, ArrowRight, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

const AGENT_IQ_MAP = [
  { name: 'AutonomousResearchAgent', iq: 94, domain: 'Research & Intelligence', color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
  { name: 'TrendEngine', iq: 91, domain: 'Trend Forecasting', color: 'text-purple-400', bg: 'bg-purple-500/10' },
  { name: 'ExecutiveBriefAgent', iq: 89, domain: 'Executive Intelligence', color: 'text-amber-400', bg: 'bg-amber-500/10' },
  { name: 'Orchestrator', iq: 97, domain: 'System Orchestration', color: 'text-primary', bg: 'bg-primary/10' },
  { name: 'SecurityAgent', iq: 86, domain: 'Security & Compliance', color: 'text-red-400', bg: 'bg-red-500/10' },
  { name: 'CreativeStudioAgent', iq: 88, domain: 'Creative & Content', color: 'text-pink-400', bg: 'bg-pink-500/10' },
];

export default function AgentIntelligence() {
  const [triggering, setTriggering] = useState(false);

  const { data: logs = [], refetch: refetchLogs } = useQuery({
    queryKey: ['agent-intel-logs'],
    queryFn: () => base44.entities.AgentTaskLog.list('-created_date', 30),
  });

  const { data: learnings = [] } = useQuery({
    queryKey: ['agent-learnings'],
    queryFn: () => base44.entities.AgentLearningRecord.list('-created_date', 20),
  });

  const { data: vaultCount = [] } = useQuery({
    queryKey: ['vault-count'],
    queryFn: () => base44.entities.KnowledgeVault.list('-created_date', 200),
  });

  const { data: ideas = [] } = useQuery({
    queryKey: ['intel-ideas'],
    queryFn: () => base44.entities.IdeaOpportunity.list('-created_date', 50),
  });

  const triggerResearch = async () => {
    setTriggering(true);
    try {
      await base44.functions.invoke('autonomousResearch', {});
      toast.success('Research loop triggered — check Knowledge Vault in ~30s');
      refetchLogs();
    } catch {
      toast.error('Trigger failed');
    }
    setTriggering(false);
  };

  const triggerTrends = async () => {
    setTriggering(true);
    try {
      await base44.functions.invoke('autonomousTrendEngine', {});
      toast.success('Trend engine triggered');
      refetchLogs();
    } catch {
      toast.error('Trigger failed');
    }
    setTriggering(false);
  };

  const autoLogs = logs.filter(l => l.was_automatic);
  const todayLogs = logs.filter(l => {
    const d = new Date(l.created_date);
    const now = new Date();
    return d.toDateString() === now.toDateString();
  });

  const totalKnowledge = vaultCount.length;
  const totalIdeas = ideas.length;
  const approvedIdeas = ideas.filter(i => i.status === 'approved' || i.status === 'implemented').length;

  return (
    <div className="space-y-6 pb-10">
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold gradient-gold-text">Agent Intelligence</h1>
          <p className="text-muted-foreground text-sm mt-1">Autonomous learning progress, IQ scores, and knowledge growth</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Button variant="outline" onClick={triggerResearch} disabled={triggering} className="gap-2 text-xs">
            {triggering ? <Loader2 className="w-3 h-3 animate-spin" /> : <Brain className="w-3 h-3" />}
            Trigger Research
          </Button>
          <Button variant="outline" onClick={triggerTrends} disabled={triggering} className="gap-2 text-xs">
            <TrendingUp className="w-3 h-3" />
            Trigger Trends
          </Button>
        </div>
      </div>

      {/* System Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Knowledge Entries', value: totalKnowledge, icon: BookOpen, color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
          { label: 'Agent Actions Today', value: todayLogs.length, icon: Zap, color: 'text-amber-400', bg: 'bg-amber-500/10' },
          { label: 'Total Ideas Generated', value: totalIdeas, icon: Star, color: 'text-green-400', bg: 'bg-green-500/10' },
          { label: 'Learning Records', value: learnings.length, icon: Brain, color: 'text-purple-400', bg: 'bg-purple-500/10' },
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

      {/* Agent IQ Scoreboard */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2"><Brain className="w-4 h-4 text-primary" />Agent IQ Scores</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {AGENT_IQ_MAP.map(agent => (
            <div key={agent.name} className="flex items-center gap-3">
              <div className={`${agent.bg} px-2 py-1 rounded text-xs font-mono ${agent.color} w-20 text-center shrink-0`}>
                IQ {agent.iq}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium">{agent.name}</span>
                  <span className="text-xs text-muted-foreground">{agent.domain}</span>
                </div>
                <div className="w-full bg-secondary rounded-full h-1.5">
                  <div className="h-1.5 rounded-full bg-primary/60 transition-all" style={{ width: `${agent.iq}%` }} />
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Learning Records */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-cyan-400" />Learning Records
              <Badge variant="outline" className="ml-auto text-xs">{learnings.length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 max-h-80 overflow-y-auto">
            {learnings.length === 0 ? (
              <p className="text-sm text-muted-foreground">No learning records yet. Agents learn from approved/rejected outputs.</p>
            ) : learnings.map(l => (
              <div key={l.id} className="border border-border rounded-lg p-3">
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant="outline" className="text-xs">{l.lesson_type?.replace(/_/g, ' ')}</Badge>
                  <span className="text-xs text-muted-foreground">{l.agent_name}</span>
                  {l.confidence_score && <Badge className="text-xs bg-green-500/10 text-green-400 ml-auto">conf: {l.confidence_score}/10</Badge>}
                </div>
                {l.what_worked && <p className="text-xs text-foreground mt-1">✓ {l.what_worked.substring(0, 100)}...</p>}
                {l.improvement && <p className="text-xs text-primary mt-1">→ {l.improvement.substring(0, 100)}...</p>}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Autonomous Activity Log */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Activity className="w-4 h-4 text-amber-400" />Autonomous Activity
              <Badge variant="outline" className="ml-auto text-xs">{autoLogs.length} auto</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 max-h-80 overflow-y-auto">
            {logs.length === 0 ? (
              <p className="text-sm text-muted-foreground">No agent activity yet.</p>
            ) : logs.slice(0, 15).map(log => (
              <div key={log.id} className="border border-border rounded-lg p-3">
                <div className="flex items-center gap-2 mb-1">
                  {log.was_automatic && <Badge className="text-xs bg-blue-500/10 text-blue-400">auto</Badge>}
                  {log.risk_check_result && <Badge className={`text-xs ${log.risk_check_result === 'pass' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>{log.risk_check_result}</Badge>}
                  <span className="text-xs text-muted-foreground ml-auto">{new Date(log.created_date).toLocaleDateString('en-AU')}</span>
                </div>
                <p className="text-xs font-medium">{log.task_title}</p>
                {log.outcome && <p className="text-xs text-muted-foreground mt-0.5">{log.outcome.substring(0, 100)}</p>}
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Improvement Suggestions */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2"><TrendingUp className="w-4 h-4 text-green-400" />Capability Improvement Roadmap</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              { area: 'Research Depth', current: 'Rotating 15 topics every 4h', next: 'Add competitor scanning + product scouting loops', priority: 'high' },
              { area: 'Memory Persistence', current: 'KnowledgeVault + AgentLearningRecord', next: 'Cross-reference learning between agents', priority: 'medium' },
              { area: 'Opportunity Detection', current: 'Ideas Engine + Trend Monitor', next: 'Automated scoring + escalation to ApprovalQueue', priority: 'high' },
              { area: 'Self Improvement', current: 'Manual learning records', next: 'Auto-compare approved vs rejected outputs', priority: 'medium' },
            ].map(item => (
              <div key={item.area} className="border border-border rounded-lg p-3">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm font-medium">{item.area}</p>
                  <Badge className={`text-xs ${item.priority === 'high' ? 'bg-orange-500/10 text-orange-400' : 'bg-blue-500/10 text-blue-400'}`}>{item.priority}</Badge>
                </div>
                <p className="text-xs text-muted-foreground">Now: {item.current}</p>
                <p className="text-xs text-primary mt-1">→ {item.next}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-3 flex-wrap">
        <Link to="/admin/research-grid"><Button variant="outline" className="gap-2 text-xs"><TrendingUp className="w-3 h-3" />Research Grid</Button></Link>
        <Link to="/admin/autonomous-ops"><Button variant="outline" className="gap-2 text-xs"><Zap className="w-3 h-3" />Autonomous Ops</Button></Link>
        <Link to="/admin/knowledge-vault"><Button variant="outline" className="gap-2 text-xs"><BookOpen className="w-3 h-3" />Knowledge Vault</Button></Link>
        <Link to="/admin/agent-learning"><Button variant="outline" className="gap-2 text-xs"><Brain className="w-3 h-3" />Agent Learning</Button></Link>
      </div>
    </div>
  );
}