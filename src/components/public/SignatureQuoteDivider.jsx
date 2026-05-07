import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const QUOTES = [
  'I confused survival with love.',
  'At 33, I finally became okay being me.',
  'Music became the place my pain finally had somewhere to go.',
  "The truth didn't destroy me. It set me free.",
  "Healing didn't happen all at once. It happened every time I chose not to disappear.",
  'You can survive what was never meant to define you.',
  "I know what it feels like to think you're the problem.",
  'This is what survival sounds like.',
  'I spent most of my life wishing I was someone else.',
  'Even while leaving\u2026 she was still loving me.',
];

export default function SignatureQuoteDivider({ quoteIndex }) {
  const [quote, setQuote] = useState('');

  useEffect(() => {
    if (quoteIndex !== undefined) {
      setQuote(QUOTES[quoteIndex % QUOTES.length]);
    } else {
      setQuote(QUOTES[Math.floor(Math.random() * QUOTES.length)]);
    }
  }, [quoteIndex]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 1 }}
      className="py-12 px-6 flex flex-col items-center gap-4"
    >
      <div className="flex items-center gap-4 w-full max-w-2xl">
        <div className="flex-1 h-px bg-gradient-to-r from-transparent to-primary/30" />
        <span className="w-1.5 h-1.5 rounded-full bg-primary/40" />
        <div className="flex-1 h-px bg-gradient-to-l from-transparent to-primary/30" />
      </div>
      <p className="font-display text-lg md:text-xl gradient-gold-glow italic text-center max-w-xl leading-relaxed">
        &ldquo;{quote}&rdquo;
      </p>
      <p className="font-body text-[10px] tracking-[0.3em] uppercase text-muted-foreground/50">Gannon Waye</p>
      <div className="flex items-center gap-4 w-full max-w-2xl">
        <div className="flex-1 h-px bg-gradient-to-r from-transparent to-primary/30" />
        <span className="w-1.5 h-1.5 rounded-full bg-primary/40" />
        <div className="flex-1 h-px bg-gradient-to-l from-transparent to-primary/30" />
      </div>
    </motion.div>
  );
}