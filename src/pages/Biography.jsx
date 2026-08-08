import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Music, Heart, Mic, Headphones, Quote, BookOpen } from 'lucide-react';

// The gold-particle image is the hero wallpaper for this page
const HERO_BG = 'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/f5c21dab8_d1726a55-8788-4809-8fe0-1f6814d0da37.png';

// Primary Gannon headshot, gold halo on navy
const PORTRAIT = 'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/a02a9ab6c_image_edited.png';

const TIMELINE = [
  { year: 'Adelaide', text: 'Born in Adelaide and raised in an environment where music became an early refuge. Long before he understood what he was feeling, he was already reaching for sound to make sense of it.' },
  { year: 'Identity', text: 'Growing up queer in conservative spaces shaped everything: the church community he loved, the rejection that followed when he came out, and the years spent building himself back from the silence that replaced it all.' },
  { year: 'Loss', text: 'Losing his mum Sonia, his best friend and biggest fan, only twenty days after her diagnosis. Grief became the undercurrent of everything that came after, and the foundation of his most honest music.' },
  { year: 'Recovery', text: 'Six years of rebuilding: therapy, emotional intelligence, learning to sit with discomfort rather than run from it. Choosing himself, again and again, even when it was the harder path.' },
  { year: 'Now', text: 'Based in Melbourne. Writing, recording, and releasing music that refuses to be anything other than real. Every song is a chapter. Every lyric is a truth.' },
];

const VALUES = [
  { icon: Heart, title: 'Authenticity', desc: 'Every song is written from lived experience. No pretence, no posturing, just truth.' },
  { icon: Music, title: 'Craft', desc: 'Obsessive about melody, lyric, and production. Every detail matters, every note serves the song.' },
  { icon: Mic, title: 'Independence', desc: 'Self-released, self-managed, self-determined. The freedom to make exactly the music he needs to make.' },
  { icon: Headphones, title: 'Connection', desc: 'Music as a bridge between souls. If one person hears their own story in a song, it has done its job.' },
];

