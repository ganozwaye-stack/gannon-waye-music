import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import HeartOfGold from './HeartOfGold';
import TributeArtworkFeature from './TributeArtworkFeature';
import LivingGardenBackground from './LivingGardenBackground';
import SingleCoverPlaque from './SingleCoverPlaque';

export default function ImmersiveHero() {
  const containerRef = useRef(null);
  const { scrollY } = useScroll();
  const [prefersReduced, setPrefersReduced] = useState(false);

  const fadeOut = useTransform(scrollY, [0, 350], [1, 0]);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReduced(mq.matches);
    const h = (e) => setPrefersReduced(e.matches);
    mq.addEventListener('change', h);
    return () => mq.removeEventListener('change', h);
  }, []);

  return (
    <section
      ref={containerRef}
      data-testid="mum-hero"
      className="relative overflow-hidden"
      style={{ background: '#080606' }}
    >
      {/* Living garden atmosphere behind everything */}
      {!prefersReduced && <LivingGardenBackground />}

      {/* Page content — centred column */}
      <div className="relative z-10 mx-auto max-w-5xl px-6 pt-10 pb-16 md:pt-14 md:pb-20 flex flex-col items-center">

        {/* ── INTRO — above the artwork ── */}
        <motion.div
          className="text-center mb-6 flex flex-col items-center gap-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
        >
          {/* Small label */}
          <p className="font-body text-[9px] tracking-[0.7em] uppercase text-primary/40">A Tribute</p>

          {/* Heart of Gold — small, elegant, above the title */}
          <HeartOfGold size="sm" />

          {/* Main page title */}
          <h1 className="font-display text-5xl md:text-7xl text-foreground leading-none">
            For Mum
          </h1>

          {/* Subtitle */}
          <p className="font-body text-sm md:text-base text-foreground/50 max-w-md leading-relaxed">
            A living garden tribute to Sonia Katisa Waye.
          </p>
        </motion.div>

        {/* ── ARTWORK — the emotional centrepiece ── */}
        <TributeArtworkFeature />

        {/* ── BELOW ARTWORK — quote + dates + CTA ── */}
        <motion.div
          className="text-center mt-6 max-w-2xl w-full flex flex-col items-center gap-5"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.9 }}
        >
          {/* Name + dates */}
          <div>
            <p className="font-display text-lg italic text-foreground/65">Sonia Katisa Waye</p>
            <p className="font-body text-xs text-primary/45 tracking-[0.5em] mt-1">1961 – 2022</p>
          </div>

          {/* Primary lyric quote */}
          <blockquote
            className="border-l-2 border-primary/30 pl-5 text-left max-w-md"
          >
            <p className="font-display text-xl md:text-2xl italic text-foreground/80 leading-relaxed">
              "Your last breath took mine away,<br />
              there's not much more I have to say."
            </p>
            <p className="font-body text-[10px] text-muted-foreground/35 mt-2 tracking-[0.22em] uppercase">
              Without You Here · Gannon Waye · Mother's Day 2026
            </p>
          </blockquote>

          {/* Single cover plaque — ties the tribute to the song */}
          <SingleCoverPlaque size="sm" delay={0.3} />

          {/* Subline */}
          <p className="font-body text-sm text-foreground/40 leading-relaxed max-w-sm">
            A tribute to the woman whose love, wisdom, strength and protection still carry me.
          </p>

          {/* CTA buttons */}
          <div className="flex flex-wrap justify-center gap-3 mt-2">
            <a href="#who-she-was">
              <button className="gradient-gold-button rounded-full font-body text-xs tracking-wider uppercase px-7 py-3 border-0">
                Enter Her Garden
              </button>
            </a>
            <a href="#sonias-garden">
              <button className="rounded-full border border-primary/30 text-primary/75 hover:bg-primary/10 font-body text-xs tracking-wider uppercase px-7 py-3 transition-colors">
                Hear Her Wisdom
              </button>
            </a>
          </div>
        </motion.div>

        {/* Scroll cue */}
        <motion.div
          className="mt-10 flex flex-col items-center gap-1"
          style={{ opacity: fadeOut }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
        >
          <motion.div
            animate={prefersReduced ? {} : { y: [0, 8, 0] }}
            transition={{ duration: 2.5, repeat: Infinity }}
          >
            <ChevronDown className="w-5 h-5 text-primary/25" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}