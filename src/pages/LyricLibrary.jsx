import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, ChevronDown, Lock, Library } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import GannonSignature from '@/components/global/GannonSignature';

export default function LyricLibrary() {
  const [openId, setOpenId] = useState(null);
  const [filterRelease, setFilterRelease] = useState('all');

  const { data: lyrics = [] } = useQuery({
    queryKey: ['lyricLibrary'],
    queryFn: () => base44.entities.Lyric.filter({ is_published: true, publishing_safe: true }, 'sort_order', 100),
    initialData: [],
  });

  const releases = useMemo(() => {
    const titles = [...new Set(lyrics.map(l => l.release_title).filter(Boolean))];
    return ['all', ...titles];
  }, [lyrics]);

  const filtered = filterRelease === 'all'
    ? lyrics
    : lyrics.filter(l => l.release_title === filterRelease);

  const grouped = useMemo(() => {
    if (filterRelease !== 'all') return [{ release: filterRelease, songs: filtered }];
    const map = {};
    filtered.forEach(l => {
      const key = l.release_title || ' standalone';
      if (!map[key]) map[key] = [];
      map[key].push(l);
    });
    return Object.entries(map).map(([release, songs]) => ({ release, songs }));
  }, [filtered, filterRelease]);

  return (
    <div className="min-h-screen py-24 px-4 md:px-8">
      <div className="max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <div className="w-16 h-16 rounded-full bg-secondary/50 flex items-center justify-center border border-primary/20 text-primary/60 mx-auto mb-6">
            <Library className="w-7 h-7" />
          </div>
          <p className="font-body text-xs tracking-[0.3em] uppercase gradient-gold-glow mb-4">The Full Collection</p>
          <h1 className="font-display text-4xl md:text-6xl text-foreground mb-5">Lyric Library</h1>
          <p className="font-body text-sm text-muted-foreground max-w-lg mx-auto leading-relaxed">
            Every song, every word, organised by release. Read through a full album's lyrics in sequence, or jump to the song you can't stop thinking about.
          </p>
        </motion.div>

        {lyrics.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 rounded-full bg-secondary/50 flex items-center justify-center border border-primary/20 text-primary/60 mx-auto mb-6">
              <Lock className="w-7 h-7" />
            </div>
            <h2 className="font-display text-2xl text-foreground mb-3">Library Opening Soon</h2>
            <p className="font-body text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
              The full lyric library is being curated. Each song's complete lyrics will be organised here by release.
            </p>
            <Link to="/music" className="mt-6 inline-block">
              <Button variant="outline" className="rounded-full font-body text-sm tracking-wider uppercase">
                Go to Music
              </Button>
            </Link>
          </div>
        ) : (
          <>
            {/* Release filter */}
            <div className="flex flex-wrap justify-center gap-2 mb-10">
              {releases.map(rel => (
                <button
                  key={rel}
                  onClick={() => setFilterRelease(rel)}
                  className="font-body text-xs tracking-wider uppercase px-4 py-2 rounded-full transition-all"
                  style={{
                    background: filterRelease === rel ? 'hsl(var(--primary) / 0.15)' : 'transparent',
                    border: `1px solid hsl(var(--primary) / ${filterRelease === rel ? 0.4 : 0.2})`,
                    color: filterRelease === rel ? 'hsl(var(--primary))' : 'hsl(var(--muted-foreground))',
                  }}
                >
                  {rel === 'all' ? 'All Releases' : rel}
                </button>
              ))}
            </div>

            {/* Lyrics grouped by release */}
            <div className="space-y-12">
              {grouped.map((group, gi) => (
                <motion.div key={group.release} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: gi * 0.1 }}>
                  <div className="flex items-center gap-3 mb-6 pb-3 border-b border-border/30">
                    {group.release !== ' standalone' ? (
                      <>
                        <BookOpen className="w-4 h-4 text-primary/50" />
                        <h2 className="font-display text-xl text-foreground">{group.release}</h2>
                        <Badge variant="outline" className="font-body text-[10px] tracking-widest uppercase border-primary/20 text-primary/60">
                          {group.songs.length} {group.songs.length === 1 ? 'song' : 'songs'}
                        </Badge>
                      </>
                    ) : (
                      <h2 className="font-display text-xl text-foreground/70">Standalone Tracks</h2>
                    )}
                  </div>
                  <div className="space-y-3">
                    {group.songs.map((lyric, i) => (
                      <div key={lyric.id} className="bg-card border border-border/40 rounded-2xl overflow-hidden">
                        <button
                          onClick={() => setOpenId(openId === lyric.id ? null : lyric.id)}
                          className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-secondary/20 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <span className="font-body text-xs text-muted-foreground/50 w-6">{String(i + 1).padStart(2, '0')}</span>
                            <p className="font-display text-lg text-foreground">{lyric.title}</p>
                          </div>
                          <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${openId === lyric.id ? 'rotate-180' : ''}`} />
                        </button>
                        <AnimatePresence>
                          {openId === lyric.id && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.3 }}
                              className="overflow-hidden"
                            >
                              <div className="px-6 pb-8 border-t border-border/30 pt-6 space-y-6">
                                {lyric.inspiration && (
                                  <div className="bg-secondary/20 rounded-xl p-4 mb-4">
                                    <p className="font-body text-[10px] tracking-widest uppercase text-primary/50 mb-2">Story Behind the Song</p>
                                    <p className="font-body text-sm text-foreground/70 leading-relaxed italic">{lyric.inspiration}</p>
                                  </div>
                                )}
                                <pre className="font-display text-foreground/80 leading-loose text-base whitespace-pre-wrap italic bg-secondary/20 rounded-xl p-6">
                                  {lyric.lyrics_text}
                                </pre>
                                {lyric.copyright_year && (
                                  <p className="font-body text-xs text-muted-foreground mt-6 pt-4 border-t border-border/30">
                                    Copyright © Gannon Waye {lyric.copyright_year}
                                  </p>
                                )}
                                <div className="flex justify-end mt-4">
                                  <GannonSignature />
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </>
        )}

        <div className="mt-16 text-center">
          <Link to="/music">
            <Button variant="outline" className="rounded-full font-body text-sm tracking-wider uppercase border-primary/30 text-primary hover:bg-primary/10">
              ← Back to Music
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}