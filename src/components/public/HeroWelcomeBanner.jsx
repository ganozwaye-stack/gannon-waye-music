import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { trackEvent } from '@/lib/analytics';
import { isPublicRelease } from '@/lib/publicRelease';

export default function HeroWelcomeBanner({ release, releaseLink }) {
  const [index, setIndex] = useState(0);
  const safeRelease = isPublicRelease(release) ? release : null;

  const messages = safeRelease
    ? [
        safeRelease.description || 'Music shared after exact owner approval',
        'Verified merchandise is available through the official Store',
        'Official links come from the approved Release record',
      ]
    : [
        'Independent, heart-first music from Gannon Waye',
        'Music appears here only after exact owner approval',
        'Verified merchandise is available through the official Store',
      ];

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((current) => (current + 1) % messages.length);
    }, 4200);
    return () => clearInterval(id);
  }, [messages.length]);

  const pills = safeRelease
    ? [
        { label: 'Spotify', href: safeRelease.spotify_link },
        { label: 'Apple Music', href: safeRelease.apple_music_link },
        { label: 'YouTube', href: safeRelease.youtube_link },
      ].filter((item) => item.href)
    : [];

  const destination = safeRelease && releaseLink ? releaseLink : '/music';

  return (
    <div className="mb-7 w-full">
      <div
        className="relative rounded-2xl border border-primary/30 bg-background/55 backdrop-blur-md overflow-hidden"
        style={{ boxShadow: '0 0 26px rgba(212,175,55,0.10)' }}
      >
        <div
          className="h-px w-full"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(212,175,55,0.7), transparent)' }}
        />

        <div className="px-4 py-3.5">
          <div className="flex items-center justify-between gap-2 mb-2.5">
            <div className="flex items-center gap-2 min-w-0">
              <span className="relative flex h-2 w-2 shrink-0">
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
              </span>
              <span className="font-body text-base tracking-[0.15em] uppercase gradient-gold-text truncate">
                {safeRelease?.title || 'Gannon Waye Music'}
              </span>
            </div>
            <span className="font-body text-[9px] tracking-[0.25em] uppercase text-muted-foreground whitespace-nowrap">
              {safeRelease ? 'Current release' : 'Official artist site'}
            </span>
          </div>

          <div className="relative h-4 overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.p
                key={index}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0 flex items-center font-body text-[11px] tracking-[0.14em] uppercase text-foreground/80 truncate"
              >
                {messages[index]}
              </motion.p>
            </AnimatePresence>
          </div>

          <div className="my-3 h-px bg-border/50" />

          {pills.length > 0 ? (
            <div className="flex items-center gap-1.5 flex-nowrap overflow-hidden">
              <span className="font-body text-[9px] tracking-[0.3em] uppercase text-muted-foreground mr-0.5 whitespace-nowrap">
                Official links
              </span>
              {pills.map((pill) => (
                <a
                  key={pill.label}
                  href={pill.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackEvent('stream_click', {
                    platform: pill.label.toLowerCase(),
                    source: 'hero_banner',
                    release_id: safeRelease.id,
                  })}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-background/50 border border-primary/30 hover:border-primary/60 hover:bg-primary/10 transition-all group whitespace-nowrap"
                >
                  <Play className="w-3 h-3 text-primary" />
                  <span className="font-body text-[10px] tracking-[0.16em] uppercase text-foreground/85 group-hover:text-foreground">
                    {pill.label}
                  </span>
                  <ExternalLink className="w-2.5 h-2.5 text-muted-foreground/60 group-hover:text-primary transition-colors" />
                </a>
              ))}
            </div>
          ) : (
            <Link
              to={destination}
              className="inline-flex items-center gap-2 font-body text-[10px] tracking-[0.2em] uppercase text-primary hover:text-primary/80"
            >
              Explore the Music page
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}