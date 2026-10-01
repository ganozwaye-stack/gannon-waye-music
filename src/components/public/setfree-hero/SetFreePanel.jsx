import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Play } from 'lucide-react';
import { trackEvent } from '@/lib/analytics';
import HeroGlassPanel, { HERO_BTN_PRIMARY, HERO_BTN_OUTLINE } from './HeroGlassPanel';

// The SET FREE feature card: eyebrow, the owner's fire title art, the release
// line, the story and the two actions, with the buttons anchored to the
// bottom so they line up with the welcome card beside it.
// House style: no em dashes.
const SET_FREE_LISTEN = 'https://open.spotify.com/track/6TzrIFIkFu5HNyZGM4RmqG';
const SET_FREE_TITLE = 'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/6b0d132c4_SETFREEFIRE.jpg';
const SET_FREE_COVER = 'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/e2c44c509_image.png';

export default function SetFreePanel() {
  return (
    <HeroGlassPanel>
      <motion.p
        initial={{ opacity: 0, letterSpacing: '0.8em' }}
        animate={{ opacity: 1, letterSpacing: '0.4em' }}
        transition={{ duration: 1.2 }}
        className="inline-flex items-center gap-2 font-body text-[10px] md:text-xs uppercase gradient-gold-text"
      >
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
        </span>
        New Single · Out Now
      </motion.p>

      <motion.img
        src={SET_FREE_COVER}
        alt="Set Free, single cover artwork"
        draggable="false"
        className="mt-4 h-24 w-24 shrink-0 rounded-xl border border-primary/35 object-cover shadow-[0_0_36px_rgba(212,175,55,0.28)] md:h-28 md:w-28"
        initial={{ opacity: 0, scale: 0.94 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.15 }}
      />

      <motion.div
        className="mt-4 w-[min(80%,300px)]"
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1, filter: ['brightness(1)', 'brightness(1.12)', 'brightness(1)'] }}
        transition={{ opacity: { duration: 1 }, scale: { duration: 1 }, filter: { duration: 3, repeat: Infinity, ease: 'easeInOut' } }}
      >
        <img
          src={SET_FREE_TITLE}
          alt="Set Free, Gannon Waye"
          draggable="false"
          fetchpriority="high"
          className="h-auto w-full object-contain"
          style={{ filter: 'url(#gw-luma-alpha)' }}
        />
      </motion.div>

      <p className="mt-3 font-body text-[10px] uppercase tracking-[0.18em] text-foreground/70">
        Gannon Waye · Released 25 September 2026
      </p>

      <p className="mt-4 font-body text-[13px] italic leading-relaxed text-foreground/85 md:text-sm" style={{ textShadow: '0 1px 4px rgba(0,0,0,0.8)' }}>
        A pop single about reclaiming your voice, protecting your peace and choosing what happens next. Written from the inside of everything I survived, and sung for anyone still finding their way out.
      </p>

      <div className="mt-auto flex flex-wrap gap-2 pt-5">
        <a
          href={SET_FREE_LISTEN}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackEvent('stream_click', { source: 'home_space_hero', release: 'Set Free' })}
          className={HERO_BTN_PRIMARY}
        >
          <Play className="h-3.5 w-3.5" /> Listen Now
        </a>
        <Link to="/store" className={HERO_BTN_OUTLINE}>
          Carry the Message
        </Link>
      </div>
    </HeroGlassPanel>
  );
}