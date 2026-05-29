import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MovingHeart from './MovingHeart';

const WISDOM = {
  comfort: {
    label: 'I need comfort',
    icon: '🤍',
    response: 'Take a breath, my love. You do not have to solve your whole life tonight. Just get through this moment gently. That is enough. You are doing enough.',
  },
  strength: {
    label: 'I need strength',
    icon: '💛',
    response: 'You have survived things that tried to bury you. You are still here. That means something. That means everything.',
  },
  alone: {
    label: 'I feel alone',
    icon: '🌿',
    response: 'You may feel alone, but you are not unloved. Love does not disappear just because someone is no longer standing in the room. It stays. It stays in the people who carry you.',
  },
  mum_moment: {
    label: 'I need a mum moment',
    icon: '☕',
    response: 'Eat something. Have a coffee. Put your feet up. Then try again when your heart has caught up with your body. You are allowed to rest.',
  },
  keep_going: {
    label: 'I need to keep going',
    icon: '✨',
    response: 'Boy, you\'re not finished yet. Not even close. The fact that you\'re still standing, still asking, still trying — that\'s not nothing. That\'s everything.',
  },
  loved: {
    label: 'I need to feel loved',
    icon: '♥',
    response: 'You were loved before you knew how to explain yourself, and you are still worthy of love now. Exactly as you are. Right now. No conditions.',
  },
};

export default function WisdomGarden() {
  const [selected, setSelected] = useState(null);
  const card = selected ? WISDOM[selected] : null;

  return (
    <section id="sonias-garden" className="px-4 md:px-8 max-w-3xl mx-auto py-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-10"
      >
        <p className="font-body text-[10px] tracking-[0.5em] uppercase gradient-gold-glow mb-3">Sonia's Garden of Wisdom</p>
        <p className="font-body text-sm text-muted-foreground/65 leading-relaxed max-w-xl mx-auto">
          Sometimes the people we lose still leave behind a way of loving us.
        </p>
        <p className="font-body text-xs text-muted-foreground/40 mt-3 leading-relaxed max-w-md mx-auto">
          This space is inspired by my mum's heart, humour, strength, and the kind of wisdom she gave so freely. It is not here to replace her. Nothing could. It is here to honour the way she made people feel seen, held, and reminded they were not finished yet.
        </p>
        <p className="font-body text-[9px] text-muted-foreground/30 mt-3 italic">
          Responses inspired by Sonia's love, humour, strength, and the memories Gannon has shared.
        </p>
      </motion.div>

      {/* Buttons */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8">
        {Object.entries(WISDOM).map(([key, item]) => (
          <motion.button
            key={key}
            onClick={() => setSelected(selected === key ? null : key)}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className={`px-4 py-3 rounded-2xl font-body text-xs tracking-wide border transition-all duration-300 text-left flex items-center gap-2 ${
              selected === key
                ? 'border-primary bg-primary/15 text-primary'
                : 'border-border/25 bg-card/20 text-muted-foreground/70 hover:border-primary/30 hover:bg-card/35'
            }`}
          >
            <span className="text-base">{item.icon}</span>
            <span>{item.label}</span>
          </motion.button>
        ))}
      </div>

      {/* Response card */}
      <AnimatePresence mode="wait">
        {card && (
          <motion.div
            key={selected}
            initial={{ opacity: 0, y: 20, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.97 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="bg-card/35 backdrop-blur-sm border border-primary/20 rounded-3xl p-8 md:p-10 text-center"
            style={{ boxShadow: '0 0 40px rgba(212,175,55,0.06), 0 8px 32px rgba(0,0,0,0.4)' }}
          >
            <MovingHeart size="sm" />
            <p className="font-display text-xl md:text-2xl italic text-foreground/85 leading-relaxed mt-5 mb-5">
              "{card.response}"
            </p>
            <p className="font-body text-[10px] tracking-[0.4em] uppercase text-primary/40">
              Inspired by Sonia
            </p>

            <button
              onClick={() => {
                // Cycle to next
                const keys = Object.keys(WISDOM);
                const next = keys[(keys.indexOf(selected) + 1) % keys.length];
                setSelected(next);
              }}
              className="mt-6 inline-flex items-center gap-2 font-body text-xs tracking-wider uppercase text-muted-foreground/50 hover:text-primary/70 transition-colors border border-border/20 rounded-full px-5 py-2"
            >
              <span>♥</span> Another mum moment
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Default / no selection */}
      {!selected && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-6"
        >
          <p className="font-display text-lg italic text-foreground/30">"Boy, you're not finished yet."</p>
          <p className="font-body text-[10px] text-muted-foreground/25 mt-2 tracking-widest uppercase">Choose a moment above</p>
        </motion.div>
      )}

      {/* Safety note */}
      <p className="font-body text-[9px] text-muted-foreground/25 text-center mt-8 leading-relaxed max-w-sm mx-auto">
        If you are in immediate danger or need emergency support, please contact Lifeline on 13 11 14 or Beyond Blue on 1300 22 4636.
      </p>
    </section>
  );
}