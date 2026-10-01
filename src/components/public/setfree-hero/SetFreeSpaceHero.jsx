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
import MerchDropBanner from './MerchDropBanner';
import HomeHeroWelcomeStack from '@/components/public/HomeHeroWelcomeStack';

// 1 October 2026 rebuild. One calm composition on one grid:
//  - wide screens: SET FREE card, the distant heart moon, the welcome card,
//    in a single row. The two cards share the same top and bottom edges and
//    the moon is centred between them, so nothing crowds and everything sits
//    on the first screen.
//  - tablets: the moon on top, the two cards side by side beneath it.
//  - phones: moon, SET FREE, welcome, each full width.
// The previous release is a slim pill under the cards. House style: no em dashes.
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
      className="relative -mt-16 flex min-h-[100svh] flex-col overflow-hidden px-4 pt-24 md:px-8"
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

      <div className="relative z-10 flex flex-1 items-center">
        <div className="mx-auto grid w-full max-w-6xl grid-cols-1 items-stretch gap-5 md:grid-cols-2 md:gap-6 xl:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] xl:gap-8">
          <motion.div
            className="order-1 self-center md:col-span-2 xl:order-2 xl:col-span-1"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, ease: 'easeOut' }}
          >
            <HeartPlanet rotateX={rotateX} rotateY={rotateY} />
          </motion.div>

          <motion.div className="order-2 md:min-h-[420px] xl:order-1 xl:min-h-[460px]" {...fade(0.3)}>
            <SetFreePanel />
          </motion.div>

          <motion.div className="order-3 md:min-h-[420px] xl:min-h-[460px]" {...fade(0.45)}>
            <HomeHeroWelcomeStack />
          </motion.div>
        </div>
      </div>

      {previousRelease && (
        <motion.div className="relative z-10 mx-auto w-full max-w-6xl pb-16" {...fade(0.7)}>
          <PreviousReleaseChip release={previousRelease} to={previousLink} />
        </motion.div>
      )}

      <MerchDropBanner />
    </section>
  );
}