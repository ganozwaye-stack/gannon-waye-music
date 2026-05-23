import { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { CheckCircle2, Loader2, ShoppingBag, Star } from 'lucide-react';
import { toast } from 'sonner';

const FEEDBACK_TYPES = [
  { key: 'quality', label: 'Quality Feedback' },
  { key: 'sizing', label: 'Sizing Feedback' },
  { key: 'design', label: 'Design Feedback' },
  { key: 'price', label: 'Price Feedback' },
  { key: 'bundle_suggestion', label: 'Bundle Suggestion' },
  { key: 'new_idea', label: 'New Merch Idea' },
  { key: 'general', label: 'General Feedback' },
];

function StarRating({ value, onChange }) {
  const [hover, setHover] = useState(0);
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map(n => (
        <button key={n} type="button" onClick={() => onChange(n)}
          onMouseEnter={() => setHover(n)} onMouseLeave={() => setHover(0)}
          className="cursor-pointer transition-transform hover:scale-110">
          <Star className={`w-6 h-6 ${n <= (hover || value) ? 'fill-primary text-primary' : 'text-muted-foreground'}`} />
        </button>
      ))}
    </div>
  );
}

export default function MerchFeedback() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    product_name: '',
    feedback_type: 'general',
    message: '',
    rating: 5,
    submitter_name: '',
    submitter_email: '',
    consent_given: false,
  });

  const { data: products = [] } = useQuery({
    queryKey: ['merch-products-public'],
    queryFn: () => base44.entities.MerchProduct.filter({ is_active: true }, 'name', 30),
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.message) { toast.error('Please enter your feedback'); return; }
    if (!form.consent_given) { toast.error('Please confirm consent'); return; }
    setLoading(true);
    await base44.entities.MerchFeedback.create({ ...form, status: 'new' });
    await base44.entities.AdminNotification.create({
      notification_type: 'comment',
      severity: 'info',
      title: `New merch feedback: ${form.feedback_type.replace('_', ' ')}`,
      summary: form.message.slice(0, 120) + (form.message.length > 120 ? '…' : ''),
      source: 'MerchFeedback',
      requires_action: false,
      linked_entity: 'MerchFeedback',
      linked_route: '/admin/merch-feedback',
      is_read: false,
    });
    setSubmitted(true);
    setLoading(false);
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center max-w-md">
          <CheckCircle2 className="w-16 h-16 text-primary mx-auto mb-6" />
          <h2 className="font-display text-3xl text-foreground mb-3">Thanks for your feedback</h2>
          <p className="font-body text-sm text-muted-foreground leading-relaxed">Your feedback helps shape future merch. It's read personally.</p>
          <Button onClick={() => { setSubmitted(false); setForm({ product_name: '', feedback_type: 'general', message: '', rating: 5, submitter_name: '', submitter_email: '', consent_given: false }); }}
            className="mt-8 rounded-full gradient-gold-button border-0 font-body text-sm tracking-wider uppercase px-8">
            Submit Another
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-24 px-4 md:px-6">
      <div className="max-w-xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <ShoppingBag className="w-8 h-8 text-primary mx-auto mb-4" />
          <p className="font-body text-xs tracking-[0.3em] uppercase gradient-gold-glow mb-3">Merch</p>
          <h1 className="font-display text-4xl md:text-5xl text-foreground mb-4">Share Your Feedback</h1>
          <p className="font-body text-sm text-muted-foreground leading-relaxed max-w-sm mx-auto">
            Tell me what you think about the merch — sizing, quality, design, or ideas for new products. It all gets read.
          </p>
        </motion.div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="bg-card border border-border/40 rounded-2xl p-6 space-y-5">
            <div>
              <Label className="font-body text-xs tracking-wider uppercase text-muted-foreground mb-2 block">Feedback Type</Label>
              <div className="grid grid-cols-2 gap-2">
                {FEEDBACK_TYPES.map(ft => (
                  <button key={ft.key} type="button" onClick={() => setForm(f => ({ ...f, feedback_type: ft.key }))}
                    className={`p-2.5 rounded-xl border text-left text-xs font-body transition-all cursor-pointer
                      ${form.feedback_type === ft.key ? 'border-primary/50 bg-primary/10 text-primary' : 'border-border/40 text-muted-foreground hover:border-primary/25'}`}>
                    {ft.label}
                  </button>
                ))}
              </div>
            </div>

            {products.length > 0 && (
              <div>
                <Label className="font-body text-xs tracking-wider uppercase text-muted-foreground mb-2 block">Product (optional)</Label>
                <select
                  value={form.product_name}
                  onChange={e => setForm(f => ({ ...f, product_name: e.target.value }))}
                  className="w-full bg-secondary/50 border border-border/40 rounded-lg px-3 py-2 text-sm text-foreground font-body"
                >
                  <option value="">Select a product...</option>
                  {products.map(p => <option key={p.id} value={p.name}>{p.name}</option>)}
                </select>
              </div>
            )}

            <div>
              <Label className="font-body text-xs tracking-wider uppercase text-muted-foreground mb-2 block">Your Rating (optional)</Label>
              <StarRating value={form.rating} onChange={r => setForm(f => ({ ...f, rating: r }))} />
            </div>

            <div>
              <Label className="font-body text-xs tracking-wider uppercase text-muted-foreground mb-2 block">Your Feedback *</Label>
              <Textarea placeholder="Share your thoughts, suggestions, or ideas..." value={form.message}
                onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                rows={4} className="bg-secondary/50 border-border/40 font-body text-sm" />
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="bg-card border border-border/40 rounded-2xl p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="font-body text-xs tracking-wider uppercase text-muted-foreground mb-1.5 block">Your Name (optional)</Label>
                <Input placeholder="Name" value={form.submitter_name} onChange={e => setForm(f => ({ ...f, submitter_name: e.target.value }))} className="bg-secondary/50 border-border/40" />
              </div>
              <div>
                <Label className="font-body text-xs tracking-wider uppercase text-muted-foreground mb-1.5 block">Email (optional)</Label>
                <Input type="email" placeholder="you@example.com" value={form.submitter_email} onChange={e => setForm(f => ({ ...f, submitter_email: e.target.value }))} className="bg-secondary/50 border-border/40" />
              </div>
            </div>
            <label className="flex items-start gap-2 cursor-pointer">
              <input type="checkbox" checked={form.consent_given} onChange={e => setForm(f => ({ ...f, consent_given: e.target.checked }))} className="mt-0.5" />
              <span className="font-body text-xs text-muted-foreground">I consent to this feedback being used to improve products. My details will not be shared publicly.</span>
            </label>
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
            <Button type="submit" disabled={loading}
              className="w-full rounded-full gradient-gold-button border-0 font-body text-sm tracking-wider uppercase py-5 gap-2">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              Send Feedback
            </Button>
          </motion.div>
        </form>
      </div>
    </div>
  );
}