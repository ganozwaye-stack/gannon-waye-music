import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Uses the actual uploaded signature images with a shimmer overlay animation
// Image 1 (brush/handwritten): first attachment
// Image 3 (metallic 3D gold): third attachment

const SHIMMER_KEYFRAMES = `
@keyframes goldShimmer {
  0% { background-position: -200% center; }
  100% { background-position: 200% center; }
}
@keyframes subtleGlow {
  0%, 100% { filter: drop-shadow(0 0 4px rgba(212,175,55,0.4)); }
  50% { filter: drop-shadow(0 0 10px rgba(212,175,55,0.7)) drop-shadow(0 0 20px rgba(212,175,55,0.3)); }
}
`;

// Inject keyframes once
if (typeof document !== 'undefined' && !document.getElementById('sig-keyframes')) {
  const style = document.createElement('style');
  style.id = 'sig-keyframes';
  style.textContent = SHIMMER_KEYFRAMES;
  document.head.appendChild(style);
}

const SIGNATURES = [
  'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/2f41e07df_2.png',       // brush handwritten
  'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/aa640bc1a_3.png',  // metallic 3D
];

// Single signature display with draw-on reveal + shimmer
function SignatureDisplay({ src, onComplete, className = '' }) {
  const [phase, setPhase] = useState('hidden'); // hidden → reveal → shimmer → done

  useEffect(() => {
    setPhase('hidden');
    const t1 = setTimeout(() => setPhase('reveal'), 100);
    const t2 = setTimeout(() => setPhase('shimmer'), 1800);
    const t3 = setTimeout(() => setPhase('done'), 3000);
    const t4 = setTimeout(() => onComplete?.(), 3800);
    return () => [t1, t2, t3, t4].forEach(clearTimeout);
  }, [src]);

  return (
    <motion.div
      className={`relative inline-flex items-center justify-center ${className}`}
      initial={{ opacity: 0, x: 0 }}
      animate={
        phase === 'hidden' ? { opacity: 0, x: 0 } :
        phase === 'done' ? { opacity: 0, x: 60, rotate: 4 } :
        { opacity: 1, x: 0, rotate: 0 }
      }
      transition={
        phase === 'done'
          ? { duration: 0.7, ease: 'easeIn' }
          : { duration: 0.6, ease: 'easeOut' }
      }
    >
      {/* Clip-reveal mask — sweeps left to right */}
      <motion.div
        style={{ overflow: 'hidden', display: 'inline-flex' }}
        initial={{ clipPath: 'inset(0 100% 0 0)' }}
        animate={phase === 'hidden' ? { clipPath: 'inset(0 100% 0 0)' } : { clipPath: 'inset(0 0% 0 0)' }}
        transition={{ duration: 1.6, ease: [0.25, 0.1, 0.25, 1] }}
      >
        <img
          src={src}
          alt="Gannon Waye signature"
          style={{
            height: '52px',
            width: 'auto',
            objectFit: 'contain',
            filter: phase === 'shimmer' || phase === 'done'
              ? 'drop-shadow(0 0 8px rgba(212,175,55,0.6))'
              : 'drop-shadow(0 0 2px rgba(212,175,55,0.2))',
            transition: 'filter 0.5s ease',
            animation: phase === 'shimmer' ? 'subtleGlow 1.2s ease-in-out infinite' : 'none',
          }}
        />
      </motion.div>

      {/* Shimmer sweep overlay */}
      {phase === 'shimmer' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.6, 0] }}
          transition={{ duration: 1.0, ease: 'easeInOut' }}
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(90deg, transparent 0%, rgba(255,242,178,0.5) 40%, rgba(255,255,255,0.7) 50%, rgba(255,242,178,0.5) 60%, transparent 100%)',
            backgroundSize: '200% 100%',
            animation: 'goldShimmer 1s linear',
            pointerEvents: 'none',
            mixBlendMode: 'overlay',
            borderRadius: '4px',
          }}
        />
      )}
    </motion.div>
  );
}

// The looping engine — cycles through both signature images
export default function AnimatedGWSignature({ className = '', size = 'md' }) {
  const [currentSig, setCurrentSig] = useState(0);
  const [key, setKey] = useState(0);

  const heights = { sm: '32px', md: '52px', lg: '72px', xl: '96px' };
  const h = heights[size] || heights.md;

  const handleComplete = () => {
    setTimeout(() => {
      setCurrentSig(s => (s + 1) % SIGNATURES.length);
      setKey(k => k + 1);
    }, 1500);
  };

  return (
    <div className={`inline-flex items-center justify-center ${className}`} style={{ minHeight: h }}>
      <AnimatePresence mode="wait">
        <SignatureDisplay
          key={key}
          src={SIGNATURES[currentSig]}
          onComplete={handleComplete}
        />
      </AnimatePresence>
    </div>
  );
}