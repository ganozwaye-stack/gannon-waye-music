import { motion } from 'framer-motion';

// Extra atmosphere over the galaxy plate: drifting nebula blooms in the warm
// sepia palette of the owner's approved memorial video (soft tan, dusty
// rose, cream peach) instead of cold space blue and teal. Pure gradients,
// no heavy assets, so the hero still paints instantly.
export default function GalaxyAtmosphere() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
      <motion.div
        className="absolute -top-[20%] left-[6%] w-[55vw] h-[55vw] rounded-full"
        style={{ background: 'radial-gradient(circle, rgba(166,139,117,0.17) 0%, rgba(74,63,57,0.08) 45%, transparent 70%)', filter: 'blur(10px)' }}
        animate={{ x: [0, 40, 0], y: [0, 25, 0] }}
        transition={{ duration: 46, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute bottom-[6%] -left-[12%] w-[48vw] h-[48vw] rounded-full"
        style={{ background: 'radial-gradient(circle, rgba(242,208,179,0.14) 0%, rgba(166,139,117,0.07) 45%, transparent 70%)', filter: 'blur(12px)' }}
        animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
        transition={{ duration: 52, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute top-[28%] -right-[10%] w-[40vw] h-[40vw] rounded-full"
        style={{ background: 'radial-gradient(circle, rgba(230,194,191,0.13) 0%, transparent 65%)', filter: 'blur(14px)' }}
        animate={{ y: [0, -30, 0] }}
        transition={{ duration: 40, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute top-[16%] -left-[10%] w-[120%] h-[22vh]"
        style={{ background: 'linear-gradient(100deg, transparent 5%, rgba(230,194,191,0.10) 35%, rgba(242,208,179,0.12) 55%, transparent 90%)', filter: 'blur(18px)' }}
        animate={{ y: [0, 14, 0], opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 26, repeat: Infinity, ease: 'easeInOut' }}
      />
    </div>
  );
}