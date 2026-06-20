import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { RefreshCw, Eye, ChevronDown, ChevronUp, Send, CheckCircle, Clock, Filter } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';

const PILLAR_COLORS = {
  'Self Worth': 'text-rose-400 bg-rose-500/10 border-rose-500/20',
  'Boundaries': 'text-blue-400 bg-blue-500/10 border-blue-500/20',
  'Rebuilding': 'text-amber-400 bg-amber-500/10 border-amber-500/20',
  'Creative Confidence': 'text-purple-400 bg-purple-500/10 border-purple-500/20',
  'Music': 'text-teal-400 bg-teal-500/10 border-teal-500/20',
  'THANKYOU': 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20',
  'Respect Is Earned': 'text-orange-400 bg-orange-500/10 border-orange-500/20',
  'Still Here': 'text-green-400 bg-green-500/10 border-green-500/20',
  'Shame to Self Respect': 'text-pink-400 bg-pink-500/10 border-pink-500/20',
  'Practical Tools': 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
};

function DraftCard({ item, onApprove, onReject }) {
  const [expanded, setExpanded] = useState(false);
  const payload = item.payload || {};
  const pillar = payload.pillar || '';
  const pillarStyle = PILLAR_COLORS[pillar] || 'text-muted-foreground bg-secondary border-border';

  const statusColor = {
    pending: 'bg-yellow-500/10 text-yellow-400',
    approved: 'bg-green-500/10 text-green-400',
    rejected: 'bg-red-500/10 text-red-400',
    in_review: 'bg-cyan-500/10 text-cyan-400',
  }[item.status] || 'bg-secondary text-muted-foreground';

  return (
    <div className={`border rounded-xl overflow-hidden transition-all ${item.status === 'pending' ? 'border-yellow-500/30' : 'border-border/50'}`}>
      {/* Card header */}
      <div className="flex items-start gap-3 p-4 cursor-pointer" onClick={() => setExpanded(!expanded)}>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap gap-1.5 mb-1.5">
            <Badge className={`text-[9px] border ${pillarStyle}`}>{pillar || 'Coaching'}</Badge>
            <Badge className={`text-[9px] ${statusColor}`}>{item.status}</Badge>
            {payload.day && <Badge variant="outline" className="text-[9px]">Day {payload.day}</Badge>}
          </div>
          <p className="font-body text-sm font-semibold text-foreground leading-tight">{item.action_title}</p>
          {payload.hook && (
            <p className="font-display text-xs italic text-foreground/60 mt-1 leading-relaxed line-clamp-2">"{payload.hook}"</p>
          )}
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {item.status === 'pending' && <span className="w-2 h-2 rounded-full bg-yellow-400" />}
          {expanded ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
        </div>
      </div>

      {/* Expanded content */}
      {expanded && (
        <div className="border-t border-border/50 px-4 pb-4 pt-3 space-y-3">
          {[
            { label: 'Hook', value: payload.hook },
            { label: 'Reel Script', value: payload.script },
            { label: 'On-Screen Text', value: payload.on_screen_text },
            { label: 'Caption', value: payload.caption },
            { label: 'First Comment', value: payload.first_comment },
            { label: 'CTA', value: payload.cta },
            { label: 'Related Coaching Offer', value: payload.related_offer },
            { label: 'Related Workbook', value: payload.related_workbook },
            { label: 'Related Lyric / Song', value: payload.related_lyric },
          ].filter(f => f.value).map(field => (
            <div key={field.label}>
              <p className="font-body text-[9px] uppercase tracking-wider text-muted-foreground mb-1">{field.label}</p>
              <p className="font-body text-xs text-foreground/80 leading-relaxed bg-secondary/20 rounded-lg p-2.5">{field.value}</p>
            </div>
          ))}

          {item.status === 'pending' && (
            <div className="flex gap-2 pt-2">
              <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white gap-1 text-xs" onClick={() => onApprove(item.id)}>
                <CheckCircle className="w-3 h-3" /> Approve
              </Button>
              <Button size="sm" variant="destructive" className="gap-1 text-xs" onClick={() => onReject(item.id)}>
                Reject
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function CoachingSocialDrafts() {
  const qc = useQueryClient();
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPillar, setFilterPillar] = useState('all');

  const { data: allItems = [], refetch, isLoading } = useQuery({
    queryKey: ['coaching-social-drafts'],
    queryFn: () => base44.entities.ApprovalQueue.filter({ agent_name: 'coaching_content_engine' }, '-created_date', 60),
  });

  const decide = useMutation({
    mutationFn: ({ id, status }) => base44.entities.ApprovalQueue.update(id, {
      status,
      decided_by: 'Gannon Waye',
      decided_at: new Date().toISOString(),
    }),
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: ['coaching-social-drafts'] });
      toast.success(`Post ${vars.status}`);
    },
  });

  const coachingItems = allItems.filter(i => i.tags?.includes('coaching') || i.agent_name === 'coaching_content_engine');

  const pillars = ['all', ...new Set(coachingItems.map(i => i.payload?.pillar).filter(Boolean))];

  const filtered = coachingItems.filter(item => {
    const statusMatch = filterStatus === 'all' || item.status === filterStatus;
    const pillarMatch = filterPillar === 'all' || item.payload?.pillar === filterPillar;
    return statusMatch && pillarMatch;
  });

  const pending = coachingItems.filter(i => i.status === 'pending').length;
  const approved = coachingItems.filter(i => i.status === 'approved').length;

  return (
    <div className="max-w-4xl mx-auto pb-16">
      <div className="mb-6">
        <p className="font-body text-[10px] tracking-[0.25em] uppercase text-primary mb-1">Content Engine</p>
        <h1 className="font-display text-3xl text-foreground">30-Day Social Drafts</h1>
        <p className="font-body text-sm text-muted-foreground mt-1">Review and approve coaching social content before it goes anywhere</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-card/50 border border-border/40 rounded-xl p-4 text-center">
          <p className="font-display text-2xl text-yellow-400">{pending}</p>
          <p className="font-body text-[9px] uppercase tracking-widest text-muted-foreground mt-1">Pending</p>
        </div>
        <div className="bg-card/50 border border-border/40 rounded-xl p-4 text-center">
          <p className="font-display text-2xl text-green-400">{approved}</p>
          <p className="font-body text-[9px] uppercase tracking-widest text-muted-foreground mt-1">Approved</p>
        </div>
        <div className="bg-card/50 border border-border/40 rounded-xl p-4 text-center">
          <p className="font-display text-2xl text-foreground">{coachingItems.length}</p>
          <p className="font-body text-[9px] uppercase tracking-widest text-muted-foreground mt-1">Total Drafts</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap mb-5">
        <div className="flex gap-1.5">
          {['all', 'pending', 'approved', 'rejected'].map(s => (
            <button key={s} onClick={() => setFilterStatus(s)}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium border cursor-pointer transition-all ${filterStatus === s ? 'bg-primary text-primary-foreground border-primary' : 'border-border text-muted-foreground hover:border-primary/40'}`}>
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Pillar filter */}
      <div className="flex gap-1.5 flex-wrap mb-5">
        {pillars.map(p => (
          <button key={p} onClick={() => setFilterPillar(p)}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium border cursor-pointer transition-all ${filterPillar === p ? 'bg-secondary text-foreground border-primary/40' : 'border-border text-muted-foreground hover:border-primary/40'}`}>
            {p === 'all' ? 'All Pillars' : p}
          </button>
        ))}
      </div>

      <div className="flex justify-between items-center mb-4">
        <p className="font-body text-xs text-muted-foreground">{filtered.length} posts</p>
        <Button variant="outline" size="sm" onClick={() => refetch()} className="gap-1 text-xs">
          <RefreshCw className="w-3 h-3" /> Refresh
        </Button>
      </div>

      {isLoading ? (
        <div className="text-center py-16">
          <div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs text-muted-foreground">Loading drafts...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-border rounded-xl">
          <Clock className="w-10 h-10 text-muted-foreground/20 mx-auto mb-3" />
          <p className="text-sm text-muted-foreground font-medium">No drafts yet</p>
          <p className="text-xs text-muted-foreground mt-1">Use the Seed button in the Coaching Content Engine to generate 30-day drafts</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(item => (
            <DraftCard
              key={item.id}
              item={item}
              onApprove={(id) => decide.mutate({ id, status: 'approved' })}
              onReject={(id) => decide.mutate({ id, status: 'rejected' })}
            />
          ))}
        </div>
      )}
    </div>
  );
}