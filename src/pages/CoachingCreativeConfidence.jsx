import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import CoachingHero from '@/components/coaching/CoachingHero';
import CoachingSignatureLine from '@/components/coaching/CoachingSignatureLine';
import CoachingDisclaimer from '@/components/coaching/CoachingDisclaimer';

const WHO_ITS_FOR = [
  'Artists, musicians, and singers who have lost their confidence',
  'Writers who have stopped writing because someone told them it was not good enough',
  'Creators who keep their work private because they are scared of being judged',
  'People rebuilding their identity after a relationship or situation took their voice',
  'Anyone who has been told they are too much, too sensitive, or too intense',
  'People who want to use creative expression as a pathway to clarity and purpose',
];

const WHAT_WE_COVER = [
  { label: 'Why you stopped', detail: 'We trace the moment — or moments — where the voice went quiet. Because naming it is the first step to reclaiming it.' },
  { label: 'The inner critic audit', detail: 'We identify whose voice that actually is. It is rarely your own.' },
  { label: 'Expression as identity', detail: 'We reconnect what you create to who you actually are — not who you think you are allowed to be.' },
  { label: 'The practical next creative step', detail: 'Not a grand plan. One small, real thing you will actually do.' },
  { label: 'Story as strength', detail: 'Your experience is not baggage. It is material. It is the thing that will make your work matter to someone else.' },
];

export default function CoachingCreativeConfidence() {
  return (
    <div className="min-h-screen">
      <CoachingHero
        badge="Creative Confidence Mentoring"
        hook="What if the voice you have been hiding is the thing someone else needs to hear?"
        subhook="Support for artists, creators, singers, writers, and people rebuilding their confidence through expression, purpose, and story."
        primaryCTA="Book a Session"
        primaryLink="/coaching/intake"
        secondaryCTA="View Workbooks"
        secondaryLink="/coaching/workbooks"
      />

      {/* Gannon's context */}
      <section className="py-16 px-4 md:px-6">
        <div className="max-w-3xl mx-auto">
          <div className="bg-card/40 border-l-4 border-primary/50 pl-6 py-6 pr-4 rounded-r-2xl">
            <p className="font-body text-[9px] tracking-[0.3em] uppercase gradient-gold-glow mb-3">From Gannon</p>
            <p className="font-body text-sm text-foreground/80 leading-relaxed italic">
              "I stopped writing for a long time. Not because I had nothing to say — but because I had been around people who made me feel like what I had to say was not worth hearing. I know what it is like to reclaim your voice after someone has tried to take it. That is the thing I can help you with."
            </p>
          </div>
        </div>
      </section>

      {/* Who it's for */}
      <section className="py-16 px-4 md:px-6 bg-card/20">
        <div className="max-w-3xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-8">
            <p className="font-body text-[9px] tracking-[0.3em] uppercase gradient-gold-glow mb-3">Is this for you?</p>
            <h2 className="font-display text-3xl text-foreground italic">This is for you if…</h2>
          </motion.div>
          <div className="space-y-3">
            {WHO_ITS_FOR.map((line, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }} className="flex items-start gap-3 bg-card/40 border border-border/30 rounded-xl p-4">
                <span className="text-primary shrink-0 mt-0.5">→</span>
                <p className="font-body text-sm text-foreground/80">{line}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Signature */}
      <section className="py-10 px-4">
        <CoachingSignatureLine line="Still here." />
      </section>

      {/* What we cover */}
      <section className="py-16 px-4 md:px-6">
        <div className="max-w-3xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-8">
            <p className="font-body text-[9px] tracking-[0.3em] uppercase gradient-gold-glow mb-3">What we cover</p>
            <h2 className="font-display text-3xl text-foreground italic">Inside the sessions</h2>
          </motion.div>
          <div className="space-y-4">
            {WHAT_WE_COVER.map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }} className="flex gap-4 p-5 bg-card/50 border border-border/40 rounded-xl">
                <span className="gradient-gold-text font-display text-xl italic shrink-0 w-6">{i + 1}.</span>
                <div>
                  <p className="font-body text-sm font-semibold text-foreground">{item.label}</p>
                  <p className="font-body text-xs text-muted-foreground mt-1">{item.detail}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 bg-card/30">
        <div className="max-w-xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="font-display text-3xl text-foreground italic mb-2">Creative Confidence Mentoring</h2>
            <p className="font-body text-xs text-muted-foreground mb-1">60 minutes · Zoom or phone · Ongoing pathway available</p>
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
                  Creative Workbook
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-10 px-4">
        <CoachingDisclaimer />
      </section>
    </div>
  );
}