import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CheckCircle2, Mail, Loader2, ChevronDown } from 'lucide-react';

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

// Get today's date in Australia/Sydney timezone
const getSydneyDate = () => {
  return new Date().toLocaleString('en-AU', { timeZone: 'Australia/Sydney' });
};

// Calculate minimum age (13+)
const getMinDate = () => {
  const minDate = new Date();
  minDate.setFullYear(minDate.getFullYear() - 13);
  return minDate.toISOString().split('T')[0];
};

// Calculate max date (100 years ago)
const getMaxDate = () => {
  const maxDate = new Date();
  maxDate.setFullYear(maxDate.getFullYear() - 100);
  return maxDate.toISOString().split('T')[0];
};

// Multi-step signup: step 1 = name+email, step 2 = phone+how_found
export default function HomeEmailSignup() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ name: '', email: '', phone: '', date_of_birth: '', how_found: '' });
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showGiftInfo, setShowGiftInfo] = useState(false);

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
    try {
      await base44.entities.EmailSubscriber.create({
        name: form.name,
        email: form.email,
        phone: form.phone,
        date_of_birth: form.date_of_birth || null,
        how_found: form.how_found,
      });
    } catch {
      // Non-blocking — may already exist
    }
    setDone(true);
    setLoading(false);
  };

  const inputCls = (field) =>
    `bg-secondary/50 border-border/40 font-body text-base ${errors[field] ? 'border-destructive ring-1 ring-destructive' : ''}`;

  if (done) {
    return (
      <section className="py-16 md:py-24 px-4 md:px-6">
        <div className="max-w-lg mx-auto text-center">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="space-y-4">
            <CheckCircle2 className="w-14 h-14 text-primary mx-auto" />
            <h2 className="font-display text-3xl text-foreground">You're in. 🤍</h2>
            <p className="font-body text-sm text-muted-foreground leading-relaxed">
              You're in. Thank you for joining Gannon Waye Music, {form.name.split(' ')[0]}. Check your email for a welcome message from Gannon.
            </p>
            <div className="bg-primary/10 border border-primary/30 rounded-2xl p-5 mt-6 space-y-3 text-left max-w-md mx-auto">
              <p className="font-display text-base gradient-gold-glow text-center">Gift Offer 🎁</p>
              <p className="font-body text-sm text-foreground/70 leading-relaxed">
                Thank you for getting in early. If you'd like to be considered for a thank-you gift from me:
              </p>
              <ol className="font-body text-xs text-foreground/60 space-y-1.5 list-decimal list-inside">
                <li>Subscribe on <a href="https://www.gannonwaye.com" className="text-primary hover:underline">www.gannonwaye.com</a> ✓ (done)</li>
                <li>Follow Gannon on Instagram: <a href="https://www.instagram.com/ganozwaye" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">@ganozwaye</a></li>
                <li>Follow Gannon on TikTok: <a href="https://www.tiktok.com/@gannonwaye" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">@gannonwaye</a></li>
                <li>Find the "Sing Along Here" video</li>
                <li>Like it</li>
                <li>Comment something you love about the song and tag Gannon</li>
                <li>Share the post publicly</li>
                <li>Reply to the welcome email with screenshots so Gannon can review it</li>
              </ol>
              <p className="font-body text-[10px] text-muted-foreground leading-relaxed">
                Instagram and TikTok actions are not automatically verified. Proof is reviewed manually by Gannon. The gift is subject to approval and not guaranteed until reviewed.
              </p>
            </div>
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
          <p className="font-body text-sm text-muted-foreground mb-3 leading-relaxed">
            Be the first to hear about new music, behind-the-scenes stories, and exclusive updates.
          </p>
          <motion.button
            onClick={() => setShowGiftInfo(!showGiftInfo)}
            className="inline-flex items-center gap-2 text-primary font-body text-xs tracking-widest uppercase hover:underline mb-6"
          >
            🎁 Sign up today & get a gift from me
            <ChevronDown className={`w-3 h-3 transition-transform ${showGiftInfo ? 'rotate-180' : ''}`} />
          </motion.button>
          <AnimatePresence>
            {showGiftInfo && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-primary/5 border border-primary/20 rounded-xl p-4 mb-6 text-sm font-body text-foreground/70 leading-relaxed"
              >
                <p className="mb-2">Sign up, follow me on Instagram <a href="https://www.instagram.com/ganozwaye" target="_blank" rel="noopener noreferrer" className="text-primary">@ganozwaye</a> and TikTok <a href="https://www.tiktok.com/@gannonwaye" target="_blank" rel="noopener noreferrer" className="text-primary">@gannonwaye</a>, engage with the "Sing Along Here" video, then reply to the welcome email with proof. Gannon reviews all claims manually. Subject to approval.</p>
                <p className="text-xs text-muted-foreground">No purchase necessary. Social actions are not automatically verified.</p>
              </motion.div>
            )}
          </AnimatePresence>

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
                <Label className="font-body text-xs tracking-wider uppercase text-muted-foreground mb-2 block">
                  Date of Birth (Optional - Get Birthday Discounts!)
                </Label>
                <Input
                  type="date"
                  value={form.date_of_birth}
                  onChange={e => set('date_of_birth', e.target.value)}
                  className={inputCls('date_of_birth')}
                  min={getMaxDate()}
                  max={getMinDate()}
                />
                <p className="font-body text-[10px] text-muted-foreground mt-1">
                  Must be 13+ to sign up. We'll send you a special birthday discount! 🎂
                </p>
              </div>

              <div>
                <p className="font-body text-xs tracking-wider uppercase text-muted-foreground mb-2">
                  How did you find me? *
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
