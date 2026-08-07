import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Play, ExternalLink, BookOpen, Star, ShoppingBag, Heart, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import BePartOfThisCTA from '@/components/public/BePartOfThisCTA';
import GiftWrapRelease from '@/components/public/GiftWrapRelease';
import ThankYouProjectCTA from '@/components/public/ThankYouProjectCTA';
import ShareButtons from '@/components/public/ShareButtons';
import GoldShards from '@/components/public/GoldShards';
import LyricsModal from '@/components/public/LyricsModal';
import SpotifyPlayer from '@/components/public/SpotifyPlayer';
import MusicRecommendations from '@/components/public/MusicRecommendations';
import TourTracker from '@/components/public/TourTracker';
import FanPlaylists from '@/components/public/FanPlaylists';
import LyricsHighlights from '@/components/public/LyricsHighlights';
import FloatingImage from '@/components/public/FloatingImage';

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
          <Badge className="font-body text-[10px] tracking-widest uppercase bg-primary/20 text-primary">Out Now</Badge>
        </div>
        <h2 className="font-display text-3xl md:text-4xl text-foreground">Thank You</h2>
        <p className="font-body text-sm text-muted-foreground mt-2">5 June 2026</p>
        <p className="font-body text-foreground/60 mt-4 leading-relaxed">
          "Thank You" was written at a turning point, when staying any longer would have meant abandoning himself all over again. This song is not about the pain. It is about the line being drawn. "Thank You" is what it sounds like when you break a cycle and refuse to return to it.
        </p>
        <div className="mt-6 text-xs font-body text-muted-foreground leading-relaxed max-w-sm">
          Out Now · Listen on Spotify, Apple Music, and YouTube
        </div>
      </div>
    </div>
  );
}

const RELEASE_DATE = new Date('2026-06-05T00:00:00+10:00');
const isReleased = () => true;

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

