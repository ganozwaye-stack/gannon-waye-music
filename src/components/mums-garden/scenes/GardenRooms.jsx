import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowDown, X } from 'lucide-react';
import GardenScene from './GardenScene';

const ROOMS_BG = 'linear-gradient(180deg, hsl(156 40% 4%) 0%, hsl(150 33% 9%) 50%, hsl(156 45% 3%) 100%)';

const ALCOVES = [
  { name: 'Carla', line: 'Sister &middot; held close in the garden light' },
  { name: 'Gannon', line: 'Son &middot; the songs carry her forward' },
  { name: 'Jarrad', line: 'Family &middot; quiet strength among the leaves' },
  { name: 'Crystal', line: 'Family &middot; laughter in the green rooms' },
  { name: 'Everyday gold', line: 'Small rituals that made the garden home' },
];

/**
 * Scene 6 — Garden Rooms & Doorways
 * Natural stopping points leading to focused memory alcoves.
 */
export default function GardenRooms({ onContinue }) {
  const [open, setOpen] = useState(null);

  return (
    <GardenScene id="rooms" background={ROOMS_BG} minHeight="110vh">
      <div className="relative z-10 w-full max-w-5xl px-6 py-20 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.8 }}
          className="font-cormorant text-4xl md:text-5xl text-[hsl(var(--garden-cream))]/80"
        >
          Garden rooms &amp; doorways
        </motion.h2>
        <p className="mt-4 font-body text-[11px] uppercase tracking-[0.35em] text-[hsl(var(--garden-cream))]/35">
          Open a doorway &middot; return when you are ready
        </p>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {ALCOVES.map((a, i) => (
            <motion.button
              key={a.name}
              type="button"
              onClick={() => setOpen(a)}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1.4, delay: i * 0.12 }}
              className="group relative overflow-hidden rounded-sm border border-[hsl(var(--garden-gold))]/20 bg-black/25 p-6 text-left hover:border-[hsl(var(--garden-gold))]/50 transition-colors"
            >
              <span className="block font-body text-[10px] uppercase tracking-[0.3em] text-[hsl(var(--garden-gold))]/70 mb-3">
                Doorway {String(i + 1).padStart(2, '0')}
              </span>
              <span className="block font-cormorant text-2xl text-[hsl(var(--garden-cream))]/85">{a.name}</span>
              <span className="mt-2 block font-body text-xs text-[hsl(var(--garden-cream))]/45" dangerouslySetInnerHTML={{ __html: a.line }} />
            </motion.button>
          ))}
        </div>

        <button
          type="button"
          onClick={onContinue}
          className="group mt-14 inline-flex items-center gap-2.5 rounded-full border border-[hsl(var(--garden-gold))]/35 px-7 py-3 text-[hsl(var(--garden-cream))] hover:border-[hsl(var(--garden-gold))] transition-colors"
        >
          <span className="font-body text-[11px] uppercase tracking-[0.3em]">To the bench</span>
          <ArrowDown className="w-3.5 h-3.5 group-hover:translate-y-0.5 transition-transform" />
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 z-30 flex items-center justify-center bg-black/70 backdrop-blur-sm px-6"
            onClick={() => setOpen(null)}
          >
            <motion.div
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="relative max-w-md rounded-sm border border-[hsl(var(--garden-gold))]/30 bg-[hsl(156 35% 5%)]/90 p-8 text-center"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => setOpen(null)}
                className="absolute top-3 right-3 text-[hsl(var(--garden-cream))]/50 hover:text-[hsl(var(--garden-gold))]"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
              <h3 className="font-cormorant text-3xl text-[hsl(var(--garden-cream))]/90">{open.name}</h3>
              <p className="mt-3 font-cormorant italic text-[hsl(var(--garden-cream))]/60" dangerouslySetInnerHTML={{ __html: open.line }} />
              <div className="mx-auto mt-6 aspect-[4/3] w-full max-w-[240px] rounded-sm border border-dashed border-[hsl(var(--garden-gold))]/25 flex items-center justify-center">
                <span className="px-4 text-center font-body text-[10px] uppercase tracking-[0.28em] text-[hsl(var(--garden-cream))]/35">
                  Awaiting approved photograph
                </span>
              </div>
              <p className="mt-6 font-body text-[10px] uppercase tracking-[0.3em] text-[hsl(var(--garden-cream))]/40">
                Tap anywhere to return to the garden
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </GardenScene>
  );
}