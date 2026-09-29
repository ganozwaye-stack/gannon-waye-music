import { motion } from 'framer-motion';

// Electric charge for the orbit ring: two bright sparks ride the whole ring's
// diagonal band, one lapping in front of the heart and one behind, each
// flickering like live current.
const SPARK_BG = 'radial-gradient(circle, #FFFFFF 0%, #F2D0B3 45%, rgba(230,194,191,0) 100%)';
const SPARK_GLOW = '0 0 6px rgba(255,255,255,0.95), 0 0 14px rgba(242,208,179,0.8), 0 0 28px rgba(230,194,191,0.5)';

function Spark({ front }) {
  // Ring geometry: the whole ring plate spans -25% to 125% of the heart width
  // and its visible line runs from (-25%, 49%) up to (125%, 22%).
  const path = front
    ? { left: ['-25%', '125%'], top: ['49%', '22%'] }
    : { left: ['125%', '-25%'], top: ['22%', '49%'] };
  const lap = front ? 6.5 : 10;
  return (
    <motion.div
      aria-hidden
      className="absolute pointer-events-none rounded-full"
      style={{
        width: 7,
        height: 7,
        marginLeft: -3.5,
        marginTop: -3.5,
        background: SPARK_BG,
        boxShadow: SPARK_GLOW,
        transform: `translateZ(${front ? 45 : -45}px)`,
      }}
      animate={{ ...path, opacity: front ? [1, 0.35, 1, 0.75, 1] : [0.7, 0.2, 0.7] }}
      transition={{
        left: { duration: lap, repeat: Infinity, ease: 'linear' },
        top: { duration: lap, repeat: Infinity, ease: 'linear' },
        opacity: { duration: 1.1, repeat: Infinity, ease: 'easeInOut' },
      }}
    />
  );
}

export default function RingSparks() {
  return (
    <>
      <Spark front />
      <Spark front={false} />
    </>
  );
}