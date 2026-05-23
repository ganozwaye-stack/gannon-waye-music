import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Play, ExternalLink, Music2, BookOpen, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import BePartOfThisCTA from '@/components/public/BePartOfThisCTA';
import ShareButtons from '@/components/public/ShareButtons';
import GoldShards from '@/components/public/GoldShards';
import LyricsModal from '@/components/public/LyricsModal';

// Clean gold glow banner — blends into dark background on Music page
const THANK_YOU_BANNER_URL = 'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/f63708f24_b3199b8b-5027-40bd-9c7e-d244defa613b.png';

const THANK_YOU_COVER = 'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/6dde7d697_2.jpg';

function ThankYouFallbackCard() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-[260px_1fr] gap-0 bg-card border border-border/40 rounded-2xl overflow-hidden">
      <div className="aspect-square md:aspect-auto md:h-full bg-secondary/50 overflow-hidden">
        <img src={THANK_YOU_COVER} alt="Thank You — Gannon Waye" className="w-full h-full object-cover" />
      </div>
      <div className="p-5 md:p-8 flex flex-col justify-center">
        <div className="flex items-center gap-3 mb-2">
          <Badge variant="outline" className="font-body text-[10px] tracking-widest uppercase border-primary/30 text-primary">Single</Badge>
          <Badge className="font-body text-[10px] tracking-widest uppercase bg-secondary text-muted-foreground">Coming Soon</Badge>
        </div>
        <h2 className="font-display text-3xl md:text-4xl text-foreground">Thank You</h2>
        <p className="font-body text-sm text-muted-foreground mt-2">5 June 2026</p>
        <p className="font-body text-foreground/60 mt-4 leading-relaxed">
          "Thank You" was written at a turning point, when staying any longer would have meant abandoning himself all over again. This song is not about the pain. It is about the line being drawn. "Thank You" is what it sounds like when you break a cycle and refuse to return to it.
        </p>
        <div className="mt-6 text-xs font-body text-muted-foreground leading-relaxed max-w-sm">
          Available on all leading platforms from 05 June 2026, including Spotify, Apple Music, YouTube Music, Amazon Music, TikTok, Instagram/Facebook Reels, TIDAL and more.
        </div>
      </div>
    </div>
  );
}

const RELEASE_DATE = new Date('2026-06-05T00:00:00+10:00');
const isReleased = () => new Date() >= RELEASE_DATE;

const STATUS_LABELS = {
  idea: 'In the works',
  writing: 'Writing',
  pre_production: 'Pre-Production',
  recording: 'Recording',
  mixing: 'Mixing',
  mastering: 'Mastering',
  ready: 'Coming Soon',
  released: 'Out 5 June 2026',
};

