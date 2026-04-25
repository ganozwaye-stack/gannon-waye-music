import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import CountdownTimer from '@/components/public/CountdownTimer';
import SocialLinks from '@/components/public/SocialLinks';
import ThankYouSingle from '@/components/public/ThankYouSingle';
import SafeSpaceBanner from '@/components/public/SafeSpaceBanner';
import ThankYouHeroBanner from '@/components/public/ThankYouHeroBanner';

const HERO_IMAGES = [
  'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/a5ef50136_generated_image.png',
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
  const upcomingRelease = releases.find((r) => r.status !== 'released' && r.release_date);

  const [currentImg, setCurrentImg] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImg((i) => (i + 1) % HERO_IMAGES.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen relative">
      {/* Fixed background — visible behind ALL sections */}
      <div className="fixed inset-0 -z-10">
        <AnimatePresence>
          <motion.img
            key={currentImg}
            src={HERO_IMAGES[currentImg]}
            alt="Gannon Waye"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.45 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5 }}
            className="absolute inset-0 w-full h-full object-cover object-[center_20%]"
          />
        </AnimatePresence>
      </div>

      {/* Hero */}
      <section className="relative min-h-[100svh] flex items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-background/50 to-background/80 z-10" />
        <div className="relative z-20 text-center px-6 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <p className="font-body text-xs tracking-[0.3em] uppercase text-primary mb-4">Singer · Songwriter</p>
            <h1 className="font-display text-5xl sm:text-7xl md:text-8xl text-foreground font-bold uppercase leading-tight whitespace-nowrap">
              Gannon Waye
            </h1>
            <p className="font-body text-sm md:text-base text-foreground/60 mt-5 max-w-xl mx-auto leading-relaxed px-2">
              Born in Adelaide. Now home in Melbourne. Writing songs from the parts of life that don't always have words — grief, growth, and what it means to finally feel like yourself.
            </p>
          </motion.div>

          {/* "Thank You" teaser strip in the hero */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.35 }}
            className="mt-10 inline-flex flex-col sm:flex-row items-center gap-3 sm:gap-5 bg-card/40 backdrop-blur-sm border border-primary/20 rounded-2xl px-6 py-4 mx-auto"
          >
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              <p className="font-body text-[10px] tracking-[0.3em] uppercase text-primary">New Single</p>
            </div>
            <p className="font-display text-lg text-foreground italic">"Thank You"</p>
            <div className="w-px h-4 bg-border/60 hidden sm:block" />
            <CountdownTimer targetDate="2026-06-10T00:00:00" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mt-8 flex flex-col sm:flex-row gap-3 justify-center px-4"
          >
            <Link to="/music" className="w-full sm:w-auto">
              <Button className="gap-2 w-full sm:w-auto px-8 py-5 text-sm tracking-wider uppercase font-body rounded-full">
                <Play className="w-4 h-4" /> Explore Music
              </Button>
            </Link>
            <Link to="/community" className="w-full sm:w-auto">
              <Button variant="outline" className="gap-2 w-full sm:w-auto px-8 py-5 text-sm tracking-wider uppercase font-body rounded-full border-foreground/20 hover:bg-foreground/5">
                Join the Community <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* About Section — magazine 3-column */}
      <section className="py-16 md:py-24 px-4 md:px-6 relative">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <p className="font-body text-xs tracking-[0.3em] uppercase text-primary mb-4">About</p>
            <h2 className="font-display text-3xl md:text-5xl text-foreground">The Story</h2>
          </div>

          {/* 3-column magazine layout — hidden on mobile */}
          <div className="hidden md:grid grid-cols-[1fr_auto_1fr] gap-8 items-start">
            {/* Left column */}
            <motion.div
              initial={{ opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="font-body text-foreground/60 leading-relaxed text-sm text-left space-y-4"
            >
              <p>I'm a singer-songwriter born and raised in Adelaide, now calling Melbourne home for over 13 years. Music has always been more than sound to me — it's the language I use to understand people, emotion, and the parts of life that don't always have words.</p>
              <p>I think deeply, feel deeply, and notice what others often miss. I'm obsessed with travel and culture. I care about people's wellbeing — sometimes more than they even realise about themselves. That perspective finds its way into everything I write.</p>
              <p className="text-foreground/40 italic text-xs">I've been misunderstood and mislabelled more times than I can count. But I've learned that being misunderstood doesn't mean you're wrong — it often means you're seeing something others aren't ready for yet.</p>
            </motion.div>

            {/* Centre — quote centrepiece */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="w-52 flex flex-col items-center gap-2 pt-1"
            >
              <div className="w-px h-8 bg-primary/40" />
              <div className="font-display text-[11px] text-primary leading-6 italic text-center space-y-0">
                <p>I didn't truly love myself</p>
                <p>until I was 33.</p>
                <p>Before that, I woke up every day</p>
                <p>wishing I could be someone else.</p>
                <p>That fear of abandonment</p>
                <p>ran my life.</p>
                <p>Then something shifted —</p>
                <p>and for the first time,</p>
                <p>I didn't want to be anyone else.</p>
                <p className="mt-3 text-primary/50 not-italic tracking-widest uppercase text-[9px]">Gannon Waye</p>
              </div>
              <div className="w-px h-8 bg-primary/40" />
            </motion.div>

            {/* Right column */}
            <motion.div
              initial={{ opacity: 0, x: 16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="font-body text-foreground/60 leading-relaxed text-sm text-right space-y-4"
            >
              <p>My journey hasn't been simple. I've experienced loss, grief, and environments that challenged my sense of self. But those experiences shaped me. They gave me something real to say.</p>
              <p>I began singing at a young age — runner-up in Adelaide Search for a Star, Top 100 in the early days of Australian Idol, and a few others. But this isn't about trophies. The past decade has been about something far more personal: developing my own voice and writing from lived experience.</p>
              <p>That work is now becoming an album — a collection for anyone who needs a message of hope, or just an anthem that reminds them they're not alone.</p>
            </motion.div>
          </div>

          {/* Mobile fallback — stacked */}
          <div className="md:hidden space-y-6">
            <p className="font-body text-foreground/60 leading-relaxed text-sm text-center">
              I'm a singer-songwriter born and raised in Adelaide, now calling Melbourne home for over 13 years. Music has always been more than sound to me — it's the language I use to understand people, emotion, and the parts of life that don't always have words.
            </p>
            <div className="border-l-2 border-primary/50 pl-4 font-display text-sm text-primary italic leading-7">
              "I didn't truly love myself until I was 33. Before that, I woke up every day wishing I could be someone else. That fear of abandonment ran my life. Then something shifted — and for the first time, I didn't want to be anyone else."
            </div>
            <p className="font-body text-foreground/60 leading-relaxed text-sm text-center">
              My journey hasn't been simple — loss, grief, and environments that challenged my sense of self. But those experiences gave me something real to say. That work is now becoming an album: a collection for anyone who needs a message of hope, or just an anthem that reminds them they're not alone.
            </p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-12 flex justify-center"
          >
            <SocialLinks settings={site} className="justify-center" />
          </motion.div>
        </div>
      </section>

      {/* Thank You Hero Banner — just below the hero */}
      <ThankYouHeroBanner />

      {/* Thank You Single */}
      <ThankYouSingle />

      {/* Safe Space Banner */}
      <SafeSpaceBanner />

      {/* Latest Releases Preview */}
      {releases.length > 0 && (
        <section className="py-16 md:py-24 px-4 md:px-6">
          <div className="max-w-6xl mx-auto">
            <p className="font-body text-xs tracking-[0.3em] uppercase text-primary mb-4 text-center">Latest</p>
            <h2 className="font-display text-3xl md:text-5xl text-foreground mb-12 text-center">Music</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
              {releases.filter((r) => r.is_published).slice(0, 2).map((release) => (
                <motion.div
                  key={release.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="group relative overflow-hidden rounded-2xl bg-card/60 backdrop-blur-sm border border-border/40 hover:border-primary/30 transition-all"
                >
                  <div className="aspect-square bg-secondary/50 overflow-hidden">
                    {release.artwork_url ? (
                      <img src={release.artwork_url} alt={release.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
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
                    {release.release_date && (
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