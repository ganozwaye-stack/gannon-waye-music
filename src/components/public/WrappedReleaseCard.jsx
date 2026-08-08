import React from 'react';
import { motion } from 'framer-motion';
import { Play, ExternalLink, BookOpen, Star, ShoppingBag, Heart, FileText, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import TiltCard from '@/components/public/TiltCard';
import SpotifyPlayer from '@/components/public/SpotifyPlayer';

const STATUS_LABELS = {
  idea: 'In the works',
  writing: 'Writing',
  pre_production: 'Pre-Production',
  recording: 'RECORDING NOW',
  mixing: 'Mixing',
  mastering: 'Mastering',
  ready: 'Out Now',
  released: 'Out Now',
  coming_soon: 'Coming Soon',
};

const THANK_YOU_DESC = '"Thank You" was written at a turning point, when staying any longer would have meant abandoning himself all over again. There was a growing awareness that what he was experiencing was not new. It felt familiar in a way that traced back much further, to patterns already fought hard to outgrow. This song is not about the pain. It is about the line being drawn. It is the moment of choosing self-respect over repetition. "Thank You" is what it sounds like when you break a cycle and refuse to return to it.';

const WYH_DESC = '"Without You Here" was written in the loungeroom, in the early hours of Mother\'s Day, four years after losing his mum. A raw, acoustic letter to Sonia, the voice he still reaches for, the wisdom he still misses, and the love that never left him, even after she did. This is the most honest Gannon has ever been in his music.';

function descriptionFor(release) {
  if (release.title === 'Thank You') return THANK_YOU_DESC;
  if (release.title === 'Without You Here') return WYH_DESC;
  return release.description;
}

// A released single, wrapped in a modernised gannonwaye.com gift-wrap aesthetic.
// Layout kept intact: artwork left, metadata and action buttons right.
export default function WrappedReleaseCard({ release, index = 0, onOpenLyrics }) {
  const isComingSoon = release.status === 'coming_soon';
  const isReleased = release.status === 'released';

  return (
    <TiltCard max={4} className="rounded-2xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: index * 0.1 }}
        className="group relative rounded-2xl p-[1px]"
        style={{ background: 'linear-gradient(135deg, rgba(212,175,55,0.55) 0%, rgba(245,208,110,0.12) 38%, rgba(212,175,55,0.04) 60%, rgba(245,208,110,0.5) 100%)' }}
      >
        <div className="relative rounded-2xl overflow-hidden" style={{ background: 'linear-gradient(160deg, #14130f 0%, #0f0f0f 100%)' }}>
          {/* Wrapping-paper texture */}
          <div className="absolute inset-0 rounded-2xl pointer-events-none opacity-[0.05]" style={{ backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 22px, rgba(212,175,55,0.5) 22px, rgba(212,175,55,0.5) 44px)' }} />
          {/* Vertical gift ribbon, left edge */}
          <div className="absolute left-0 top-0 bottom-0 w-[6px] pointer-events-none" style={{ background: 'linear-gradient(180deg, rgba(212,175,55,0.7), rgba(245,208,110,0.32), rgba(212,175,55,0.7))', boxShadow: '0 0 14px rgba(212,175,55,0.18)' }} />
          {/* Top gift ribbon */}
          <div className="absolute top-0 left-0 right-0 h-[6px] pointer-events-none" style={{ background: 'linear-gradient(90deg, rgba(212,175,55,0.7), rgba(245,208,110,0.32), rgba(212,175,55,0.7))', boxShadow: '0 0 14px rgba(212,175,55,0.18)' }} />
          {/* Corner fold accent, top-right */}
          <div className="absolute top-0 right-0 w-10 h-10 pointer-events-none" style={{ background: 'linear-gradient(225deg, rgba(245,208,110,0.35) 0%, rgba(245,208,110,0.35) 48%, transparent 52%)' }} />

          <div className="relative grid grid-cols-1 md:grid-cols-[280px_1fr] gap-0">
            {/* Artwork */}
            <div className="aspect-square md:aspect-auto md:h-full bg-secondary/40 overflow-hidden relative">
              {release.artwork_url ? (
                <img src={release.artwork_url} alt={release.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Play className="w-16 h-16 text-muted-foreground/20" />
                </div>
              )}
              <div className="absolute inset-0 pointer-events-none" style={{ boxShadow: 'inset 0 0 60px rgba(0,0,0,0.25)' }} />
              {/* Gift tag */}
              <div className="absolute top-3 left-3 px-3 py-1 rounded-full backdrop-blur-sm" style={{ background: 'rgba(8,8,14,0.6)', border: '1px solid rgba(245,208,110,0.4)' }}>
                <p className="font-body text-[9px] tracking-[0.25em] uppercase text-primary/80">{release.type || 'Single'}</p>
              </div>
            </div>

            {/* Metadata */}
            <div className="p-5 md:p-8 flex flex-col justify-center">
              <div className="flex items-center gap-3 mb-2 flex-wrap">
                {release.is_featured_new && (
                  <Badge className="font-body text-[10px] tracking-widest uppercase gradient-gold-button border-0 flex items-center gap-1.5">
                    <span className="relative flex h-1.5 w-1.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-foreground opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-primary-foreground"></span>
                    </span>
                    New Single
                  </Badge>
                )}
                <Badge variant="outline" className="font-body text-[10px] tracking-widest uppercase border-primary/30 text-primary">
                  {release.type}
                </Badge>
                <Badge className={`font-body text-[10px] tracking-widest uppercase flex items-center gap-1.5 ${
                  isReleased ? 'bg-primary/20 text-primary' :
                  isComingSoon ? 'bg-primary/20 text-primary border border-primary/30' :
                  release.status === 'recording' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                  'bg-secondary text-muted-foreground'
                }`}>
                  {(release.status === 'recording' || isComingSoon) && (
                    <span className="relative flex h-1.5 w-1.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-primary"></span>
                    </span>
                  )}
                  {STATUS_LABELS[release.status] || release.status}
                </Badge>
              </div>

              <div className="flex items-center gap-2 mb-1">
                <Sparkles className="w-4 h-4 text-primary/60" style={{ filter: 'drop-shadow(0 0 6px rgba(212,175,55,0.4))' }} />
                <h2 className="font-display text-3xl md:text-4xl text-foreground">{release.title}</h2>
              </div>

              {release.release_date && isReleased && (
                <p className="font-body text-sm text-muted-foreground mt-1">
                  {new Date(release.release_date).toLocaleDateString('en-AU', { month: 'long', day: 'numeric', year: 'numeric' })}
                </p>
              )}
              {isComingSoon && (
                <p className="font-body text-sm text-primary mt-1 italic">Date to be announced very soon</p>
              )}

              <p className="font-body text-foreground/60 mt-4 leading-relaxed">{descriptionFor(release)}</p>

              {release.credits && (
                <p className="font-body text-xs text-muted-foreground mt-3">{release.credits}</p>
              )}

              {/* Lyrics and Current Single */}
              <div className="flex flex-wrap gap-2 mt-4 mb-2">
                <Button size="sm" variant="outline" className="rounded-full gap-1.5 font-body text-xs tracking-wider uppercase border-primary/30 text-primary hover:bg-primary/10 cursor-pointer" onClick={onOpenLyrics}>
                  <BookOpen className="w-3 h-3" /> Lyrics
                </Button>
                {release.is_current_single && (
                  <Link to="/current-single">
                    <Button size="sm" variant="outline" className="rounded-full gap-1.5 font-body text-xs tracking-wider uppercase border-primary/20 text-primary hover:bg-primary/10">
                      <Star className="w-3 h-3" /> Current Single Page
                    </Button>
                  </Link>
                )}
              </div>

              {/* Streaming links */}
              <div className="flex flex-wrap gap-3 mt-6">
                {isComingSoon ? (
                  <div className="text-xs font-body text-primary leading-relaxed max-w-sm italic">Coming Soon · Date to be announced very soon</div>
                ) : isReleased && release.spotify_link ? (
                  <a href={release.spotify_link} target="_blank" rel="noopener noreferrer">
                    <Button size="sm" className="rounded-full gap-2 font-body text-xs gradient-gold-button border-0">🎧 Spotify <ExternalLink className="w-3 h-3" /></Button>
                  </a>
                ) : (
                  <div className="text-xs font-body text-muted-foreground leading-relaxed max-w-sm">Out Now · Listen on Spotify, Apple Music, and YouTube</div>
                )}
                {isReleased && release.apple_music_link && (
                  <a href={release.apple_music_link} target="_blank" rel="noopener noreferrer">
                    <Button size="sm" className="rounded-full gap-2 font-body text-xs gradient-gold-button border-0">🍎 Apple Music <ExternalLink className="w-3 h-3" /></Button>
                  </a>
                )}
                {isReleased && release.youtube_link && (
                  <a href={release.youtube_link} target="_blank" rel="noopener noreferrer">
                    <Button size="sm" className="rounded-full gap-2 font-body text-xs gradient-gold-button border-0">▶️ YouTube <ExternalLink className="w-3 h-3" /></Button>
                  </a>
                )}
              </div>

              {/* Action bar */}
              <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-border/30">
                <Link to="/store" className="flex-1 min-w-[130px]">
                  <Button size="sm" variant="outline" className="w-full rounded-full gap-1.5 font-body text-xs tracking-wider uppercase border-border/40 hover:border-primary/40">
                    <ShoppingBag className="w-3 h-3" /> Claim Your Copy
                  </Button>
                </Link>
                <Link to="/back-this" className="flex-1 min-w-[130px]">
                  <Button size="sm" variant="outline" className="w-full rounded-full gap-1.5 font-body text-xs tracking-wider uppercase border-border/40 hover:border-primary/40">
                    <Heart className="w-3 h-3" /> Stand With Me
                  </Button>
                </Link>
                <Link to="/lyrics" className="flex-1 min-w-[130px]">
                  <Button size="sm" variant="outline" className="w-full rounded-full gap-1.5 font-body text-xs tracking-wider uppercase border-border/40 hover:border-primary/40">
                    <FileText className="w-3 h-3" /> Read the Lyrics
                  </Button>
                </Link>
              </div>

              {/* Spotify embed */}
              {!isComingSoon && isReleased && (release.spotify_link || release.title === 'Thank You') && (
                <div className="mt-6">
                  <SpotifyPlayer spotifyLink={release.spotify_link} fallbackUrl={release.title === 'Thank You' ? 'https://open.spotify.com/album/36qMYfzzJrq2j039l9Ex66' : null} height={152} />
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </TiltCard>
  );
}