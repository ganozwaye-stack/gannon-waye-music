import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const QUOTES = [
  { lines: ['For them, it was about appearance.', 'For me, I was breaking inside.'] },
  { lines: ['This is more than music.'] },
  { lines: ['This is what survival sounds like.'] },
  { lines: ['I spent most of my life trying to become someone else.'] },
  { lines: ['At 33, for the first time in my life\u2026', 'I became okay being me.'] },
  { lines: ['Some people survive trauma.', 'Some people become art because of it.'] },
  { lines: ['Even while dying\u2026', 'she was still protecting me.'] },
  { lines: ["You're not alone here."] },
  { lines: ["If you feel this\u2026", "you're already part of it."] },
  { lines: ['This is choosing yourself.'] },
  { lines: ["The truth didn't destroy me.", 'It set me free.'] },
  { lines: ['Music became the only place', 'my pain knew how to speak.'] },
  { lines: ['I survived things that were supposed to destroy me.'] },
  { lines: ['This is what rebuilding yourself sounds like.'] },
];

export default function HeroQuoteRotator() {
  const [index, setIndex] = useState(() => Math.floor(Math.random() * QUOTES.length));

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex(i => (i + 1) % QUOTES.length);
    }, 12000);
    return () => clearInterval(timer);
  }, []);

  const quote = QUOTES[index];

  return (
    <div className="min-h-[3.5rem] flex items-center justify-center">
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 1.2, ease: 'easeInOut' }}
          className="text-center"
        >
          {quote.lines.map((line, i) => (
            <p
              key={i}
              className="font-display text-base md:text-lg text-foreground/70 italic leading-relaxed"
            >
              {line}
            </p>
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}