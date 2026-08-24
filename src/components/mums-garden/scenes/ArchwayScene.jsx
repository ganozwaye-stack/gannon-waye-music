import { motion } from 'framer-motion';
import { ArrowDown } from 'lucide-react';
import GardenScene from './GardenScene';

const ARCH_BG = 'radial-gradient(ellipse 100% 70% at 50% 60%, hsl(16 40% 18%) 0%, hsl(156 40% 5%) 65%, hsl(156 45% 3%) 100%)';

/**
 * Scene 5 — Onya & Gay's Archway
 * The boundary archway between neighbouring homes. Deeper, moodier orange
 * than a bright wedding arch. Passing through is entering another chapter.
 */
export default function ArchwayScene({ onContinue }) {
  return (
    <GardenScene id="archway" background={ARCH_BG} minHeight="115vh">
      <motion.div
        aria-hidden
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 0.8 }}
        viewport={{ once: true }}
        transition={{ duration: 2 }}
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 60% 50% at 50% 55%, hsl(16 67% 63% / 0.16), transparent 60%)' }}
      />

      <div className="relative z-10 w-full max-w-3xl px-6 py-20 text-center">
        {/* Archway silhouette */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 2 }}
          className="mx-auto mb-10 flex justify-center"
        >
          <svg viewBox="0 0 220 160" className="w-56 md:w-72" fill="none" aria-hidden>
            <path
              d="M20 150 V70 Q110 10 200 70 V150"
              stroke="hsl(16 67% 55% / 0.85)"
              strokeWidth="6"
              strokeLinecap="round"
            />
            <path
              d="M20 150 V70 Q110 10 200 70 V150"
              stroke="hsl(16 80% 70% / 0.4)"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <line x1="0" y1="150" x2="220" y2="150" stroke="hsl(var(--garden-cream) / 0.3)" strokeWidth="1" />
          </svg>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.8, delay: 0.3 }}
          className="font-body text-[11px] uppercase tracking-[0.45em] text-[hsl(var(--garden-orange))]/70 mb-4"
        >
          Between the two homes
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.8, delay: 0.4 }}
          className="font-cormorant text-4xl md:text-6xl text-[hsl(var(--garden-cream))]/90"
          style={{ textShadow: '0 0 30px hsl(16 67% 63% / 0.3)' }}
        >
          Onya &amp; Gay&rsquo;s Archway
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.8, delay: 0.6 }}
          className="mt-5 font-cormorant italic text-lg md:text-xl text-[hsl(var(--garden-cream))]/55 max-w-xl mx-auto"
        >
          Passing through is entering another chapter of the memory.
        </motion.p>

        <button
          type="button"
          onClick={onContinue}
          className="group mt-12 inline-flex items-center gap-2.5 rounded-full border border-[hsl(var(--garden-orange))]/55 px-7 py-3 text-[hsl(var(--garden-cream))] hover:border-[hsl(var(--garden-orange))] transition-colors"
        >
          <span className="font-body text-[11px] uppercase tracking-[0.3em]">Pass through</span>
          <ArrowDown className="w-3.5 h-3.5 group-hover:translate-y-0.5 transition-transform" />
        </button>
      </div>
    </GardenScene>
  );
}