import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { CheckCircle2, Clock, Ban, Circle } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

// The 13-phase Master Handover distribution timeline. Phases are tracked on the
// MasterHandoverPhase entity, so progress persists and can be updated in place.
const STATUS_META = {
  not_started: { label: 'Not started', icon: Circle, cls: 'text-muted-foreground' },
  in_progress: { label: 'In progress', icon: Clock, cls: 'text-primary' },
  blocked: { label: 'Blocked', icon: Ban, cls: 'text-destructive' },
  done: { label: 'Done', icon: CheckCircle2, cls: 'text-primary' },
};

const NEXT_STATUS = {
  not_started: 'in_progress',
  in_progress: 'done',
  done: 'not_started',
};

function PhaseDetailPanel({ phase, onSave, saving }) {
  const [title, setTitle] = useState(phase.title || '');
  const [notes, setNotes] = useState(phase.notes || '');
  const [dueDate, setDueDate] = useState(phase.due_date || '');
  const [status, setStatus] = useState(phase.status || 'not_started');

  useEffect(() => {
    setTitle(phase.title || '');
    setNotes(phase.notes || '');
    setDueDate(phase.due_date || '');
    setStatus(phase.status || 'not_started');
  }, [phase.id]);

  return (
    <div className="rounded-2xl border border-border/40 bg-card/60 p-5">
      <p className="font-body text-[10px] uppercase tracking-[0.3em] gradient-gold-glow mb-3">
        Phase {phase.phase_number} of 13
      </p>
      <label className="block font-body text-xs uppercase tracking-widest text-muted-foreground mb-1.5">Title</label>
      <Input value={title} onChange={(e) => setTitle(e.target.value)} className="mb-4 bg-background/60" />

      <label className="block font-body text-xs uppercase tracking-widest text-muted-foreground mb-1.5">Status</label>
      <div className="flex flex-wrap gap-2 mb-4">
        {Object.entries(STATUS_META).map(([value, meta]) => (
          <button
            key={value}
            type="button"
            onClick={() => setStatus(value)}
            className={`px-3 py-1.5 rounded-full border font-body text-[10px] uppercase tracking-widest transition-all ${
              status === value
                ? 'border-primary/70 bg-primary/10 text-primary'
                : 'border-border/50 text-muted-foreground hover:text-foreground'
            }`}>
            {meta.label}
          </button>
        ))}
      </div>

      <label className="block font-body text-xs uppercase tracking-widest text-muted-foreground mb-1.5">Target date</label>
      <Input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className="mb-4 bg-background/60" />

      <label className="block font-body text-xs uppercase tracking-widest text-muted-foreground mb-1.5">Notes</label>
      <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={5} className="mb-4 bg-background/60" />

      <Button
        type="button"
        disabled={saving}
        onClick={() => onSave(phase.id, { title, notes, due_date: dueDate, status })}
        className="rounded-full gradient-gold-button border-0 font-body text-xs tracking-wider uppercase">
        {saving ? 'Saving' : 'Save Phase'}
      </Button>
    </div>
  );
}

export default function MasterHandoverTimeline() {
  const queryClient = useQueryClient();
  const [selectedId, setSelectedId] = useState(null);

  const { data: phases = [], isLoading } = useQuery({
    queryKey: ['master-handover-phases'],
    queryFn: () => base44.entities.MasterHandoverPhase.list(),
  });

  const saveMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.MasterHandoverPhase.update(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['master-handover-phases'] }),
  });

  const sorted = [...phases].sort((a, b) => (a.phase_number || 0) - (b.phase_number || 0));
  const selected = sorted.find((p) => p.id === selectedId) || sorted[0] || null;
  const doneCount = sorted.filter((p) => p.status === 'done').length;
  const pct = sorted.length ? Math.round((doneCount / sorted.length) * 100) : 0;

  return (
    <div className="p-4 md:p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <p className="font-body text-[10px] tracking-[0.3em] uppercase gradient-gold-glow mb-2">Distribution Process</p>
        <h1 className="font-display text-3xl text-foreground">Master Handover Timeline</h1>
        <p className="font-body text-sm text-muted-foreground mt-2 max-w-2xl leading-relaxed">
          The 13 phases of the Master Handover distribution process. Click a phase to review and edit it, and tap its status chip to move it forward.
        </p>
      </div>

      {/* Progress */}
      <div className="rounded-2xl border border-border/40 bg-card/60 p-5 mb-6">
        <div className="flex items-center justify-between mb-2.5">
          <p className="font-body text-sm text-foreground">{doneCount} of {sorted.length || 13} phases complete</p>
          <p className="font-body text-sm gradient-gold-text">{pct}%</p>
        </div>
        <div className="h-2 rounded-full bg-secondary/60 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.6 }}
            className="h-full rounded-full"
            style={{ background: 'linear-gradient(90deg, #a9842c, #d4af37 50%, #f0e6c8)' }} />
        </div>
      </div>

      {isLoading ? (
        <p className="font-body text-xs tracking-widest uppercase text-muted-foreground">Loading phases...</p>
      ) : sorted.length === 0 ? (
        <p className="font-body text-sm text-muted-foreground">No phases recorded yet.</p>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-6 items-start">
          {/* Timeline list */}
          <div className="space-y-3">
            {sorted.map((phase) => {
              const meta = STATUS_META[phase.status] || STATUS_META.not_started;
              const Icon = meta.icon;
              const isSelected = selected?.id === phase.id;
              return (
                <div
                  key={phase.id}
                  className={`rounded-2xl border p-4 transition-all ${
                    isSelected ? 'border-primary/50 bg-primary/5' : 'border-border/40 bg-card/60 hover:border-primary/30'
                  }`}>
                  <div className="flex items-start gap-3">
                    <button
                      type="button"
                      onClick={() => saveMutation.mutate({ id: phase.id, data: { status: NEXT_STATUS[phase.status] || 'not_started' } })}
                      aria-label={`Advance phase ${phase.phase_number} status`}
                      className="mt-0.5 shrink-0">
                      <Icon className={`w-5 h-5 ${meta.cls}`} />
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedId(phase.id)}
                      className="flex-1 text-left min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-body text-[10px] tracking-[0.25em] uppercase text-muted-foreground">
                          Phase {phase.phase_number}
                        </p>
                        <Badge variant={phase.status === 'done' ? 'default' : phase.status === 'blocked' ? 'destructive' : 'secondary'}>
                          {meta.label}
                        </Badge>
                      </div>
                      <p className="font-display text-base text-foreground mt-1">{phase.title}</p>
                      {phase.description && (
                        <p className="font-body text-xs text-muted-foreground mt-1 leading-relaxed">{phase.description}</p>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Detail panel */}
          <div className="lg:sticky lg:top-4">
            {selected ? (
              <PhaseDetailPanel
                phase={selected}
                saving={saveMutation.isPending}
                onSave={(id, data) => saveMutation.mutate({ id, data })}
              />
            ) : (
              <p className="font-body text-sm text-muted-foreground">Select a phase to edit it.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}