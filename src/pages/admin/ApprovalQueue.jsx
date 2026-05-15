import { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, XCircle, Edit, Clock, AlertTriangle, ChevronDown, ChevronUp, Send, Archive, Zap } from 'lucide-react';
import { toast } from 'sonner';

const RISK_COLORS = { low: 'bg-yellow-500/10 text-yellow-400', medium: 'bg-orange-500/10 text-orange-400', high: 'bg-red-500/10 text-red-400', critical: 'bg-red-700/20 text-red-300' };

export default function ApprovalQueue() {
  const [expanded, setExpanded] = useState(null);
  const [editNote, setEditNote] = useState('');
  const [statusFilter, setStatusFilter] = useState('pending');
  const qc = useQueryClient();

  const { data: items = [] } = useQuery({
    queryKey: ['approval-queue', statusFilter],
    queryFn: () => statusFilter === 'all'
      ? base44.entities.ApprovalQueue.list('-created_date', 50)
      : base44.entities.ApprovalQueue.filter({ status: statusFilter }, '-created_date', 50),
  });

  const decide = useMutation({
    mutationFn: ({ id, status, note }) => base44.entities.ApprovalQueue.update(id, {
      status,
      decision_note: note,
      decided_by: 'Gannon Waye',
      decided_at: new Date().toISOString(),
    }),
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: ['approval-queue'] });
      toast.success(`Action ${vars.status}`);
      setExpanded(null);
    },
  });

  const STATUSES = ['pending','approved','rejected','archived','all'];

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold gradient-gold-text">Approval Queue</h1>
        <p className="text-muted-foreground text-sm">Actions requiring your decision — Do-Not-Spend-Or-Lose Rule enforced</p>
      </div>

      <div className="flex gap-2 flex-wrap">
        {STATUSES.map(s => (
          <button key={s} onClick={() => setStatusFilter(s)}
            className={`px-3 py-1 rounded-full text-xs font-medium border transition-all capitalize ${statusFilter === s ? 'bg-primary text-primary-foreground border-primary' : 'border-border text-muted-foreground hover:border-primary/40'}`}>
            {s}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {items.map(item => (
          <Card key={item.id} className={`border ${item.status === 'pending' ? 'border-yellow-500/30' : 'border-border'}`}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between cursor-pointer" onClick={() => setExpanded(expanded === item.id ? null : item.id)}>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge className={`text-xs ${RISK_COLORS[item.risk_level]}`}>{item.risk_level} risk</Badge>
                    {item.risk_type?.map(r => <Badge key={r} className="text-xs bg-secondary text-secondary-foreground">{r}</Badge>)}
                  </div>
                  <p className="font-semibold text-sm">{item.action_title}</p>
                  <p className="text-xs text-muted-foreground">{item.agent_name}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={item.status === 'pending' ? 'bg-yellow-500/10 text-yellow-400' : item.status === 'approved' ? 'bg-green-500/10 text-green-400' : 'bg-slate-500/10 text-slate-400'}>
                    {item.status}
                  </Badge>
                  {expanded === item.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </div>
              </div>

              {expanded === item.id && (
                <div className="mt-4 space-y-3 border-t border-border pt-4">
                  <p className="text-sm text-foreground">{item.action_description}</p>
                  {item.proposed_output && (
                    <div className="bg-secondary rounded-lg p-3">
                      <p className="text-xs text-muted-foreground mb-1">Proposed Output:</p>
                      <p className="text-sm">{item.proposed_output}</p>
                    </div>
                  )}
                  {item.status === 'pending' && (
                    <>
                      <Textarea
                        placeholder="Add a note (optional)..."
                        value={editNote}
                        onChange={e => setEditNote(e.target.value)}
                        className="text-sm"
                        rows={2}
                      />
                      <div className="flex flex-wrap gap-2">
                        <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white" onClick={() => decide.mutate({ id: item.id, status: 'approved', note: editNote })}>
                          <CheckCircle2 className="w-3 h-3 mr-1" /> Approve
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => decide.mutate({ id: item.id, status: 'rejected', note: editNote })}>
                          <XCircle className="w-3 h-3 mr-1" /> Reject
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => decide.mutate({ id: item.id, status: 'archived', note: editNote })}>
                          <Archive className="w-3 h-3 mr-1" /> Archive
                        </Button>
                        {item.escalate_to_professional && (
                          <Button size="sm" variant="outline" className="border-orange-500/30 text-orange-400">
                            Escalate to Professional
                          </Button>
                        )}
                      </div>
                    </>
                  )}
                  {item.decision_note && (
                    <p className="text-xs text-muted-foreground">Note: {item.decision_note}</p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
        {items.length === 0 && <p className="text-center text-muted-foreground py-12">No items in queue.</p>}
      </div>
    </div>
  );
}