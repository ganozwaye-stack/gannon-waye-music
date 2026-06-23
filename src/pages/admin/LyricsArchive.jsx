import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Plus, Edit2, Trash2, Save, X, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function LyricsArchive() {
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ title: '', release_title: '', lyrics_text: '', inspiration: '', is_published: false });

  const { data: lyrics = [] } = useQuery({
    queryKey: ['lyrics'],
    queryFn: () => base44.entities.Lyric.list('-sort_order'),
  });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.Lyric.create(data),
    onSuccess: () => { queryClient.invalidateQueries(['lyrics']); setEditing(null); setForm({ title: '', release_title: '', lyrics_text: '', inspiration: '', is_published: false }); },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Lyric.update(id, data),
    onSuccess: () => { queryClient.invalidateQueries(['lyrics']); setEditing(null); },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.Lyric.delete(id),
    onSuccess: () => queryClient.invalidateQueries(['lyrics']),
  });

  const handleSave = () => {
    if (!form.title || !form.lyrics_text) return;
    if (editing?.id) {
      updateMutation.mutate({ id: editing.id, data: form });
    } else {
      createMutation.mutate(form);
    }
  };

  const handleEdit = (lyric) => {
    setEditing(lyric);
    setForm({ title: lyric.title, release_title: lyric.release_title || '', lyrics_text: lyric.lyrics_text, inspiration: lyric.inspiration || '', is_published: lyric.is_published });
  };

  const handleNew = () => {
    setEditing({});
    setForm({ title: '', release_title: '', lyrics_text: '', inspiration: '', is_published: false });
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="font-body text-[10px] tracking-[0.25em] uppercase text-primary mb-1">Admin</p>
          <h1 className="font-display text-3xl text-foreground">Lyrics Archive</h1>
        </div>
        <Button onClick={handleNew} className="gap-2"><Plus className="w-4 h-4" /> Add Lyrics</Button>
      </div>

      {editing && (
        <div className="mb-6 bg-card border border-border rounded-xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-body text-sm font-semibold text-foreground">{editing.id ? 'Edit Lyrics' : 'New Lyrics'}</h2>
            <button onClick={() => setEditing(null)} className="text-muted-foreground hover:text-foreground"><X className="w-4 h-4" /></button>
          </div>
          <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Song title" className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground" />
          <input value={form.release_title} onChange={e => setForm({ ...form, release_title: e.target.value })} placeholder="Release title (optional)" className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground" />
          <textarea value={form.lyrics_text} onChange={e => setForm({ ...form, lyrics_text: e.target.value })} placeholder="Lyrics..." rows={10} className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground font-mono" />
          <textarea value={form.inspiration} onChange={e => setForm({ ...form, inspiration: e.target.value })} placeholder="Inspiration / story behind the song (optional)" rows={3} className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground" />
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={form.is_published} onChange={e => setForm({ ...form, is_published: e.target.checked })} className="rounded" />
            <span className="font-body text-xs text-foreground">Published</span>
          </label>
          <Button onClick={handleSave} className="gap-2"><Save className="w-4 h-4" /> Save</Button>
        </div>
      )}

      <div className="space-y-3">
        {lyrics.length === 0 && !editing && (
          <p className="font-body text-sm text-muted-foreground text-center py-12">No lyrics yet. Click "Add Lyrics" to create your first.</p>
        )}
        {lyrics.map(lyric => (
          <div key={lyric.id} className="bg-card/50 border border-border/40 rounded-xl p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-display text-lg text-foreground">{lyric.title}</h3>
                  {lyric.is_published
                    ? <span className="text-[9px] uppercase tracking-widest text-green-500 flex items-center gap-1"><Eye className="w-3 h-3" /> Published</span>
                    : <span className="text-[9px] uppercase tracking-widest text-muted-foreground flex items-center gap-1"><EyeOff className="w-3 h-3" /> Draft</span>}
                </div>
                {lyric.release_title && <p className="font-body text-xs text-muted-foreground mt-0.5">{lyric.release_title}</p>}
                <p className="font-body text-xs text-foreground/50 mt-2 line-clamp-2 whitespace-pre-line">{lyric.lyrics_text}</p>
              </div>
              <div className="flex gap-2 ml-3">
                <button onClick={() => handleEdit(lyric)} className="text-muted-foreground hover:text-primary"><Edit2 className="w-4 h-4" /></button>
                <button onClick={() => deleteMutation.mutate(lyric.id)} className="text-muted-foreground hover:text-destructive"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}