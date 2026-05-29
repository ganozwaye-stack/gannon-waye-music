import React, { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import HeartOfGold from './HeartOfGold';

// The approved tribute artwork — Sonia with burgundy robe, dogs, garden, gold heart, swallow emblem
// Version with album cover on the mug (image 4 from the approved set)
const HERO_ARTWORK = 'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/74273a2aa_image.png';
// Cinematic hero direction artwork (image 2)
const HERO_CINEMATIC = 'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/4405e92ec_image.png';



export default function ImmersiveHero() {
  const containerRef = useRef(null);
  const { scrollY } = useScroll();
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const [prefersReduced, setPrefersReduced] = useState(false);

  const bgY = useTransform(scrollY, [0, 600], [0, 60]);
  const textY = useTransform(scrollY, [0, 600], [0, -25]);
  const fadeOut = useTransform(scrollY, [0, 400], [1, 0]);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReduced(mq.matches);
    const handler = (e) => setPrefersReduced(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  useEffect(() => {
    if (prefersReduced) return;
    const handleMouseMove = (e) => {
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      setMouse({ x: (e.clientX - cx) / cx, y: (e.clientY - cy) / cy });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [prefersReduced]);

  const px = prefersReduced ? 0 : mouse.x;
  const py = prefersReduced ? 0 : mouse.y;

  return (
    <section
      ref={containerRef}
      data-testid="mum-hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Deep base */}
      <div className="absolute inset-0 z-0" style={{
        background: 'linear-gradient(150deg, #080306 0%, #120609 30%, #090d06 55%, #060806 100%)'
      }} />

      {/* Hero artwork — Sonia with album cover on mug */}
      <motion.div
        className="absolute inset-0 z-[1]"
        style={{ y: prefersReduced ? 0 : bgY, x: px * -6 }}
      >
        <img
          src={HERO_ARTWORK}
          alt="Sonia Katisa Waye — For Mum tribute"
          className="w-full h-full object-cover object-center"
          style={{
            objectPosition: 'center top',
            maskImage: 'linear-gradient(to bottom, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.7) 50%, rgba(0,0,0,0.15) 85%, transparent 100%)',
            WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.7) 50%, rgba(0,0,0,0.15) 85%, transparent 100%)',
          }}
        />
      </motion.div>

      {/* Dark overlay gradient for text legibility */}
      <div className="absolute inset-0 z-[2]" style={{
        background: 'linear-gradient(to right, rgba(8,3,6,0.88) 0%, rgba(8,3,6,0.60) 40%, rgba(8,3,6,0.25) 70%, transparent 100%), linear-gradient(to bottom, rgba(8,3,6,0.5) 0%, transparent 30%, rgba(8,3,6,0.6) 75%, rgba(8,3,6,0.98) 100%)'
      }} />

      {/* Warm gold atmospheric glow */}
      <motion.div
        className="absolute inset-0 z-[3] pointer-events-none"
        animate={{ opacity: [0.06, 0.14, 0.06] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        style={{ background: 'radial-gradient(ellipse at 60% 30%, rgba(180,100,30,0.22) 0%, transparent 60%)' }}
      />
      {/* Burgundy warmth */}
      <div className="absolute inset-0 z-[3] pointer-events-none" style={{
        background: 'radial-gradient(ellipse at 20% 65%, rgba(100,20,35,0.14) 0%, transparent 55%)'
      }} />

      {/* Gold floating particles */}
      <div className="absolute inset-0 z-[4] pointer-events-none overflow-hidden">
        {[...Array(14)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              width: `${2 + (i % 3)}px`,
              height: `${2 + (i % 3)}px`,
              background: `rgba(212,175,55,${0.12 + (i % 4) * 0.07})`,
              left: `${6 + (i * 6.8) % 88}%`,
              top: `${10 + (i * 9) % 75}%`,
            }}
            animate={prefersReduced ? {} : { y: [-8, -28, -8], opacity: [0.08, 0.45, 0.08] }}
            transition={{ duration: 4 + (i % 4), repeat: Infinity, delay: i * 0.35, ease: 'easeInOut' }}
          />
        ))}
      </div>

      {/* Hero text layer */}
      <motion.div
        className="relative z-[5] w-full max-w-5xl mx-auto px-6 md:px-14 flex items-center min-h-screen"
        style={{ y: prefersReduced ? 0 : textY }}
      >
        <div className="max-w-lg pt-24 pb-28">

          {/* Heart of Gold emblem */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, delay: 0.3 }}
            className="flex justify-center"
          >
            <HeartOfGold size="lg" />
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.5 }}
            className="font-body text-[9px] tracking-[0.8em] uppercase text-primary/45 mb-4 text-center"
          >
            A Tribute
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.4, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="font-display text-6xl md:text-8xl text-foreground leading-none mb-3 text-center"
          >
            For Mum
          </motion.h1>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.0 }}
            className="text-center mb-1"
          >
            <p className="font-display text-lg md:text-xl text-foreground/60 italic">Sonia Katisa Waye</p>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.15 }}
            className="font-body text-xs text-primary/50 tracking-[0.5em] mb-8 text-center"
          >
            1961 – 2022
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.4, duration: 1 }}
            className="border-l-2 border-primary/30 pl-5 mb-8"
          >
            <p className="font-display text-xl md:text-2xl italic text-foreground/80 leading-relaxed">
              "Your last breath took mine away,<br />
              there's not much more I have to say."
            </p>
            <p className="font-body text-[10px] text-muted-foreground/40 mt-3 tracking-[0.25em] uppercase">
              Without You Here · Gannon Waye · Mother's Day 2026
            </p>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.7 }}
            className="font-body text-sm text-foreground/45 leading-relaxed mb-10 max-w-sm"
          >
            A tribute to the woman whose love, wisdom, strength and protection still carry me.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.9 }}
            className="flex flex-wrap gap-3"
          >
            <a href="#who-she-was">
              <Button className="rounded-full gradient-gold-button border-0 font-body text-xs tracking-wider uppercase px-7 py-5">
                Enter Her Garden
              </Button>
            </a>
            <a href="#sonias-garden">
              <Button variant="outline" className="rounded-full border-primary/30 text-primary/80 hover:bg-primary/10 font-body text-xs tracking-wider uppercase px-7 py-5">
                Hear Her Wisdom
              </Button>
            </a>
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll cue */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-[6] flex flex-col items-center gap-2"
        style={{ opacity: fadeOut }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.4 }}
      >
        <motion.div animate={{ y: [0, 10, 0] }} transition={{ duration: 2.5, repeat: Infinity }}>
          <ChevronDown className="w-5 h-5 text-primary/30" />
        </motion.div>
      </motion.div>
    </section>
  );
}