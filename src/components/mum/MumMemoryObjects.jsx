import React from 'react';
import { motion } from 'framer-motion';

const OBJECTS = [
  { icon: '☕', label: 'Morning Coffee', desc: 'First thing, every single day. Non-negotiable.' },
  { icon: '🌿', label: 'The Garden', desc: 'Her quiet place. Plants, sunlight, peace.' },
  { icon: '✨', label: 'Gold Jewellery', desc: 'Always wearing it. Gold earrings, rings, her signature.' },
  { icon: '🍃', label: 'Rollies', desc: 'Hand-rolled. Her way. She didn\'t apologise for it.' },
  { icon: '🧥', label: 'Burgundy Robe', desc: 'Worn in the garden. Worn everywhere. Hers.' },
  { icon: '🥿', label: 'Ugg Slippers', desc: 'She wrote a letter in them. A letter I still have.' },
  { icon: '🐾', label: 'The Dogs', desc: 'Big, loyal, warm. Part of the family.' },
  { icon: '🌸', label: 'Orange Flowers', desc: 'Gerberas. On her casket. In every goodbye.' },
  { icon: '🌴', label: 'Elephant Ears', desc: 'Big lush leaves. Her garden had them. Memory lives there.' },
  { icon: '🕯️', label: 'Warm Light', desc: 'Her home always felt lit from inside. By her.' },
  { icon: '🎂', label: 'Birthday Cake', desc: '"Sonia xo" — one last birthday, on a cruise.' },
  { icon: '🐻', label: 'Mumma Bear', desc: 'What she called herself. Always. xoxo.' },
];

export default function MumMemoryObjects() {
  return (
    <section className="px-4 md:px-8 max-w-5xl mx-auto py-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-4"
      >
        <p className="font-body text-[10px] tracking-[0.5em] uppercase gradient-gold-glow mb-3">Her World</p>
        <p className="font-body text-sm text-muted-foreground/60 max-w-lg mx-auto">
          Some memories live in objects, habits, textures, and the quiet details of everyday life.
        </p>
      </motion.div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mt-10">
        {OBJECTS.map((obj, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.04 }}
            className="bg-card/25 border border-primary/10 hover:border-primary/25 hover:bg-card/40 rounded-2xl p-4 text-center transition-all duration-400 group"
          >
            <p className="text-3xl mb-2 group-hover:scale-110 transition-transform duration-300 inline-block">{obj.icon}</p>
            <p className="font-display text-sm text-foreground/80 mb-1.5 leading-snug">{obj.label}</p>
            <p className="font-body text-[10px] text-muted-foreground/55 leading-relaxed">{obj.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}