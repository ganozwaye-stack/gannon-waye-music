import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

/**
 * Cinematic 9:16 merch reel — in-browser animated version.
 * Brand palette: deep black, warm gold, soft cream, rich burgundy, subtle deep green.
 * Campaign: "Respect is earned. Not a game you make me play."
 * Campaign: supports Gannon Waye's independent music.
 */

const SLIDES = [
  {
    id: 0,
    time: [0, 3],
    headline: 'This is not\njust merch.',
    sub: null,
    accent: null,
  },
  {
    id: 1,
    time: [3, 6],
    headline: 'It is part of a\nstory of survival.',
    sub: null,
    accent: 'survival',
  },
  {
    id: 2,
    time: [6, 10],
    headline: 'Respect is\nearned.',
    sub: null,
    accent: 'respect',
  },
  {
    id: 3,
    time: [10, 14],
    headline: 'Not a game\nyou make me play.',
    sub: null,
    accent: 'game',
  },
  {
    id: 4,
    time: [14, 18],
    headline: 'Wear the message.\nCarry the story.',
    sub: 'Official Thank You Merch',
    accent: null,
  },
  {
    id: 5,
    time: [18, 22],
    headline: 'For anyone rebuilding\nafter pain, doubt,\ncontrol, or silence.',
    sub: null,
    accent: null,
  },
  {
    id: 6,
    time: [22, 26],
    headline: 'Support\nindependent\nmusic.',
    sub: null,
    accent: 'support',
  },
  {
    id: 7,
    time: [26, 31],
    headline: 'Shop the official\nThank You merch\nrelease.',
    sub: 'gannonwaye.com/store',
    accent: 'cta',
  },
];

// Gold particle component
function GoldParticle({ i }) {
  return (
    <motion.div
      className="absolute rounded-full pointer-events-none"
      style={{
        width: `${2 + (i % 3)}px`,
        height: `${2 + (i % 3)}px`,
        background: `rgba(212,175,55,${0.12 + (i % 5) * 0.06})`,
        left: `${5 + (i * 9.1) % 90}%`,
        top: `${5 + (i * 7.3) % 90}%`,
      }}
      animate={{ y: [-10, -35, -10], opacity: [0.06, 0.4, 0.06] }}
      transition={{ duration: 4 + (i % 4), repeat: Infinity, delay: i * 0.38, ease: 'easeInOut' }}
    />
  );
}

