import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

// Neat lyrics overlay shown while a track plays in the docked player.
export default function LyricsOverlay({ open, onClose, title, lyrics }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-[60] flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-label={`Lyrics for ${title || 'the current song'}`}>
          <div aria-hidden className="absolute inset-0 bg-background/90 backdrop-blur-md" onClick={onClose} />

          <motion.div
            initial={{ y: 24, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 24, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="relative max-w-2xl w-full max-h-[80vh] overflow-y-auto rounded-2xl border border-primary/30 bg-card/95 p-6 md:p-10 shadow-2xl">
            <button
              type="button"
              onClick={onClose}
              aria-label="Close lyrics"
              className="absolute top-4 right-4 w-8 h-8 rounded-full border border-border/40 text-muted-foreground hover:text-primary hover:border-primary/40 transition-colors flex items-center justify-center">
              <X className="w-4 h-4" />
            </button>

            <p className="font-body text-[10px] tracking-[0.3em] uppercase gradient-gold-glow mb-3 pr-10">Lyrics</p>
            <h3 className="font-display text-2xl md:text-3xl gradient-gold-text mb-6 pr-10">{title || 'Untitled'}</h3>

            {lyrics ? (
              <div className="font-cormorant text-lg md:text-xl leading-relaxed text-foreground/85 whitespace-pre-line">
                {lyrics}
              </div>
            ) : (
              <p className="font-body text-sm text-muted-foreground">Lyrics for this song are on their way.</p>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}