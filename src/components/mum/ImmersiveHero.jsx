import React, { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import HeartOfGold from './HeartOfGold';
import TributeArtworkFeature from './TributeArtworkFeature';
import LivingGardenBackground from './LivingGardenBackground';

export default function ImmersiveHero() {
  const containerRef = useRef(null);
  const { scrollY } = useScroll();
  const [prefersReduced, setPrefersReduced] = useState(false);

  // Parallax offsets for the multi-layered 3D scroll effect
  const backgroundY = useTransform(scrollY, [0, 1200], [0, 250]);
  const headerY = useTransform(scrollY, [0, 800], [0, -120]);
  const headerOpacity = useTransform(scrollY, [0, 500], [1, 0]);
  const artworkY = useTransform(scrollY, [0, 1200], [0, -60]);
  const artworkScale = useTransform(scrollY, [0, 1200], [1, 0.94]);
  const quoteY = useTransform(scrollY, [0, 850], [0, 80]);
  const quoteOpacity = useTransform(scrollY, [0, 550], [1, 0]);
  
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
      className="relative overflow-hidden min-h-screen flex flex-col justify-center py-12 border-b border-primary/5"
      style={{ background: '#080606' }}
    >
      {/* 1. Background layer: Living garden atmosphere moving slowly */}
      {!prefersReduced ? (
        <motion.div 
          className="absolute inset-0 z-0 pointer-events-none"
          style={{ y: backgroundY }}
        >
          <LivingGardenBackground />
        </motion.div>
      ) : (
        <div className="absolute inset-0 z-0 pointer-events-none">
          <LivingGardenBackground />
        </div>
      )}

      {/* Page content wrapper */}
      <div className="relative z-10 mx-auto max-w-5xl w-full px-6 flex flex-col items-center justify-center">

        {/* 2. Intro layer: moves upwards and fades out on scroll */}
        <motion.div
          className="text-center mb-6 flex flex-col items-center gap-3 w-full"
          style={prefersReduced ? {} : { y: headerY, opacity: headerOpacity }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
        >
          {/* Small label */}
          <p className="font-body text-[9px] tracking-[0.7em] uppercase text-primary/45">A Tribute</p>

          {/* Heart of Gold — small, elegant, above the title */}
          <HeartOfGold size="sm" />

          {/* Main page title */}
          <h1 className="font-display text-5xl md:text-7xl text-foreground leading-none">
            For Mum
          </h1>

          {/* Subtitle */}
          <p className="font-body text-sm md:text-base text-foreground/55 max-w-md leading-relaxed">
            A living garden tribute to Sonia Katisa Waye.
          </p>
        </motion.div>

        {/* 3. Artwork layer: Sonia in her garden drifts on scroll with subtle scale */}
        <motion.div
          className="w-full flex justify-center z-10"
          style={prefersReduced ? {} : { y: artworkY, scale: artworkScale }}
        >
          <TributeArtworkFeature />
        </motion.div>

        {/* 4. Quote & Action Layer: drifts downwards/out and fades on scroll */}
        <motion.div
          className="text-center mt-6 max-w-2xl w-full flex flex-col items-center gap-5 z-20"
          style={prefersReduced ? {} : { y: quoteY, opacity: quoteOpacity }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.9 }}
        >
          {/* Name + dates */}
          <div>
            <p className="font-display text-lg italic text-foreground/75">Sonia Katisa Waye</p>
            <p className="font-body text-xs text-primary/45 tracking-[0.5em] mt-1">1961 – 2022</p>
          </div>

          {/* Primary lyric quote */}
          <blockquote
            className="border-l-2 border-primary/30 pl-5 text-left max-w-md bg-black/10 backdrop-blur-sm p-4 rounded-r-xl border-y border-r border-white/5"
            style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.2)' }}
          >
            <p className="font-display text-xl md:text-2xl italic text-foreground/85 leading-relaxed">
              "Your last breath took mine away,<br />
              there's not much more I have to say."
            </p>
            <p className="font-body text-[10px] text-muted-foreground/40 mt-2 tracking-[0.22em] uppercase">
              Without You Here · Gannon Waye · Mother's Day 2026
            </p>
          </blockquote>

          {/* Subline */}
          <p className="font-body text-sm text-foreground/45 leading-relaxed max-w-sm">
            A tribute to the woman whose love, wisdom, strength and protection still carry me.
          </p>

          {/* CTA buttons */}
          <div className="flex flex-wrap justify-center gap-3 mt-2">
            <a href="#who-she-was">
              <button className="gradient-gold-button rounded-full font-body text-xs tracking-wider uppercase px-7 py-3 border-0 shadow-lg">
                Enter Her Garden
              </button>
            </a>
            <a href="#sonias-garden">
              <button className="rounded-full border border-primary/35 text-primary/80 hover:bg-primary/10 font-body text-xs tracking-wider uppercase px-7 py-3 transition-colors bg-black/25 backdrop-blur-sm">
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