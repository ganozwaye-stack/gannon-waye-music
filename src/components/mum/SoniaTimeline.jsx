import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';

const TIMELINE = [
  {
    year: '1961',
    title: 'Born',
    story: 'Sonia Katisa entered the world — full of warmth, laughter and a spirit that would touch everyone she met.',
    icon: '🌸',
  },
  {
    year: '1980s',
    title: 'Met John',
    story: 'She found love. A partner, a family, a future. She gave everything to it.',
    icon: '🤍',
  },
  {
    year: '1987',
    title: 'First Child',
    story: 'Motherhood arrived and she embraced it completely. She was made for this.',
    icon: '👶',
  },
  {
    year: '1988',
    title: 'Gannon Born',
    story: '"He was always my golden boy." — Sonia, from family recollections.',
    icon: '🌟',
    quote: true,
  },
  {
    year: '1999',
    title: 'Crystal Born',
    story: 'Her family grew. More love, more laughter, more of Sonia at the centre of it all.',
    icon: '💎',
  },
  {
    year: '2009',
    title: 'Loss of Her Father',
    story: 'Grief touched her. But she carried her father\'s spirit forward with grace.',
    icon: '🕊️',
  },
  {
    year: 'The Years Between',
    title: 'Coffee, Animals & Sunshine',
    story: 'Long mornings in the backyard. Her dog beside her. A coffee in hand. This was her heaven on earth.',
    icon: '☕',
  },
  {
    year: '2024',
    title: 'Final Chapter',
    story: 'The hardest chapter. But she faced it the way she lived — with quiet strength and deep love.',
    icon: '🌿',
  },
  {
    year: '2025',
    title: 'Legacy',
    story: '"Without You Here" — written for her by Gannon. A song that carries her name forward forever.',
    icon: '🎵',
    quote: true,
  },
];

export default function SoniaTimeline() {
  const [expanded, setExpanded] = useState(null);

  return (
    <div className="py-20 px-4 md:px-8 max-w-2xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-14"
      >
        <p className="font-body text-[9px] tracking-[0.6em] uppercase mb-3" style={{ color: 'rgba(212,175,55,0.38)' }}>Her Journey</p>
        <h2 className="font-display text-3xl md:text-5xl text-foreground mb-3">A Life Worth Remembering</h2>
        <p className="font-body text-sm max-w-sm mx-auto" style={{ color: 'rgba(245,235,200,0.40)' }}>
          Every life is a story. This is Sonia's.
        </p>
      </motion.div>

      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-px" style={{
          background: 'linear-gradient(to bottom, transparent, rgba(212,175,55,0.25) 10%, rgba(212,175,55,0.15) 90%, transparent)',
          transform: 'translateX(-50%)',
        }} />

        <div className="space-y-8">
          {TIMELINE.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: i * 0.05 }}
              className={`relative flex items-start gap-5 md:gap-0 ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}
            >
              {/* Timeline dot */}
              <div className="relative z-10 flex-shrink-0 md:absolute md:left-1/2 md:transform md:-translate-x-1/2"
                style={{ marginLeft: i % 2 === 0 ? 0 : 0 }}>
                <motion.button
                  onClick={() => setExpanded(expanded === i ? null : i)}
                  whileHover={{ scale: 1.15 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-16 h-16 rounded-full flex items-center justify-center text-2xl border transition-all duration-300 cursor-pointer"
                  style={{
                    background: expanded === i
                      ? 'radial-gradient(ellipse, rgba(212,175,55,0.28) 0%, rgba(212,175,55,0.08) 100%)'
                      : 'rgba(5,10,5,0.85)',
                    borderColor: expanded === i ? 'rgba(212,175,55,0.60)' : 'rgba(212,175,55,0.18)',
                    boxShadow: expanded === i ? '0 0 30px rgba(212,175,55,0.25)' : 'none',
                  }}
                  aria-label={`${item.year} — ${item.title}`}
                >
                  {item.icon}
                </motion.button>
              </div>

              {/* Content card — alternating sides on desktop */}
              <div className={`flex-1 md:w-5/12 md:max-w-xs pl-4 md:pl-0 ${i % 2 === 0 ? 'md:pr-10 md:text-right' : 'md:pl-10 md:text-left md:ml-auto'}`}>
                <button
                  onClick={() => setExpanded(expanded === i ? null : i)}
                  className="w-full text-left md:text-inherit"
                >
                  <p className="font-body text-[10px] tracking-[0.3em] uppercase mb-0.5" style={{ color: 'rgba(212,175,55,0.45)' }}>
                    {item.year}
                  </p>
                  <p className="font-display text-lg text-foreground">{item.title}</p>
                </button>

                {expanded === i && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-2 overflow-hidden"
                  >
                    <p className={`font-body text-sm leading-relaxed ${item.quote ? 'italic' : ''}`}
                      style={{ color: item.quote ? 'rgba(245,208,110,0.65)' : 'rgba(245,235,200,0.50)' }}>
                      {item.story}
                    </p>
                  </motion.div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Closing */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="text-center mt-16"
      >
        <Heart className="w-5 h-5 mx-auto" fill="rgba(212,175,55,0.2)" style={{ color: 'rgba(212,175,55,0.3)' }} />
        <p className="font-display italic mt-3 text-xl" style={{ color: 'rgba(245,208,110,0.35)' }}>
          "As long as you remember me, my memory will live on."
        </p>
        <p className="font-body text-xs mt-2" style={{ color: 'rgba(212,175,55,0.25)' }}>— from the funeral service</p>
      </motion.div>
    </div>
  );
}