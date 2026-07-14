import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { ArrowLeft, Heart, Lock, Plus, Play, Pause, Edit2, Trash2, Save, X, Upload } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const TYPE_LABELS = {
  breathwork: 'Breathwork', body_scan: 'Body Scan', visualisation: 'Visualisation',
  reflection: 'Reflection', affirmation: 'Affirmation', guided: 'Guided',
};
const STATUS_LABELS = {
  draft: 'Draft', needs_review: 'Needs Review', approved: 'Approved', published: 'Published', archived: 'Archived',
};
const STATUS_COLORS = {
  draft: 'bg-muted text-muted-foreground', needs_review: 'bg-yellow-500/15 text-yellow-400',
  approved: 'bg-blue-500/15 text-blue-400', published: 'bg-green-500/15 text-green-400', archived: 'bg-red-500/15 text-red-400',
};

const empty = { title: '', meditation_type: 'guided', duration_minutes: '', program: 'All Programs', audio_url: '', description: '', status: 'draft', notes: '' };

export default function MeditationLibrary() {
  const qc = useQueryClient();
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(empty);
  const [playing, setPlaying] = useState(null);
  const [uploading, setUploading] = useState(false);

  const { data: meditations = [] } = useQuery({
    queryKey: ['meditations'],
    queryFn: () => base44.entities.Meditation.list('-sort_order'),
  });

  const createMut = useMutation({
    mutationFn: (d) => base44.entities.Meditation.create(d),
    onSuccess: () => { qc.invalidateQueries(['meditations']); setEditing(null); },
  });
  const updateMut = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Meditation.update(id, data),
    onSuccess: () => { qc.invalidateQueries(['meditations']); setEditing(null); },
  });
  const deleteMut = useMutation({
    mutationFn: (id) => base44.entities.Meditation.delete(id),
    onSuccess: () => qc.invalidateQueries(['meditations']),
  });

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      setForm({ ...form, audio_url: file_url });
    } catch (err) {
      console.error('Upload failed:', err);
    }
    setUploading(false);
  };

  const handleSave = () => {
    if (!form.title) return;
    const payload = { ...form, duration_minutes: form.duration_minutes ? Number(form.duration_minutes) : null };
    if (editing?.id) updateMut.mutate({ id: editing.id, data: payload });
    else createMut.mutate(payload);
  };

  const togglePlay = (m) => {
    if (playing === m.id) {
      setPlaying(null);
    } else {
      setPlaying(m.id);
    }
  };

  const handleNew = () => { setEditing({}); setForm(empty); };
  const handleEdit = (m) => { setEditing(m); setForm({ ...empty, ...m, duration_minutes: m.duration_minutes || '' }); };

  return (
    <div className="space-y-6 pb-10">
      <div className="flex items-center gap-3">
        <Link to="/admin/coaching-command"><Button variant="ghost" size="sm"><ArrowLeft className="w-4 h-4 mr-1" />Back</Button></Link>
        <div className="flex-1">
          <h1 className="text-2xl font-display font-bold gradient-gold-text">Meditation Library</h1>
          <p className="text-sm text-muted-foreground">Private meditations — not published to clients</p>
        </div>
        <Button onClick={handleNew} size="sm" className="gap-2"><Plus className="w-4 h-4" />Add Meditation</Button>
      </div>

      <div className="flex items-center gap-2 bg-yellow-500/5 border border-yellow-500/20 rounded-xl p-3 text-xs text-yellow-300/80">
        <Lock className="w-3.5 h-3.5 shrink-0" />
        All meditations must be reviewed and approved by Gannon before being published. These are drafts only.
      </div>

      {editing && (
        <Card className="border-primary/30">
          <CardContent className="p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold">{editing.id ? 'Edit Meditation' : 'New Meditation'}</h2>
              <button onClick={() => setEditing(null)} className="text-muted-foreground hover:text-foreground"><X className="w-4 h-4" /></button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Title *" className="bg-background border border-border rounded-lg px-3 py-2 text-sm" />
              <select value={form.meditation_type} onChange={e => setForm({ ...form, meditation_type: e.target.value })} className="bg-background border border-border rounded-lg px-3 py-2 text-sm">
                {Object.entries(TYPE_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
              <input value={form.duration_minutes} onChange={e => setForm({ ...form, duration_minutes: e.target.value })} placeholder="Duration (min)" type="number" className="bg-background border border-border rounded-lg px-3 py-2 text-sm" />
              <input value={form.program} onChange={e => setForm({ ...form, program: e.target.value })} placeholder="Program (e.g. 8-Week Mentorship)" className="bg-background border border-border rounded-lg px-3 py-2 text-sm" />
            </div>
            <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Description — what this meditation guides" rows={2} className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm" />
            <div className="space-y-2">
              <label className="text-xs text-muted-foreground">Audio file</label>
              <div className="flex items-center gap-2">
                <label className="cursor-pointer">
                  <input type="file" accept="audio/*" onChange={handleUpload} className="hidden" />
                  <span className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-border bg-secondary/30 text-xs hover:bg-secondary/50 transition-colors">
                    <Upload className="w-3 h-3" />{uploading ? 'Uploading…' : 'Upload audio'}
                  </span>
                </label>
                {form.audio_url && <span className="text-xs text-green-400">Audio uploaded ✓</span>}
              </div>
              {form.audio_url && <audio src={form.audio_url} controls className="w-full mt-1" />}
            </div>
            <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} className="bg-background border border-border rounded-lg px-3 py-2 text-sm">
              {Object.entries(STATUS_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select>
            <textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} placeholder="Private notes" rows={2} className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm" />
            <Button onClick={handleSave} size="sm" className="gap-2"><Save className="w-3 h-3" />Save</Button>
          </CardContent>
        </Card>
      )}

      <div className="space-y-2">
        {meditations.length === 0 && !editing && (
          <p className="text-center text-muted-foreground py-12 text-sm">No meditations yet. Add your first draft.</p>
        )}
        {meditations.map(m => (
          <Card key={m.id} className="hover:border-primary/40 transition-colors">
            <CardContent className="p-4 flex items-center justify-between gap-3">
              <div className="flex items-start gap-3 flex-1 min-w-0">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <Heart className="w-4 h-4 text-primary" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium">{m.title}</p>
                  <div className="flex gap-2 mt-1 flex-wrap">
                    <Badge variant="outline" className="text-[10px]">{TYPE_LABELS[m.meditation_type]}</Badge>
                    {m.duration_minutes && <Badge variant="outline" className="text-[10px]">⏱ {m.duration_minutes} min</Badge>}
                    <Badge className="bg-secondary text-muted-foreground text-[10px]">{m.program}</Badge>
                  </div>
                  {m.description && <p className="text-[11px] text-muted-foreground/50 mt-1 line-clamp-1">{m.description}</p>}
                  {m.audio_url && playing === m.id && (
                    <audio src={m.audio_url} controls autoPlay className="w-full max-w-md mt-2" onEnded={() => setPlaying(null)} />
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Badge className={`text-[10px] ${STATUS_COLORS[m.status]}`}>{STATUS_LABELS[m.status]}</Badge>
                {m.audio_url ? (
                  <Button variant="ghost" size="sm" className="text-xs gap-1 text-muted-foreground hover:text-primary" onClick={() => togglePlay(m)}>
                    {playing === m.id ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                    {playing === m.id ? 'Pause' : 'Preview'}
                  </Button>
                ) : (
                  <span className="text-[10px] text-muted-foreground/30">No audio</span>
                )}
                <button onClick={() => handleEdit(m)} className="text-muted-foreground hover:text-primary"><Edit2 className="w-3 h-3" /></button>
                <button onClick={() => deleteMut.mutate(m.id)} className="text-muted-foreground hover:text-destructive"><Trash2 className="w-3 h-3" /></button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}