import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gift, Lock } from 'lucide-react';

// "Without You Here" — approved hooks & signature lines only (full lyrics hidden until release)
const LYRIC_HOOKS = [
  {
    id: 1,
    text: "I don't wanna live this life without you here\nI never thought the world could feel this wrong",
    type: 'hook',
    size: 'large',
    label: '✦ Chorus Hook',
  },
  {
    id: 2,
    text: "Cause you were the voice\nthat made my troubles disappear",
    type: 'verse',
    size: 'medium',
    label: '· Verse',
  },
  {
    id: 3,
    text: "Without You Here",
    type: 'signature',
    size: 'signature',
    label: '♥ Signature',
  },
  {
    id: 4,
    text: "And now there's silence\nwhere your wisdom used to be",
    type: 'verse',
    size: 'medium',
    label: '· Verse',
  },
  {
    id: 5,
    text: "You were my best friend\nHow am I supposed to do this without you here?",
    type: 'bridge',
    size: 'large',
    label: '◈ Bridge',
  },
  {
    id: 6,
    text: "Even while leaving,\nyou were still loving me.",
    type: 'bridge',
    size: 'medium',
    label: '◈ Bridge',
  },
  {
    id: 7,
    text: "Mum",
    type: 'signature',
    size: 'signature',
    label: '♥ Signature',
  },
  {
    id: 8,
    text: "Boy… you're not finished yet",
    type: 'hook',
    size: 'large',
    label: '✦ Outro Hook',
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
  const [giftOpen, setGiftOpen] = useState(false);

  return (
    <div className="max-w-5xl mx-auto px-4 md:px-8">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
        className="text-center mb-10"
      >
        <p className="font-body text-[9px] tracking-[0.6em] uppercase mb-3" style={{ color: 'rgba(212,175,55,0.32)' }}>
          Without You Here · Gannon Waye
        </p>
        <h2 className="font-display text-3xl md:text-5xl text-foreground/85 mb-3">
          Words Written for Her
        </h2>
        <p className="font-body text-xs max-w-sm mx-auto" style={{ color: 'rgba(245,235,200,0.38)' }}>
          The moments that cannot be unsaid — straight from the song.
        </p>
      </motion.div>

      {/* Quote wall grid */}
      <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(2, 1fr)' }}>
        {LYRIC_HOOKS.map((quote, i) => {
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
                background: isHovered ? 'rgba(14,20,14,0.72)' : 'rgba(8,12,7,0.50)',
                border: `1px solid ${isHovered ? accent : accent}`,
                borderLeft: `3px solid ${accent}`,
                backdropFilter: 'blur(12px)',
                borderRadius: '1rem',
                cursor: 'default',
                transition: 'all 0.4s ease',
                boxShadow: isHovered
                  ? `0 0 30px rgba(212,175,55,0.12), 0 12px 40px rgba(0,0,0,0.3)`
                  : '0 4px 20px rgba(0,0,0,0.2)',
              }}
            >
              <p className="font-body uppercase mb-3" style={{ fontSize: '0.55rem', letterSpacing: '0.4em', color: 'rgba(212,175,55,0.28)' }}>
                {quote.label}
              </p>
              <p
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontStyle: quote.type === 'signature' ? 'italic' : 'normal',
                  fontSize: style.fontSize,
                  lineHeight: 1.4,
                  color: quote.type === 'signature' ? 'rgba(245,208,110,0.70)' : 'rgba(245,235,210,0.72)',
                  whiteSpace: 'pre-line',
                }}
              >
                {quote.type !== 'signature' && <span style={{ color: 'rgba(212,175,55,0.30)', fontSize: '1.4em', lineHeight: 0, verticalAlign: 'middle', marginRight: '0.2em' }}>"</span>}
                {quote.text}
                {quote.type !== 'signature' && <span style={{ color: 'rgba(212,175,55,0.30)', fontSize: '1.4em', lineHeight: 0, verticalAlign: 'middle', marginLeft: '0.2em' }}>"</span>}
              </p>
            </motion.div>
          );
        })}
      </div>

      {/* Gift-wrapped full lyrics — hidden until release */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1, delay: 0.4 }}
        className="mt-14 flex flex-col items-center"
      >
        <AnimatePresence mode="wait">
          {!giftOpen ? (
            <motion.div
              key="gift"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 1.1, opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <p className="font-body text-[9px] tracking-[0.4em] uppercase mb-4" style={{ color: 'rgba(212,175,55,0.30)' }}>
                Full lyrics · Coming with the release
              </p>
              <motion.button
                onClick={() => setGiftOpen(true)}
                whileHover={{ scale: 1.06 }}
                whileTap={{ scale: 0.96 }}
                className="relative flex flex-col items-center gap-3 group"
              >
                {/* Gift box visual */}
                <div className="relative" style={{ width: 100, height: 110 }}>
                  {/* Bow */}
                  <motion.div
                    animate={{ rotate: [0, 5, -5, 0] }}
                    transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                    className="absolute left-1/2 -translate-x-1/2 -top-5"
                  >
                    <div style={{ fontSize: '2.8rem' }}>🎁</div>
                  </motion.div>
                  {/* Glow */}
                  <motion.div
                    className="absolute inset-0 rounded-full pointer-events-none"
                    animate={{ opacity: [0.2, 0.5, 0.2] }}
                    transition={{ duration: 2.5, repeat: Infinity }}
                    style={{ background: 'radial-gradient(circle, rgba(212,175,55,0.25) 0%, transparent 70%)', filter: 'blur(12px)' }}
                  />
                </div>
                <div className="mt-2">
                  <p className="font-display italic text-lg" style={{ color: 'rgba(245,208,110,0.65)' }}>Unwrap the full song</p>
                  <p className="font-body text-[9px] tracking-[0.3em] uppercase mt-1" style={{ color: 'rgba(212,175,55,0.28)' }}>
                    <Lock className="inline w-3 h-3 mr-1" style={{ verticalAlign: 'middle' }} />
                    Releasing soon — a gift from Gannon, for Sonia
                  </p>
                </div>
              </motion.button>
            </motion.div>
          ) : (
            <motion.div
              key="opened"
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="w-full max-w-2xl"
            >
              <div
                className="rounded-2xl p-8"
                style={{ background: 'rgba(8,14,8,0.75)', border: '1px solid rgba(212,175,55,0.18)', backdropFilter: 'blur(24px)' }}
              >
                <div className="text-center mb-6">
                  <span style={{ fontSize: '2rem' }}>🎁</span>
                  <p className="font-display italic text-xl mt-2" style={{ color: 'rgba(245,208,110,0.65)' }}>Without You Here</p>
                  <p className="font-body text-[9px] tracking-[0.4em] uppercase mt-1" style={{ color: 'rgba(212,175,55,0.28)' }}>Full lyrics · Preview · © Gannon Waye 2026</p>
                </div>
                <pre className="font-display text-sm italic leading-loose whitespace-pre-wrap" style={{ color: 'rgba(245,235,210,0.62)' }}>
{`I don't wanna live this life without you here
I never thought the world could feel this wrong
Cause you were the voice
that made my troubles disappear
And now there's silence
where your wisdom used to be

You were my best friend
How am I supposed to do this without you here?

Even while leaving, you were still loving me.
Your last breath took mine away.
There's not much more I have to say.

I don't wanna live this life without my mama
But somehow I know I have to
Cause every part of me that survives this,
will survive because of you.

"Boy… you're not finished yet"`}
                </pre>
                <p className="text-center font-body text-[9px] tracking-[0.4em] uppercase mt-6" style={{ color: 'rgba(212,175,55,0.20)' }}>
                  Full lyrics available on release · © Gannon Waye · All rights reserved
                </p>
              </div>
              <button
                onClick={() => setGiftOpen(false)}
                className="mt-4 mx-auto block font-body text-[9px] tracking-[0.3em] uppercase"
                style={{ color: 'rgba(212,175,55,0.28)' }}
              >
                Close ✕
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1, delay: 0.5 }}
        className="text-center mt-10 font-body text-[9px] tracking-[0.3em] uppercase italic"
        style={{ color: 'rgba(212,175,55,0.18)' }}
      >
        Without You Here · © Gannon Waye · All rights reserved
      </motion.p>
    </div>
  );
}