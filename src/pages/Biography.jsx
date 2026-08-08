import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import PageHero from '@/components/public/PageHero';
import { Button } from '@/components/ui/button';
import { Music, Heart, Mic, Headphones, Quote } from 'lucide-react';

// Gannon, not mum. Do not reassign.
const PORTRAIT = 'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/cb360d5ee_image.png';

const TIMELINE = [
  { year: 'Early Years', text: 'Grew up surrounded by music, finding solace in melody and meaning in lyrics from an early age.' },
  { year: 'Finding His Voice', text: 'Began writing songs as a way to process life — heartbreak, hope, and the human experience distilled into verse.' },
  { year: 'The Turning Point', text: 'A season of personal transformation. Choosing self-respect over repetition. The music became more honest.' },
  { year: 'Now', text: 'Independent artist crafting music that speaks to the soul. Each song is a chapter. Each lyric is a truth.' },
];

const VALUES = [
  { icon: Heart, title: 'Authenticity', desc: 'Every song is written from lived experience. No pretence, no posturing, just truth.' },
  { icon: Music, title: 'Craft', desc: 'Obsessive about melody, lyric, and production. Every detail matters, every note serves the song.' },
  { icon: Mic, title: 'Independence', desc: 'Self-released, self-managed, self-determined. The freedom to make exactly the music he wants to make.' },
  { icon: Headphones, title: 'Connection', desc: 'Music as a bridge between souls. If one person hears their own story in a song, it\'s done its job.' },
];

export default function Biography() {
  return (
    <div className="min-h-screen pb-20">
      <PageHero eyebrow="The Artist" title="Biography" />
      <div className="max-w-4xl mx-auto px-4 md:px-8 pt-12">

        {/* Portrait + intro */}
        <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-8 mb-16 items-start">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="relative">
            <div className="aspect-[3/4] rounded-2xl overflow-hidden border border-primary/20">
              <img src={PORTRAIT} alt="Gannon Waye" className="w-full h-full object-cover" />
            </div>
            <div className="absolute inset-0 rounded-2xl pointer-events-none" style={{
              boxShadow: 'inset 0 0 60px rgba(0,0,0,0.3)'
            }} />
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex flex-col justify-center">
            <h2 className="font-display text-3xl gradient-gold-text mb-1">Gannon Waye</h2>
            <p className="font-body text-sm gradient-gold-text tracking-widest uppercase mb-6">Independent Artist · Songwriter</p>
            <div className="space-y-4 font-body text-sm text-foreground/70 leading-relaxed">
              <p>
                Gannon Waye is an independent Australian artist whose music lives at the intersection of honesty and melody. His songs aren't written to chase trends, they're written because they have to be. Each one is a chapter of a life being lived in real time.
              </p>
              <p>
                His debut single <em className="text-foreground/90">Thankyou</em> marked a turning point: the moment of choosing self-respect over repetition. It's the sound of a cycle being broken. His follow-up, <em className="text-foreground/90">"Without You Here"</em>, written in the early hours of Mother's Day, is a raw, acoustic letter to his late mother, Sonia, a tribute to the voice he still reaches for and the love that never left.
              </p>
              <p>
                Every lyric is intentional. Every note serves the story. For Gannon, music isn't a performance, it's a conversation with anyone who's ever felt the same way and didn't have the words to say it.
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
                <div className="flex-shrink-0 w-32 text-right pt-1">
                  <p className="font-display text-sm text-primary tracking-wider uppercase">{item.year}</p>
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
                My Full Story
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}