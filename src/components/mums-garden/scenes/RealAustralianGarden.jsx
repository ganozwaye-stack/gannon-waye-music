import { motion } from 'framer-motion';
import { ArrowDown } from 'lucide-react';
import GardenScene from './GardenScene';

const GARDEN_BG = 'radial-gradient(ellipse 120% 90% at 50% 30%, hsl(133 29% 16%) 0%, hsl(150 33% 9%) 55%, hsl(156 40% 4%) 100%)';

const PLANTS = [
  'Orange flowering vine',
  'Elephant ear plants',
  'Monstera',
  'Spider plants',
  'Dense green foliage',
  'The round concrete table',
  'The garden bench',
];

/**
 * Scene 4 — The Real Australian Garden
 * A genuine Adelaide backyard, not a tropical resort.
 */
export default function RealAustralianGarden({ onContinue }) {
  return (
    <GardenScene id="garden" background={GARDEN_BG} minHeight="110vh">
      <motion.div
        aria-hidden
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 0.6 }}
        viewport={{ once: true }}
        transition={{ duration: 2 }}
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(circle at 70% 20%, hsl(16 67% 63% / 0.10), transparent 45%)' }}
      />

      <div className="relative z-10 w-full max-w-4xl px-6 py-20 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.8 }}
          className="font-cormorant text-4xl md:text-5xl text-[hsl(var(--garden-cream))]/85"
        >
          Her real garden
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.8, delay: 0.3 }}
          className="mt-4 font-cormorant italic text-xl text-[hsl(var(--garden-cream))]/55 max-w-2xl mx-auto"
        >
          An Adelaide backyard, quiet and alive &mdash; the place she tended with her hands.
        </motion.p>

        <div className="mx-auto mt-12 max-w-[420px] rounded-sm border border-dashed border-[hsl(var(--garden-gold))]/25 bg-black/20 p-4">
          <span className="font-body text-[10px] uppercase tracking-[0.3em] text-[hsl(var(--garden-cream))]/35">
            Awaiting anchor photograph (IMG_3244)
          </span>
        </div>

        <ul className="mt-12 flex flex-wrap items-center justify-center gap-3">
          {PLANTS.map((p, i) => (
            <motion.li
              key={p}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, delay: i * 0.08 }}
              className="rounded-full border border-[hsl(var(--garden-green))]/60 px-4 py-1.5 font-body text-[11px] tracking-wide text-[hsl(var(--garden-cream))]/65"
            >
              {p}
            </motion.li>
          ))}
        </ul>

        <button
          type="button"
          onClick={onContinue}
          className="group mt-14 inline-flex items-center gap-2.5 rounded-full border border-[hsl(var(--garden-orange))]/50 px-7 py-3 text-[hsl(var(--garden-cream))] hover:border-[hsl(var(--garden-orange))] transition-colors"
        >
          <span className="font-body text-[11px] uppercase tracking-[0.3em]">Toward the archway</span>
          <ArrowDown className="w-3.5 h-3.5 group-hover:translate-y-0.5 transition-transform" />
        </button>
      </div>
    </GardenScene>
  );
}