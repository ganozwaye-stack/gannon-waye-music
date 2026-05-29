import React, { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import MovingHeart from './MovingHeart';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

// Floating card — uses numeric pixel offsets so Framer can animate them
function FloatingCard({ card, index, prefersReduced }) {
  // Convert percentage strings to fixed pixel offsets for animatable values
  const positions = [
    { left: -280, top: -120 },
    { left: 200, top: -100 },
    { left: -250, top: 120 },
    { left: 180, top: 140 },
  ];
  const pos = positions[index] || { left: 0, top: 0 };

  return (
    <motion.div
      className="absolute z-[5] hidden md:block pointer-events-none"
      style={{ left: '50%', top: '50%', marginLeft: pos.left, marginTop: pos.top }}
      initial={{ opacity: 0, scale: 0.85, rotate: card.rotate, y: 0 }}
      animate={prefersReduced
        ? { opacity: 0.3, scale: 1, rotate: card.rotate, y: 0 }
        : { opacity: 0.38, scale: 1, rotate: card.rotate, y: [0, -10, 0] }
      }
      transition={{
        opacity: { delay: card.delay + 1.2, duration: 0.8 },
        scale: { delay: card.delay + 1.2, duration: 0.8 },
        y: { duration: 4 + index, repeat: Infinity, ease: 'easeInOut', delay: card.delay + 1.2 },
      }}
    >
      <div
        className="w-28 h-28 md:w-36 md:h-36 rounded-xl overflow-hidden border border-primary/20"
        style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.6), 0 0 0 1px rgba(212,175,55,0.15)' }}
      >
        <img src={card.url} alt={card.alt} className="w-full h-full object-cover" loading="lazy" />
      </div>
    </motion.div>
  );
}

// Real Sonia photos for floating memory cards
const FLOAT_CARDS = [
  { url: 'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/a318d431c_30A6307B-653A-406E-9CBD-1288498D26C9.jpg', alt: 'Gannon and Mum', rotate: -6, x: '-72%', y: '15%', delay: 0 },
  { url: 'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/918c9ea94_79AD025F-80B8-414D-B842-C468362D88C2.jpg', alt: 'Gannon and Mum close', rotate: 5, x: '68%', y: '20%', delay: 0.3 },
  { url: 'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/899b8e651_5298157B-5E45-43E1-859C-24D8320B2894.jpg', alt: 'Sonia birthday', rotate: -3, x: '-65%', y: '60%', delay: 0.6 },
  { url: 'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/0300de0f5_3B567D3B-59A6-4B35-8222-64534D6BE5BB.jpg', alt: 'Sonia cheeky peace sign', rotate: 4, x: '60%', y: '65%', delay: 0.9 },
];

// Hero portrait
const HERO_PORTRAIT = 'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/7df2f998b_A181BD35-93F3-41FB-B671-2FABC71B701A.jpg';
// Garden / burgundy robe
const GARDEN_IMG = 'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/3892d6143_093DD58D-2A3E-46F2-B235-ABD31D530F48.jpg';

