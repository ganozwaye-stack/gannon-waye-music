import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mic2 } from 'lucide-react';
import { usePlayerStore } from '@/lib/playerStore';
import LyricsOverlay from '@/components/public/LyricsOverlay';

// Docked music player: renders the track started via the shared player store,
// with a lyrics overlay that fans can open while the song plays.
export default function GlobalPlayerDock() {
  const { track, title, artwork, lyrics, active, stop } = usePlayerStore();
  const [lyricsOpen, setLyricsOpen] = useState(false);

  return (
    <>
      <AnimatePresence>
        {active && track && (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 24 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-20 md:bottom-6 left-4 right-4 md:left-6 md:right-auto md:w-[380px] z-40">
            <div data-testid="global-player" className="rounded-2xl border border-primary/30 bg-card/95 backdrop-blur-md overflow-hidden shadow-2xl">
              <div className="flex items-center gap-3 px-3 py-2.5">
                {artwork && (
                  <img src={artwork} alt="" aria-hidden className="w-10 h-10 rounded-lg object-cover border border-border/40 shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-body text-xs text-foreground truncate">{title || 'Now playing'}</p>
                  <p className="font-body text-[9px] uppercase tracking-widest text-muted-foreground mt-0.5">Gannon Waye</p>
                </div>
                {lyrics && (
                  <button
                    type="button"
                    onClick={() => setLyricsOpen(true)}
                    aria-label={`Show lyrics for ${title || 'this song'}`}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-primary/40 text-primary hover:bg-primary/10 transition-colors font-body text-[9px] tracking-wider uppercase shrink-0">
                    <Mic2 className="w-3 h-3" /> Lyrics
                  </button>
                )}
                <button
                  type="button"
                  onClick={stop}
                  aria-label="Close player"
                  className="w-7 h-7 rounded-full border border-border/40 text-muted-foreground hover:text-primary hover:border-primary/40 transition-colors flex items-center justify-center shrink-0">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
              <iframe
                src={track}
                title={`${title || 'Gannon Waye'} player`}
                height="80"
                frameBorder="0"
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                loading="lazy"
                className="w-full" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <LyricsOverlay open={lyricsOpen} onClose={() => setLyricsOpen(false)} title={title} lyrics={lyrics} />
    </>
  );
}