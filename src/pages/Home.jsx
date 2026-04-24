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
  const upcomingRelease = releases.find(r => r.status !== 'released' && r.release_date);

  const [currentImg, setCurrentImg] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImg(i => (i + 1) % HERO_IMAGES.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/70 to-background z-10" />
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
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <p className="font-body text-xs tracking-[0.3em] uppercase text-primary mb-4">Singer · Songwriter</p>
            <h1 className="font-display text-5xl md:text-8xl font-bold text-foreground leading-tight">
              Gannon<br />Waye
            </h1>
            <p className="font-body text-base md:text-lg text-foreground/60 mt-6 max-w-xl mx-auto leading-relaxed">
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
            className="mt-10 flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link to="/music">
              <Button className="gap-2 px-8 py-6 text-sm tracking-wider uppercase font-body rounded-full">
                <Play className="w-4 h-4" /> Explore Music
              </Button>
            </Link>
            <Link to="/community">
              <Button variant="outline" className="gap-2 px-8 py-6 text-sm tracking-wider uppercase font-body rounded-full border-foreground/20 hover:bg-foreground/5">
                Join the Community <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="font-body text-xs tracking-[0.3em] uppercase text-primary mb-4">About</p>
            <h2 className="font-display text-3xl md:text-5xl text-foreground mb-8">The Story</h2>
            <p className="font-body text-foreground/60 leading-relaxed text-base md:text-lg max-w-2xl mx-auto">
              From the sun-drenched coasts of Australia to the intimate confines of the recording studio, 
              Gannon Waye has spent years honing his craft as a songwriter. At 38, he's ready to share his 
              music with the world. Every song tells a story — raw, honest, and unapologetically real.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-12"
          >
            <SocialLinks settings={site} className="justify-center" />
          </motion.div>
        </div>
      </section>

      {/* Latest Releases Preview */}
      {releases.length > 0 && (
        <section className="py-24 px-6 bg-secondary/30">
          <div className="max-w-6xl mx-auto">
            <p className="font-body text-xs tracking-[0.3em] uppercase text-primary mb-4 text-center">Latest</p>
            <h2 className="font-display text-3xl md:text-5xl text-foreground mb-12 text-center">Music</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {releases.filter(r => r.is_published).slice(0, 2).map(release => (
                <motion.div
                  key={release.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="group relative overflow-hidden rounded-2xl bg-card border border-border/40 hover:border-primary/30 transition-all"
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