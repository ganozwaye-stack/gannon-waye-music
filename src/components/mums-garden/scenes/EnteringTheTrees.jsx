import { motion } from 'framer-motion';
import { ArrowDown } from 'lucide-react';
import GardenScene from './GardenScene';

const CANOPY_BG = 'linear-gradient(180deg, hsl(150 33% 12%) 0%, hsl(156 40% 5%) 60%, hsl(156 45% 3%) 100%)';

/**
 * Scene 2 — Entering the Trees
 * Camera moves into tall Australian canopy. Fog and soft light.
 */
export default function EnteringTheTrees({ onContinue }) {
  return (
    <GardenScene id="trees" background={CANOPY_BG} minHeight="110vh">
      {/* canopy light shafts */}
      <motion.div
        aria-hidden
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 0.7 }}
        viewport={{ once: true }}
        transition={{ duration: 2.2 }}
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'conic-gradient(from 180deg at 50% 0%, transparent 0deg, hsl(46 63% 72% / 0.08) 12deg, transparent 24deg, hsl(46 63% 72% / 0.06) 36deg, transparent 48deg)' }}
      />
      {/* drifting fog */}
      <motion.div
        aria-hidden
        initial={{ x: '-8%' }}
        whileInView={{ x: '8%' }}
        viewport={{ once: true }}
        transition={{ duration: 20, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut' }}
        className="absolute inset-x-0 bottom-0 h-2/3 pointer-events-none"
        style={{ background: 'linear-gradient(to top, hsl(200 14% 72% / 0.10), transparent)' }}
      />

      <div className="relative z-10 px-6 text-center max-w-xl">
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.8 }}
          className="font-cormorant italic text-2xl md:text-3xl text-[hsl(var(--garden-cream))]/70 leading-relaxed"
        >
          Step softly &mdash; the trees open slowly, the way memory does.
        </motion.p>
        <motion.button
          type="button"
          onClick={onContinue}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.6, delay: 0.6 }}
          className="group mt-12 inline-flex items-center gap-2.5 rounded-full border border-[hsl(var(--garden-gold))]/35 px-7 py-3 text-[hsl(var(--garden-cream))] hover:border-[hsl(var(--garden-gold))] transition-colors"
        >
          <span className="font-body text-[11px] uppercase tracking-[0.3em]">Walk deeper</span>
          <ArrowDown className="w-3.5 h-3.5 group-hover:translate-y-0.5 transition-transform" />
        </motion.button>
      </div>
    </GardenScene>
  );
}