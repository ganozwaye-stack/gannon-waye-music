import React from 'react';
import { motion } from 'framer-motion';
import { Lock, Sparkles } from 'lucide-react';

// Gift-wrapped coming soon release card
// Wraps releases in gannonwaye.com gift-wrap styling
export default function GiftWrapRelease({ release, isAlbum = false }) {
  const wrapGradient = isAlbum
    ? 'linear-gradient(135deg, rgba(212,175,55,0.15) 0%, rgba(245,208,110,0.08) 40%, rgba(255,224,138,0.12) 50%, rgba(245,208,110,0.08) 60%, rgba(212,175,55,0.15) 100%)'
    : 'linear-gradient(135deg, rgba(212,175,55,0.08) 0%, rgba(245,208,110,0.04) 50%, rgba(212,175,55,0.08) 100%)';

  const borderColor = isAlbum ? 'rgba(245,208,110,0.45)' : 'rgba(212,175,55,0.25)';

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className={`relative ${isAlbum ? 'w-full max-w-3xl mx-auto' : 'w-full'}`}
    >
      {/* Ribbon — vertical */}
      <div
        className="absolute pointer-events-none"
        style={{
          left: '50%',
          top: 0,
          bottom: 0,
          width: isAlbum ? 80 : 50,
          marginLeft: isAlbum ? -40 : -25,
          background: 'linear-gradient(180deg, rgba(212,175,55,0.25) 0%, rgba(245,208,110,0.35) 50%, rgba(212,175,55,0.25) 100%)',
          boxShadow: '0 0 20px rgba(212,175,55,0.15)',
          zIndex: 5,
        }}
      />
      {/* Ribbon — horizontal */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: '50%',
          left: 0,
          right: 0,
          height: isAlbum ? 80 : 50,
          marginTop: isAlbum ? -40 : -25,
          background: 'linear-gradient(90deg, rgba(212,175,55,0.25) 0%, rgba(245,208,110,0.35) 50%, rgba(212,175,55,0.25) 100%)',
          boxShadow: '0 0 20px rgba(212,175,55,0.15)',
          zIndex: 5,
        }}
      />
      {/* Bow — center top */}
      <motion.div
        className="absolute pointer-events-none"
        style={{
          top: isAlbum ? -20 : -12,
          left: '50%',
          marginLeft: isAlbum ? -24 : -16,
          zIndex: 10,
        }}
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      >
        <Sparkles
          className={isAlbum ? 'w-12 h-12' : 'w-8 h-8'}
          style={{ color: 'rgba(245,208,110,0.7)', filter: 'drop-shadow(0 0 8px rgba(245,208,110,0.4))' }}
        />
      </motion.div>

      {/* Card */}
      <div
        className={`relative overflow-hidden rounded-2xl ${isAlbum ? 'p-10 md:p-14' : 'p-6 md:p-8'}`}
        style={{
          background: wrapGradient,
          border: `2px solid ${borderColor}`,
          boxShadow: isAlbum
            ? '0 0 60px rgba(212,175,55,0.15), 0 20px 60px rgba(0,0,0,0.5)'
            : '0 0 30px rgba(212,175,55,0.08), 0 10px 30px rgba(0,0,0,0.4)',
        }}
      >
        {/* Inner border — gift wrap texture */}
        <div
          className="absolute inset-2 rounded-xl pointer-events-none"
          style={{
            border: `1px solid ${isAlbum ? 'rgba(245,208,110,0.2)' : 'rgba(212,175,55,0.12)'}`,
            background: 'repeating-linear-gradient(45deg, transparent, transparent 20px, rgba(212,175,55,0.02) 20px, rgba(212,175,55,0.02) 40px)',
          }}
        />

        {/* Content */}
        <div className="relative z-10 text-center">
          {/* Badge */}
          <div className="flex items-center justify-center gap-2 mb-4">
            <Lock className={isAlbum ? 'w-4 h-4' : 'w-3 h-3'} style={{ color: 'rgba(245,208,110,0.6)' }} />
            <span
              className={`font-body uppercase tracking-[0.3em] ${isAlbum ? 'text-xs' : 'text-[10px]'}`}
              style={{ color: 'rgba(245,208,110,0.6)' }}
            >
              {isAlbum ? 'Album, Releasing Next Year' : 'Coming Soon · Currently Underway'}
            </span>
          </div>

          {/* Title */}
          <h3
            className={`font-display ${isAlbum ? 'text-4xl md:text-6xl' : 'text-2xl md:text-3xl'} text-foreground mb-3`}
            style={{ textShadow: isAlbum ? '0 0 30px rgba(212,175,55,0.3)' : 'none' }}
          >
            {release.title}
          </h3>

          {/* Type badge */}
          <div className="flex items-center justify-center gap-3 mb-4">
            <span
              className="font-body text-[10px] uppercase tracking-widest px-3 py-1 rounded-full"
              style={{
                background: 'rgba(212,175,55,0.1)',
                border: '1px solid rgba(212,175,55,0.2)',
                color: 'rgba(245,208,110,0.7)',
              }}
            >
              {release.type || (isAlbum ? 'Album' : 'Single')}
            </span>
          </div>

          {/* Description */}
          {release.description && (
            <p
              className={`font-body ${isAlbum ? 'text-base' : 'text-sm'} text-muted-foreground leading-relaxed max-w-md mx-auto mb-6`}
            >
              {release.description}
            </p>
          )}

          {/* Status pulse */}
          <div className="flex items-center justify-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            <span className="font-body text-xs text-primary/70 uppercase tracking-wider">
              {isAlbum ? 'In Production' : 'In the Studio'}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}