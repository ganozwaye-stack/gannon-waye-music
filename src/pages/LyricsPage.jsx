import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { Music2, ChevronDown, ExternalLink, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import GannonSignature from '@/components/global/GannonSignature';

export default function LyricsPage() {
  const [openId, setOpenId] = useState(null);

  const { data: releases = [] } = useQuery({
    queryKey: ['releases'],
    queryFn: () => base44.entities.Release.list('-release_date'),
  });

  const withLyrics = releases.filter(r => r.is_published && r.lyrics && r.status === 'released');

  return (
    <div className="min-h-screen py-24 px-4 md:px-8">
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <p className="font-body text-xs tracking-[0.35em] uppercase gradient-gold-glow mb-5">Words & Meaning</p>
          <h1 className="font-display text-5xl md:text-7xl text-foreground mb-6">Lyrics</h1>
          <div className="w-12 h-px bg-primary/40 mx-auto mb-6" />
          <p className="font-body text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
            Every word is intentional. Read along, sit with it, or find the line that feels like yours.
          </p>
        </motion.div>

        {withLyrics.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { delay: 0.2 } }}
            className="text-center py-20"
          >
            <Music2 className="w-14 h-14 text-muted-foreground/20 mx-auto mb-5" />
            <p className="font-display text-xl text-foreground/60 mb-2">Coming June 5, 2026</p>
            <p className="font-body text-sm text-muted-foreground mb-8">
              Lyrics for "Thank You" by Gannon Waye will be revealed on release day.
            </p>
            <Link to="/music">
              <Button variant="outline" className="rounded-full font-body text-sm tracking-wider uppercase">
                Go to Music
              </Button>
            </Link>
          </motion.div>
        ) : (
          <div className="space-y-3">
            {withLyrics.map((release, i) => (
              <motion.div
                key={release.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className="bg-card border border-border/40 rounded-2xl overflow-hidden"
              >
                {/* Song header row */}
                <button
                  onClick={() => setOpenId(openId === release.id ? null : release.id)}
                  className="w-full flex items-center justify-between px-6 py-5 text-left hover:bg-secondary/20 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    {release.artwork_url && (
                      <img
                        src={release.artwork_url}
                        alt={release.title}
                        className="w-14 h-14 rounded-xl object-cover shadow-md"
                      />
                    )}
                    <div>
                      <p className="font-display text-xl text-foreground">{release.title}</p>
                      <p className="font-body text-xs text-muted-foreground uppercase tracking-widest mt-1">
                        {release.type} {release.release_date ? `· ${new Date(release.release_date).getFullYear()}` : ''}
                      </p>
                    </div>
                  </div>
                  <ChevronDown
                    className={`w-5 h-5 text-muted-foreground transition-transform duration-300 ${openId === release.id ? 'rotate-180' : ''}`}
                  />
                </button>

                {/* Lyrics content */}
                <AnimatePresence>
                  {openId === release.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35, ease: 'easeInOut' }}
                      className="overflow-hidden"
                    >
                      <div className="border-t border-border/30">

                        {/* Lyrics body */}
                        <div className="px-6 pt-8 pb-2">
                          <pre className="font-display text-foreground/85 leading-[2.2] text-base md:text-lg whitespace-pre-wrap italic">
                            {release.lyrics}
                          </pre>
                        </div>

                        {/* Credits */}
                        {release.credits && (
                          <div className="px-6 pt-6 pb-2">
                            <div className="border-t border-border/20 pt-4">
                              <p className="font-body text-[11px] text-muted-foreground/60 uppercase tracking-widest mb-1">Credits</p>
                              <p className="font-body text-xs text-muted-foreground leading-relaxed">{release.credits}</p>
                            </div>
                          </div>
                        )}

                        {/* Signature */}
                        <div className="flex justify-end px-8 pt-6 pb-4">
                          <GannonSignature />
                        </div>

                        {/* Streaming links */}
                        <div className="px-6 pb-8 flex gap-3 flex-wrap">
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

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { delay: 0.4 } }}
          className="mt-16 text-center"
        >
          <div className="w-12 h-px bg-primary/20 mx-auto mb-8" />
          <Link to="/back-this">
            <Button variant="outline" className="rounded-full font-body text-sm tracking-wider uppercase border-primary/30 text-primary hover:bg-primary/10 gap-2">
              <Heart className="w-3.5 h-3.5" /> Support the Music
            </Button>
          </Link>
        </motion.div>

      </div>
    </div>
  );
}