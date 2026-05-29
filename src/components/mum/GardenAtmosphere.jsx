import React from 'react';
import { motion } from 'framer-motion';

// Subtle ambient background element used between sections
export default function GardenAtmosphere({ variant = 'left' }) {
  const isLeft = variant === 'left';

  return (
    <div className={`absolute pointer-events-none overflow-hidden ${isLeft ? 'left-0' : 'right-0'} top-0 bottom-0 w-48 md:w-72 opacity-[0.04]`}>
      {/* Leaf shape 1 */}
      <motion.div
        className="absolute"
        style={{
          width: 120, height: 200,
          background: 'radial-gradient(ellipse, #3a6b2a 0%, transparent 70%)',
          borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%',
          left: isLeft ? -40 : 'auto',
          right: isLeft ? 'auto' : -40,
          top: '20%',
          transform: `rotate(${isLeft ? -20 : 20}deg)`,
        }}
        animate={{ rotate: [isLeft ? -20 : 20, isLeft ? -15 : 15, isLeft ? -20 : 20] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />
      {/* Leaf shape 2 */}
      <motion.div
        className="absolute"
        style={{
          width: 80, height: 160,
          background: 'radial-gradient(ellipse, #2a5520 0%, transparent 70%)',
          borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%',
          left: isLeft ? 20 : 'auto',
          right: isLeft ? 'auto' : 20,
          top: '50%',
          transform: `rotate(${isLeft ? -35 : 35}deg)`,
        }}
        animate={{ rotate: [isLeft ? -35 : 35, isLeft ? -28 : 28, isLeft ? -35 : 35] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
      />
    </div>
  );
}