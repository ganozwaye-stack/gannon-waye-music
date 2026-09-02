import { useState } from 'react';
import { motion } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CheckCircle2, Mail } from 'lucide-react';

export default function HomeEmailSignup() {
  const [form, setForm] = useState({ name: '', email: '', consent_updates: false });
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    if (!form.name.trim()) {
      setError('Please enter your name.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      setError('Please enter a valid email address.');
      return;
    }
    if (!form.consent_updates) {
      setError('Please confirm that you would like to receive music and merchandise updates.');
      return;
    }

    setLoading(true);
    try {
      await base44.entities.EmailSubscriber.create({
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        consent_updates: true,
        consent_at: new Date().toISOString(),
        source: 'home_email_signup',
        unsubscribed: false,
      });
      setDone(true);
    } catch {
      setError('The signup could not be saved. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (done) {
    return (
      <section className="py-16 md:py-24 px-4 md:px-6">
        <div className="max-w-lg mx-auto text-center">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-4">
            <CheckCircle2 className="w-14 h-14 text-primary mx-auto" />
            <h2 className="font-display text-3xl text-foreground">You're on the list.</h2>
            <p className="font-body text-sm text-muted-foreground leading-relaxed">
              Thank you, {form.name.split(' ')[0]}. Your details have been recorded for Gannon Waye music and merchandise updates.
            </p>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 md:py-24 px-4 md:px-6">
      <div className="max-w-lg mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <Mail className="w-8 h-8 text-primary mx-auto mb-4" style={{ filter: 'drop-shadow(0 0 12px rgba(212,175,55,0.55))' }} />
          <p className="font-body text-xs tracking-[0.3em] uppercase gradient-gold-glow mb-3">Stay Connected</p>
          <h2 className="font-display text-3xl md:text-4xl text-foreground mb-3">Join the Update List</h2>
          <p className="font-body text-sm text-muted-foreground mb-7 leading-relaxed">
            Receive occasional updates about new music, current merchandise, and Gannon's creative work.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-3 text-left" noValidate>
            <Input
              placeholder="Your full name"
              value={form.name}
              onChange={event => setForm(current => ({ ...current, name: event.target.value }))}
              className="bg-secondary/50 border-border/40 font-body text-base"
              autoComplete="name"
            />
            <Input
              type="email"
              placeholder="Email address"
              value={form.email}
              onChange={event => setForm(current => ({ ...current, email: event.target.value }))}
              className="bg-secondary/50 border-border/40 font-body text-base"
              autoComplete="email"
              inputMode="email"
            />
            <label className="flex items-start gap-3 rounded-xl border border-border/30 bg-card/30 p-4 cursor-pointer">
              <input
                type="checkbox"
                checked={form.consent_updates}
                onChange={event => setForm(current => ({ ...current, consent_updates: event.target.checked }))}
                className="mt-0.5 accent-yellow-500"
              />
              <span className="font-body text-xs text-foreground/70 leading-relaxed">
                I would like to receive music and merchandise updates from Gannon Waye. I can unsubscribe at any time.
              </span>
            </label>
            {error && <p className="font-body text-xs text-destructive">{error}</p>}
            <Button
              type="submit"
              disabled={loading}
              className="rounded-full gradient-gold-button border-0 font-body text-sm tracking-wider uppercase mt-2 py-5"
            >
              {loading ? 'Saving...' : 'Join the Update List'}
            </Button>
          </form>
        </motion.div>
      </div>
    </section>
  );
}
