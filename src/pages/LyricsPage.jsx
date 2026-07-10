import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { Music2, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import GannonSignature from '@/components/global/GannonSignature';
import LyricsScroller from '@/components/public/LyricsScroller';
import { WITHOUT_YOU_HERE_COVER } from '@/constants/musicAssets';

function getReleaseArtwork(release) {
  if (release.title === 'Without You Here') return WITHOUT_YOU_HERE_COVER;
  return release.artwork_url;
}

export default function LyricsPage() {
  const [openId, setOpenId] = useState(null);

  const { data: releases } = useQuery({
    queryKey: ['releases'],
    queryFn: () => base44.entities.Release.list('-release_date'),
    initialData: [],
  });

  const localReleases = [
    {
      id: 'thankyou',
      title: 'THANKYOU',
      type: 'Single',
      status: 'released',
      isLocked: true,
      is_published: true,
      artwork_url: 'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/6dde7d697_2.jpg',
      credits: 'Written & Performed by Gannon Waye'
    },
    {
      id: 'will-you-even-listen',
      title: 'Will You Even Listen',
      type: 'Single',
      status: 'recording',
      isLocked: true,
      is_published: true,
      artwork_url: '/images/will_you_even_listen_cover.png',
      credits: 'Written & Performed by Gannon Waye'
    },
    {
      id: 'without-you-here',
      title: 'Without You Here',
      type: 'Single',
      status: 'recording',
      isLocked: true,
      is_published: true,
      artwork_url: WITHOUT_YOU_HERE_COVER,
      credits: 'Written & Performed by Gannon Waye'
    }
  ];

  const withLyrics = [
    ...releases.filter(r => r.is_published && r.lyrics && !localReleases.some(lr => lr.title === r.title)),
    ...localReleases
  ];

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
            <p className="font-body text-muted-foreground">Lyrics are being prepared for release. Stream "THANKYOU" by Gannon Waye now and check back for the official lyric drop.</p>
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
                    {getReleaseArtwork(release) && (
                      <img src={getReleaseArtwork(release)} alt={`${release.title} artwork`} className="w-12 h-12 rounded-lg object-cover" />
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
                        {release.isLocked ? (
                          <div className="bg-gradient-to-br from-card to-secondary/30 rounded-2xl p-8 border border-border/40 backdrop-blur-md text-center py-12 relative overflow-hidden">
                            <div className="absolute -inset-10 bg-gradient-to-r from-yellow-500/10 to-amber-500/10 rounded-full blur-2xl opacity-60 animate-pulse pointer-events-none" />
                            
                            <div className="relative z-10 flex flex-col items-center">
                              <div className="w-16 h-16 rounded-full bg-secondary/50 flex items-center justify-center border border-yellow-500/30 text-yellow-500 mb-4 shadow-lg shadow-yellow-500/5">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
                                </svg>
                              </div>
                              <h3 className="font-display text-2xl text-foreground mb-2">Studio Session</h3>
                              <p className="font-body text-sm text-yellow-500/90 tracking-wider uppercase font-semibold mb-3">Release Pending</p>
                              <p className="font-body text-base text-muted-foreground max-w-md">
                                Lyrics are being prepared for release. The single is streaming now.
                              </p>
                            </div>
                          </div>
                        ) : (
                          <>
                            {/* Scroller */}
                            <LyricsScroller release={release} />

                            {/* Traditional view */}
                            <div>
                              <p className="font-body text-xs text-muted-foreground uppercase tracking-widest mb-4">Traditional View</p>
                              <pre className="font-display text-foreground/80 leading-loose text-base whitespace-pre-wrap italic bg-secondary/20 rounded-xl p-6">
                                {release.lyrics}
                              </pre>
                            </div>
                          </>
                        )}
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
                          <Link to={`/lyrics/${release.id === 'thank-you-fallback' ? 'thankyou' : release.id}`}>
                            <Button size="sm" variant="outline" className="rounded-full gap-2 font-body text-xs">
                              Open lyric page
                            </Button>
                          </Link>
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
