import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Headphones, ArrowDown } from 'lucide-react';
import GardenScene from './GardenScene';

const SKY_BG = 'radial-gradient(ellipse 120% 90% at 50% 18%, hsl(46 40% 22%) 0%, hsl(156 35% 6%) 45%, hsl(156 40% 3%) 100%)';

/**
 * Scene 1 — Heavenly Arrival
 * Full-screen sky & treetop view. Visitor chooses to Enter the Garden or
 * listen to "Without You Here". Audio never autoplays.
 */
export default function HeavenlyArrival({ onEnter }) {
  return (
    <GardenScene id="arrival" background={SKY_BG} minHeight="100vh">
      {/* soft moving light beams */}
      <motion.div
        aria-hidden
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        transition={{ duration: 4, repeat: Infinity, repeatType: 'reverse' }}
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'linear-gradient(105deg, transparent 30%, hsl(46 63% 72% / 0.12) 42%, transparent 58%)' }}
      />
      {/* cloud drift */}
      <motion.div
        aria-hidden
        initial={{ x: '-12%' }}
        animate={{ x: '12%' }}
        transition={{ duration: 26, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut' }}
        className="absolute inset-x-0 top-[8%] h-1/3 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 60% 100% at 50% 50%, hsl(47 100% 93% / 0.14), transparent 70%)' }}
      />

      <div className="relative z-10 px-6 text-center max-w-2xl">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.6, delay: 0.3 }}
          className="mb-6 font-body text-[10px] uppercase tracking-[0.5em] text-[hsl(var(--garden-cream))]/45"
        >
          A Garden for Sonia
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 2, delay: 0.5 }}
          className="font-cormorant text-[clamp(3.5rem,9vw,7rem)] leading-none text-[hsl(var(--garden-cream))]"
          style={{ textShadow: '0 0 40px hsl(46 63% 52% / 0.25)' }}
        >
          Sonia&rsquo;s Garden
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.8, delay: 1.1 }}
          className="mt-5 font-cormorant italic text-xl md:text-2xl text-[hsl(var(--garden-cream))]/60"
        >
          In loving memory of Sonia Katisa Waye &middot; 1961 &ndash; 2022
        </motion.p>

        {/* Awaiting approved sky portrait — no invented faces */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.8, delay: 1.4 }}
          className="mx-auto mt-10 max-w-[260px] rounded-sm border border-[hsl(var(--garden-gold))]/20 bg-black/20 p-4"
        >
          <div className="aspect-[4/3] w-full rounded-sm border border-dashed border-[hsl(var(--garden-gold))]/25 flex items-center justify-center">
            <span className="px-4 text-center font-body text-[10px] uppercase tracking-[0.3em] text-[hsl(var(--garden-cream))]/35">
              Awaiting approved sky photograph
            </span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.6, delay: 1.8 }}
          className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <button
            type="button"
            onClick={onEnter}
            className="group inline-flex items-center gap-3 rounded-full px-8 py-3.5 gradient-gold-button"
          >
            <span className="font-body text-xs uppercase tracking-[0.35em]">Enter the Garden</span>
            <ArrowDown className="w-4 h-4 transition-transform group-hover:translate-y-0.5" />
          </button>
          <Link
            to="/music"
            className="inline-flex items-center gap-2.5 rounded-full border border-[hsl(var(--garden-gold))]/40 px-7 py-3.5 text-[hsl(var(--garden-cream))] hover:border-[hsl(var(--garden-gold))] transition-colors"
          >
            <Headphones className="w-4 h-4 text-[hsl(var(--garden-gold))]" />
            <span className="font-body text-xs uppercase tracking-[0.35em]">Listen to Without You Here</span>
          </Link>
        </motion.div>

        <p className="mt-10 font-body text-[10px] tracking-[0.3em] uppercase text-[hsl(var(--garden-cream))]/30">
          Sound begins only when you choose
        </p>
      </div>
    </GardenScene>
  );
}