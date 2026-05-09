import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Music, CheckCircle2, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import CountdownTimer from './CountdownTimer';
import { useSiteReveal } from '@/hooks/useSiteReveal';
import { base44 } from '@/api/base44Client';



const HOW_FOUND_OPTIONS = [
  { value: 'google', label: 'Google' },
  { value: 'instagram', label: 'Instagram' },
  { value: 'tiktok', label: 'TikTok' },
  { value: 'friend_word_of_mouth', label: 'Friend / Word of Mouth' },
  { value: 'i_know_gannon', label: 'I know Gannon' },
  { value: 'other', label: 'Other' },
];


export default function ThankYouSingle() {
  const { artworkRevealed, released, releaseDateIso, releaseDateText } = useSiteReveal();
  const [signupStep, setSignupStep] = useState(1);
  const [form, setForm] = useState({ name: '', email: '', phone: '', how_found: '' });
  const [signupDone, setSignupDone] = useState(false);
  const [signupLoading, setSignupLoading] = useState(false);
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
    setSignupStep(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = {};
    if (!form.phone.trim()) errs.phone = true;
    if (!form.how_found) errs.how_found = true;
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setSignupLoading(true);
    try {
      await base44.entities.EmailSubscriber.create({ name: form.name, email: form.email, phone: form.phone, how_found: form.how_found });
    } catch { /* may already exist */ }
    setSignupDone(true);
    setSignupLoading(false);
  };

  return (
    <section className="py-16 md:py-28 px-4 md:px-6 relative overflow-hidden">
      {/* subtle background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-5xl mx-auto relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <p className="font-body text-xs tracking-[0.3em] uppercase gradient-gold-glow mb-2">Debut Single</p>
          <h2 className="font-display text-5xl md:text-7xl text-foreground italic mb-1">Thank You</h2>
          <p className="font-body text-sm text-muted-foreground mb-6 max-w-2xl mx-auto leading-relaxed">
            "Thank You" — Gannon Waye. Written at a turning point, when staying any longer would have meant abandoning himself all over again. This song is not about the pain. It is about the line being drawn. The moment of choosing self respect over repetition.
          </p>
          <p className="font-body text-sm gradient-gold-glow font-medium tracking-wider">
            Out Now · {releaseDateText}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">
          {/* Artwork panel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative aspect-square rounded-2xl overflow-hidden border border-border/40 bg-secondary/60"
          >
            <img src="https://media.base44.com/images/public/69eb7905ca6eb4180010f794/6dde7d697_2.jpg" alt="Thank You — Gannon Waye single cover" className="w-full h-full object-cover" />
          </motion.div>

          {/* Info panel */}
          <motion.div
            initial={{ opacity: 0, x: 16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="space-y-6"
          >
            <div>
              <p className="font-body text-xs tracking-[0.2em] uppercase gradient-gold-glow mb-3">Out Now · Debut Single</p>
              <p className="font-body text-xs tracking-[0.2em] uppercase gradient-gold-glow mb-2">About the single</p>
              <p className="font-body text-foreground/70 leading-relaxed text-sm">
                "Thank You" was written at a turning point, when staying any longer would have meant abandoning himself all over again. The dynamic mirrored something already fought hard to outgrow — and in recognising that, the decision became simple.
              </p>
              <p className="font-body text-foreground/70 leading-relaxed text-sm mt-3">
                This is what it sounds like when you break a cycle and refuse to return to it. "Thank You" — Gannon Waye.
              </p>
            </div>

            {/* Release countdown or release date */}
            <div className="border-t border-border/30 pt-6 space-y-4">
              {released ? (
                <a href="https://open.spotify.com/search/Gannon%20Waye%20Thank%20You" target="_blank" rel="noopener noreferrer">
                  <Button className="w-full rounded-full gap-2 font-body text-sm tracking-wider uppercase px-7 gradient-gold-button border-0">
                    <Music className="w-4 h-4" /> Listen on Spotify
                  </Button>
                </a>
              ) : (
                <>
                  <p className="font-body text-xs tracking-[0.2em] uppercase gradient-gold-glow">Release countdown — {releaseDateText}</p>
                  <CountdownTimer targetDate={releaseDateIso} />
                  <a href="https://open.spotify.com/search/Gannon%20Waye%20Thank%20You" target="_blank" rel="noopener noreferrer">
                    <Button className="w-full rounded-full gap-2 font-body text-sm tracking-wider uppercase px-7 gradient-gold-button border-0 hover:shadow-lg">
                      <Music className="w-4 h-4" /> Listen on Spotify
                    </Button>
                  </a>
                </>
              )}
            </div>

            <div className="border-t border-border/30 pt-6">
              <Link to="/community">
                <Button variant="outline" className="rounded-full gap-2 font-body text-xs tracking-wider uppercase border-foreground/20">
                  Join the Community <ArrowRight className="w-3 h-3" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Email Signup — embedded below the single */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-14 border-t border-border/30 pt-10"
        >
          {signupDone ? (
            <div className="text-center space-y-3">
              <CheckCircle2 className="w-10 h-10 text-primary mx-auto" />
              <p className="font-display text-2xl text-foreground">You're in. 🤍</p>
              <p className="font-body text-sm text-muted-foreground">Welcome to the inner circle, {form.name.split(' ')[0]}. Check your email for a message from Gannon.</p>
            </div>
          ) : (
            <div className="max-w-xl mx-auto">
              <p className="font-body text-xs tracking-[0.3em] uppercase gradient-gold-glow mb-2 text-center">Stay Connected</p>
              <h3 className="font-display text-2xl md:text-3xl text-foreground text-center mb-2">Join the Inner Circle</h3>
              <p className="font-body text-sm text-muted-foreground text-center mb-6 leading-relaxed">
                Be the first to hear new music, behind-the-scenes stories, and exclusive updates. 🎁 Sign up today for a chance at a gift from me.
              </p>

              {/* Step dots */}
              <div className="flex justify-center gap-2 mb-5">
                <div className={`w-2 h-2 rounded-full transition-all ${signupStep === 1 ? 'bg-primary' : 'bg-primary/40'}`} />
                <div className={`w-2 h-2 rounded-full transition-all ${signupStep === 2 ? 'bg-primary' : 'bg-muted-foreground/30'}`} />
              </div>

              {signupStep === 1 ? (
                <form onSubmit={handleStep1} className="flex flex-col gap-3" noValidate>
                  <Input
                    placeholder="Your full name *"
                    value={form.name}
                    onChange={e => set('name', e.target.value)}
                    className={`bg-secondary/50 border-border/40 ${errors.name ? 'border-destructive' : ''}`}
                  />
                  {errors.name && <p className="font-body text-xs text-destructive -mt-2">Please enter your name</p>}
                  <Input
                    type="email"
                    placeholder="Email address *"
                    value={form.email}
                    onChange={e => set('email', e.target.value)}
                    className={`bg-secondary/50 border-border/40 ${errors.email ? 'border-destructive' : ''}`}
                    inputMode="email"
                  />
                  {errors.email && <p className="font-body text-xs text-destructive -mt-2">Please enter a valid email</p>}
                  <Button type="submit" className="rounded-full gradient-gold-button border-0 font-body text-sm tracking-wider uppercase py-5">
                    Continue →
                  </Button>
                </form>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-3" noValidate>
                  <Input
                    placeholder="Phone incl. country code e.g. +61 400 000 000 *"
                    value={form.phone}
                    onChange={e => set('phone', e.target.value)}
                    className={`bg-secondary/50 border-border/40 ${errors.phone ? 'border-destructive' : ''}`}
                    type="tel"
                  />
                  {errors.phone && <p className="font-body text-xs text-destructive -mt-2">Phone number is required</p>}
                  <div>
                    <p className="font-body text-xs tracking-wider uppercase text-muted-foreground mb-2">How did you find me? *</p>
                    <div className="flex flex-wrap gap-2">
                      {HOW_FOUND_OPTIONS.map(opt => (
                        <button key={opt.value} type="button" onClick={() => set('how_found', opt.value)}
                          className={`px-3 py-2 rounded-full border font-body text-xs transition-all ${form.how_found === opt.value ? 'border-primary bg-primary/20 text-primary' : 'border-border/50 text-muted-foreground hover:border-primary/40'}`}>
                          {opt.label}
                        </button>
                      ))}
                    </div>
                    {errors.how_found && <p className="font-body text-xs text-destructive mt-1">Please choose an option</p>}
                  </div>
                  <div className="flex gap-2">
                    <Button type="button" variant="outline" onClick={() => setSignupStep(1)} className="rounded-full border-border/40">← Back</Button>
                    <Button type="submit" disabled={signupLoading} className="flex-1 rounded-full gradient-gold-button border-0 font-body text-sm tracking-wider uppercase py-5">
                      {signupLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Subscribe 🤍'}
                    </Button>
                  </div>
                </form>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}