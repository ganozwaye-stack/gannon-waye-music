import React from 'react';
import { motion } from 'framer-motion';

const SINGLE_ARTWORK = 'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/e8df43132_ChatGPTImageJun23202603_50_22PM.png';

/**
 * "Without You Here" single cover — appears in every section of the tribute page.
 * A small, elegant framed plaque that creates a visual thread tying the memorial to the song.
 */
export default function SingleCoverPlaque({ size = 'md', align = 'center', delay = 0 }) {
  const dims = {
    sm: { w: 120, maxW: '38vw' },
    md: { w: 180, maxW: '50vw' },
    lg: { w: 260, maxW: '70vw' },
  }[size] || { w: 180, maxW: '50vw' };

  const alignClass = align === 'right' ? 'items-end' : align === 'left' ? 'items-start' : 'items-center';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 1, delay }}
      className={`flex flex-col ${alignClass} w-full`}
    >
      <motion.div
        whileHover={{ scale: 1.03, y: -4 }}
        transition={{ duration: 0.4 }}
        style={{
          width: dims.w,
          maxWidth: dims.maxW,
          aspectRatio: '1/1',
          border: '4px solid',
          borderColor: 'rgba(212,175,55,0.50)',
          borderRadius: 6,
          background: 'rgba(5,8,5,0.90)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.7), 0 0 24px rgba(212,175,55,0.15), inset 0 0 0 1px rgba(212,175,55,0.10)',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        <img
          src={SINGLE_ARTWORK}
          alt="Without You Here — Gannon Waye single artwork"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center',
            display: 'block',
          }}
        />
        {/* Subtle gold glow overlay */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(ellipse at 50% 30%, transparent 60%, rgba(212,175,55,0.06) 100%)',
          pointerEvents: 'none',
        }} />
      </motion.div>

      {/* Label */}
      <div style={{
        marginTop: 8,
        padding: '4px 14px',
        background: 'linear-gradient(135deg, rgba(212,175,55,0.10), rgba(212,175,55,0.04))',
        border: '1px solid rgba(212,175,55,0.20)',
        borderRadius: 4,
        textAlign: 'center',
      }}>
        <p style={{
          fontFamily: 'var(--font-display)',
          fontStyle: 'italic',
          fontSize: 11,
          color: 'rgba(245,208,110,0.55)',
          letterSpacing: '0.06em',
          lineHeight: 1.3,
        }}>
          Without You Here
        </p>
        <p style={{
          fontFamily: 'var(--font-body)',
          fontSize: 8,
          color: 'rgba(212,175,55,0.32)',
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          marginTop: 2,
        }}>
          New Single · Coming Soon
        </p>
      </div>
    </motion.div>
  );
}