export default function Music() {
  const [lyricsRelease, setLyricsRelease] = useState(null);

  const { data: releases } = useQuery({
    queryKey: ['releases'],
    queryFn: () => base44.entities.Release.list('-release_date'),
    initialData: [],
  });

  const published = [
    // 'Without You Here' — featured new single
    ...(releases.some(r => r.title === 'Without You Here' && r.is_published) ? [] : [{
      id: 'without-you-here-coming-soon',
      title: 'Without You Here',
      type: 'Single',
      status: 'coming_soon',
      is_published: true,
      is_current_single: true,
      is_featured_new: true,
      description: 'Written in the loungeroom, in the early hours of Mother\'s Day, four years after losing his mum. A raw, acoustic letter to Sonia — the voice he still reaches for, the wisdom he still misses, and the love that never left him, even after she did. This is the most honest Gannon has ever been in his music.',
      credits: 'Written & Performed by Gannon Waye · Produced by Will Henderson · Mother\'s Day 2026',
      artwork_url: 'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/e8df43132_ChatGPTImageJun23202603_50_22PM.png',
    }]),
    ...releases.filter(r => r.is_published && (r.title === 'Thank You' || r.title === 'Without You Here')),
  ];

  return (
    <>
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none" aria-hidden>
      <img src="https://media.base44.com/images/public/69eb7905ca6eb4180010f794/4c4319141_image.png" alt="" className="absolute inset-0 w-full h-full object-cover opacity-25" />
      <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-background/75 to-background" />
    </div>
    <div className="min-h-screen py-20 px-4 md:px-6 relative">
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
            <Link to="/lyric-library" className="inline-block ml-2">
              <Button variant="ghost" size="sm" className="rounded-full font-body text-xs tracking-wider uppercase text-muted-foreground hover:text-primary">
                Lyric Library →
              </Button>
            </Link>
            <Link to="/discover" className="inline-block ml-2">
              <Button variant="ghost" size="sm" className="rounded-full font-body text-xs tracking-wider uppercase text-muted-foreground hover:text-primary">
                Discover Music →
              </Button>
            </Link>
          </motion.div>
        </div>

        {published.length === 0 ? (
          /* Safe fallback — shows Thank You even if DB returns empty */
          <ThankYouFallbackCard />
        ) : (
          <div className="space-y-12">
            <LyricsHighlights />
            {/* Released singles — standard card format */}
            {published.filter(r => r.type !== 'album' && r.type !== 'Album' && r.status !== 'idea').map((release, i) => (
              <motion.div
                key={release.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="group grid grid-cols-1 md:grid-cols-[280px_1fr] gap-0 bg-card border border-border/40 rounded-2xl overflow-hidden hover:border-primary/30 transition-all duration-500"
              >
                <div className="aspect-square md:aspect-auto md:h-full bg-secondary/50 overflow-hidden relative">
                  {release.title === 'Thank You' || release.artwork_url ? (
                    <img
                      src={release.title === 'Thank You' ? THANK_YOU_COVER : release.artwork_url}
                      alt={release.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Play className="w-16 h-16 text-muted-foreground/20" />
                    </div>
                  )}
                  <div className="absolute inset-0 pointer-events-none" style={{ boxShadow: 'inset 0 0 60px rgba(0,0,0,0.25)' }} />
                </div>
                <div className="p-5 md:p-8 flex flex-col justify-center">
                  <div className="flex items-center gap-3 mb-2">
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
                      release.status === 'released' ? 'bg-primary/20 text-primary' : 
                      release.status === 'recording' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                      release.status === 'coming_soon' ? 'bg-primary/20 text-primary border border-primary/30' :
                      'bg-secondary text-muted-foreground'
                    }`}>
                      {(release.status === 'recording' || release.status === 'coming_soon') && (
                        <span className="relative flex h-1.5 w-1.5">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-primary"></span>
                        </span>
                      )}
                      {STATUS_LABELS[release.status] || release.status}
                    </Badge>
                  </div>
                  <h2 className="font-display text-3xl md:text-4xl text-foreground">{release.title}</h2>
                  {release.release_date && release.status === 'released' && (
                    <p className="font-body text-sm text-muted-foreground mt-2">
                      {new Date(release.release_date).toLocaleDateString('en-AU', { month: 'long', day: 'numeric', year: 'numeric' })}
                    </p>
                  )}
                  {release.status === 'coming_soon' && (
                    <p className="font-body text-sm text-primary mt-2 italic">Date to be announced very soon</p>
                  )}
                  {release.description && (
                    <p className="font-body text-foreground/60 mt-4 leading-relaxed">
                      {release.title === 'Thank You'
                        ? '"Thank You" was written at a turning point, when staying any longer would have meant abandoning himself all over again. There was a growing awareness that what he was experiencing was not new. It felt familiar in a way that traced back much further, to patterns already fought hard to outgrow. This song is not about the pain. It is about the line being drawn. It is the moment of choosing self-respect over repetition. "Thank You" is what it sounds like when you break a cycle and refuse to return to it.'
                        : release.title === 'Without You Here'
                        ? '"Without You Here" was written in the loungeroom, in the early hours of Mother\'s Day, four years after losing his mum. A raw, acoustic letter to Sonia — the voice he still reaches for, the wisdom he still misses, and the love that never left him, even after she did. This is the most honest Gannon has ever been in his music.'
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
                    {release.status === 'coming_soon' ? (
                      <div className="text-xs font-body text-primary leading-relaxed max-w-sm italic">
                        Coming Soon · Date to be announced very soon
                      </div>
                    ) : isReleased() && release.spotify_link ? (
                      <a href={release.spotify_link} target="_blank" rel="noopener noreferrer">
                        <Button size="sm" className="rounded-full gap-2 font-body text-xs gradient-gold-button border-0">
                          🎧 Spotify <ExternalLink className="w-3 h-3" />
                        </Button>
                      </a>
                    ) : (
                      <div className="text-xs font-body text-muted-foreground leading-relaxed max-w-sm">
                        Out Now · Listen on Spotify, Apple Music, and YouTube
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

                     {/* Add to Your World — conversion CTAs */}
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

                     {/* Spotify Embed Player */}
                     {release.status !== 'coming_soon' && isReleased() && (release.spotify_link || release.title === 'Thank You') && (
                     <div className="mt-6">
                      <SpotifyPlayer
                        spotifyLink={release.spotify_link}
                        fallbackUrl={release.title === 'Thank You' ? 'https://open.spotify.com/album/36qMYfzzJrq2j039l9Ex66' : null}
                        height={152}
                      />
                     </div>
                     )}
                </div>
                </motion.div>
                ))}


                </div>
                )}

        {/* What's Next? — upcoming releases */}
        {published.filter(r => r.status !== 'released').length > 0 && (
          <div className="mt-16">
            <p className="font-body text-xs tracking-[0.3em] uppercase gradient-gold-glow text-center mb-2">What's Next?</p>
            <h3 className="font-display text-2xl md:text-3xl text-foreground text-center mb-8">On the way</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {published.filter(r => r.status !== 'released').map((r, i) => (
                <FloatingImage key={r.id} amplitude={5} duration={5} delay={i * 0.4}>
                  <div className="relative group">
                    <div className="aspect-square rounded-2xl overflow-hidden border border-primary/30 relative" style={{ boxShadow: '0 0 40px rgba(212,175,55,0.08)' }}>
                      {r.artwork_url ? (
                        <img src={r.artwork_url} alt={r.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      ) : (
                        <div className="w-full h-full bg-secondary/40 flex items-center justify-center">
                          <span className="font-display text-6xl gradient-gold-glow">?</span>
                        </div>
                      )}
                      <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-background/70 backdrop-blur-sm border border-primary/30">
                        <p className="font-body text-[9px] tracking-[0.2em] uppercase text-primary">Coming Soon</p>
                      </div>
                    </div>
                    <h4 className="font-display text-lg text-foreground mt-3 italic">{r.title}</h4>
                    {r.release_date && <p className="font-body text-xs text-muted-foreground">{new Date(r.release_date).toLocaleDateString('en-AU', { month: 'long', year: 'numeric' })}</p>}
                    {!r.release_date && <p className="font-body text-xs text-primary/60 italic">Date to be announced</p>}
                  </div>
                </FloatingImage>
              ))}
            </div>
          </div>
        )}

        <div className="flex justify-center mt-10 mb-4">
          <ShareButtons url="https://gannonwaye.com/music" text="Gannon Waye — debut single 'Thank You' out now." />
        </div>
        <BePartOfThisCTA context="If this music means something to you, you can help make more of it happen." />
        <div className="mt-12">
          <ThankYouProjectCTA context="Support the Thank You Project — help fund more music, build the community, and keep independent art alive. 10% of all support goes to 1800RESPECT." />
        </div>
      </div>

      {/* Fan Playlists */}
      <FanPlaylists />

      {/* Tour Dates */}
      <TourTracker />

      {/* Music Recommendations */}
      <div className="max-w-5xl mx-auto">
        <MusicRecommendations />
      </div>
      {lyricsRelease && <LyricsModal release={lyricsRelease} onClose={() => setLyricsRelease(null)} />}
    </div>
    </>
  );
}