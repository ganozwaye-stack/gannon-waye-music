import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CheckCircle2, Mail, Loader2 } from 'lucide-react';

const HOW_FOUND_OPTIONS = [
  { value: 'google', label: 'Google' },
  { value: 'instagram', label: 'Instagram' },
  { value: 'facebook', label: 'Facebook' },
  { value: 'tiktok', label: 'TikTok' },
  { value: 'x_twitter', label: 'X (Twitter)' },
  { value: 'friend_word_of_mouth', label: 'Friend / Word of Mouth' },
  { value: 'i_know_gannon', label: 'I know Gannon' },
  { value: 'other', label: 'Other' },
];

// Multi-step signup: step 1 = name+email, step 2 = phone+how_found
export default function HomeEmailSignup() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ name: '', email: '', phone: '', how_found: '' });
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const set = (field, val) => {
    setForm(f => ({ ...f, [field]: val }));
    setErrors(e => ({ ...e, [field]: false }));
  };

  const handleStep1 = (e) => {
    e.preventDefault();
    const errs = {};
    if (!form.name.trim()) errs.name = true;
    if (!form.email.trim() || !form.email.includes('@')) errs.email = true;
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setStep(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = {};
    if (!form.phone.trim()) errs.phone = true;
    if (!form.how_found) errs.how_found = true;
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    setLoading(true);
    // Fire and forget the duplicate check — don't block UX on it
    base44.entities.EmailSubscriber.filter({ email: form.email })
      .then(existing => {
        if (existing.length === 0) {
          return base44.entities.EmailSubscriber.create(form);
        }
        // Already subscribed — silently update with new details
        return base44.entities.EmailSubscriber.update(existing[0].id, {
          name: form.name,
          phone: form.phone,
          how_found: form.how_found,
        });
      })
      .catch(() => {
        // Best-effort — if filter fails just create
        base44.entities.EmailSubscriber.create(form).catch(() => {});
      });

    // Show success immediately — don't wait for server
    setDone(true);
    setLoading(false);
  };

  const inputCls = (field) =>
    `bg-secondary/50 border-border/40 font-body text-base ${errors[field] ? 'border-destructive ring-1 ring-destructive' : ''}`;

  if (done) {
    return (
      <section className="py-16 md:py-24 px-4 md:px-6">
        <div className="max-w-lg mx-auto text-center">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
            <CheckCircle2 className="w-14 h-14 text-primary mx-auto mb-4" />
            <h2 className="font-display text-3xl text-foreground mb-2">You're in. 🤍</h2>
            <p className="font-body text-sm text-muted-foreground leading-relaxed">
              Welcome to the inner circle, {form.name.split(' ')[0]}. You'll be the first to know when new music drops.
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
          <Mail className="w-8 h-8 text-primary mx-auto mb-4" />
          <p className="font-body text-xs tracking-[0.3em] uppercase gradient-gold-glow mb-3">Stay Connected</p>
          <h2 className="font-display text-3xl md:text-4xl text-foreground mb-3">Join the Inner Circle</h2>
          <p className="font-body text-sm text-muted-foreground mb-8 leading-relaxed">
            Be the first to hear about new music, behind-the-scenes stories, and exclusive updates.
          </p>

          {/* Step indicator */}
          <div className="flex items-center justify-center gap-2 mb-6">
            <div className={`w-2 h-2 rounded-full transition-all ${step === 1 ? 'bg-primary' : 'bg-primary/40'}`} />
            <div className={`w-2 h-2 rounded-full transition-all ${step === 2 ? 'bg-primary' : 'bg-muted-foreground/30'}`} />
          </div>

          {step === 1 && (
            <form onSubmit={handleStep1} className="flex flex-col gap-3 text-left" noValidate>
              <div>
                <Input
                  placeholder="Your full name *"
                  value={form.name}
                  onChange={e => set('name', e.target.value)}
                  className={inputCls('name')}
                  autoComplete="name"
                />
                {errors.name && <p className="font-body text-xs text-destructive mt-1">Please enter your name</p>}
              </div>
              <div>
                <Input
                  type="email"
                  placeholder="Email address *"
                  value={form.email}
                  onChange={e => set('email', e.target.value)}
                  className={inputCls('email')}
                  autoComplete="email"
                  inputMode="email"
                />
                {errors.email && <p className="font-body text-xs text-destructive mt-1">Please enter a valid email</p>}
              </div>
              <Button
                type="submit"
                className="rounded-full gradient-gold-button border-0 font-body text-sm tracking-wider uppercase mt-2 py-5"
              >
                Continue →
              </Button>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handleSubmit} className="flex flex-col gap-3 text-left" noValidate>
              <div>
                <Input
                  placeholder="Phone incl. country code e.g. +61 400 000 000 *"
                  value={form.phone}
                  onChange={e => set('phone', e.target.value)}
                  className={inputCls('phone')}
                  autoComplete="tel"
                  inputMode="tel"
                  type="tel"
                />
                {errors.phone && <p className="font-body text-xs text-destructive mt-1">Phone number is required</p>}
              </div>

              <div>
                <p className="font-body text-xs tracking-wider uppercase text-muted-foreground mb-2">
                  How did you find this page? *
                </p>
                <div className="flex flex-wrap gap-2">
                  {HOW_FOUND_OPTIONS.map(opt => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => set('how_found', opt.value)}
                      className={`px-3 py-2 rounded-full border font-body text-xs transition-all ${
                        form.how_found === opt.value
                          ? 'border-primary bg-primary/20 text-primary'
                          : 'border-border/50 text-muted-foreground hover:border-primary/40'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
                {errors.how_found && <p className="font-body text-xs text-destructive mt-1">Please choose an option</p>}
              </div>

              <div className="flex gap-2 mt-1">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep(1)}
                  className="rounded-full font-body text-sm border-border/40"
                >
                  ← Back
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                  className="flex-1 rounded-full gradient-gold-button border-0 font-body text-sm tracking-wider uppercase py-5"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Subscribe 🤍'}
                </Button>
              </div>
            </form>
          )}
        </motion.div>
      </div>
    </section>
  );
}