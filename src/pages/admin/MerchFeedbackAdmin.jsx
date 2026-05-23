import { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, ChevronRight, RefreshCw, Star, MessageCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { format } from 'date-fns';

const STATUS_COLORS = {
  new: 'bg-yellow-500/10 text-yellow-400',
  reviewed: 'bg-blue-500/10 text-blue-400',
  actioned: 'bg-green-500/10 text-green-400',
  archived: 'bg-muted text-muted-foreground',
};

export default function MerchFeedbackAdmin() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [selected, setSelected] = useState(null);
  const [adminNote, setAdminNote] = useState('');
  const [filter, setFilter] = useState('new');

  const { data: feedback = [], refetch } = useQuery({
    queryKey: ['merch-feedback', filter],
    queryFn: () => filter === 'all'
      ? base44.entities.MerchFeedback.list('-created_date', 100)
      : base44.entities.MerchFeedback.filter({ status: filter }, '-created_date', 100),
  });

  const updateStatus = async (id, status) => {
    await base44.entities.MerchFeedback.update(id, { status, admin_note: adminNote || undefined });
    qc.invalidateQueries({ queryKey: ['merch-feedback'] });
    toast.success(`Marked as ${status}`);
    setSelected(null);
  };

  const FILTERS = ['new', 'reviewed', 'actioned', 'archived', 'all'];

  return (
    <div className="space-y-5 pb-10">
      <div className="flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="p-1.5 hover:bg-secondary/50 rounded-lg cursor-pointer transition-colors">
          <ArrowLeft className="w-4 h-4 text-muted-foreground" />
        </button>
        <div>
          <h1 className="text-2xl font-display font-bold gradient-gold-text">Merch Feedback</h1>
          <p className="text-muted-foreground text-sm">Fan feedback on products, sizing, quality, and ideas</p>
        </div>
        <Button variant="outline" size="sm" className="ml-auto gap-1 text-xs" onClick={() => refetch()}>
          <RefreshCw className="w-3 h-3" />
        </Button>
      </div>

      <div className="flex gap-2 flex-wrap">
        {FILTERS.map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all capitalize cursor-pointer
              ${filter === f ? 'bg-primary text-primary-foreground border-primary' : 'border-border text-muted-foreground hover:border-primary/40'}`}>
            {f}
          </button>
        ))}
      </div>

      <div className="space-y-2">
        {feedback.length === 0 && (
          <div className="text-center py-12 border border-dashed border-border rounded-xl">
            <MessageCircle className="w-8 h-8 text-muted-foreground/20 mx-auto mb-2" />
            <p className="text-muted-foreground text-sm">No feedback in "{filter}"</p>
          </div>
        )}
        {feedback.map(item => (
          <div key={item.id} onClick={() => { setSelected(item); setAdminNote(item.admin_note || ''); }}
            className="flex items-start gap-3 p-4 border border-border rounded-xl cursor-pointer hover:border-primary/40 hover:bg-secondary/20 transition-all group">
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap gap-1.5 mb-1">
                <Badge className={`text-xs ${STATUS_COLORS[item.status] || ''}`}>{item.status}</Badge>
                <Badge variant="outline" className="text-xs">{item.feedback_type?.replace('_', ' ')}</Badge>
                {item.product_name && <Badge variant="outline" className="text-xs">{item.product_name}</Badge>}
              </div>
              <p className="text-sm text-foreground group-hover:text-primary transition-colors line-clamp-2">{item.message}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {item.submitter_name || 'Anonymous'} · {item.created_date ? format(new Date(item.created_date), 'dd MMM yyyy') : ''}
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              {item.rating && (
                <div className="flex gap-0.5">
                  {[1,2,3,4,5].map(n => <Star key={n} className={`w-3 h-3 ${n <= item.rating ? 'fill-primary text-primary' : 'text-muted-foreground/30'}`} />)}
                </div>
              )}
              <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
            </div>
          </div>
        ))}
      </div>

      {/* Detail Modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/75 z-50 flex items-center justify-center p-4" onClick={() => setSelected(null)}>
          <div className="bg-card border border-border rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-5 space-y-4" onClick={e => e.stopPropagation()}>
            <div className="flex items-start justify-between gap-2">
              <div>
                <div className="flex flex-wrap gap-1.5 mb-1">
                  <Badge className={`text-xs ${STATUS_COLORS[selected.status] || ''}`}>{selected.status}</Badge>
                  <Badge variant="outline" className="text-xs">{selected.feedback_type?.replace('_', ' ')}</Badge>
                </div>
                <p className="font-semibold">{selected.submitter_name || 'Anonymous'}</p>
                <p className="text-xs text-muted-foreground">{selected.submitter_email || '—'} · {selected.created_date ? format(new Date(selected.created_date), 'dd MMM yyyy, h:mm a') : ''}</p>
              </div>
              {selected.rating && (
                <div className="flex gap-0.5 shrink-0">
                  {[1,2,3,4,5].map(n => <Star key={n} className={`w-4 h-4 ${n <= selected.rating ? 'fill-primary text-primary' : 'text-muted-foreground/30'}`} />)}
                </div>
              )}
            </div>
            {selected.product_name && <p className="text-xs text-muted-foreground">Product: {selected.product_name}</p>}
            <div className="bg-secondary/30 rounded-xl p-3">
              <p className="text-sm text-foreground/90 leading-relaxed whitespace-pre-wrap">{selected.message}</p>
            </div>
            <Textarea placeholder="Admin note..." value={adminNote} onChange={e => setAdminNote(e.target.value)} rows={2} className="text-sm" />
            <div className="flex flex-wrap gap-2 pt-2 border-t border-border">
              <Button size="sm" className="gap-1 text-xs bg-blue-600 hover:bg-blue-700 text-white" onClick={() => updateStatus(selected.id, 'reviewed')}>Mark Reviewed</Button>
              <Button size="sm" className="gap-1 text-xs bg-green-600 hover:bg-green-700 text-white" onClick={() => updateStatus(selected.id, 'actioned')}>Mark Actioned</Button>
              <Button size="sm" variant="outline" className="gap-1 text-xs" onClick={() => updateStatus(selected.id, 'archived')}>Archive</Button>
              <Button size="sm" variant="ghost" onClick={() => setSelected(null)} className="text-xs">Back</Button>
            </div>
            <div className="text-xs text-muted-foreground">
              <p className="font-semibold mb-0.5">Source Chain</p>
              <p className="font-mono text-[10px]">MerchFeedback → AdminNotification → /admin/merch-feedback</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}