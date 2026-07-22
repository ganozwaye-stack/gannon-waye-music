import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Coffee, Heart, Leaf, Music, Sparkles, Star } from 'lucide-react';

const TIMELINE = [
  {
    year: '1961',
    title: 'Born',
    story: 'Sonia Katisa entered the world full of warmth, laughter, and a spirit that would touch everyone she met.',
    Icon: Sparkles,
  },
  {
    year: '1980s',
    title: 'Met John',
    story: 'She found love. A partner, a family, a future. She gave everything to it.',
    Icon: Heart,
  },
  {
    year: '1987',
    title: 'First Child',
    story: 'Motherhood arrived and she embraced it completely. She was made for this.',
    Icon: Heart,
  },
  {
    year: '1988',
    title: 'Gannon Born',
    story: '"He was always my golden boy." - Sonia, from family recollections.',
    Icon: Star,
    quote: true,
  },
  {
    year: '1999',
    title: 'Crystal Born',
    story: 'Her family grew. More love, more laughter, more of Sonia at the centre of it all.',
    Icon: Heart,
  },
  {
    year: '2009',
    title: 'Loss of Her Father',
    story: "Grief touched her. But she carried her father's spirit forward with grace.",
    Icon: Sparkles,
  },
  {
    year: 'The Years Between',
    title: 'Coffee, Animals & Sunshine',
    story: 'Long mornings in the backyard. Her dog beside her. A coffee in hand. This was her heaven on earth.',
    Icon: Coffee,
  },
  {
    year: '2022',
    title: 'Final Chapter',
    story: 'The hardest chapter. But she faced it the way she lived - with quiet strength and deep love.',
    Icon: Leaf,
  },
  {
    year: '2026',
    title: 'Legacy',
    story: '"Without You Here" - written for her by Gannon. A song that carries her name forward forever.',
    Icon: Music,
    quote: true,
  },
];

export default function SoniaTimeline() {
  const [expanded, setExpanded] = useState(null);

  return (
    <div className="mx-auto max-w-2xl px-4 py-20 md:px-8">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-14 text-center"
      >
        <p className="font-body mb-3 text-[9px] uppercase text-primary/38" style={{ letterSpacing: '0.6em' }}>
          Her Journey
        </p>
        <h2 className="font-display mb-3 text-3xl text-foreground md:text-5xl">
          A Life Worth Remembering
        </h2>
        <p className="mx-auto max-w-sm font-body text-sm text-foreground/40">
          Every life is a story. This is Sonia's.
        </p>
      </motion.div>

      <div className="relative">
        <div
          className="absolute bottom-0 left-8 top-0 w-px md:left-1/2"
          style={{
            background: 'linear-gradient(to bottom, transparent, rgba(212,175,55,0.25) 10%, rgba(212,175,55,0.15) 90%, transparent)',
            transform: 'translateX(-50%)',
          }}
        />

        <div className="space-y-8">
          {TIMELINE.map((item, i) => {
            const Icon = item.Icon;
            return (
              <motion.div
                key={`${item.year}-${item.title}`}
                initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: i * 0.05 }}
                className={`relative flex items-start gap-5 md:gap-0 ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}
              >
                <div className="relative z-10 flex-shrink-0 md:absolute md:left-1/2 md:-translate-x-1/2">
                  <motion.button
                    onClick={() => setExpanded(expanded === i ? null : i)}
                    whileHover={{ scale: 1.12 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex h-16 w-16 cursor-pointer items-center justify-center rounded-full border transition-all duration-300"
                    style={{
                      background: expanded === i
                        ? 'radial-gradient(ellipse, rgba(212,175,55,0.28) 0%, rgba(212,175,55,0.08) 100%)'
                        : 'rgba(5,10,5,0.85)',
                      borderColor: expanded === i ? 'rgba(212,175,55,0.60)' : 'rgba(212,175,55,0.18)',
                      boxShadow: expanded === i ? '0 0 30px rgba(212,175,55,0.25)' : 'none',
                    }}
                    aria-label={`${item.year} - ${item.title}`}
                  >
                    <Icon className="h-5 w-5 text-primary/68" />
                  </motion.button>
                </div>

                <div className={`flex-1 pl-4 md:w-5/12 md:max-w-xs md:pl-0 ${i % 2 === 0 ? 'md:pr-10 md:text-right' : 'md:ml-auto md:pl-10 md:text-left'}`}>
                  <button
                    onClick={() => setExpanded(expanded === i ? null : i)}
                    className="w-full text-left md:text-inherit"
                  >
                    <p className="font-body mb-0.5 text-[10px] uppercase text-primary/45" style={{ letterSpacing: '0.3em' }}>
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
                      <p
                        className={`font-body text-sm leading-relaxed ${item.quote ? 'italic' : ''}`}
                        style={{ color: item.quote ? 'rgba(216,192,113,0.65)' : 'rgba(245,235,200,0.50)' }}
                      >
                        {item.story}
                      </p>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="mt-16 text-center"
      >
        <Heart className="mx-auto h-5 w-5 text-primary/30" fill="rgba(212,175,55,0.2)" />
        <p className="font-display mt-3 text-xl italic text-primary/35">
          "As long as you remember me, my memory will live on."
        </p>
        <p className="mt-2 font-body text-xs text-primary/25">from the funeral service</p>
      </motion.div>
    </div>
  );
}
