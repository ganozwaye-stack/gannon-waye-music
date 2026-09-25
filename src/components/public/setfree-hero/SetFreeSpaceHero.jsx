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
import HomeHeroWelcomeStack from '@/components/public/HomeHeroWelcomeStack';

// Release day, 25 September 2026: Set Free is the whole home hero.
// Owner-directed layout (25 September 2026): the heart planet sits in the
// MIDDLE, the welcome greeting, the Set Free box and the previous release
// stack UP HIGH on the RIGHT, the official gold Gannon Waye logo sits
// top-centre, and the GW circle monogram orbits the planet like a moon.
// House style: no em dashes.
const SET_FREE_LISTEN = 'https://open.spotify.com/track/6TzrIFIkFu5HNyZGM4RmqG';
// The Gannon Waye logo the owner supplied on 25 September 2026: the gold
// filigree heart with its two orbit rings. Not the GW circle.
const GWM_LOGO = 'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/3eb791a00_6.jpg';
// The GW circle monogram, now orbiting the heart planet.
const GW_CIRCLE = 'https://base44.app/api/apps/69eb7905ca6eb4180010f794/files/mp/public/69eb7905ca6eb4180010f794/6e6f577bf_GW.png';
const GW_ORBIT_SECONDS = 30;

export default function SetFreeSpaceHero({ previousRelease, previousLink, settings }) {
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
      className="relative -mt-16 min-h-[100svh] overflow-hidden px-5 md:px-10 pt-20 pb-12 md:pb-16"
      style={{ background: '#05060b' }}
    >
      <GalaxyBackdrop />
      <SpaceField />
      <DriftingMoons />
      <div className="absolute inset-0 opacity-60 pointer-events-none"><GoldenEmbers density={0.5} /></div>
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(120% 90% at 50% 45%, rgba(5,6,11,0) 45%, rgba(5,6,11,0.75) 100%)' }} />
      <div className="absolute bottom-0 left-0 right-0 h-40 pointer-events-none" style={{ background: 'linear-gradient(to top, hsl(var(--background)) 0%, transparent 100%)' }} />

      {/* The official Gannon Waye logo, top-centre and large. Framed as a gold
          medallion so it reads cleanly over the galaxy whatever its canvas. */}
      <motion.div
        initial={{ opacity: 0, y: -14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: 'easeOut' }}
        className="absolute top-[4.5rem] md:top-[4.75rem] left-1/2 z-20 pointer-events-none"
        style={{ x: '-50%' }}
      >
        <div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden ring-2 ring-primary/60 bg-[#08080f] shadow-[0_0_36px_rgba(212,175,55,0.4)]">
          <img
            src={GWM_LOGO}
            alt="Gannon Waye"
            draggable="false"
            className="w-full h-full object-cover"
          />
        </div>
      </motion.div>

      <div className="relative z-10 w-full max-w-7xl mx-auto mt-28 md:mt-36 grid lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1.05fr)] items-center gap-8 lg:gap-10">
        {/* Left: the Set Free single */}
        <div className="order-1 flex flex-col items-start text-left">
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

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.4, delay: 0.4 }}
            className="mt-3 font-body text-4xl sm:text-5xl md:text-6xl tracking-[0.16em] uppercase gradient-gold-glow"
          >
            Set Free
          </motion.h1>
          <p className="font-body text-[10px] md:text-xs tracking-[0.3em] uppercase text-foreground/70 mt-2">Gannon Waye · Released 25 September 2026</p>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.4, delay: 0.8 }}
            className="font-body text-sm text-foreground/85 max-w-md leading-relaxed italic mt-3"
            style={{ textShadow: '0 1px 4px rgba(0,0,0,0.8)' }}
          >
            The moment a boundary becomes non negotiable. A pop single about reclaiming your voice, protecting your peace and choosing what happens next.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 1.1 }}
            className="flex flex-wrap items-center justify-start gap-2 mt-5"
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
          </motion.div>
        </div>

        {/* Centre: the fire heart planet, with the GW circle orbiting it like a moon */}
        <motion.div
          className="order-2 flex justify-center"
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <div className="relative">
            <HeartPlanet rotateX={rotateX} rotateY={rotateY} />
            <motion.div
              aria-hidden
              className="absolute inset-0 pointer-events-none"
              animate={{ rotate: 360 }}
              transition={{ duration: GW_ORBIT_SECONDS, repeat: Infinity, ease: 'linear' }}
            >
              <div className="absolute left-1/2 top-0 -translate-x-1/2">
                <motion.img
                  src={GW_CIRCLE}
                  alt=""
                  draggable="false"
                  animate={{ rotate: -360 }}
                  transition={{ duration: GW_ORBIT_SECONDS, repeat: Infinity, ease: 'linear' }}
                  className="w-12 h-12 object-contain rounded-full ring-1 ring-primary/40"
                  style={{ filter: 'drop-shadow(0 0 10px rgba(212,175,55,0.55))' }}
                />
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Right: welcome, Set Free box and previous release, high on the page */}
        <div className="order-3">
          <HomeHeroWelcomeStack previousRelease={previousRelease} previousLink={previousLink} settings={settings} />
        </div>
      </div>
    </section>
  );
}