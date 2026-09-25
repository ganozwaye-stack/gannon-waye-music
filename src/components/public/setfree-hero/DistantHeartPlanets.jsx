import { motion } from 'framer-motion';

// The six owner-supplied heart artworks (25 September 2026), each becoming a
// distant planet in the galaxy: circular crop, sphere lighting, gold rim glow
// and a slow drift so they read as little 3D worlds out in the distance.
const BASE = 'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/';

const PLANETS = [
  { src: '4c43a7043_2.jpg', pos: 'left-[5%] top-[14%]', size: 'w-16 md:w-28', opacity: 0.8, focus: 'center 40%', dur: 26 },
  { src: 'd14dd9111_4.jpg', pos: 'right-[4%] top-[12%]', size: 'w-20 md:w-32', opacity: 0.75, focus: 'center 26%', dur: 30 },
  { src: 'f01458fae_3.jpg', pos: 'left-[2%] top-[50%]', size: 'w-12 md:w-20', opacity: 0.65, focus: 'center', dur: 34 },
  { src: '86360a6b2_5.jpg', pos: 'right-[1.5%] top-[44%]', size: 'w-14 md:w-24', opacity: 0.7, focus: 'center', dur: 38 },
  { src: '3eb791a00_6.jpg', pos: 'left-[13%] bottom-[12%]', size: 'w-10 md:w-16', opacity: 0.6, focus: 'center', dur: 42 },
  { src: '7b0092297_7.jpg', pos: 'right-[11%] bottom-[15%]', size: 'w-12 md:w-20', opacity: 0.6, focus: 'center 28%', dur: 36 },
];

export default function DistantHeartPlanets() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
      {PLANETS.map((p) => (
        <motion.div
          key={p.src}
          className={`absolute ${p.pos}`}
          animate={{ y: [0, -12, 0], x: [0, 6, 0] }}
          transition={{ duration: p.dur, repeat: Infinity, ease: 'easeInOut' }}
        >
          <div
            className={`relative ${p.size} aspect-square rounded-full overflow-hidden ring-1 ring-primary/25`}
            style={{
              opacity: p.opacity,
              filter: 'blur(0.6px)',
              boxShadow: '0 0 28px rgba(212,175,55,0.18), inset -14px -18px 34px rgba(0,0,0,0.85)',
            }}
          >
            <img
              src={BASE + p.src}
              alt=""
              draggable="false"
              loading="lazy"
              className="w-full h-full object-cover select-none"
              style={{ objectPosition: p.focus }}
            />
            {/* sphere lighting: a light pole top-left, a shadow pole bottom-right */}
            <div
              className="absolute inset-0 rounded-full"
              style={{
                background:
                  'radial-gradient(circle at 30% 26%, rgba(255,255,255,0.22), transparent 45%), radial-gradient(circle at 72% 80%, rgba(0,0,0,0.6), transparent 60%)',
              }}
            />
          </div>
        </motion.div>
      ))}
    </div>
  );
}