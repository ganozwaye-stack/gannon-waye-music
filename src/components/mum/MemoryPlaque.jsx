import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// A garden memory plaque — photo in a "frame" on a garden post
// Used instead of a gallery grid — each photo feels like a stop on a journey
export default function MemoryPlaque({ photo, label, caption, align = 'center', delay = 0 }) {
  const [flipped, setFlipped] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.9, delay }}
      className={`flex flex-col items-${align === 'right' ? 'end' : align === 'left' ? 'start' : 'center'} w-full`}
    >
      <div
        className="relative cursor-pointer"
        style={{ width: 240, maxWidth: '80vw' }}
        onClick={() => setFlipped(f => !f)}
      >
        {/* Wooden post */}
        <div style={{
          width: 8, height: 28,
          background: 'linear-gradient(90deg, #5a3e1b, #8b6333, #5a3e1b)',
          borderRadius: 2,
          margin: '0 auto',
          boxShadow: '2px 2px 6px rgba(0,0,0,0.5)',
        }} />

        {/* Frame */}
        <motion.div
          whileHover={{ scale: 1.03, rotateZ: flipped ? 0 : 1 }}
          style={{
            border: '5px solid',
            borderColor: 'rgba(212,175,55,0.55)',
            borderRadius: 4,
            background: 'rgba(5,8,5,0.90)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.7), 0 0 20px rgba(212,175,55,0.12), inset 0 0 0 1px rgba(212,175,55,0.12)',
            overflow: 'hidden',
            aspectRatio: '4/5',
            position: 'relative',
          }}
        >
          <AnimatePresence mode="wait">
            {!flipped ? (
              <motion.img
                key="photo"
                src={photo}
                alt={label}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                style={{
                  width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top',
                  filter: 'brightness(0.88) saturate(0.92) sepia(0.08)',
                  display: 'block',
                }}
              />
            ) : (
              <motion.div
                key="caption"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="w-full h-full flex items-center justify-center p-5 text-center"
                style={{ background: 'rgba(3,6,3,0.97)' }}
              >
                <p className="font-display italic text-base leading-relaxed" style={{ color: 'rgba(245,208,110,0.7)' }}>
                  "{caption}"
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Gradient overlay */}
          {!flipped && (
            <div style={{
              position: 'absolute', inset: 0,
              background: 'linear-gradient(to top, rgba(3,6,3,0.72) 0%, transparent 45%)',
              pointerEvents: 'none',
            }} />
          )}

          {/* Tap hint */}
          {!flipped && (
            <div style={{
              position: 'absolute', bottom: 8, right: 8,
              fontSize: 10, color: 'rgba(212,175,55,0.4)',
              fontFamily: 'var(--font-body)',
              letterSpacing: '0.1em',
            }}>tap ↩</div>
          )}
        </motion.div>

      </div>
    </motion.div>
  );
}