import { useState } from 'react';
import { motion } from 'framer-motion';
import { Compass, Wrench, Heart, FileText, ArrowRight, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { base44 } from '@/api/base44Client';
import { trackEvent } from '@/lib/analytics';

const QUOTE = 'Respect is earned. Not a game you make me play.';

const PARAS = [
  'Gannon Waye is a singer-songwriter from Adelaide, now based in Melbourne, who writes from lived experience about grief, healing, and the quiet courage it takes to love yourself. Coaching is the next chapter of that same work: practical, grounded support for people who are ready to stop surviving and start rebuilding.',
  'After losing his mother Sonia, and after years of learning self-respect, boundaries, and how to keep creating through hard seasons, Gannon built this for anyone carrying the weight of an old chapter. Strength does not mean you never broke. It means you decided to keep going, and to turn what hurt into something useful for someone else.',
  'This is coaching, not therapy or crisis support. It is rooted in hope: clear direction, real tools, and encouragement for people ready to take their life seriously again. The same mission behind the music, to help anyone who hears it feel less alone, is the foundation this work stands on.'
];

const PILLARS = [
  { icon: Compass, label: 'Direction' },
  { icon: Wrench, label: 'Tools' },
  { icon: Heart, label: 'Encouragement' }
];

// Compact "Coaching — Coming Soon" section for the home page. Combines the
// condensed hero quote with the why/tools/direction detail and a register
// interest form that saves leads to the CoachingLead entity.
export default function CoachingComingSoonSection() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      setError('Please add your name and email.');
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      await base44.entities.CoachingLead.create({
        full_name: name.trim(),
        email: email.trim(),
        source_page: 'home',
        source_offer: 'coaching_coming_soon',
        status: 'new',
        understands_coaching_not_therapy: true,
        consent_to_contact: true
      });
      trackEvent('coaching_interest_registered', { source: 'home_coming_soon' });
      setDone(true);
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="px-4 md:px-6 pt-10 pb-12 md:pt-12 md:pb-16">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="rounded-2xl overflow-hidden border border-primary/30 backdrop-blur-md"
          style={{ background: 'linear-gradient(135deg, rgba(212,175,55,0.07), rgba(8,8,14,0.6), rgba(212,175,55,0.07))' }}>
          <div className="h-px w-full" style={{ background: 'linear-gradient(90deg, transparent, rgba(212,175,55,0.7), transparent)' }} />

          {/* Top strip: label + info icon */}
          <div className="flex items-center justify-between px-6 md:px-10 pt-5">
            <p className="font-body text-[10px] tracking-[0.3em] uppercase gradient-gold-text">Coaching — Opening Soon</p>
            <span className="flex items-center justify-center w-8 h-8 rounded-full border border-primary/40 text-primary/70" title="Info pack coming">
              <FileText className="w-4 h-4" />
            </span>
          </div>

          {/* Condensed quote */}
          <div className="px-6 md:px-10 pt-3 pb-5">
            <p className="font-display italic gradient-gold-glow text-lg md:text-2xl leading-snug max-w-2xl">
              &ldquo;{QUOTE}&rdquo;
            </p>
            <p className="font-body text-[10px] tracking-[0.3em] uppercase text-muted-foreground mt-2">Gannon Waye</p>
          </div>

          <div className="h-px bg-border/40 mx-6 md:mx-10" />

          {/* Two-column: why heading + body */}
          <div className="grid md:grid-cols-2 gap-0">
            <div className="p-6 md:p-10">
              <p className="font-body text-[10px] tracking-[0.3em] uppercase gradient-gold-text mb-3">Why this is opening</p>
              <h3 className="font-display text-xl md:text-3xl text-foreground italic leading-tight">
                Built from the same life the music comes from.
              </h3>
            </div>
            <div className="p-6 md:p-10 border-t md:border-t-0 md:border-l border-border/30 space-y-3">
              {PARAS.map((p, i) => (
                <p key={i} className="font-body text-xs md:text-sm text-foreground/70 leading-relaxed">{p}</p>
              ))}
            </div>
          </div>

          <div className="h-px bg-border/40 mx-6 md:mx-10" />

          {/* Pillars: Direction / Tools / Encouragement */}
          <div className="grid grid-cols-3 px-6 md:px-10 py-5">
            {PILLARS.map((p, i) => (
              <div key={p.label} className={`flex flex-col items-center gap-2 text-center ${i < 2 ? 'border-r border-border/30' : ''}`}>
                <p.icon className="w-5 h-5 text-primary/80" />
                <span className="font-body text-[10px] tracking-[0.3em] uppercase gradient-gold-text">{p.label}</span>
              </div>
            ))}
          </div>

          <div className="h-px bg-border/40 mx-6 md:mx-10" />

          {/* Register interest */}
          <div className="p-6 md:p-10">
            {done ? (
              <div className="flex items-center gap-3 justify-center text-center">
                <span className="flex items-center justify-center w-9 h-9 rounded-full bg-primary/15 border border-primary/40 text-primary shrink-0">
                  <Check className="w-4 h-4" />
                </span>
                <p className="font-body text-sm text-foreground/80">
                  Thank you, {name.split(' ')[0] || 'friend'}. Your interest is registered. Gannon will be in touch when coaching opens.
                </p>
              </div>
            ) : (
              <form onSubmit={submit} className="max-w-2xl mx-auto">
                <p className="font-body text-[10px] tracking-[0.3em] uppercase gradient-gold-text mb-3 text-center">Register your interest now</p>
                <div className="flex flex-col sm:flex-row gap-2">
                  <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" className="bg-background/60 border-primary/30 rounded-full" />
                  <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Your email" className="bg-background/60 border-primary/30 rounded-full" />
                  <Button type="submit" disabled={submitting} className="gradient-gold-button border-0 rounded-full px-6 py-2.5 font-body text-xs tracking-wider uppercase whitespace-nowrap">
                    {submitting ? 'Sending…' : <>Register Interest <ArrowRight className="w-3.5 h-3.5" /></>}
                  </Button>
                </div>
                {error && <p className="font-body text-xs text-destructive mt-2 text-center">{error}</p>}
                <p className="font-body text-[10px] text-muted-foreground mt-2 text-center">
                  Coaching is not therapy or crisis support. We will only contact you about coaching.
                </p>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}