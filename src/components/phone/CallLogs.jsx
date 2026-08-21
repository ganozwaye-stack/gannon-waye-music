import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Plus, Save, PhoneIncoming, PhoneOutgoing } from 'lucide-react';
import { Button } from '@/components/ui/button';

const OUTCOMES = ['no_answer','left_voicemail','spoke','callback_scheduled','converted','not_interested'];
const CALL_TYPES = ['answered','missed','voicemail','outbound_manual'];

const DIRECTION_ICON = {
  inbound: <PhoneIncoming className="w-3.5 h-3.5 text-green-400" />,
  outbound: <PhoneOutgoing className="w-3.5 h-3.5 text-blue-400" />,
};

const TYPE_COLOR = {
  answered: 'text-green-400',
  missed: 'text-red-400',
  voicemail: 'text-yellow-400',
  outbound_manual: 'text-blue-400',
};

export default function CallLogs({ callLogs, leads }) {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ direction: 'inbound', call_type: 'answered', call_date: new Date().toISOString().slice(0,16), duration_seconds: 0, outcome: 'spoke', notes: '', lead_id: '', entered_by: 'Gannon' });
  const qc = useQueryClient();
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const create = useMutation({
    mutationFn: (data) => base44.entities.CallLog.create(data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['callLogs'] }); setShowForm(false); },
  });

  const formatDuration = (secs) => {
    if (!secs) return '—';
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return m > 0 ? `${m}m ${s}s` : `${s}s`;
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <p className="font-body text-sm text-foreground font-semibold">
          {callLogs.length} Call Log{callLogs.length !== 1 ? 's' : ''}
        </p>
        <Button size="sm" onClick={() => setShowForm(!showForm)} className="gap-1.5 text-xs">
          <Plus className="w-3.5 h-3.5" /> Log a Call
        </Button>
      </div>

      {showForm && (
        <div className="bg-card/70 border border-primary/20 rounded-2xl p-5 space-y-4">
          <p className="font-body text-xs font-semibold text-primary uppercase tracking-wider">Log Call Manually</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <p className="font-body text-[10px] uppercase tracking-widest text-muted-foreground mb-1">Direction</p>
              <select value={form.direction} onChange={e => set('direction', e.target.value)}
                className="w-full bg-secondary/50 border border-border/60 rounded-lg px-3 py-2 font-body text-sm text-foreground focus:outline-none capitalize">
                <option value="inbound">Inbound</option>
                <option value="outbound">Outbound</option>
              </select>
            </div>
            <div>
              <p className="font-body text-[10px] uppercase tracking-widest text-muted-foreground mb-1">Call Type</p>
              <select value={form.call_type} onChange={e => set('call_type', e.target.value)}
                className="w-full bg-secondary/50 border border-border/60 rounded-lg px-3 py-2 font-body text-sm text-foreground focus:outline-none capitalize">
                {CALL_TYPES.map(t => <option key={t} value={t}>{t.replace(/_/g,' ')}</option>)}
              </select>
            </div>
            <div>
              <p className="font-body text-[10px] uppercase tracking-widest text-muted-foreground mb-1">Date & Time</p>
              <input type="datetime-local" value={form.call_date} onChange={e => set('call_date', e.target.value)}
                className="w-full bg-secondary/50 border border-border/60 rounded-lg px-3 py-2 font-body text-sm text-foreground focus:outline-none" />
            </div>
            <div>
              <p className="font-body text-[10px] uppercase tracking-widest text-muted-foreground mb-1">Duration (seconds)</p>
              <input type="number" value={form.duration_seconds} onChange={e => set('duration_seconds', parseInt(e.target.value) || 0)}
                className="w-full bg-secondary/50 border border-border/60 rounded-lg px-3 py-2 font-body text-sm text-foreground focus:outline-none" />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <p className="font-body text-[10px] uppercase tracking-widest text-muted-foreground mb-1">Outcome</p>
              <select value={form.outcome} onChange={e => set('outcome', e.target.value)}
                className="w-full bg-secondary/50 border border-border/60 rounded-lg px-3 py-2 font-body text-sm text-foreground focus:outline-none capitalize">
                {OUTCOMES.map(o => <option key={o} value={o}>{o.replace(/_/g,' ')}</option>)}
              </select>
            </div>
            <div>
              <p className="font-body text-[10px] uppercase tracking-widest text-muted-foreground mb-1">Link to Lead (optional)</p>
              <select value={form.lead_id} onChange={e => set('lead_id', e.target.value)}
                className="w-full bg-secondary/50 border border-border/60 rounded-lg px-3 py-2 font-body text-sm text-foreground focus:outline-none">
                <option value="">No lead linked</option>
                {leads.map(l => <option key={l.id} value={l.id}>{l.full_name}</option>)}
              </select>
            </div>
          </div>
          <textarea placeholder="Call notes..." value={form.notes} onChange={e => set('notes', e.target.value)}
            className="w-full bg-secondary/50 border border-border/60 rounded-lg px-3 py-2 font-body text-sm text-foreground focus:outline-none min-h-[60px]" />
          <div className="flex gap-2">
            <Button size="sm" onClick={() => create.mutate(form)} disabled={create.isPending} className="gap-1.5 text-xs">
              <Save className="w-3 h-3" /> {create.isPending ? 'Saving...' : 'Save Call'}
            </Button>
            <Button size="sm" variant="outline" onClick={() => setShowForm(false)} className="text-xs">Cancel</Button>
          </div>
        </div>
      )}

      {callLogs.length === 0 && !showForm && (
        <div className="text-center py-12 text-muted-foreground font-body text-sm">
          No call logs yet. Log calls manually until a provider is connected.
        </div>
      )}

      <div className="space-y-2">
        {callLogs.map(log => {
          const linkedLead = leads.find(l => l.id === log.lead_id);
          return (
            <div key={log.id} className="bg-card/50 border border-border/40 rounded-xl p-4 flex items-start gap-3">
              <div className="mt-0.5">{DIRECTION_ICON[log.direction]}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className={`font-body text-sm font-semibold capitalize ${TYPE_COLOR[log.call_type] || 'text-foreground'}`}>
                    {log.call_type?.replace(/_/g,' ')} call
                  </p>
                  {linkedLead && <span className="font-body text-xs text-muted-foreground">— {linkedLead.full_name}</span>}
                  <span className="font-body text-xs text-muted-foreground/50 capitalize">{log.outcome?.replace(/_/g,' ')}</span>
                </div>
                <div className="flex items-center gap-3 mt-0.5">
                  <p className="font-body text-xs text-muted-foreground/60">
                    {log.call_date ? new Date(log.call_date).toLocaleString('en-AU') : '—'}
                  </p>
                  <p className="font-body text-xs text-muted-foreground/50">{formatDuration(log.duration_seconds)}</p>
                </div>
                {log.notes && <p className="font-body text-xs text-foreground/50 mt-1 line-clamp-2">{log.notes}</p>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}