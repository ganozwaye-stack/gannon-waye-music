import React from 'react';
import { motion } from 'framer-motion';

// Floating leaf SVG
function Leaf({ style, delay, duration }) {
  return (
    <motion.div
      className="absolute pointer-events-none select-none"
      style={style}
      animate={{ y: [-8, 8, -8], rotate: [-5, 5, -5], opacity: [0.25, 0.45, 0.25] }}
      transition={{ duration, repeat: Infinity, delay, ease: 'easeInOut' }}
    >
      <svg viewBox="0 0 40 60" width="32" height="48" fill="none">
        <path d="M20 2 C 8 12 2 30 20 58 C 38 30 32 12 20 2 Z" fill="rgba(34,80,34,0.55)" />
        <path d="M20 2 C 20 20 20 40 20 58" stroke="rgba(60,120,60,0.3)" strokeWidth="1" />
      </svg>
    </motion.div>
  );
}

// Butterfly
function Butterfly({ style, delay }) {
  return (
    <motion.div
      className="absolute pointer-events-none"
      style={style}
      animate={{ x: [-20, 20, -20], y: [-10, 10, -10], opacity: [0, 0.4, 0] }}
      transition={{ duration: 8, repeat: Infinity, delay, ease: 'easeInOut' }}
    >
      <svg viewBox="0 0 50 35" width="28" height="20" fill="none">
        {/* Left wing */}
        <path d="M25 17 C 10 5 2 15 8 24 C 14 30 22 22 25 17 Z" fill="rgba(212,175,55,0.5)" />
        {/* Right wing */}
        <path d="M25 17 C 40 5 48 15 42 24 C 36 30 28 22 25 17 Z" fill="rgba(212,175,55,0.5)" />
        {/* Body */}
        <line x1="25" y1="10" x2="25" y2="28" stroke="rgba(180,140,40,0.6)" strokeWidth="1.5" />
      </svg>
    </motion.div>
  );
}

const LEAVES = [
  { style: { left: '3%', top: '15%' }, delay: 0, duration: 5 },
  { style: { left: '8%', top: '50%' }, delay: 1.5, duration: 6 },
  { style: { right: '5%', top: '20%' }, delay: 0.8, duration: 7 },
  { style: { right: '10%', top: '60%' }, delay: 2, duration: 5.5 },
  { style: { left: '15%', top: '80%' }, delay: 0.4, duration: 6.5 },
  { style: { right: '20%', top: '75%' }, delay: 1.2, duration: 5 },
  { style: { left: '50%', top: '5%' }, delay: 2.5, duration: 7 },
  { style: { right: '35%', top: '90%' }, delay: 0.9, duration: 6 },
];

const BUTTERFLIES = [
  { style: { left: '20%', top: '25%' }, delay: 2 },
  { style: { right: '25%', top: '40%' }, delay: 5 },
  { style: { left: '60%', top: '70%' }, delay: 8 },
];

export default function GardenAtmosphere({ children }) {
  return (
    <div id="sonias-garden-bg" className="relative overflow-hidden">
      {/* Garden section background glow */}
      <div className="absolute inset-0 pointer-events-none z-0" style={{
        background: 'radial-gradient(ellipse at 50% 30%, rgba(20,50,20,0.18) 0%, transparent 65%), radial-gradient(ellipse at 20% 70%, rgba(100,20,35,0.08) 0%, transparent 50%)'
      }} />

      {/* Animated leaves */}
      {LEAVES.map((l, i) => (
        <Leaf key={i} style={l.style} delay={l.delay} duration={l.duration} />
      ))}

      {/* Butterflies */}
      {BUTTERFLIES.map((b, i) => (
        <Butterfly key={i} style={b.style} delay={b.delay} />
      ))}

      {/* Gold particles */}
      <div className="absolute inset-0 pointer-events-none z-0">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              width: '2px', height: '2px',
              background: `rgba(212,175,55,${0.1 + (i % 3) * 0.07})`,
              left: `${12 + (i * 11) % 76}%`,
              top: `${20 + (i * 13) % 60}%`,
            }}
            animate={{ y: [-6, -20, -6], opacity: [0.06, 0.35, 0.06] }}
            transition={{ duration: 5 + (i % 3), repeat: Infinity, delay: i * 0.7, ease: 'easeInOut' }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}