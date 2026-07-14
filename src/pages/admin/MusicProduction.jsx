import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Plus, Edit2, Trash2, Save, X, Music, Sliders, Link2, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const STATUS_LABELS = {
  idea: 'Idea', demo: 'Demo', arranging: 'Arranging', recording: 'Recording',
  mixing: 'Mixing', mastering: 'Mastering', ready: 'Ready', released: 'Released',
};
const STATUS_COLORS = {
  idea: 'bg-muted text-muted-foreground', demo: 'bg-blue-500/15 text-blue-400',
  arranging: 'bg-purple-500/15 text-purple-400', recording: 'bg-orange-500/15 text-orange-400',
  mixing: 'bg-yellow-500/15 text-yellow-400', mastering: 'bg-amber-500/15 text-amber-400',
  ready: 'bg-green-500/15 text-green-400', released: 'bg-primary/15 text-primary',
};

const empty = {
  title: '', status: 'idea', daw_name: '', bpm: '', musical_key: '', time_signature: '4/4',
  sample_rate: '48000', bit_depth: '24', plugin_chain: [], related_release: '',
  project_file_url: '', reference_track_url: '', notes: '', next_action: '', priority: 'medium',
};

export default function MusicProduction() {
  const qc = useQueryClient();
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(empty);
  const [chainSlot, setChainSlot] = useState({ slot: '', plugin_name: '', preset: '', notes: '' });

  const { data: projects = [] } = useQuery({
    queryKey: ['musicProductionProjects'],
    queryFn: () => base44.entities.MusicProductionProject.list('-sort_order'),
  });

  const createMut = useMutation({
    mutationFn: (d) => base44.entities.MusicProductionProject.create(d),
    onSuccess: () => { qc.invalidateQueries(['musicProductionProjects']); setEditing(null); },
  });
  const updateMut = useMutation({
    mutationFn: ({ id, data }) => base44.entities.MusicProductionProject.update(id, data),
    onSuccess: () => { qc.invalidateQueries(['musicProductionProjects']); setEditing(null); },
  });
  const deleteMut = useMutation({
    mutationFn: (id) => base44.entities.MusicProductionProject.delete(id),
    onSuccess: () => qc.invalidateQueries(['musicProductionProjects']),
  });

  const stats = useMemo(() => {
    const c = { idea: 0, demo: 0, arranging: 0, recording: 0, mixing: 0, mastering: 0, ready: 0, released: 0 };
    projects.forEach(p => { if (c[p.status] !== undefined) c[p.status]++; });
    return c;
  }, [projects]);

  const handleNew = () => { setEditing({}); setForm(empty); };
  const handleEdit = (p) => {
    setEditing(p);
    setForm({
      ...empty, ...p,
      bpm: p.bpm || '', plugin_chain: p.plugin_chain || [],
    });
  };
  const handleSave = () => {
    if (!form.title) return;
    const payload = { ...form, bpm: form.bpm ? Number(form.bpm) : null };
    if (editing?.id) updateMut.mutate({ id: editing.id, data: payload });
    else createMut.mutate(payload);
  };
  const addChainSlot = () => {
    if (!chainSlot.plugin_name) return;
    setForm({ ...form, plugin_chain: [...(form.plugin_chain || []), chainSlot] });
    setChainSlot({ slot: '', plugin_name: '', preset: '', notes: '' });
  };
  const removeChainSlot = (idx) => {
    setForm({ ...form, plugin_chain: form.plugin_chain.filter((_, i) => i !== idx) });
  };

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <p className="font-body text-[10px] tracking-[0.25em] uppercase text-primary mb-1">Admin · Self-Production</p>
          <h1 className="font-display text-3xl text-foreground">Music Production</h1>
          <p className="font-body text-xs text-muted-foreground mt-1">Track self-produced projects — DAW settings, plugin chains, and development status.</p>
        </div>
        <Button onClick={handleNew} className="gap-2"><Plus className="w-4 h-4" /> New Project</Button>
      </div>

      <div className="flex flex-wrap gap-2">
        {Object.entries(STATUS_LABELS).map(([k, v]) => (
          <span key={k} className={`px-3 py-1.5 rounded-lg text-[10px] font-medium ${STATUS_COLORS[k]}`}>
            {v} <span className="opacity-60">({stats[k] || 0})</span>
          </span>
        ))}
      </div>

      {editing && (
        <div className="bg-card border border-border rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-body text-sm font-semibold">{editing.id ? 'Edit Project' : 'New Project'}</h2>
            <button onClick={() => setEditing(null)} className="text-muted-foreground hover:text-foreground"><X className="w-4 h-4" /></button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Track / project name *" className="bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground" />
            <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} className="bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground">
              {Object.entries(STATUS_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select>
            <input value={form.daw_name} onChange={e => setForm({ ...form, daw_name: e.target.value })} placeholder="DAW (Ableton, Logic, FL)" className="bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground" />
            <input value={form.bpm} onChange={e => setForm({ ...form, bpm: e.target.value })} placeholder="BPM" type="number" className="bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground" />
            <input value={form.musical_key} onChange={e => setForm({ ...form, musical_key: e.target.value })} placeholder="Key (e.g. C minor)" className="bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground" />
            <input value={form.time_signature} onChange={e => setForm({ ...form, time_signature: e.target.value })} placeholder="Time sig (4/4)" className="bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground" />
            <input value={form.sample_rate} onChange={e => setForm({ ...form, sample_rate: e.target.value })} placeholder="Sample rate (48000)" className="bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground" />
            <input value={form.bit_depth} onChange={e => setForm({ ...form, bit_depth: e.target.value })} placeholder="Bit depth (24)" className="bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground" />
            <select value={form.priority} onChange={e => setForm({ ...form, priority: e.target.value })} className="bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground">
              <option value="critical">Critical</option><option value="high">High</option><option value="medium">Medium</option><option value="low">Low</option>
            </select>
            <input value={form.related_release} onChange={e => setForm({ ...form, related_release: e.target.value })} placeholder="Related release" className="bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground" />
            <input value={form.project_file_url} onChange={e => setForm({ ...form, project_file_url: e.target.value })} placeholder="Project file URL" className="bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground" />
            <input value={form.reference_track_url} onChange={e => setForm({ ...form, reference_track_url: e.target.value })} placeholder="Reference track URL" className="bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground" />
          </div>
          <input value={form.next_action} onChange={e => setForm({ ...form, next_action: e.target.value })} placeholder="Next action" className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground" />
          <textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} placeholder="Production notes" rows={3} className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground" />

          {/* Plugin chain */}
          <div className="border border-border/40 rounded-lg p-3 space-y-3">
            <div className="flex items-center gap-2"><Sliders className="w-4 h-4 text-primary" /><span className="text-xs font-semibold">Plugin Chain</span></div>
            {(form.plugin_chain || []).map((slot, i) => (
              <div key={i} className="flex items-center gap-2 text-xs">
                <span className="text-muted-foreground w-5">{i + 1}.</span>
                <span className="bg-secondary/40 rounded px-2 py-1 flex-1"><b>{slot.slot || '—'}</b> · {slot.plugin_name}{slot.preset && ` (${slot.preset})`}</span>
                <button onClick={() => removeChainSlot(i)} className="text-muted-foreground hover:text-destructive"><X className="w-3 h-3" /></button>
              </div>
            ))}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
              <input value={chainSlot.slot} onChange={e => setChainSlot({ ...chainSlot, slot: e.target.value })} placeholder="Slot (EQ, Comp)" className="bg-background border border-border rounded px-2 py-1.5 text-xs" />
              <input value={chainSlot.plugin_name} onChange={e => setChainSlot({ ...chainSlot, plugin_name: e.target.value })} placeholder="Plugin name" className="bg-background border border-border rounded px-2 py-1.5 text-xs" />
              <input value={chainSlot.preset} onChange={e => setChainSlot({ ...chainSlot, preset: e.target.value })} placeholder="Preset" className="bg-background border border-border rounded px-2 py-1.5 text-xs" />
              <Button onClick={addChainSlot} variant="outline" size="sm" className="text-xs">Add</Button>
            </div>
          </div>

          <Button onClick={handleSave} className="gap-2"><Save className="w-4 h-4" /> Save</Button>
        </div>
      )}

      <div className="space-y-3">
        {projects.length === 0 && !editing && <p className="text-center text-muted-foreground py-12 text-sm">No production projects yet. Create your first one.</p>}
        {projects.map(p => (
          <div key={p.id} className="bg-card/50 border border-border/40 rounded-xl p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <Music className="w-4 h-4 text-primary" />
                  <h3 className="font-display text-lg text-foreground">{p.title}</h3>
                  <span className={`px-2 py-0.5 rounded text-[9px] uppercase tracking-wide font-medium ${STATUS_COLORS[p.status]}`}>{STATUS_LABELS[p.status]}</span>
                  <span className="text-[9px] uppercase tracking-wide text-muted-foreground">{p.priority}</span>
                </div>
                <div className="flex gap-4 mt-2 text-xs text-muted-foreground/60 flex-wrap">
                  {p.daw_name && <span>{p.daw_name}</span>}
                  {p.bpm && <span>{p.bpm} BPM</span>}
                  {p.musical_key && <span>{p.musical_key}</span>}
                  {p.time_signature && <span>{p.time_signature}</span>}
                  {p.sample_rate && <span>{p.sample_rate}Hz / {p.bit_depth}-bit</span>}
                </div>
                {p.plugin_chain && p.plugin_chain.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {p.plugin_chain.map((s, i) => (
                      <span key={i} className="text-[10px] bg-secondary/30 rounded px-2 py-0.5 text-muted-foreground">
                        {i + 1}. {s.slot || s.plugin_name}
                      </span>
                    ))}
                  </div>
                )}
                {p.next_action && <p className="text-xs text-primary/70 mt-2 flex items-center gap-1"><Clock className="w-3 h-3" /> {p.next_action}</p>}
                {p.notes && <p className="text-[11px] text-muted-foreground/50 mt-1 line-clamp-2">{p.notes}</p>}
              </div>
              <div className="flex gap-2 shrink-0">
                <button onClick={() => handleEdit(p)} className="text-muted-foreground hover:text-primary"><Edit2 className="w-4 h-4" /></button>
                <button onClick={() => deleteMut.mutate(p.id)} className="text-muted-foreground hover:text-destructive"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}