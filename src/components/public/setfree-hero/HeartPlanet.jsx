import { motion } from 'framer-motion';
import HeartFlames from './HeartFlames';

// The official Set Free heart with its white background removed pixel by pixel
// (flames kept as soft transparent glow, nothing regenerated), sitting INSIDE
// the official gold orbit ring. The ring is split along its long axis: the
// back half sits behind the heart in 3D space, the front half passes in front,
// and the whole stack tilts and sways in real perspective.
export const HEART_ART = 'https://base44.app/api/apps/69eb7905ca6eb4180010f794/files/mp/public/69eb7905ca6eb4180010f794/07efd5c33_SetFree_heart_760.png';
const RING_ART = 'https://base44.app/api/apps/69eb7905ca6eb4180010f794/files/mp/public/69eb7905ca6eb4180010f794/01c177fdb_SetFree_ring_900.png';
const RING_BACK = 'polygon(0% 0%, 100% 0%, 100% 26%, 0% 84%)';
const RING_FRONT = 'polygon(0% 84%, 100% 26%, 100% 100%, 0% 100%)';

function RingHalf({ clip, z }) {
  return (
    <div className="absolute pointer-events-none" style={{ left: '-30%', top: '10%', width: '160%', transform: `translateZ(${z}px)` }}>
      <motion.img
        src={RING_ART}
        alt=""
        aria-hidden
        draggable="false"
        className="w-full h-auto max-w-none select-none"
        style={{ clipPath: clip, WebkitClipPath: clip }}
        animate={{ rotate: [-3, 3, -3], filter: ['brightness(1)', 'brightness(1.35)', 'brightness(1)'] }}
        transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
      />
    </div>
  );
}

export default function HeartPlanet({ rotateX, rotateY }) {
  return (
    <motion.div
      style={{ rotateX, rotateY, transformPerspective: 900, transformStyle: 'preserve-3d' }}
      className="relative aspect-square w-[min(72vw,36svh,390px)]"
    >
      <motion.div
        className="absolute inset-0"
        style={{ transformStyle: 'preserve-3d' }}
        animate={{ y: [0, -16, 0], rotateX: [7, 13, 7], rotateY: [-10, 10, -10], rotateZ: [-1, 1, -1] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
      >
        <div className="absolute -inset-[16%] rounded-full pointer-events-none"
             style={{ background: 'radial-gradient(circle, rgba(212,175,55,0.20) 0%, rgba(169,132,44,0.10) 38%, rgba(0,0,0,0) 68%)', transform: 'translateZ(-80px)' }} />
        <RingHalf clip={RING_BACK} z={-40} />
        <div className="absolute -inset-[25%]" style={{ transform: 'translateZ(-10px)' }}><HeartFlames /></div>
        <motion.img
          src={HEART_ART}
          alt="Set Free by Gannon Waye, a cracked gold heart on fire in space"
          draggable="false"
          fetchpriority="high"
          loading="eager"
          decoding="async"
          className="absolute inset-0 w-full h-full object-contain select-none"
          style={{ transform: 'translateZ(0px)' }}
          animate={{ filter: ['drop-shadow(0 0 26px rgba(212,175,55,0.40)) brightness(1)', 'drop-shadow(0 0 44px rgba(245,208,110,0.55)) brightness(1.08)', 'drop-shadow(0 0 26px rgba(212,175,55,0.40)) brightness(1)'] }}
          transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
        />
        <RingHalf clip={RING_FRONT} z={40} />
      </motion.div>
    </motion.div>
  );
}