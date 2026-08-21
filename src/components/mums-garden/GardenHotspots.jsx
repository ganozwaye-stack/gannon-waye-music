import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MemoryFrame from '@/components/mums-garden/MemoryFrame';

// A calm garden scene with glowing memory hotspots.
// Tap a light to reveal a 3D-framed memory beneath the scene.
export default function GardenHotspots({ scene, hotspots = [] }) {
  const [active, setActive] = useState(null);
  const activeSpot = hotspots[active];

  return (
    <div className="relative w-full" style={{ background: '#0a0a0f' }}>
      <div className="relative w-full" style={{ aspectRatio: '16 / 9' }}>
        <img src={scene} alt="Sonia's garden" className="absolute inset-0 h-full w-full object-cover" />
        <div
          className="absolute inset-0"
          style={{ background: 'radial-gradient(120% 90% at 50% 45%, rgba(8,8,14,0.12) 0%, rgba(8,8,14,0.72) 100%)' }}
        />
        {hotspots.map((h, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setActive(active === i ? null : i)}
            className="absolute -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${h.x}%`, top: `${h.y}%` }}
            aria-label={h.caption}
          >
            <span className="relative flex items-center justify-center">
              <motion.span
                className="absolute rounded-full"
                style={{ width: 36, height: 36, background: 'rgba(212,175,55,0.16)', border: '1px solid rgba(212,175,55,0.4)' }}
                animate={{ scale: [1, 1.6, 1], opacity: [0.5, 0, 0.5] }}
                transition={{ duration: 3, repeat: Infinity, delay: i * 0.4 }}
              />
              <motion.span
                className="relative block rounded-full"
                style={{ width: 13, height: 13, background: 'rgba(245,224,160,0.9)', boxShadow: '0 0 16px rgba(212,175,55,0.75)' }}
                whileHover={{ scale: 1.3 }}
                animate={{ opacity: active === i ? 1 : 0.85 }}
              />
            </span>
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {activeSpot && (
          <motion.div
            key={active}
            className="relative mx-auto max-w-sm px-6 pb-4 pt-10"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <MemoryFrame src={activeSpot.src} caption={activeSpot.caption} />
            <p
              className="mt-5 text-center font-body text-sm leading-relaxed"
              style={{ color: 'rgba(245,224,160,0.6)' }}
            >
              {activeSpot.memory}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}