export default function Music() {
  const [lyricsRelease, setLyricsRelease] = useState(null);

  const { data: releases } = useQuery({
    queryKey: ['releases'],
    queryFn: () => base44.entities.Release.list('-release_date'),
    initialData: [],
  });

  const published = releases.filter(r => r.is_published);

  return (
    <div className="min-h-screen py-20 px-4 md:px-6">
      <div className="max-w-5xl mx-auto">
        {/* Music hero with gold shards + optional banner */}
        <div className="relative text-center mb-16 py-4">
          <GoldShards className="rounded-3xl" />
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative z-10"
          >
            <p className="font-body text-xs tracking-[0.3em] uppercase gradient-gold-glow mb-4">Discography</p>
            <h1 className="font-display text-4xl md:text-6xl text-foreground">Music</h1>
            {THANK_YOU_BANNER_URL && (
              <motion.div
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="mt-8 max-w-3xl mx-auto relative overflow-hidden"
              >
                <img
                  src={THANK_YOU_BANNER_URL}
                  alt="Thank You — Gannon Waye · 05 June 2026"
                  className="w-full object-cover rounded-2xl"
                  style={{ maxHeight: 280 }}
                />
                {/* Fade all four edges into the background */}
                <div className="absolute inset-0 rounded-2xl" style={{
                  background: 'linear-gradient(to bottom, hsl(220,15%,6%) 0%, transparent 18%, transparent 72%, hsl(220,15%,6%) 100%)'
                }} />
                <div className="absolute inset-0 rounded-2xl" style={{
                  background: 'linear-gradient(to right, hsl(220,15%,6%) 0%, transparent 15%, transparent 85%, hsl(220,15%,6%) 100%)'
                }} />
              </motion.div>
            )}
            <Link to="/lyrics" className="inline-block mt-5">
              <Button variant="outline" size="sm" className="rounded-full font-body text-xs tracking-wider uppercase border-primary/30 text-primary hover:bg-primary/10">
                Read Lyrics →
              </Button>
            </Link>
          </motion.div>
        </div>

        {published.length === 0 ? (
          /* Safe fallback — shows Thank You even if DB returns empty */
          <ThankYouFallbackCard />
        ) : (
          <div className="space-y-12">
            {published.map((release, i) => (
              <motion.div
                key={release.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="grid grid-cols-1 md:grid-cols-[260px_1fr] gap-0 bg-card border border-border/40 rounded-2xl overflow-hidden hover:border-primary/20 transition-all"
              >
                <div className="aspect-square md:aspect-auto md:h-full bg-secondary/50 overflow-hidden">
                  {release.title === 'Thank You' || release.artwork_url ? (
                    <img
                      src={release.title === 'Thank You' ? THANK_YOU_COVER : release.artwork_url}
                      alt={release.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Play className="w-16 h-16 text-muted-foreground/20" />
                    </div>
                  )}
                </div>
                <div className="p-5 md:p-8 flex flex-col justify-center">
                  <div className="flex items-center gap-3 mb-2">
                    <Badge variant="outline" className="font-body text-[10px] tracking-widest uppercase border-primary/30 text-primary">
                      {release.type}
                    </Badge>
                    <Badge className={`font-body text-[10px] tracking-widest uppercase ${
                      release.status === 'released' ? 'bg-primary/20 text-primary' : 'bg-secondary text-muted-foreground'
                    }`}>
                      {STATUS_LABELS[release.status] || release.status}
                    </Badge>
                  </div>
                  <h2 className="font-display text-3xl md:text-4xl text-foreground">{release.title}</h2>
                  {release.release_date && release.status === 'released' && (
                    <p className="font-body text-sm text-muted-foreground mt-2">
                      {new Date(release.release_date).toLocaleDateString('en-AU', { month: 'long', day: 'numeric', year: 'numeric' })}
                    </p>
                  )}
                  {release.description && (
                    <p className="font-body text-foreground/60 mt-4 leading-relaxed">
                      {release.title === 'Thank You'
                        ? '"Thank You" was written at a turning point, when staying any longer would have meant abandoning himself all over again. There was a growing awareness that what he was experiencing was not new. It felt familiar in a way that traced back much further, to patterns already fought hard to outgrow. This song is not about the pain. It is about the line being drawn. It is the moment of choosing self respect over repetition. "Thank You" is what it sounds like when you break a cycle and refuse to return to it.'
                        : release.description}
                    </p>
                  )}
                  {release.credits && (
                    <p className="font-body text-xs text-muted-foreground mt-3">{release.credits}</p>
                  )}

                  {/* Lyrics + Current Single buttons */}
                  <div className="flex flex-wrap gap-2 mt-4 mb-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="rounded-full gap-1.5 font-body text-xs tracking-wider uppercase border-primary/30 text-primary hover:bg-primary/10 cursor-pointer"
                      onClick={() => setLyricsRelease(release)}
                    >
                      <BookOpen className="w-3 h-3" />Lyrics
                    </Button>
                    {release.is_current_single && (
                      <Link to="/current-single">
                        <Button size="sm" variant="outline" className="rounded-full gap-1.5 font-body text-xs tracking-wider uppercase border-primary/20 text-primary hover:bg-primary/10">
                          <Star className="w-3 h-3" />Current Single Page
                        </Button>
                      </Link>
                    )}
                  </div>

                  {/* Streaming Links */}
                  <div className="flex flex-wrap gap-3 mt-6">
                    {isReleased() && release.spotify_link ? (
                      <a href={release.spotify_link} target="_blank" rel="noopener noreferrer">
                        <Button size="sm" className="rounded-full gap-2 font-body text-xs gradient-gold-button border-0">
                          🎧 Spotify <ExternalLink className="w-3 h-3" />
                        </Button>
                      </a>
                    ) : (
                      <div className="text-xs font-body text-muted-foreground leading-relaxed max-w-sm">
                        Available on all leading platforms from 05 June 2026, including Spotify, Apple Music, YouTube Music, Amazon Music, TikTok, Instagram/Facebook Reels, TIDAL and more.
                      </div>
                    )}
                     {isReleased() && release.apple_music_link && (
                       <a href={release.apple_music_link} target="_blank" rel="noopener noreferrer">
                         <Button size="sm" className="rounded-full gap-2 font-body text-xs gradient-gold-button border-0">
                           🍎 Apple Music <ExternalLink className="w-3 h-3" />
                         </Button>
                       </a>
                     )}
                     {isReleased() && release.youtube_link && (
                       <a href={release.youtube_link} target="_blank" rel="noopener noreferrer">
                         <Button size="sm" className="rounded-full gap-2 font-body text-xs gradient-gold-button border-0">
                           ▶️ YouTube <ExternalLink className="w-3 h-3" />
                         </Button>
                       </a>
                     )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        <div className="flex justify-center mt-10 mb-4">
          <ShareButtons url="https://gannonwaye.com/music" text="Gannon Waye — debut single 'Thank You' coming soon." />
        </div>
        <BePartOfThisCTA context="If this music means something to you, you can help make more of it happen." />
      </div>
      {lyricsRelease && <LyricsModal release={lyricsRelease} onClose={() => setLyricsRelease(null)} />}
    </div>
  );
}