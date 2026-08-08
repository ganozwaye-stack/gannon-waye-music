import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import BePartOfThisCTA from '@/components/public/BePartOfThisCTA';
import ThankYouProjectCTA from '@/components/public/ThankYouProjectCTA';
import ShareButtons from '@/components/public/ShareButtons';
import GoldShards from '@/components/public/GoldShards';
import LyricsModal from '@/components/public/LyricsModal';
import MusicRecommendations from '@/components/public/MusicRecommendations';
import TourTracker from '@/components/public/TourTracker';
import FanPlaylists from '@/components/public/FanPlaylists';
import LyricsHighlights from '@/components/public/LyricsHighlights';
import FloatingImage from '@/components/public/FloatingImage';
import TiltCard from '@/components/public/TiltCard';
import MagneticButton from '@/components/public/MagneticButton';
import WrappedReleaseCard from '@/components/public/WrappedReleaseCard';

// Official Thank You cover art, used by the empty-state fallback only.
// Live cards pull artwork_url from the database, the single source of truth.
const THANK_YOU_COVER = 'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/af70e9d80_image.png';

function ThankYouFallbackCard() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-[260px_1fr] gap-0 bg-card border border-border/40 rounded-2xl overflow-hidden">
      <div className="aspect-square md:aspect-auto md:h-full bg-secondary/50 overflow-hidden">
        <img src={THANK_YOU_COVER} alt="Thank You, Gannon Waye" className="w-full h-full object-cover" />
      </div>
      <div className="p-5 md:p-8 flex flex-col justify-center">
        <div className="flex items-center gap-3 mb-2">
          <span className="font-body text-[10px] tracking-widest uppercase border border-primary/30 text-primary px-2 py-0.5 rounded-full">Single</span>
          <span className="font-body text-[10px] tracking-widest uppercase bg-primary/20 text-primary px-2 py-0.5 rounded-full">Out Now</span>
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

// Upcoming roadmap, placeholder entries so fans see what's coming
const UPCOMING_ROADMAP = [
  { title: "I'm Still Here", type: 'Album', note: 'Debut Album · 15 songs · 2027' },
  { title: 'Set Free', type: 'Single', note: 'Breaking spiritual and personal captivity' },
  { title: 'Will You Even Listen', type: 'Single', note: 'Speaking truth to deaf ears' },
  { title: 'Because of You', type: 'Single', note: 'Coming soon' },
];

