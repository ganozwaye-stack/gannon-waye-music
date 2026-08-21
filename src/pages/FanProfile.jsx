import { useState } from 'react';
import { motion } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CheckCircle2, User, Bell } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const PREFERENCES = [
  { key: 'consent_new_music', label: 'New Music Releases', description: 'Be first to know when new songs drop' },
  { key: 'consent_behind_scenes', label: 'Behind the Scenes', description: 'Studio updates, creative process insights' },
  { key: 'consent_tour_events', label: 'Tour & Events', description: 'Show announcements and ticket info' },
  { key: 'consent_merch_drops', label: 'Merch Drops', description: 'New merchandise and exclusive items' },
  { key: 'consent_exclusive_content', label: 'Exclusive Content', description: 'Fan-only content and early access' },
  { key: 'consent_personal_stories', label: 'Personal Stories', description: 'Deeper reflections and personal updates' },
];

export default function FanProfile() {
  const { toast } = useToast();
  const [step, setStep] = useState('form'); // 'form' | 'done'
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: '',
    email: '',
    consent_new_music: false,
    consent_behind_scenes: false,
    consent_tour_events: false,
    consent_merch_drops: false,
    consent_exclusive_content: false,
    consent_personal_stories: false,
  });

  const togglePref = (key) => setForm(f => ({ ...f, [key]: !f[key] }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email) {
      toast({ title: 'Email is required', variant: 'destructive' });
      return;
    }
    setLoading(true);
    // Check for existing record and update, otherwise create
    const existing = await base44.entities.EmailPreference.filter({ email: form.email });
    if (existing.length > 0) {
      await base44.entities.EmailPreference.update(existing[0].id, form);
    } else {
      await base44.entities.EmailPreference.create(form);
    }
    setStep('done');
    setLoading(false);
  };

  if (step === 'done') {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md"
        >
          <CheckCircle2 className="w-16 h-16 text-primary mx-auto mb-6" />
          <h2 className="font-display text-3xl text-foreground mb-3">You're all set</h2>
          <p className="font-body text-sm text-muted-foreground leading-relaxed">
            Your preferences have been saved. You'll only hear from me about the things you care about.
          </p>
          <Button
            onClick={() => setStep('form')}
            className="mt-8 rounded-full font-body text-sm tracking-wider uppercase gradient-gold-button border-0 px-8"
          >
            Update Again
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-24 px-4 md:px-6">
      <div className="max-w-xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <p className="font-body text-xs tracking-[0.3em] uppercase gradient-gold-glow mb-4">Fan Hub</p>
          <h1 className="font-display text-4xl md:text-5xl text-foreground mb-4">Your Preferences</h1>
          <p className="font-body text-sm text-muted-foreground leading-relaxed max-w-sm mx-auto">
            Tell me a bit about yourself and choose exactly what you'd like to hear from me. No spam, ever.
          </p>
        </motion.div>

        <form onSubmit={handleSubmit} className="space-y-10">

          {/* Personal Details */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-card border border-border/40 rounded-2xl p-6 space-y-5"
          >
            <div className="flex items-center gap-2 mb-1">
              <User className="w-4 h-4 text-primary" />
              <h3 className="font-body text-xs tracking-[0.2em] uppercase gradient-gold-glow">Your Details</h3>
            </div>

            <div>
              <Label className="font-body text-xs tracking-wider uppercase text-muted-foreground mb-1.5 block">Name</Label>
              <Input
                placeholder="Your name"
                value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                className="bg-secondary/50 border-border/40"
              />
            </div>
            <div>
              <Label className="font-body text-xs tracking-wider uppercase text-muted-foreground mb-1.5 block">Email *</Label>
              <Input
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                className="bg-secondary/50 border-border/40"
                required
              />
            </div>
          </motion.div>

          {/* Preferences */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-card border border-border/40 rounded-2xl p-6"
          >
            <div className="flex items-center gap-2 mb-5">
              <Bell className="w-4 h-4 text-primary" />
              <h3 className="font-body text-xs tracking-[0.2em] uppercase gradient-gold-glow">What do you want to hear about?</h3>
            </div>

            <div className="space-y-3">
              {PREFERENCES.map(pref => (
                <button
                  key={pref.key}
                  type="button"
                  onClick={() => togglePref(pref.key)}
                  className={`w-full text-left flex items-start gap-4 p-4 rounded-xl border transition-all duration-200 ${
                    form[pref.key]
                      ? 'border-primary/50 bg-primary/8'
                      : 'border-border/40 bg-secondary/20 hover:border-primary/25'
                  }`}
                >
                  <div className={`w-5 h-5 rounded border-2 flex-shrink-0 flex items-center justify-center mt-0.5 transition-colors ${
                    form[pref.key] ? 'border-primary bg-primary' : 'border-border/60'
                  }`}>
                    {form[pref.key] && (
                      <svg viewBox="0 0 16 16" fill="none" className="w-3 h-3">
                        <path d="M3 8l3.5 3.5L13 5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </div>
                  <div>
                    <p className="font-body text-sm text-foreground font-medium">{pref.label}</p>
                    <p className="font-body text-xs text-muted-foreground mt-0.5">{pref.description}</p>
                  </div>
                </button>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <Button
              type="submit"
              disabled={loading}
              className="w-full rounded-full gradient-gold-button border-0 font-body text-sm tracking-wider uppercase py-5"
            >
              {loading ? 'Saving...' : 'Save My Preferences'}
            </Button>
            <p className="font-body text-xs text-muted-foreground text-center mt-3">
              Your details are safe with us and never shared.
            </p>
          </motion.div>
        </form>
      </div>
    </div>
  );
}