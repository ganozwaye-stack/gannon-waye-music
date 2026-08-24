import { motion } from 'framer-motion';
import { ArrowDown } from 'lucide-react';
import GardenScene from './GardenScene';

const BENCH_BG = 'radial-gradient(ellipse 120% 90% at 50% 50%, hsl(150 30% 11%) 0%, hsl(156 42% 5%) 60%, hsl(156 48% 3%) 100%)';

/**
 * Scene 7 — The Bench Garden
 * The most emotionally powerful part. Restrained movement, mist, light.
 * A place to stop, reflect, and listen.
 */
export default function BenchGarden({ onContinue }) {
  return (
    <GardenScene id="bench" background={BENCH_BG} minHeight="115vh">
      {/* low mist */}
      <motion.div
        aria-hidden
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 0.5 }}
        viewport={{ once: true }}
        transition={{ duration: 2.4 }}
        className="absolute inset-x-0 bottom-0 h-1/2 pointer-events-none"
        style={{ background: 'linear-gradient(to top, hsl(200 14% 72% / 0.14), transparent)' }}
      />

      {/* bench silhouette */}
      <motion.svg
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 0.9, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 2 }}
        viewBox="0 0 220 80"
        className="absolute bottom-[18%] left-1/2 -translate-x-1/2 w-64 md:w-80"
        fill="none"
        aria-hidden
      >
        <rect x="10" y="34" width="200" height="10" rx="2" stroke="hsl(var(--garden-gold) / 0.5)" strokeWidth="2" />
        <line x1="30" y1="44" x2="30" y2="70" stroke="hsl(var(--garden-gold) / 0.5)" strokeWidth="2" />
        <line x1="190" y1="44" x2="190" y2="70" stroke="hsl(var(--garden-gold) / 0.5)" strokeWidth="2" />
        <line x1="10" y1="20" x2="210" y2="20" stroke="hsl(var(--garden-gold) / 0.35)" strokeWidth="2" />
        <line x1="10" y1="27" x2="210" y2="27" stroke="hsl(var(--garden-gold) / 0.3)" strokeWidth="2" />
      </motion.svg>

      <div className="relative z-10 w-full max-w-xl px-6 py-20 text-center">
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 2 }}
          className="font-body text-[11px] uppercase tracking-[0.45em] text-[hsl(var(--garden-cream))]/35 mb-5"
        >
          Rest here
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 2, delay: 0.2 }}
          className="font-cormorant text-4xl md:text-5xl text-[hsl(var(--garden-cream))]/80"
        >
          The bench garden
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 2, delay: 0.4 }}
          className="mt-6 font-cormorant italic text-xl md:text-2xl text-[hsl(var(--garden-cream))]/55 leading-relaxed"
        >
          &ldquo;Sit a while. The garden does not hurry, and neither should your remembering.&rdquo;
        </motion.p>

        <button
          type="button"
          onClick={onContinue}
          className="group mt-14 inline-flex items-center gap-2.5 rounded-full border border-[hsl(var(--garden-gold))]/35 px-7 py-3 text-[hsl(var(--garden-cream))] hover:border-[hsl(var(--garden-gold))] transition-colors"
        >
          <span className="font-body text-[11px] uppercase tracking-[0.3em]">When you are ready</span>
          <ArrowDown className="w-3.5 h-3.5 group-hover:translate-y-0.5 transition-transform" />
        </button>
      </div>
    </GardenScene>
  );
}