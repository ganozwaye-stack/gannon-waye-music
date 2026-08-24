import { motion } from 'framer-motion';
import { ArrowDown } from 'lucide-react';
import GardenScene from './GardenScene';

const GROVE_BG = 'radial-gradient(ellipse 100% 80% at 50% 40%, hsl(150 33% 10%) 0%, hsl(156 45% 4%) 70%, hsl(156 50% 2%) 100%)';

const MEMORIES = [
  { label: 'Coffee in the Garden', note: 'Awaiting approved photograph' },
  { label: "Sonia's Gold Rings", note: 'Awaiting approved photograph' },
  { label: 'A Quiet Morning', note: 'Awaiting approved photograph' },
];

/**
 * Scene 3 — Memories Among Trees
 * Darker, emotional. Photographs suspended among the trees, glowing softly.
 */
export default function MemoriesAmongTrees({ onContinue }) {
  return (
    <GardenScene id="memories" background={GROVE_BG} minHeight="120vh">
      <motion.div
        aria-hidden
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 0.5 }}
        viewport={{ once: true }}
        transition={{ duration: 2 }}
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'linear-gradient(to top, hsl(200 14% 72% / 0.12), transparent 40%)' }}
      />

      <div className="relative z-10 w-full max-w-5xl px-6 py-20">
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.8 }}
          className="text-center font-cormorant text-4xl md:text-5xl text-[hsl(var(--garden-cream))]/80 mb-3"
        >
          Memories among the trees
        </motion.h2>
        <p className="text-center font-body text-[11px] uppercase tracking-[0.35em] text-[hsl(var(--garden-cream))]/35 mb-14">
          Touch a frame to pause &middot; the garden waits
        </p>

        <div className="grid gap-10 md:grid-cols-3">
          {MEMORIES.map((m, i) => (
            <motion.figure
              key={m.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1.6, delay: i * 0.25 }}
              className="group rounded-sm border border-[hsl(var(--garden-gold))]/20 bg-black/25 p-3 backdrop-blur-sm"
            >
              <div className="aspect-[3/4] w-full rounded-sm border border-dashed border-[hsl(var(--garden-gold))]/25 flex items-center justify-center overflow-hidden">
                <span className="px-4 text-center font-body text-[10px] uppercase tracking-[0.28em] text-[hsl(var(--garden-cream))]/35">
                  {m.note}
                </span>
              </div>
              <figcaption className="mt-4 text-center font-cormorant italic text-lg text-[hsl(var(--garden-cream))]/70">
                {m.label}
              </figcaption>
            </motion.figure>
          ))}
        </div>

        <div className="mt-16 text-center">
          <button
            type="button"
            onClick={onContinue}
            className="group inline-flex items-center gap-2.5 rounded-full border border-[hsl(var(--garden-gold))]/35 px-7 py-3 text-[hsl(var(--garden-cream))] hover:border-[hsl(var(--garden-gold))] transition-colors"
          >
            <span className="font-body text-[11px] uppercase tracking-[0.3em]">Into the real garden</span>
            <ArrowDown className="w-3.5 h-3.5 group-hover:translate-y-0.5 transition-transform" />
          </button>
        </div>
      </div>
    </GardenScene>
  );
}