import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Enhanced candle lighting feature — multiple candle styles, ambient glow intensifies with each lit candle
export default function EnhancedCandle({ variant = 'pillar', index = 0 }) {
  const [lit, setLit] = useState(false);

  const VARIANTS = {
    pillar: { width: 48, height: 80, radius: 3, glowSize: 40, flameSize: 1 },
    votive: { width: 40, height: 52, radius: 4, glowSize: 32, flameSize: 0.82 },
    tea: { width: 32, height: 28, radius: 4, glowSize: 24, flameSize: 0.62 },
  };

  const v = VARIANTS[variant] || VARIANTS.pillar;

  return (
    <div className="relative flex flex-col items-center" style={{ width: v.width + 16 }}>
      {/* Flame */}
      <AnimatePresence>
        {lit && (
          <motion.div
            className="absolute"
            style={{ bottom: v.height + 2, left: '50%', marginLeft: -v.flameSize * 12 }}
            initial={{ opacity: 0, scaleY: 0, scaleX: 0.5 }}
            animate={{ opacity: 1, scaleY: 1, scaleX: 1 }}
            exit={{ opacity: 0, scaleY: 0 }}
            transition={{ duration: 0.6, ease: 'backOut' }}
          >
            {/* Outer glow halo */}
            <motion.div
              style={{
                width: v.glowSize * 2.5,
                height: v.glowSize * 2.5,
                position: 'absolute',
                left: '50%',
                top: '50%',
                marginLeft: -v.glowSize * 1.25,
                marginTop: -v.glowSize * 1.25,
                background: 'radial-gradient(circle, rgba(255,200,80,0.35) 0%, rgba(255,160,40,0.12) 40%, transparent 70%)',
                borderRadius: '50%',
                pointerEvents: 'none',
              }}
              animate={{
                scale: [1, 1.15, 0.95, 1.1, 1],
                opacity: [0.5, 0.7, 0.4, 0.6, 0.5],
              }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            />

            {/* Teardrop flame */}
            <motion.div
              style={{
                width: v.flameSize * 24,
                height: v.flameSize * 40,
                borderRadius: '50% 50% 30% 30%',
                background: 'radial-gradient(ellipse at 50% 80%, #fff 0%, #ffe08a 20%, #f5c842 45%, #e07c10 75%, transparent 100%)',
                boxShadow: `0 0 ${v.glowSize}px ${v.glowSize * 0.3}px rgba(245,200,66,0.6), 0 0 ${v.glowSize * 2}px ${v.glowSize * 0.5}px rgba(220,130,20,0.25)`,
                position: 'relative',
              }}
              animate={{
                scaleX: [1, 1.18, 0.88, 1.12, 1],
                scaleY: [1, 0.9, 1.14, 0.92, 1],
                rotate: [-1, 2, -2, 1, 0],
              }}
              transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut', delay: index * 0.2 }}
            >
              {/* Inner blue core */}
              <motion.div
                style={{
                  width: v.flameSize * 10,
                  height: v.flameSize * 16,
                  borderRadius: '50%',
                  background: 'radial-gradient(ellipse, rgba(120,180,255,0.5) 0%, transparent 80%)',
                  position: 'absolute',
                  bottom: '10%',
                  left: '50%',
                  marginLeft: -v.flameSize * 5,
                }}
                animate={{ opacity: [0.4, 0.6, 0.3, 0.5, 0.4] }}
                transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
              />
            </motion.div>

            {/* Smoke wisp when first lit */}
            <motion.div
              style={{
                width: 3,
                height: 30,
                position: 'absolute',
                bottom: '100%',
                left: '50%',
                marginLeft: -1.5,
                background: 'linear-gradient(to top, rgba(200,200,200,0.3), transparent)',
                borderRadius: 999,
              }}
              initial={{ opacity: 0.6, y: 0 }}
              animate={{ opacity: 0, y: -40, x: [0, 8, -4, 6, 0] }}
              transition={{ duration: 2.5, ease: 'easeOut' }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Candle body */}
      <button
        onClick={() => setLit(true)}
        aria-label="Light a candle in memory of Sonia"
        className="group relative transition-all duration-500 hover:scale-105 active:scale-95"
        style={{ cursor: lit ? 'default' : 'pointer' }}
      >
        {/* Wax drip texture */}
        <div
          style={{
            width: '100%',
            height: v.height,
            borderRadius: v.radius,
            background: lit
              ? 'linear-gradient(180deg, #fff8e0 0%, #f5ead0 30%, #ede0b6 70%, #c9a84c 100%)'
              : 'linear-gradient(180deg, #c8c0a4 0%, #a8a080 60%, #988e6e 100%)',
            border: `1px solid ${lit ? 'rgba(245,200,66,0.6)' : 'rgba(160,140,100,0.25)'}`,
            boxShadow: lit
              ? `0 0 ${v.glowSize * 1.5}px rgba(245,200,66,0.4), 0 0 ${v.glowSize * 3}px rgba(212,175,55,0.18), inset -2px 0 6px rgba(0,0,0,0.15), inset 2px 0 6px rgba(255,255,255,0.1)`
              : 'inset -2px 0 6px rgba(0,0,0,0.2), inset 2px 0 6px rgba(255,255,255,0.05)',
            transition: 'all 1s ease',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Wax drip lines */}
          {lit && [0, 1, 2].map(i => (
            <div key={i} style={{
              position: 'absolute',
              top: `${10 + i * 15}%`,
              left: `${20 + i * 30}%`,
              width: 3,
              height: `${15 + i * 8}%`,
              background: 'linear-gradient(to bottom, rgba(255,255,255,0.25), transparent)',
              borderRadius: 999,
            }} />
          ))}
          {/* Wick */}
          <div style={{
            position: 'absolute',
            top: -3,
            left: '50%',
            marginLeft: -1,
            width: 2,
            height: 6,
            background: lit ? '#3a2a10' : '#5a4a30',
            borderRadius: 1,
          }} />
        </div>
      </button>
    </div>
  );
}

// Candle garden — multiple candles of different styles
export function CandleGarden({ count = 5 }) {
  const variants = ['pillar', 'votive', 'tea', 'votive', 'pillar'];
  return (
    <div className="flex flex-wrap items-end justify-center gap-5">
      {Array.from({ length: count }).map((_, i) => (
        <EnhancedCandle key={i} variant={variants[i % variants.length]} index={i} />
      ))}
    </div>
  );
}