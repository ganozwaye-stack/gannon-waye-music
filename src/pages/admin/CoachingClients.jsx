import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus } from 'lucide-react';

export default function CoachingClients() {
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
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="font-body text-[10px] tracking-[0.25em] uppercase text-primary mb-1">Admin</p>
          <h1 className="font-display text-2xl text-foreground">Coaching Clients</h1>
          <p className="font-body text-xs text-muted-foreground mt-1">{clients.filter(c => c.status === 'active').length} active</p>
        </div>
        <Button onClick={() => setShowAdd(!showAdd)} className="gradient-gold-button border-0 rounded-full gap-2 font-body text-xs">
          <Plus className="w-3.5 h-3.5" /> Add Client
        </Button>
      </div>

      {showAdd && (
        <form onSubmit={e => { e.preventDefault(); createMutation.mutate(form); }} className="bg-card/50 border border-border/40 rounded-xl p-5 mb-6 grid grid-cols-2 gap-4">
          <Input placeholder="Full name" value={form.full_name} onChange={e => setForm(f => ({ ...f, full_name: e.target.value }))} required className="bg-card/70 border-border/60 text-sm" />
          <Input type="email" placeholder="Email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required className="bg-card/70 border-border/60 text-sm" />
          <Input placeholder="Offer enrolled" value={form.offer_enrolled} onChange={e => setForm(f => ({ ...f, offer_enrolled: e.target.value }))} className="bg-card/70 border-border/60 text-sm" />
          <Input type="number" placeholder="Sessions total" value={form.sessions_total} onChange={e => setForm(f => ({ ...f, sessions_total: Number(e.target.value) }))} className="bg-card/70 border-border/60 text-sm" />
          <div className="col-span-2 flex gap-2 justify-end">
            <Button type="button" variant="ghost" onClick={() => setShowAdd(false)} className="text-xs">Cancel</Button>
            <Button type="submit" className="gradient-gold-button border-0 rounded-full text-xs">Add Client</Button>
          </div>
        </form>
      )}

      <div className="space-y-4">
        {clients.map(client => {
          const cs = getClientSessions(client.id);
          const completed = cs.filter(s => s.status === 'completed').length;
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