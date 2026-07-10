import React from 'react';
import { motion } from 'framer-motion';

const OBJECTS = [
  { icon: '☕', label: 'Morning Coffee', desc: 'First thing, every single day. Non-negotiable.' },
  { icon: '🌿', label: 'The Garden', desc: 'Her quiet place. Plants, sunlight, peace.' },
  { icon: '✨', label: 'Gold Jewellery', desc: 'Always wearing it. Gold earrings, rings, her signature.' },
  { icon: '🍃', label: 'Rollies', desc: 'Hand-rolled. Her way. She didn\'t apologise for it.' },
  { icon: '🧥', label: 'Burgundy Robe', desc: 'Worn in the garden. Worn everywhere. Hers.' },
  { icon: '🥿', label: 'Ugg Slippers', desc: 'She wore them in the letter. A letter I still have.' },
  { icon: '🐾', label: 'The Dogs', desc: 'Big, loyal, warm. Part of the family — always.' },
  { icon: '🌸', label: 'Orange Gerberas', desc: 'Her colour, her softness, her bloom — still so her.' },
  { icon: '🌴', label: 'Elephant Ears', desc: 'Big lush leaves. Her garden had them. Memory lives there.' },
  { icon: '🕯️', label: 'Warm Light', desc: 'Her home always felt lit from inside. By her.' },
  { icon: '🎂', label: 'Birthday Cake', desc: '"Sonia xo" — one last birthday, on a cruise.' },
  { icon: '🐻', label: 'Mumma Bear', desc: 'What she called herself. Always. xoxo.' },
];

export default function MumMemoryObjects() {
  return (
    <section className="relative px-4 md:px-8 max-w-5xl mx-auto py-20 overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-4"
      >
        <p className="font-body text-[10px] tracking-[0.5em] uppercase gradient-gold-glow mb-3">Her World</p>
        <p className="font-body text-sm text-muted-foreground/55 max-w-lg mx-auto leading-relaxed">
          Some memories live in objects, habits, textures, and the quiet details of everyday life.
        </p>
      </motion.div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mt-12">
        {OBJECTS.map((obj, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 16, scale: 0.92 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.04, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            whileHover={{ y: -4, scale: 1.03 }}
            className="gsap-reveal bg-card/20 border border-primary/10 hover:border-primary/28 rounded-2xl p-4 text-center transition-colors duration-300 group cursor-default"
            style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.3)' }}
          >
            <motion.p
              className="text-3xl mb-2 inline-block"
              whileHover={{ scale: 1.15, rotate: [0, -5, 5, 0] }}
              transition={{ duration: 0.4 }}
            >
              {obj.icon}
            </motion.p>
            <p className="font-display text-sm text-foreground/78 mb-1.5 leading-snug">{obj.label}</p>
            <p className="font-body text-[10px] text-muted-foreground/50 leading-relaxed">{obj.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
