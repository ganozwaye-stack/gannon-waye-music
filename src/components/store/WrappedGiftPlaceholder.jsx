import { motion } from 'framer-motion';
import { Gift } from 'lucide-react';

const GIFT_CONFIGS = [
  { bg: 'from-red-600 to-red-800', ribbon: 'from-gold-400 to-yellow-500', bow: 'from-red-500 to-red-700' },
  { bg: 'from-emerald-600 to-emerald-800', ribbon: 'from-gold-400 to-yellow-500', bow: 'from-emerald-500 to-emerald-700' },
  { bg: 'from-purple-600 to-purple-800', ribbon: 'from-pink-400 to-rose-500', bow: 'from-purple-500 to-purple-700' },
  { bg: 'from-blue-600 to-blue-800', ribbon: 'from-cyan-400 to-blue-500', bow: 'from-blue-500 to-blue-700' },
  { bg: 'from-amber-600 to-amber-800', ribbon: 'from-gold-400 to-yellow-500', bow: 'from-amber-500 to-amber-700' },
];

export default function WrappedGiftPlaceholder({ index = 0 }) {
  const config = GIFT_CONFIGS[index % GIFT_CONFIGS.length];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      whileHover={{ scale: 1.05, rotateY: 10 }}
      transition={{ duration: 0.4 }}
      className="relative h-full w-full flex items-center justify-center perspective"
    >
      {/* Wrapped Gift Box */}
      <div className={`relative w-32 h-32 md:w-40 md:h-40 bg-gradient-to-br ${config.bg} rounded-lg shadow-2xl overflow-hidden`}>
        
        {/* Ribbon - Vertical */}
        <motion.div
          animate={{ opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 3, repeat: Infinity }}
          className={`absolute inset-0 bg-gradient-to-b ${config.ribbon} opacity-20 w-8 left-1/2 transform -translate-x-1/2`}
        />

        {/* Ribbon - Horizontal */}
        <motion.div
          animate={{ opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
          className={`absolute inset-0 bg-gradient-to-r ${config.ribbon} opacity-20 h-8 top-1/2 transform -translate-y-1/2`}
        />

        {/* Bow */}
        <motion.div
          animate={{ y: [0, -4, 0], rotateZ: [0, 2, -2, 0] }}
          transition={{ duration: 2.5, repeat: Infinity }}
          className={`absolute top-4 right-6 w-10 h-10 bg-gradient-to-br ${config.bow} rounded-full shadow-lg flex items-center justify-center`}
        >
          <div className={`w-6 h-6 bg-gradient-to-b ${config.bow} rounded-full opacity-70`} />
        </motion.div>

        {/* Gift Icon */}
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <Gift className="w-12 h-12 md:w-16 md:h-16 text-white/40" />
        </motion.div>

        {/* Mystery Shimmer */}
        <motion.div
          animate={{ opacity: [0, 0.3, 0] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent"
        />
      </div>

      {/* Floating Particles */}
      {[0, 1, 2].map(i => (
        <motion.div
          key={i}
          animate={{
            y: [0, -30, 0],
            opacity: [0, 1, 0],
            x: [0, Math.sin(i * 2) * 20, 0],
          }}
          transition={{
            duration: 3 + i * 0.5,
            repeat: Infinity,
            delay: i * 0.3,
          }}
          className="absolute w-1 h-1 bg-gold-400 rounded-full"
          style={{
            left: '50%',
            bottom: '20%',
            marginLeft: `${(i - 1) * 15}px`,
          }}
        />
      ))}
    </motion.div>
  );
}