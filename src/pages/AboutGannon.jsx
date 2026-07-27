import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Heart, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import GannonSignature from '@/components/global/GannonSignature';
import ShareButtons from '@/components/public/ShareButtons';

const STORY_PARAGRAPHS = [
  "Gannon Waye Music is the home of Australian independent singer-songwriter Gannon Waye: a music world built around truth, grief, survival, self-respect, faith, identity and the decision to keep choosing yourself.",
  "This site is for people who feel deeply. It is for listeners who have lived through heartbreak, family loss, toxic love, abuse recovery, shame, silence, rebuilding and the strange loneliness of carrying things that are hard to explain. The music is not here to perform perfection. It is here to give language to the parts of life people often survive quietly.",
  "I was born and raised in Adelaide and have been based in Melbourne for more than 13 years. My work as an artist comes from lived experience: childhood performance, early rejection, public and private loss, recovery, faith, grief, identity and the long process of becoming someone who no longer abandons himself to be accepted.",
  "Gannon Waye Music is built by me as an independent artist. Every release, story, lyric, video, supporter moment and merch piece is part of a wider promise: to make emotionally honest music that helps people feel less alone while building a sustainable creative life around songs that actually mean something.",
  "For a long time, I learned to stay in places that never held me. To adjust, to stay quiet, to make sense of things that never made sense. Over time, I realised I was not broken. I had just been taught the wrong things about love, worth and belonging.",
  "Everything shifted when I stopped abandoning myself. Everything I create now comes from that moment. This is not just music. This is choosing yourself.",
];

export default function AboutGannon() {
  return (
    <div className="min-h-screen">

      {/* Cinematic hero — full-bleed split */}
      <section className="relative w-full min-h-[60vh] md:min-h-[75vh] flex items-center overflow-hidden">
        {/* Image side */}
        <div className="absolute inset-0">
          <img
            src="https://media.base44.com/images/public/69eb7905ca6eb4180010f794/74a4ae1c3_0.jpg"
            alt="Gannon Waye"
            className="w-full h-full object-cover object-[center_20%]"
          />
          {/* Dark gradient left-to-right so text is readable */}
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-background/10" />
          {/* Subtle gold overlay */}
          <div className="absolute inset-0 bg-primary/5 mix-blend-overlay" />
        </div>

        {/* Text side */}
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 max-w-xl px-8 md:px-16 py-20"
        >
          <p className="font-body text-xs tracking-[0.3em] uppercase gradient-gold-glow mb-4">The Story Behind the Music</p>
          <h1 className="font-display text-5xl md:text-7xl text-foreground mb-6 leading-tight">About</h1>
          <p className="font-body text-base md:text-lg text-foreground/70 leading-relaxed max-w-md">
            Gannon Waye Music is where lived experience becomes emotional pop, honest storytelling and a place for listeners who need songs that feel human.
          </p>
        </motion.div>
      </section>

      {/* Story body */}
      <div className="max-w-3xl mx-auto px-6 md:px-8 py-16">

        <div className="space-y-6">
          {STORY_PARAGRAPHS.map((para, i) => (
            <motion.p
              key={i}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.04 }}
              className="font-body text-foreground/75 leading-relaxed text-base md:text-lg"
            >
              {para}
            </motion.p>
          ))}
        </div>

        {/* Loss paragraph */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mt-10"
        >
          <p className="font-body text-foreground/75 leading-relaxed text-base md:text-lg">
            There has been a lot of loss in my world. Losing my Mum not too long ago, who was my best friend and my biggest fan. Also people I love that took their own life and others with diagnosis no one saw coming — these experiences did not just hurt, they reshaped me.
          </p>
        </motion.div>

        {/* Pull quote */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-14 border-l-2 border-primary pl-6 py-2"
        >
          <p className="font-display text-xl md:text-2xl gradient-gold-glow italic leading-relaxed">
            "For them, it was about appearance. For me, I was breaking inside."
          </p>
          <p className="font-body text-xs text-muted-foreground mt-3 tracking-widest uppercase">Gannon Waye</p>
        </motion.div>

        {/* Signature */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex justify-end mt-6 pr-4 md:pr-12"
        >
          <GannonSignature />
        </motion.div>

        {/* Share */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-10"
        >
          <ShareButtons url="https://gannonwaye.com/about" text="Gannon Waye — a story worth knowing." />
        </motion.div>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-14 flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link to="/music">
            <Button className="rounded-full px-8 py-5 font-body text-sm tracking-wider uppercase gradient-gold-button border-0 w-full sm:w-auto">
              Hear the Music <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
          <Link to="/community">
            <Button variant="outline" className="rounded-full px-8 py-5 font-body text-sm tracking-wider uppercase border-foreground/20 hover:bg-foreground/5 w-full sm:w-auto">
              <Users className="w-4 h-4 mr-2" /> Community
            </Button>
          </Link>
          <Link to="/back-this">
            <Button variant="outline" className="rounded-full px-8 py-5 font-body text-sm tracking-wider uppercase border-primary/30 text-primary hover:bg-primary/10 w-full sm:w-auto">
              <Heart className="w-4 h-4 mr-2" /> Support the Project 🤍
            </Button>
          </Link>
        </motion.div>

      </div>
    </div>
  );
}
