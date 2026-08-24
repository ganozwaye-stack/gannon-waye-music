import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Headphones, ArrowDown } from 'lucide-react';
import GardenScene from './GardenScene';

const SKY_BG = 'radial-gradient(ellipse 140% 110% at 50% 28%, hsl(46 35% 16%) 0%, hsl(150 30% 7%) 42%, hsl(156 45% 3%) 100%)';

/**
 * Scene 1 — Heavenly Arrival
 * Full-screen world image, perfectly centered Enter, calming.
 * Audio never autoplays.
 */
export default function HeavenlyArrival({ onEnter }) {
  return (
    <GardenScene id="arrival" background={SKY_BG} minHeight="100vh">
      {/* soft heavenly glow */}
      <motion.div
        aria-hidden
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.4 }}
        transition={{ duration: 4 }}
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 70% 60% at 50% 22%, hsl(47 100% 93% / 0.10), transparent 70%)' }}
      />
      {/* slow drifting cloud */}
      <motion.div
        aria-hidden
        initial={{ x: '-10%' }}
        animate={{ x: '10%' }}
        transition={{ duration: 30, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut' }}
        className="absolute inset-x-0 top-[10%] h-1/3 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 55% 100% at 50% 50%, hsl(200 14% 72% / 0.06), transparent 70%)' }}
      />

      {/* perfectly centered entry */}
      <div className="relative z-10 flex w-full flex-col items-center justify-center px-6 text-center" style={{ minHeight: '100vh' }}>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 2, delay: 0.4 }}
          className="mb-5 font-body text-[10px] uppercase tracking-[0.5em] text-[hsl(var(--garden-cream))]/45"
        >
          A Garden for Sonia
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 2.2, delay: 0.6 }}
          className="font-cormorant text-[clamp(3rem,8vw,6.5rem)] leading-none text-[hsl(var(--garden-cream))]"
          style={{ textShadow: '0 0 40px hsl(46 63% 52% / 0.2)' }}
        >
          Sonia&rsquo;s Garden
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2, delay: 1.1 }}
          className="mt-4 font-cormorant italic text-xl text-[hsl(var(--garden-cream))]/55"
        >
          In loving memory of Sonia Katisa Waye
        </motion.p>

        {/* the Enter — centered focal action */}
        <motion.button
          type="button"
          onClick={onEnter}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 2, delay: 1.6 }}
          className="group mt-12 inline-flex items-center gap-3 rounded-full px-10 py-4 gradient-gold-button"
        >
          <span className="font-body text-xs uppercase tracking-[0.4em]">Enter the Garden</span>
          <ArrowDown className="w-4 h-4 transition-transform group-hover:translate-y-0.5" />
        </motion.button>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2, delay: 2 }}
          className="mt-6"
        >
          <Link
            to="/music"
            className="inline-flex items-center gap-2 text-[hsl(var(--garden-cream))]/60 hover:text-[hsl(var(--garden-gold))] transition-colors"
          >
            <Headphones className="w-4 h-4" />
            <span className="font-body text-[11px] uppercase tracking-[0.35em]">Listen to Without You Here</span>
          </Link>
        </motion.div>
      </div>

      {/* subtle, non-distracting asset note */}
      <span className="absolute bottom-5 left-1/2 -translate-x-1/2 font-body text-[9px] uppercase tracking-[0.3em] text-[hsl(var(--garden-cream))]/25">
        Full-screen world image &mdash; awaiting approved asset
      </span>
    </GardenScene>
  );
}