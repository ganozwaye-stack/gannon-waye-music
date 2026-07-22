import React from 'react';
import { motion } from 'framer-motion';

const GOLD_EDGE = 'linear-gradient(135deg, #7f6125 0%, #b8913b 36%, #d8c071 50%, #b8913b 64%, #7f6125 100%)';

export default function WrappedGiftPlaceholder({ index = 0 }) {
  const offset = index % 3;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      whileHover={{ scale: 1.03 }}
      transition={{ duration: 0.4 }}
      className="relative h-full w-full overflow-hidden rounded-xl border border-primary/25 bg-[#080807]"
    >
      <div
        className="absolute inset-0 opacity-70"
        style={{
          background: `radial-gradient(circle at ${34 + offset * 14}% 20%, rgba(216,192,113,0.18), transparent 28%), linear-gradient(135deg, rgba(255,255,255,0.05), transparent 35%)`,
        }}
      />
      <div className="absolute inset-4 rounded-lg border border-primary/25" />
      <div className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-primary/25" />
      <div className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-primary/20" />

      <motion.div
        animate={{ opacity: [0.58, 0.95, 0.58] }}
        transition={{ duration: 3.4, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute left-1/2 top-1/2 h-20 w-20 -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{ background: GOLD_EDGE, boxShadow: '0 0 36px rgba(184,145,59,0.22)' }}
      />
      <div className="absolute left-1/2 top-1/2 flex h-[72px] w-[72px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-black/50 bg-[#0b0b0a]">
        <span className="font-display text-xl italic gradient-gold-glow">GW</span>
      </div>

      <div className="absolute inset-x-0 bottom-6 px-5 text-center">
        <p className="font-body text-[9px] tracking-[0.28em] uppercase gradient-gold-glow">
          Merch Reveal
        </p>
        <p className="mt-1 font-body text-[10px] text-foreground/45">
          Official artwork locked until launch
        </p>
      </div>
    </motion.div>
  );
}
