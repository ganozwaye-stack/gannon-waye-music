import React from 'react';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import MovingHeart from './MovingHeart';

// Best portrait of Sonia — silver hair, glasses, gold earrings, warm smile
const HERO_IMG = 'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/7df2f998b_A181BD35-93F3-41FB-B671-2FABC71B701A.jpg';
// Burgundy robe / garden scene
const ROBE_IMG = 'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/3892d6143_093DD58D-2A3E-46F2-B235-ABD31D530F48.jpg';
// Casket with flowers
const FLOWERS_IMG = 'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/d4bf542bf_E6BC1469-782B-438C-99BE-17596D2C85EC.jpg';

export default function MumHero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">

      {/* ── Background layers ── */}
      {/* Deep base */}
      <div className="absolute inset-0 z-0" style={{
        background: 'linear-gradient(160deg, #0d0608 0%, #1a0a0c 40%, #0f1108 70%, #080d0a 100%)'
      }} />

      {/* Background photo — flowers/casket, very dark */}
      <div className="absolute inset-0 z-[1] opacity-[0.07]"
        style={{ backgroundImage: `url(${FLOWERS_IMG})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
      />

      {/* Garden robe photo — left side, atmospheric */}
      <div className="absolute left-0 top-0 bottom-0 w-1/2 z-[2] opacity-[0.12] hidden md:block"
        style={{ backgroundImage: `url(${ROBE_IMG})`, backgroundSize: 'cover', backgroundPosition: 'right center' }}
      />

      {/* Warm gold vignette overlay */}
      <div className="absolute inset-0 z-[3]" style={{
        background: 'radial-gradient(ellipse at 60% 40%, rgba(180,100,30,0.08) 0%, transparent 65%), radial-gradient(ellipse at 20% 80%, rgba(80,40,10,0.15) 0%, transparent 50%)'
      }} />

      {/* Top fade */}
      <div className="absolute top-0 left-0 right-0 h-48 z-[4]" style={{
        background: 'linear-gradient(to bottom, rgba(13,6,8,1) 0%, transparent 100%)'
      }} />

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-64 z-[4]" style={{
        background: 'linear-gradient(to top, rgba(13,6,8,1) 0%, transparent 100%)'
      }} />

      {/* ── Sonia portrait — right/centre, cinematic ── */}
      <motion.div
        className="absolute right-0 top-0 bottom-0 w-full md:w-[55%] z-[5] flex items-center justify-end md:justify-center"
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 2, ease: 'easeOut' }}
      >
        <div className="relative h-full w-full">
          <img
            src={HERO_IMG}
            alt="Sonia Katisa Waye"
            className="absolute inset-0 w-full h-full object-cover object-top"
            style={{
              maskImage: 'linear-gradient(to right, transparent 0%, rgba(0,0,0,0.3) 20%, rgba(0,0,0,0.85) 45%, rgba(0,0,0,0.85) 75%, transparent 100%)',
              WebkitMaskImage: 'linear-gradient(to right, transparent 0%, rgba(0,0,0,0.3) 20%, rgba(0,0,0,0.85) 45%, rgba(0,0,0,0.85) 75%, transparent 100%)',
            }}
          />
          {/* Left fade for portrait */}
          <div className="absolute inset-0" style={{
            background: 'linear-gradient(to right, rgba(13,6,8,1) 0%, rgba(13,6,8,0.6) 25%, transparent 55%)'
          }} />
        </div>
      </motion.div>

      {/* ── Hero text — left ── */}
      <div className="relative z-[10] w-full max-w-5xl mx-auto px-6 md:px-12 grid md:grid-cols-2 items-center gap-8">
        <div>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="font-body text-[10px] tracking-[0.7em] uppercase text-primary/60 mb-6"
          >
            A Tribute
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.5 }}
            className="font-display text-6xl md:text-8xl text-foreground leading-none mb-3"
          >
            For Mum
          </motion.h1>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9, duration: 1 }}
            className="flex items-center gap-3 mb-2"
          >
            <div className="h-px w-8 bg-primary/40" />
            <MovingHeart size="sm" />
            <div className="h-px w-8 bg-primary/40" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 1 }}
          >
            <p className="font-display text-xl md:text-2xl text-foreground/70 italic mb-1">Sonia Katisa Waye</p>
            <p className="font-body text-sm text-primary/60 tracking-widest mb-8">1961 – 2022</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.3, duration: 1 }}
            className="border-l-2 border-primary/30 pl-5 mb-8"
          >
            <p className="font-display text-xl md:text-2xl text-foreground/85 italic leading-relaxed">
              "Your last breath took mine away,<br />
              there's not much more I have to say."
            </p>
            <p className="font-body text-[10px] text-muted-foreground/50 mt-3 tracking-[0.3em] uppercase">Without You Here · Gannon Waye</p>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.6 }}
            className="font-body text-sm text-foreground/50 leading-relaxed mb-10 max-w-sm"
          >
            A tribute to the woman whose love, wisdom, strength and protection still carry me.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.8 }}
            className="flex flex-wrap gap-3"
          >
            <a href="#who-she-was">
              <Button variant="outline" className="rounded-full border-primary/40 text-primary hover:bg-primary/10 font-body text-xs tracking-wider uppercase px-6 py-4">
                Read Her Story
              </Button>
            </a>
            <a href="#the-song">
              <Button className="rounded-full gradient-gold-button border-0 font-body text-xs tracking-wider uppercase px-6 py-4">
                Without You Here
              </Button>
            </a>
            <a href="#memories">
              <Button variant="ghost" className="rounded-full text-muted-foreground hover:text-foreground font-body text-xs tracking-wider uppercase px-6 py-4">
                Memories
              </Button>
            </a>
          </motion.div>
        </div>

        {/* Empty right column — portrait fills it visually */}
        <div className="hidden md:block" />
      </div>

      {/* Scroll cue */}
      <motion.div
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-[10]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.2 }}
      >
        <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 2, repeat: Infinity }}>
          <ChevronDown className="w-5 h-5 text-primary/30" />
        </motion.div>
      </motion.div>
    </section>
  );
}