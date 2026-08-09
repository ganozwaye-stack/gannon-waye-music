import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Play, Square } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { usePlayerStore } from '@/lib/playerStore';

// The bar's green button is the master controller: it plays/stops the current track.
// Any play button on the site feeds this bar via the player store, so music is seamless
// across pages (the bar persists outside Routes) and never redirects to Spotify.
const WYH_TRACK_URL = 'https://open.spotify.com/track/6lX5V0j0bQiLOzldueTmnz';
const MEMORIAL_PATHS = ['/mum', '/without-you-here'];

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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="fixed bottom-3 left-1/2 -translate-x-1/2 w-[calc(100%-1rem)] max-w-6xl rounded-2xl bg-card/80 backdrop-blur-sm border border-border/40 px-4 py-2.5 z-50 shadow-[0_-2px_24px_rgba(0,0,0,0.3)]"
    >
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-3">

        {/* LEFT: master play controller */}
        <button
          type="button"
          onClick={toggle}
          aria-label={active ? `Stop ${title}` : 'Play Without You Here'}
          className="flex items-center gap-2 flex-shrink-0"
        >
          <span className="w-8 h-8 rounded-full bg-[#1DB954] flex items-center justify-center">
            {active ? <Square className="w-3.5 h-3.5 text-black" /> : <Play className="w-3.5 h-3.5 text-black" />}
          </span>
          <span className="font-body text-[9px] tracking-widest uppercase text-muted-foreground hidden sm:block select-none">
            {active ? `Now Playing · ${title}` : 'Without You Here · Spotify'}
          </span>
        </button>

        {/* CENTRE: charity message, or the embedded Spotify player when a track is active */}
        <div className="flex items-center gap-2 flex-1 justify-center min-w-0">
          <AnimatePresence mode="wait">
            {active && track ? (
              <motion.div
                key="player"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-full max-w-xs"
              >
                <iframe
                  title="Spotify player"
                  src={`${track}?theme=0`}
                  width="100%"
                  height="64"
                  frameBorder="0"
                  allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                  loading="lazy"
                  className="rounded-lg"
                />
              </motion.div>
            ) : (
              <motion.div
                key="charity"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-2 justify-center"
              >
                <img src="https://media.base44.com/images/public/69eb7905ca6eb4180010f794/adcdec40c_GWheartlacewrap.png" alt="GW Heart" className="w-6 h-6 object-contain flex-shrink-0" />
                <div>
                  <p className="font-body text-xs text-foreground font-medium leading-tight">Support the "Thank You" Project</p>
                  <p className="font-body text-[10px] text-muted-foreground">10% of all support → 1800RESPECT</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* RIGHT: CTA */}
        <div className="flex gap-2 flex-shrink-0">
          <Link to="/back-this">
            <Button size="sm" className="rounded-full gradient-gold-button border-0 font-body text-xs tracking-wider uppercase px-4 h-8">
              Support Now
            </Button>
          </Link>
        </div>

      </div>
    </motion.div>
  );
}