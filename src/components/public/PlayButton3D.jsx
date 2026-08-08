import React from 'react';
import { Play } from 'lucide-react';
import { motion } from 'framer-motion';

// 3D metallic-gold play button, used on featured artwork and gift-wrapped cards.
// Purely presentational, the parent passes the onClick (play in the site player or navigate).
export default function PlayButton3D({ onClick, size = 64, label = 'Play' }) {
  const tri = size * 0.32;
  return (
    <motion.button
      type="button"
      onClick={onClick}
      aria-label={label}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.93 }}
      className="relative grid place-items-center rounded-full"
      style={{
        width: size,
        height: size,
        background: 'radial-gradient(circle at 36% 30%, #f0e6c8 0%, #d4af37 46%, #a9842c 100%)',
        boxShadow:
          '0 10px 28px rgba(0,0,0,0.55), inset 0 2px 5px rgba(240,230,200,0.65), inset 0 -6px 12px rgba(120,90,20,0.65)',
        border: '1px solid rgba(212,175,55,0.7)',
      }}
    >
      <span className="absolute inset-0 rounded-full pointer-events-none" style={{ boxShadow: '0 0 22px rgba(212,175,55,0.45)' }} />
      <Play
        className="relative"
        style={{ width: tri, height: tri, marginLeft: tri * 0.12, color: '#1a1408' }}
        fill="#1a1408"
      />
    </motion.button>
  );
}