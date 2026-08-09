import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, ExternalLink } from 'lucide-react';

// Sits above the Welcome write-up in the Home hero.
// Two stacked strips: a rotating info marquee (mission, single, album) and a
// "Stream everywhere" row of platform pills linking to the current single.
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
    <div className="mb-6 w-full">
      {/* Rotating info marquee */}
      <div className="relative flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-background/60 backdrop-blur-md border border-primary/25 overflow-hidden">
        <span className="relative flex h-2 w-2 flex-shrink-0">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
        </span>
        <div className="relative h-4 flex-1 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.p
              key={index}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0 flex items-center font-body text-[11px] tracking-[0.18em] uppercase text-foreground/80 whitespace-nowrap">
              {MESSAGES[index]}
            </motion.p>
          </AnimatePresence>
        </div>
      </div>

      {/* Stream everywhere pills */}
      <div className="mt-3 flex items-center gap-2 flex-wrap">
        <span className="font-body text-[9px] tracking-[0.3em] uppercase text-muted-foreground mr-1">Stream now</span>
        {pills.map((p) => (
          <a
            key={p.label}
            href={p.href}
            target={p.href.startsWith('http') ? '_blank' : undefined}
            rel={p.href.startsWith('http') ? 'noopener noreferrer' : undefined}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-background/50 backdrop-blur-md border border-primary/30 hover:border-primary/60 hover:bg-primary/10 transition-all group">
            <Play className="w-3 h-3 text-primary" />
            <span className="font-body text-[10px] tracking-[0.16em] uppercase text-foreground/85 group-hover:text-foreground">
              {p.label}
            </span>
            <ExternalLink className="w-2.5 h-2.5 text-muted-foreground/60 group-hover:text-primary transition-colors" />
          </a>
        ))}
      </div>
    </div>
  );
}