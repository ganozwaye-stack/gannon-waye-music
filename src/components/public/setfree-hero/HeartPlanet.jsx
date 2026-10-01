import { motion } from 'framer-motion';
import HeartFlames from './HeartFlames';
import OrbitRing from './OrbitRing';

// The Set Free heart, small and far away like the moon. The official heart
// art (white background removed, flames kept as a soft glow) sits inside one
// whole electric ring, and the GWM wordmark is centred on the exact middle of
// both, so heart, logo and ring are concentric. Plate size is the single
// distance control. House style: no em dashes.
export const HEART_ART = 'https://base44.app/api/apps/69eb7905ca6eb4180010f794/files/mp/public/69eb7905ca6eb4180010f794/07efd5c33_SetFree_heart_760.png';
const GWM_LOGO = 'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/4a733b567_GWMGannonWayemusic.jpg';
const PLATE = 'min(34vw, 22svh, 170px)';

export default function HeartPlanet({ rotateX, rotateY }) {
  return (
    <div
      className="relative mx-auto flex items-center justify-center"
      style={{ '--plate': PLATE, width: 'calc(var(--plate) * 1.8)', height: 'calc(var(--plate) * 1.4)' }}
    >
      <motion.div
        className="relative aspect-square shrink-0"
        style={{ width: 'var(--plate)', rotateX, rotateY, transformPerspective: 900 }}
      >
        <motion.div
          className="absolute inset-0"
          animate={{ y: [0, -7, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        >
          <div
            aria-hidden
            className="pointer-events-none absolute -inset-[30%] rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(245,196,110,0.18) 0%, rgba(169,132,44,0.08) 40%, rgba(0,0,0,0) 68%)' }}
          />
          <OrbitRing />
          <div className="absolute -inset-[25%]">
            <HeartFlames rate={380} alpha={0.65} />
          </div>
          <motion.img
            src={HEART_ART}
            alt="Set Free by Gannon Waye, a cracked gold heart on fire in space"
            draggable="false"
            fetchpriority="high"
            loading="eager"
            decoding="async"
            className="absolute inset-0 h-full w-full select-none object-contain"
            animate={{ filter: ['drop-shadow(0 0 12px rgba(212,175,55,0.32)) saturate(0.92)', 'drop-shadow(0 0 20px rgba(245,208,110,0.45)) saturate(0.92)', 'drop-shadow(0 0 12px rgba(212,175,55,0.32)) saturate(0.92)'] }}
            transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
          />
          <img
            src={GWM_LOGO}
            alt="Gannon Waye Music"
            aria-hidden
            draggable="false"
            className="pointer-events-none absolute select-none"
            style={{ left: '50%', top: '50%', width: '72%', transform: 'translate(-50%, -50%)', filter: 'url(#gw-luma-alpha)', opacity: 0.85 }}
          />
        </motion.div>
      </motion.div>
    </div>
  );
}