export default function ImmersiveHero() {
  const containerRef = useRef(null);
  const { scrollY } = useScroll();
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const [prefersReduced, setPrefersReduced] = useState(false);

  // Parallax transforms on scroll
  const bgY = useTransform(scrollY, [0, 600], [0, 80]);
  const midY = useTransform(scrollY, [0, 600], [0, 40]);
  const textY = useTransform(scrollY, [0, 600], [0, -30]);
  const opacity = useTransform(scrollY, [0, 400], [1, 0]);

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
      setMouse({
        x: (e.clientX - cx) / cx,
        y: (e.clientY - cy) / cy,
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [prefersReduced]);

  const px = prefersReduced ? 0 : mouse.x;
  const py = prefersReduced ? 0 : mouse.y;

  return (
    <section ref={containerRef} className="relative min-h-screen flex items-center justify-center overflow-hidden">

      {/* ── Layer 0: Deep dark base ── */}
      <div className="absolute inset-0 z-0" style={{
        background: 'linear-gradient(150deg, #0a0407 0%, #160810 30%, #0b1009 55%, #080b07 100%)'
      }} />

      {/* ── Layer 1: Background garden / ambient ── */}
      <motion.div
        className="absolute inset-0 z-[1] opacity-[0.18]"
        style={{
          backgroundImage: `url(${GARDEN_IMG})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          y: prefersReduced ? 0 : bgY,
          x: px * -8,
        }}
      />
      {/* Garden darkening gradient */}
      <div className="absolute inset-0 z-[2]" style={{
        background: 'linear-gradient(to bottom, rgba(10,4,7,0.82) 0%, rgba(10,4,7,0.45) 40%, rgba(10,4,7,0.72) 80%, rgba(10,4,7,0.97) 100%)'
      }} />

      {/* ── Layer 2: Warm gold atmospheric glow ── */}
      <motion.div
        className="absolute inset-0 z-[3] pointer-events-none"
        animate={{ opacity: [0.05, 0.10, 0.05] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        style={{ background: 'radial-gradient(ellipse at 55% 35%, rgba(180,100,30,0.18) 0%, transparent 60%)' }}
      />
      {/* Burgundy warmth */}
      <div className="absolute inset-0 z-[3] pointer-events-none" style={{
        background: 'radial-gradient(ellipse at 25% 70%, rgba(100,20,35,0.12) 0%, transparent 55%)'
      }} />

      {/* ── Layer 3: Sonia portrait — cinematic, midground ── */}
      <motion.div
        className="absolute inset-0 z-[4] flex items-center justify-end"
        style={{ x: px * 6, y: prefersReduced ? 0 : midY }}
      >
        <div className="relative h-full w-full md:w-[60%]">
          <img
            src={HERO_PORTRAIT}
            alt="Sonia Katisa Waye"
            className="absolute inset-0 w-full h-full object-cover object-top"
            style={{
              maskImage: 'linear-gradient(to left, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.4) 35%, transparent 75%)',
              WebkitMaskImage: 'linear-gradient(to left, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.4) 35%, transparent 75%)',
            }}
          />
          {/* Portrait vignette */}
          <div className="absolute inset-0" style={{
            background: 'linear-gradient(to right, rgba(10,4,7,1) 0%, rgba(10,4,7,0.5) 30%, transparent 60%), linear-gradient(to top, rgba(10,4,7,0.9) 0%, transparent 40%)'
          }} />
        </div>
      </motion.div>

      {/* ── Layer 4: Floating memory photo cards ── */}
      {FLOAT_CARDS.map((card, i) => (
        <FloatingCard key={i} card={card} index={i} prefersReduced={prefersReduced} />
      ))}

      {/* ── Layer 5: Gold floating particles ── */}
      <div className="absolute inset-0 z-[6] pointer-events-none overflow-hidden">
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              width: `${2 + (i % 3)}px`,
              height: `${2 + (i % 3)}px`,
              background: `rgba(212,175,55,${0.15 + (i % 4) * 0.08})`,
              left: `${8 + (i * 7.5) % 85}%`,
              top: `${15 + (i * 11) % 70}%`,
            }}
            animate={{
              y: [-10, -30, -10],
              opacity: [0.1, 0.5, 0.1],
            }}
            transition={{
              duration: 4 + (i % 4),
              repeat: Infinity,
              delay: i * 0.4,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>

      {/* ── Layer 6: Hero text ── */}
      <motion.div
        className="relative z-[7] w-full max-w-5xl mx-auto px-6 md:px-12 flex items-center"
        style={{ y: prefersReduced ? 0 : textY }}
      >
        <div className="max-w-lg">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="font-body text-[10px] tracking-[0.8em] uppercase text-primary/50 mb-6"
          >
            A Tribute · Sonia Katisa Waye
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.4, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="font-display text-7xl md:text-9xl text-foreground leading-none mb-4"
          >
            For Mum
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="flex items-center gap-3 mb-3"
          >
            <div className="h-px w-6 bg-primary/30" />
            <MovingHeart size="sm" />
            <p className="font-display text-base md:text-xl text-foreground/60 italic">Sonia Katisa Waye</p>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1 }}
            className="font-body text-xs text-primary/50 tracking-[0.4em] mb-8 ml-10"
          >
            1961 – 2022
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.4, duration: 1 }}
            className="border-l-2 border-primary/30 pl-5 mb-10"
          >
            <p className="font-display text-xl md:text-2xl italic text-foreground/80 leading-relaxed">
              "Your last breath took mine away,<br />
              there's not much more I have to say."
            </p>
            <p className="font-body text-[10px] text-muted-foreground/40 mt-3 tracking-[0.25em] uppercase">Without You Here · Gannon Waye · Mother's Day 2026</p>
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
            <a href="#sonias-garden">
              <Button className="rounded-full gradient-gold-button border-0 font-body text-xs tracking-wider uppercase px-7 py-5">
                Enter Her Garden
              </Button>
            </a>
            <a href="#memories">
              <Button variant="outline" className="rounded-full border-primary/30 text-primary/80 hover:bg-primary/10 font-body text-xs tracking-wider uppercase px-7 py-5">
                Memories
              </Button>
            </a>
            <a href="#wisdom">
              <Button variant="ghost" className="rounded-full text-muted-foreground hover:text-foreground font-body text-xs tracking-wider uppercase px-7 py-5">
                Her Wisdom
              </Button>
            </a>
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll cue */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-[8] flex flex-col items-center gap-2"
        style={{ opacity }}
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