import { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Star, Heart, CheckCircle2, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

function StarRating({ value, onChange }) {
  const [hover, setHover] = useState(0);
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map(n => (
        <button
          key={n}
          type="button"
          onClick={() => onChange(n)}
          onMouseEnter={() => setHover(n)}
          onMouseLeave={() => setHover(0)}
          className="cursor-pointer transition-transform hover:scale-110"
        >
          <Star className={`w-6 h-6 ${n <= (hover || value) ? 'fill-primary text-primary' : 'text-muted-foreground'}`} />
        </button>
      ))}
    </div>
  );
}

export default function FanReviewSection({ targetType = 'release', targetId, targetName }) {
  const qc = useQueryClient();
  const [form, setForm] = useState({ reviewer_name: '', reviewer_email: '', review_text: '', rating: 5, reviewer_location: '', consent_given: false });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const { data: reviews = [] } = useQuery({
    queryKey: ['fan-reviews', targetId],
    queryFn: () => base44.entities.FanReview.filter({ target_id: targetId, status: 'approved' }, '-created_date', 20),
    enabled: !!targetId,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.reviewer_name || !form.review_text) {
      toast.error('Name and review are required');
      return;
    }
    if (!form.consent_given) {
      toast.error('Please confirm consent');
      return;
    }
    setLoading(true);
    await base44.entities.FanReview.create({
      ...form,
      target_type: targetType,
      target_id: targetId,
      target_name: targetName,
      status: 'pending',
    });
    // Notify admin
    await base44.entities.AdminNotification.create({
      notification_type: 'comment',
      severity: 'info',
      title: `New fan review: ${targetName}`,
      summary: `"${form.review_text.slice(0, 100)}" — ${form.reviewer_name}`,
      source: 'FanReview',
      requires_action: true,
      linked_entity: 'FanReview',
      linked_route: '/admin/fans',
      is_read: false,
    });
    setSubmitted(true);
    setLoading(false);
    qc.invalidateQueries({ queryKey: ['fan-reviews', targetId] });
  };

  return (
    <div className="mt-12 space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-xl text-foreground">Fan Reviews</h3>
        {!showForm && (
          <Button variant="outline" size="sm" className="rounded-full text-xs gap-1 border-primary/30 text-primary hover:bg-primary/10" onClick={() => setShowForm(true)}>
            <Star className="w-3 h-3" />Leave a Review
          </Button>
        )}
      </div>

      {/* Approved reviews */}
      {reviews.length > 0 && (
        <div className="space-y-3">
          {reviews.map(r => (
            <motion.div
              key={r.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-card border border-border/40 rounded-xl p-4"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-body text-sm font-semibold text-foreground">{r.reviewer_name}</p>
                  {r.reviewer_location && <p className="font-body text-xs text-muted-foreground">{r.reviewer_location}</p>}
                </div>
                <div className="flex gap-0.5 shrink-0">
                  {[1,2,3,4,5].map(n => (
                    <Star key={n} className={`w-3.5 h-3.5 ${n <= r.rating ? 'fill-primary text-primary' : 'text-muted-foreground/30'}`} />
                  ))}
                </div>
              </div>
              <p className="font-body text-sm text-foreground/80 mt-2 leading-relaxed">{r.review_text}</p>
              {r.is_featured && <Badge className="mt-2 text-xs bg-primary/20 text-primary">Featured</Badge>}
              {r.admin_reply && (
                <div className="mt-3 pt-3 border-t border-border/30">
                  <p className="text-xs text-primary font-medium">Gannon replied:</p>
                  <p className="text-xs text-muted-foreground mt-1">{r.admin_reply}</p>
                </div>
              )}
              <div className="flex items-center gap-2 mt-2">
                {r.admin_loved && <Heart className="w-3.5 h-3.5 fill-red-400 text-red-400" />}
                {r.love_count > 0 && <span className="text-xs text-muted-foreground">{r.love_count} loves</span>}
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {reviews.length === 0 && !showForm && (
        <p className="font-body text-sm text-muted-foreground text-center py-6">Be the first to leave a review.</p>
      )}

      {/* Review form */}
      {showForm && !submitted && (
        <motion.form
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleSubmit}
          className="bg-card border border-border/40 rounded-xl p-5 space-y-4"
        >
          <h4 className="font-body text-sm font-semibold">Leave a Review</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Input placeholder="Your name *" value={form.reviewer_name} onChange={e => setForm(f => ({ ...f, reviewer_name: e.target.value }))} className="bg-secondary/30 border-border/40 text-sm" />
            <Input placeholder="Email (optional)" type="email" value={form.reviewer_email} onChange={e => setForm(f => ({ ...f, reviewer_email: e.target.value }))} className="bg-secondary/30 border-border/40 text-sm" />
          </div>
          <Input placeholder="Location (optional)" value={form.reviewer_location} onChange={e => setForm(f => ({ ...f, reviewer_location: e.target.value }))} className="bg-secondary/30 border-border/40 text-sm" />
          <div>
            <p className="font-body text-xs text-muted-foreground mb-2">Your rating</p>
            <StarRating value={form.rating} onChange={r => setForm(f => ({ ...f, rating: r }))} />
          </div>
          <Textarea placeholder="Write your review *" value={form.review_text} onChange={e => setForm(f => ({ ...f, review_text: e.target.value }))} rows={3} className="bg-secondary/30 border-border/40 text-sm" />
          <label className="flex items-start gap-2 cursor-pointer">
            <input type="checkbox" checked={form.consent_given} onChange={e => setForm(f => ({ ...f, consent_given: e.target.checked }))} className="mt-0.5" />
            <span className="font-body text-xs text-muted-foreground">I consent to my review being shown publicly after moderation.</span>
          </label>
          <div className="flex gap-2">
            <Button type="submit" disabled={loading} size="sm" className="rounded-full gradient-gold-button border-0 font-body text-xs tracking-wider uppercase gap-1">
              {loading ? <Loader2 className="w-3 h-3 animate-spin" /> : null}
              Submit Review
            </Button>
            <Button type="button" variant="ghost" size="sm" onClick={() => setShowForm(false)} className="text-xs">Cancel</Button>
          </div>
        </motion.form>
      )}

      {submitted && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-6">
          <CheckCircle2 className="w-8 h-8 text-primary mx-auto mb-2" />
          <p className="font-body text-sm text-foreground">Thanks for your review! It will appear after moderation.</p>
        </motion.div>
      )}
    </div>
  );
}