import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { ExternalLink, Music2, Play } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { usePlayerStore } from '@/lib/playerStore';
import { PUBLIC_RELEASE_FILTER, isPublicRelease } from '@/lib/publicRelease';
import { APPLE_MUSIC_ARTIST_URL } from '@/config/artistLinks';

export default function Music() {
  const { data: candidates = [], isLoading } = useQuery({
    queryKey: ['music-public-releases'],
    queryFn: () => base44.entities.Release.filter(PUBLIC_RELEASE_FILTER, '-release_date', 100),
    initialData: [],
  });

  const releases = candidates.filter(isPublicRelease);
  const featured = releases.find((release) => release.is_current_single === true)
    || releases[0]
    || null;
  const playTrack = usePlayerStore((state) => state.playTrack);

  return (
    <div className="min-h-screen py-24 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        <motion.header
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-14"
        >
          <p className="font-body text-xs tracking-[0.3em] uppercase gradient-gold-glow mb-4">
            Official catalogue
          </p>
          <h1 className="font-display text-5xl md:text-7xl text-foreground mb-5">Music</h1>
          <p className="font-body text-sm text-muted-foreground max-w-xl mx-auto leading-relaxed">
            Only songs and releases explicitly approved by Gannon for public sharing appear here.
          </p>
        </motion.header>

        {isLoading ? (
          <div className="rounded-2xl border border-border/40 bg-card/50 p-10 text-center">
            <p className="font-body text-sm text-muted-foreground">Loading approved music...</p>
          </div>
        ) : releases.length === 0 ? (
          <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="rounded-2xl border border-primary/20 bg-card/50 p-10 md:p-14 text-center"
          >
            <Music2 className="w-10 h-10 text-primary/60 mx-auto mb-5" />
            <h2 className="font-display text-3xl text-foreground mb-3">Music shared when ready</h2>
            <p className="font-body text-sm text-muted-foreground max-w-lg mx-auto leading-relaxed">
              There are no owner-approved public releases listed right now. Join the community for verified updates.
            </p>
            <Link to="/community" className="inline-block mt-7">
              <Button className="rounded-full gradient-gold-button border-0 px-7">
                Join the Community
              </Button>
            </Link>
          </motion.section>
        ) : (
          <>
            {featured && (
              <motion.section
                initial={{ opacity: 0, y: 22 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid md:grid-cols-[minmax(0,360px)_1fr] gap-8 items-center rounded-3xl border border-primary/25 bg-card/55 p-6 md:p-10 mb-12"
              >
                <Link
                  to={`/release/${featured.id}`}
                  className="aspect-square rounded-2xl overflow-hidden bg-secondary/40 border border-border/50"
                >
                  {featured.artwork_url ? (
                    <img
                      src={featured.artwork_url}
                      alt={`${featured.title}, Gannon Waye`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Music2 className="w-16 h-16 text-muted-foreground/30" />
                    </div>
                  )}
                </Link>

                <div>
                  <h2 className="font-display text-4xl md:text-6xl text-foreground mb-2">
                    {featured.title}
                  </h2>
                  {featured.version_label && (
                    <p className="font-body text-xs tracking-[0.2em] uppercase text-muted-foreground mb-4">
                      {featured.version_label}
                    </p>
                  )}
                  {featured.description && (
                    <p className="font-body text-sm text-foreground/70 leading-relaxed max-w-2xl">
                      {featured.description}
                    </p>
                  )}

                  <div className="flex flex-wrap gap-3 mt-7">
                    {featured.spotify_link && (
                      <Button
                        type="button"
                        onClick={() => playTrack(featured.spotify_link, {
                          title: featured.title || '',
                          artwork: featured.artwork_url || '',
                        })}
                        className="gap-2 rounded-full gradient-gold-button border-0"
                      >
                        <Play className="w-4 h-4" /> Play
                      </Button>
                    )}
                    {[
                      ['Spotify', featured.spotify_link],
                      ['Listen Now', featured.apple_music_link || APPLE_MUSIC_ARTIST_URL],
                      ['YouTube', featured.youtube_link],
                    ].filter(([, href]) => href).map(([label, href]) => (
                      <a key={label} href={href} target="_blank" rel="noopener noreferrer">
                        <Button
                          variant="outline"
                          className="gap-2 rounded-full border-primary/35 text-primary"
                        >
                          {label} <ExternalLink className="w-3.5 h-3.5" />
                        </Button>
                      </a>
                    ))}
                    <Link to={`/release/${featured.id}`}>
                      <Button variant="ghost" className="rounded-full">
                        Release details
                      </Button>
                    </Link>
                  </div>
                </div>
              </motion.section>
            )}

            <section>
              <h2 className="font-display text-3xl text-foreground mb-6">Public releases</h2>
              <div className="grid sm:grid-cols-1 lg:grid-cols-2 gap-8">
                {releases.map((release) => {
                  const listenHref = release.apple_music_link || APPLE_MUSIC_ARTIST_URL;
                  return (
                  <motion.article
                    key={release.id}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="rounded-3xl overflow-hidden border border-border/40 bg-card/55 flex flex-col"
                  >
                    <Link to={`/release/${release.id}`}>
                      <div className="aspect-square bg-secondary/40 overflow-hidden">
                        {release.artwork_url ? (
                          <img
                            src={release.artwork_url}
                            alt={`${release.title}, Gannon Waye`}
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Music2 className="w-16 h-16 text-muted-foreground/30" />
                          </div>
                        )}
                      </div>
                    </Link>
                    <div className="p-6 flex-1 flex flex-col">
                      <Link to={`/release/${release.id}`} className="block">
                        <p className="font-body text-[10px] tracking-[0.25em] uppercase text-primary">
                          {release.type || 'release'}
                        </p>
                        <h3 className="font-display text-3xl text-foreground mt-1">{release.title}</h3>
                        {release.version_label && (
                          <p className="font-body text-xs text-muted-foreground mt-1">
                            {release.version_label}
                          </p>
                        )}
                        {release.description && (
                          <p className="font-body text-sm text-muted-foreground mt-3 line-clamp-2">
                            {release.description}
                          </p>
                        )}
                      </Link>
                      <div className="flex flex-wrap items-center gap-2.5 mt-5">
                        <a href={listenHref} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full gradient-gold-button border-0 px-6 py-2.5">
                          <Play className="w-4 h-4" /> Listen
                        </a>
                        {release.spotify_link && (
                          <a href={release.spotify_link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full border border-primary/35 text-primary px-5 py-2.5 hover:bg-primary/10 transition-colors">
                            <ExternalLink className="w-3.5 h-3.5" /> Spotify
                          </a>
                        )}
                        <Link to={`/release/${release.id}`}>
                          <Button variant="ghost" className="rounded-full">Details</Button>
                        </Link>
                      </div>
                    </div>
                  </motion.article>
                  );
                })}
              </div>
            </section>
          </>
        )}
      </div>
    </div>
  );
}