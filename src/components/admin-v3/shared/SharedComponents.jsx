import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Info, ChevronDown, AlertCircle } from 'lucide-react';
import { mapAgentCrew } from '@/lib/adminV3Adapters';
import { calcAgentStatus } from '@/lib/adminV3Metrics';

// ─── Status Dot ────────────────────────────────────────────────────────────
const LEVEL_COLORS = {
  green: 'bg-green-500',
  orange: 'bg-orange-500',
  red: 'bg-red-500',
  grey: 'bg-zinc-500',
  blue: 'bg-blue-500',
};

export function StatusDot({ level = 'grey', size = 'sm' }) {
  const sz = size === 'lg' ? 'w-2.5 h-2.5' : 'w-1.5 h-1.5';
  return <span className={`${sz} rounded-full ${LEVEL_COLORS[level] || LEVEL_COLORS.grey} inline-block shrink-0`} />;
}

// ─── Status Badge ───────────────────────────────────────────────────────────
export function StatusBadge({ label, level = 'grey' }) {
  const colors = {
    green: 'text-green-400 border-green-500/30 bg-green-500/5',
    orange: 'text-orange-400 border-orange-500/30 bg-orange-500/5',
    red: 'text-red-400 border-red-500/30 bg-red-500/5',
    grey: 'text-zinc-400 border-zinc-500/30 bg-zinc-500/5',
    blue: 'text-blue-400 border-blue-500/30 bg-blue-500/5',
  };
  return (
    <span className={`inline-flex items-center gap-1.5 border rounded-md px-2 py-0.5 text-[10px] font-medium tracking-wide ${colors[level] || colors.grey}`}>
      <StatusDot level={level} />
      {label}
    </span>
  );
}

// ─── Info Tooltip (expandable) ─────────────────────────────────────────────
export function InfoTooltip({ text }) {
  const [open, setOpen] = useState(false);
  return (
    <span className="relative inline-flex">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="text-muted-foreground/40 hover:text-primary transition-colors"
        aria-label="How is this calculated?"
      >
        <Info className="w-3 h-3" />
      </button>
      {open && (
        <span className="absolute z-50 top-full mt-1 right-0 w-64 bg-popover border border-border rounded-lg p-3 shadow-xl font-poppins">
          <span className="block text-[10px] text-muted-foreground leading-relaxed">{text}</span>
        </span>
      )}
    </span>
  );
}

// ─── KPI Card ──────────────────────────────────────────────────────────────
export function KpiCard({ icon: Icon, label, value, sublabel = '', path = '', tooltip = '', level = '' }) {
  const content = (
    <div className="group flex items-center gap-4 border border-border/50 rounded-xl px-5 py-4 hover:border-primary/40 transition-all bg-card/40 hover:bg-card/60">
      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
        <Icon className="w-4 h-4 text-primary" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <p className="text-[10px] tracking-[0.15em] uppercase text-muted-foreground">{label}</p>
          {tooltip && <InfoTooltip text={tooltip} />}
        </div>
        <p className="text-2xl text-foreground leading-tight font-semibold">{value}</p>
        <p className="text-[10px] text-muted-foreground/60">{sublabel}</p>
      </div>
      {level && <StatusDot level={level} size="lg" />}
      {path && <ArrowRight className="w-4 h-4 text-muted-foreground/30 group-hover:text-primary transition-colors shrink-0" />}
    </div>
  );
  return path ? <Link to={path}>{content}</Link> : content;
}

// ─── Section Card ───────────────────────────────────────────────────────────
export function SectionCard({ title, actionLabel = '', actionPath = '', children = null, count = null }) {
  return (
    <div className="border border-border/40 rounded-xl bg-card/30 overflow-hidden">
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-border/30">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-medium text-foreground tracking-wide">{title}</h2>
          {count != null && <span className="text-[10px] text-muted-foreground bg-secondary/40 rounded px-1.5 py-0.5">{count}</span>}
        </div>
        {actionLabel && actionPath && (
          <Link to={actionPath} className="text-xs text-primary hover:underline flex items-center gap-1">
            {actionLabel} <ArrowRight className="w-3 h-3" />
          </Link>
        )}
      </div>
      <div className="p-2">{children}</div>
    </div>
  );
}

// ─── Loading State ─────────────────────────────────────────────────────────
export function LoadingState({ label = 'Loading…' }) {
  return (
    <div className="flex items-center gap-3 px-4 py-6">
      <div className="w-4 h-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
      <span className="text-xs text-muted-foreground">{label}</span>
    </div>
  );
}

// ─── Empty State ───────────────────────────────────────────────────────────
export function EmptyState({ message = 'Nothing here yet.', icon: Icon = null }) {
  return (
    <div className="px-4 py-6 text-center">
      {Icon ? <Icon className="w-5 h-5 text-muted-foreground/40 mx-auto mb-2" /> : null}
      <p className="text-xs text-muted-foreground">{message}</p>
    </div>
  );
}

