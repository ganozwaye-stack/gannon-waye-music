import { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Heart, Star, Music, ShoppingBag, Users, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

const BENEFITS = [
  { icon: '🎵', label: 'Early access to new music' },
  { icon: '🤍', label: 'Exclusive supporter-only content' },
  { icon: '✍️', label: 'Future signed items (priority)' },
  { icon: '📦', label: 'Private merch drops before public' },
  { icon: '📩', label: 'Private updates direct from Gannon' },
  { icon: '⭐', label: 'Founding Supporter badge forever' },
];

export default function FoundingSupporterPage() {
  const { toast } = useToast();
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: '', email: '', country: '',
    instagram_username: '', tiktok_username: '',
    interest_type: 'music_fan', supporter_notes: '',
    consent_marketing: false, consent_updates: false,
    source_campaign: 'founding_supporters_2026',
  });

  const handleSubmit = async e => {
    e.preventDefault();
    if (!form.name || !form.email) {
      toast({ title: 'Please enter your name and email', variant: 'destructive' });
      return;
    }
    setLoading(true);
    try {
      await base44.entities.FoundingSupporter.create(form);
      setSubmitted(true);
    } catch {
      toast({ title: 'Already registered or error — try again', variant: 'destructive' });
    }
    setLoading(false);
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-24">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-md">
          <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-8 h-8 text-primary" />
          </div>
          <h1 className="font-display text-4xl gradient-gold-text mb-4">You're in. 🤍</h1>
          <p className="font-body text-muted-foreground mb-6">
            You're now a Founding Supporter of Gannon Waye. Thank you — genuinely.
            You'll be the first to know about everything that matters.
          </p>
          <div className="space-y-2 mb-8">
            {BENEFITS.map(b => (
              <div key={b.label} className="flex items-center gap-3 text-sm font-body text-foreground/80">
                <span>{b.icon}</span><span>{b.label}</span>
              </div>
            ))}
          </div>
          <div className="flex gap-3 flex-wrap justify-center">
            <a href="/store" className="rounded-full px-6 py-2.5 gradient-gold-button font-body text-sm tracking-wider uppercase inline-flex items-center gap-2">
              <ShoppingBag className="w-4 h-4" /> Visit the Store
            </a>
            <a href="/music" className="rounded-full px-6 py-2.5 border border-primary/40 font-body text-sm tracking-wider uppercase inline-flex items-center gap-2 text-primary">
              <Music className="w-4 h-4" /> Listen Now
            </a>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-24 px-4">
      <div className="max-w-2xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <p className="font-body text-xs tracking-[0.3em] uppercase gradient-gold-glow mb-4">Limited</p>
          <h1 className="font-display text-5xl md:text-6xl text-foreground mb-5">Become a<br />Founding Supporter</h1>
          <p className="font-body text-lg text-muted-foreground max-w-xl mx-auto">
            You're not just buying music. You're part of the chapter where it all began.
          </p>
        </motion.div>

        {/* Benefits */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-10">
          {BENEFITS.map(b => (
            <div key={b.label} className="bg-card/40 border border-border/30 rounded-xl p-4 text-center">
              <p className="text-2xl mb-2">{b.icon}</p>
              <p className="font-body text-xs text-foreground/70">{b.label}</p>
            </div>
          ))}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 bg-card/30 border border-border/30 rounded-2xl p-6">
          <h2 className="font-display text-xl text-foreground">Join the Founding Supporters</h2>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block font-body text-xs tracking-wider uppercase text-muted-foreground mb-1.5">Full Name *</label>
              <input value={form.name} onChange={e => setForm(f => ({...f, name: e.target.value}))} required
                placeholder="Your name" className="w-full bg-secondary/50 border border-border/40 rounded-lg px-3 py-2 font-body text-sm text-foreground" />
            </div>
            <div>
              <label className="block font-body text-xs tracking-wider uppercase text-muted-foreground mb-1.5">Email *</label>
              <input type="email" value={form.email} onChange={e => setForm(f => ({...f, email: e.target.value}))} required
                placeholder="you@example.com" className="w-full bg-secondary/50 border border-border/40 rounded-lg px-3 py-2 font-body text-sm text-foreground" />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block font-body text-xs tracking-wider uppercase text-muted-foreground mb-1.5">Country</label>
              <input value={form.country} onChange={e => setForm(f => ({...f, country: e.target.value}))}
                placeholder="Australia" className="w-full bg-secondary/50 border border-border/40 rounded-lg px-3 py-2 font-body text-sm text-foreground" />
            </div>
            <div>
              <label className="block font-body text-xs tracking-wider uppercase text-muted-foreground mb-1.5">I'm most interested in</label>
              <select value={form.interest_type} onChange={e => setForm(f => ({...f, interest_type: e.target.value}))}
                className="w-full bg-secondary/50 border border-border/40 rounded-lg px-3 py-2 font-body text-sm text-foreground">
                <option value="music_fan">The Music</option>
                <option value="merch_buyer">The Merch</option>
                <option value="community_member">The Community</option>
                <option value="charity_supporter">The Charity</option>
                <option value="all">All of it</option>
              </select>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block font-body text-xs tracking-wider uppercase text-muted-foreground mb-1.5">Instagram @</label>
              <input value={form.instagram_username} onChange={e => setForm(f => ({...f, instagram_username: e.target.value}))}
                placeholder="@yourhandle" className="w-full bg-secondary/50 border border-border/40 rounded-lg px-3 py-2 font-body text-sm text-foreground" />
            </div>
            <div>
              <label className="block font-body text-xs tracking-wider uppercase text-muted-foreground mb-1.5">TikTok @</label>
              <input value={form.tiktok_username} onChange={e => setForm(f => ({...f, tiktok_username: e.target.value}))}
                placeholder="@yourhandle" className="w-full bg-secondary/50 border border-border/40 rounded-lg px-3 py-2 font-body text-sm text-foreground" />
            </div>
          </div>

          <div>
            <label className="block font-body text-xs tracking-wider uppercase text-muted-foreground mb-1.5">Message for Gannon (optional)</label>
            <textarea value={form.supporter_notes} onChange={e => setForm(f => ({...f, supporter_notes: e.target.value}))} rows={2}
              placeholder="What does this music mean to you?"
              className="w-full bg-secondary/50 border border-border/40 rounded-lg px-3 py-2 font-body text-sm text-foreground" />
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" checked={form.consent_updates} onChange={e => setForm(f => ({...f, consent_updates: e.target.checked}))}
                className="w-4 h-4 rounded" />
              <span className="font-body text-xs text-muted-foreground">Yes — keep me updated on music, merch, and this journey 🤍</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" checked={form.consent_marketing} onChange={e => setForm(f => ({...f, consent_marketing: e.target.checked}))}
                className="w-4 h-4 rounded" />
              <span className="font-body text-xs text-muted-foreground">Yes — I'm happy to hear about exclusive offers</span>
            </label>
          </div>

          <Button type="submit" disabled={loading} className="w-full rounded-full gradient-gold-button border-0 font-body text-sm tracking-wider uppercase">
            {loading ? <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" /> : <><Heart className="w-4 h-4" /> Become a Founding Supporter</>}
          </Button>

          <p className="font-body text-xs text-muted-foreground text-center">No spam. No selling your data. Just real updates from the journey.</p>
        </form>
      </div>
    </div>
  );
}