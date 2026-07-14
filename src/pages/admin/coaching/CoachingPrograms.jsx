import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { ArrowLeft, BookOpen, Edit2, Plus, ChevronRight, Save, X, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const empty = {
  title: '', slug: '', type: 'Single Session', hook: '', description: '',
  who_its_for: '', what_we_cover: [], what_they_leave_with: [],
  price_display: '', price_amount: '', duration_minutes: '', format: 'zoom',
  is_published: false, cta_label: 'Book a Clarity Session', sort_order: 0,
};

export default function CoachingPrograms() {
  const qc = useQueryClient();
  const [expanded, setExpanded] = useState(null);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(empty);
  const [inclusionInput, setInclusionInput] = useState('');
  const [outcomeInput, setOutcomeInput] = useState('');

  const { data: programs = [] } = useQuery({
    queryKey: ['coachingOffers'],
    queryFn: () => base44.entities.CoachingOffer.list('sort_order'),
  });

  const createMut = useMutation({
    mutationFn: (d) => base44.entities.CoachingOffer.create(d),
    onSuccess: () => { qc.invalidateQueries(['coachingOffers']); setEditing(null); },
  });
  const updateMut = useMutation({
    mutationFn: ({ id, data }) => base44.entities.CoachingOffer.update(id, data),
    onSuccess: () => { qc.invalidateQueries(['coachingOffers']); setEditing(null); },
  });
  const deleteMut = useMutation({
    mutationFn: (id) => base44.entities.CoachingOffer.delete(id),
    onSuccess: () => qc.invalidateQueries(['coachingOffers']),
  });

  const handleNew = () => { setEditing({}); setForm(empty); };
  const handleEdit = (p) => {
    setEditing(p);
    setForm({
      ...empty, ...p,
      price_amount: p.price_amount || '', duration_minutes: p.duration_minutes || '',
      what_we_cover: p.what_we_cover || [], what_they_leave_with: p.what_they_leave_with || [],
    });
  };
  const handleSave = () => {
    if (!form.title || !form.slug) return;
    const payload = {
      ...form,
      price_amount: form.price_amount ? Number(form.price_amount) : null,
      duration_minutes: form.duration_minutes ? Number(form.duration_minutes) : null,
      sort_order: form.sort_order ? Number(form.sort_order) : 0,
    };
    if (editing?.id) updateMut.mutate({ id: editing.id, data: payload });
    else createMut.mutate(payload);
  };
  const addInclusion = () => {
    if (!inclusionInput.trim()) return;
    setForm({ ...form, what_we_cover: [...(form.what_we_cover || []), inclusionInput.trim()] });
    setInclusionInput('');
  };
  const removeInclusion = (idx) => setForm({ ...form, what_we_cover: form.what_we_cover.filter((_, i) => i !== idx) });
  const addOutcome = () => {
    if (!outcomeInput.trim()) return;
    setForm({ ...form, what_they_leave_with: [...(form.what_they_leave_with || []), outcomeInput.trim()] });
    setOutcomeInput('');
  };
  const removeOutcome = (idx) => setForm({ ...form, what_they_leave_with: form.what_they_leave_with.filter((_, i) => i !== idx) });

  const slugify = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

  return (
    <div className="space-y-6 pb-10">
      <div className="flex items-center gap-3">
        <Link to="/admin/coaching-command"><Button variant="ghost" size="sm"><ArrowLeft className="w-4 h-4 mr-1" />Back</Button></Link>
        <div className="flex-1">
          <h1 className="text-2xl font-display font-bold gradient-gold-text">Programs (Staging)</h1>
          <p className="text-sm text-muted-foreground">Draft coaching programs — private, not published</p>
        </div>
        <Button onClick={handleNew} size="sm" className="gap-2"><Plus className="w-4 h-4" />Add Program</Button>
      </div>

      <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-xl p-4 text-xs text-yellow-300/80">
        🔒 All programs are in DRAFT status until explicitly published. No prices are shown publicly until launch gates are passed.
      </div>

      {editing && (
        <Card className="border-primary/30">
          <CardContent className="p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold">{editing.id ? 'Edit Program' : 'New Program'}</h2>
              <button onClick={() => setEditing(null)} className="text-muted-foreground hover:text-foreground"><X className="w-4 h-4" /></button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value, slug: form.slug || slugify(e.target.value) })} placeholder="Program name *" className="bg-background border border-border rounded-lg px-3 py-2 text-sm" />
              <input value={form.slug} onChange={e => setForm({ ...form, slug: e.target.value })} placeholder="slug *" className="bg-background border border-border rounded-lg px-3 py-2 text-sm" />
              <input value={form.hook} onChange={e => setForm({ ...form, hook: e.target.value })} placeholder="Hook — one-liner" className="bg-background border border-border rounded-lg px-3 py-2 text-sm" />
              <input value={form.price_display} onChange={e => setForm({ ...form, price_display: e.target.value })} placeholder="Price display (e.g. $150 or Enquire)" className="bg-background border border-border rounded-lg px-3 py-2 text-sm" />
              <input value={form.price_amount} onChange={e => setForm({ ...form, price_amount: e.target.value })} placeholder="Price amount (number)" type="number" className="bg-background border border-border rounded-lg px-3 py-2 text-sm" />
              <input value={form.duration_minutes} onChange={e => setForm({ ...form, duration_minutes: e.target.value })} placeholder="Duration (min)" type="number" className="bg-background border border-border rounded-lg px-3 py-2 text-sm" />
              <select value={form.format} onChange={e => setForm({ ...form, format: e.target.value })} className="bg-background border border-border rounded-lg px-3 py-2 text-sm">
                <option value="zoom">Zoom</option><option value="phone">Phone</option><option value="in_person">In person</option><option value="async">Async</option>
              </select>
              <input value={form.sort_order} onChange={e => setForm({ ...form, sort_order: e.target.value })} placeholder="Sort order" type="number" className="bg-background border border-border rounded-lg px-3 py-2 text-sm" />
            </div>
            <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Description" rows={2} className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm" />
            <textarea value={form.who_its_for} onChange={e => setForm({ ...form, who_its_for: e.target.value })} placeholder="Who it's for" rows={2} className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm" />

            {/* Inclusions */}
            <div className="border border-border/40 rounded-lg p-3 space-y-2">
              <p className="text-xs font-semibold">What's Included</p>
              {(form.what_we_cover || []).map((item, i) => (
                <div key={i} className="flex items-center gap-2 text-xs">
                  <span className="text-green-400">✓</span><span className="flex-1 bg-secondary/30 rounded px-2 py-1">{item}</span>
                  <button onClick={() => removeInclusion(i)} className="text-muted-foreground hover:text-destructive"><X className="w-3 h-3" /></button>
                </div>
              ))}
              <div className="flex gap-2">
                <input value={inclusionInput} onChange={e => setInclusionInput(e.target.value)} placeholder="Add inclusion (e.g. Weekly 60-min session)" className="flex-1 bg-background border border-border rounded px-2 py-1.5 text-xs" onKeyDown={e => e.key === 'Enter' && addInclusion()} />
                <Button onClick={addInclusion} variant="outline" size="sm" className="text-xs">Add</Button>
              </div>
            </div>

            {/* Outcomes */}
            <div className="border border-border/40 rounded-lg p-3 space-y-2">
              <p className="text-xs font-semibold">What They Leave With</p>
              {(form.what_they_leave_with || []).map((item, i) => (
                <div key={i} className="flex items-center gap-2 text-xs">
                  <span className="text-primary">→</span><span className="flex-1 bg-secondary/30 rounded px-2 py-1">{item}</span>
                  <button onClick={() => removeOutcome(i)} className="text-muted-foreground hover:text-destructive"><X className="w-3 h-3" /></button>
                </div>
              ))}
              <div className="flex gap-2">
                <input value={outcomeInput} onChange={e => setOutcomeInput(e.target.value)} placeholder="Add outcome" className="flex-1 bg-background border border-border rounded px-2 py-1.5 text-xs" onKeyDown={e => e.key === 'Enter' && addOutcome()} />
                <Button onClick={addOutcome} variant="outline" size="sm" className="text-xs">Add</Button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input type="checkbox" checked={form.is_published} onChange={e => setForm({ ...form, is_published: e.target.checked })} id="pub" />
              <label htmlFor="pub" className="text-xs text-muted-foreground">Published (visible on public site)</label>
            </div>
            <Button onClick={handleSave} size="sm" className="gap-2"><Save className="w-3 h-3" />Save</Button>
          </CardContent>
        </Card>
      )}

      <div className="space-y-3">
        {programs.length === 0 && !editing && <p className="text-center text-muted-foreground py-12 text-sm">No programs yet. Add your first program.</p>}
        {programs.map((p, i) => (
          <Card key={p.id} className="cursor-pointer hover:border-primary/40 transition-colors" onClick={() => setExpanded(expanded === i ? null : i)}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 flex-1">
                  <BookOpen className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-semibold text-sm">{p.title}</p>
                      <Badge variant="outline" className="text-[10px]">{p.duration_minutes ? `${p.duration_minutes} min` : 'Flexible'}</Badge>
                      <Badge variant="outline" className="text-[10px]">{p.format}</Badge>
                      {p.is_published
                        ? <Badge className="bg-green-500/15 text-green-400 text-[10px]">Published</Badge>
                        : <Badge className="bg-secondary text-muted-foreground text-[10px]">Draft</Badge>}
                    </div>
                    {p.hook && <p className="text-xs text-primary/60 mt-1 italic">{p.hook}</p>}
                    {p.description && <p className="text-xs text-muted-foreground mt-1">{p.description}</p>}
                    <div className="flex gap-4 mt-2 text-xs text-muted-foreground/60">
                      <span>💰 {p.price_display || 'Price TBD'}</span>
                      {p.what_we_cover?.length > 0 && <span>📋 {p.what_we_cover.length} inclusions</span>}
                      {p.what_they_leave_with?.length > 0 && <span>→ {p.what_they_leave_with.length} outcomes</span>}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button onClick={(e) => { e.stopPropagation(); handleEdit(p); }} className="text-muted-foreground hover:text-primary p-1"><Edit2 className="w-3 h-3" /></button>
                  <button onClick={(e) => { e.stopPropagation(); deleteMut.mutate(p.id); }} className="text-muted-foreground hover:text-destructive p-1"><Trash2 className="w-3 h-3" /></button>
                  <ChevronRight className={`w-4 h-4 text-muted-foreground transition-transform shrink-0 mt-1 ${expanded === i ? 'rotate-90' : ''}`} />
                </div>
              </div>

              {expanded === i && (
                <div className="mt-4 pl-8 border-t border-border/30 pt-4 space-y-3">
                  {p.who_its_for && (
                    <div>
                      <p className="text-xs font-semibold text-foreground/70 mb-1">Who It's For</p>
                      <p className="text-xs text-muted-foreground">{p.who_its_for}</p>
                    </div>
                  )}
                  {p.what_we_cover && p.what_we_cover.length > 0 && (
                    <div>
                      <p className="text-xs font-semibold text-foreground/70 mb-2">What's Included</p>
                      <ul className="space-y-1">
                        {p.what_we_cover.map((item, idx) => (
                          <li key={idx} className="text-xs text-muted-foreground flex items-center gap-2">
                            <span className="text-green-400">✓</span>{item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {p.what_they_leave_with && p.what_they_leave_with.length > 0 && (
                    <div>
                      <p className="text-xs font-semibold text-foreground/70 mb-2">What They Leave With</p>
                      <ul className="space-y-1">
                        {p.what_they_leave_with.map((item, idx) => (
                          <li key={idx} className="text-xs text-muted-foreground flex items-center gap-2">
                            <span className="text-primary">→</span>{item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {(!p.what_we_cover || p.what_we_cover.length === 0) && (!p.what_they_leave_with || p.what_they_leave_with.length === 0) && (
                    <p className="text-xs text-muted-foreground/50 italic">No inclusions or outcomes added yet. Click edit to add them.</p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}