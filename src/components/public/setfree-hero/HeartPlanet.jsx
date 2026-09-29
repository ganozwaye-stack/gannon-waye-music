import { motion } from 'framer-motion';
import HeartFlames from './HeartFlames';
import RingSparks from './RingSparks';

// The official Set Free heart with its white background removed pixel by pixel
// (flames kept as soft transparent glow, nothing regenerated), sitting IN FRONT
// of the official gold orbit ring. 29 September 2026 owner direction: the ring
// is one whole, unbroken ellipse behind the heart (the old split halves cut the
// ring on both sides and cropped it on the right), the GWM wordmark is sized to
// the heart's inner border, and the whole heart plate is smaller so it reads
// distant, like the moon.
export const HEART_ART = 'https://base44.app/api/apps/69eb7905ca6eb4180010f794/files/mp/public/69eb7905ca6eb4180010f794/07efd5c33_SetFree_heart_760.png';
const RING_ART = 'https://base44.app/api/apps/69eb7905ca6eb4180010f794/files/mp/public/69eb7905ca6eb4180010f794/01c177fdb_SetFree_ring_900.png';
// Owner-supplied GWM wordmark on pure black; mix-blend-screen drops the black
// and keeps the artwork. 29 September 2026: sized to match the heart's inner
// border, sitting in space just in front of the heart, softly glowing.
const GWM_LOGO = 'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/4a733b567_GWMGannonWayemusic.jpg';

function WholeRing() {
  return (
    <div className="absolute pointer-events-none" style={{ left: '-25%', top: '11%', width: '150%', transform: 'translateZ(-40px)' }}>
      <motion.img
        src={RING_ART}
        alt=""
        aria-hidden
        draggable="false"
        className="w-full h-auto max-w-none select-none"
        animate={{ rotate: [-3, 3, -3], filter: ['brightness(1)', 'brightness(1.4)', 'brightness(1.05)', 'brightness(1.55)', 'brightness(1)'] }}
        transition={{ rotate: { duration: 9, repeat: Infinity, ease: 'easeInOut' }, filter: { duration: 2.2, repeat: Infinity, ease: 'easeInOut' } }}
      />
    </div>
  );
}

export default function HeartPlanet({ rotateX, rotateY }) {
  return (
    <motion.div
      style={{ rotateX, rotateY, transformPerspective: 900, transformStyle: 'preserve-3d' }}
      className="relative aspect-square w-[min(58vw,30svh,330px)]"
    >
      <motion.div
        className="absolute inset-0"
        style={{ transformStyle: 'preserve-3d' }}
        animate={{ y: [0, -16, 0], rotateX: [7, 13, 7], rotateY: [-10, 10, -10], rotateZ: [-1, 1, -1], scale: [1, 1.02, 1] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
      >
        <div className="absolute -inset-[16%] rounded-full pointer-events-none"
             style={{ background: 'radial-gradient(circle, rgba(245,196,110,0.24) 0%, rgba(169,132,44,0.12) 38%, rgba(0,0,0,0) 68%)', transform: 'translateZ(-80px)' }} />
        <WholeRing />
        <div
          className="absolute pointer-events-none"
          style={{ left: '50%', top: '46%', width: '96%', transform: 'translate(-50%, -50%) translateZ(16px)' }}
        >
          <img
            src={GWM_LOGO}
            alt="Gannon Waye Music"
            aria-hidden
            draggable="false"
            className="w-full h-auto object-contain select-none"
            style={{ mixBlendMode: 'screen', opacity: 0.62, filter: 'drop-shadow(0 0 10px rgba(212,175,55,0.18))' }}
          />
        </div>
        <RingSparks />
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
      </motion.div>
    </motion.div>
  );
}