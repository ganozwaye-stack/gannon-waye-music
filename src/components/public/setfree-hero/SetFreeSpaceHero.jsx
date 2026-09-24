import { Link } from 'react-router-dom';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import GoldenEmbers from '@/components/three/GoldenEmbers';
import { trackEvent } from '@/lib/analytics';
import GalaxyBackdrop from './GalaxyBackdrop';
import SpaceField from './SpaceField';
import DriftingMoons from './DriftingMoons';
import HeartPlanet from './HeartPlanet';

// Release day, 25 September 2026: Set Free is the whole home hero. The hero
// pulls up under the floating navbar (-mt-16 cancels the layout's top padding)
// so there is no gap at the top. House style: no em dashes.
const SET_FREE_LISTEN = 'https://open.spotify.com/track/6TzrIFIkFu5HNyZGM4RmqG';

export default function SetFreeSpaceHero() {
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rotateY = useSpring(useTransform(mx, (v) => v * 16), { stiffness: 60, damping: 16 });
  const rotateX = useSpring(useTransform(my, (v) => v * -12), { stiffness: 60, damping: 16 });

  const onMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  };

  return (
    <section
      aria-label="Set Free, the new single, out now"
      onPointerMove={onMove}
      className="relative -mt-16 min-h-[100svh] overflow-hidden flex items-center justify-center px-5 pt-20 pb-28 md:pb-20"
      style={{ background: '#05060b' }}
    >
      <GalaxyBackdrop />
      <SpaceField />
      <DriftingMoons />
      <div className="absolute inset-0 opacity-60 pointer-events-none"><GoldenEmbers density={0.5} /></div>
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(120% 90% at 50% 45%, rgba(5,6,11,0) 45%, rgba(5,6,11,0.75) 100%)' }} />
      <div className="absolute bottom-0 left-0 right-0 h-40 pointer-events-none" style={{ background: 'linear-gradient(to top, hsl(var(--background)) 0%, transparent 100%)' }} />

      <div className="relative z-10 flex flex-col items-center text-center">
        <motion.p
          initial={{ opacity: 0, letterSpacing: '0.8em' }}
          animate={{ opacity: 1, letterSpacing: '0.45em' }}
          transition={{ duration: 1.4 }}
          className="inline-flex items-center gap-2 font-body text-[10px] md:text-xs uppercase gradient-gold-text"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
          </span>
          New Single · Out Now
        </motion.p>

        <motion.div initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1.8, ease: 'easeOut' }}>
          <HeartPlanet rotateX={rotateX} rotateY={rotateY} />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.4, delay: 0.6 }}
          className="-mt-8 md:-mt-14 font-body text-5xl sm:text-6xl md:text-7xl tracking-[0.16em] uppercase gradient-gold-glow"
        >
          Set Free
        </motion.h1>
        <p className="font-body text-[10px] md:text-xs tracking-[0.3em] uppercase text-foreground/70 mt-2">Gannon Waye · Released 25 September 2026</p>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.4, delay: 1 }}
          className="font-body text-sm text-foreground/85 max-w-md leading-relaxed italic mt-3"
          style={{ textShadow: '0 1px 4px rgba(0,0,0,0.8)' }}
        >
          The moment a boundary becomes non negotiable. A pop single about reclaiming your voice, protecting your peace and choosing what happens next.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 1.3 }}
          className="flex flex-wrap items-center justify-center gap-2 mt-5"
        >
          <a
            href={SET_FREE_LISTEN}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackEvent('stream_click', { source: 'home_space_hero', release: 'Set Free' })}
            className="inline-flex items-center gap-1.5 px-6 py-3 text-xs tracking-wider uppercase font-body rounded-full gradient-gold-button"
          >
            <Play className="w-3.5 h-3.5" /> Listen Now
          </a>
          <Link to="/store">
            <Button variant="outline" className="rounded-full px-5 py-3 h-auto text-xs tracking-wider uppercase font-body border-primary/40 text-primary hover:bg-primary/10">
              Carry the Message
            </Button>
          </Link>
          <Link to="/contact">
            <Button variant="outline" className="rounded-full px-5 py-3 h-auto text-xs tracking-wider uppercase font-body border-primary/40 text-primary hover:bg-primary/10">
              Work with Me
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}