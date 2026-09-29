import { Link } from 'react-router-dom';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Play, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import GoldenEmbers from '@/components/three/GoldenEmbers';
import { trackEvent } from '@/lib/analytics';
import GalaxyBackdrop from './GalaxyBackdrop';
import GalaxyAtmosphere from './GalaxyAtmosphere';
import SpaceField from './SpaceField';
import DriftingMoons from './DriftingMoons';
import HeartPlanet from './HeartPlanet';
import MerchDropBanner from './MerchDropBanner';
import HomeHeroWelcomeStack from '@/components/public/HomeHeroWelcomeStack';

// 27 September 2026 rebuild from the owner's approved references: the heart
// planet is the anchor, top centre and large, warm and cinematic like his
// Veo memorial reference, with the orbit ring electrified and the fire
// fierier. SET FREE is the feature column on the left of the row beneath it
// and the welcome holds the right side. House style: no em dashes.
const SET_FREE_LISTEN = 'https://open.spotify.com/track/6TzrIFIkFu5HNyZGM4RmqG';
// Owner-supplied brand art, 25 September 2026. The SET FREE fire title is
// supplied on pure black, so mix-blend-screen drops the black background
// and keeps only the artwork over the galaxy. The GWM wordmark now lives
// inside HeartPlanet, pulled back within the orbit ring.
const SET_FREE_TITLE = 'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/6b0d132c4_SETFREEFIRE.jpg';

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
      className="relative -mt-16 min-h-[100svh] overflow-hidden px-5 md:px-10 pt-16 md:pt-20 pb-16"
      style={{ background: '#211b17' }}
    >
      <GalaxyBackdrop />
      <GalaxyAtmosphere />
      <SpaceField />
      <DriftingMoons />
      <div className="absolute inset-0 opacity-25 pointer-events-none"><GoldenEmbers density={0.25} /></div>
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(120% 90% at 50% 45%, rgba(33,27,23,0) 45%, rgba(33,27,23,0.75) 100%)' }} />
      <div className="absolute bottom-0 left-0 right-0 h-40 pointer-events-none" style={{ background: 'linear-gradient(to top, hsl(var(--background)) 0%, transparent 100%)' }} />

      <div className="relative z-10 w-full max-w-7xl mx-auto flex min-h-[calc(100svh-9rem)] items-center">
        {/* One clean three column screen, centred in the viewport so the
            SET FREE feature and its buttons are always on the first screen
            a visitor sees: SET FREE left, the heart world small and distant
            in the centre, the narrow welcome level with the ring on the
            right. House style: no em dashes. */}
        <div className="grid w-full lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,0.85fr)] items-start justify-items-center lg:justify-items-start gap-6 lg:gap-10">
          {/* The heart world: distant, like a moon, centred inside its ring */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, ease: 'easeOut' }}
            className="order-1 lg:order-2 lg:pt-1"
          >
            <HeartPlanet rotateX={rotateX} rotateY={rotateY} />
          </motion.div>

          {/* SET FREE feature: left column on desktop, below the heart on mobile */}
          <div className="order-2 lg:order-1 w-full flex flex-col items-start text-left">
            <motion.p
              initial={{ opacity: 0, letterSpacing: '0.8em' }}
              animate={{ opacity: 1, letterSpacing: '0.45em' }}
              transition={{ duration: 1.2 }}
              className="inline-flex items-center gap-2 font-body text-[10px] md:text-xs uppercase gradient-gold-text"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
              </span>
              New Single · Out Now
            </motion.p>
            <div className="mt-2 w-[min(62vw,320px)] drop-shadow-[0_0_24px_rgba(212,175,55,0.35)]">
              <motion.img
                src={SET_FREE_TITLE}
                alt="Set Free, Gannon Waye"
                draggable="false"
                fetchpriority="high"
                className="w-full h-auto object-contain"
                style={{ mixBlendMode: 'screen' }}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1, filter: ['brightness(1)', 'brightness(1.12)', 'brightness(1)'] }}
                transition={{ opacity: { duration: 1 }, scale: { duration: 1 }, filter: { duration: 3, repeat: Infinity, ease: 'easeInOut' } }}
              />
            </div>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.4 }}
              className="font-body text-[10px] md:text-xs tracking-[0.3em] uppercase text-foreground/70 mt-3"
            >
              Gannon Waye · Released 25 September 2026
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.5 }}
              className="font-body text-sm md:text-[15px] text-foreground/85 leading-relaxed italic mt-4 max-w-md"
              style={{ textShadow: '0 1px 4px rgba(0,0,0,0.8)' }}
            >
              A pop single about reclaiming your voice, protecting your peace and choosing what happens next. Written from the inside of everything I survived, and sung for anyone still finding their way out.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.7 }}
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

            {/* Previous release, tucked under the Set Free story */}
            {previousRelease && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.9 }}
                className="mt-6 w-full max-w-xs"
              >
                <p className="font-body text-[9px] tracking-[0.35em] uppercase gradient-gold-glow mb-2">Previous Release</p>
                <Link
                  to={previousLink}
                  className="group flex items-center gap-3 rounded-xl border border-primary/30 bg-background/40 backdrop-blur px-3 py-2.5"
                >
                  {previousRelease.artwork_url && (
                    <img
                      src={previousRelease.artwork_url}
                      alt=""
                      className="w-11 h-11 rounded-md object-cover border border-primary/30 shrink-0"
                    />
                  )}
                  <span className="min-w-0">
                    <span className="block font-body text-sm tracking-[0.12em] uppercase gradient-gold-text truncate">{previousRelease.title}</span>
                    <span className="block font-body text-[10px] text-muted-foreground">Gannon Waye · Single</span>
                  </span>
                  <ArrowRight className="w-4 h-4 text-primary ml-auto shrink-0 group-hover:translate-x-1 transition-transform" />
                </Link>
                {previousRelease.title === 'Without You Here' && (
                  <Link
                    to="/remember-mum"
                    className="mt-2 inline-flex items-center gap-1 font-body text-[10px] tracking-wider uppercase gradient-gold-text hover:opacity-80 transition-opacity"
                  >
                    Read Mum's story <ArrowRight className="w-3 h-3" />
                  </Link>
                )}
              </motion.div>
            )}
          </div>

          {/* Right: the narrow welcome, beginning up top level with the ring */}
          <div className="order-3 w-full">
            <HomeHeroWelcomeStack settings={settings} />
          </div>
        </div>
      </div>

      <MerchDropBanner />
    </section>
  );
}