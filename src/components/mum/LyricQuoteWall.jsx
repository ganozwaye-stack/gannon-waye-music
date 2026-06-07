import React, { useState } from 'react';
import { motion } from 'framer-motion';

// "Without You Here" — hooks, signatures, and key lyrical moments
// These will be updated once Gannon provides the full lyrics
const LYRIC_QUOTES = [
  {
    id: 1,
    text: "Without you here, the world keeps turning\nbut nothing feels the same",
    type: 'hook',
    size: 'large',
  },
  {
    id: 2,
    text: "I still reach for the phone to call you\nthen remember you're gone",
    type: 'verse',
    size: 'medium',
  },
  {
    id: 3,
    text: "You were the arms that caught me falling\nthe voice that called me home",
    type: 'verse',
    size: 'medium',
  },
  {
    id: 4,
    text: "Without you here",
    type: 'signature',
    size: 'signature',
  },
  {
    id: 5,
    text: "The silence speaks the loudest\nin the places where you were",
    type: 'verse',
    size: 'medium',
  },
  {
    id: 6,
    text: "I carry you in every song\nin every breath, in every word",
    type: 'bridge',
    size: 'large',
  },
  {
    id: 7,
    text: "Mum",
    type: 'signature',
    size: 'signature',
  },
  {
    id: 8,
    text: "You showed me how to love\nbefore I knew what love could be",
    type: 'verse',
    size: 'medium',
  },
];

const sizeStyles = {
  large: {
    fontSize: 'clamp(1.1rem, 2.8vw, 1.6rem)',
    padding: '2rem 2.5rem',
    gridColumn: 'span 2',
  },
  medium: {
    fontSize: 'clamp(0.85rem, 2vw, 1.1rem)',
    padding: '1.5rem 1.8rem',
    gridColumn: 'span 1',
  },
  signature: {
    fontSize: 'clamp(2rem, 6vw, 4rem)',
    padding: '1.5rem 2rem',
    gridColumn: 'span 1',
    fontStyle: 'italic',
  },
};

const typeAccent = {
  hook:      'rgba(212,175,55,0.30)',
  verse:     'rgba(212,175,55,0.14)',
  bridge:    'rgba(212,175,55,0.22)',
  signature: 'rgba(212,175,55,0.40)',
};

export default function LyricQuoteWall() {
  const [hovered, setHovered] = useState(null);

  return (
    <div className="max-w-5xl mx-auto px-4 md:px-8">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
        className="text-center mb-12"
      >
        <p className="font-body text-[9px] tracking-[0.6em] uppercase mb-3" style={{ color: 'rgba(212,175,55,0.32)' }}>
          Without You Here · Gannon Waye
        </p>
        <h2 className="font-display text-3xl md:text-5xl text-foreground/85 mb-3">
          Words Written for Her
        </h2>
        <p className="font-body text-xs max-w-sm mx-auto" style={{ color: 'rgba(245,235,200,0.38)' }}>
          Every line of this song carries her memory. These are the moments that cannot be unsaid.
        </p>
      </motion.div>

      {/* Quote wall grid */}
      <div
        className="grid gap-4"
        style={{
          gridTemplateColumns: 'repeat(2, 1fr)',
        }}
      >
        {LYRIC_QUOTES.map((quote, i) => {
          const style = sizeStyles[quote.size];
          const accent = typeAccent[quote.type];
          const isHovered = hovered === quote.id;

          return (
            <motion.div
              key={quote.id}
              initial={{ opacity: 0, y: 20, scale: 0.97 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: i * 0.08 }}
              onMouseEnter={() => setHovered(quote.id)}
              onMouseLeave={() => setHovered(null)}
              style={{
                gridColumn: style.gridColumn,
                padding: style.padding,
                background: isHovered
                  ? 'rgba(14,20,14,0.72)'
                  : 'rgba(8,12,7,0.50)',
                border: `1px solid ${isHovered ? accent.replace(')', ',1)').replace('rgba', 'rgba') : accent}`,
                borderLeft: `3px solid ${accent}`,
                backdropFilter: 'blur(12px)',
                borderRadius: '1rem',
                cursor: 'default',
                transition: 'all 0.4s ease',
                boxShadow: isHovered
                  ? `0 0 30px ${accent.replace('0.', '0.12')}, 0 12px 40px rgba(0,0,0,0.3)`
                  : '0 4px 20px rgba(0,0,0,0.2)',
              }}
            >
              {/* Quote type label */}
              <p
                className="font-body uppercase mb-3"
                style={{
                  fontSize: '0.55rem',
                  letterSpacing: '0.4em',
                  color: 'rgba(212,175,55,0.28)',
                }}
              >
                {quote.type === 'hook' ? '✦ Hook' : quote.type === 'signature' ? '♥ Signature' : quote.type === 'bridge' ? '◈ Bridge' : '· Verse'}
              </p>

              {/* The lyric */}
              <p
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontStyle: quote.type === 'signature' ? 'italic' : 'normal',
                  fontSize: style.fontSize,
                  lineHeight: 1.4,
                  color: quote.type === 'signature'
                    ? 'rgba(245,208,110,0.70)'
                    : 'rgba(245,235,210,0.72)',
                  whiteSpace: 'pre-line',
                }}
              >
                {quote.type !== 'signature' && (
                  <span style={{ color: 'rgba(212,175,55,0.30)', fontSize: '1.4em', lineHeight: 0, verticalAlign: 'middle', marginRight: '0.2em' }}>"</span>
                )}
                {quote.text}
                {quote.type !== 'signature' && (
                  <span style={{ color: 'rgba(212,175,55,0.30)', fontSize: '1.4em', lineHeight: 0, verticalAlign: 'middle', marginLeft: '0.2em' }}>"</span>
                )}
              </p>
            </motion.div>
          );
        })}
      </div>

      {/* Note about lyrics */}
      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1, delay: 0.5 }}
        className="text-center mt-10 font-body text-[9px] tracking-[0.3em] uppercase italic"
        style={{ color: 'rgba(212,175,55,0.20)' }}
      >
        Without You Here · © Gannon Waye · All rights reserved
      </motion.p>
    </div>
  );
}