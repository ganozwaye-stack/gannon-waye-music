import { Link, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { ArrowLeft, ExternalLink, Music2, Play } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { usePlayerStore } from '@/lib/playerStore';
import { PUBLIC_RELEASE_FILTER, isPublicRelease } from '@/lib/publicRelease';
import { APPLE_MUSIC_ARTIST_URL } from '@/config/artistLinks';
import GoldenEmbers from '@/components/three/GoldenEmbers';

/**
 * Every release page carries its own natural ambience, drawn from the release's
 * mood. The mood decides how dense and bright the ember field is and how much
 * gold glow sits behind the artwork, so each song's page feels like its own
 * world without any per-song setup. Any new release created in the Release
 * Studio gets a page with its own atmosphere automatically.
 */
const MOOD_AMBIENCE = {
  reflective: { density: 0.5, intensity: 0.55, glow: 0.1 },
  melancholic: { density: 0.4, intensity: 0.45, glow: 0.08 },
  tender: { density: 0.55, intensity: 0.55, glow: 0.11 },
  intimate: { density: 0.45, intensity: 0.5, glow: 0.1 },
  raw: { density: 0.65, intensity: 0.7, glow: 0.13 },
  uplifting: { density: 0.8, intensity: 0.8, glow: 0.16 },
  hopeful: { density: 0.75, intensity: 0.75, glow: 0.15 },
  anthemic: { density: 0.9, intensity: 0.85, glow: 0.18 },
};
const DEFAULT_AMBIENCE = { density: 0.7, intensity: 0.65, glow: 0.13 };

export default function ReleaseDetail() {
  const { id } = useParams();
  const { data: matches = [], isLoading } = useQuery({
    queryKey: ['public-release-detail', id],
    queryFn: () => base44.entities.Release.filter({
      id,
      ...PUBLIC_RELEASE_FILTER,
    }, '', 1),
    enabled: Boolean(id),
    initialData: [],
  });
  const release = matches.find(isPublicRelease) || null;
  const playTrack = usePlayerStore((state) => state.playTrack);

  if (isLoading) {
    return (
      <div className="min-h-screen py-24 px-4 text-center">
        <p className="font-body text-sm text-muted-foreground">Loading release...</p>
      </div>
    );
  }

  if (!release) {
    return (
      <div className="min-h-screen py-24 px-4 flex items-center justify-center">
        <div className="max-w-xl text-center rounded-3xl border border-primary/20 bg-card/50 p-10">
          <Music2 className="w-10 h-10 text-primary/60 mx-auto mb-4" />
          <h1 className="font-display text-4xl text-foreground mb-3">Release not available</h1>
          <p className="font-body text-sm text-muted-foreground">
            This release is private, unavailable, or has not been explicitly approved for public sharing.
          </p>
          <Link to="/music" className="inline-block mt-7">
            <Button className="rounded-full gradient-gold-button border-0">
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to Music
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const ambience = MOOD_AMBIENCE[release.mood] || DEFAULT_AMBIENCE;

  const links = [
    ['Spotify', release.spotify_link],
    ['Listen Now', release.apple_music_link || APPLE_MUSIC_ARTIST_URL],
    ['YouTube', release.youtube_link],
  ].filter(([, href]) => href);

  return (
    <div className="relative min-h-screen py-24 px-4 md:px-8 overflow-hidden">
      {/* The song's own world: gold glow, rising embers and a soft vignette,
          tuned to the release's mood. Pointer-transparent, purely atmospheric. */}
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{ background: `radial-gradient(120% 80% at 50% 18%, rgba(212,175,55,${ambience.glow}), rgba(8,8,14,0) 60%)` }}
      />
      <div className="absolute inset-0 z-[1] pointer-events-none">
        <GoldenEmbers density={ambience.density} intensity={ambience.intensity} />
      </div>
      <div
        className="absolute inset-0 z-[2] pointer-events-none"
        style={{ background: 'radial-gradient(130% 90% at 50% 40%, rgba(8,8,14,0) 45%, rgba(8,8,14,0.7) 100%)' }}
      />

      <motion.main
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 max-w-5xl mx-auto"
      >
        <Link
          to="/music"
          className="inline-flex items-center gap-2 font-body text-xs tracking-wider uppercase text-muted-foreground hover:text-primary mb-8"
        >
          <ArrowLeft className="w-4 h-4" /> Music
        </Link>

        <div className="grid md:grid-cols-[minmax(0,420px)_1fr] gap-9 items-start">
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.1 }}
            className="relative aspect-square rounded-2xl overflow-hidden border border-primary/40 bg-card/55"
            style={{ boxShadow: '0 0 42px rgba(212,175,55,0.16), 0 18px 48px rgba(0,0,0,0.5)' }}
          >
            {release.artwork_url ? (
              <img
                src={release.artwork_url}
                alt={`${release.title}, Gannon Waye`}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Music2 className="w-16 h-16 text-muted-foreground/30" />
              </div>
            )}
          </motion.div>

          <div className="pt-2">
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="font-body text-[10px] tracking-[0.3em] uppercase text-primary mb-3"
            >
              {release.type || 'release'}
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="font-display text-5xl md:text-7xl text-foreground"
            >
              {release.title}
            </motion.h1>
            {release.version_label && (
              <p className="font-body text-sm tracking-[0.2em] uppercase text-muted-foreground mt-2">
                {release.version_label}
              </p>
            )}
            {release.release_date && (
              <p className="font-body text-xs text-muted-foreground mt-4">
                Released {new Date(release.release_date).toLocaleDateString('en-AU', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </p>
            )}
            {release.description && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.9, delay: 0.45 }}
                className="font-body text-base text-foreground/70 leading-relaxed mt-7"
              >
                {release.description}
              </motion.p>
            )}

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-wrap gap-3 mt-8"
            >
              {release.spotify_link && (
                <Button
                  type="button"
                  onClick={() => playTrack(release.spotify_link, {
                    title: release.title || '',
                    artwork: release.artwork_url || '',
                  })}
                  className="gap-2 rounded-full gradient-gold-button border-0"
                >
                  <Play className="w-4 h-4" /> Play
                </Button>
              )}
              {links.map(([label, href]) => (
                <a key={label} href={href} target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" className="gap-2 rounded-full border-foreground/30 text-foreground hover:border-foreground/60 hover:bg-foreground/5">
                    {label} <ExternalLink className="w-3.5 h-3.5" />
                  </Button>
                </a>
              ))}
            </motion.div>

            {release.credits && (
              <div className="mt-10 pt-7 border-t border-border/40">
                <h2 className="font-body text-xs tracking-[0.25em] uppercase text-primary mb-3">Credits</h2>
                <p className="font-body text-sm text-muted-foreground whitespace-pre-wrap">
                  {release.credits}
                </p>
              </div>
            )}
          </div>
        </div>
      </motion.main>
    </div>
  );
}