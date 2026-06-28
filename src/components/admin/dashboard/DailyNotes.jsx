import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { StickyNote, Plus, Trash2 } from 'lucide-react';

export default function DailyNotes() {
  const queryClient = useQueryClient();
  const [note, setNote] = useState('');
  const [category, setCategory] = useState('');
  const [saving, setSaving] = useState(false);

  const { data: notes = [] } = useQuery({
    queryKey: ['dailyNotes'],
    queryFn: () => base44.entities.DailyNote.filter({ status: 'active' }, '-created_date'),
  });

  const addNote = async () => {
    if (!note.trim()) return;
    setSaving(true);
    try {
      await base44.entities.DailyNote.create({ note: note.trim(), category: category.trim() || 'general', turn_into_task: false, status: 'active' });
      setNote('');
      setCategory('');
      queryClient.invalidateQueries({ queryKey: ['dailyNotes'] });
    } catch { /* bubble */ }
    setSaving(false);
  };

  const remove = async (id) => {
    try {
      await base44.entities.DailyNote.update(id, { status: 'archived' });
      queryClient.invalidateQueries({ queryKey: ['dailyNotes'] });
    } catch { /* bubble */ }
  };

  return (
    <div className="bg-card border border-border/40 rounded-2xl p-5">
      <div className="flex items-center gap-2 mb-4">
        <StickyNote className="w-4 h-4 text-primary" />
        <h2 className="font-display text-lg text-foreground">Daily Notes & Brain Dump</h2>
      </div>

      <div className="space-y-2 mb-4">
        <textarea
          value={note}
          onChange={e => setNote(e.target.value)}
          placeholder="What's on your mind?"
          rows={2}
          className="w-full bg-secondary/30 border border-border/40 rounded-xl px-3 py-2.5 font-body text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-primary/40 resize-none"
        />
        <div className="flex gap-2">
          <input
            value={category}
            onChange={e => setCategory(e.target.value)}
            placeholder="Category (optional)"
            className="flex-1 bg-secondary/30 border border-border/40 rounded-lg px-3 py-2 font-body text-xs text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-primary/40"
          />
          <button
            onClick={addNote}
            disabled={saving || !note.trim()}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg gradient-gold-button font-body text-xs tracking-wider uppercase disabled:opacity-40"
          >
            <Plus className="w-3.5 h-3.5" /> Add
          </button>
        </div>
      </div>

      <div className="space-y-1.5 max-h-48 overflow-y-auto">
        {notes.map((n) => (
          <div key={n.id} className="flex items-start gap-2 rounded-lg bg-secondary/20 px-3 py-2 group">
            <div className="flex-1 min-w-0">
              <p className="font-body text-xs text-foreground/80 leading-relaxed">{n.note}</p>
              {n.category && <span className="font-body text-[9px] text-muted-foreground/50 uppercase tracking-wider">{n.category}</span>}
            </div>
            <button onClick={() => remove(n.id)} className="opacity-0 group-hover:opacity-60 hover:opacity-100 transition-opacity shrink-0">
              <Trash2 className="w-3 h-3 text-muted-foreground" />
            </button>
          </div>
        ))}
        {notes.length === 0 && <p className="font-body text-xs text-muted-foreground/40 py-2 text-center">No notes yet.</p>}
      </div>
    </div>
  );
}