// ─── Error State ───────────────────────────────────────────────────────────
export function ErrorState({ message = 'Unable to load this data.' }) {
  return (
    <div className="flex items-center gap-2 px-4 py-4">
      <AlertCircle className="w-4 h-4 text-orange-400" />
      <span className="text-xs text-muted-foreground">{message}</span>
    </div>
  );
}

// ─── Row Item (clickable) ──────────────────────────────────────────────────
export function RowItem({ title, subtitle = '', status = '', statusLevel = 'grey', level = '', path = '', action = '' }) {
  const displayLevel = statusLevel || level || 'grey';
  const content = (
    <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-secondary/30 transition-colors group">
      <div className="flex-1 min-w-0">
        <p className="text-sm text-foreground/80 truncate">{title}</p>
        {subtitle && <p className="text-[10px] text-muted-foreground/50 truncate">{subtitle}</p>}
      </div>
      {status && <StatusBadge label={status} level={displayLevel} />}
      {action && (
        <span className="text-[10px] text-primary border border-primary/30 rounded px-2 py-0.5 group-hover:bg-primary/10 transition-colors">{action}</span>
      )}
    </div>
  );
  return path ? <Link to={path}>{content}</Link> : content;
}

// ─── Incident Card (grouped) ────────────────────────────────────────────────
export function IncidentCard({ incident }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="border border-border/40 rounded-lg px-4 py-3 bg-card/20">
      <button onClick={() => setExpanded(!expanded)} className="flex items-center gap-3 w-full text-left">
        <StatusDot level={incident.severity === 'critical' ? 'red' : incident.severity === 'high' ? 'orange' : 'grey'} />
        <div className="flex-1 min-w-0">
          <p className="text-sm text-foreground/80 truncate">{incident.title}</p>
          <p className="text-[10px] text-muted-foreground/50">{incident.category} · {incident.count} occurrence{incident.count !== 1 ? 's' : ''}</p>
        </div>
        <span className="text-[10px] text-muted-foreground">Last: {incident.lastSeen ? new Date(incident.lastSeen).toLocaleDateString('en-AU') : '—'}</span>
        <ChevronDown className={`w-3.5 h-3.5 text-muted-foreground transition-transform ${expanded ? 'rotate-180' : ''}`} />
      </button>
      {expanded && (
        <div className="mt-3 pt-3 border-t border-border/20 space-y-2">
          <p className="text-[10px] text-muted-foreground"><span className="text-muted-foreground/60">First seen:</span> {incident.firstSeen ? new Date(incident.firstSeen).toLocaleString('en-AU') : '—'}</p>
          <p className="text-[10px] text-muted-foreground"><span className="text-muted-foreground/60">Last seen:</span> {incident.lastSeen ? new Date(incident.lastSeen).toLocaleString('en-AU') : '—'}</p>
          <p className="text-[10px] text-muted-foreground"><span className="text-muted-foreground/60">Next action:</span> {incident.nextAction}</p>
          <p className="text-[10px] text-muted-foreground/50 italic mt-2">Underlying records are preserved. This is a display grouping only.</p>
        </div>
      )}
    </div>
  );
}

// ─── Crew Card ─────────────────────────────────────────────────────────────
export function CrewCard({ crew, agents, taskLogs }) {
  const [expanded, setExpanded] = useState(false);
  const crewAgents = agents.filter(a => mapAgentCrew(a.name || a.agent_name) === crew);

  return (
    <div className="border border-border/40 rounded-lg px-4 py-3 bg-card/20">
      <button onClick={() => setExpanded(!expanded)} className="flex items-center gap-3 w-full text-left">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-foreground">{crew}</p>
          <p className="text-[10px] text-muted-foreground/60">{crewAgents.length} registered agent{crewAgents.length !== 1 ? 's' : ''}</p>
        </div>
        <ChevronDown className={`w-3.5 h-3.5 text-muted-foreground transition-transform ${expanded ? 'rotate-180' : ''}`} />
      </button>
      {expanded && (
        <div className="mt-3 pt-3 border-t border-border/20 space-y-1.5">
          {crewAgents.length === 0 && <p className="text-[10px] text-muted-foreground">No agents mapped to this crew.</p>}
          {crewAgents.slice(0, 20).map(agent => {
            const status = calcAgentStatus(agent, taskLogs);
            return (
              <div key={agent.id} className="flex items-center gap-2 px-2 py-1 rounded hover:bg-secondary/20">
                <StatusDot level={status.level} />
                <span className="text-xs text-foreground/70 flex-1 truncate">{agent.name || agent.agent_name || 'Unnamed agent'}</span>
                <span className="text-[10px] text-muted-foreground">{status.label}</span>
              </div>
            );
          })}
          {crewAgents.length > 20 && <p className="text-[10px] text-muted-foreground/50 italic pt-1">+{crewAgents.length - 20} more (showing first 20)</p>}
        </div>
      )}
    </div>
  );
}
