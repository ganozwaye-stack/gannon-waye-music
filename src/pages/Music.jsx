import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { ExternalLink, Music2, Play } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { usePlayerStore } from '@/lib/playerStore';
import { PUBLIC_RELEASE_FILTER, isPublicRelease } from '@/lib/publicRelease';

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
                  <p className="font-body text-[10px] tracking-[0.3em] uppercase text-primary mb-3">
                    Owner-approved public release
                  </p>
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
                      ['Apple Music', featured.apple_music_link],
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
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {releases.map((release) => (
                  <motion.article
                    key={release.id}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="rounded-2xl overflow-hidden border border-border/40 bg-card/55"
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
                            <Music2 className="w-12 h-12 text-muted-foreground/30" />
                          </div>
                        )}
                      </div>
                      <div className="p-5">
                        <p className="font-body text-[10px] tracking-[0.25em] uppercase text-primary">
                          {release.type || 'release'}
                        </p>
                        <h3 className="font-display text-2xl text-foreground mt-1">{release.title}</h3>
                        {release.version_label && (
                          <p className="font-body text-xs text-muted-foreground mt-1">
                            {release.version_label}
                          </p>
                        )}
                        {release.description && (
                          <p className="font-body text-sm text-muted-foreground mt-3 line-clamp-3">
                            {release.description}
                          </p>
                        )}
                      </div>
                    </Link>
                  </motion.article>
                ))}
              </div>
            </section>
          </>
        )}
      </div>
    </div>
  );
}
