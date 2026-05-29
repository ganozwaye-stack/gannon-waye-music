import React from 'react';
import { motion } from 'framer-motion';
import MovingHeart from './MovingHeart';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export default function MumLetterSection() {
  return (
    <>
      {/* Carrying Her With Me */}
      <section className="px-4 md:px-8 max-w-3xl mx-auto py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <p className="font-body text-[10px] tracking-[0.5em] uppercase gradient-gold-glow mb-3">Carrying Her With Me</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-card/30 border border-primary/10 rounded-3xl p-8 md:p-10 mb-8"
        >
          <div className="font-body text-foreground/70 leading-relaxed text-base space-y-5">
            <p>Some love does not disappear. It changes form.</p>
            <p>It becomes memory, ritual, grief, instinct, and presence.</p>
            <p>
              I carry my mum with me in the things I remember, the choices I make, the love I give, and the parts of me that survived because of her.
            </p>
          </div>

          <div className="border-l-2 border-primary/40 pl-5 my-8">
            <p className="font-display text-xl md:text-2xl italic text-foreground/80">
              "Even while leaving, you were still loving me."
            </p>
          </div>

          {/* Swallow tattoo image */}
          <div className="rounded-xl overflow-hidden border border-primary/10">
            <img
              src="https://media.base44.com/images/public/69eb7905ca6eb4180010f794/f739f95a9_7A480C51-5118-4A98-899B-6885A7AC415A.jpg"
              alt="From Mum's chest to mine — swallow tattoo"
              className="w-full object-cover max-h-80"
              loading="lazy"
            />
          </div>
          <p className="font-body text-xs text-muted-foreground/50 text-center mt-3 italic">From her chest to mine. A swallow, always flying home.</p>
        </motion.div>
      </section>

      {/* Letter to Mum */}
      <section className="px-4 md:px-8 max-w-3xl mx-auto py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <p className="font-body text-[10px] tracking-[0.5em] uppercase gradient-gold-glow mb-3">A Letter To Mum</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-card/30 border border-primary/10 rounded-3xl p-8 md:p-12"
        >
          <div className="font-body text-foreground/75 leading-relaxed text-base space-y-5 italic">
            <p>Mum,</p>
            <p>I miss you more than words can hold.</p>
            <p>
              You were my best friend, my safe place, my wisdom, my sounding board, my protector, and one of the greatest loves of my life.
            </p>
            <p>So much of who I am still reaches for you.</p>
            <p>Sometimes I still go to call you.<br />
            Sometimes I still need your voice.<br />
            Sometimes I still cannot believe you are not here.</p>
            <p>But I also know this.</p>
            <p>The love you gave me did not end.</p>
            <p>
              It lives on in me.<br />
              In how I love.<br />
              In what I survive.<br />
              In what I create.<br />
              In the songs I write.<br />
              In the parts of me that keep going.
            </p>
            <p>Thank you for loving me so deeply.<br />
            Thank you for seeing me.<br />
            Thank you for being home.</p>
            <p>I will carry you with me, always.</p>
          </div>

          <div className="mt-8 pt-8 border-t border-primary/10">
            <p className="font-body text-sm text-foreground/60 not-italic">Love always,</p>
            <p className="font-display text-2xl gradient-gold-glow mt-1">Gannon x</p>
          </div>
        </motion.div>
      </section>

      {/* Closing */}
      <section className="px-4 md:px-8 max-w-2xl mx-auto py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="space-y-6"
        >
          <p className="font-body text-[10px] tracking-[0.5em] uppercase gradient-gold-glow">Forever Loved</p>
          <MovingHeart size="lg" showLabel={true} label="Still carrying your love" />
          <p className="font-display text-2xl md:text-3xl text-foreground/70 italic mt-4">
            Some people leave the world,<br />but never leave the heart.
          </p>
          <p className="font-body text-sm text-muted-foreground/60">
            Sonia Katisa Waye · 1961–2022 · Forever in our hearts
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center mt-8">
            <Link to="/">
              <Button variant="outline" className="rounded-full border-primary/30 text-primary hover:bg-primary/10 font-body text-xs tracking-wider uppercase px-8 py-5">
                Back Home
              </Button>
            </Link>
            <Link to="/music">
              <Button className="rounded-full gradient-gold-button border-0 font-body text-xs tracking-wider uppercase px-8 py-5">
                Explore My Music
              </Button>
            </Link>
          </div>
        </motion.div>
      </section>
    </>
  );
}