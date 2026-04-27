import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Sparkles, ArrowRight, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import CountdownTimer from './CountdownTimer';

const ARTWORK_REVEAL_DATE = '2026-05-10T00:00:00';
const RELEASE_DATE = '2026-06-10T00:00:00';

// Ribbon / celebration decoration
function Ribbon() {
  return (
    <>
      {/* Top-left ribbon corner */}
      <div className="absolute top-0 left-0 w-32 h-32 overflow-hidden pointer-events-none z-20">
        <div
          className="absolute bg-primary text-primary-foreground font-body text-[9px] tracking-[0.2em] uppercase font-semibold text-center shadow-lg"
          style={{
            width: '140px',
            top: '22px',
            left: '-32px',
            transform: 'rotate(-45deg)',
            padding: '5px 0',
          }}
        >
          Coming Soon
        </div>
      </div>
      {/* Top-right ribbon corner */}
      <div className="absolute top-0 right-0 w-32 h-32 overflow-hidden pointer-events-none z-20">
        <div
          className="absolute bg-primary/80 text-primary-foreground font-body text-[9px] tracking-[0.2em] uppercase font-semibold text-center shadow-lg"
          style={{
            width: '140px',
            top: '22px',
            right: '-32px',
            transform: 'rotate(45deg)',
            padding: '5px 0',
          }}
        >
          Debut Single
        </div>
      </div>
      {/* Sparkle dots scattered */}
      {[
        { top: '8%', left: '12%', size: 'w-1.5 h-1.5', delay: 0 },
        { top: '15%', right: '10%', size: 'w-1 h-1', delay: 0.4 },
        { bottom: '12%', left: '8%', size: 'w-1 h-1', delay: 0.8 },
        { bottom: '18%', right: '14%', size: 'w-1.5 h-1.5', delay: 0.2 },
        { top: '40%', left: '4%', size: 'w-1 h-1', delay: 1.1 },
        { top: '55%', right: '5%', size: 'w-1 h-1', delay: 0.6 },
      ].map((dot, i) => (
        <motion.div
          key={i}
          className={`absolute ${dot.size} rounded-full bg-primary pointer-events-none z-10`}
          style={{ top: dot.top, left: dot.left, right: dot.right, bottom: dot.bottom }}
          animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.3, 0.8] }}
          transition={{ duration: 2, repeat: Infinity, delay: dot.delay, ease: 'easeInOut' }}
        />
      ))}
    </>
  );
}

export default function ThankYouHeroBanner() {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const artworkRevealed = now >= new Date(ARTWORK_REVEAL_DATE);
  const released = now >= new Date(RELEASE_DATE);

  return (
    <section className="relative w-full overflow-hidden bg-card border-b border-border/40">
      {/* Background glow pulse */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] rounded-full bg-primary/6 blur-3xl"
          animate={{ opacity: [0.4, 0.8, 0.4] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      <div className="max-w-6xl mx-auto px-4 md:px-8 py-10 md:py-14 relative">
        <div className="grid grid-cols-1 md:grid-cols-[auto_1fr] gap-8 md:gap-14 items-center">

          {/* Artwork box with ribbon */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7 }}
            className="relative w-52 h-52 md:w-64 md:h-64 mx-auto md:mx-0 flex-shrink-0"
          >
            {/* Glowing border ring */}
            <motion.div
              className="absolute -inset-1 rounded-2xl bg-gradient-to-br from-primary/60 via-primary/20 to-primary/60"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            />

            <div className="relative w-full h-full rounded-2xl overflow-hidden bg-secondary/80 border border-border/40">
              <Ribbon />

              {artworkRevealed ? (
                <div className="w-full h-full flex items-center justify-center">
                  <p className="font-body text-xs tracking-widest uppercase text-muted-foreground">Artwork Revealed</p>
                </div>
              ) : (
                <div className="relative w-full h-full">
                  <img src="https://media.base44.com/images/public/69eb7905ca6eb4180010f794/bd4d2cad9_generated_image.png" alt="Gift wrapped — revealed May 10" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/40">
                    <p className="font-display text-sm text-foreground italic text-center">Artwork Hidden</p>
                    <p className="font-body text-[10px] tracking-[0.2em] uppercase gradient-gold-text text-center">Revealed May 10</p>
                  </div>
                </div>
              )}
            </div>
          </motion.div>

          {/* Text content */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="text-center md:text-left"
          >
            <div className="flex items-center gap-2 justify-center md:justify-start mb-3">
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              <p className="font-body text-xs tracking-[0.3em] uppercase gradient-gold-text">Debut Single</p>
            </div>

            <h2 className="font-display text-4xl md:text-6xl text-foreground italic mb-2">Thank You</h2>
            <p className="font-body text-sm text-foreground/50 mb-6 max-w-md">
              A song born from grief, growth, and the quiet strength of becoming yourself.
            </p>

            {/* Countdown logic */}
            {released ? (
              <div className="space-y-4">
                <p className="font-body text-xs tracking-widest uppercase gradient-gold-text">Out Now</p>
                <Link to="/music">
                  <Button className="rounded-full gap-2 font-body text-sm tracking-wider uppercase px-7">
                    Listen Now <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
            ) : artworkRevealed ? (
              <div>
                <p className="font-body text-xs tracking-[0.2em] uppercase text-muted-foreground mb-4">Drops in</p>
                <CountdownTimer targetDate={RELEASE_DATE} />
              </div>
            ) : (
              <div>
                <p className="font-body text-xs tracking-[0.2em] uppercase text-muted-foreground mb-4">Artwork & Release Date Reveal</p>
                <CountdownTimer targetDate={ARTWORK_REVEAL_DATE} />
                <div className="flex items-center gap-2 mt-5 justify-center md:justify-start">
                  <Heart className="w-3.5 h-3.5 text-primary/60" />
                  <p className="font-body text-xs text-muted-foreground italic">
                    Artwork & release date reveal on May 10th
                  </p>
                </div>
              </div>
            )}

            {!released && (
              <div className="mt-6">
                <Link to="/community">
                  <Button variant="outline" className="rounded-full gap-2 font-body text-xs tracking-wider uppercase border-foreground/20">
                    Be First to Know <ArrowRight className="w-3 h-3" />
                  </Button>
                </Link>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}