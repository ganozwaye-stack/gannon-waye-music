import { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Heart, MessageCircle, CheckCircle2, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { format } from 'date-fns';

export default function FanCommentSection({ postId, postType = 'release' }) {
  const qc = useQueryClient();
  const [form, setForm] = useState({ author_name: '', author_email: '', content: '', consent_email: false });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [lovedIds, setLovedIds] = useState(() => {
    try { return JSON.parse(localStorage.getItem('loved_comments') || '[]'); } catch { return []; }
  });

  const { data: comments = [], refetch } = useQuery({
    queryKey: ['fan-comments', postId],
    queryFn: () => base44.entities.FanComment.filter({ post_id: postId, status: 'approved' }, '-created_date', 50),
    enabled: !!postId,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.author_name || !form.content) { toast.error('Name and comment are required'); return; }
    setLoading(true);
    await base44.entities.FanComment.create({
      ...form,
      post_id: postId,
      post_type: postType,
      status: 'pending',
    });
    await base44.entities.AdminNotification.create({
      notification_type: 'comment',
      severity: 'info',
      title: `New comment on ${postType}`,
      summary: `"${form.content.slice(0, 100)}" — ${form.author_name}`,
      source: 'FanComment',
      requires_action: true,
      linked_entity: 'FanComment',
      linked_route: '/admin/fans',
      is_read: false,
    });
    setSubmitted(true);
    setLoading(false);
  };

  const handleLove = async (comment) => {
    if (lovedIds.includes(comment.id)) { toast.info('Already loved'); return; }
    const newLoved = [...lovedIds, comment.id];
    setLovedIds(newLoved);
    localStorage.setItem('loved_comments', JSON.stringify(newLoved));
    await base44.entities.FanComment.update(comment.id, { love_count: (comment.love_count || 0) + 1 });
    refetch();
  };

  return (
    <div className="mt-10 space-y-5">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-lg text-foreground flex items-center gap-2">
          <MessageCircle className="w-4 h-4 text-primary" />
          Comments {comments.length > 0 && <span className="text-sm font-body text-muted-foreground">({comments.length})</span>}
        </h3>
        {!showForm && !submitted && (
          <Button variant="outline" size="sm" className="rounded-full text-xs border-primary/30 text-primary hover:bg-primary/10" onClick={() => setShowForm(true)}>
            Add Comment
          </Button>
        )}
      </div>

      {/* Comments list */}
      <div className="space-y-3">
        {comments.map(c => (
          <motion.div key={c.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-card border border-border/40 rounded-xl p-4">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="font-body text-sm font-semibold text-foreground">{c.author_name}</p>
                {c.created_date && <p className="font-body text-xs text-muted-foreground">{format(new Date(c.created_date), 'dd MMM yyyy')}</p>}
              </div>
              <button
                onClick={() => handleLove(c)}
                className={`flex items-center gap-1 text-xs cursor-pointer transition-all hover:scale-110 ${lovedIds.includes(c.id) ? 'text-red-400' : 'text-muted-foreground hover:text-red-400'}`}
              >
                <Heart className={`w-4 h-4 ${lovedIds.includes(c.id) ? 'fill-red-400' : ''}`} />
                {(c.love_count || 0) > 0 && <span>{c.love_count}</span>}
              </button>
            </div>
            <p className="font-body text-sm text-foreground/80 mt-2 leading-relaxed">{c.content}</p>
            {c.loved_by_gannon && (
              <p className="text-xs text-primary mt-2 flex items-center gap-1"><Heart className="w-3 h-3 fill-primary" /> Gannon loved this</p>
            )}
            {c.admin_reply && (
              <div className="mt-3 pt-3 border-t border-border/30">
                <p className="text-xs text-primary font-medium">Gannon replied:</p>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{c.admin_reply}</p>
              </div>
            )}
          </motion.div>
        ))}
        {comments.length === 0 && !showForm && (
          <p className="font-body text-sm text-muted-foreground text-center py-4">No comments yet — be the first.</p>
        )}
      </div>

      {/* Comment form */}
      {showForm && !submitted && (
        <motion.form initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} onSubmit={handleSubmit} className="bg-card border border-border/40 rounded-xl p-4 space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Input placeholder="Your name *" value={form.author_name} onChange={e => setForm(f => ({ ...f, author_name: e.target.value }))} className="bg-secondary/30 border-border/40 text-sm" />
            <Input placeholder="Email (optional)" type="email" value={form.author_email} onChange={e => setForm(f => ({ ...f, author_email: e.target.value }))} className="bg-secondary/30 border-border/40 text-sm" />
          </div>
          <Textarea placeholder="Leave a comment *" value={form.content} onChange={e => setForm(f => ({ ...f, content: e.target.value }))} rows={3} className="bg-secondary/30 border-border/40 text-sm" />
          <label className="flex items-start gap-2 cursor-pointer">
            <input type="checkbox" checked={form.consent_email} onChange={e => setForm(f => ({ ...f, consent_email: e.target.checked }))} className="mt-0.5" />
            <span className="font-body text-xs text-muted-foreground">Notify me if Gannon replies to my comment.</span>
          </label>
          <div className="flex gap-2">
            <Button type="submit" disabled={loading} size="sm" className="rounded-full gradient-gold-button border-0 font-body text-xs tracking-wider uppercase gap-1">
              {loading ? <Loader2 className="w-3 h-3 animate-spin" /> : null}Post Comment
            </Button>
            <Button type="button" variant="ghost" size="sm" onClick={() => setShowForm(false)} className="text-xs">Cancel</Button>
          </div>
        </motion.form>
      )}
      {submitted && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-4">
          <CheckCircle2 className="w-6 h-6 text-primary mx-auto mb-2" />
          <p className="font-body text-xs text-muted-foreground">Comment submitted — will appear after moderation.</p>
        </motion.div>
      )}
    </div>
  );
}