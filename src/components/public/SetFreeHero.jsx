import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import GoldenEmbers from '@/components/three/GoldenEmbers';
import MagneticButton from '@/components/public/MagneticButton';
import HeroOrbitRing from '@/components/public/HeroOrbitRing';
import { HERO_DESIGN_DEFAULTS, HERO_HEART_ART } from '@/lib/heroDesignDefaults';
import { PUBLIC_RELEASE_FILTER } from '@/lib/publicRelease';

// Set Free official artwork: the shell-like heart, supplied by Gannon and
// registered in the gallery. Never regenerate, crop or edit it.
// The hero reads its design from the Hero Design Studio (HeroDesignSettings).
// When no saved record exists it falls back to the code defaults, so the
// owner can lock the galaxy framing, orbit ring, sparks, heart size and
// labels in place and the public hero always follows.
// House style: no em dashes, gold essence palette only.

export default function SetFreeHero() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });

  const { data: settingsRecords = [] } = useQuery({
    queryKey: ['heroDesignSettings'],
    queryFn: () => base44.entities.HeroDesignSettings.list(),
    initialData: [],
  });
  // Only the live record renders publicly. Draft records are the owner's
  // private work and never appear here. Records without the flag are the
  // original saved design from before drafts existed, and stay live.
  const liveSettings = settingsRecords.find((r) => r.is_live === true)
    || settingsRecords.find((r) => r.is_live === undefined)
    || null;
  const design = { ...HERO_DESIGN_DEFAULTS, ...(liveSettings || {}) };

  const { data: releaseCandidates = [] } = useQuery({
    queryKey: ['setfree-hero-releases'],
    queryFn: () => base44.entities.Release.filter(PUBLIC_RELEASE_FILTER, '-release_date', 50),
    initialData: [],
  });
  const heroRelease = (design.hero_release_id && releaseCandidates.find((r) => r.id === design.hero_release_id))
    || releaseCandidates.find((r) => r.is_current_single === true)
    || null;
  const heroTitle = heroRelease?.title || 'Set Free';
  const heroCopy = heroRelease?.current_single_hero_copy || heroRelease?.description
    || 'The turning point. The sound of choosing peace, restoring boundaries and reclaiming your own direction.';

  // Each layer drifts at its own rate so the heart sits in true 3D depth
  // while the gold light breathes as the section scrolls through view.
  const yPlanet = useTransform(scrollYProgress, [0, 1], [150, -190]);
  const zPlanet = useTransform(scrollYProgress, [0, 1], [60, 240]);
  const rotateXPlanet = useTransform(scrollYProgress, [0, 1], [16, -18]);
  const yTitle = useTransform(scrollYProgress, [0, 1], [-70, 160]);
  const yCopy = useTransform(scrollYProgress, [0, 1], [70, -100]);
  const rayOpacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.1, 0.42, 0.06]);
  const rayRotate = useTransform(scrollYProgress, [0, 1], [-24, 42]);
  const emberScale = useTransform(scrollYProgress, [0, 1], [0.95, 1.28]);

  return (
    <section
      ref={ref}
      aria-label={`${heroTitle}, the new single`}
      className="relative overflow-hidden"
      style={{ perspective: '1400px', background: '#0a0a0e', minHeight: '92svh' }}
    >
      {/* Galaxy plate. The over-scan percentage bleeds it past every edge so
          no baked edge of the image can ever show, at any screen size. A
          custom galaxy image is cover-filled across the whole plate, so
          white sides are impossible whatever shape the file is. */}
      {design.galaxy_image_url ? (
        <div
          className="absolute pointer-events-none"
          style={{
            inset: `-${design.galaxy_scan_pct}%`,
            backgroundImage: `url(${design.galaxy_image_url})`,
            backgroundSize: 'cover',
            backgroundPosition: `50% ${design.galaxy_pos_y}%`,
          }}
        />
      ) : (
        <div
          className="absolute pointer-events-none"
          style={{
            inset: `-${design.galaxy_scan_pct}%`,
            background: `radial-gradient(90% 70% at 50% ${design.galaxy_pos_y}%, rgba(212,175,55,0.09), rgba(10,10,14,0) 65%)`,
          }}
        />
      )}

      {/* Gold light rays, waking up as the heart scrolls through view */}
      {design.rays_enabled !== false && (
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{ opacity: rayOpacity, rotate: rayRotate }}
      >
        <div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[170%] max-w-none aspect-square"
          style={{
            background:
              'repeating-conic-gradient(from 0deg at 50% 50%, rgba(212,175,55,0.18) 0deg 5deg, rgba(212,175,55,0) 5deg 17deg)',
            filter: 'blur(26px)',
          }}
        />
      </motion.div>
      )}

      {/* The heart shell, the deepest 3D layer, framed by the owner's locked-in design */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        style={{ y: yPlanet, z: zPlanet, rotateX: rotateXPlanet, transformStyle: 'preserve-3d' }}
      >
        <div style={{ transform: `translateY(${(design.heart_pos_y_pct - 50) * 0.9}%)` }}>
        <div
          className="relative aspect-square"
          style={{ width: `min(${76 * design.heart_size_pct / 100}vw, ${540 * design.heart_size_pct / 100}px)` }}
        >
          <img
            src={design.heart_art_url || HERO_HEART_ART}
            alt={`${heroTitle} artwork, a heart shell bathed in gold light`}
            draggable="false"
            className="relative w-full h-full object-cover rounded-full border-2 border-primary/40 select-none"
            style={{
              boxShadow:
                '0 0 70px rgba(212,175,55,0.35), 0 0 170px rgba(212,175,55,0.18), 0 24px 70px rgba(0,0,0,0.6)',
            }}
          />
          {/* Tilted orbit ring with travelling sparks, driven by the Hero Design Studio */}
          <HeroOrbitRing ring={design} />
        </div>
        </div>
      </motion.div>

      {/* Gold dust rising through the light */}
      {design.embers_enabled !== false && (
        <motion.div className="absolute inset-0 pointer-events-none" style={{ scale: emberScale }}>
          <GoldenEmbers />
        </motion.div>
      )}

      {/* Copy, floating above the heart so the letters pop with depth */}
      <div className="relative z-10 min-h-[92svh] flex flex-col items-center justify-center text-center px-6">
        <motion.p
          style={{ y: yCopy }}
          className="font-body text-[10px] md:text-xs tracking-[0.5em] uppercase gradient-gold-text mb-4"
        >
          {design.eyebrow_label}
        </motion.p>
        <motion.h2
          style={{ y: yTitle }}
          className="font-body text-5xl md:text-8xl tracking-[0.14em] uppercase gradient-gold-glow mb-6"
        >
          {heroTitle}
        </motion.h2>
        <motion.p
          style={{ y: yCopy }}
          className="font-body text-sm md:text-base text-foreground/85 max-w-md leading-relaxed italic mb-8"
        >
          {heroCopy}
        </motion.p>
        <motion.div style={{ y: yTitle }} className="flex flex-wrap items-center justify-center gap-3">
          <MagneticButton>
            <Link to="/presave">
              <Button className="rounded-full px-7 py-3 text-xs tracking-wider uppercase font-body gradient-gold-button border-0">
                Pre-save {heroTitle}
              </Button>
            </Link>
          </MagneticButton>
          <MagneticButton>
            <Link to="/music">
              <Button
                variant="outline"
                className="rounded-full px-7 py-3 text-xs tracking-wider uppercase font-body border-primary/40 text-primary hover:bg-primary/10"
              >
                Hear the Music
              </Button>
            </Link>
          </MagneticButton>
        </motion.div>
      </div>

      {/* Vignette and page blend */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(120% 90% at 50% 40%, rgba(10,10,14,0) 45%, rgba(10,10,14,0.7) 100%)' }}
      />
      <div
        className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
        style={{ background: 'linear-gradient(to top, hsl(var(--background)) 0%, rgba(10,10,14,0) 100%)' }}
      />
      <div
        className="absolute top-0 left-0 right-0 h-24 pointer-events-none"
        style={{ background: 'linear-gradient(to bottom, hsl(var(--background)) 0%, rgba(10,10,14,0) 100%)' }}
      />
    </section>
  );
}