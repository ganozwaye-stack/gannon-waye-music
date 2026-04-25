import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Play } from 'lucide-react';
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
            className="absolute inset-0 w-full h-full object-cover object-top"
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
            <h1 className="font-display text-5xl sm:text-7xl md:text-8xl text-foreground font-bold uppercase leading-tight">
              Gannon<br />Waye
            </h1>
            <p className="font-body text-sm md:text-lg text-foreground/60 mt-4 max-w-xl mx-auto leading-relaxed px-2">
              {site.bio || 'Australian singer-songwriter crafting honest stories through melody and verse.'}
            </p>
          </motion.div>

          {/* Countdown */}
          {upcomingRelease && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="mt-12"
            >
              <p className="font-body text-xs tracking-[0.2em] uppercase text-muted-foreground mb-4">
                "{upcomingRelease.title}" drops
              </p>
              <div className="flex justify-center">
                <CountdownTimer targetDate={upcomingRelease.release_date} />
              </div>
            </motion.div>
          )}

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
            {/* Left column — left aligned */}
            <motion.div
              initial={{ opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="font-body text-foreground/60 leading-relaxed text-sm text-left space-y-3"
            >
              <p>Born and raised in Adelaide, now calling Melbourne home for over 13 years.</p>
              <p>A deep thinker and feeler who sees beyond the limitations of the mind into things others often miss.</p>
              <p>Obsessed with travel, culture, and the creative spaces where people express who they truly are.</p>
              <p>Often misunderstood — but so were many who changed the world.</p>
            </motion.div>

            {/* Centre — quote centrepiece */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="w-56 flex flex-col items-center gap-2 pt-1"
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
              </div>
              <div className="w-px h-8 bg-primary/40" />
            </motion.div>

            {/* Right column — right aligned */}
            <motion.div
              initial={{ opacity: 0, x: 16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="font-body text-foreground/60 leading-relaxed text-sm text-right space-y-3"
            >
              <p>Music has always been more than sound — it's a way of understanding people and emotion.</p>
              <p>Over a decade of songwriting, shaped by grief, growth, and an unshakeable belief in human connection.</p>
              <p>If one song reaches someone at the right moment and shifts how they feel about themselves —</p>
              <p>then it has done exactly what it was meant to do.</p>
            </motion.div>
          </div>

          {/* Mobile fallback — stacked */}
          <div className="md:hidden space-y-6">
            <p className="font-body text-foreground/60 leading-relaxed text-sm text-center">
              Born and raised in Adelaide, now calling Melbourne home for over 13 years. A deep thinker who sees beyond what others often miss — obsessed with travel, culture, and the creative world.
            </p>
            <div className="border-l-2 border-primary/50 pl-4 font-display text-sm text-primary italic leading-7">
              "I didn't truly love myself until I was 33. Before that, I woke up every day wishing I could be someone else. That fear of abandonment ran my life. Then something shifted — and for the first time, I didn't want to be anyone else."
            </div>
            <p className="font-body text-foreground/60 leading-relaxed text-sm text-center">
              Over a decade of songwriting, shaped by grief, growth, and an unshakeable belief in human connection. If one song can reach someone at the right moment — it's done what it was meant to do.
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