import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import CoachingHero from '@/components/coaching/CoachingHero';
import CoachingSignatureLine from '@/components/coaching/CoachingSignatureLine';
import CoachingDisclaimer from '@/components/coaching/CoachingDisclaimer';

const PATHWAY_STEPS = [
  { label: 'Values Check', detail: 'We start by naming what you actually value — not what you think you should value. This becomes your decision-making compass.' },
  { label: 'Red Flag Reflection', detail: 'We identify the patterns — in relationships, workplaces, or family systems — that have repeatedly crossed your line.' },
  { label: 'Boundary Scripts', detail: 'You leave with actual language. Not vague instructions. Words you can use in real conversations.' },
  { label: 'Over-explaining Audit', detail: 'We identify where you justify yourself unnecessarily and practise communicating without over-explaining or seeking approval.' },
  { label: 'Action Plan', detail: 'A clear, practical next step you can take within days — not months.' },
];

const SCRIPTS_PREVIEW = [
  '"I am not available for that."',
  '"That does not work for me."',
  '"I hear you. My answer is still no."',
  '"I am not going to continue this conversation while it is this heated."',
  '"This is where I end my involvement."',
];

export default function CoachingBoundaries() {
  return (
    <div className="min-h-screen">
      <CoachingHero
        badge="Boundaries & Self Respect Mentoring"
        hook="Respect is earned. Not a game you make me play."
        subhook="A practical mentoring pathway for people learning to stop over-explaining, over-giving, and abandoning themselves to manage someone else's comfort."
        primaryCTA="Book a Session"
        primaryLink="/coaching/intake"
        secondaryCTA="Download Workbook"
        secondaryLink="/coaching/workbooks"
      />

      {/* What this is */}
      <section className="py-16 px-4 md:px-6">
        <div className="max-w-3xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-6">
            <p className="font-body text-[9px] tracking-[0.3em] uppercase gradient-gold-glow mb-3">The real problem</p>
            <h2 className="font-display text-3xl text-foreground italic mb-4">You were not taught to have boundaries. You were taught to be easy.</h2>
            <p className="font-body text-sm text-muted-foreground leading-relaxed">
              Easy to be around. Easy to manage. Easy to overlook. Boundaries were framed as aggression, as selfishness, as making things hard for everyone else. So you learned to swallow your needs and call it being a good person.
            </p>
            <p className="font-body text-sm text-muted-foreground leading-relaxed mt-3">
              This mentoring pathway helps you unlearn that. Not loudly. Not aggressively. Practically.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Pathway steps */}
      <section className="py-16 px-4 md:px-6 bg-card/20">
        <div className="max-w-3xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-8">
            <p className="font-body text-[9px] tracking-[0.3em] uppercase gradient-gold-glow mb-3">The pathway</p>
            <h2 className="font-display text-3xl text-foreground italic">What we work through</h2>
          </motion.div>
          <div className="space-y-4">
            {PATHWAY_STEPS.map((step, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }} className="flex gap-4 p-5 bg-card/50 border border-border/40 rounded-xl">
                <span className="gradient-gold-text font-display text-xl italic shrink-0 w-6">{i + 1}.</span>
                <div>
                  <p className="font-body text-sm font-semibold text-foreground">{step.label}</p>
                  <p className="font-body text-xs text-muted-foreground mt-1">{step.detail}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Signature line */}
      <section className="py-10 px-4">
        <CoachingSignatureLine line="Thank you for teaching me who I am not anymore." />
      </section>

      {/* Boundary scripts preview */}
      <section className="py-16 px-4 md:px-6">
        <div className="max-w-3xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-8 text-center">
            <p className="font-body text-[9px] tracking-[0.3em] uppercase gradient-gold-glow mb-3">Sample scripts</p>
            <h2 className="font-display text-3xl text-foreground italic">Words you will actually be able to use</h2>
            <p className="font-body text-xs text-muted-foreground mt-2">A sample from the Boundaries After Breakdown Workbook</p>
          </motion.div>
          <div className="space-y-3">
            {SCRIPTS_PREVIEW.map((script, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }} className="bg-card/40 border-l-2 border-primary/50 pl-5 pr-4 py-3 rounded-r-xl">
                <p className="font-display text-base italic text-foreground/90">{script}</p>
              </motion.div>
            ))}
          </div>
          <p className="font-body text-xs text-muted-foreground text-center mt-6 italic">The full workbook includes context, practice exercises, and boundary-setting frameworks.</p>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 bg-card/30">
        <div className="max-w-xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="font-display text-3xl text-foreground italic mb-2">Boundaries & Self Respect Mentoring</h2>
            <p className="font-body text-xs text-muted-foreground mb-1">60 minutes · Zoom or phone · Follow-up pathway available</p>
            <div className="inline-block bg-primary/10 border border-primary/30 rounded-full px-4 py-1.5 mb-6">
              <p className="font-body text-xs text-primary">⚠ Price pending — Gannon to confirm before publishing</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link to="/coaching/intake">
                <Button className="gradient-gold-button border-0 rounded-full px-8 py-5 font-body text-sm tracking-wider uppercase">
                  Book Now
                </Button>
              </Link>
              <Link to="/coaching/workbooks">
                <Button variant="outline" className="rounded-full px-8 py-5 font-body text-sm tracking-wider uppercase border-foreground/20">
                  Boundaries Workbook
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