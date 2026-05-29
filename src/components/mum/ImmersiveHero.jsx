import React, { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';

// The approved tribute artwork — Sonia with burgundy robe, dogs, garden, gold heart, swallow emblem
// Version with album cover on the mug (image 4 from the approved set)
const HERO_ARTWORK = 'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/74273a2aa_image.png';
// Cinematic hero direction artwork (image 2)
const HERO_CINEMATIC = 'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/4405e92ec_image.png';

// HeartOfGold SVG emblem
function HeartOfGold() {
  return (
    <motion.div
      className="flex items-center justify-center mb-6"
      animate={{ filter: ['drop-shadow(0 0 8px rgba(212,175,55,0.3))', 'drop-shadow(0 0 18px rgba(212,175,55,0.55))', 'drop-shadow(0 0 8px rgba(212,175,55,0.3))'] }}
      transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
    >
      <svg viewBox="0 0 180 160" width="120" height="107" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Heart outline */}
        <motion.path
          d="M90 148 C 20 88 5 40 38 14 C 62 -4 84 8 90 30 C 96 8 118 -4 142 14 C 175 40 160 88 90 148 Z"
          stroke="rgba(212,175,55,0.9)"
          strokeWidth="2.5"
          fill="rgba(212,175,55,0.05)"
          animate={{ scale: [1, 1.04, 1], opacity: [0.82, 1, 0.82] }}
          transition={{ duration: 3.6, repeat: Infinity, ease: 'easeInOut' }}
          style={{ transformOrigin: '90px 80px' }}
        />
        {/* Inner glow */}
        <motion.ellipse
          cx="90" cy="80"
          rx="42" ry="38"
          fill="rgba(212,175,55,0.06)"
          animate={{ opacity: [0.1, 0.3, 0.1], ry: [38, 42, 38] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        />
        {/* Swallow silhouette */}
        <path
          d="M72 72 C 65 62 54 60 50 65 C 47 69 52 74 60 73 C 64 73 68 75 72 72 Z M 108 72 C 115 62 126 60 130 65 C 133 69 128 74 120 73 C 116 73 112 75 108 72 Z M 72 72 C 80 68 90 62 90 62 C 90 62 100 68 108 72 C 100 76 90 82 90 82 C 90 82 80 76 72 72 Z"
          fill="rgba(212,175,55,0.75)"
        />
        {/* MUM text */}
        <text
          x="90" y="106"
          textAnchor="middle"
          fill="rgba(212,175,55,0.9)"
          fontSize="13"
          fontFamily="Georgia, serif"
          letterSpacing="4"
          style={{ textTransform: 'uppercase' }}
        >MUM</text>
        {/* Orbit shimmer dots */}
        {[0, 60, 120, 180, 240, 300].map((deg, i) => {
          const rad = (deg * Math.PI) / 180;
          const cx = 90 + 68 * Math.cos(rad);
          const cy = 75 + 58 * Math.sin(rad);
          return (
            <motion.circle
              key={i}
              cx={cx} cy={cy}
              r="1.5"
              fill="rgba(212,175,55,0.6)"
              animate={{ opacity: [0.2, 0.8, 0.2] }}
              transition={{ duration: 2.4, repeat: Infinity, delay: i * 0.4, ease: 'easeInOut' }}
            />
          );
        })}
      </svg>
    </motion.div>
  );
}

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
          >
            <HeartOfGold />
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