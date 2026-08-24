import { motion } from 'framer-motion';
import { ArrowDown } from 'lucide-react';
import GardenScene from './GardenScene';
import MemoryFrame from '../MemoryFrame';

const GROVE_BG = 'radial-gradient(ellipse 100% 80% at 50% 40%, hsl(150 33% 10%) 0%, hsl(156 45% 4%) 70%, hsl(156 50% 2%) 100%)';

const MEMORIES = [
  { caption: 'Coffee in the Garden' },
  { caption: "Sonia's Gold Rings" },
  { caption: 'A Quiet Morning' },
];

/**
 * Scene 3 — Memories Among Trees
 * Mum's photographs in interactive 3D gold frames, suspended in the grove.
 * Frames are ready for real images — placeholders label what's missing.
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
          Move close to a frame &middot; the garden waits
        </p>

        <div className="grid gap-10 md:grid-cols-3">
          {MEMORIES.map((m, i) => (
            <MemoryFrame
              key={m.caption}
              caption={m.caption}
              placeholder="Awaiting approved photograph"
              delay={i * 0.25}
            />
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