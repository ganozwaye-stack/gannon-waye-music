import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Shirt, Coffee, MessageSquare, ShieldCheck, ArrowRight } from 'lucide-react';

const HOODIE_PUBLIC =
  'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/e3b61bc7d_hoodie-public-solidarity-supermarket-4x5.png';
const HOODIE_STUDIO =
  'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/96ccf42ee_hoodie-premium-studio-back-hero-4x5.png';
const MUG_MORNING =
  'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/b169e8aea_mug-morning-reflection-4x5.png';
const MUG_EVENING =
  'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/ba1e27a28_mug-evening-songwriting-instagram-4x5.png';

const CAROUSEL_SLIDES = [
  'No backstory required.',
  'Respect Is Earned, Not a Game You Make Me Play.',
  'Wear it where the message can be seen.',
  'Put it beside the moments that are yours.',
  'For survivors, supporters and anyone choosing clearer boundaries.',
  'Carry the Message. Explore the collection at gannonwaye.com.',
];

function ModuleBlock({ eyebrow, icon: Icon, hook, body, images, alt }) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <Icon className="w-4 h-4 text-primary" />
        <p className="font-body text-[10px] tracking-[0.4em] uppercase text-primary/70">{eyebrow}</p>
      </div>
      <h2 className="font-display text-3xl sm:text-4xl md:text-5xl text-foreground leading-tight mb-5 text-left max-w-2xl">
        {hook}
      </h2>
      <div className="grid sm:grid-cols-2 gap-4 mb-6">
        {images.map((src, i) => (
          <div
            key={i}
            className="relative rounded-2xl overflow-hidden border border-border/30 aspect-[4/5] bg-card"
          >
            <img src={src} alt={alt} className="w-full h-full object-cover" loading="lazy" />
          </div>
        ))}
      </div>
      <p className="font-body text-sm sm:text-base text-foreground/80 leading-relaxed text-left max-w-2xl">
        {body}
      </p>
      <div className="mt-6">
        <Link to="/store">
          <Button variant="outline" className="rounded-full font-body text-sm tracking-wider uppercase">
            Explore the collection <ArrowRight className="w-4 h-4" />
          </Button>
        </Link>
      </div>
    </div>
  );
}

