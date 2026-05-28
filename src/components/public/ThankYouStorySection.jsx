import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const PULL_QUOTE = '"Thankyou" is not a revenge song. It is a cinematic reflection on emotional survival, reclaiming personal power, and finding freedom in finally choosing yourself.';

const STORY_PARAGRAPHS = [
  'Written in Serra Negra, in the state of São Paulo, Brazil, "Thankyou" was born during a deeply personal moment of reflection — the moment the decision was finally made to leave.',
  'The song captures the emotional breaking point where clarity begins to overpower fear, and survival slowly transforms into self-liberation. From the very beginning, both the song and accompanying visual journey are intentionally direct, emotionally tense, and quietly mysterious.',
  'Through intimate close-ups, reflective expressions, and cinematic landscapes, the video mirrors the internal weight of emotional control, isolation, psychological exhaustion, and the gradual loss of identity explored throughout the lyrics.',
  'As the track unfolds, the chorus becomes a triumphant emotional release — no longer trapped in silence, fear, or manipulation, but reclaiming autonomy, truth, and self-worth.',
  'Themes of family, emotional trauma, and the painful process of recognising unhealthy dynamics are woven throughout the story, grounding the song in lived experience rather than fantasy.',
  'The bridge marks a major emotional shift within both the music and visuals. What begins as heaviness and emotional confinement slowly softens into reflection, gratitude, and emotional freedom.',
  'The video transitions into movement, dancing, smiling, openness, and warmth — symbolising the internal breakthrough that finally allowed space for peace, authenticity, and joy to return.',
  'At its core, "Thankyou" is not a revenge song. It is a cinematic reflection on emotional survival, reclaiming personal power, and finding freedom in finally choosing yourself.',
];

export default function ThankYouStorySection() {
  const [expanded, setExpanded] = useState(false);

  const visibleParagraphs = expanded ? STORY_PARAGRAPHS : STORY_PARAGRAPHS.slice(0, 2);

  return (
    <section className="py-16 md:py-24 px-4 md:px-6 relative">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <p className="font-body text-xs tracking-[0.3em] uppercase gradient-gold-glow mb-4">The Story</p>
          <h2 className="font-display text-3xl md:text-5xl text-foreground">The Story Behind "Thankyou"</h2>
        </motion.div>

        {/* Desktop: two-column layout */}
        <div className="hidden md:grid md:grid-cols-[1fr_1.4fr] gap-12 items-start">
          {/* Left: pull quote + CTAs */}
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="sticky top-32 space-y-8"
          >
            <div className="border-l-2 border-primary pl-6">
              <p className="font-display text-lg md:text-xl gradient-gold-glow italic leading-relaxed">
                {PULL_QUOTE}
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <Link to="/music">
                <button className="w-full gradient-gold-button rounded-full px-6 py-3 font-body text-xs tracking-[0.2em] uppercase">
                  Pre-Save Thankyou
                </button>
              </Link>
              <Link to="/back-this">
                <button className="w-full border border-primary/40 text-primary rounded-full px-6 py-3 font-body text-xs tracking-[0.2em] uppercase hover:bg-primary/10 transition-all">
                  Support the Project
                </button>
              </Link>
              <Link to="/founding-supporter">
                <button className="w-full border border-border/40 text-foreground/70 rounded-full px-6 py-3 font-body text-xs tracking-[0.2em] uppercase hover:border-primary/30 transition-all">
                  Join Founding Supporters
                </button>
              </Link>
              <Link to="/store">
                <button className="w-full border border-border/40 text-foreground/70 rounded-full px-6 py-3 font-body text-xs tracking-[0.2em] uppercase hover:border-primary/30 transition-all">
                  Visit Store
                </button>
              </Link>
            </div>
          </motion.div>

          {/* Right: full story */}
          <motion.div
            initial={{ opacity: 0, x: 16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="font-body text-foreground/70 leading-relaxed text-sm space-y-5"
          >
            {STORY_PARAGRAPHS.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </motion.div>
        </div>

        {/* Mobile: collapsed preview */}
        <div className="md:hidden space-y-5">
          <div className="border-l-2 border-primary pl-5 mb-6">
            <p className="font-display text-base gradient-gold-glow italic leading-relaxed">
              {PULL_QUOTE}
            </p>
          </div>
          <div className="font-body text-foreground/70 leading-relaxed text-sm space-y-4">
            {visibleParagraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
          {!expanded && (
            <div className="relative">
              <div className="absolute -top-8 left-0 right-0 h-8 bg-gradient-to-t from-background to-transparent" />
              <button
                onClick={() => setExpanded(true)}
                className="w-full border border-primary/30 text-primary rounded-full py-3 font-body text-xs tracking-[0.2em] uppercase hover:bg-primary/10 transition-all"
              >
                Read the full story
              </button>
            </div>
          )}

          <div className="flex flex-col gap-3 pt-4">
            <Link to="/music">
              <button className="w-full gradient-gold-button rounded-full px-6 py-3 font-body text-xs tracking-[0.2em] uppercase">
                Pre-Save Thankyou
              </button>
            </Link>
            <Link to="/back-this">
              <button className="w-full border border-primary/40 text-primary rounded-full px-6 py-3 font-body text-xs tracking-[0.2em] uppercase hover:bg-primary/10 transition-all">
                Support the Project
              </button>
            </Link>
            <Link to="/founding-supporter">
              <button className="w-full border border-border/40 text-foreground/70 rounded-full px-6 py-3 font-body text-xs tracking-[0.2em] uppercase hover:border-primary/30 transition-all">
                Join Founding Supporters
              </button>
            </Link>
            <Link to="/store">
              <button className="w-full border border-border/40 text-foreground/70 rounded-full px-6 py-3 font-body text-xs tracking-[0.2em] uppercase hover:border-primary/30 transition-all">
                Visit Store
              </button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}