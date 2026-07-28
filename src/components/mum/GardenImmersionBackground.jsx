import React from 'react';
import { motion } from 'framer-motion';

const FOG_BANDS = [
  { bottom: '9%', left: '-18%', width: '66%', delay: 0, duration: 24, opacity: 0.18 },
  { bottom: '18%', left: '24%', width: '58%', delay: 5, duration: 28, opacity: 0.13 },
  { bottom: '5%', left: '54%', width: '62%', delay: 10, duration: 31, opacity: 0.16 },
];

const SUNBEAMS = [
  { left: '14%', top: '-12%', width: '10%', rotate: -18, opacity: 0.17 },
  { left: '35%', top: '-10%', width: '13%', rotate: -9, opacity: 0.13 },
  { left: '58%', top: '-16%', width: '11%', rotate: 8, opacity: 0.12 },
  { left: '75%', top: '-9%', width: '8%', rotate: 16, opacity: 0.10 },
];

export default function GardenImmersionBackground({ reducedMotion = false }) {
  return (
    <div className="pointer-events-none absolute inset-0 z-10 overflow-hidden" aria-hidden="true">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_4%,rgba(255,231,165,0.30),transparent_28%),linear-gradient(180deg,rgba(5,11,6,0.02),rgba(5,11,6,0.18)_56%,rgba(3,6,3,0.46))]" />

      {SUNBEAMS.map((beam, index) => (
        <motion.div
          key={index}
          className="absolute h-[76%] origin-top bg-[linear-gradient(180deg,rgba(255,229,166,0.42),rgba(255,229,166,0.10)_48%,transparent)] blur-[2px]"
          style={{
            left: beam.left,
            top: beam.top,
            width: beam.width,
            rotate: `${beam.rotate}deg`,
            opacity: beam.opacity,
            transform: `rotate(${beam.rotate}deg)`,
          }}
          animate={reducedMotion ? undefined : { opacity: [beam.opacity * 0.55, beam.opacity, beam.opacity * 0.62] }}
          transition={{ duration: 16 + index * 3, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}

      {FOG_BANDS.map((fog, index) => (
        <motion.div
          key={index}
          className="absolute h-24 rounded-full bg-[radial-gradient(ellipse,rgba(229,223,197,0.36),rgba(229,223,197,0.12)_44%,transparent_72%)] blur-2xl"
          style={{
            bottom: fog.bottom,
            left: fog.left,
            width: fog.width,
            opacity: fog.opacity,
          }}
          animate={reducedMotion ? undefined : { x: ['0%', '16%', '0%'], opacity: [fog.opacity * 0.62, fog.opacity, fog.opacity * 0.72] }}
          transition={{ duration: fog.duration, delay: fog.delay, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}

      <div className="absolute inset-x-0 bottom-0 h-[34%] bg-[linear-gradient(0deg,rgba(2,5,2,0.58),rgba(2,5,2,0.22)_42%,transparent)]" />
      <div className="absolute inset-y-0 left-0 w-[13%] bg-[linear-gradient(90deg,rgba(2,5,2,0.44),transparent)]" />
      <div className="absolute inset-y-0 right-0 w-[13%] bg-[linear-gradient(270deg,rgba(2,5,2,0.44),transparent)]" />
    </div>
  );
}
