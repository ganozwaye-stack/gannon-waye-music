import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus } from 'lucide-react';

// Lifted from src/pages/admin/CoachingClients.jsx — CoachingClient + CoachingSession
// management, active-client count, session progress and notes.
export default function CoachingClientsTab() {
  const qc = useQueryClient();
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ full_name: '', email: '', offer_enrolled: '', sessions_total: 4 });

  const { data: clients = [] } = useQuery({
    queryKey: ['coaching-clients'],
    queryFn: () => base44.entities.CoachingClient.list('-created_date'),
  });

  const { data: sessions = [] } = useQuery({
    queryKey: ['coaching-sessions'],
    queryFn: () => base44.entities.CoachingSession.list('-session_date'),
  });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.CoachingClient.create(data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['coaching-clients'] }); setShowAdd(false); setForm({ full_name: '', email: '', offer_enrolled: '', sessions_total: 4 }); },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.CoachingClient.update(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['coaching-clients'] }),
  });

  const getClientSessions = (clientId) => sessions.filter(s => s.client_id === clientId);

  return (
    <div className="space-y-6 pb-10">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="font-display text-xl text-foreground">Active Clients &amp; Sessions</h2>
          <p className="font-body text-xs text-muted-foreground mt-1">{clients.filter(c => c.status === 'active').length} active</p>
        </div>
        <Button type="button" onClick={() => setShowAdd(!showAdd)} className="gradient-gold-button border-0 rounded-full gap-2 font-body text-xs">
          <Plus className="w-3.5 h-3.5" /> Add Client
        </Button>
      </div>

      {showAdd && (
        <form onSubmit={e => { e.preventDefault(); createMutation.mutate(form); }} className="bg-card/50 border border-border/40 rounded-xl p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input placeholder="Full name" value={form.full_name} onChange={e => setForm(f => ({ ...f, full_name: e.target.value }))} required className="bg-card/70 border-border/60 text-sm" />
          <Input type="email" placeholder="Email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required className="bg-card/70 border-border/60 text-sm" />
          <Input placeholder="Offer enrolled" value={form.offer_enrolled} onChange={e => setForm(f => ({ ...f, offer_enrolled: e.target.value }))} className="bg-card/70 border-border/60 text-sm" />
          <Input type="number" placeholder="Sessions total" value={form.sessions_total} onChange={e => setForm(f => ({ ...f, sessions_total: Number(e.target.value) }))} className="bg-card/70 border-border/60 text-sm" />
          <div className="sm:col-span-2 flex gap-2 justify-end">
            <Button type="button" variant="ghost" onClick={() => setShowAdd(false)} className="text-xs">Cancel</Button>
            <Button type="submit" className="gradient-gold-button border-0 rounded-full text-xs">Add Client</Button>
          </div>
        </form>
      )}

      <div className="space-y-4">
        {clients.map(client => {
          const cs = getClientSessions(client.id);
          const completed = cs.filter(s => s.status === 'completed').length;
          const notes = cs.filter(s => s.session_notes);
          return (
            <div key={client.id} className="bg-card/50 border border-border/40 rounded-xl p-5">
              <div className="flex items-start justify-between flex-wrap gap-3 mb-3">
                <div>
                  <p className="font-body text-sm font-semibold text-foreground">{client.full_name}</p>
                  <p className="font-body text-xs text-muted-foreground">{client.email}</p>
                  {client.offer_enrolled && <p className="font-body text-[10px] text-primary/60 mt-0.5">{client.offer_enrolled}</p>}
                </div>
                <Select value={client.status} onValueChange={v => updateMutation.mutate({ id: client.id, data: { status: v } })}>
                  <SelectTrigger className="w-28 h-7 text-xs bg-secondary/50 border-border/40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {['active', 'paused', 'completed', 'cancelled'].map(s => (
                      <SelectItem key={s} value={s}>{s}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-6">
                <div>
                  <p className="font-body text-[9px] uppercase tracking-widest text-muted-foreground/50">Sessions</p>
                  <p className="font-body text-sm font-semibold text-foreground">{completed} / {client.sessions_total || '∞'}</p>
                </div>
                {client.testimonial_given && (
                  <div>
                    <p className="font-body text-[9px] uppercase tracking-widest text-muted-foreground/50">Testimonial</p>
                    <p className="font-body text-xs text-green-400">{client.testimonial_approved ? 'Approved' : 'Pending approval'}</p>
                  </div>
                )}
              </div>

              {/* Progress log and session notes for this client */}
              {cs.length > 0 && (
                <div className="mt-4 border-t border-border/30 pt-3 space-y-2">
                  <p className="font-body text-[9px] uppercase tracking-widest text-muted-foreground/50">Session log ({cs.length})</p>
                  {cs.map(s => (
                    <div key={s.id} className="bg-background/30 border border-border/30 rounded-lg p-3">
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <p className="font-body text-xs text-foreground/80">
                          {s.session_date ? new Date(s.session_date).toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Date TBC'}
                          {s.session_number ? ` · Session ${s.session_number}` : ''}
                        </p>
                        <span className="font-body text-[9px] tracking-widest uppercase text-muted-foreground/50 border border-border/30 rounded-full px-2 py-0.5">{s.status}</span>
                      </div>
                      {s.session_notes && <p className="font-body text-xs text-muted-foreground mt-1.5 whitespace-pre-line">{s.session_notes}</p>}
                      {s.client_progress_note && (
                        <p className="font-body text-xs text-primary/70 mt-1.5">Progress: {s.client_progress_note}</p>
                      )}
                    </div>
                  ))}
                  {notes.length === 0 && (
                    <p className="font-body text-[11px] text-muted-foreground/40 italic">No session notes recorded yet.</p>
                  )}
                </div>
              )}
            </div>
          );
        })}
        {clients.length === 0 && (
          <div className="text-center py-16 text-muted-foreground font-body text-sm">No clients yet.</div>
        )}
      </div>
    </div>
  );
}