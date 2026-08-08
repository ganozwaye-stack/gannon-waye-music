import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play } from 'lucide-react';
import { usePlayerStore } from '@/lib/playerStore';

// Revolving hook-line lyrics from "Without You Here", the emotional anchors of the song.
const HOOK_LINES = [
  "I don't wanna live this life without you here",
  "You were the voice that made my troubles disappear",
  "Your last breath took mine away",
  "There's not much more I have to say",
  "Even while leaving, you were still loving me",
  "Boy, you're not finished yet",
];

// Hero cover widget: clicking the art plays the single in the site-wide player (no redirect),
// with revolving hook lines beneath.
export default function HeroSongPlayer({ artwork, spotifyLink }) {
  const playTrack = usePlayerStore((s) => s.playTrack);
  const [idx, setIdx] = useState(0);
  const next = useCallback(() => setIdx((i) => (i + 1) % HOOK_LINES.length), []);
  useEffect(() => {
    const t = setInterval(next, 6000);
    return () => clearInterval(t);
  }, [next]);

  return (
    <div className="w-full max-w-[18rem] flex flex-col items-center gap-4">
      {/* Clickable cover art, plays in the site-wide player (no redirect) */}
      <button
        type="button"
        onClick={() => playTrack(spotifyLink, { title: 'Without You Here', artwork })}
        className="group relative block w-44 h-44 md:w-48 md:h-48 rounded-2xl overflow-hidden border border-primary/30"
        style={{ boxShadow: '0 0 60px rgba(212,175,55,0.25), 0 20px 50px rgba(0,0,0,0.6)' }}
        aria-label="Listen to Without You Here"
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
      </button>

      {/* Revolving hook lyrics */}
      <div className="text-center min-h-[3.5rem] px-2">
        <AnimatePresence mode="wait">
          <motion.p
            key={idx}
            initial={{ opacity: 0, y: 10, filter: 'blur(6px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -10, filter: 'blur(6px)' }}
            transition={{ duration: 1 }}
            className="font-display italic text-base gradient-gold-glow leading-snug"
          >
            &ldquo;{HOOK_LINES[idx]}&rdquo;
          </motion.p>
        </AnimatePresence>
        <p className="font-body text-[9px] tracking-[0.3em] uppercase text-foreground/40 mt-2">
          Hook lines &middot; Without You Here
        </p>
      </div>
    </div>
  );
}