export default function Biography() {
  return (
    <div className="min-h-screen pb-20">

      {/* Hero — gold particle wallpaper */}
      <section className="relative overflow-hidden" style={{ minHeight: '55vh' }}>
        <img src={HERO_BG} alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(180deg, rgba(8,8,14,0.55) 0%, rgba(8,8,14,0.3) 40%, rgba(8,8,14,0.95) 100%)' }}
        />
        <div className="relative z-10 max-w-4xl mx-auto px-4 md:px-8 h-full flex flex-col justify-end pb-14 pt-36 items-center text-center">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="font-body text-xs tracking-[0.3em] uppercase gradient-gold-glow mb-4"
          >
            The Artist
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="font-display text-5xl md:text-7xl gradient-gold-text"
          >
            Biography
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="font-body text-sm text-muted-foreground max-w-md mt-4"
          >
            Singer. Songwriter. Storyteller. Melbourne, Australia.
          </motion.p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 md:px-8 pt-14">

        {/* Portrait + intro */}
        <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-8 mb-16 items-start">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="relative">
            <div className="aspect-square rounded-2xl overflow-hidden border border-primary/20">
              <img src={PORTRAIT} alt="Gannon Waye" className="w-full h-full object-cover object-top" />
            </div>
            <div className="absolute inset-0 rounded-2xl pointer-events-none" style={{ boxShadow: 'inset 0 0 60px rgba(0,0,0,0.3)' }} />
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex flex-col justify-center">
            <h2 className="font-display text-3xl gradient-gold-text mb-1">Gannon Waye</h2>
            <p className="font-body text-sm gradient-gold-text tracking-widest uppercase mb-6">Independent Artist · Songwriter</p>
            <div className="space-y-4 font-body text-sm text-foreground/70 leading-relaxed">
              <p>
                Gannon Waye is an independent Australian artist whose music lives at the intersection of honesty and melody. Born in Adelaide and now based in Melbourne, he has spent over a decade navigating a life shaped by grief, identity, faith, recovery, and the quiet courage it takes to start again.
              </p>
              <p>
                His debut single <em className="text-foreground/90">Thankyou</em> was written at a turning point: the moment of choosing self-respect over repetition. His follow-up, <em className="text-foreground/90">Without You Here</em>, written in the early hours of Mother's Day, is a raw acoustic letter to his late mother Sonia, the voice he still reaches for, the love that never left even after she did.
              </p>
              <p>
                His songs aren't written to chase trends. They're written because they have to be. Each one is a chapter of a real life, lived in real time.
              </p>
            </div>
          </motion.div>
        </div>

        {/* Pull quote */}
        <div className="bg-card border border-border/40 rounded-2xl p-10 mb-16 text-center">
          <Quote className="w-8 h-8 text-primary/30 mx-auto mb-4" />
          <p className="font-display italic text-xl text-foreground/80 leading-relaxed">
            "I don't write songs to be heard. I write songs because if I don't, the feeling stays. And some feelings are too heavy to carry alone."
          </p>
          <p className="font-body text-xs tracking-[0.3em] uppercase gradient-gold-text mt-6">Gannon Waye</p>
        </div>

        {/* Heartfelt write-up */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-card/60 border border-border/30 rounded-2xl p-8 md:p-12 mb-16 space-y-5 font-body text-sm text-foreground/70 leading-relaxed"
        >
          <p className="font-body text-xs tracking-[0.3em] uppercase gradient-gold-glow mb-2">In His Own Words</p>
          <p>
            I think deeply, feel deeply, and notice what others often miss. I am obsessed with travel and culture. I care about people's wellbeing, sometimes more than they even realise about themselves. That perspective finds its way into everything I write.
          </p>
          <p>
            There has been a lot of loss in my world. Losing my Mum, who was my best friend and my biggest fan, only twenty days after her diagnosis. People I loved who took their own lives. Others with diagnoses no one saw coming. These experiences did not just hurt. They reshaped me entirely.
          </p>
          <p>
            I have been misunderstood and mislabelled more times than I can count. I came out as gay at 21 and lost an entire faith community almost overnight, no conversations, no closure, just silence. I have been through addiction and recovery. I have survived things I once believed would finish me.
          </p>
          <p>
            But I am still here. And everything I create now comes from that. From the choice to stop abandoning myself. From six years of learning what I should have been taught at the very beginning.
          </p>
          <p className="text-foreground/80 italic">
            This is not just music. This is what choosing yourself actually sounds like.
          </p>
        </motion.div>

        {/* This Is My Life series callout */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-2xl overflow-hidden mb-16 border border-primary/30"
          style={{ background: 'linear-gradient(135deg, rgba(212,175,55,0.08), rgba(8,8,14,0.9))' }}
        >
          <div className="p-8 md:p-10 flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/30 flex items-center justify-center flex-shrink-0">
              <BookOpen className="w-5 h-5 text-primary/70" />
            </div>
            <div className="flex-1">
              <p className="font-body text-[10px] tracking-[0.3em] uppercase gradient-gold-glow mb-1">The Story Series</p>
              <h3 className="font-display text-2xl text-foreground mb-2">This Is My Life</h3>
              <p className="font-body text-sm text-foreground/60 leading-relaxed max-w-xl">
                A true story told in ten episodes. Childhood. Identity. Church and rejection. Abuse. Addiction. Losing Mum. PTSD. Rebuilding. Music. And still being here after all of it. Gannon shares the full unfiltered account of the life behind the music, chapter by chapter, as it happened.
              </p>
            </div>
            <Link to="/this-is-my-life" className="flex-shrink-0">
              <Button className="rounded-full font-body text-xs tracking-wider uppercase gradient-gold-button border-0 whitespace-nowrap">
                Read the Series
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* Journey timeline */}
        <div className="mb-16">
          <h2 className="font-display text-2xl text-foreground mb-8 text-center">The Journey</h2>
          <div className="space-y-6">
            {TIMELINE.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex gap-6"
              >
                <div className="flex-shrink-0 w-28 text-right pt-1">
                  <p className="font-display text-sm gradient-gold-text tracking-wider">{item.year}</p>
                </div>
                <div className="flex-shrink-0 w-px bg-border/40 relative">
                  <div className="absolute top-2 -left-1.5 w-3 h-3 rounded-full bg-primary/40 border-2 border-background" />
                </div>
                <p className="font-body text-sm text-foreground/70 leading-relaxed flex-1 pb-2">{item.text}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Values */}
        <div className="mb-16">
          <h2 className="font-display text-2xl text-foreground mb-8 text-center">What the Music Stands For</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {VALUES.map((v, i) => {
              const Icon = v.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="bg-card border border-border/40 rounded-2xl p-6 flex gap-4"
                >
                  <div className="w-10 h-10 rounded-xl bg-secondary/50 flex items-center justify-center border border-primary/20 flex-shrink-0">
                    <Icon className="w-4 h-4 text-primary/60" />
                  </div>
                  <div>
                    <h3 className="font-display text-lg text-foreground mb-1">{v.title}</h3>
                    <p className="font-body text-sm text-muted-foreground leading-relaxed">{v.desc}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <div className="flex flex-wrap justify-center gap-3">
            <Link to="/music">
              <Button className="rounded-full font-body text-xs tracking-wider uppercase gradient-gold-button border-0">
                Listen to the Music
              </Button>
            </Link>
            <Link to="/this-is-my-life">
              <Button variant="outline" className="rounded-full font-body text-xs tracking-wider uppercase border-primary/30 text-primary hover:bg-primary/10">
                Read My Full Story
              </Button>
            </Link>
            <Link to="/back-this">
              <Button variant="outline" className="rounded-full font-body text-xs tracking-wider uppercase border-primary/30 text-primary hover:bg-primary/10">
                Support the Project
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}