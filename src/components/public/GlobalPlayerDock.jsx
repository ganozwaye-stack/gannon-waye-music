import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mic2, ListMusic, SkipBack, SkipForward, Play, Trash2 } from 'lucide-react';
import { usePlayerStore } from '@/lib/playerStore';
import SpotifyEmbed from '@/components/public/SpotifyEmbed';

const toolButton = (isOn) => (
  `flex items-center gap-1.5 px-3 py-1.5 rounded-full border transition-colors font-body text-[9px] tracking-wider uppercase shrink-0 ${
    isOn ? 'border-primary bg-primary/15 text-primary' : 'border-primary/40 text-primary hover:bg-primary/10'
  }`
);

// Docked music player: plays the shared queue in order, moving to the next
// song when one finishes, with the current lyrics shown inside the player.
export default function GlobalPlayerDock() {
  const { queue, index, track, title, artwork, lyrics, active, stop, next, prev, playAt, removeAt } = usePlayerStore();
  const [lyricsOpen, setLyricsOpen] = useState(true);
  const [queueOpen, setQueueOpen] = useState(false);

  const hasPrev = index > 0;
  const hasNext = index + 1 < queue.length;

  return (
    <AnimatePresence>
      {active && track && (
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 24 }}
          transition={{ duration: 0.3 }}
          className="fixed bottom-20 md:bottom-16 left-4 right-4 md:left-6 md:right-auto md:w-[420px] z-40">
          <div data-testid="global-player" className="rounded-2xl border border-primary/30 bg-card/95 backdrop-blur-md overflow-hidden shadow-2xl">
            {/* Now playing */}
            <div className="flex items-center gap-3 px-3 py-2.5">
              {artwork && (
                <img src={artwork} alt="" aria-hidden className="w-10 h-10 rounded-lg object-cover border border-border/40 shrink-0" />
              )}
              <div className="flex-1 min-w-0">
                <p className="font-body text-xs text-foreground truncate">{title || 'Now playing'}</p>
                <p className="font-body text-[9px] uppercase tracking-widest text-muted-foreground mt-0.5">
                  Gannon Waye · Track {index + 1} of {queue.length}
                </p>
              </div>
              <button
                type="button"
                onClick={stop}
                aria-label="Close player"
                className="w-7 h-7 rounded-full border border-border/40 text-muted-foreground hover:text-primary hover:border-primary/40 transition-colors flex items-center justify-center shrink-0">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-2 px-3 pb-2.5">
              <button
                type="button"
                onClick={prev}
                disabled={!hasPrev}
                aria-label="Previous track"
                className="w-8 h-8 rounded-full border border-primary/40 text-primary hover:bg-primary/10 disabled:opacity-30 disabled:hover:bg-transparent transition-colors flex items-center justify-center">
                <SkipBack className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={next}
                disabled={!hasNext}
                aria-label="Next track"
                className="w-8 h-8 rounded-full border border-primary/40 text-primary hover:bg-primary/10 disabled:opacity-30 disabled:hover:bg-transparent transition-colors flex items-center justify-center">
                <SkipForward className="w-3.5 h-3.5" />
              </button>
              <div className="flex-1" />
              {lyrics && (
                <button
                  type="button"
                  onClick={() => setLyricsOpen((open) => !open)}
                  aria-pressed={lyricsOpen}
                  aria-label={`${lyricsOpen ? 'Hide' : 'Show'} lyrics for ${title || 'this song'}`}
                  className={toolButton(lyricsOpen)}>
                  <Mic2 className="w-3 h-3" /> Lyrics
                </button>
              )}
              <button
                type="button"
                onClick={() => setQueueOpen((open) => !open)}
                aria-pressed={queueOpen}
                aria-label={`${queueOpen ? 'Hide' : 'Show'} queue`}
                className={toolButton(queueOpen)}>
                <ListMusic className="w-3 h-3" /> Queue ({queue.length})
              </button>
            </div>

            {/* Lyrics for the song currently playing */}
            {lyrics && lyricsOpen && (
              <div data-testid="player-lyrics" className="border-t border-border/40 px-4 py-3 max-h-44 overflow-y-auto">
                <p className="font-body text-[9px] tracking-[0.3em] uppercase text-muted-foreground mb-2">Lyrics</p>
                <p className="font-body text-xs text-foreground/85 leading-relaxed whitespace-pre-line">{lyrics}</p>
              </div>
            )}

            {/* Queue */}
            {queueOpen && (
              <ul data-testid="player-queue" className="border-t border-border/40 max-h-44 overflow-y-auto">
                {queue.map((item, i) => (
                  <li
                    key={item.track}
                    className={`flex items-center gap-2 px-3 py-2 ${i === index ? 'bg-primary/10' : 'hover:bg-primary/5'}`}>
                    <button
                      type="button"
                      onClick={() => playAt(i)}
                      className="flex items-center gap-2 flex-1 min-w-0 text-left">
                      {item.artwork ? (
                        <img src={item.artwork} alt="" aria-hidden className="w-7 h-7 rounded object-cover border border-border/40 shrink-0" />
                      ) : (
                        <span className="w-7 h-7 rounded border border-border/40 flex items-center justify-center shrink-0">
                          <Play className="w-3 h-3 text-muted-foreground" />
                        </span>
                      )}
                      <span className={`font-body text-xs truncate ${i === index ? 'text-primary' : 'text-foreground/85'}`}>
                        {item.title || 'Untitled'}
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() => removeAt(i)}
                      aria-label={`Remove ${item.title || 'track'} from queue`}
                      className="w-6 h-6 rounded-full text-muted-foreground hover:text-primary transition-colors flex items-center justify-center shrink-0">
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </li>
                ))}
              </ul>
            )}

            <SpotifyEmbed src={track} title={`${title || 'Gannon Waye'} player`} onEnded={next} />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
