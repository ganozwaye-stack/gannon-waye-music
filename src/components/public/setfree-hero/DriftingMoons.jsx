import { motion } from 'framer-motion';

// Two distant moons drifting slowly through the scene for extra depth.
const MOONS = [
  { className: 'left-[6%] top-[18%] w-10 md:w-16', bg: 'radial-gradient(circle at 35% 30%, #cfe0ff 0%, #4d6fb8 45%, #0b1430 100%)', glow: 'rgba(120,170,255,0.35)', dur: 26, dx: 18, dy: -12 },
  { className: 'right-[8%] top-[20%] md:top-auto md:bottom-[22%] w-7 md:w-11', bg: 'radial-gradient(circle at 35% 30%, #ffd9b0 0%, #c2562e 50%, #2a0b06 100%)', glow: 'rgba(255,110,60,0.35)', dur: 32, dx: -14, dy: 10 },
];

export default function DriftingMoons() {
  return MOONS.map((m, i) => (
    <motion.div
      key={i}
      aria-hidden
      className={`absolute aspect-square rounded-full pointer-events-none ${m.className}`}
      style={{ background: m.bg, boxShadow: `0 0 30px ${m.glow}` }}
      animate={{ x: [0, m.dx, 0], y: [0, m.dy, 0], rotate: [0, 20, 0] }}
      transition={{ duration: m.dur, repeat: Infinity, ease: 'easeInOut' }}
    />
  ));
}