export default function MerchReelPage() {
  const [current, setCurrent] = useState(0);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    if (!playing) return;
    if (current >= SLIDES.length - 1) return;
    const slide = SLIDES[current];
    const duration = (slide.time[1] - slide.time[0]) * 1000;
    const t = setTimeout(() => setCurrent(c => c + 1), duration);
    return () => clearTimeout(t);
  }, [current, playing]);

  const slide = SLIDES[current];

  const bgStyle = () => {
    if (slide.accent === 'charity') return 'linear-gradient(150deg, #0e0408 0%, #1a0810 40%, #0a0b0a 100%)';
    if (slide.accent === 'cta') return 'linear-gradient(150deg, #0e0a04 0%, #1a1205 50%, #0a0805 100%)';
    if (slide.accent === 'respect') return 'linear-gradient(150deg, #0e0408 0%, #200814 50%, #0a0b0a 100%)';
    return 'linear-gradient(150deg, #090307 0%, #160a0e 40%, #0a0c08 100%)';
  };

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: '#080306' }}>
      <div className="flex flex-col items-center gap-6 w-full max-w-sm px-4">

        {/* Reel frame — 9:16 */}
        <div
          className="relative w-full overflow-hidden rounded-2xl"
          style={{ aspectRatio: '9/16', background: bgStyle(), boxShadow: '0 0 60px rgba(212,175,55,0.12), 0 30px 80px rgba(0,0,0,0.8)' }}
        >
          {/* Gold particles */}
          <div className="absolute inset-0 pointer-events-none z-0">
            {[...Array(18)].map((_, i) => <GoldParticle key={i} i={i} />)}
          </div>

          {/* Background light sweep */}
          <motion.div
            key={current}
            className="absolute inset-0 z-[1] pointer-events-none"
            initial={{ opacity: 0, x: '-100%' }}
            animate={{ opacity: [0, 0.06, 0], x: ['−100%', '200%'] }}
            transition={{ duration: 2.5, ease: 'easeInOut' }}
            style={{ background: 'linear-gradient(90deg, transparent, rgba(212,175,55,0.18), transparent)' }}
          />

          {/* Gold top accent line */}
          <div className="absolute top-0 left-0 right-0 h-px z-[2]"
            style={{ background: 'linear-gradient(90deg, transparent, rgba(212,175,55,0.5), transparent)' }}
          />

          {/* Slide content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-0 z-[3] flex flex-col items-center justify-center px-8 text-center gap-5"
            >
              {/* Gannon Waye wordmark */}
              <p className="font-body text-[9px] tracking-[0.5em] uppercase text-primary/40">Gannon Waye</p>

              {/* Main headline */}
              <h2
                className="font-display leading-tight"
                style={{
                  fontSize: 'clamp(1.6rem, 6vw, 2.4rem)',
                  color: slide.accent === 'charity' ? 'rgba(212,175,55,0.95)' : 'rgba(240,232,215,0.95)',
                  textShadow: '0 2px 20px rgba(0,0,0,0.8)',
                  whiteSpace: 'pre-line',
                }}
              >
                {slide.headline}
              </h2>

              {/* Sub line */}
              {slide.sub && (
                <p
                  className="font-body tracking-widest uppercase"
                  style={{
                    fontSize: '0.65rem',
                    color: slide.accent === 'cta' ? 'rgba(212,175,55,0.9)' : 'rgba(200,180,140,0.7)',
                    letterSpacing: '0.18em',
                  }}
                >
                  {slide.sub}
                </p>
              )}

              {/* Burgundy accent panel for CTA */}
              {slide.accent === 'cta' && (
                <div className="px-6 py-3 rounded-full border border-primary/40 mt-2"
                  style={{ background: 'rgba(212,175,55,0.08)' }}
                >
                  <p className="font-body text-xs tracking-widest text-primary/80 uppercase">Shop Now</p>
                </div>
              )}

              {/* Charity badge */}
              {slide.accent === 'charity' && (
                <div className="mt-2 px-5 py-2 rounded-xl border border-primary/20"
                  style={{ background: 'rgba(110,20,40,0.3)' }}
                >
                  <p className="font-body text-[10px] text-foreground/50 italic">Supporting those who need safety, guidance, or someone to listen.</p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Progress dots */}
          <div className="absolute bottom-6 left-0 right-0 z-[4] flex justify-center gap-1.5">
            {SLIDES.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className="rounded-full transition-all duration-300"
                style={{
                  width: i === current ? '20px' : '5px',
                  height: '5px',
                  background: i === current ? 'rgba(212,175,55,0.85)' : 'rgba(255,255,255,0.2)',
                }}
              />
            ))}
          </div>

          {/* Bottom gold accent line */}
          <div className="absolute bottom-0 left-0 right-0 h-px z-[2]"
            style={{ background: 'linear-gradient(90deg, transparent, rgba(212,175,55,0.3), transparent)' }}
          />
        </div>

        {/* End card text (shown on last slide) */}
        {current === SLIDES.length - 1 && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-1"
          >
            <p className="font-display text-lg gradient-gold-glow italic">GANNON WAYE</p>
            <p className="font-body text-xs text-foreground/50 tracking-widest uppercase">Thank You — Official Merch Release</p>
            <p className="font-body text-[10px] text-muted-foreground/40 italic mt-1">Respect is earned. Not a game you make me play.</p>
            <p className="font-body text-[10px] text-muted-foreground/30 mt-1">Support independent music</p>
            <Link to="/store">
              <button className="mt-4 gradient-gold-button rounded-full font-body text-xs tracking-wider uppercase px-8 py-3">
                Shop Now
              </button>
            </Link>
          </motion.div>
        )}

        {/* Playback controls */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => { setCurrent(0); setPlaying(false); }}
            className="font-body text-[10px] uppercase tracking-wider text-muted-foreground/40 hover:text-muted-foreground/70 transition-colors"
          >
            Reset
          </button>
          <button
            onClick={() => setPlaying(!playing)}
            className="gradient-gold-button rounded-full font-body text-xs tracking-wider uppercase px-6 py-2.5"
          >
            {playing ? 'Pause' : current === 0 ? 'Play Reel' : 'Continue'}
          </button>
          <button
            onClick={() => setCurrent(c => Math.min(c + 1, SLIDES.length - 1))}
            className="font-body text-[10px] uppercase tracking-wider text-muted-foreground/40 hover:text-muted-foreground/70 transition-colors"
          >
            Next →
          </button>
        </div>

        <p className="font-body text-[9px] text-muted-foreground/25 text-center max-w-xs leading-relaxed">
          This interactive reel is designed for CapCut/Instagram Edits export.<br />
          For full video production, use the CapCut prompt from the admin panel.
        </p>

        <div className="flex gap-4">
          <Link to="/store" className="font-body text-xs text-primary/60 hover:text-primary transition-colors">
            Shop Merch →
          </Link>
          <Link to="/mum" className="font-body text-xs text-muted-foreground/40 hover:text-muted-foreground transition-colors">
            ← For Mum
          </Link>
        </div>
      </div>
    </div>
  );
}