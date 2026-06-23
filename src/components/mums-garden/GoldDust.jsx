import { motion } from 'framer-motion';

export default function GoldDust({ count = 20 }) {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden>
      {[...Array(count)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: `${1 + (i % 3) * 0.8}px`,
            height: `${1 + (i % 3) * 0.8}px`,
            background: `rgba(245,224,160,${0.06 + (i % 5) * 0.05})`,
            left: `${(i * 3.71 + 2) % 96}%`,
            top: `${(i * 6.13 + 4) % 90}%`,
          }}
          animate={{ y: [0, -(20 + (i % 4) * 14), 0], opacity: [0.02, 0.35, 0.02] }}
          transition={{ duration: 6 + (i % 5) * 1.6, repeat: Infinity, delay: i * 0.35, ease: 'easeInOut' }}
        />
      ))}
    </div>
  );
}