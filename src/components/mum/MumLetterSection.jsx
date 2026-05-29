import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import MovingHeart from './MovingHeart';

const LETTER_LINES = [
  'Mum, I miss you more than words can hold.',
  'You were my best friend, my safe place, my wisdom, my sounding board, my protector, and one of the greatest loves of my life.',
  'So much of who I am still reaches for you.',
  'Sometimes I still go to call you.',
  'Sometimes I still need your voice.',
  'Sometimes I still cannot believe you are not here.',
  'But I also know this.',
  'The love you gave me did not end.',
  'It lives on in me.',
  'In how I love.',
  'In what I survive.',
  'In what I create.',
  'In the songs I write.',
  'In the parts of me that keep going.',
  'Thank you for loving me so deeply.',
  'Thank you for seeing me.',
  'Thank you for being home.',
  'I will carry you with me, always.',
];

export default function MumLetterSection() {
  return (
    <section className="px-4 md:px-8 max-w-2xl mx-auto py-24">

      {/* Heading */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
        className="text-center mb-12 gsap-reveal"
      >
        <p className="font-body text-[9px] tracking-[0.6em] uppercase text-primary/40 mb-3">A Letter To Mum</p>
        <h2 className="font-display text-4xl md:text-5xl text-foreground">A Letter To Mum</h2>
      </motion.div>

      {/* Letter card */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1, delay: 0.2 }}
        className="relative rounded-3xl p-8 md:p-12"
        style={{
          background: 'linear-gradient(145deg, rgba(22,8,16,0.95) 0%, rgba(18,10,8,0.9) 100%)',
          border: '1px solid rgba(212,175,55,0.15)',
          boxShadow: '0 0 60px rgba(212,175,55,0.06), 0 20px 60px rgba(0,0,0,0.5)',
        }}
      >
        {/* Gold top edge glow */}
        <div className="absolute top-0 left-1/4 right-1/4 h-px" style={{
          background: 'linear-gradient(to right, transparent, rgba(212,175,55,0.4), transparent)'
        }} />

        <div className="space-y-4">
          {LETTER_LINES.map((line, i) => (
            <motion.p
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.04 }}
              className={`font-body leading-relaxed ${
                line === 'But I also know this.'
                  ? 'text-foreground/90 font-medium mt-8'
                  : line.startsWith('Thank you')
                    ? 'text-foreground/80'
                    : ['It lives on in me.', 'In how I love.', 'In what I survive.', 'In what I create.', 'In the songs I write.', 'In the parts of me that keep going.'].includes(line)
                      ? 'text-primary/70 pl-4 text-sm'
                      : 'text-foreground/65'
              }`}
            >
              {line}
            </motion.p>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8 }}
          className="mt-10 pt-8 border-t border-primary/10 flex flex-col items-end gap-1"
        >
          <p className="font-body text-sm text-muted-foreground/50">Love always,</p>
          <p className="font-display text-2xl text-foreground/70 italic">Gannon</p>
        </motion.div>

        {/* Bottom gold edge glow */}
        <div className="absolute bottom-0 left-1/4 right-1/4 h-px" style={{
          background: 'linear-gradient(to right, transparent, rgba(212,175,55,0.25), transparent)'
        }} />
      </motion.div>

      {/* Forever Loved closing */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1, delay: 0.3 }}
        className="text-center mt-20"
      >
        <p className="font-body text-[9px] tracking-[0.6em] uppercase text-primary/40 mb-4">Forever Loved</p>
        <p className="font-display text-2xl md:text-3xl text-foreground/70 italic leading-relaxed mb-2">
          Some people leave the world,<br />but never leave the heart.
        </p>
        <p className="font-body text-xs text-muted-foreground/40 mb-8 tracking-wider">Still carrying your love.</p>

        <MovingHeart size="sm" />

        <p className="font-body text-xs text-muted-foreground/30 italic mt-6 mb-10">
          Thank you for spending a moment with her.
        </p>

        <div className="flex flex-wrap justify-center gap-4">
          <Link to="/">
            <button className="rounded-full border border-border/30 text-muted-foreground/60 hover:text-foreground transition-colors font-body text-xs tracking-wider uppercase px-7 py-3">
              Back Home
            </button>
          </Link>
          <Link to="/music">
            <button className="rounded-full gradient-gold-button font-body text-xs tracking-wider uppercase px-7 py-3">
              Explore My Music
            </button>
          </Link>
        </div>
      </motion.div>
    </section>
  );
}