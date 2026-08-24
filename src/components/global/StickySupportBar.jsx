import { Link, useLocation } from 'react-router-dom';
import { Play, Square } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { usePlayerStore } from '@/lib/playerStore';
import { PUBLIC_RELEASE_FILTER, isPublicRelease } from '@/lib/publicRelease';

const MEMORIAL_PATHS = ['/mum', '/without-you-here', '/remember-mum'];
const HEART_IMG = 'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/adcdec40c_GWheartlacewrap.png';

const toEmbed = (url) => (
  typeof url === 'string' && url.trim()
    ? url.trim().replace('open.spotify.com/', 'open.spotify.com/embed/')
    : ''
);

export default function StickySupportBar() {
  const location = useLocation();
  const isMemorialPage = MEMORIAL_PATHS.includes(location.pathname);
  const isStorePage = location.pathname.startsWith('/store');

  const { data: candidates = [] } = useQuery({
    queryKey: ['sticky-player-public-releases'],
    queryFn: () => base44.entities.Release.filter(PUBLIC_RELEASE_FILTER, '-release_date', 25),
    staleTime: 60_000,
  });

  const approved = candidates.filter(isPublicRelease);
  const playableRelease = approved.find((release) => (
    release.is_current_single === true && release.spotify_link
  )) || approved.find((release) => release.spotify_link);

  const approvedTracks = new Set(
    approved
      .map((release) => toEmbed(release.spotify_link))
      .filter(Boolean),
  );

  const track = usePlayerStore((state) => state.track);
  const title = usePlayerStore((state) => state.title);
  const active = usePlayerStore((state) => state.active);
  const playTrack = usePlayerStore((state) => state.playTrack);
  const stop = usePlayerStore((state) => state.stop);
  const activeApproved = Boolean(active && track && approvedTracks.has(track));

  if (isMemorialPage || isStorePage) return null;

  const toggle = () => {
    if (activeApproved) {
      stop();
      return;
    }
    if (playableRelease?.spotify_link) {
      playTrack(playableRelease.spotify_link, {
        title: playableRelease.title || '',
        artwork: playableRelease.artwork_url || '',
      });
    }
  };

  return (
    <>
      {playableRelease && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="fixed bottom-4 left-4 right-4 z-50 sm:left-4 sm:right-auto sm:w-[min(86vw,300px)]"
        >
          <div className="w-full rounded-2xl bg-card/85 backdrop-blur-md border border-border/50 px-3 py-2.5 shadow-[0_-2px_24px_rgba(0,0,0,0.35)]">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={toggle}
                aria-label={activeApproved ? `Stop ${title || 'music'}` : `Play ${playableRelease.title || 'approved music'}`}
                className="flex items-center gap-2 flex-shrink-0"
              >
                <span className="w-8 h-8 rounded-full bg-[#1DB954] flex items-center justify-center">
                  {activeApproved
                    ? <Square className="w-3.5 h-3.5 text-black" />
                    : <Play className="w-3.5 h-3.5 text-black" />}
                </span>
              </button>

              <div className="flex-1 min-w-0">
                <AnimatePresence mode="wait">
                  {activeApproved ? (
                    <motion.div
                      key="player"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="w-full"
                    >
                      <iframe
                        title={title ? `Spotify player for ${title}` : 'Spotify player'}
                        src={`${track}${track.includes('?') ? '&' : '?'}theme=0`}
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
                      <img src={HEART_IMG} alt="" className="w-5 h-5 object-contain flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="font-body text-[10px] tracking-widest uppercase text-muted-foreground truncate">
                          {playableRelease.title} · Spotify
                        </p>
                        <p className="font-body text-[10px] text-muted-foreground truncate">
                          Current release
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="fixed bottom-[96px] right-4 z-50 sm:bottom-4"
      >
        <Link to="/back-this">
          <Button
            size="sm"
            className="rounded-full gradient-gold-button border-0 font-body text-xs tracking-wider uppercase whitespace-nowrap px-5"
          >
            Support Now
          </Button>
        </Link>
      </motion.div>
    </>
  );
}