import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import CoachingHero from '@/components/coaching/CoachingHero';
import CoachingOfferCard from '@/components/coaching/CoachingOfferCard';
import CoachingSignatureLine from '@/components/coaching/CoachingSignatureLine';
import CoachingDisclaimer from '@/components/coaching/CoachingDisclaimer';

const OFFERS = [
  {
    icon: '🌱',
    title: 'Self Worth Reset',
    hook: 'What if the problem was never that you were not enough?',
    description: 'A focused session for people who have spent too long questioning their worth, apologising for their needs, or staying small to keep the peace.',
    ctaLabel: 'Book a Session',
    ctaLink: '/coaching/self-worth-reset',
    delay: 0,
  },
  {
    icon: '🛡️',
    title: 'Boundaries & Self Respect',
    hook: 'Respect is earned. Not a game you make me play.',
    description: 'A practical mentoring pathway for people learning to stop over-explaining, over-giving, and abandoning themselves to manage someone else\'s comfort.',
    ctaLabel: 'Learn More',
    ctaLink: '/coaching/boundaries',
    delay: 0.1,
  },
  {
    icon: '🎤',
    title: 'Creative Confidence',
    hook: 'What if the voice you have been hiding is the thing someone else needs to hear?',
    description: 'Support for artists, creators, singers, writers, and people rebuilding their confidence through expression, purpose, and story.',
    ctaLabel: 'Learn More',
    ctaLink: '/coaching/creative-confidence',
    delay: 0.2,
  },
];

const WHY_ITEMS = [
  { label: 'Survivor led', detail: 'Gannon speaks from lived experience — not a textbook.' },
  { label: 'Emotionally honest', detail: 'No toxic positivity. No bypassing. Just real, grounded support.' },
  { label: 'Practical and actionable', detail: 'You will leave sessions with clarity, not just feelings.' },
  { label: 'Safe and boundaried', detail: 'A space where your story is not shame — it is evidence you survived.' },
  { label: 'Rooted in purpose', detail: 'Connected to the THANKYOU movement and the music behind it.' },
];

export default function Coaching() {
  return (
    <div className="min-h-screen">
      <CoachingHero
        badge="Gannon Waye Coaching"
        hook="Are you ready to stop begging for basic respect and start rebuilding the life you were made for?"
        subhook="Life coaching and mindset mentoring for self worth, boundaries, creative confidence, and rebuilding after painful chapters."
        primaryCTA="Book a Clarity Session"
        primaryLink="/coaching/intake"
        secondaryCTA="Download the Free Workbook"
        secondaryLink="/coaching/workbooks"
      />

      {/* Signature line */}
      <section className="py-10 px-4">
        <CoachingSignatureLine line="Respect is earned. Not a game you make me play." size="lg" />
      </section>

      {/* Three offers */}
      <section className="py-16 px-4 md:px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <p className="font-body text-[9px] tracking-[0.3em] uppercase gradient-gold-glow mb-3">Where would you like to start?</p>
            <h2 className="font-display text-3xl md:text-4xl text-foreground italic">Choose your pathway</h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {OFFERS.map(o => <CoachingOfferCard key={o.title} {...o} />)}
          </div>
        </div>
      </section>

      {/* Why work with Gannon */}
      <section className="py-16 px-4 md:px-6 bg-card/20">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <p className="font-body text-[9px] tracking-[0.3em] uppercase gradient-gold-glow mb-3">Why this work</p>
            <h2 className="font-display text-3xl text-foreground italic">Why work with Gannon?</h2>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {WHY_ITEMS.map((item, i) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
                className="flex gap-3 p-4 bg-card/40 border border-border/30 rounded-xl"
              >
                <span className="text-primary mt-0.5">✦</span>
                <div>
                  <p className="font-body text-sm font-semibold text-foreground">{item.label}</p>
                  <p className="font-body text-xs text-muted-foreground mt-0.5">{item.detail}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* This is for you if */}
      <section className="py-16 px-4 md:px-6">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <p className="font-body text-[9px] tracking-[0.3em] uppercase gradient-gold-glow mb-3">Is this for you?</p>
            <h2 className="font-display text-3xl text-foreground italic mb-8">This is for you if…</h2>
          </motion.div>
          <div className="space-y-3 text-left max-w-xl mx-auto">
            {[
              'You are tired of apologising for having needs',
              'You have spent years shrinking yourself to keep the peace',
              'You have just come out of something painful and need help finding your footing',
              'You know what you want but keep talking yourself out of it',
              'You are a creative person who has lost their voice or confidence',
              'You are ready to stop waiting for someone else to validate your worth',
              'You want practical support, not just someone to talk at',
            ].map((line, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className="flex items-start gap-3"
              >
                <span className="text-primary text-sm mt-0.5 shrink-0">→</span>
                <p className="font-body text-sm text-foreground/80">{line}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Quote */}
      <section className="py-12 px-4">
        <CoachingSignatureLine line="You are not too broken to rebuild." />
      </section>

      {/* CTA block */}
      <section className="py-16 px-4 bg-card/30">
        <div className="max-w-2xl mx-auto text-center space-y-5">
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="font-display text-3xl text-foreground italic mb-4">Ready to start?</h2>
            <p className="font-body text-sm text-muted-foreground mb-8">Book a clarity session or download the free Self Respect Reset Workbook to start right now.</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link to="/coaching/intake">
                <Button className="gradient-gold-button border-0 rounded-full px-8 py-5 font-body text-sm tracking-wider uppercase">
                  Book a Clarity Session
                </Button>
              </Link>
              <Link to="/coaching/workbooks">
                <Button variant="outline" className="rounded-full px-8 py-5 font-body text-sm tracking-wider uppercase border-foreground/20">
                  Free Workbooks
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Workbooks teaser */}
      <section className="py-10 px-4 md:px-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-card/40 border border-primary/20 rounded-2xl p-8 text-center">
            <p className="font-body text-[9px] tracking-[0.3em] uppercase gradient-gold-glow mb-3">Free resources</p>
            <h3 className="font-display text-2xl text-foreground italic mb-2">Start with the workbooks</h3>
            <p className="font-body text-sm text-muted-foreground mb-6">Six reflection and action workbooks — some free, some paid. All built around the same core work Gannon does in sessions.</p>
            <Link to="/coaching/workbooks">
              <Button variant="outline" className="rounded-full px-6 py-4 font-body text-xs tracking-widest uppercase border-primary/30 text-primary hover:bg-primary/10">
                View Workbook Library →
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="py-10 px-4">
        <CoachingDisclaimer />
      </section>
    </div>
  );
}