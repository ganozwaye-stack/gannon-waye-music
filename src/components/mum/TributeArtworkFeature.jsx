import React, { useState } from 'react';
import { motion } from 'framer-motion';

const HERO_ARTWORK = 'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/74273a2aa_image.png';

export default function TributeArtworkFeature() {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [hovered, setHovered] = useState(false);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    setTilt({
      x: ((e.clientY - cy) / rect.height) * 5,
      y: -((e.clientX - cx) / rect.width) * 5,
    });
  };

  return (
    <motion.figure
      data-testid="mum-hero-artwork-frame"
      className="relative mx-auto my-8 md:my-10"
      style={{
        maxWidth: 'min(88vw, 860px)',
        perspective: 1000,
      }}
      initial={{ opacity: 0, y: 40, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 1.4, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); setTilt({ x: 0, y: 0 }); }}
    >
      {/* Outer gold glow ring */}
      <motion.div
        className="absolute -inset-1 rounded-3xl pointer-events-none z-0"
        animate={{ opacity: hovered ? 0.55 : 0.3 }}
        transition={{ duration: 0.6 }}
        style={{
          background: 'radial-gradient(ellipse at 50% 50%, rgba(212,175,55,0.18) 0%, transparent 70%)',
          filter: 'blur(12px)',
        }}
      />

      {/* Card with 3D tilt */}
      <motion.div
        className="relative z-10 overflow-hidden"
        animate={{
          rotateX: hovered ? tilt.x : 0,
          rotateY: hovered ? tilt.y : 0,
        }}
        transition={{ type: 'spring', stiffness: 160, damping: 22 }}
        style={{
          borderRadius: '24px',
          border: '1px solid rgba(212,175,55,0.32)',
          boxShadow: hovered
            ? '0 40px 100px rgba(0,0,0,0.65), 0 0 60px rgba(212,175,55,0.14)'
            : '0 24px 70px rgba(0,0,0,0.58), 0 0 40px rgba(212,175,55,0.10)',
          transformStyle: 'preserve-3d',
          transition: 'box-shadow 0.5s ease',
        }}
      >
        {/* Luxury rim light overlay — does NOT darken Sonia */}
        <div
          className="absolute inset-0 pointer-events-none z-[2]"
          style={{
            background: 'linear-gradient(120deg, rgba(212,175,55,0.12) 0%, transparent 28%, transparent 72%, rgba(100,20,38,0.10) 100%)',
            mixBlendMode: 'screen',
          }}
        />

        <img
          src={HERO_ARTWORK}
          alt="Cinematic tribute artwork for Sonia Katisa Waye, 1961 to 2022 — Sonia in her garden, holding a coffee mug with Gannon's album cover, surrounded by her dogs, flowers, and gold light"
          data-testid="mum-hero-artwork"
          className="w-full h-auto block"
          style={{ display: 'block', borderRadius: '23px' }}
          loading="eager"
          fetchpriority="high"
        />
      </motion.div>

      {/* Floating animation — very subtle vertical drift */}
      <motion.div
        className="absolute inset-0 z-0 pointer-events-none"
        animate={{ y: [-3, 3, -3] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      />
    </motion.figure>
  );
}