export default function Music() {
  const [lyricsRelease, setLyricsRelease] = useState(null);

  const { data: releases } = useQuery({
    queryKey: ['releases'],
    queryFn: () => base44.entities.Release.list('-release_date'),
    initialData: [],
  });

  const published = [
    // 'Without You Here', featured new single
    ...(releases.some(r => r.title === 'Without You Here' && r.is_published) ? [] : [{
      id: 'without-you-here-coming-soon',
      title: 'Without You Here',
      type: 'Single',
      status: 'coming_soon',
      is_published: true,
      is_current_single: true,
      is_featured_new: true,
      description: 'Written in the loungeroom, in the early hours of Mother\'s Day, four years after losing his mum. A raw, acoustic letter to Sonia, the voice he still reaches for, the wisdom he still misses, and the love that never left him, even after she did. This is the most honest Gannon has ever been in his music.',
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
        {/* Music hero with gold shards */}
        <div className="relative text-center mb-16 py-4">
          <GoldShards className="rounded-3xl" />
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative z-10"
          >
            <p className="font-body text-xs tracking-[0.3em] uppercase gradient-gold-glow mb-4">Discography</p>
            <h1 className="font-display text-4xl md:text-6xl text-foreground">Music</h1>
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="mt-8 max-w-3xl mx-auto relative overflow-hidden rounded-2xl border border-primary/20"
            >
              <div className="aspect-[16/7] relative">
                <img
                  src="https://media.base44.com/images/public/69eb7905ca6eb4180010f794/e8df43132_ChatGPTImageJun23202603_50_22PM.png"
                  alt="Without You Here, Gannon Waye, Coming Soon"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-background/20" />
                <div className="absolute bottom-0 left-0 right-0 p-6 text-center">
                  <p className="font-body text-[10px] tracking-[0.4em] uppercase text-primary/80 mb-2">The New Single · A Film For Mum</p>
                  <h2 className="font-display text-3xl md:text-4xl gradient-gold-glow italic">Without You Here</h2>
                  <p className="font-body text-xs text-foreground/60 mt-2 italic">Coming Soon · Date to be announced very soon</p>
                </div>
              </div>
            </motion.div>
            <MagneticButton className="inline-block">
            <Link to="/lyrics" className="inline-block mt-5">
              <Button variant="outline" size="sm" className="rounded-full font-body text-xs tracking-wider uppercase border-primary/30 text-primary hover:bg-primary/10">
                Read Lyrics →
              </Button>
            </Link>
            </MagneticButton>
            <MagneticButton className="inline-block">
            <Link to="/lyric-library" className="inline-block ml-2">
              <Button variant="ghost" size="sm" className="rounded-full font-body text-xs tracking-wider uppercase text-muted-foreground hover:text-primary">
                Lyric Library →
              </Button>
            </Link>
            </MagneticButton>
            <MagneticButton className="inline-block">
            <Link to="/discover" className="inline-block ml-2">
              <Button variant="ghost" size="sm" className="rounded-full font-body text-xs tracking-wider uppercase text-muted-foreground hover:text-primary">
                Discover Music →
              </Button>
            </Link>
            </MagneticButton>
          </motion.div>
        </div>

        {published.length === 0 ? (
          /* Safe fallback, shows Thank You even if DB returns empty */
          <ThankYouFallbackCard />
        ) : (
          <div className="space-y-12">
            <LyricsHighlights />
            {/* Released singles, wrapped in gannonwaye.com gift-wrap */}
            {published.filter(r => r.type !== 'album' && r.type !== 'Album' && r.status !== 'idea').map((release, i) => (
              <WrappedReleaseCard key={release.id} release={release} index={i} onOpenLyrics={() => setLyricsRelease(release)} />
            ))}
          </div>
        )}

        {/* What's Next?, upcoming releases with placeholder album art */}
        <div className="mt-16">
          <p className="font-body text-xs tracking-[0.3em] uppercase gradient-gold-glow text-center mb-2">What's Next?</p>
          <h3 className="font-display text-2xl md:text-3xl text-foreground text-center mb-2">On the way</h3>
          <p className="font-body text-sm text-muted-foreground text-center mb-8 max-w-xl mx-auto">A first look at the music coming next, leading toward the debut album <em>I'm Still Here</em>.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {published.filter(r => r.status !== 'released').map((r, i) => (
              <FloatingImage key={r.id} amplitude={4} duration={5} delay={i * 0.3}>
                <TiltCard max={5} className="rounded-2xl">
                  <div className="aspect-square rounded-2xl overflow-hidden border border-primary/30 relative" style={{ boxShadow: '0 0 40px rgba(212,175,55,0.08)' }}>
                    {r.artwork_url ? (
                      <img src={r.artwork_url} alt={r.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-secondary/40 flex items-center justify-center">
                        <span className="font-display text-6xl gradient-gold-glow">?</span>
                      </div>
                    )}
                    <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-background/70 backdrop-blur-sm border border-primary/30">
                      <p className="font-body text-[9px] tracking-[0.2em] uppercase text-primary">Coming Soon</p>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-background/90 to-transparent">
                      <h4 className="font-display text-lg text-foreground italic">{r.title}</h4>
                      <p className="font-body text-xs text-primary/60 italic">Date to be announced</p>
                    </div>
                  </div>
                </TiltCard>
              </FloatingImage>
            ))}
            {UPCOMING_ROADMAP.map((item, i) => (
              <FloatingImage key={item.title} amplitude={4} duration={5} delay={(i + 1) * 0.3}>
                <TiltCard max={5} className="rounded-2xl">
                  <div className="aspect-square rounded-2xl overflow-hidden border border-primary/30 relative flex items-center justify-center text-center p-6"
                    style={{ background: 'radial-gradient(ellipse at 50% 40%, rgba(245,208,110,0.18), rgba(20,18,12,0.6))', boxShadow: '0 0 40px rgba(212,175,55,0.08)' }}>
                    <div>
                      <p className="font-body text-[9px] tracking-[0.3em] uppercase text-primary/70 mb-3">{item.type}</p>
                      <h4 className="font-display text-2xl gradient-gold-glow italic leading-tight">{item.title}</h4>
                      <p className="font-body text-[10px] text-muted-foreground mt-3 italic">{item.note}</p>
                    </div>
                    <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-background/70 backdrop-blur-sm border border-primary/30">
                      <p className="font-body text-[9px] tracking-[0.2em] uppercase text-primary">Coming</p>
                    </div>
                  </div>
                </TiltCard>
              </FloatingImage>
            ))}
          </div>
        </div>

        <div className="flex justify-center mt-10 mb-4">
          <ShareButtons url="https://gannonwaye.com/music" text="Gannon Waye, debut single 'Thank You' out now." />
        </div>
        <BePartOfThisCTA context="If this music means something to you, you can help make more of it happen." />
        <div className="mt-12">
          <ThankYouProjectCTA context="Support the Thank You Project: help fund more music, build the community, and keep independent art alive. 10% of all support goes to 1800RESPECT." />
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