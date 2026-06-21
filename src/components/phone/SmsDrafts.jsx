import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { MessageSquare, AlertTriangle, Edit2, Save, X } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

const TYPE_LABELS = {
  missed_call_reply: 'Missed Call Reply',
  coaching_enquiry: 'Coaching Enquiry',
  merch_support: 'Merch Support',
  press_enquiry: 'Press Enquiry',
  ganozmix_enquiry: 'GanozMix Enquiry',
  general: 'General',
  custom: 'Custom',
};

export default function SmsDrafts() {
  const [editingId, setEditingId] = useState(null);
  const [editBody, setEditBody] = useState('');
  const qc = useQueryClient();

  const { data: drafts = [] } = useQuery({
    queryKey: ['smsDrafts'],
    queryFn: () => base44.entities.SmsDraft.list(),
  });

  const update = useMutation({
    mutationFn: ({ id, data }) => base44.entities.SmsDraft.update(id, data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['smsDrafts'] }); setEditingId(null); },
  });

  return (
    <div className="space-y-5">
      <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 flex items-start gap-3">
        <AlertTriangle className="w-4 h-4 text-yellow-400 shrink-0 mt-0.5" />
        <div>
          <p className="font-body text-xs font-semibold text-yellow-300">Draft Only — No SMS Will Be Sent</p>
          <p className="font-body text-xs text-yellow-200/60 mt-0.5">
            These are message templates for when the phone provider is active. No automatic SMS, no bulk SMS, no unsolicited contact.
            Every send requires your manual approval.
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {drafts.map(draft => (
          <div key={draft.id} className="bg-card/60 border border-border/40 rounded-2xl p-5">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-primary/50" />
                <div>
                  <p className="font-body text-sm font-semibold text-foreground">{draft.template_name}</p>
                  <p className="font-body text-[10px] uppercase tracking-wider text-muted-foreground">{TYPE_LABELS[draft.template_type] || draft.template_type}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-body text-[9px] uppercase tracking-wider text-yellow-400 bg-yellow-500/10 border border-yellow-500/30 rounded-full px-2.5 py-1">
                  DRAFT
                </span>
                {editingId !== draft.id && (
                  <Button size="sm" variant="ghost" className="h-7 w-7 p-0" onClick={() => { setEditingId(draft.id); setEditBody(draft.body); }}>
                    <Edit2 className="w-3 h-3" />
                  </Button>
                )}
              </div>
            </div>

            {editingId === draft.id ? (
              <div className="space-y-3">
                <textarea value={editBody} onChange={e => setEditBody(e.target.value)}
                  className="w-full bg-secondary/50 border border-border/60 rounded-lg px-3 py-2 font-body text-sm text-foreground focus:outline-none min-h-[80px]" />
                <div className="flex gap-2">
                  <Button size="sm" onClick={() => update.mutate({ id: draft.id, data: { body: editBody } })} className="gap-1.5 text-xs">
                    <Save className="w-3 h-3" /> Save
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => setEditingId(null)} className="text-xs gap-1.5">
                    <X className="w-3 h-3" /> Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div className="bg-secondary/30 rounded-lg p-3">
                <p className="font-body text-sm text-foreground/70 leading-relaxed whitespace-pre-wrap">{draft.body}</p>
                <p className="font-body text-[10px] text-muted-foreground/40 mt-2">{draft.body.length} characters</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}