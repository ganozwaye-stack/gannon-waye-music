import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Music, Heart, Mic, Headphones, Quote, BookOpen, Star, Sunrise } from 'lucide-react';

// Gannon, side profile, looking up into the light through the clouds. The hero.
const HERO_PORTRAIT = 'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/637f52efd_image.png';
// Primary Gannon headshot, gold halo on navy
const PORTRAIT = 'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/a02a9ab6c_image_edited.png';

const CHAPTERS = [
  { year: 'Adelaide', title: 'No lessons, still singing', text: 'Gannon was raised in low socioeconomic conditions where formal music lessons were out of reach. No amount of asking, tears or begging changed that, so he built a voice wherever music was available, leading school choirs and learning by doing.' },
  { year: 'The Stage', title: 'Determination found a microphone', text: 'He twice reached the grand final of Adelaide\'s Search for a Star, reached the Top 100 of Australian Idol and later auditioned for The Voice. The opportunities were never handed to him. He kept finding them.' },
  { year: 'Faith', title: 'Choirs, church and ministry', text: 'He sang in church, became a worship minister and in 2007 travelled to the United States as a lead singer in Christian music ministry in New Orleans and Dallas. Music gave him belonging before he had language for everything he was carrying.' },
  { year: 'Performance', title: 'Becoming visible', text: 'He performed as a drag artist, opened Feast Festival in 2012, worked in short films and television commercials and received supported acting and dance training. Each stage made room for another part of him to exist.' },
  { year: 'Home', title: 'Music as escape', text: 'His childhood was shaped by an abusive father, family violence and a mother who struggled to regulate overwhelming emotions. Music became both an escape and a language for what could not safely be said.' },
  { year: '2013', title: 'Melbourne', text: 'He packed a life into a car and drove to Melbourne, building an adult life and creative identity away from the roles and expectations that had once kept him small.' },
  { year: 'Twenty Days', title: 'Losing Mum', text: 'His mum Sonia, his best friend and biggest fan, was diagnosed and gone in twenty days. Grief knocked him down again and became the foundation of the most honest music he would ever write.' },
  { year: 'Survival', title: 'Abuse, addiction and PTSD', text: 'Adult relationships repeated patterns of abuse and coercive control. Addiction and PTSD narrowed his world, but they did not end the story. He survived what once felt unsurvivable and began the work of rebuilding.' },
  { year: '33', title: 'The shift', text: 'At 33, he stopped wishing to be someone else. The fear of abandonment began to loosen, and the work of choosing himself, even when it was the harder path, could finally begin.' },
  { year: 'Now', title: 'I\'m Still Here', text: 'Now based in Melbourne, he is building a fifteen song album from everything that tried to silence him. The aim is not fame for its own sake. It is to reach the person who needs a voice or a song for what they cannot yet say.' },
];

