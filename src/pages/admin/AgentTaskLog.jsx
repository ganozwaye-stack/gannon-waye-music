import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Activity, CheckCircle2, AlertTriangle, Zap, X, ChevronRight, ArrowLeft, Link as LinkIcon, Database, Search } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const BADGE_STYLES = {
  auto: 'bg-green-500/10 text-green-400',
  approved: 'bg-yellow-500/10 text-yellow-400',
  pass: 'bg-green-500/10 text-green-400',
  blocked: 'bg-red-500/10 text-red-400',
  escalated: 'bg-orange-500/10 text-orange-400',
  failed: 'bg-red-500/10 text-red-400',
};

const SOURCE_ROUTES = {
  KnowledgeVault: '/admin/knowledge-vault',
  ResearchGrid: '/admin/research-grid',
  ApprovalQueue: '/admin/approval-queue',
  Notifications: '/admin/notifications',
  AgentRegistry: '/admin/agent-registry',
  AgentIntelligence: '/admin/agent-intelligence',
  AutonomousOps: '/admin/autonomous-ops',
};

function TaskDetailModal({ log, onClose }) {
  const navigate = useNavigate();

  const handleNav = (path) => {
    onClose();
    navigate(path);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-card border border-border rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="sticky top-0 bg-card border-b border-border p-4 flex items-center justify-between z-10">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="gap-1 h-7 text-xs" onClick={onClose}>
              <ArrowLeft className="w-3 h-3" /> Back
            </Button>
            <span className="text-xs text-muted-foreground">/</span>
            <span className="text-xs text-foreground">Task Detail</span>
          </div>
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onClose}><X className="w-4 h-4" /></Button>
        </div>

        <div className="p-5 space-y-5">
          {/* Header */}
          <div>
            <div className="flex items-center gap-2 flex-wrap mb-2">
              <Badge className={log.was_automatic ? BADGE_STYLES.auto : BADGE_STYLES.approved}>
                {log.was_automatic ? 'Auto' : 'Approved'}
              </Badge>
              {log.risk_check_result && (
                <Badge className={BADGE_STYLES[log.risk_check_result] || 'bg-secondary text-foreground'}>
                  {log.risk_check_result}
                </Badge>
              )}
            </div>
            <h2 className="text-lg font-semibold">{log.task_title || 'Untitled Task'}</h2>
            <p className="text-sm text-muted-foreground mt-1">{log.agent_name} · {new Date(log.created_date).toLocaleString()}</p>
          </div>

          {/* Grid details */}
          <div className="grid grid-cols-2 gap-3 text-sm">
            {[
              { label: 'Task Type', value: log.task_type || '—' },
              { label: 'Status', value: log.status || '—' },
              { label: 'Risk Check', value: log.risk_check_result || '—' },
              { label: 'Was Automatic', value: log.was_automatic ? 'Yes' : 'No' },
              { label: 'Source Used', value: log.source_used || '—' },
              { label: 'Created', value: new Date(log.created_date).toLocaleString() },
            ].map(({ label, value }) => (
              <div key={label} className="border border-border rounded-lg p-3">
                <p className="text-xs text-muted-foreground mb-1">{label}</p>
                <p className="font-medium text-sm">{value}</p>
              </div>
            ))}
          </div>

          {/* Input */}
          {log.input_summary && (
            <div className="border border-border rounded-lg p-3">
              <p className="text-xs text-muted-foreground mb-1 uppercase tracking-widest">Input</p>
              <p className="text-sm whitespace-pre-wrap">{log.input_summary}</p>
            </div>
          )}

          {/* Output */}
          {log.output_summary && (
            <div className="border border-border rounded-lg p-3">
              <p className="text-xs text-muted-foreground mb-1 uppercase tracking-widest">Output / Result</p>
              <p className="text-sm whitespace-pre-wrap">{log.output_summary}</p>
            </div>
          )}

          {/* Outcome */}
          {log.outcome && (
            <div className="border border-border rounded-lg p-3">
              <p className="text-xs text-muted-foreground mb-1 uppercase tracking-widest">Outcome</p>
              <p className="text-sm">{log.outcome}</p>
            </div>
          )}

          {/* Full report */}
          {log.full_report && (
            <div className="border border-border rounded-lg p-3">
              <p className="text-xs text-muted-foreground mb-1 uppercase tracking-widest">Full Report</p>
              <p className="text-sm whitespace-pre-wrap max-h-64 overflow-y-auto">{log.full_report}</p>
            </div>
          )}

          {/* Errors */}
          {log.errors && (
            <div className="border border-red-500/30 bg-red-500/5 rounded-lg p-3">
              <p className="text-xs text-red-400 mb-1 uppercase tracking-widest">Errors</p>
              <p className="text-sm text-red-300 whitespace-pre-wrap">{log.errors}</p>
            </div>
          )}

          {/* Source Chain */}
          <div className="border border-primary/20 bg-primary/5 rounded-lg p-3">
            <p className="text-xs text-primary mb-2 uppercase tracking-widest">Source Chain</p>
            <div className="space-y-1 text-sm">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                <span>Agent Task Log</span>
                <ChevronRight className="w-3 h-3 text-muted-foreground" />
                <span className="text-muted-foreground">{log.agent_name || 'Unknown Agent'}</span>
              </div>
              {log.source_used && (
                <div className="flex items-center gap-2 ml-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground shrink-0" />
                  <span className="text-muted-foreground">Source: {log.source_used}</span>
                </div>
              )}
              {log.records_created && (
                <div className="flex items-center gap-2 ml-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground shrink-0" />
                  <span className="text-muted-foreground">Records created: {log.records_created}</span>
                </div>
              )}
              {log.records_updated && (
                <div className="flex items-center gap-2 ml-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground shrink-0" />
                  <span className="text-muted-foreground">Records updated: {log.records_updated}</span>
                </div>
              )}
              {(!log.source_used && !log.records_created && !log.records_updated) && (
                <p className="text-xs text-muted-foreground ml-3 italic">This is the deepest available source record.</p>
              )}
            </div>
          </div>

          {/* Recommended next action */}
          <div className="border border-border rounded-lg p-3">
            <p className="text-xs text-muted-foreground mb-1">Recommended Next Action</p>
            <p className="text-sm">
              {log.risk_check_result === 'blocked'
                ? 'Review blocked action in Approval Queue and decide whether to approve or reject.'
                : log.risk_check_result === 'escalated'
                  ? 'Escalated item requires your review. Open Approval Queue.'
                  : 'No action required — task completed normally.'}
            </p>
          </div>

          {/* Related links */}
          <div>
            <p className="text-xs text-muted-foreground mb-2 uppercase tracking-widest">Related Records</p>
            <div className="flex flex-wrap gap-2">
              {Object.entries(SOURCE_ROUTES).map(([label, path]) => (
                <Button key={label} variant="outline" size="sm" className="text-xs gap-1" onClick={() => handleNav(path)}>
                  <LinkIcon className="w-3 h-3" /> {label}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const FILTER_TABS = [
  { key: 'all', label: 'All' },
  { key: 'auto', label: 'Auto' },
  { key: 'approved', label: 'Approved' },
  { key: 'pass', label: 'Pass' },
  { key: 'blocked', label: 'Blocked' },
  { key: 'escalated', label: 'Escalated' },
];

export default function AgentTaskLog() {
  const [filter, setFilter] = useState('all');
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState('');

  const { data: logs = [] } = useQuery({
    queryKey: ['agent-task-log-all'],
    queryFn: () => base44.entities.AgentTaskLog.list('-created_date', 100),
  });

  const getCount = (f) => {
    if (f === 'all') return logs.length;
    if (f === 'auto') return logs.filter(l => l.was_automatic).length;
    if (f === 'approved') return logs.filter(l => !l.was_automatic).length;
    return logs.filter(l => l.risk_check_result === f).length;
  };

  const filtered = logs
    .filter(l => {
      if (filter === 'auto') return l.was_automatic;
      if (filter === 'approved') return !l.was_automatic;
      if (filter !== 'all') return l.risk_check_result === filter;
      return true;
    })
    .filter(l => {
      if (!search) return true;
      const q = search.toLowerCase();
      return (
        (l.task_title || '').toLowerCase().includes(q) ||
        (l.agent_name || '').toLowerCase().includes(q) ||
        (l.outcome || '').toLowerCase().includes(q) ||
        (l.source_used || '').toLowerCase().includes(q)
      );
    });

  return (
    <div className="space-y-5 pb-10">
      <div>
        <h1 className="text-2xl font-display font-bold gradient-gold-text">Agent Task Log</h1>
        <p className="text-muted-foreground text-sm">Full audit trail of all agent actions — click any row for full detail</p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search tasks, agents, outcomes..."
          className="w-full pl-9 pr-4 py-2 bg-secondary border border-border rounded-lg text-sm focus:outline-none focus:border-primary/50"
        />
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 flex-wrap">
        {FILTER_TABS.map(f => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`px-3 py-1 rounded-full text-xs font-medium border transition-all ${filter === f.key ? 'bg-primary text-primary-foreground border-primary' : 'border-border text-muted-foreground hover:border-primary/40 hover:text-foreground'}`}
          >
            {f.label} <span className="opacity-60">({getCount(f.key)})</span>
          </button>
        ))}
      </div>

      {/* Rows */}
      <div className="space-y-2">
        {filtered.map(log => (
          <div
            key={log.id}
            className="border border-border rounded-lg p-3 flex items-start gap-3 cursor-pointer hover:border-primary/40 hover:bg-secondary/30 transition-all group"
            onClick={() => setSelected(log)}
          >
            <Activity className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <p className="font-medium text-sm truncate">{log.task_title || 'Untitled Task'}</p>
                <Badge
                  className={`${log.was_automatic ? BADGE_STYLES.auto : BADGE_STYLES.approved} text-xs cursor-pointer`}
                  onClick={e => { e.stopPropagation(); setFilter(log.was_automatic ? 'auto' : 'approved'); }}
                >
                  {log.was_automatic ? 'Auto' : 'Approved'}
                </Badge>
                {log.risk_check_result && (
                  <Badge
                    className={`text-xs cursor-pointer ${BADGE_STYLES[log.risk_check_result] || 'bg-secondary'}`}
                    onClick={e => { e.stopPropagation(); setFilter(log.risk_check_result); }}
                  >
                    {log.risk_check_result}
                  </Badge>
                )}
              </div>
              <p className="text-xs text-muted-foreground truncate">
                <span
                  className="hover:text-primary cursor-pointer"
                  onClick={e => { e.stopPropagation(); setSelected(log); }}
                >
                  {log.agent_name}
                </span>
                {log.outcome && ` · ${log.outcome}`}
              </p>
              {log.source_used && (
                <p className="text-xs text-muted-foreground mt-0.5">
                  Source: <span className="text-primary hover:underline cursor-pointer" onClick={e => { e.stopPropagation(); setSelected(log); }}>{log.source_used}</span>
                </p>
              )}
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <p
                className="text-xs text-muted-foreground cursor-pointer hover:text-primary"
                onClick={e => { e.stopPropagation(); setFilter('all'); }}
              >
                {new Date(log.created_date).toLocaleDateString()}
              </p>
              <ChevronRight className="w-3.5 h-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="text-center py-16 text-muted-foreground">
            <Activity className="w-8 h-8 mx-auto mb-3 opacity-30" />
            <p>No logs match this filter.</p>
            <Button variant="ghost" size="sm" className="mt-2" onClick={() => { setFilter('all'); setSearch(''); }}>Clear filters</Button>
          </div>
        )}
      </div>

      {selected && <TaskDetailModal log={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}