import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import GoldenEmbers from '@/components/three/GoldenEmbers';
import GalaxyBackdrop from './GalaxyBackdrop';
import GalaxyAtmosphere from './GalaxyAtmosphere';
import SpaceField from './SpaceField';
import DriftingMoons from './DriftingMoons';
import HeartPlanet from './HeartPlanet';
import SetFreePanel from './SetFreePanel';
import PreviousReleaseChip from './PreviousReleaseChip';
import LumaAlphaFilter from './LumaAlphaFilter';
import GannonWayeGroupFeature from '@/components/public/GannonWayeGroupFeature';
import HomeHeroWelcomeStack from '@/components/public/HomeHeroWelcomeStack';

// Existing artwork on a two-column opening: Set Free and heart beside welcome and journals.
const fade = (delay) => ({
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8, delay },
});

export default function SetFreeSpaceHero({ previousRelease, previousLink }) {
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
      className="relative -mt-16 flex flex-col overflow-hidden px-4 pt-24 md:px-8"
      style={{ background: '#211b17' }}
    >
      <LumaAlphaFilter />
      <GalaxyBackdrop />
      <GalaxyAtmosphere />
      <SpaceField />
      <DriftingMoons />
      <div className="pointer-events-none absolute inset-0 opacity-25"><GoldenEmbers density={0.25} /></div>
      <div className="pointer-events-none absolute inset-0" style={{ background: 'radial-gradient(120% 90% at 50% 45%, rgba(33,27,23,0) 45%, rgba(33,27,23,0.75) 100%)' }} />
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-40" style={{ background: 'linear-gradient(to top, hsl(var(--background)) 0%, transparent 100%)' }} />

      <div className="relative z-10 mx-auto w-full max-w-6xl">
        <div className="home-hero-grid home-hero-compact">
          <div className="home-hero-single">
            <motion.div
              className="home-hero-heart"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.9, ease: 'easeOut' }}
            >
              <HeartPlanet rotateX={rotateX} rotateY={rotateY} compact />
            </motion.div>
            <motion.div className="home-hero-release" {...fade(0.3)}>
              <SetFreePanel />
            </motion.div>
          </div>
          <motion.div className="home-hero-services" {...fade(0.4)}>
            <GannonWayeGroupFeature />
          </motion.div>
          <motion.div className="home-hero-welcome" data-testid="home-welcome-panel" {...fade(0.5)}>
            <HomeHeroWelcomeStack />
          </motion.div>
        </div>
      </div>

      {previousRelease && (
        <motion.div className="relative z-10 mx-auto w-full max-w-6xl pb-5 pt-3" {...fade(0.7)}>
          <PreviousReleaseChip release={previousRelease} to={previousLink} />
        </motion.div>
      )}

    </section>
  );
}