import { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Brain, TrendingUp, Activity, Zap, Star, BookOpen, Loader2, ArrowRight, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';
import ReactMarkdown from 'react-markdown';

const AGENT_IQ_MAP = [
  { name: 'AutonomousResearchAgent', iq: 94, domain: 'Research & Intelligence', color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
  { name: 'TrendEngine', iq: 91, domain: 'Trend Forecasting', color: 'text-purple-400', bg: 'bg-purple-500/10' },
  { name: 'ExecutiveBriefAgent', iq: 89, domain: 'Executive Intelligence', color: 'text-amber-400', bg: 'bg-amber-500/10' },
  { name: 'Orchestrator', iq: 97, domain: 'System Orchestration', color: 'text-primary', bg: 'bg-primary/10' },
  { name: 'SecurityAgent', iq: 86, domain: 'Security & Compliance', color: 'text-red-400', bg: 'bg-red-500/10' },
  { name: 'CreativeStudioAgent', iq: 88, domain: 'Creative & Content', color: 'text-pink-400', bg: 'bg-pink-500/10' },
];

const ROADMAP_ITEMS = [
  { area: 'Research Depth', current: 'Rotating 15 topics every 4h', next: 'Add competitor scanning + product scouting loops', priority: 'high', related_agents: ['AutonomousResearchAgent', 'TrendEngine'], link: '/admin/research-grid' },
  { area: 'Memory Persistence', current: 'KnowledgeVault + AgentLearningRecord', next: 'Cross-reference learning between agents', priority: 'medium', related_agents: ['Orchestrator'], link: '/admin/memory-graph' },
  { area: 'Opportunity Detection', current: 'Ideas Engine + Trend Monitor', next: 'Automated scoring + escalation to ApprovalQueue', priority: 'high', related_agents: ['TrendEngine', 'Orchestrator'], link: '/admin/ideas-engine' },
  { area: 'Self Improvement', current: 'Manual learning records', next: 'Auto-compare approved vs rejected outputs', priority: 'medium', related_agents: ['Orchestrator'], link: '/admin/agent-learning' },
];

function LearningDetailModal({ record, onClose }) {
  if (!record) return null;
  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display text-xl flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-cyan-400" />Learning Record
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mt-2">
          <div className="flex flex-wrap gap-2">
            <Badge className="text-xs">{record.lesson_type?.replace(/_/g, ' ')}</Badge>
            <Badge variant="outline" className="text-xs">{record.agent_name}</Badge>
            {record.confidence_score && <Badge className="text-xs bg-green-500/10 text-green-400">Confidence: {record.confidence_score}/10</Badge>}
            {record.impact_score && <Badge className="text-xs bg-blue-500/10 text-blue-400">Impact: {record.impact_score}/10</Badge>}
          </div>
          {record.what_worked && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-green-400 mb-1">✓ What Worked</p>
              <p className="text-sm text-foreground/80 leading-relaxed bg-green-500/5 border border-green-500/20 rounded-lg p-3">{record.what_worked}</p>
            </div>
          )}
          {record.what_failed && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-red-400 mb-1">✗ What Failed</p>
              <p className="text-sm text-foreground/80 leading-relaxed bg-red-500/5 border border-red-500/20 rounded-lg p-3">{record.what_failed}</p>
            </div>
          )}
          {record.improvement && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-primary mb-1">→ Improvement / Next Action</p>
              <p className="text-sm text-foreground/80 leading-relaxed bg-primary/5 border border-primary/20 rounded-lg p-3">{record.improvement}</p>
            </div>
          )}
          {record.source && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Source</p>
              <p className="text-sm text-foreground/70">{record.source}</p>
            </div>
          )}
          <div className="text-xs text-muted-foreground border-t border-border pt-3">
            Recorded: {new Date(record.created_date).toLocaleString('en-AU')}
          </div>
          <div className="flex gap-2">
            <Link to="/admin/agent-learning" onClick={onClose}><Button size="sm" variant="outline" className="gap-1 text-xs"><BookOpen className="w-3 h-3" />All Learning Records</Button></Link>
            <Link to="/admin/knowledge-vault" onClick={onClose}><Button size="sm" variant="outline" className="gap-1 text-xs"><Brain className="w-3 h-3" />Knowledge Vault</Button></Link>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function ActivityDetailModal({ log, onClose }) {
  if (!log) return null;
  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display text-xl flex items-center gap-2">
            <Activity className="w-5 h-5 text-amber-400" />Agent Activity Log
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mt-2">
          <div className="flex flex-wrap gap-2">
            {log.was_automatic && <Badge className="text-xs bg-blue-500/10 text-blue-400">Autonomous</Badge>}
            {log.risk_check_result && (
              <Badge className={`text-xs ${log.risk_check_result === 'pass' ? 'bg-green-500/10 text-green-400' : log.risk_check_result === 'blocked' ? 'bg-red-500/10 text-red-400' : 'bg-yellow-500/10 text-yellow-400'}`}>
                Risk: {log.risk_check_result}
              </Badge>
            )}
            {log.agent_name && <Badge variant="outline" className="text-xs">{log.agent_name}</Badge>}
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Task</p>
            <p className="text-base font-medium">{log.task_title}</p>
          </div>
          {log.task_description && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Description</p>
              <p className="text-sm text-foreground/80 leading-relaxed">{log.task_description}</p>
            </div>
          )}
          {log.outcome && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Outcome</p>
              <p className="text-sm text-foreground/80 bg-secondary/40 rounded-lg p-3 leading-relaxed">{log.outcome}</p>
            </div>
          )}
          {log.output_summary && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Output Summary</p>
              <div className="prose prose-sm prose-invert max-w-none text-sm bg-secondary/20 rounded-lg p-3">
                <ReactMarkdown>{log.output_summary}</ReactMarkdown>
              </div>
            </div>
          )}
          {log.error_message && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-red-400 mb-1">Error</p>
              <p className="text-sm text-red-300 bg-red-500/5 border border-red-500/20 rounded-lg p-3">{log.error_message}</p>
            </div>
          )}
          <div className="text-xs text-muted-foreground border-t border-border pt-3">
            Executed: {new Date(log.created_date).toLocaleString('en-AU')}
          </div>
          <div className="flex gap-2 pt-1 flex-wrap">
            <Link to="/admin/agent-task-log" onClick={onClose}><Button size="sm" variant="outline" className="gap-1 text-xs"><Activity className="w-3 h-3" />Full Task Log</Button></Link>
            <Link to="/admin/agent-learning" onClick={onClose}><Button size="sm" variant="outline" className="gap-1 text-xs"><BookOpen className="w-3 h-3" />Learning Records</Button></Link>
            <Link to="/admin/knowledge-vault" onClick={onClose}><Button size="sm" variant="outline" className="gap-1 text-xs"><Brain className="w-3 h-3" />Knowledge Vault</Button></Link>
          </div>
          <p className="text-xs text-muted-foreground italic border-t border-border pt-2">Source chain: Agent Task Log → Agent Learning Records → Knowledge Vault → Ideas Engine</p>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function RoadmapDetailModal({ item, onClose }) {
  if (!item) return null;
  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-display text-lg flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-green-400" />{item.area}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-3 mt-2">
          <div className="flex items-center gap-2">
            <Badge className={`text-xs ${item.priority === 'high' ? 'bg-orange-500/10 text-orange-400' : 'bg-blue-500/10 text-blue-400'}`}>{item.priority} priority</Badge>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Current State</p>
            <p className="text-sm text-foreground/80 bg-secondary/30 rounded-lg p-2">{item.current}</p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-primary mb-1">→ Target Upgrade</p>
            <p className="text-sm text-foreground/80 bg-primary/5 border border-primary/20 rounded-lg p-2">{item.next}</p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Related Agents</p>
            <div className="flex flex-wrap gap-1">{item.related_agents.map(a => <Badge key={a} variant="outline" className="text-xs">{a}</Badge>)}</div>
          </div>
          <div className="pt-2 border-t border-border flex gap-2 flex-wrap">
            <Link to={item.link} onClick={onClose}><Button size="sm" variant="outline" className="gap-1 text-xs"><ArrowRight className="w-3 h-3" />View Related Page</Button></Link>
            <Link to="/admin/agent-registry" onClick={onClose}><Button size="sm" variant="outline" className="gap-1 text-xs"><Brain className="w-3 h-3" />Agent Registry</Button></Link>
          </div>
          <p className="text-xs text-muted-foreground italic border-t border-border pt-2">This is the deepest available source record for this roadmap item — a system-defined capability improvement target.</p>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function AgentIntelligence() {
  const [triggering, setTriggering] = useState(false);
  const [selectedLearning, setSelectedLearning] = useState(null);
  const [selectedLog, setSelectedLog] = useState(null);
  const [selectedRoadmap, setSelectedRoadmap] = useState(null);

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
  const todayLogs = logs.filter(l => new Date(l.created_date).toDateString() === new Date().toDateString());
  const totalKnowledge = vaultCount.length;
  const totalIdeas = ideas.length;

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
            <TrendingUp className="w-3 h-3" />Trigger Trends
          </Button>
        </div>
      </div>

      {/* Clickable Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Knowledge Entries', value: totalKnowledge, icon: BookOpen, color: 'text-cyan-400', bg: 'bg-cyan-500/10', link: '/admin/knowledge-vault' },
          { label: 'Agent Actions Today', value: todayLogs.length, icon: Zap, color: 'text-amber-400', bg: 'bg-amber-500/10', link: '/admin/agent-task-log' },
          { label: 'Total Ideas Generated', value: totalIdeas, icon: Star, color: 'text-green-400', bg: 'bg-green-500/10', link: '/admin/ideas-engine' },
          { label: 'Learning Records', value: learnings.length, icon: Brain, color: 'text-purple-400', bg: 'bg-purple-500/10', link: '/admin/agent-learning' },
        ].map(s => (
          <Link key={s.label} to={s.link}>
            <Card className="hover:border-primary/40 transition-all cursor-pointer group">
              <CardContent className="p-4 flex items-center gap-3">
                <div className={`${s.bg} p-2 rounded-lg shrink-0`}><s.icon className={`w-5 h-5 ${s.color}`} /></div>
                <div className="min-w-0">
                  <p className="text-2xl font-bold group-hover:text-primary transition-colors">{s.value}</p>
                  <p className="text-xs text-muted-foreground truncate">{s.label}</p>
                </div>
                <ChevronRight className="w-3 h-3 text-muted-foreground group-hover:text-primary ml-auto shrink-0 transition-colors" />
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Agent IQ Scoreboard */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Brain className="w-4 h-4 text-primary" />Agent IQ Scores
            <Link to="/admin/agent-registry" className="ml-auto">
              <Button size="sm" variant="ghost" className="text-xs gap-1 h-6"><ChevronRight className="w-3 h-3" />All Agents</Button>
            </Link>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {AGENT_IQ_MAP.map(agent => (
            <Link key={agent.name} to="/admin/agent-registry" className="flex items-center gap-3 group hover:opacity-80 transition-opacity">
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
            </Link>
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
              <button key={l.id} onClick={() => setSelectedLearning(l)} className="w-full text-left border border-border rounded-lg p-3 hover:border-primary/40 hover:bg-secondary/30 transition-all group">
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant="outline" className="text-xs">{l.lesson_type?.replace(/_/g, ' ')}</Badge>
                  <span className="text-xs text-muted-foreground">{l.agent_name}</span>
                  {l.confidence_score && <Badge className="text-xs bg-green-500/10 text-green-400 ml-auto">conf: {l.confidence_score}/10</Badge>}
                  <ChevronRight className="w-3 h-3 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
                {l.what_worked && <p className="text-xs text-foreground mt-1">✓ {l.what_worked.substring(0, 100)}{l.what_worked.length > 100 ? '...' : ''}</p>}
                {l.improvement && <p className="text-xs text-primary mt-1">→ {l.improvement.substring(0, 100)}{l.improvement.length > 100 ? '...' : ''}</p>}
              </button>
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
              <button key={log.id} onClick={() => setSelectedLog(log)} className="w-full text-left border border-border rounded-lg p-3 hover:border-primary/40 hover:bg-secondary/30 transition-all group">
                <div className="flex items-center gap-2 mb-1">
                  {log.was_automatic && <Badge className="text-xs bg-blue-500/10 text-blue-400">auto</Badge>}
                  {log.risk_check_result && <Badge className={`text-xs ${log.risk_check_result === 'pass' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>{log.risk_check_result}</Badge>}
                  <span className="text-xs text-muted-foreground ml-auto">{new Date(log.created_date).toLocaleDateString('en-AU')}</span>
                  <ChevronRight className="w-3 h-3 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
                <p className="text-xs font-medium">{log.task_title}</p>
                {log.outcome && <p className="text-xs text-muted-foreground mt-0.5">{log.outcome.substring(0, 100)}</p>}
              </button>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Capability Improvement Roadmap */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-green-400" />Capability Improvement Roadmap
            <span className="ml-auto text-xs text-muted-foreground">Click any item for detail</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {ROADMAP_ITEMS.map(item => (
              <button key={item.area} onClick={() => setSelectedRoadmap(item)} className="border border-border rounded-lg p-3 text-left hover:border-primary/40 hover:bg-secondary/20 transition-all group">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm font-medium">{item.area}</p>
                  <div className="flex items-center gap-1">
                    <Badge className={`text-xs ${item.priority === 'high' ? 'bg-orange-500/10 text-orange-400' : 'bg-blue-500/10 text-blue-400'}`}>{item.priority}</Badge>
                    <ChevronRight className="w-3 h-3 text-muted-foreground group-hover:text-primary" />
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">Now: {item.current}</p>
                <p className="text-xs text-primary mt-1">→ {item.next}</p>
              </button>
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

      {selectedLearning && <LearningDetailModal record={selectedLearning} onClose={() => setSelectedLearning(null)} />}
      {selectedLog && <ActivityDetailModal log={selectedLog} onClose={() => setSelectedLog(null)} />}
      {selectedRoadmap && <RoadmapDetailModal item={selectedRoadmap} onClose={() => setSelectedRoadmap(null)} />}
    </div>
  );
}