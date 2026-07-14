import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Plus, Edit2, Trash2, Save, X, Mail, Phone, Globe, Star, DollarSign, User } from 'lucide-react';
import { Button } from '@/components/ui/button';

const STATUS_LABELS = {
  researching: 'Researching', contacted: 'Contacted', quoted: 'Quoted',
  shortlisted: 'Shortlisted', selected: 'Selected', passed: 'Passed',
};
const STATUS_COLORS = {
  researching: 'bg-muted text-muted-foreground', contacted: 'bg-blue-500/15 text-blue-400',
  quoted: 'bg-yellow-500/15 text-yellow-400', shortlisted: 'bg-purple-500/15 text-purple-400',
  selected: 'bg-green-500/15 text-green-400', passed: 'bg-red-500/15 text-red-400',
};

const empty = {
  name: '', email: '', phone: '', website: '', instagram: '', specialty: '', credits: '',
  price_quote: '', price_currency: 'AUD', price_notes: '', rating: '', status: 'researching',
  notes: '', contacted_date: '', quoted_date: '',
};

export default function ProducerDirectory() {
  const qc = useQueryClient();
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(empty);
  const [filter, setFilter] = useState('all');

  const { data: producers = [] } = useQuery({
    queryKey: ['producerContacts'],
    queryFn: () => base44.entities.ProducerContact.list('-created_date'),
  });

  const createMut = useMutation({
    mutationFn: (d) => base44.entities.ProducerContact.create(d),
    onSuccess: () => { qc.invalidateQueries(['producerContacts']); setEditing(null); },
  });
  const updateMut = useMutation({
    mutationFn: ({ id, data }) => base44.entities.ProducerContact.update(id, data),
    onSuccess: () => { qc.invalidateQueries(['producerContacts']); setEditing(null); },
  });
  const deleteMut = useMutation({
    mutationFn: (id) => base44.entities.ProducerContact.delete(id),
    onSuccess: () => qc.invalidateQueries(['producerContacts']),
  });

  const filtered = filter === 'all' ? producers : producers.filter(p => p.status === filter);

  const handleNew = () => { setEditing({}); setForm(empty); };
  const handleEdit = (p) => { setEditing(p); setForm({ ...empty, ...p, price_quote: p.price_quote || '', rating: p.rating || '' }); };
  const handleSave = () => {
    if (!form.name) return;
    const payload = {
      ...form,
      price_quote: form.price_quote ? Number(form.price_quote) : null,
      rating: form.rating ? Number(form.rating) : null,
    };
    if (editing?.id) updateMut.mutate({ id: editing.id, data: payload });
    else createMut.mutate(payload);
  };

  const avgQuote = producers.filter(p => p.price_quote).length > 0
    ? Math.round(producers.filter(p => p.price_quote).reduce((s, p) => s + p.price_quote, 0) / producers.filter(p => p.price_quote).length)
    : 0;

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <p className="font-body text-[10px] tracking-[0.25em] uppercase text-primary mb-1">Admin · Producer Directory</p>
          <h1 className="font-display text-3xl text-foreground">Producer Directory</h1>
          <p className="font-body text-xs text-muted-foreground mt-1">Save notes, contacts, and price quotes to help select the right producer.</p>
        </div>
        <Button onClick={handleNew} className="gap-2"><Plus className="w-4 h-4" /> Add Producer</Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="border border-border/40 rounded-xl px-4 py-3 bg-card/30"><p className="text-[10px] uppercase text-muted-foreground">Total</p><p className="text-xl font-semibold">{producers.length}</p></div>
        <div className="border border-border/40 rounded-xl px-4 py-3 bg-card/30"><p className="text-[10px] uppercase text-muted-foreground">Shortlisted</p><p className="text-xl font-semibold text-purple-400">{producers.filter(p => p.status === 'shortlisted' || p.status === 'selected').length}</p></div>
        <div className="border border-border/40 rounded-xl px-4 py-3 bg-card/30"><p className="text-[10px] uppercase text-muted-foreground">Quoted</p><p className="text-xl font-semibold text-yellow-400">{producers.filter(p => p.price_quote).length}</p></div>
        <div className="border border-border/40 rounded-xl px-4 py-3 bg-card/30"><p className="text-[10px] uppercase text-muted-foreground">Avg Quote</p><p className="text-xl font-semibold">${avgQuote}</p></div>
      </div>

      <div className="flex gap-1 flex-wrap">
        <button onClick={() => setFilter('all')} className={`px-3 py-1.5 rounded-lg text-xs ${filter === 'all' ? 'bg-primary/15 text-primary border border-primary/30' : 'text-muted-foreground border border-transparent'}`}>All ({producers.length})</button>
        {Object.entries(STATUS_LABELS).map(([k, v]) => (
          <button key={k} onClick={() => setFilter(k)} className={`px-3 py-1.5 rounded-lg text-xs ${filter === k ? 'bg-primary/15 text-primary border border-primary/30' : 'text-muted-foreground border border-transparent'}`}>{v} ({producers.filter(p => p.status === k).length})</button>
        ))}
      </div>

      {editing && (
        <div className="bg-card border border-border rounded-xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-body text-sm font-semibold">{editing.id ? 'Edit Producer' : 'New Producer'}</h2>
            <button onClick={() => setEditing(null)} className="text-muted-foreground hover:text-foreground"><X className="w-4 h-4" /></button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Name *" className="bg-background border border-border rounded-lg px-3 py-2 text-sm" />
            <input value={form.specialty} onChange={e => setForm({ ...form, specialty: e.target.value })} placeholder="Specialty (pop, hip-hop, cinematic)" className="bg-background border border-border rounded-lg px-3 py-2 text-sm" />
            <input value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="Email" className="bg-background border border-border rounded-lg px-3 py-2 text-sm" />
            <input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="Phone" className="bg-background border border-border rounded-lg px-3 py-2 text-sm" />
            <input value={form.website} onChange={e => setForm({ ...form, website: e.target.value })} placeholder="Website / portfolio" className="bg-background border border-border rounded-lg px-3 py-2 text-sm" />
            <input value={form.instagram} onChange={e => setForm({ ...form, instagram: e.target.value })} placeholder="Instagram" className="bg-background border border-border rounded-lg px-3 py-2 text-sm" />
            <input value={form.price_quote} onChange={e => setForm({ ...form, price_quote: e.target.value })} placeholder="Price quote" type="number" className="bg-background border border-border rounded-lg px-3 py-2 text-sm" />
            <select value={form.price_currency} onChange={e => setForm({ ...form, price_currency: e.target.value })} className="bg-background border border-border rounded-lg px-3 py-2 text-sm">
              <option value="AUD">AUD</option><option value="USD">USD</option><option value="EUR">EUR</option><option value="GBP">GBP</option>
            </select>
            <input value={form.rating} onChange={e => setForm({ ...form, rating: e.target.value })} placeholder="Rating 1-5" type="number" min="1" max="5" className="bg-background border border-border rounded-lg px-3 py-2 text-sm" />
            <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} className="bg-background border border-border rounded-lg px-3 py-2 text-sm">
              {Object.entries(STATUS_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select>
            <input value={form.contacted_date} onChange={e => setForm({ ...form, contacted_date: e.target.value })} type="date" className="bg-background border border-border rounded-lg px-3 py-2 text-sm" />
            <input value={form.quoted_date} onChange={e => setForm({ ...form, quoted_date: e.target.value })} type="date" className="bg-background border border-border rounded-lg px-3 py-2 text-sm" />
          </div>
          <textarea value={form.credits} onChange={e => setForm({ ...form, credits: e.target.value })} placeholder="Notable credits / past work" rows={2} className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm" />
          <textarea value={form.price_notes} onChange={e => setForm({ ...form, price_notes: e.target.value })} placeholder="Price details (per track, per day, includes mix...)" rows={2} className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm" />
          <textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} placeholder="General notes, impressions" rows={3} className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm" />
          <Button onClick={handleSave} className="gap-2"><Save className="w-4 h-4" /> Save</Button>
        </div>
      )}

      <div className="space-y-3">
        {filtered.length === 0 && !editing && <p className="text-center text-muted-foreground py-12 text-sm">No producers found.</p>}
        {filtered.map(p => (
          <div key={p.id} className="bg-card/50 border border-border/40 rounded-xl p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <User className="w-4 h-4 text-primary" />
                  <h3 className="font-display text-lg text-foreground">{p.name}</h3>
                  <span className={`px-2 py-0.5 rounded text-[9px] uppercase tracking-wide font-medium ${STATUS_COLORS[p.status]}`}>{STATUS_LABELS[p.status]}</span>
                  {p.rating && (
                    <span className="flex items-center gap-0.5 text-[10px] text-yellow-400">
                      {Array.from({ length: 5 }).map((_, i) => <Star key={i} className={`w-3 h-3 ${i < p.rating ? 'fill-current' : 'opacity-30'}`} />)}
                    </span>
                  )}
                </div>
                {p.specialty && <p className="text-xs text-primary/60 mt-0.5">{p.specialty}</p>}
                <div className="flex gap-3 mt-2 text-xs text-muted-foreground/60 flex-wrap">
                  {p.email && <a href={`mailto:${p.email}`} className="flex items-center gap-1 hover:text-primary"><Mail className="w-3 h-3" />{p.email}</a>}
                  {p.phone && <span className="flex items-center gap-1"><Phone className="w-3 h-3" />{p.phone}</span>}
                  {p.website && <a href={p.website} target="_blank" rel="noreferrer" className="flex items-center gap-1 hover:text-primary"><Globe className="w-3 h-3" />{p.website.replace(/^https?:\/\//, '').slice(0, 30)}</a>}
                </div>
                {p.price_quote && (
                  <p className="text-xs text-green-400 mt-2 flex items-center gap-1"><DollarSign className="w-3 h-3" />{p.price_currency} {p.price_quote.toLocaleString()}{p.price_notes && ` — ${p.price_notes}`}</p>
                )}
                {p.credits && <p className="text-[11px] text-muted-foreground/50 mt-1 line-clamp-2">{p.credits}</p>}
                {p.notes && <p className="text-[11px] text-muted-foreground/40 mt-1 italic line-clamp-2">{p.notes}</p>}
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