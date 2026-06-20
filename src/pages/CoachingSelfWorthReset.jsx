import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import CoachingHero from '@/components/coaching/CoachingHero';
import CoachingSignatureLine from '@/components/coaching/CoachingSignatureLine';
import CoachingDisclaimer from '@/components/coaching/CoachingDisclaimer';

const WHO_ITS_FOR = [
  'People who have spent years questioning whether they are enough',
  'Those who apologise constantly — for having feelings, needs, or opinions',
  'People who stayed too long in relationships, jobs, or situations that dimmed them',
  'Anyone emerging from a painful chapter who needs help finding their centre again',
  'People who know they deserve better but do not fully believe it yet',
];

const WHAT_WE_COVER = [
  { label: 'Where your self worth narrative came from', detail: 'We trace it. We name it. We stop letting it run the show.' },
  { label: 'The beliefs that are keeping you small', detail: 'Identifying the internal stories that are older than you think.' },
  { label: 'What your needs actually are', detail: 'Not what you think you are allowed to need. What you actually need.' },
  { label: 'What self worth looks like as a daily practice', detail: 'Not a mindset shift. An actual practice you can use.' },
  { label: 'One clear next step', detail: 'Something concrete you can do within 48 hours of our session.' },
];

const WHAT_THEY_LEAVE_WITH = [
  'Clarity on the core belief that has been driving the pattern',
  'A written values statement (if we have time, or as follow-up)',
  'One practical action to take within 48 hours',
  'The Self Respect Reset Workbook (free, emailed after session)',
  'An honest sense of whether continued sessions would serve you',
];

export default function CoachingSelfWorthReset() {
  return (
    <div className="min-h-screen">
      <CoachingHero
        badge="Self Worth Reset Session"
        hook="What if the problem was never that you were not enough?"
        subhook="A focused coaching session for people who have spent too long questioning their worth, apologising for their needs, or staying small to keep the peace."
        primaryCTA="Book This Session"
        primaryLink="/coaching/intake"
        secondaryCTA="Download the Free Workbook"
        secondaryLink="/coaching/workbooks"
      />

      {/* Who it's for */}
      <section className="py-16 px-4 md:px-6">
        <div className="max-w-3xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-8">
            <p className="font-body text-[9px] tracking-[0.3em] uppercase gradient-gold-glow mb-3">Who this is for</p>
            <h2 className="font-display text-3xl text-foreground italic">This session is for you if…</h2>
          </motion.div>
          <div className="space-y-3">
            {WHO_ITS_FOR.map((line, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }} className="flex items-start gap-3 bg-card/40 border border-border/30 rounded-xl p-4">
                <span className="text-primary shrink-0 mt-0.5">→</span>
                <p className="font-body text-sm text-foreground/80">{line}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Signature line */}
      <section className="py-8 px-4">
        <CoachingSignatureLine line="Self respect is not revenge. It is coming home to yourself." />
      </section>

      {/* What we work through */}
      <section className="py-16 px-4 md:px-6 bg-card/20">
        <div className="max-w-3xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-8">
            <p className="font-body text-[9px] tracking-[0.3em] uppercase gradient-gold-glow mb-3">What we work through</p>
            <h2 className="font-display text-3xl text-foreground italic">Inside the session</h2>
          </motion.div>
          <div className="space-y-4">
            {WHAT_WE_COVER.map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }} className="flex gap-4 p-5 bg-card/50 border border-border/40 rounded-xl">
                <span className="gradient-gold-text font-display text-lg italic shrink-0">{i + 1}.</span>
                <div>
                  <p className="font-body text-sm font-semibold text-foreground">{item.label}</p>
                  <p className="font-body text-xs text-muted-foreground mt-1">{item.detail}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* What they leave with */}
      <section className="py-16 px-4 md:px-6">
        <div className="max-w-3xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-8">
            <p className="font-body text-[9px] tracking-[0.3em] uppercase gradient-gold-glow mb-3">After the session</p>
            <h2 className="font-display text-3xl text-foreground italic">What you leave with</h2>
          </motion.div>
          <div className="space-y-2">
            {WHAT_THEY_LEAVE_WITH.map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }} className="flex items-start gap-3 py-2.5 border-b border-border/20">
                <span className="text-primary text-xs mt-1 shrink-0">✦</span>
                <p className="font-body text-sm text-foreground/80">{item}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Price + CTA */}
      <section className="py-16 px-4 bg-card/30">
        <div className="max-w-xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <p className="font-body text-[9px] tracking-[0.3em] uppercase gradient-gold-glow mb-3">Ready to begin?</p>
            <h2 className="font-display text-3xl text-foreground italic mb-2">Self Worth Reset Session</h2>
            <p className="font-body text-xs text-muted-foreground mb-1">60 minutes · Zoom or phone</p>
            <div className="inline-block bg-yellow-500/10 border border-yellow-500/30 rounded-full px-4 py-1.5 mb-6">
              <p className="font-body text-xs text-yellow-400">⚠ Price pending — Gannon to confirm before publishing</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link to="/coaching/intake">
                <Button className="gradient-gold-button border-0 rounded-full px-8 py-5 font-body text-sm tracking-wider uppercase">
                  Book Now
                </Button>
              </Link>
              <Link to="/coaching/workbooks">
                <Button variant="outline" className="rounded-full px-8 py-5 font-body text-sm tracking-wider uppercase border-foreground/20">
                  Free Workbook First
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-8 px-4">
        <CoachingSignatureLine line="Your story is not shame. It is evidence that you survived." size="sm" />
      </section>

      <section className="py-10 px-4">
        <CoachingDisclaimer />
      </section>
    </div>
  );
}