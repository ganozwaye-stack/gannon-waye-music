import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Music2, Lock, Play, Pause } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { WITHOUT_YOU_HERE_COVER, getReleaseArtwork } from '@/config/releaseAssets';

// Garden-themed upcoming music preview page
export default function UpcomingMusic() {
  const [playing, setPlaying] = useState(null);
  const [audioRef, setAudioRef] = useState(null);

  const { data: releases = [] } = useQuery({
    queryKey: ['upcomingReleases'],
    queryFn: () => base44.entities.Release.filter({ is_published: true }),
    initialData: [],
  });

  // Inject 'Without You Here' as featured upcoming single if not already published in DB
  const withoutYouHereInDB = releases.some(r => r.title === 'Without You Here' && r.is_published);
  const injectedUpcoming = withoutYouHereInDB ? [] : [{
    id: 'without-you-here-upcoming',
    title: 'Without You Here',
    type: 'Single',
    status: 'ready',
    is_published: true,
    description: 'Written in the early hours of Mother\'s Day, four years after losing his mum. A raw, acoustic letter to Sonia — the voice he still reaches for, the wisdom he still misses, and the love that never left him, even after she did.',
    artwork_url: WITHOUT_YOU_HERE_COVER,
    is_featured_new: true,
  }];

  // Only show releases that are NOT yet released (idea, writing, pre_production, recording, mixing, mastering, ready)
  const upcoming = [
    ...injectedUpcoming,
    ...releases.filter(r =>
      r.status && !['released'].includes(r.status) && r.title
    ),
  ];

  const togglePlay = (release) => {
    if (!release.preview_clip_url) return;
    if (playing === release.id) {
      audioRef?.pause();
      setPlaying(null);
    } else {
      audioRef?.pause();
      const audio = new Audio(release.preview_clip_url);
      audio.play();
      setAudioRef(audio);
      setPlaying(release.id);
      audio.onended = () => setPlaying(null);
    }
  };

  const STATUS_LABELS = {
    idea: { label: 'In Conception', color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/30' },
    writing: { label: 'Being Written', color: 'text-purple-400', bg: 'bg-purple-500/10 border-purple-500/30' },
    pre_production: { label: 'Pre-Production', color: 'text-cyan-400', bg: 'bg-cyan-500/10 border-cyan-500/30' },
    recording: { label: 'In the Studio', color: 'text-primary', bg: 'bg-primary/10 border-primary/30' },
    mixing: { label: 'Mixing', color: 'text-primary', bg: 'bg-primary/10 border-primary/30' },
    mastering: { label: 'Mastering', color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/30' },
    ready: { label: 'Coming Soon', color: 'text-green-400', bg: 'bg-green-500/10 border-green-500/30' },
  };

  const FEATURED_BADGE = { label: 'New Single', color: 'text-primary', bg: 'bg-primary/10 border-primary/30' };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Garden background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <img
          src="https://media.base44.com/images/public/69eb7905ca6eb4180010f794/b7806166d_generated_image.png"
          alt=""
          className="w-full h-full object-cover"
          style={{ filter: 'brightness(0.18) saturate(0.85)' }}
        />
        <div className="absolute inset-0" style={{
          background: 'linear-gradient(to bottom, rgba(2,5,2,0.85) 0%, rgba(2,5,2,0.55) 40%, rgba(2,5,2,0.85) 100%)'
        }} />
      </div>

      <div className="relative z-10 py-24 px-4 md:px-8">
        <div className="max-w-3xl mx-auto">

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <p className="font-body text-[9px] tracking-[0.55em] uppercase mb-4" style={{ color: 'rgba(212,175,55,0.45)' }}>
              What's Coming
            </p>
            <h1 className="font-display text-5xl md:text-7xl text-foreground mb-5">
              Upcoming Music
            </h1>
            <p className="font-body text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
              These are the songs being made right now. Some are in the studio. Some are still becoming themselves.
              When they're ready, you'll be the first to know.
            </p>
            <div className="flex items-center justify-center gap-3 mt-6">
              <div className="w-16 h-px" style={{ background: 'linear-gradient(to right, transparent, rgba(212,175,55,0.3))' }} />
              <Music2 className="w-4 h-4" style={{ color: 'rgba(212,175,55,0.3)' }} />
              <div className="w-16 h-px" style={{ background: 'linear-gradient(to left, transparent, rgba(212,175,55,0.3))' }} />
            </div>
          </motion.div>

          {upcoming.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20 border border-border/20 rounded-2xl"
              style={{ background: 'rgba(212,175,55,0.03)' }}
            >
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border"
                style={{ background: 'rgba(212,175,55,0.08)', borderColor: 'rgba(212,175,55,0.2)' }}>
                <Lock className="w-6 h-6" style={{ color: 'rgba(212,175,55,0.4)' }} />
              </div>
              <p className="font-display text-xl mb-2" style={{ color: 'rgba(212,175,55,0.5)' }}>Under Wraps</p>
              <p className="font-body text-sm text-muted-foreground max-w-sm mx-auto">
                The next chapter is being written. Follow along on socials to be first to hear when something drops.
              </p>
              <div className="flex justify-center gap-4 mt-6">
                <a href="https://www.tiktok.com/@gann0nwaye" target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" size="sm" className="rounded-full font-body text-xs tracking-wider uppercase">
                    TikTok
                  </Button>
                </a>
                <a href="https://www.instagram.com/gann0nwaye" target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" size="sm" className="rounded-full font-body text-xs tracking-wider uppercase">
                    Instagram
                  </Button>
                </a>
              </div>
            </motion.div>
          ) : (
            <div className="space-y-5">
              {upcoming.map((release, i) => {
                const statusCfg = STATUS_LABELS[release.status] || STATUS_LABELS.idea;
                const isPlaying = playing === release.id;
                const hasPreview = !!release.preview_clip_url;

                return (
                  <motion.div
                    key={release.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.08 }}
                    className="rounded-2xl overflow-hidden border"
                    style={{
                      borderColor: 'rgba(212,175,55,0.15)',
                      background: 'rgba(5,10,5,0.7)',
                      backdropFilter: 'blur(12px)',
                    }}
                  >
                    <div className="flex items-center gap-5 p-5">
                      {/* Artwork / play area */}
                      <div className="relative shrink-0 w-20 h-20 rounded-xl overflow-hidden"
                        style={{ border: '1px solid rgba(212,175,55,0.2)', background: 'rgba(212,175,55,0.06)' }}>
                        {getReleaseArtwork(release) ? (
                          <img src={getReleaseArtwork(release)} alt={release.title}
                            className="w-full h-full object-cover"
                            style={{ filter: 'brightness(0.8)' }} />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Music2 className="w-8 h-8" style={{ color: 'rgba(212,175,55,0.3)' }} />
                          </div>
                        )}
                        {hasPreview && (
                          <button
                            onClick={() => togglePlay(release)}
                            className="absolute inset-0 flex items-center justify-center transition-all"
                            style={{ background: isPlaying ? 'rgba(0,0,0,0.5)' : 'rgba(0,0,0,0.3)' }}
                            aria-label={isPlaying ? 'Pause' : 'Play preview'}
                          >
                            {isPlaying
                              ? <Pause className="w-6 h-6 text-white" />
                              : <Play className="w-6 h-6 text-white" />}
                          </button>
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 flex-wrap">
                          <div>
                            <p className="font-display text-lg text-foreground leading-tight">{release.title}</p>
                            <p className="font-body text-xs text-muted-foreground mt-0.5 uppercase tracking-widest">{release.type || 'Single'}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            {release.is_featured_new && (
                              <span className={`font-body text-[9px] tracking-[0.15em] uppercase border rounded-full px-2.5 py-1 ${FEATURED_BADGE.bg} ${FEATURED_BADGE.color}`}>
                                {FEATURED_BADGE.label}
                              </span>
                            )}
                            <span className={`font-body text-[9px] tracking-[0.15em] uppercase border rounded-full px-2.5 py-1 ${statusCfg.bg} ${statusCfg.color}`}>
                              {statusCfg.label}
                            </span>
                          </div>
                        </div>

                        {release.description && (
                          <p className="font-body text-xs text-muted-foreground mt-2 leading-relaxed line-clamp-2">
                            {release.description}
                          </p>
                        )}

                        {release.is_featured_new && (
                          <p className="mt-3 font-body text-[11px] tracking-wider italic" style={{ color: 'rgba(212,175,55,0.6)' }}>
                            Date to be announced very soon
                          </p>
                        )}

                        {hasPreview ? (
                          <button
                            onClick={() => togglePlay(release)}
                            className="mt-3 flex items-center gap-2 font-body text-xs tracking-wider uppercase transition-all"
                            style={{ color: isPlaying ? 'rgba(212,175,55,1)' : 'rgba(212,175,55,0.6)' }}
                          >
                            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                            {isPlaying ? 'Pause Preview' : '30-Second Preview'}
                          </button>
                        ) : (
                          <p className="mt-3 font-body text-[10px] tracking-wider uppercase flex items-center gap-1.5"
                            style={{ color: 'rgba(212,175,55,0.3)' }}>
                            <Lock className="w-3 h-3" /> Full release locked until ready
                          </p>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}

          {/* Email signup CTA */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mt-16 text-center p-8 rounded-2xl border"
            style={{ borderColor: 'rgba(212,175,55,0.15)', background: 'rgba(212,175,55,0.04)' }}
          >
            <p className="font-display text-xl text-foreground mb-2">Be First to Hear It</p>
            <p className="font-body text-sm text-muted-foreground mb-5">
              Join the community and get notified the moment new music drops.
            </p>
            <div className="flex justify-center gap-3 flex-wrap">
              <Link to="/back-this">
                <Button className="rounded-full font-body text-sm tracking-wider uppercase gradient-gold-button border-0">
                  Be Part of This
                </Button>
              </Link>
              <Link to="/music">
                <Button variant="outline" className="rounded-full font-body text-sm tracking-wider uppercase">
                  All Music
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
