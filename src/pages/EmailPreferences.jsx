import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { Heart, Music, Mic2, Shirt, Star, BookOpen, CheckCircle2 } from 'lucide-react';

const PREFERENCES = [
  { key: 'consent_new_music', label: 'New Music Releases', desc: 'Be first to hear new singles, EPs & albums', icon: Music },
  { key: 'consent_behind_scenes', label: 'Behind the Scenes', desc: 'Studio sessions, songwriting stories & process', icon: Mic2 },
  { key: 'consent_tour_events', label: 'Tour & Events', desc: 'Live shows, appearances & tour announcements', icon: Star },
  { key: 'consent_merch_drops', label: 'Merch Drops', desc: 'Limited edition releases & exclusive products', icon: Shirt },
  { key: 'consent_exclusive_content', label: 'Exclusive Content', desc: 'VIP access, early previews & fan-only content', icon: Heart },
  { key: 'consent_personal_stories', label: 'Personal Stories', desc: 'Gannon\'s journey, reflections & personal updates', icon: BookOpen },
];

export default function EmailPreferences() {
  const { toast } = useToast();
  const [form, setForm] = useState({ email: '', name: '', consent_new_music: false, consent_behind_scenes: false, consent_tour_events: false, consent_merch_drops: false, consent_exclusive_content: false, consent_personal_stories: false });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const toggle = (key) => setForm(f => ({ ...f, [key]: !f[key] }));
  const anySelected = PREFERENCES.some(p => form[p.key]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email) { toast({ title: 'Please enter your email', variant: 'destructive' }); return; }
    if (!anySelected) { toast({ title: 'Please select at least one preference', variant: 'destructive' }); return; }
    setLoading(true);
    await base44.entities.EmailPreference.create(form);
    setSubmitted(true);
    setLoading(false);
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center max-w-md">
          <CheckCircle2 className="w-16 h-16 text-primary mx-auto mb-6" />
          <h2 className="font-display text-3xl text-foreground mb-3">You're all set!</h2>
          <p className="font-body text-muted-foreground leading-relaxed">Your preferences have been saved. You'll only ever hear from Gannon about the things that matter to you most.</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-20 px-4 md:px-6">
      <div className="max-w-2xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <p className="font-body text-xs tracking-[0.3em] uppercase gradient-gold-glow mb-4">Your Inbox, Your Way</p>
          <h1 className="font-display text-4xl md:text-5xl text-foreground mb-4">Email Preferences</h1>
          <p className="font-body text-muted-foreground leading-relaxed max-w-lg mx-auto">
            Tell us what you love. We'll only send you the updates that actually matter to you — no noise, no spam. Just the good stuff.
          </p>
        </motion.div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label className="font-body text-xs tracking-wider uppercase text-muted-foreground mb-1.5 block">Your Name</Label>
              <Input placeholder="First name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className="bg-card border-border/40" />
            </div>
            <div>
              <Label className="font-body text-xs tracking-wider uppercase text-muted-foreground mb-1.5 block">Email Address *</Label>
              <Input type="email" required placeholder="you@example.com" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} className="bg-card border-border/40" />
            </div>
          </div>

          <div>
            <p className="font-body text-xs tracking-[0.2em] uppercase gradient-gold-glow mb-4">What would you like to hear about?</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {PREFERENCES.map(pref => {
                const Icon = pref.icon;
                const active = form[pref.key];
                return (
                  <motion.button
                    key={pref.key}
                    type="button"
                    onClick={() => toggle(pref.key)}
                    whileTap={{ scale: 0.98 }}
                    className={`text-left p-4 rounded-2xl border transition-all duration-200 ${
                      active
                        ? 'border-primary/60 bg-primary/8 shadow-sm shadow-primary/10'
                        : 'border-border/40 bg-card hover:border-primary/30'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${active ? 'bg-primary/20' : 'bg-secondary'}`}>
                        <Icon className={`w-4 h-4 ${active ? 'text-primary' : 'text-muted-foreground'}`} />
                      </div>
                      <div>
                        <p className={`font-body text-sm font-medium ${active ? 'text-foreground' : 'text-foreground/70'}`}>{pref.label}</p>
                        <p className="font-body text-xs text-muted-foreground mt-0.5 leading-relaxed">{pref.desc}</p>
                      </div>
                      <div className={`ml-auto w-4 h-4 rounded-full border-2 flex-shrink-0 mt-0.5 ${active ? 'border-primary bg-primary' : 'border-border'}`}>
                        {active && <svg viewBox="0 0 16 16" fill="none" className="w-full h-full"><path d="M3 8l3.5 3.5L13 5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                      </div>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </div>

          <Button type="submit" disabled={loading || !anySelected} className="w-full rounded-full py-5 font-body tracking-wider uppercase gradient-gold-button border-0">
            {loading ? 'Saving...' : 'Save My Preferences'}
          </Button>

          <p className="font-body text-xs text-muted-foreground text-center leading-relaxed">
            You can update these at any time. We respect your inbox and will never share your details.
          </p>
        </form>
      </div>
    </div>
  );
}