const MOMENTS = [
  { icon: Star, title: 'Search for a Star and Australian Idol', text: 'Twice a grand finalist in Adelaide, then Top 100 in Australian Idol. Proof that limited access did not limit the voice.' },
  { icon: Music, title: 'School choirs and worship ministry', text: 'He learned through participation, leading school choirs, singing in church and eventually serving as a worship minister.' },
  { icon: Mic, title: 'Feast Festival, 2012', text: 'Opening the festival as a drag performer marked another step in turning difference into creative strength.' },
  { icon: Heart, title: 'Without You Here', text: 'Written in the early hours of Mother\'s Day after losing Mum. Grief became a song for anyone still reaching for a voice that is gone.' },
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

      {/* Hero — Gannon in the clouds, looking up into the light */}
      <section className="relative overflow-hidden min-h-[78vh] sm:min-h-[82vh] flex items-center">
        <img
          src={HERO_PORTRAIT}
          alt="Gannon Waye, looking up into the light"
          className="absolute inset-0 w-full h-full object-cover object-center sm:object-[60%_center]"
        />
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(180deg, rgba(8,8,14,0.45) 0%, rgba(8,8,14,0.25) 30%, rgba(8,8,14,0.85) 88%, hsl(var(--background)) 100%)' }}
        />
        <div
          className="absolute inset-0"
          style={{ background: 'radial-gradient(85% 60% at 50% 35%, transparent 0%, rgba(8,8,14,0.55) 100%)' }}
        />

        <div className="relative z-10 w-full max-w-4xl mx-auto px-4 md:px-8 pt-32 pb-16 text-center">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="font-body text-xs tracking-[0.3em] uppercase gradient-gold-glow mb-4"
            style={{ textShadow: '0 1px 6px rgba(0,0,0,0.6)' }}
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
            className="font-body text-sm text-foreground/85 max-w-md mx-auto mt-4"
            style={{ textShadow: '0 1px 6px rgba(0,0,0,0.7)' }}
          >
            Singer. Songwriter. Storyteller. Melbourne, Australia.
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.32 }}
            className="font-body text-sm md:text-base text-foreground/70 max-w-xl mx-auto mt-5 leading-relaxed"
            style={{ textShadow: '0 1px 6px rgba(0,0,0,0.7)' }}
          >
            A life shaped by grief and grace, told in honesty and melody, written to remind anyone listening that they are not alone here.
          </motion.p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 md:px-8 pt-14">

        {/* Portrait + intro */}
        <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-8 mb-16 items-start">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="relative mx-auto md:mx-0 w-full max-w-[280px]">
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
                Gannon Waye is an independent Australian singer songwriter whose contemporary pop work turns lived experience into connection. Born in Adelaide and now based in Melbourne, he was raised in low socioeconomic conditions where formal music lessons were never possible. He built his craft by leading school choirs, singing in church, serving as a worship minister and taking every stage that would let him learn.
              </p>
              <p>
                His public catalogue begins with <em className="text-foreground/90">Thankyou</em>, produced by Spike Leo and mastered by Nicholas Di Lorenzo at Panorama, followed by <em className="text-foreground/90">Without You Here</em>, produced by Will Henderson. The songs open the world of <em className="text-foreground/90">I'm Still Here</em>, a fifteen song project shaped by family violence, abusive relationships, addiction, PTSD, grief and the decision to keep standing.
              </p>
              <p>
                The purpose is not fame for its own sake. It is to reach people searching for a voice or a song that can say what they cannot yet say, and to remind them that being knocked down does not have to be the end of the story.
              </p>
            </div>
          </motion.div>
        </div>

        {/* Pull quote */}
        <div className="bg-card border border-border/40 rounded-2xl p-8 md:p-10 mb-16 text-center">
          <Quote className="w-8 h-8 text-primary/30 mx-auto mb-4" />
          <p className="font-display italic text-lg md:text-xl text-foreground/80 leading-relaxed">
            "I don't write songs to be heard. I write songs because if I don't, the feeling stays. And some feelings are too heavy to carry alone."
          </p>
          <p className="font-body text-xs tracking-[0.3em] uppercase gradient-gold-text mt-6">Gannon Waye</p>
        </div>

        {/* Defining moments — strength & hope */}
        <div className="mb-16">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-8"
          >
            <p className="font-body text-xs tracking-[0.3em] uppercase gradient-gold-glow mb-3">Strength & Hope</p>
            <h2 className="font-display text-2xl md:text-3xl gradient-gold-text">Defining Moments</h2>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-5">
            {MOMENTS.map((m, i) => {
              const Icon = m.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="rounded-2xl p-6 border border-primary/25"
                  style={{ background: 'linear-gradient(135deg, rgba(212,175,55,0.08), rgba(8,8,14,0.6))' }}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <Icon className="w-4 h-4 text-primary/70" />
                    <p className="font-body text-[10px] tracking-[0.3em] uppercase gradient-gold-text">{m.title}</p>
                  </div>
                  <p className="font-body text-sm text-foreground/75 leading-relaxed">{m.text}</p>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Heartfelt write-up */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-card/60 border border-border/30 rounded-2xl p-6 md:p-12 mb-16 space-y-5 font-body text-sm text-foreground/70 leading-relaxed"
        >
          <p className="font-body text-xs tracking-[0.3em] uppercase gradient-gold-glow mb-2">In His Own Words</p>
          <p>
            Music was the opportunity my family could not afford and the escape I could create for myself. I asked for lessons, cried for them and begged for them, but they never came. I sang anyway. School choirs, church, worship ministry, drag performance and every available stage became the education I built for myself.
          </p>
          <p>
            Home was shaped by an abusive father, family violence and a mother who struggled with emotional regulation. As an adult I repeated some of those patterns in abusive relationships, then faced addiction, PTSD and the loss of Mum, my best friend and greatest believer. Life has knocked me down more than once.
          </p>
          <p>
            The work now is about what happens after the fall. My music, and the coaching work growing beside it, come from the same determination to turn hard earned lessons into connection, direction and hope for someone else.
          </p>
          <p>
            I am still here. The album carries that sentence through every chapter, not as a claim that everything is fixed, but as proof that the story continued.
          </p>
          <p className="text-foreground/80 italic">
            I am not chasing fame as the purpose. I am trying to reach the person who needs a song to speak before they can.
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
          <div className="p-6 md:p-10 flex flex-col md:flex-row items-start md:items-center gap-6">
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

        {/* Journey chapters */}
        <div className="mb-16">
          <h2 className="font-display text-2xl md:text-3xl text-foreground mb-8 text-center">The Journey</h2>
          <div className="space-y-6">
            {CHAPTERS.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="flex gap-4 sm:gap-6"
              >
                <div className="flex-shrink-0 w-20 sm:w-28 text-right pt-1">
                  <p className="font-display text-xs sm:text-sm gradient-gold-text tracking-wider leading-tight">{item.year}</p>
                </div>
                <div className="flex-shrink-0 w-px bg-border/40 relative">
                  <div className="absolute top-2 -left-1.5 w-3 h-3 rounded-full bg-primary/40 border-2 border-background" />
                </div>
                <div className="flex-1 pb-2">
                  <h3 className="font-display text-base sm:text-lg text-foreground mb-1.5">{item.title}</h3>
                  <p className="font-body text-sm text-foreground/70 leading-relaxed">{item.text}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Values */}
        <div className="mb-16">
          <h2 className="font-display text-2xl md:text-3xl text-foreground mb-8 text-center">What the Music Stands For</h2>
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