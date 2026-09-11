import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Button } from '@/components/ui/button';
import GoldenEmbers from '@/components/three/GoldenEmbers';
import MagneticButton from '@/components/public/MagneticButton';

// Set Free official artwork: the shell-like planet, supplied by Gannon and
// registered in the gallery. Never regenerate, crop or edit it.
const SET_FREE_ART =
  'https://base44.app/api/apps/69eb7905ca6eb4180010f794/files/mp/public/69eb7905ca6eb4180010f794/63b521cc9_ArtworkSETFREEGANNONWAYE.jpg';

// House style: no em dashes, gold essence palette only.

export default function SetFreeHero() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });

  // Each layer drifts at its own rate so the planet sits in true 3D depth
  // while the gold light breathes as the section scrolls through view.
  const yPlanet = useTransform(scrollYProgress, [0, 1], [150, -190]);
  const zPlanet = useTransform(scrollYProgress, [0, 1], [60, 240]);
  const rotateXPlanet = useTransform(scrollYProgress, [0, 1], [16, -18]);
  const scaleHalo = useTransform(scrollYProgress, [0, 0.5, 1], [0.9, 1.16, 0.95]);
  const yTitle = useTransform(scrollYProgress, [0, 1], [-70, 160]);
  const yCopy = useTransform(scrollYProgress, [0, 1], [70, -100]);
  const rayOpacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.1, 0.42, 0.06]);
  const rayRotate = useTransform(scrollYProgress, [0, 1], [-24, 42]);
  const emberScale = useTransform(scrollYProgress, [0, 1], [0.95, 1.28]);

  return (
    <section
      ref={ref}
      aria-label="Set Free, the new single"
      className="relative overflow-hidden"
      style={{ perspective: '1400px', background: '#0a0a0e', minHeight: '92svh' }}
    >
      {/* Deep space base glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(90% 70% at 50% 45%, rgba(212,175,55,0.09), rgba(10,10,14,0) 65%)' }}
      />

      {/* Gold light rays, waking up as the planet scrolls through view */}
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

      {/* The shell planet, the deepest 3D layer */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        style={{ y: yPlanet, z: zPlanet, rotateX: rotateXPlanet, transformStyle: 'preserve-3d' }}
      >
        <div className="relative w-[76vw] max-w-[540px] aspect-square">
          {/* Rotating gold halo, the light orbiting the planet */}
          <motion.div
            className="absolute -inset-7 rounded-full"
            style={{
              scale: scaleHalo,
              background:
                'conic-gradient(from 0deg, rgba(212,175,55,0) 0%, rgba(240,230,200,0.4) 12%, rgba(212,175,55,0) 30%, rgba(212,175,55,0.3) 55%, rgba(240,230,200,0) 78%, rgba(212,175,55,0) 100%)',
              filter: 'blur(9px)',
            }}
            animate={{ rotate: 360 }}
            transition={{ duration: 48, repeat: Infinity, ease: 'linear' }}
          />
          <img
            src={SET_FREE_ART}
            alt="Set Free artwork, a shell-like planet bathed in gold light"
            draggable="false"
            className="relative w-full h-full object-cover rounded-full border-2 border-primary/40 select-none"
            style={{
              boxShadow:
                '0 0 70px rgba(212,175,55,0.35), 0 0 170px rgba(212,175,55,0.18), 0 24px 70px rgba(0,0,0,0.6)',
            }}
          />
        </div>
      </motion.div>

      {/* Gold dust rising through the light */}
      <motion.div className="absolute inset-0 pointer-events-none" style={{ scale: emberScale }}>
        <GoldenEmbers />
      </motion.div>

      {/* Copy, floating above the planet so the letters pop with depth */}
      <div className="relative z-10 min-h-[92svh] flex flex-col items-center justify-center text-center px-6">
        <motion.p
          style={{ y: yCopy }}
          className="font-body text-[10px] md:text-xs tracking-[0.5em] uppercase gradient-gold-text mb-4"
        >
          The New Single
        </motion.p>
        <motion.h2
          style={{ y: yTitle }}
          className="font-body text-5xl md:text-8xl tracking-[0.14em] uppercase gradient-gold-glow mb-6"
        >
          Set Free
        </motion.h2>
        <motion.p
          style={{ y: yCopy }}
          className="font-body text-sm md:text-base text-foreground/85 max-w-md leading-relaxed italic mb-8"
        >
          The turning point. The sound of choosing peace, restoring boundaries and
          reclaiming your own direction.
        </motion.p>
        <motion.div style={{ y: yTitle }} className="flex flex-wrap items-center justify-center gap-3">
          <MagneticButton>
            <Link to="/presave">
              <Button className="rounded-full px-7 py-3 text-xs tracking-wider uppercase font-body gradient-gold-button border-0">
                Pre-save Set Free
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