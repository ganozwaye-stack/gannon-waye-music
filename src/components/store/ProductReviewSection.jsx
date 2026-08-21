import { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Star, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { format } from 'date-fns';

function StarRating({ value, onChange }) {
  const [hover, setHover] = useState(0);
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map(star => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          onMouseEnter={() => setHover(star)}
          onMouseLeave={() => setHover(0)}
          className="transition-transform hover:scale-110"
        >
          <Star
            className={`w-6 h-6 ${(hover || value) >= star ? 'text-primary fill-primary' : 'text-border'}`}
          />
        </button>
      ))}
    </div>
  );
}

export default function ProductReviewSection({ productId, productName }) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [form, setForm] = useState({ name: '', email: '', rating: 0, comment: '', order_number: '' });
  const [submitted, setSubmitted] = useState(false);

  const { data: reviews = [] } = useQuery({
    queryKey: ['reviews', productId],
    queryFn: () => base44.entities.ProductReview.filter({ product_id: productId, is_approved: true }, '-created_date', 20),
    initialData: [],
  });

  const createReview = useMutation({
    mutationFn: (data) => base44.entities.ProductReview.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews', productId] });
      setSubmitted(true);
      toast({ title: 'Review submitted! 🤍', description: 'Thanks — your review is pending approval.' });
    },
    onError: () => toast({ title: 'Could not submit review. Please try again.', variant: 'destructive' }),
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim() || form.rating === 0) {
      toast({ title: 'Please add your name and a star rating', variant: 'destructive' });
      return;
    }
    createReview.mutate({ ...form, product_id: productId, product_name: productName });
  };

  const avgRating = reviews.length > 0
    ? (reviews.reduce((s, r) => s + (r.rating || 0), 0) / reviews.length).toFixed(1)
    : null;

  return (
    <div className="mt-8 border-t border-border/40 pt-8">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-display text-xl text-foreground">Reviews</h3>
        {avgRating && (
          <div className="flex items-center gap-2">
            <Star className="w-4 h-4 text-primary fill-primary" />
            <span className="font-body text-sm text-foreground font-medium">{avgRating}</span>
            <span className="font-body text-xs text-muted-foreground">({reviews.length})</span>
          </div>
        )}
      </div>

      {/* Existing reviews */}
      {reviews.length > 0 && (
        <div className="space-y-4 mb-8">
          {reviews.map(r => (
            <div key={r.id} className="bg-card border border-border/40 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="font-display text-xs text-primary">{r.reviewer_name?.[0]?.toUpperCase()}</span>
                  </div>
                  <span className="font-body text-sm font-medium text-foreground">{r.reviewer_name}</span>
                </div>
                <div className="flex gap-0.5">
                  {[1,2,3,4,5].map(s => (
                    <Star key={s} className={`w-3.5 h-3.5 ${r.rating >= s ? 'text-primary fill-primary' : 'text-border'}`} />
                  ))}
                </div>
              </div>
              {r.comment && <p className="font-body text-sm text-foreground/70 leading-relaxed">{r.comment}</p>}
              <p className="font-body text-xs text-muted-foreground/50 mt-2">
                {r.created_date ? format(new Date(r.created_date), 'MMM d, yyyy') : ''}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Leave a review */}
      {!submitted ? (
        <div className="bg-card border border-border/40 rounded-2xl p-5">
          <p className="font-body text-xs tracking-widest uppercase text-muted-foreground mb-4">Leave a Review</p>
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input placeholder="Your name *" value={form.name} onChange={e => setForm(f => ({...f, name: e.target.value}))} className="bg-secondary/50 border-border/40" />
              <Input placeholder="Order number (optional)" value={form.order_number} onChange={e => setForm(f => ({...f, order_number: e.target.value}))} className="bg-secondary/50 border-border/40" />
            </div>
            <StarRating value={form.rating} onChange={r => setForm(f => ({...f, rating: r}))} />
            <Textarea placeholder="Share your thoughts... (optional)" value={form.comment} onChange={e => setForm(f => ({...f, comment: e.target.value}))} className="bg-secondary/50 border-border/40 min-h-[80px]" maxLength={500} />
            <Button type="submit" disabled={createReview.isPending} size="sm" className="rounded-full gradient-gold-button border-0 font-body text-xs tracking-wider uppercase gap-2">
              <Send className="w-3 h-3" /> {createReview.isPending ? 'Submitting...' : 'Submit Review'}
            </Button>
          </form>
        </div>
      ) : (
        <div className="bg-primary/5 border border-primary/20 rounded-2xl p-5 text-center">
          <p className="font-body text-sm text-foreground/70">Thanks for your review! It will appear once approved. 🤍</p>
        </div>
      )}
    </div>
  );
}