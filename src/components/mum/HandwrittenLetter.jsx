import React from 'react';
import { motion } from 'framer-motion';

// The letter flows into the page with no box: ink on air.
const LETTER_LINES = [
  { text: "Mum,", indent: false, size: 'opening', delay: 0 },
  { text: "", indent: false, size: 'space', delay: 0.1 },
  { text: "I still look for you in the morning.", indent: true, size: 'body', delay: 0.2 },
  { text: "In the way the light comes through the curtains.", indent: true, size: 'body', delay: 0.3 },
  { text: "In the smell of coffee. In the sound of nothing.", indent: true, size: 'body', delay: 0.4 },
  { text: "", indent: false, size: 'space', delay: 0.45 },
  { text: "You were the kind of love that doesn't announce itself -", indent: true, size: 'body', delay: 0.5 },
  { text: "it just shows up. Every day. Without fail.", indent: true, size: 'body', delay: 0.6 },
  { text: "A cup of tea. A phone call. A knowing look.", indent: true, size: 'body', delay: 0.7 },
  { text: "", indent: false, size: 'space', delay: 0.75 },
  { text: "I wrote songs because you believed I could.", indent: true, size: 'body', delay: 0.8 },
  { text: "I kept going because I could hear your voice saying so.", indent: true, size: 'body', delay: 0.9 },
  { text: "Even now, when things get hard, I still hear it.", indent: true, size: 'body', delay: 1.0 },
  { text: "", indent: false, size: 'space', delay: 1.05 },
  { text: "I don't know how to write this without you here to read it.", indent: true, size: 'body', delay: 1.1 },
  { text: "But I write it anyway - because that's what you would have wanted.", indent: true, size: 'body', delay: 1.2 },
  { text: "You always wanted the truth. You always wanted the feeling.", indent: true, size: 'body', delay: 1.3 },
  { text: "", indent: false, size: 'space', delay: 1.35 },
  { text: "So here it is, Mum.", indent: true, size: 'body', delay: 1.4 },
  { text: "The world is quieter without you in it.", indent: true, size: 'emphasis', delay: 1.5 },
  { text: "And I am louder than I've ever been.", indent: true, size: 'emphasis', delay: 1.6 },
  { text: "Because you taught me that both things can be true.", indent: true, size: 'body', delay: 1.7 },
  { text: "", indent: false, size: 'space', delay: 1.75 },
  { text: "Forever your boy,", indent: true, size: 'closing', delay: 1.8 },
  { text: "Gannon", indent: true, size: 'signature', delay: 2.0 },
];

const sizeMap = {
  opening: { fontSize: 'clamp(1.6rem, 4vw, 2.4rem)', color: 'rgba(216,192,113,0.75)', mb: '0.4em' },
  body: { fontSize: 'clamp(1rem, 2.5vw, 1.35rem)', color: 'rgba(245,235,210,0.62)', mb: '0.15em' },
  emphasis: { fontSize: 'clamp(1.05rem, 2.8vw, 1.45rem)', color: 'rgba(245,220,160,0.75)', mb: '0.15em' },
  closing: { fontSize: 'clamp(0.9rem, 2vw, 1.1rem)', color: 'rgba(216,192,113,0.50)', mb: '0.1em' },
  signature: { fontSize: 'clamp(2rem, 6vw, 3.5rem)', color: 'rgba(212,175,55,0.70)', mb: '0' },
  space: { fontSize: '0.6rem', color: 'transparent', mb: '0.4em' },
};

export default function HandwrittenLetter() {
  return (
    <section className="relative py-20 px-6">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="text-center mb-16"
        >
          <p className="font-body text-[9px] tracking-[0.6em] uppercase" style={{ color: 'rgba(212,175,55,0.28)' }}>
            A Letter Unsent - Written in Love
          </p>
          <div className="flex items-center gap-3 justify-center mt-4">
            <div className="w-16 h-px" style={{ background: 'linear-gradient(to right, transparent, rgba(212,175,55,0.22))' }} />
            <div className="w-1.5 h-1.5 rounded-full" style={{ background: 'rgba(212,175,55,0.25)' }} />
            <div className="w-16 h-px" style={{ background: 'linear-gradient(to left, transparent, rgba(212,175,55,0.22))' }} />
          </div>
        </motion.div>

        <div className="relative">
          <div
            className="absolute left-8 top-0 bottom-0 w-px"
            style={{ background: 'linear-gradient(to bottom, transparent, rgba(212,175,55,0.08) 20%, rgba(212,175,55,0.08) 80%, transparent)' }}
          />

          {LETTER_LINES.map((line, i) => {
            const style = sizeMap[line.size];
            if (line.size === 'space') return <div key={i} style={{ height: '1.2em' }} />;

            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -8 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-10px' }}
                transition={{ duration: 0.9, delay: Math.min(line.delay * 0.4, 0.6), ease: 'easeOut' }}
                style={{
                  paddingLeft: line.indent ? '3rem' : '0',
                  marginBottom: style.mb,
                }}
              >
                <span
                  style={{
                    fontFamily: line.size === 'signature'
                      ? "'Dancing Script', 'Brush Script MT', cursive"
                      : line.size === 'closing'
                        ? "'Dancing Script', 'Brush Script MT', cursive"
                        : "'Playfair Display', serif",
                    fontStyle: line.size === 'signature' || line.size === 'closing' ? 'normal' : 'italic',
                    fontSize: style.fontSize,
                    color: style.color,
                    lineHeight: 1.5,
                    display: 'block',
                    letterSpacing: line.size === 'signature' ? '0.02em' : 'normal',
                  }}
                >
                  {line.text}
                </span>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          whileInView={{ opacity: 1, scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, delay: 0.3 }}
          className="mt-12 flex items-center gap-4"
          style={{ transformOrigin: 'left' }}
        >
          <div className="flex-1 h-px" style={{ background: 'linear-gradient(to right, rgba(212,175,55,0.20), transparent)' }} />
          <span style={{ color: 'rgba(212,175,55,0.25)', fontSize: '0.6rem', letterSpacing: '0.3em' }}>LOVE</span>
        </motion.div>
      </div>
    </section>
  );
}
