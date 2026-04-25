import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Play, Heart, Lock, Sparkles, Music2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import CountdownTimer from '@/components/public/CountdownTimer';
import SocialLinks from '@/components/public/SocialLinks';

const HERO_IMAGES = [
  'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/9fed1279f_00.jpg',
  'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/b70ae752d_0.jpg',
  'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/91d4c63a5_b5c0ca59-a71f-469f-94f6-a6aede6ccdf5.jpg',
  'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/0e3e9d3bd_WhatsAppImage2026-04-18at6016PM.jpg',
];

export default function Home() {
  const { data: settings } = useQuery({
    queryKey: ['siteSettings'],
    queryFn: () => base44.entities.SiteSettings.list(),
    initialData: [],
  });

  const { data: releases } = useQuery({
    queryKey: ['releases'],
    queryFn: () => base44.entities.Release.list('-release_date'),
    initialData: [],
  });

  const site = settings[0] || {};
  const [currentImg, setCurrentImg] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImg((i) => (i + 1) % HERO_IMAGES.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Find the "Thank You" single (unreleased)
  const thankYouRelease = releases.find(
    (r) => r.title?.toLowerCase().includes('thank') && r.status !== 'released'
  );
  // Fallback: any upcoming release
  const upcomingRelease = thankYouRelease || releases.find((r) => r.status !== 'released' && r.release_date);

  // Published releases for the music section
  const publishedReleases = releases.filter((r) => r.is_published);

  return (
    <div className="min-h-screen">

      {/* ── THANK YOU BANNER HERO ── */}
      {upcomingRelease ? (
        <section className="relative min-h-[100svh] flex items-end overflow-hidden">
          {/* Solid dark background — artwork fully hidden */}
          <div className="absolute inset-0 bg-gradient-to-br from-background via-secondary/30 to-background" />

          {/* Pulsing glow orb */}
          <motion.div
            animate={{ scale: [1, 1.15, 1], opacity: [0.15, 0.3, 0.15] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-primary/20 blur-3xl pointer-events-none"
          />

          {/* Content */}
          <div className="relative z-10 w-full px-4 md:px-8 pb-16 md:pb-24">
            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-end">

                {/* Left — locked artwork tile */}
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 1 }}
                  className="flex justify-center md:justify-start"
                >
                  <div className="relative w-52 h-52 sm:w-64 sm:h-64 md:w-80 md:h-80 rounded-2xl overflow-hidden border border-primary/30 shadow-2xl shadow-primary/10">
                    {/* Artwork fully hidden */}
                    <div className="absolute inset-0 bg-secondary/80" />
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                      {/* Pulsing lock */}
                      <motion.div
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 2.5, repeat: Infinity }}
                      >
                        <Lock className="w-10 h-10 text-primary" />
                      </motion.div>
                      <p className="font-body text-[10px] tracking-[0.3em] uppercase text-primary/70 text-center px-4">
                        Artwork Reveal
                      </p>
                      <p className="font-body text-[10px] tracking-[0.2em] uppercase text-muted-foreground text-center">
                        Coming Soon
                      </p>
                    </div>
                    {/* Shimmer border animation */}
                    <motion.div
                      animate={{ opacity: [0.3, 0.8, 0.3] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="absolute inset-0 rounded-2xl border-2 border-primary/40 pointer-events-none"
                    />
                  </div>
                </motion.div>

                {/* Right — text content */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1, delay: 0.2 }}
                  className="text-center md:text-left"
                >
                  {/* Eyebrow */}
                  <div className="flex items-center gap-2 justify-center md:justify-start mb-3">
                    <motion.div
                      animate={{ opacity: [1, 0.3, 1] }}
                      transition={{ duration: 1.2, repeat: Infinity }}
                      className="w-2 h-2 rounded-full bg-primary"
                    />
                    <p className="font-body text-xs tracking-[0.3em] uppercase text-primary">New Single · Coming Soon</p>
                  </div>

                  <h1 className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-foreground leading-none mb-2">
                    "{upcomingRelease.title}"
                  </h1>
                  <p className="font-body text-sm tracking-[0.2em] uppercase text-muted-foreground mb-8">
                    Gannon Waye
                  </p>

                  {/* Countdown — to artwork reveal on 10 May */}
                  <div className="mb-8">
                    <p className="font-body text-xs tracking-[0.25em] uppercase text-muted-foreground mb-4">Artwork reveal in</p>
                    <CountdownTimer targetDate="2026-05-10" />
                    {new Date() >= new Date('2026-05-10') && (
                      <p className="font-body text-[10px] tracking-[0.2em] uppercase text-muted-foreground/60 mt-3">Release date: 10 June 2026</p>
                    )}
                  </div>

                  {/* Badges */}
                  <div className="flex flex-wrap gap-2 justify-center md:justify-start mb-8">
                    <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-primary/30 bg-primary/10 font-body text-xs text-primary tracking-wider uppercase">
                      <Sparkles className="w-3 h-3" /> First Release
                    </span>
                    <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border/50 bg-secondary/50 font-body text-xs text-muted-foreground tracking-wider uppercase">
                      <Music2 className="w-3 h-3" /> Single
                    </span>
                    <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border/50 bg-secondary/50 font-body text-xs text-muted-foreground tracking-wider uppercase">
                      <Lock className="w-3 h-3" /> Artwork Hidden
                    </span>
                  </div>

                  {/* CTAs */}
                  <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
                    <Link to="/music" className="w-full sm:w-auto">
                      <Button className="gap-2 w-full sm:w-auto px-8 py-5 text-sm tracking-wider uppercase font-body rounded-full">
                        <Play className="w-4 h-4" /> Explore Music
                      </Button>
                    </Link>
                    <Link to="/community" className="w-full sm:w-auto">
                      <Button variant="outline" className="gap-2 w-full sm:w-auto px-8 py-5 text-sm tracking-wider uppercase font-body rounded-full border-foreground/20 hover:bg-foreground/5">
                        Community <ArrowRight className="w-4 h-4" />
                      </Button>
                    </Link>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </section>
      ) : (
        /* ── FALLBACK HERO (no upcoming release) ── */
        <section className="relative min-h-[100svh] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/65 to-background z-10" />
          <AnimatePresence>
            <motion.img
              key={currentImg}
              src={HERO_IMAGES[currentImg]}
              alt="Gannon Waye"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.65 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.5 }}
              className="absolute inset-0 w-full h-full object-cover object-top"
            />
          </AnimatePresence>
          <div className="relative z-20 text-center px-6 max-w-4xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
              <p className="font-body text-xs tracking-[0.3em] uppercase text-primary mb-4">Singer · Songwriter</p>
              <h1 className="font-display text-6xl sm:text-7xl md:text-8xl text-foreground leading-tight">
                Gannon<br />Waye
              </h1>
            </motion.div>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.6 }}
              className="mt-8 flex flex-col sm:flex-row gap-3 justify-center px-4">
              <Link to="/music" className="w-full sm:w-auto">
                <Button className="gap-2 w-full sm:w-auto px-8 py-5 text-sm tracking-wider uppercase font-body rounded-full">
                  <Play className="w-4 h-4" /> Explore Music
                </Button>
              </Link>
              <Link to="/community" className="w-full sm:w-auto">
                <Button variant="outline" className="gap-2 w-full sm:w-auto px-8 py-5 text-sm tracking-wider uppercase font-body rounded-full border-foreground/20 hover:bg-foreground/5">
                  Community <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </motion.div>
          </div>
        </section>
      )}

      {/* ── ABOUT / BIO ── */}
      <section className="py-16 md:py-28 px-4 md:px-6 relative">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <p className="font-body text-xs tracking-[0.3em] uppercase text-primary mb-4">About</p>
            <h2 className="font-display text-3xl md:text-5xl text-foreground">The Story</h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
            {/* Left — personal story */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="space-y-5 font-body text-foreground/70 leading-relaxed"
            >
              <p>
                I'm a singer-songwriter born and raised in Adelaide, now calling Melbourne home for over 13 years. 
                Music has always been more than sound to me — it's the language I use to understand people, emotion, 
                and the parts of life that don't always have words.
              </p>
              <p>
                I think deeply, feel deeply, and notice what others often miss. I'm obsessed with travel and culture. 
                I care about people's wellbeing — sometimes more than they even realise about themselves. 
                That perspective finds its way into everything I write.
              </p>
              <p>
                I've been misunderstood and mislabelled more times than I can count. But I've learned that being 
                misunderstood doesn't mean you're wrong — it often means you're seeing something others aren't ready for yet.
              </p>
              <p className="text-primary font-medium italic">
                "I didn't truly love myself until I was 33. Before that, I woke up every day wishing I could be someone else. 
                That fear of abandonment ran my life. Then something shifted — and for the first time, I didn't want to be anyone else."
              </p>
              <p>
                My journey hasn't been simple. I've experienced loss, grief, and environments that challenged my sense of self. 
                But those experiences shaped me. They gave me something real to say.
              </p>
            </motion.div>

            {/* Right — music journey + mission */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="space-y-5 font-body text-foreground/70 leading-relaxed"
            >
              <p>
                I began singing at a young age — runner-up in Adelaide Search for a Star, Top 100 in the early days of 
                Australian Idol, and a few others. But this isn't about trophies. The past decade has been about 
                something far more personal: developing my own voice and writing from lived experience.
              </p>
              <p>
                That work is now becoming an album — a collection for anyone who needs a message of hope, or just 
                an anthem that reminds them they're not alone.
              </p>
              <p>
                Music, for me, is about impact. If one song reaches someone at the right moment — if one lyric 
                shifts how they feel about themselves — then it's done exactly what it was meant to do.
              </p>
              <div className="pt-4">
                <SocialLinks settings={site} />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── SAFE SPACE / COMMUNITY CALLOUT ── */}
      <section className="py-16 md:py-24 px-4 md:px-6 bg-secondary/10">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Heart className="w-8 h-8 text-primary mx-auto mb-6" />
            <p className="font-body text-xs tracking-[0.3em] uppercase text-primary mb-4">You Are Not Alone</p>
            <h2 className="font-display text-3xl md:text-5xl text-foreground mb-6">A Safe Space for Everyone</h2>
            <p className="font-body text-foreground/60 leading-relaxed text-base md:text-lg max-w-2xl mx-auto mb-4">
              I know what it feels like to be isolated, unheard, and to believe you're the only one going through it.
              You're not. This community exists for people who've felt this — wherever you are in your journey.
            </p>
            <p className="font-body text-foreground/50 leading-relaxed text-sm md:text-base max-w-xl mx-auto mb-8">
              Whether you've lived through coercive isolation, loss, or simply feel unseen — there is a place here 
              for you. No judgement. No noise. Just connection.
            </p>
            <Link to="/community">
              <Button className="rounded-full px-8 py-5 font-body text-sm tracking-wider uppercase gap-2">
                <Heart className="w-4 h-4" /> Join the Community
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ── LATEST MUSIC ── */}
      {publishedReleases.length > 0 && (
        <section className="py-16 md:py-24 px-4 md:px-6">
          <div className="max-w-6xl mx-auto">
            <p className="font-body text-xs tracking-[0.3em] uppercase text-primary mb-4 text-center">Latest</p>
            <h2 className="font-display text-3xl md:text-5xl text-foreground mb-12 text-center">Music</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
              {publishedReleases.slice(0, 2).map((release) => (
                <motion.div
                  key={release.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="group relative overflow-hidden rounded-2xl bg-card border border-border/40 hover:border-primary/30 transition-all"
                >
                  <div className="aspect-square bg-secondary/50 overflow-hidden relative">
                    {release.artwork_url && release.status !== 'released' ? (
                      <div className="w-full h-full flex flex-col items-center justify-center gap-3 bg-secondary/80">
                        <Lock className="w-10 h-10 text-primary/60" />
                        <p className="font-body text-[10px] tracking-[0.3em] uppercase text-muted-foreground">Artwork Hidden</p>
                      </div>
                    ) : release.artwork_url ? (
                      <img
                        src={release.artwork_url}
                        alt={release.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Play className="w-12 h-12 text-muted-foreground/30" />
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <p className="font-body text-xs tracking-widest uppercase text-primary">{release.type}</p>
                    <h3 className="font-display text-2xl text-foreground mt-1">{release.title}</h3>
                    <p className="font-body text-sm text-muted-foreground mt-2 line-clamp-2">{release.description}</p>
                    {release.release_date && (release.status === 'released' || new Date() >= new Date('2026-05-10')) && (
                      <p className="font-body text-xs text-muted-foreground mt-3">
                        {new Date(release.release_date) > new Date() ? 'Coming ' : 'Released '}
                        {new Date(release.release_date).toLocaleDateString('en-AU', { month: 'long', day: 'numeric', year: 'numeric' })}
                      </p>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
            <div className="text-center mt-10">
              <Link to="/music">
                <Button variant="outline" className="rounded-full px-8 py-5 font-body text-sm tracking-wider uppercase border-foreground/20">
                  View All Music <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}