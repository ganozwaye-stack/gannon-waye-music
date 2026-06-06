import { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Play, ExternalLink, BookOpen, ShoppingBag, ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import ShareButtons from '@/components/public/ShareButtons';
import LyricsModal from '@/components/public/LyricsModal';
import FanReviewSection from '@/components/public/FanReviewSection';
import FanCommentSection from '@/components/public/FanCommentSection';
import { localReleases } from '@/lib/localReleases';


const THANK_YOU_COVER = 'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/6dde7d697_2.jpg';

const FALLBACK_SINGLE = {
  id: 'thank-you-fallback',
  title: 'Thank You',
  type: 'single',
  status: 'ready',
  release_date: '2026-06-05',
  artwork_url: THANK_YOU_COVER,
  description: '"Thank You" was written at a turning point, when staying any longer would have meant abandoning himself all over again.',
  current_single_hero_copy: '"Thank You" — the debut single from Gannon Waye. Out 5 June 2026.',
  current_single_behind_story: 'This song was written at a turning point — when staying any longer would have meant abandoning himself all over again. There was a growing awareness that what he was experiencing was not new. It felt familiar in a way that traced back much further, to patterns already fought hard to outgrow.\n\nThis song is not about the pain. It is about the line being drawn. It is the moment of choosing self-respect over repetition. "Thank You" is what it sounds like when you break a cycle and refuse to return to it.',
  credits: null,
  youtube_video_id: null,
  youtube_link: null,
  spotify_link: null,
  apple_music_link: null,
  is_published: true,
};

function YouTubeEmbed({ videoId, fallbackUrl }) {
  const [failed, setFailed] = useState(false);
  if (!videoId && !fallbackUrl) {
    return (
      <div className="aspect-video bg-secondary/30 rounded-2xl flex items-center justify-center border border-border/40">
        <div className="text-center">
          <Play className="w-12 h-12 text-muted-foreground/20 mx-auto mb-2" />
          <p className="font-body text-sm text-muted-foreground">Music video coming soon.</p>
        </div>
      </div>
    );
  }
  if (videoId && !failed) {
    return (
      <div className="relative w-full aspect-video rounded-2xl overflow-hidden border border-border/40">
        <iframe
          src={`https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`}
          title="Music Video"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 w-full h-full"
          onError={() => setFailed(true)}
        />
      </div>
    );
  }
  // Fallback link
  return (
    <div className="aspect-video bg-secondary/30 rounded-2xl flex items-center justify-center border border-border/40">
      <div className="text-center">
        <p className="font-body text-sm text-muted-foreground mb-3">Watch the music video on YouTube</p>
        <a href={fallbackUrl || `https://www.youtube.com/watch?v=${videoId}`} target="_blank" rel="noopener noreferrer">
          <Button className="gap-2 rounded-full gradient-gold-button border-0 font-body text-sm">
            ▶️ Watch on YouTube <ExternalLink className="w-3 h-3" />
          </Button>
        </a>
      </div>
    </div>
  );
}

export default function CurrentSingle() {
  const navigate = useNavigate();
  const [lyricsOpen, setLyricsOpen] = useState(false);

  const { data: releases = [] } = useQuery({
    queryKey: ['current-single'],
    queryFn: () => base44.entities.Release.filter({ is_current_single: true }, '-release_date', 1),
  });

  const dbSingle = releases[0];
  const single = dbSingle ? {
    ...FALLBACK_SINGLE,
    ...dbSingle,
    lyrics: dbSingle.lyrics || localReleases.find(r => r.title.toLowerCase() === dbSingle.title.toLowerCase())?.lyrics || FALLBACK_SINGLE.lyrics || '',
    credits: dbSingle.credits && dbSingle.credits !== "Written by: Gannon Waye"
      ? dbSingle.credits
      : localReleases.find(r => r.title.toLowerCase() === dbSingle.title.toLowerCase())?.credits || FALLBACK_SINGLE.credits,
  } : FALLBACK_SINGLE;
  const isReleased = single.status === 'released' || single.status === 'ready';
  const releaseDateText = single.release_date
    ? new Date(single.release_date).toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric' })
    : null;

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Cinematic background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {single.artwork_url && (
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `url(${single.artwork_url})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              filter: 'blur(40px) saturate(0.5)',
            }}
          />
        )}
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, hsl(220,15%,6%) 0%, transparent 40%, transparent 60%, hsl(220,15%,6%) 100%)' }} />
        {/* Subtle gold shimmer */}
        <motion.div
          className="absolute inset-0 opacity-5"
          style={{ background: 'radial-gradient(ellipse at 50% 30%, hsl(40,85%,58%) 0%, transparent 60%)' }}
          animate={{ opacity: [0.03, 0.07, 0.03] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      <div className="relative z-10 py-12 px-4 md:px-6 max-w-4xl mx-auto">
        {/* Back */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-8">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer font-body text-xs tracking-wider uppercase">
            <ArrowLeft className="w-3 h-3" />Back
          </button>
        </motion.div>

        {/* Hero */}
        <div className="grid grid-cols-1 md:grid-cols-[1fr_320px] gap-10 md:gap-16 items-center mb-16">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7 }}>
            <p className="font-body text-xs tracking-[0.3em] uppercase gradient-gold-glow mb-4">Current Single</p>
            <h1 className="font-display text-5xl md:text-7xl text-foreground leading-none mb-4">{single.title}</h1>
            {releaseDateText && (
              <motion.p
                className="font-body text-sm text-muted-foreground mb-6"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
              >
                {isReleased ? 'Out now' : `Out ${releaseDateText}`}
              </motion.p>
            )}
            {single.current_single_hero_copy && (
              <p className="font-body text-base md:text-lg text-foreground/70 leading-relaxed mb-8 max-w-lg">
                {single.current_single_hero_copy}
              </p>
            )}
            <div className="flex flex-wrap gap-3">
              {single.lyrics && (
                <Button onClick={() => setLyricsOpen(true)} variant="outline" className="rounded-full gap-2 font-body text-xs tracking-wider uppercase border-primary/30 text-primary hover:bg-primary/10">
                  <BookOpen className="w-3.5 h-3.5" />Read Lyrics
                </Button>
              )}
              {isReleased && single.spotify_link && (
                <a href={single.spotify_link} target="_blank" rel="noopener noreferrer">
                  <Button className="rounded-full gap-2 font-body text-xs tracking-wider uppercase gradient-gold-button border-0">🎧 Listen on Spotify</Button>
                </a>
              )}
              {isReleased && single.apple_music_link && (
                <a href={single.apple_music_link} target="_blank" rel="noopener noreferrer">
                  <Button className="rounded-full gap-2 font-body text-xs tracking-wider uppercase gradient-gold-button border-0">🍎 Apple Music</Button>
                </a>
              )}
              {!isReleased && (
                <Link to="/back-this">
                  <Button className="rounded-full gap-2 font-body text-xs tracking-wider uppercase gradient-gold-button border-0">Back This Release</Button>
                </Link>
              )}
              <Link to="/store">
                <Button variant="outline" className="rounded-full gap-2 font-body text-xs tracking-wider uppercase border-border/40 hover:border-primary/30">
                  <ShoppingBag className="w-3.5 h-3.5" />Shop
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Artwork */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="relative rounded-2xl overflow-hidden aspect-square">
              {single.artwork_url ? (
                <img src={single.artwork_url} alt={single.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-secondary/30 flex items-center justify-center">
                  <Play className="w-16 h-16 text-muted-foreground/20" />
                </div>
              )}
              {/* Gold glow edge */}
              <div className="absolute inset-0 rounded-2xl" style={{ boxShadow: 'inset 0 0 40px rgba(249,208,110,0.05)' }} />
            </div>
            {/* Soft glow behind artwork */}
            <div className="absolute -inset-6 rounded-3xl opacity-20 pointer-events-none" style={{ background: 'radial-gradient(ellipse, hsl(40,85%,58%) 0%, transparent 70%)', filter: 'blur(20px)' }} />
          </motion.div>
        </div>

        {/* Spotify Player Embed */}
        {isReleased && (single.title === 'Thank You' || single.id === 'thank-you-fallback') && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="mb-14">
            <p className="font-body text-xs tracking-[0.3em] uppercase gradient-gold-glow mb-4">Listen on Spotify</p>
            <iframe
              data-testid="embed-iframe"
              style={{ borderRadius: '12px' }}
              src="https://open.spotify.com/embed/album/36qMYfzzJrq2j039l9Ex66?utm_source=generator"
              width="100%"
              height="352"
              frameBorder="0"
              allowFullScreen=""
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              loading="lazy"
            />
          </motion.div>
        )}

        {/* Music Video */}
        {(single.youtube_video_id || single.youtube_link) && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="mb-14">
            <p className="font-body text-xs tracking-[0.3em] uppercase gradient-gold-glow mb-4">Music Video</p>
            <YouTubeEmbed videoId={single.youtube_video_id} fallbackUrl={single.youtube_link} />
          </motion.div>
        )}

        {/* Behind the song */}
        {single.current_single_behind_story && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="mb-14">
            <p className="font-body text-xs tracking-[0.3em] uppercase gradient-gold-glow mb-4">Behind the Song</p>
            <div className="bg-card/50 border border-border/40 rounded-2xl p-6 md:p-8">
              <p className="font-body text-base text-foreground/75 leading-relaxed whitespace-pre-line">{single.current_single_behind_story}</p>
            </div>
          </motion.div>
        )}

        {/* Credits */}
        {single.credits && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="mb-14">
            <p className="font-body text-xs tracking-[0.3em] uppercase gradient-gold-glow mb-2">Credits</p>
            <p className="font-body text-xs text-muted-foreground leading-relaxed">{single.credits}</p>
          </motion.div>
        )}

        {/* Share */}
        <div className="flex justify-center mb-14">
          <ShareButtons url={`${window.location.origin}/current-single`} text={`"${single.title}" — Gannon Waye. Out ${releaseDateText || 'soon'}.`} />
        </div>

        {/* Fan Reviews */}
        <FanReviewSection targetType="single_page" targetId={single.id} targetName={single.title} />

        {/* Fan Comments */}
        <FanCommentSection postId={single.id} postType="current_single" />
      </div>

      {lyricsOpen && <LyricsModal release={single} onClose={() => setLyricsOpen(false)} />}
    </div>
  );
}