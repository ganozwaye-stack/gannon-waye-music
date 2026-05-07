import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { Music2, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import GannonSignature from '@/components/global/GannonSignature';
import LyricsScroller from '@/components/public/LyricsScroller';

export default function LyricsPage() {
  const [openId, setOpenId] = useState(null);

  const { data: releases } = useQuery({
    queryKey: ['releases'],
    queryFn: () => base44.entities.Release.list('-release_date'),
    initialData: [],
  });

  const withLyrics = releases.filter(r => r.is_published && r.lyrics && r.status === 'released');

  return (
    <div className="min-h-screen py-24 px-4 md:px-8">
      <div className="max-w-3xl mx-auto">

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-14"
        >
          <p className="font-body text-xs tracking-[0.3em] uppercase gradient-gold-glow mb-4">Words & Meaning</p>
          <h1 className="font-display text-4xl md:text-6xl text-foreground mb-5">Lyrics</h1>
          <p className="font-body text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
            Every word is intentional. Read along, sit with it, or find the line that feels like yours.
          </p>
        </motion.div>

        {withLyrics.length === 0 ? (
          <div className="text-center py-20">
            <Music2 className="w-14 h-14 text-muted-foreground/20 mx-auto mb-4" />
            <p className="font-body text-muted-foreground">Lyrics will be revealed when "Thank You" by Gannon Waye drops on June 10, 2026.</p>
            <Link to="/music" className="mt-4 inline-block">
              <Button variant="outline" className="rounded-full font-body text-sm tracking-wider uppercase mt-4">
                Go to Music
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {withLyrics.map((release, i) => (
              <motion.div
                key={release.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className="bg-card border border-border/40 rounded-2xl overflow-hidden"
              >
                <button
                  onClick={() => setOpenId(openId === release.id ? null : release.id)}
                  className="w-full flex items-center justify-between px-6 py-5 text-left hover:bg-secondary/20 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    {release.artwork_url && (
                      <img src={release.artwork_url} alt={release.title} className="w-12 h-12 rounded-lg object-cover" />
                    )}
                    <div>
                      <p className="font-display text-xl text-foreground">{release.title}</p>
                      <p className="font-body text-xs text-muted-foreground uppercase tracking-widest mt-0.5">{release.type}</p>
                    </div>
                  </div>
                  <ChevronDown className={`w-5 h-5 text-muted-foreground transition-transform ${openId === release.id ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {openId === release.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-8 border-t border-border/30 pt-6 space-y-6">
                        {/* Scroller */}
                        <LyricsScroller release={release} />

                        {/* Traditional view */}
                        <div>
                          <p className="font-body text-xs text-muted-foreground uppercase tracking-widest mb-4">Traditional View</p>
                          <pre className="font-display text-foreground/80 leading-loose text-base whitespace-pre-wrap italic bg-secondary/20 rounded-xl p-6">
                            {release.lyrics}
                          </pre>
                        </div>
                        {release.credits && (
                          <p className="font-body text-xs text-muted-foreground mt-6 pt-4 border-t border-border/30">
                            {release.credits}
                          </p>
                        )}
                        {/* Signature */}
                        <div className="flex justify-end mt-8 pr-4">
                          <GannonSignature />
                        </div>

                        <div className="flex gap-3 mt-5 flex-wrap">
                          {release.spotify_link && (
                            <a href={release.spotify_link} target="_blank" rel="noopener noreferrer">
                              <Button size="sm" className="rounded-full gap-2 font-body text-xs gradient-gold-button border-0">
                                🎧 Listen on Spotify
                              </Button>
                            </a>
                          )}
                          {release.apple_music_link && (
                            <a href={release.apple_music_link} target="_blank" rel="noopener noreferrer">
                              <Button size="sm" variant="outline" className="rounded-full gap-2 font-body text-xs">
                                🍎 Apple Music
                              </Button>
                            </a>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        )}

        <div className="mt-12 text-center">
          <Link to="/back-this">
            <Button variant="outline" className="rounded-full font-body text-sm tracking-wider uppercase border-primary/30 text-primary hover:bg-primary/10">
              Support the Music 🤍
            </Button>
          </Link>
        </div>

      </div>
    </div>
  );
}