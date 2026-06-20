import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CheckCircle, AlertCircle } from 'lucide-react';

const STATUS_COLORS = {
  submitted: 'text-blue-400',
  reviewed: 'text-yellow-400',
  approved: 'text-green-400',
  waitlisted: 'text-orange-400',
  declined: 'text-red-400',
};

export default function CoachingIntakes() {
  const qc = useQueryClient();
  const [filter, setFilter] = useState('all');

  const { data: intakes = [] } = useQuery({
    queryKey: ['coaching-intakes'],
    queryFn: () => base44.entities.CoachingIntake.list('-created_date'),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.CoachingIntake.update(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['coaching-intakes'] }),
  });

  const filtered = filter === 'all' ? intakes : intakes.filter(i => i.status === filter);
  const newCount = intakes.filter(i => i.status === 'submitted').length;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <p className="font-body text-[10px] tracking-[0.25em] uppercase text-primary mb-1">Admin</p>
          <h1 className="font-display text-2xl text-foreground">Coaching Intakes</h1>
          {newCount > 0 && <p className="font-body text-xs text-yellow-400 mt-1">{newCount} new submission{newCount !== 1 ? 's' : ''}</p>}
        </div>
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-40 bg-card/50 border-border/60 text-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {['all', 'submitted', 'reviewed', 'approved', 'waitlisted', 'declined'].map(s => (
              <SelectItem key={s} value={s}>{s === 'all' ? 'All' : s}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-4">
        {filtered.map(intake => (
          <div key={intake.id} className="bg-card/50 border border-border/40 rounded-xl p-5 space-y-3">
            <div className="flex items-start justify-between flex-wrap gap-3">
              <div>
                <p className="font-body text-sm font-semibold text-foreground">{intake.full_name}</p>
                <p className="font-body text-xs text-muted-foreground">{intake.email}</p>
                {intake.offer_interest && <p className="font-body text-[10px] text-primary/60 mt-0.5">Interest: {intake.offer_interest}</p>}
              </div>
              <div className="flex items-center gap-3">
                <span className={`font-body text-xs font-semibold ${STATUS_COLORS[intake.status] || ''}`}>{intake.status}</span>
                <Select value={intake.status} onValueChange={v => updateMutation.mutate({ id: intake.id, data: { status: v } })}>
                  <SelectTrigger className="w-32 h-7 text-xs bg-secondary/50 border-border/40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {['submitted', 'reviewed', 'approved', 'waitlisted', 'declined'].map(s => (
                      <SelectItem key={s} value={s}>{s}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {intake.goal && (
                <div>
                  <p className="font-body text-[9px] uppercase tracking-widest text-muted-foreground/50 mb-0.5">Goal</p>
                  <p className="font-body text-xs text-foreground/70">{intake.goal}</p>
                </div>
              )}
              {intake.current_challenge && (
                <div>
                  <p className="font-body text-[9px] uppercase tracking-widest text-muted-foreground/50 mb-0.5">Challenge</p>
                  <p className="font-body text-xs text-foreground/70">{intake.current_challenge}</p>
                </div>
              )}
              {intake.support_wanted && (
                <div className="sm:col-span-2">
                  <p className="font-body text-[9px] uppercase tracking-widest text-muted-foreground/50 mb-0.5">Support wanted</p>
                  <p className="font-body text-xs text-foreground/70">{intake.support_wanted}</p>
                </div>
              )}
            </div>

            <div className="flex gap-4 flex-wrap">
              {intake.understands_coaching_not_therapy && (
                <div className="flex items-center gap-1 text-green-500"><CheckCircle className="w-3 h-3" /><span className="font-body text-[10px]">Understands coaching ≠ therapy</span></div>
              )}
              {intake.consent_to_contact && (
                <div className="flex items-center gap-1 text-green-500"><CheckCircle className="w-3 h-3" /><span className="font-body text-[10px]">Consented to contact</span></div>
              )}
              {!intake.understands_coaching_not_therapy && (
                <div className="flex items-center gap-1 text-red-400"><AlertCircle className="w-3 h-3" /><span className="font-body text-[10px]">Did not confirm coaching ≠ therapy</span></div>
              )}
            </div>

            <p className="font-body text-[10px] text-muted-foreground/40">
              Submitted: {new Date(intake.created_date).toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="text-center py-16 text-muted-foreground font-body text-sm">No intakes found.</div>
        )}
      </div>
    </div>
  );
}