import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, SkipBack, SkipForward, Volume2 } from 'lucide-react';

export default function LyricsScroller({ release }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const containerRef = useRef(null);

  const lyrics = release.lyrics?.split('\n') || [];

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const scrolled = container.scrollLeft;
      const max = container.scrollWidth - container.clientWidth;
      setScrollProgress(max > 0 ? scrolled / max : 0);
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="space-y-6">
      {/* Player Controls */}
      <div className="flex items-center gap-4 bg-secondary/30 rounded-2xl p-6 border border-border/30">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/90 transition-colors"
          >
            {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-1" />}
          </button>
          <div className="flex items-center gap-2 text-muted-foreground">
            <SkipBack className="w-4 h-4 cursor-pointer hover:text-foreground transition-colors" />
            <SkipForward className="w-4 h-4 cursor-pointer hover:text-foreground transition-colors" />
          </div>
        </div>

        <div className="flex-1">
          <div className="h-1 bg-secondary rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-primary"
              style={{ width: `${scrollProgress * 100}%` }}
            />
          </div>
        </div>

        <Volume2 className="w-4 h-4 text-muted-foreground" />
      </div>

      {/* Horizontal Scrolling Lyrics */}
      <div
        ref={containerRef}
        className="flex gap-8 overflow-x-auto snap-x snap-mandatory pb-4 scrollbar-hide"
      >
        {lyrics.map((line, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05 }}
            className="min-w-[80vw] md:min-w-[50vw] snap-center"
          >
            <div className="bg-gradient-to-br from-secondary/40 to-secondary/10 rounded-2xl p-8 h-full border border-border/30 backdrop-blur-sm">
              {line.trim() === '' ? (
                <div className="h-32" />
              ) : (
                <p className="font-display text-3xl md:text-4xl text-foreground leading-relaxed italic">
                  {line}
                </p>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Info */}
      <p className="font-body text-xs text-muted-foreground text-center">
        Scroll horizontally to read the full lyrics
      </p>
    </div>
  );
}