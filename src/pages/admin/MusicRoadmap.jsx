import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit2, Trash2, Save, X, Music, Clock, ChevronRight, Flag, CheckCircle2, Circle, Disc3 } from 'lucide-react';

const STAGES = [
  { key: 'idea', label: 'Idea', color: 'border-l-muted-foreground bg-muted/5' },
  { key: 'writing', label: 'Writing', color: 'border-l-blue-500 bg-blue-500/5' },
  { key: 'pre_production', label: 'Pre-Production', color: 'border-l-purple-500 bg-purple-500/5' },
  { key: 'recording', label: 'Recording', color: 'border-l-orange-500 bg-orange-500/5' },
  { key: 'mixing', label: 'Mixing', color: 'border-l-yellow-500 bg-yellow-500/5' },
  { key: 'mastering', label: 'Mastering', color: 'border-l-amber-500 bg-amber-500/5' },
  { key: 'ready', label: 'Ready', color: 'border-l-green-500 bg-green-500/5' },
  { key: 'released', label: 'Released', color: 'border-l-primary bg-primary/5' },
];

const PRIORITY_COLORS = {
  critical: 'bg-red-500/20 text-red-400',
  high: 'bg-orange-500/20 text-orange-400',
  medium: 'bg-blue-500/20 text-blue-400',
  low: 'bg-muted text-muted-foreground',
};

