import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Play, Square } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { usePlayerStore } from '@/lib/playerStore';

// Floating bottom-right music unit. The green button is the master controller:
// it plays/stops the current track. Any play button on the site feeds this unit
// via the player store, so music is seamless across pages (it persists outside
// Routes) and never redirects to Spotify. The "Support Now" CTA sits beneath it.
const WYH_TRACK_URL = 'https://open.spotify.com/track/6lX5V0j0bQiLOzldueTmnz';
const MEMORIAL_PATHS = ['/mum', '/without-you-here'];
const HEART_IMG = 'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/adcdec40c_GWheartlacewrap.png';

export default function StickySupportBar() {
  const location = useLocation();
  const isMemorialPage = MEMORIAL_PATHS.includes(location.pathname);
  const isStorePage = location.pathname.startsWith('/store');

  const track = usePlayerStore((s) => s.track);
  const title = usePlayerStore((s) => s.title);
  const active = usePlayerStore((s) => s.active);
  const playTrack = usePlayerStore((s) => s.playTrack);
  const stop = usePlayerStore((s) => s.stop);

  if (isMemorialPage || isStorePage) return null;

  const toggle = () => {
    if (active) stop();
    else playTrack(WYH_TRACK_URL, { title: 'Without You Here' });
  };

  return (
    <>
      {/* Player, bottom-left, on its own */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="fixed bottom-4 left-4 z-50 w-[min(86vw,300px)]"
      >
      {/* Player card */}
      <div className="w-full rounded-2xl bg-card/85 backdrop-blur-md border border-border/50 px-3 py-2.5 shadow-[0_-2px_24px_rgba(0,0,0,0.35)]">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={toggle}
            aria-label={active ? `Stop ${title}` : 'Play Without You Here'}
            className="flex items-center gap-2 flex-shrink-0"
          >
            <span className="w-8 h-8 rounded-full bg-[#1DB954] flex items-center justify-center">
              {active ? <Square className="w-3.5 h-3.5 text-black" /> : <Play className="w-3.5 h-3.5 text-black" />}
            </span>
          </button>

          <div className="flex-1 min-w-0">
            <AnimatePresence mode="wait">
              {active && track ? (
                <motion.div
                  key="player"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="w-full"
                >
                  <iframe
                    title="Spotify player"
                    src={`${track}?theme=0`}
                    width="100%"
                    height="56"
                    frameBorder="0"
                    allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                    loading="lazy"
                    className="rounded-lg"
                  />
                </motion.div>
              ) : (
                <motion.div
                  key="idle"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-2"
                >
                  <img src={HEART_IMG} alt="GW Heart" className="w-5 h-5 object-contain flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="font-body text-[10px] tracking-widest uppercase text-muted-foreground truncate select-none">
                      Without You Here · Spotify
                    </p>
                    <p className="font-body text-[10px] text-muted-foreground truncate">10% of all support → 1800RESPECT</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      </motion.div>

      {/* Support Now, bottom-right, on its own */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="fixed bottom-4 right-4 z-50"
      >
        <Link to="/back-this">
          <Button size="sm" className="rounded-full gradient-gold-button border-0 font-body text-xs tracking-wider uppercase whitespace-nowrap px-5">
            Support Now
          </Button>
        </Link>
      </motion.div>
    </>
  );
}