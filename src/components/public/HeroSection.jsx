import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import CountdownTimer from './CountdownTimer';
import ParticleCanvas from './ParticleCanvas';

const EASE_STD = [0.4, 0.0, 0.2, 1];
const EASE_EMO = [0.0, 0.0, 0.2, 1];

// Shimmer keyframe via inline style injection
const SHIMMER_CSS = `
@keyframes shimmer-pass {
  0%   { background-position: -200% center; }
  100% { background-position: 200% center; }
}
.hero-title-shimmer {
  background: linear-gradient(
    90deg,
    #c9a84c 0%,
    #f5d06e 35%,
    #fff8d6 48%,
    #ffe08a 52%,
    #f5d06e 65%,
    #c9a84c 100%
  );
  background-size: 200% auto;
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: shimmer-pass 1.2s ease-out 1.4s 1 forwards;
}
`;

export default function HeroSection({ site, releases }) {
  const [bgReady, setBgReady] = useState(false);
  const upcomingRelease = releases?.find(r => r.status !== 'released' && r.release_date);

  useEffect(() => {
    const img = new Image();
    img.src = 'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/c053c0cf4_generated_image.png';
    img.onload = () => setBgReady(true);
  }, []);

  return (
    <section className="relative min-h-[100svh] flex items-center justify-center overflow-hidden">
      <style>{SHIMMER_CSS}</style>

      {/* Background portrait — 0ms → 400ms */}
      <AnimatePresence>
        {bgReady && (
          <motion.img
            key="hero-bg"
            src="https://media.base44.com/images/public/69eb7905ca6eb4180010f794/c053c0cf4_generated_image.png"
            alt="Gannon Waye"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.55 }}
            transition={{ duration: 0.4, ease: EASE_EMO }}
            className="absolute inset-0 w-full h-full object-cover object-[center_50%]"
          />
        )}
      </AnimatePresence>

      {/* Portrait scale — 300ms → 900ms */}
      <motion.div
        className="absolute inset-0"
        initial={{ scale: 1.05 }}
        animate={{ scale: 1.0 }}
        transition={{ duration: 0.6, delay: 0.3, ease: EASE_STD }}
      />

      {/* Particle system — starts at 700ms */}
      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.9, delay: 0.7, ease: EASE_EMO }}
      >
        <ParticleCanvas />
      </motion.div>

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-background/40 to-background/95 z-10" />

      {/* Content */}
      <div className="relative z-20 text-center px-6 max-w-4xl mx-auto">

        {/* Logo — 900ms → 1500ms */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.9, ease: EASE_STD }}
        >
          <img
            src="https://media.base44.com/images/public/69eb7905ca6eb4180010f794/172f64a6b_0fac46594_generated_image-Edited.png"
            alt="Gannon Waye"
            className="hero-title-shimmer max-w-full h-auto mx-auto"
            style={{ maxHeight: '120px' }}
          />
        </motion.div>

        {/* Tagline — 1200ms → 2000ms, line-by-line */}
        {['Singer, Songwriter, Storyteller'].map((line, i) => (
          <motion.p
            key={i}
            className="font-body text-xs tracking-[0.3em] uppercase gradient-gold-glow mt-5 mb-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 1.2 + i * 0.18, ease: EASE_EMO }}
          >
            {line}
          </motion.p>
        ))}

        {/* Bio lines */}
        {[
          'I write songs about the messy, real parts of being human.',
          'The grief that transforms you. The growth that comes from breaking open.',
          'The quiet power of finally becoming yourself.',
        ].map((line, i) => (
          <motion.p
            key={i}
            className="font-body text-sm md:text-base text-foreground/60 leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 1.38 + i * 0.18, ease: EASE_EMO }}
          >
            {line}
          </motion.p>
        ))}

        {/* Debut single teaser strip */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.65, ease: EASE_STD }}
          className="mt-10 inline-flex flex-col sm:flex-row items-center gap-3 sm:gap-5 bg-card/40 backdrop-blur-sm border border-primary/20 rounded-2xl px-6 py-4 mx-auto"
        >
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            <p className="font-body text-[10px] tracking-[0.3em] uppercase gradient-gold-glow">Debut Single</p>
          </div>
          <p className="font-display text-lg text-foreground italic">"Thank You"</p>
          <div className="w-px h-4 bg-border/60 hidden sm:block" />
          <div className="flex flex-col items-center gap-1">
            <p className="font-body text-[10px] tracking-[0.2em] uppercase text-muted-foreground">Artwork & Release Date Reveal</p>
            <CountdownTimer targetDate="2026-05-10T04:00:00Z" />
          </div>
        </motion.div>

        {/* CTA buttons — 1500ms → 2400ms */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 1.5, ease: EASE_STD }}
          className="mt-8 flex flex-col sm:flex-row gap-3 justify-center px-4"
        >
          <Link to="/music" className="w-full sm:w-auto">
            <Button className="gap-2 w-full sm:w-auto px-8 py-5 text-sm tracking-wider uppercase font-body rounded-full gradient-gold-button border-0">
              <Play className="w-4 h-4" /> Explore Music
            </Button>
          </Link>
          <Link to="/community" className="w-full sm:w-auto">
            <Button variant="outline" className="gap-2 w-full sm:w-auto px-8 py-5 text-sm tracking-wider uppercase font-body rounded-full border-foreground/20 hover:bg-foreground/5">
              Join the Community <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}