export default function MusicRoadmap() {
  const qc = useQueryClient();
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ title: '', status: 'idea', next_action: '', priority: 'medium', notes: '', related_release: '' });

  const { data: projects = [] } = useQuery({
    queryKey: ['musicProductionProjects'],
    queryFn: () => base44.entities.MusicProductionProject.list('-sort_order'),
  });

  const { data: releases = [] } = useQuery({
    queryKey: ['releases'],
    queryFn: () => base44.entities.Release.list('-release_date'),
  });

  const updateMut = useMutation({
    mutationFn: ({ id, data }) => base44.entities.MusicProductionProject.update(id, data),
    onSuccess: () => qc.invalidateQueries(['musicProductionProjects']),
  });

  const moveStage = (project, direction) => {
    const currentIdx = STAGES.findIndex(s => s.key === project.status);
    const newIdx = direction === 'forward' ? Math.min(currentIdx + 1, STAGES.length - 1) : Math.max(currentIdx - 1, 0);
    if (newIdx !== currentIdx) {
      updateMut.mutate({ id: project.id, data: { status: STAGES[newIdx].key } });
    }
  };

  const grouped = useMemo(() => {
    const g = {};
    STAGES.forEach(s => { g[s.key] = []; });
    projects.forEach(p => { if (g[p.status]) g[p.status].push(p); });
    return g;
  }, [projects]);

  const stats = useMemo(() => {
    const total = projects.length;
    const released = projects.filter(p => p.status === 'released').length;
    const inProgress = projects.filter(p => ['recording', 'mixing', 'mastering'].includes(p.status)).length;
    const ready = projects.filter(p => p.status === 'ready').length;
    const upcomingReleases = releases.filter(r => !r.is_published && r.status !== 'released').length;
    return { total, released, inProgress, ready, upcomingReleases };
  }, [projects, releases]);

  const upcomingReleases = releases.filter(r => !r.is_published || r.status === 'ready').slice(0, 6);

  const handleEdit = (p) => {
    setEditing(p.id);
    setForm({ title: p.title || '', status: p.status || 'idea', next_action: p.next_action || '', priority: p.priority || 'medium', notes: p.notes || '', related_release: p.related_release || '' });
  };

  const handleSave = () => {
    if (!editing) return;
    updateMut.mutate({ id: editing, data: form });
    setEditing(null);
  };

  return (
    <div className="px-4 md:px-8 py-8 max-w-[1600px] mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <p className="font-body text-[10px] tracking-[0.3em] uppercase text-primary mb-1">Admin · Production Pipeline</p>
          <h1 className="font-display text-3xl text-foreground">Music Production Roadmap</h1>
          <p className="font-body text-sm text-muted-foreground mt-1">Track recording status and release milestones for all upcoming tracks</p>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <div className="bg-card/50 border border-border/40 rounded-xl p-4">
          <p className="font-body text-[10px] uppercase tracking-wider text-muted-foreground">Total Projects</p>
          <p className="font-display text-2xl text-foreground mt-1">{stats.total}</p>
        </div>
        <div className="bg-card/50 border border-border/40 rounded-xl p-4">
          <p className="font-body text-[10px] uppercase tracking-wider text-muted-foreground">In Progress</p>
          <p className="font-display text-2xl text-orange-400 mt-1">{stats.inProgress}</p>
        </div>
        <div className="bg-card/50 border border-border/40 rounded-xl p-4">
          <p className="font-body text-[10px] uppercase tracking-wider text-muted-foreground">Ready</p>
          <p className="font-display text-2xl text-green-400 mt-1">{stats.ready}</p>
        </div>
        <div className="bg-card/50 border border-border/40 rounded-xl p-4">
          <p className="font-body text-[10px] uppercase tracking-wider text-muted-foreground">Released</p>
          <p className="font-display text-2xl text-primary mt-1">{stats.released}</p>
        </div>
        <div className="bg-card/50 border border-border/40 rounded-xl p-4">
          <p className="font-body text-[10px] uppercase tracking-wider text-muted-foreground">Upcoming Releases</p>
          <p className="font-display text-2xl text-purple-400 mt-1">{stats.upcomingReleases}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        {/* Kanban board — spans 3 columns */}
        <div className="xl:col-span-3">
          <h2 className="font-display text-lg text-foreground mb-3 flex items-center gap-2"><Disc3 className="w-4 h-4 text-primary" /> Production Pipeline</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-4 gap-3">
            {STAGES.map(stage => (
              <div key={stage.key} className={`rounded-xl border-l-4 ${stage.color} border border-border/40 p-3 min-h-[200px]`}>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-body text-xs font-semibold uppercase tracking-wider text-foreground">{stage.label}</h3>
                  <Badge variant="secondary" className="text-[9px] h-5 px-1.5">{grouped[stage.key]?.length || 0}</Badge>
                </div>
                <div className="space-y-2">
                  {(grouped[stage.key] || []).map(p => (
                    <div key={p.id} className="bg-card border border-border/40 rounded-lg p-3 group">
                      <div className="flex items-start justify-between gap-1 mb-1">
                        <p className="font-body text-xs font-medium text-foreground truncate flex-1">{p.title}</p>
                        <button onClick={() => handleEdit(p)} className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-primary">
                          <Edit2 className="w-3 h-3" />
                        </button>
                      </div>
                      {p.priority && <Badge className={`text-[8px] h-4 px-1 ${PRIORITY_COLORS[p.priority]}`}>{p.priority}</Badge>}
                      {p.next_action && <p className="font-body text-[10px] text-primary/70 mt-1 flex items-start gap-1"><Clock className="w-2.5 h-2.5 mt-0.5 shrink-0" /> {p.next_action}</p>}
                      {p.bpm && <p className="font-body text-[9px] text-muted-foreground/60 mt-1">{p.bpm} BPM · {p.musical_key || '—'}</p>}
                      <div className="flex gap-1 mt-2">
                        <button onClick={() => moveStage(p, 'back')} disabled={stage.key === 'idea'} className="flex-1 text-[9px] py-1 rounded bg-secondary/40 hover:bg-secondary/60 disabled:opacity-30 transition-colors">← Back</button>
                        <button onClick={() => moveStage(p, 'forward')} disabled={stage.key === 'released'} className="flex-1 text-[9px] py-1 rounded bg-secondary/40 hover:bg-secondary/60 disabled:opacity-30 transition-colors">Forward →</button>
                      </div>
                    </div>
                  ))}
                  {(grouped[stage.key] || []).length === 0 && (
                    <p className="text-[10px] text-muted-foreground/30 text-center py-4">—</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right sidebar — Upcoming release milestones */}
        <div className="xl:col-span-1 space-y-4">
          <div className="bg-card/50 border border-border/40 rounded-xl p-5">
            <h2 className="font-display text-lg text-foreground mb-3 flex items-center gap-2"><Flag className="w-4 h-4 text-primary" /> Release Milestones</h2>
            {upcomingReleases.length === 0 ? (
              <p className="font-body text-xs text-muted-foreground">No upcoming releases scheduled.</p>
            ) : (
              <div className="space-y-3">
                {upcomingReleases.map(r => {
                  const stage = STAGES.find(s => s.key === r.status) || STAGES[0];
                  const isReady = r.status === 'ready' || r.status === 'released';
                  return (
                    <div key={r.id} className="border-l-2 border-primary/30 pl-3">
                      <div className="flex items-center gap-2">
                        {isReady ? <CheckCircle2 className="w-3.5 h-3.5 text-green-400" /> : <Circle className="w-3.5 h-3.5 text-muted-foreground" />}
                        <p className="font-body text-sm font-medium text-foreground">{r.title}</p>
                      </div>
                      <p className="font-body text-[10px] text-muted-foreground mt-0.5 ml-5">{r.type} · {r.release_date ? new Date(r.release_date).toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' }) : 'TBA'}</p>
                      <Badge className={`text-[8px] h-4 px-1 mt-1 ${stage.color.includes('primary') ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground'}`}>{stage.label}</Badge>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {editing && (
            <div className="bg-card border border-border rounded-xl p-5 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-body text-sm font-semibold">Edit Project</h3>
                <button onClick={() => setEditing(null)} className="text-muted-foreground hover:text-foreground"><X className="w-4 h-4" /></button>
              </div>
              <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Title" className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground" />
              <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground">
                {STAGES.map(s => <option key={s.key} value={s.key}>{s.label}</option>)}
              </select>
              <select value={form.priority} onChange={e => setForm({ ...form, priority: e.target.value })} className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground">
                <option value="critical">Critical</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
              <input value={form.next_action} onChange={e => setForm({ ...form, next_action: e.target.value })} placeholder="Next action" className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground" />
              <textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} placeholder="Notes" rows={2} className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground" />
              <Button onClick={handleSave} size="sm" className="w-full gap-2"><Save className="w-3.5 h-3.5" /> Save</Button>
            </div>
          )}

          <div className="bg-card/50 border border-border/40 rounded-xl p-5">
            <h3 className="font-body text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Quick Tips</h3>
            <ul className="space-y-1.5 text-[11px] text-muted-foreground">
              <li className="flex items-start gap-1.5"><ChevronRight className="w-3 h-3 mt-0.5 shrink-0 text-primary" /> Use the ← Back / Forward → buttons to move tracks between stages</li>
              <li className="flex items-start gap-1.5"><ChevronRight className="w-3 h-3 mt-0.5 shrink-0 text-primary" /> Edit detailed DAW/plugin settings in Music Production</li>
              <li className="flex items-start gap-1.5"><ChevronRight className="w-3 h-3 mt-0.5 shrink-0 text-primary" /> Release milestones pull from the Releases admin</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}