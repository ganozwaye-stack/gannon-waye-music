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

// Evening rebuild, release day (25 September 2026): one calm, premium first
// screen. The SET FREE fire title is the page statement, top centre and
// large. The heart planet drifts deeper into the galaxy, smaller and toned
// back to its gold design (the red face was the fire overlays, now gold),
// and the GWM wordmark is enlarged and clamped across the front of the
// heart at 75% opacity as the feature piece. Copy stretches wider and the
// welcome says more. House style: no em dashes.
const SET_FREE_LISTEN = 'https://open.spotify.com/track/6TzrIFIkFu5HNyZGM4RmqG';
// Owner-supplied brand art, 25 September 2026. The GWM wordmark and the
// SET FREE fire title are supplied on pure black, so mix-blend-screen drops
// the black background and keeps only the artwork over the galaxy.
const GWM_LOGO = 'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/4a733b567_GWMGannonWayemusic.jpg';
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
      className="relative -mt-16 min-h-[100svh] overflow-hidden px-5 md:px-10 pt-24 md:pt-28 pb-24"
      style={{ background: '#05060b' }}
    >
      <GalaxyBackdrop />
      <GalaxyAtmosphere />
      <SpaceField />
      <DriftingMoons />
      <div className="absolute inset-0 opacity-40 pointer-events-none"><GoldenEmbers density={0.35} /></div>
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(120% 90% at 50% 45%, rgba(5,6,11,0) 45%, rgba(5,6,11,0.75) 100%)' }} />
      <div className="absolute bottom-0 left-0 right-0 h-40 pointer-events-none" style={{ background: 'linear-gradient(to top, hsl(var(--background)) 0%, transparent 100%)' }} />

      <div className="relative z-10 w-full max-w-7xl mx-auto">
        {/* Page statement: SET FREE, top centre, the first thing every eye lands on */}
        <div className="flex flex-col items-center text-center">
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
          <div className="mt-3 w-[min(82vw,540px)] drop-shadow-[0_0_28px_rgba(212,175,55,0.35)]">
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
        </div>

        {/* The screen: story on the left, the heart world centre, the welcome on the right */}
        <div className="mt-10 lg:mt-12 grid lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-start gap-10 lg:gap-14">
          {/* Left: the Set Free story, with the previous release tucked under it */}
          <div className="order-1 flex flex-col items-start text-left max-w-md">
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.5 }}
              className="font-body text-sm md:text-[15px] text-foreground/85 leading-relaxed italic"
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

          {/* Centre: the heart world, deeper in the galaxy, with the enlarged
              GWM wordmark clamped across its front at 75% opacity */}
          <div className="order-2 flex justify-center lg:pt-2">
            <motion.div
              initial={{ opacity: 0, scale: 0.88 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.9, ease: 'easeOut', delay: 0.25 }}
              className="relative"
            >
              <HeartPlanet rotateX={rotateX} rotateY={rotateY} />
              <div className="absolute left-1/2 top-[47%] -translate-x-1/2 -translate-y-1/2 w-[170%]">
                <motion.img
                  src={GWM_LOGO}
                  alt="Gannon Waye Music"
                  draggable="false"
                  initial={{ opacity: 0, scale: 0.94 }}
                  animate={{ opacity: 0.75, scale: 1 }}
                  transition={{ duration: 1.1, delay: 0.5, ease: 'easeOut' }}
                  className="w-full h-auto object-contain pointer-events-none select-none"
                  style={{ mixBlendMode: 'screen', filter: 'drop-shadow(0 0 20px rgba(212,175,55,0.35))' }}
                />
              </div>
            </motion.div>
          </div>

          {/* Right: the welcome, stretched out and saying more */}
          <div className="order-3">
            <HomeHeroWelcomeStack settings={settings} />
          </div>
        </div>
      </div>

      <MerchDropBanner />
    </section>
  );
}