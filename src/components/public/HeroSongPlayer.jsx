import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play } from 'lucide-react';

// Revolving hook-line lyrics from "Without You Here" — the emotional anchors of the song.
const HOOK_LINES = [
  "I don't wanna live this life without you here",
  "You were the voice that made my troubles disappear",
  "Your last breath took mine away",
  "Even while leaving, you were still loving me",
  "Boy, you're not finished yet",
];

// Right-column hero widget: clickable cover art that opens the single, plus revolving hook lyrics.
export default function HeroSongPlayer({ artwork, spotifyLink }) {
  const [idx, setIdx] = useState(0);
  const next = useCallback(() => setIdx((i) => (i + 1) % HOOK_LINES.length), []);
  useEffect(() => {
    const t = setInterval(next, 4200);
    return () => clearInterval(t);
  }, [next]);

  return (
    <div className="w-full max-w-xs flex flex-col items-center gap-6">
      {/* Clickable cover art */}
      <a
        href={spotifyLink}
        target="_blank"
        rel="noopener noreferrer"
        className="group relative block w-56 h-56 md:w-64 md:h-64 rounded-2xl overflow-hidden border border-primary/30"
        style={{ boxShadow: '0 0 60px rgba(212,175,55,0.25), 0 20px 50px rgba(0,0,0,0.6)' }}
        aria-label="Listen to Without You Here on Spotify"
      >
        <img
          src={artwork}
          alt="Without You Here cover art"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <span className="flex items-center gap-2 px-5 py-2.5 rounded-full gradient-gold-button border-0 text-primary-foreground text-xs tracking-wider uppercase font-body">
            <Play className="w-3 h-3" /> Listen Here
          </span>
        </div>
      </a>

      {/* Revolving hook lyrics */}
      <div className="text-center min-h-[4rem] px-2">
        <AnimatePresence mode="wait">
          <motion.p
            key={idx}
            initial={{ opacity: 0, y: 10, filter: 'blur(6px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -10, filter: 'blur(6px)' }}
            transition={{ duration: 0.6 }}
            className="font-display italic text-lg gradient-gold-glow leading-snug"
          >
            &ldquo;{HOOK_LINES[idx]}&rdquo;
          </motion.p>
        </AnimatePresence>
        <p className="font-body text-[9px] tracking-[0.3em] uppercase text-foreground/40 mt-3">
          Hook lines &middot; Without You Here
        </p>
      </div>
    </div>
  );
}