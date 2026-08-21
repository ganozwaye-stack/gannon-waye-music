import { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Lock, Play } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import GannonSignature from '@/components/global/GannonSignature';
import SaveLyricButton from '@/components/public/SaveLyricButton';
import { PUBLIC_RELEASE_FILTER, isPublicRelease } from '@/lib/publicRelease';

export default function LyricsPage() {
  const [openId, setOpenId] = useState(null);

  const { data: lyricCandidates = [] } = useQuery({
    queryKey: ['lyrics-page-approved-candidates'],
    queryFn: () => base44.entities.Lyric.filter({
      is_published: true,
      publishing_safe: true,
      release_publication_approved: true,
      publishing_status: 'published',
      approval_status: 'approved',
      version_status: 'approved',
      needs_review: false,
      contains_unresolved_wording: false,
    }, 'sort_order', 100),
    initialData: [],
  });

  const { data: releaseCandidates = [] } = useQuery({
    queryKey: ['lyrics-page-public-releases'],
    queryFn: () => base44.entities.Release.filter(PUBLIC_RELEASE_FILTER, '-release_date', 100),
    initialData: [],
  });

  const releases = releaseCandidates.filter(isPublicRelease);
  const releaseById = Object.fromEntries(releases.map((release) => [release.id, release]));
  const lyrics = lyricCandidates.filter((lyric) => (
    lyric.release_id && releaseById[lyric.release_id]
  ));

  const listenLinks = (lyric) => {
    const release = lyric.release_id ? releaseById[lyric.release_id] : null;
    const links = [];
    if (release?.spotify_link) links.push({ label: 'Spotify', url: release.spotify_link });
    if (release?.apple_music_link) links.push({ label: 'Apple Music', url: release.apple_music_link });
    if (release?.youtube_link) links.push({ label: 'YouTube', url: release.youtube_link });
    return links;
  };

  return (
    <>
      {/* Moody backdrop — solid charcoal with a soft gold halo */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none" aria-hidden>
        <div className="absolute inset-0 bg-background" />
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{ background: 'radial-gradient(circle at 50% 0%, hsl(var(--primary)) 0%, transparent 60%)' }}
        />
      </div>

      <div className="min-h-screen py-24 px-4 md:px-8 relative">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-14"
          >
            <p className="font-body text-xs tracking-[0.3em] uppercase gradient-gold-glow mb-4">Words &amp; Meaning</p>
            <h1 className="font-display text-4xl md:text-6xl text-foreground mb-5">Lyrics</h1>
            <p className="font-body text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
              Every word is intentional. Read along, sit with it, or find the line that feels like yours.
            </p>
          </motion.div>

          {lyrics.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-16 h-16 rounded-full bg-secondary/50 flex items-center justify-center border border-primary/20 text-primary/60 mx-auto mb-6">
                <Lock className="w-7 h-7" />
              </div>
              <h2 className="font-display text-2xl text-foreground mb-3">Lyrics Coming Soon</h2>
              <p className="font-body text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
                The full lyrics archive is being carefully prepared. Each song's words will appear here once they're finalised and approved for publishing.
              </p>
              <div className="mt-6 inline-block">
                <Link to="/music">
                  <Button variant="outline" className="rounded-full font-body text-sm tracking-wider uppercase">
                    Go to Music
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {lyrics.map((lyric, i) => {
                const open = openId === lyric.id;
                const links = listenLinks(lyric);
                return (
                  <motion.div
                    key={lyric.id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.06 }}
                    className="bg-card border border-border/40 rounded-2xl overflow-hidden"
                  >
                    <button
                      onClick={() => setOpenId(open ? null : lyric.id)}
                      className="w-full flex items-center justify-between px-5 sm:px-6 py-5 text-left hover:bg-secondary/20 transition-colors"
                    >
                      <div className="min-w-0">
                        <p className="font-display text-lg sm:text-xl text-foreground truncate">{lyric.title}</p>
                        {lyric.release_title && (
                          <p className="font-body text-[11px] text-muted-foreground uppercase tracking-widest mt-0.5 truncate">
                            {lyric.release_title}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-3 shrink-0 pl-3">
                        {links.length > 0 && (
                          <span className="hidden sm:flex items-center gap-1.5 font-body text-[10px] uppercase tracking-wider text-primary/70">
                            <Play className="w-3 h-3" /> Listen
                          </span>
                        )}
                        <ChevronDown
                          className={`w-5 h-5 text-muted-foreground transition-transform ${open ? 'rotate-180' : ''}`}
                        />
                      </div>
                    </button>

                    <AnimatePresence>
                      {open && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <div className="px-5 sm:px-6 pb-8 border-t border-border/30 pt-6">
                            {/* Listen while you read */}
                            {links.length > 0 && (
                              <div className="flex flex-wrap items-center gap-2 mb-6">
                                <span className="font-body text-[10px] uppercase tracking-[0.3em] text-muted-foreground/70 mr-1">
                                  Listen
                                </span>
                                {links.map((l) => (
                                  <a key={l.label} href={l.url} target="_blank" rel="noopener noreferrer">
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="rounded-full font-body text-xs tracking-wide h-8 px-3"
                                    >
                                      <Play className="w-3 h-3" /> {l.label}
                                    </Button>
                                  </a>
                                ))}
                              </div>
                            )}

                            <div className="font-display text-foreground/85 leading-[2] text-base sm:text-lg whitespace-pre-wrap">
                              {lyric.lyrics_text}
                            </div>

                            {lyric.inspiration && (
                              <div className="mt-6 pt-5 border-t border-border/30">
                                <p className="font-body text-[10px] uppercase tracking-[0.3em] text-primary/60 mb-2">
                                  Behind the song
                                </p>
                                <p className="font-body text-sm text-muted-foreground leading-relaxed">
                                  {lyric.inspiration}
                                </p>
                              </div>
                            )}

                            <div className="mt-6">
                              <SaveLyricButton lyric={lyric} />
                            </div>

                            {lyric.copyright_year && (
                              <p className="font-body text-xs text-muted-foreground mt-6 pt-4 border-t border-border/30">
                                Copyright © Gannon Waye {lyric.copyright_year}
                              </p>
                            )}

                            <div className="flex justify-end mt-6">
                              <GannonSignature />
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </div>
          )}

          <div className="mt-12 text-center">
            <Link to="/back-this">
              <Button
                variant="outline"
                className="rounded-full font-body text-sm tracking-wider uppercase border-primary/30 text-primary hover:bg-primary/10"
              >
                Support the Music 🤍
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}