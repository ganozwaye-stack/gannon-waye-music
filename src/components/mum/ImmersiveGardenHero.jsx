import { useEffect, useState, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Heart, ChevronDown } from 'lucide-react';
import HeartOfGold from './HeartOfGold';

// The real Sonia photos — she is the centrepiece, the garden encircles her
const SONIA_SITTING     = 'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/042dbd116_reel1_s2_keyframe.jpg';
const SONIA_WITH_DOGS   = 'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/215477423_0fdbdb2a-c851-496c-a6d1-e777ae1bfc6a.jpg';
const SONIA_PORTRAIT    = 'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/da5efd6c2_reel1_s2_keyframe1.jpg';

export default function ImmersiveGardenHero() {
  const { scrollY } = useScroll();
  const [prefersReduced, setPrefersReduced] = useState(false);
  const heroRef = useRef(null);

  const fadeText  = useTransform(scrollY, [0, 400], [1, 0]);
  const liftText  = useTransform(scrollY, [0, 400], [0, -60]);
  const soniaY    = useTransform(scrollY, [0, 800], [0,  80]);  // Sonia drifts up slower — feels real

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReduced(mq.matches);
  }, []);

  return (
    <section
      ref={heroRef}
      id="hero"
      data-testid="mum-hero"
      className="relative min-h-screen flex flex-col items-center justify-end overflow-hidden"
      style={{ paddingTop: '0' }}
    >
      {/* ──────────────────────────────────────────────────────────────────
          SONIA CENTREPIECE — she sits in her garden, she IS the garden.
          Three photos are layered in parallax; the deepest is with dogs,
          the mid layer is the atmospheric portrait, the closest is her alone.
      ────────────────────────────────────────────────────────────────── */}

      {/* Deepest photo — garden with dogs (widest, behind everything) */}
      <motion.div
        className="absolute inset-0"
        style={{ y: useTransform(scrollY, [0, 800], [0, 120]) }}
      >
        <img
          src={SONIA_WITH_DOGS}
          alt=""
          style={{
            width: '100%', height: '110%',
            objectFit: 'cover',
            objectPosition: 'center 25%',
            filter: 'brightness(0.36) saturate(0.8) blur(1px)',
          }}
        />
      </motion.div>

      {/* Mid-depth — garden portrait, slightly cropped & warmer */}
      <motion.div
        className="absolute inset-0"
        style={{ y: useTransform(scrollY, [0, 800], [0, 60]) }}
      >
        <img
          src={SONIA_SITTING}
          alt=""
          style={{
            width: '100%', height: '105%',
            objectFit: 'cover',
            objectPosition: 'center 20%',
            filter: 'brightness(0.52) saturate(0.9)',
            mixBlendMode: 'luminosity',
            opacity: 0.6,
          }}
        />
      </motion.div>

      {/* Primary portrait — full luminance, Sonia in full glory */}
      <motion.div
        className="absolute inset-0 flex items-end justify-center"
        style={{ y: soniaY }}
      >
        <img
          src={SONIA_SITTING}
          alt="Sonia Katisa Waye — resting in her garden, surrounded by flowers and candlelight"
          style={{
            width: '100%', height: '100%',
            objectFit: 'cover',
            objectPosition: 'center 15%',
            filter: 'brightness(0.72) contrast(1.06) saturate(1.08)',
          }}
        />
      </motion.div>

      {/* Depth vignette — keeps garden immersion, darkens to black at bottom */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: `
          radial-gradient(ellipse 70% 80% at 50% 45%, transparent 30%, rgba(3,6,3,0.55) 75%, rgba(3,6,3,0.90) 100%),
          linear-gradient(to top, rgba(3,5,3,0.95) 0%, rgba(3,5,3,0.30) 35%, transparent 65%),
          linear-gradient(to bottom, rgba(3,5,3,0.70) 0%, transparent 30%)
        `,
      }} />

      {/* Side forest walls — you're standing inside, not outside */}
      <div className="absolute inset-y-0 left-0 w-1/4 pointer-events-none" style={{
        background: 'linear-gradient(to right, rgba(2,6,2,0.85) 0%, transparent 100%)',
      }} />
      <div className="absolute inset-y-0 right-0 w-1/4 pointer-events-none" style={{
        background: 'linear-gradient(to left, rgba(2,6,2,0.85) 0%, transparent 100%)',
      }} />

      {/* ── TEXT CONTENT: overlay, centred, fades on scroll ── */}
      <motion.div
        className="relative z-20 w-full flex flex-col items-center text-center pb-16 px-6"
        style={{ opacity: fadeText, y: liftText }}
      >
        {/* Tiny label */}
        <p className="font-body text-[8px] tracking-[0.8em] uppercase text-primary/35 mb-4">
          A Tribute · Forever in Our Hearts
        </p>

        {/* Heart of Gold emblem */}
        <HeartOfGold size="lg" />

        {/* Name — large, gold, serif, real gravitas */}
        <div className="mt-5 mb-2">
          <p className="font-display italic text-foreground/45 text-lg md:text-xl mb-1">
            In Loving Memory of
          </p>
          <h1
            className="font-display leading-none"
            style={{
              fontSize: 'clamp(3.2rem, 10vw, 7rem)',
              background: 'linear-gradient(135deg, #c9a84c 0%, #f5d06e 35%, #ffe08a 50%, #f5d06e 65%, #c9a84c 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              textShadow: 'none',
              filter: 'drop-shadow(0 0 24px rgba(212,175,55,0.35))',
            }}
          >
            Sonia
          </h1>
          <h2
            className="font-display text-2xl md:text-4xl text-foreground/80 tracking-wide"
            style={{ letterSpacing: '0.12em' }}
          >
            Katisa Waye
          </h2>
          <p className="font-body text-xs md:text-sm tracking-[0.6em] text-primary/45 mt-3">
            1961 – 2022
          </p>
        </div>

        {/* Heart divider */}
        <div className="flex items-center gap-3 my-4">
          <div className="w-16 h-px" style={{ background: 'linear-gradient(to right, transparent, rgba(212,175,55,0.35))' }} />
          <Heart className="w-3 h-3 text-primary/40" fill="rgba(212,175,55,0.3)" />
          <div className="w-16 h-px" style={{ background: 'linear-gradient(to left, transparent, rgba(212,175,55,0.35))' }} />
        </div>

        {/* Quote */}
        <blockquote className="mb-6 max-w-md">
          <p className="font-display text-lg md:text-2xl italic text-foreground/70 leading-relaxed">
            "Forever in our hearts,<br />always in our lives."
          </p>
        </blockquote>

        {/* Subtext */}
        <p className="font-body text-sm text-foreground/38 max-w-sm leading-relaxed mb-8">
          A place of love, remembrance &amp; healing.<br />
          For the woman who gave so much love and left behind a legacy of strength.
        </p>

        {/* CTA row */}
        <div className="flex flex-wrap justify-center gap-3">
          <a href="#her-story">
            <button
              className="gradient-gold-button rounded-full font-body text-xs tracking-widest uppercase px-8 py-3 border-0"
              style={{ fontWeight: 600 }}
            >
              Enter Her Garden
            </button>
          </a>
          <a href="#light-a-candle">
            <button
              className="rounded-full font-body text-xs tracking-widest uppercase px-8 py-3 transition-all hover:bg-white/5"
              style={{
                border:  '1px solid rgba(212,175,55,0.30)',
                color:   'rgba(212,175,55,0.75)',
              }}
            >
              ♥ Light a Candle
            </button>
          </a>
        </div>
      </motion.div>

      {/* Scroll cue */}
      <motion.div
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-1"
        style={{ opacity: fadeText }}
        animate={prefersReduced ? {} : { y: [0, 8, 0] }}
        transition={{ duration: 2.5, repeat: Infinity }}
      >
        <ChevronDown className="w-5 h-5 text-primary/25" />
      </motion.div>
    </section>
  );
}