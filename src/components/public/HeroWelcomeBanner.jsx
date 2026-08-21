import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, ExternalLink } from 'lucide-react';
import { trackEvent } from '@/lib/analytics';

// Sits above the Welcome write-up in the Home hero.
// A single branded panel: gold hairline, a header row, a rotating info marquee,
// a divider, and a "Stream everywhere" row of platform pills.
const MESSAGES = [
  'The new single, Without You Here, is out now everywhere',
  '10% of all support goes to 1800RESPECT',
  'The album is in production, releasing next year',
  'A film and a letter, written for Mum'
];

export default function HeroWelcomeBanner({ release, releaseLink }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setIndex((i) => (i + 1) % MESSAGES.length), 4200);
    return () => clearInterval(id);
  }, []);

  const spotify = release?.spotify_link || 'https://open.spotify.com/track/6lX5V0j0bQiLOzldueTmnz';
  const apple = release?.apple_music_link || releaseLink || '/music';
  const youtube = release?.youtube_link || releaseLink || '/music';

  const pills = [
    { label: 'Spotify', href: spotify },
    { label: 'Apple Music', href: apple },
    { label: 'YouTube', href: youtube }
  ];

  return (
    <div className="mb-7 w-full">
      <div
        className="relative rounded-2xl border border-primary/30 bg-background/55 backdrop-blur-md overflow-hidden"
        style={{ boxShadow: '0 0 26px rgba(212,175,55,0.10)' }}>
        {/* Top gold hairline */}
        <div
          className="h-px w-full"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(212,175,55,0.7), transparent)' }} />

        <div className="px-4 py-3.5">
          {/* Header row: single name + Out Now tag */}
          <div className="flex items-center justify-between gap-2 mb-2.5">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
              </span>
              <span className="font-body text-base tracking-[0.15em] uppercase gradient-gold-text">Without You Here</span>
            </div>
            <span className="font-body text-[9px] tracking-[0.25em] uppercase text-muted-foreground">Out Now</span>
          </div>

          {/* Rotating info marquee */}
          <div className="relative h-4 overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.p
                key={index}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0 flex items-center font-body text-[11px] tracking-[0.14em] uppercase text-foreground/80 whitespace-nowrap">
                {MESSAGES[index]}
              </motion.p>
            </AnimatePresence>
          </div>

          {/* Divider */}
          <div className="my-3 h-px bg-border/50" />

          {/* Stream everywhere pills */}
          <div className="flex items-center gap-1.5 flex-nowrap overflow-hidden">
            <span className="font-body text-[9px] tracking-[0.3em] uppercase text-muted-foreground mr-0.5 whitespace-nowrap">Stream now</span>
            {pills.map((p) => (
              <a
                key={p.label}
                href={p.href}
                target={p.href.startsWith('http') ? '_blank' : undefined}
                rel={p.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                onClick={() => trackEvent('stream_click', { platform: p.label.toLowerCase(), source: 'hero_banner' })}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-background/50 border border-primary/30 hover:border-primary/60 hover:bg-primary/10 transition-all group whitespace-nowrap">
                <Play className="w-3 h-3 text-primary" />
                <span className="font-body text-[10px] tracking-[0.16em] uppercase text-foreground/85 group-hover:text-foreground">
                  {p.label}
                </span>
                <ExternalLink className="w-2.5 h-2.5 text-muted-foreground/60 group-hover:text-primary transition-colors" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}