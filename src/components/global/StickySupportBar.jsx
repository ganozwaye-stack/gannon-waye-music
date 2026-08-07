import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Music2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

// "Without You Here" surfaces on the artist's Spotify page on release.
const WYH_SPOTIFY_URL = 'https://open.spotify.com/artist/1tu7INPvRAcRihgaEvBVAz';
const MEMORIAL_PATHS = ['/mum', '/without-you-here'];

export default function StickySupportBar() {
  const location = useLocation();
  const isMemorialPage = MEMORIAL_PATHS.includes(location.pathname);
  const isStorePage = location.pathname.startsWith('/store');

  if (isMemorialPage || isStorePage) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-sm border-t border-border/40 px-4 py-2.5 z-50"
    >
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-3">

        {/* LEFT: Without You Here — Spotify */}
        <a
          href={WYH_SPOTIFY_URL}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Listen to Without You Here on Spotify"
          className="flex items-center gap-2 flex-shrink-0"
        >
          <span className="w-8 h-8 rounded-full bg-[#1DB954] flex items-center justify-center">
            <Music2 className="w-4 h-4 text-black" />
          </span>
          <span className="font-body text-[9px] tracking-widest uppercase text-muted-foreground hidden sm:block select-none">
            Without You Here · Spotify
          </span>
        </a>

        {/* CENTRE: charity message */}
        <div className="flex items-center gap-2 flex-1 justify-center">
          <img src="https://media.base44.com/images/public/69eb7905ca6eb4180010f794/adcdec40c_GWheartlacewrap.png" alt="GW Heart" className="w-6 h-6 object-contain flex-shrink-0" />
          <div>
            <p className="font-body text-xs text-foreground font-medium leading-tight">Support the "Thank You" Project</p>
            <p className="font-body text-[10px] text-muted-foreground">10% of all support → 1800RESPECT</p>
          </div>
        </div>

        {/* RIGHT: CTA */}
        <div className="flex gap-2 flex-shrink-0">
          <Link to="/back-this">
            <Button size="sm" className="rounded-full gradient-gold-button border-0 font-body text-xs tracking-wider uppercase px-4 h-8">
              Support Now
            </Button>
          </Link>
        </div>

      </div>
    </motion.div>
  );
}