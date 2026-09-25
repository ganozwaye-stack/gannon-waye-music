import { motion } from 'framer-motion';

// Extra atmosphere over the galaxy plate: drifting nebula blooms in brand gold,
// deep space blue and teal, plus a soft aurora band. Owner-directed 25
// September 2026: the galaxy needed more atmosphere. Pure gradients, no
// heavy assets, so the hero still paints instantly.
export default function GalaxyAtmosphere() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
      <motion.div
        className="absolute -top-[20%] left-[6%] w-[55vw] h-[55vw] rounded-full"
        style={{ background: 'radial-gradient(circle, rgba(64,110,255,0.16) 0%, rgba(30,50,140,0.07) 45%, transparent 70%)', filter: 'blur(10px)' }}
        animate={{ x: [0, 40, 0], y: [0, 25, 0] }}
        transition={{ duration: 46, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute bottom-[6%] -left-[12%] w-[48vw] h-[48vw] rounded-full"
        style={{ background: 'radial-gradient(circle, rgba(212,175,55,0.13) 0%, rgba(140,90,20,0.06) 45%, transparent 70%)', filter: 'blur(12px)' }}
        animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
        transition={{ duration: 52, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute top-[28%] -right-[10%] w-[40vw] h-[40vw] rounded-full"
        style={{ background: 'radial-gradient(circle, rgba(0,140,160,0.12) 0%, transparent 65%)', filter: 'blur(14px)' }}
        animate={{ y: [0, -30, 0] }}
        transition={{ duration: 40, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute top-[16%] -left-[10%] w-[120%] h-[22vh]"
        style={{ background: 'linear-gradient(100deg, transparent 5%, rgba(120,180,255,0.08) 35%, rgba(212,175,55,0.10) 55%, transparent 90%)', filter: 'blur(18px)' }}
        animate={{ y: [0, 14, 0], opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 26, repeat: Infinity, ease: 'easeInOut' }}
      />
    </div>
  );
}