export default function CarryTheMessage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <img src={HOODIE_STUDIO} alt="" className="w-full h-full object-cover opacity-20" />
          <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/85 to-background" />
        </div>
        <div className="relative z-10 max-w-5xl mx-auto px-5 sm:px-8 pt-28 pb-20 md:pt-36 md:pb-28">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-body text-[10px] sm:text-xs tracking-[0.5em] uppercase text-primary/70 mb-5"
          >
            Carry the Message
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="font-display text-4xl sm:text-6xl md:text-7xl leading-[1.05] text-left max-w-4xl"
          >
            <span className="text-foreground">Respect Is Earned,</span>
            <br />
            <span className="gradient-gold-text">Not a Game You Make Me Play.</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.12 }}
            className="font-body text-sm sm:text-base text-muted-foreground mt-6 max-w-xl text-left leading-relaxed"
          >
            A sentence on a page. A standard in public. A visible statement of dignity and solidarity — for survivors, supporters, and anyone choosing clearer boundaries.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.18 }}
            className="flex flex-wrap gap-3 mt-8"
          >
            <Link to="/store">
              <Button className="gradient-gold-button border-0 rounded-full font-body text-sm tracking-wider uppercase">
                Explore the collection
              </Button>
            </Link>
            <Link to="/back-this">
              <Button variant="outline" className="rounded-full font-body text-sm tracking-wider uppercase">
                Carry the message
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Purpose */}
      <section className="max-w-3xl mx-auto px-5 sm:px-8 py-16 md:py-20 border-t border-border/20">
        <p className="font-body text-base sm:text-lg text-foreground/85 leading-relaxed text-left">
          This collection carries a clear statement about dignity, boundaries and respect into ordinary life. It can hold personal meaning for people who have survived domestic violence, for supporters, and for anyone choosing a clearer standard in how they are treated.
        </p>
        <p className="font-body text-sm text-muted-foreground mt-5 leading-relaxed text-left">
          The merchandise is not presented as treatment, protection or proof of anybody's experience. It is a visible statement, a personal reminder, and a way to let another person encounter the message without asking anyone to disclose their story.
        </p>
      </section>

      {/* Hoodie module */}
      <section className="max-w-5xl mx-auto px-5 sm:px-8 py-10 md:py-14">
        <ModuleBlock
          eyebrow="The Anthem You Can Wear"
          icon={Shirt}
          hook="Wear the standard where it can be seen."
          body="The hoodie carries that standard into everyday places — the shops, the street, the school run, the coffee line. It can mean something personal to the person wearing it, while quietly reminding somebody else that they are not alone."
          images={[HOODIE_PUBLIC, HOODIE_STUDIO]}
          alt="Black Gannon Waye hoodie shown from the back in a softly lit public setting. The back reads, Respect Is Earned, Not a Game You Make Me Play. Lettering centred on deep charcoal."
        />
      </section>

      {/* Mug module */}
      <section className="max-w-5xl mx-auto px-5 sm:px-8 py-10 md:py-14 border-t border-border/20">
        <ModuleBlock
          eyebrow="Begin With the Standard"
          icon={Coffee}
          hook="Put the words where the day begins."
          body="The mug places the message inside an ordinary ritual — coffee, tea, writing, planning, or simply sitting still for a moment. A quiet moment. A clear reminder."
          images={[MUG_MORNING, MUG_EVENING]}
          alt="Gannon Waye mug beside an open cream notebook and pen on a dark timber table, with warm steam rising. The mug carries the Respect Is Earned campaign artwork."
        />
      </section>

      {/* No Backstory Required */}
      <section className="max-w-3xl mx-auto px-5 sm:px-8 py-16 md:py-20 border-t border-border/20">
        <div className="flex items-center gap-2 mb-5">
          <MessageSquare className="w-4 h-4 text-primary" />
          <p className="font-body text-[10px] tracking-[0.4em] uppercase text-primary/70">No Backstory Required</p>
        </div>
        <h2 className="font-display text-3xl sm:text-4xl text-foreground leading-tight mb-6 text-left">
          You do not have to explain why the words matter to you.
        </h2>
        <ol className="space-y-3">
          {CAROUSEL_SLIDES.map((s, i) => (
            <li key={i} className="flex gap-4 items-start">
              <span className="font-display text-sm text-primary/60 tabular-nums pt-1 w-6 shrink-0">
                {String(i + 1).padStart(2, '0')}
              </span>
              <span className="font-body text-sm sm:text-base text-foreground/80 leading-relaxed text-left">
                {s}
              </span>
            </li>
          ))}
        </ol>
      </section>

      {/* Positioning / safety strip */}
      <section className="max-w-5xl mx-auto px-5 sm:px-8 py-10">
        <div className="rounded-2xl border border-border/30 bg-card/50 p-6 md:p-8">
          <div className="flex items-center gap-2 mb-4">
            <ShieldCheck className="w-4 h-4 text-primary" />
            <p className="font-body text-[10px] tracking-[0.4em] uppercase text-primary/70">What this is — and isn't</p>
          </div>
          <div className="grid sm:grid-cols-2 gap-6 text-left">
            <p className="font-body text-sm text-foreground/85 leading-relaxed">
              A statement about dignity, respect and clearer boundaries. A visible message of solidarity. A personal reminder. Relevant to survivors, supporters and anyone who connects with the words.
            </p>
            <p className="font-body text-sm text-muted-foreground leading-relaxed">
              Not treatment, therapy or counselling. Not a substitute for professional support. Not proof of survival, courage or recovery. Not a safety device or abuse prevention. No backstory required.
            </p>
          </div>
        </div>
      </section>

      {/* CTA footer */}
      <section className="max-w-3xl mx-auto px-5 sm:px-8 py-16 md:py-24 text-center border-t border-border/20">
        <h2 className="font-display text-3xl sm:text-5xl gradient-gold-text leading-tight mb-5">Carry the Message.</h2>
        <p className="font-body text-sm sm:text-base text-foreground/80 mb-2">Respect Is Earned, Not a Game You Make Me Play.</p>
        <p className="font-body text-sm text-muted-foreground mb-8">For survivors, supporters and anyone choosing clearer boundaries.</p>
        <div className="flex flex-wrap justify-center gap-3 mb-6">
          <Link to="/store">
            <Button className="gradient-gold-button border-0 rounded-full font-body text-sm tracking-wider uppercase">
              Explore the collection <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
        <p className="font-body text-xs text-muted-foreground/70 tracking-wider">
          #CarryTheMessage #RespectIsEarned #GannonWaye #SurvivorSolidarity #ClearerBoundaries
        </p>
        <p className="font-body text-[11px] text-muted-foreground/50 mt-8 max-w-xl mx-auto leading-relaxed">
          Gannon Waye merchandise is a visible statement and personal reminder. It is not presented as treatment, protection or proof of any person's experience. If you or someone you know needs support, contact a recognised support service.
        </p>
      </section>
    </div>
  );
}