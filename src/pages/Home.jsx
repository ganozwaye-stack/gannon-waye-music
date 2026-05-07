import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Play, Gift } from 'lucide-react';
import { Button } from '@/components/ui/button';
import CountdownTimer from '@/components/public/CountdownTimer';
import SocialLinks from '@/components/public/SocialLinks';
import ThankYouSingle from '@/components/public/ThankYouSingle';
import SafeSpaceBanner from '@/components/public/SafeSpaceBanner';
import ThankYouHeroBanner from '@/components/public/ThankYouHeroBanner';
import VideoPreviewSection from '@/components/public/VideoPreviewSection';
import MerchTeaserSection from '@/components/public/MerchTeaserSection';
import { useSiteReveal } from '@/hooks/useSiteReveal';
import HomeEmailSignup from '@/components/public/HomeEmailSignup';
import HeroQuoteRotator from '@/components/public/HeroQuoteRotator';
import FanMediaUpload from '@/components/public/FanMediaUpload';
import RecentActivityStrip from '@/components/public/RecentActivityStrip';
import TikTokWelcomeBanner from '@/components/public/TikTokWelcomeBanner';
import SupporterLeaderboard from '@/components/public/SupporterLeaderboard';

const HERO_IMAGES = [
  'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/c053c0cf4_generated_image.png',
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
  const { artworkRevealed } = useSiteReveal();


  const [currentImg, setCurrentImg] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImg((i) => (i + 1) % HERO_IMAGES.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen relative">
      <TikTokWelcomeBanner />
      {/* Fixed background — visible behind ALL sections */}
      <div className="fixed inset-0 -z-10">
        <AnimatePresence>
          <motion.img
            key={currentImg}
            src={HERO_IMAGES[currentImg]}
            alt="Gannon Waye"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.55 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5 }}
            className="absolute inset-0 w-full h-full object-cover object-[center_50%]"
          />
        </AnimatePresence>
      </div>

      {/* Hero */}
      <section className="relative min-h-[100svh] flex items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-b from-background/10 via-background/20 to-background/90 z-10" />
        <div className="relative z-20 text-center px-6 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <img src="https://media.base44.com/images/public/69eb7905ca6eb4180010f794/172f64a6b_0fac46594_generated_image-Edited.png" alt="Gannon Waye" className="max-w-full h-auto" style={{ maxHeight: '120px' }} />
            <p className="font-body text-xs tracking-[0.3em] uppercase gradient-gold-glow mb-8 mt-6">Singer, Songwriter, Storyteller</p>
            <p className="font-body text-sm md:text-base text-foreground/60 mt-3 max-w-xl mx-auto leading-relaxed px-2">
              I write songs about the messy, real parts of being human. The grief that transforms you. The growth that comes from breaking open. The quiet power of finally becoming yourself. My music is built from lived experience, written for anyone who's felt unseen. This is a space where vulnerability becomes strength.
            </p>
            <div className="mt-6">
              <HeroQuoteRotator />
            </div>
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
              <p className="font-body text-[10px] tracking-[0.3em] uppercase gradient-gold-glow">Debut Single</p>
            </div>
            <p className="font-display text-lg text-foreground italic">"Thank You"</p>
            <div className="w-px h-4 bg-border/60 hidden sm:block" />
            <div className="flex flex-col items-center gap-1">
              <p className="font-body text-[10px] tracking-[0.2em] uppercase text-muted-foreground">Artwork & Release Date Reveal</p>
              <CountdownTimer targetDate="2026-05-10T04:00:00Z" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mt-8 flex flex-col sm:flex-row gap-3 justify-center px-4"
          >
            <Link to="/music" className="w-full sm:w-auto">
              <Button className="gap-2 w-full sm:w-auto px-8 py-5 text-sm tracking-wider uppercase font-body rounded-full gradient-gold-button border-0">
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
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-10"
          >
            <p className="font-body text-xs tracking-[0.3em] uppercase gradient-gold-glow mb-4">About</p>
            <h2 className="font-display text-3xl md:text-5xl text-foreground">The Story</h2>
          </motion.div>

          {/* 3-column magazine layout — hidden on mobile */}
          <div className="hidden md:grid grid-cols-[1fr_auto_1fr] gap-4 items-start">
            {/* Left column */}
            <motion.div
              initial={{ opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="font-body text-foreground/70 leading-relaxed text-sm text-left space-y-4 pt-8"
            >
              <p>I'm a singer-songwriter born and raised in Adelaide, now calling Melbourne home for over 13 years. Music has always been more than sound to me, it's the language I use to understand people, emotion, and the parts of life that don't always have words.</p>
              <p>I think deeply, feel deeply, and notice what others often miss. I'm obsessed with travel and culture. I care about people's wellbeing, sometimes more than they even realise about themselves. That perspective finds its way into everything I write.</p>
              <p className="italic text-sm">I've been misunderstood and mislabelled more times than I can count. But I've learned that being misunderstood doesn't mean you're wrong, it often means you're seeing something others aren't ready for yet.</p>
            </motion.div>

            {/* Centre — quote centrepiece */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="w-52 flex flex-col items-center gap-1"
            >
              <div className="w-0.5 h-6 bg-gradient-to-b from-primary to-primary/30" />
              <div className="font-display text-base gradient-gold-glow leading-7 italic text-center space-y-0">
                <p>I didn't truly love myself</p>
                <p>until I was 33.</p>
                <p>Before that, I woke up</p>
                <p>every day wishing</p>
                <p>I could be someone else.</p>
                <p>That fear of abandonment</p>
                <p>ran my life.</p>
                <p>Then something shifted</p>
                <p>and for the first time,</p>
                <p>I didn't want to be</p>
                <p>anyone else.</p>
                <p className="mt-2 text-primary/50 not-italic tracking-widest uppercase text-[9px]">Gannon Waye</p>
              </div>
              <div className="w-0.5 h-6 bg-gradient-to-b from-primary/30 to-primary" />
            </motion.div>

            {/* Right column */}
            <motion.div
              initial={{ opacity: 0, x: 16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="font-body text-foreground/70 leading-relaxed text-sm text-right space-y-4 pt-8"
            >
              <p>My journey hasn't been simple. I've experienced loss, grief, and environments that challenged my sense of self. But those experiences shaped me and gave me something real to say.</p>
              <p>I began singing at a young age, runner-up in Adelaide Search for a Star, Top 100 in the early days of Australian Idol, and a few others. But this isn't about trophies. The past decade has been about something far more personal: developing my own voice and writing from lived experience.</p>
              <p>That work is now becoming an album, a collection for anyone who needs a message of hope or just an anthem that reminds them they're not alone.</p>
            </motion.div>
          </div>

          {/* Mobile fallback — stacked, full story */}
          <div className="md:hidden space-y-6">
            <p className="font-body text-foreground/70 leading-relaxed text-sm text-center">
              I'm a singer-songwriter born and raised in Adelaide, now calling Melbourne home for over 13 years. Music has always been more than sound to me, it's the language I use to understand people, emotion, and the parts of life that don't always have words.
            </p>
            <p className="font-body text-foreground/70 leading-relaxed text-sm text-center">
              I think deeply, feel deeply, and notice what others often miss. I'm obsessed with travel and culture. I care about people's wellbeing, sometimes more than they even realise about themselves. That perspective finds its way into everything I write.
            </p>
            <p className="font-body text-foreground/70 leading-relaxed text-sm text-center italic">
              I've been misunderstood and mislabelled more times than I can count. But I've learned that being misunderstood doesn't mean you're wrong, it often means you're seeing something others aren't ready for yet.
            </p>
            <div className="border-l-2 border-primary pl-4 font-display text-sm gradient-gold-glow italic leading-7">
              <p>I didn't truly love myself</p>
              <p>until I was 33.</p>
              <p>Before that, I woke up</p>
              <p>every day wishing</p>
              <p>I could be someone else.</p>
              <p>That fear of abandonment</p>
              <p>ran my life.</p>
              <p>Then something shifted</p>
              <p>and for the first time,</p>
              <p>I didn't want to be</p>
              <p>anyone else.</p>
            </div>
            <p className="font-body text-foreground/70 leading-relaxed text-sm text-center">
              My journey hasn't been simple. I've experienced loss, grief, and environments that challenged my sense of self. But those experiences shaped me and gave me something real to say.
            </p>
            <p className="font-body text-foreground/70 leading-relaxed text-sm text-center">
              I began singing at a young age, runner-up in Adelaide Search for a Star, Top 100 in the early days of Australian Idol, and a few others. But this isn't about trophies. The past decade has been about something far more personal: developing my own voice and writing from lived experience.
            </p>
            <p className="font-body text-foreground/70 leading-relaxed text-sm text-center">
              That work is now becoming an album, a collection for anyone who needs a message of hope or just an anthem that reminds them they're not alone.
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

      {/* Thank You Single */}
      <ThankYouSingle />

      {/* Merch Teaser */}
      <MerchTeaserSection />

      {/* Thank You Hero Banner */}
      <ThankYouHeroBanner />

      {/* Social Videos Preview */}
      <VideoPreviewSection />

      {/* Email Signup */}
      <HomeEmailSignup />

      {/* Fan Media Upload */}
      <FanMediaUpload />

      {/* Supporter Leaderboard */}
      <SupporterLeaderboard />

      {/* Recent Activity */}
      <RecentActivityStrip />

      {/* Safe Space Banner */}
      <SafeSpaceBanner />

      {/* Latest Releases Preview */}
      {releases.length > 0 && (
        <section className="py-16 md:py-24 px-4 md:px-6">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <p className="font-body text-xs tracking-[0.3em] uppercase gradient-gold-glow mb-4">Latest</p>
              <h2 className="font-display text-3xl md:text-5xl text-foreground">Music</h2>
            </motion.div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
              {/* Mystery next song card — always shown alongside releases */}
              {releases.filter((r) => r.is_published).length > 0 && releases.filter((r) => r.is_published).length < 2 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="group relative overflow-hidden rounded-2xl bg-card/60 backdrop-blur-sm border border-border/40 border-dashed"
                >
                  <div className="aspect-square bg-secondary/30 overflow-hidden flex flex-col items-center justify-center gap-4 relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent" />
                    <motion.div
                      animate={{ opacity: [0.4, 1, 0.4] }}
                      transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                      className="relative z-10 flex flex-col items-center gap-3"
                    >
                      <div className="flex gap-1.5">
                        {[0, 0.2, 0.4].map((d, i) => (
                          <motion.div
                            key={i}
                            className="w-1 rounded-full bg-primary"
                            animate={{ height: ['8px', '24px', '8px'] }}
                            transition={{ duration: 1.2, repeat: Infinity, delay: d, ease: 'easeInOut' }}
                          />
                        ))}
                      </div>
                      <p className="font-body text-[10px] tracking-[0.25em] uppercase gradient-gold-glow">Recording in progress</p>
                    </motion.div>
                  </div>
                  <div className="p-6">
                    <p className="font-body text-xs tracking-widest uppercase gradient-gold-text">Single</p>
                    <h3 className="font-display text-2xl text-foreground/60 mt-1 italic">Next Song Underway</h3>
                    <p className="font-body text-sm text-muted-foreground/60 mt-2">Something new is being written. No hints. Just know it's coming.</p>
                    <p className="font-body text-xs text-muted-foreground/40 mt-3">Details revealed when it's ready.</p>
                  </div>
                </motion.div>
              )}
              {releases.filter((r) => r.is_published).slice(0, 2).map((release) => (
                <motion.div
                  key={release.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="group relative overflow-hidden rounded-2xl bg-card/60 backdrop-blur-sm border border-border/40 hover:border-primary/30 transition-all"
                >
                  <div className="aspect-square bg-secondary/50 overflow-hidden">
                    {release.artwork_url && !artworkRevealed ? (
                       <div className="w-full h-full flex flex-col items-center justify-center gap-3" style={{ backgroundImage: 'url(https://media.base44.com/images/public/69eb7905ca6eb4180010f794/b406a2525_gannonwayecomwrappedgiftGOLDribbon.png)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
                         <div className="absolute inset-0 bg-black/40" />
                         <div className="relative z-10 flex flex-col items-center justify-center gap-3">
                           <Gift className="w-10 h-10 text-primary" />
                           <p className="font-body text-[10px] tracking-[0.3em] uppercase gradient-gold-text">Artwork Hidden</p>
                         </div>
                       </div>
                    ) : release.artwork_url ? (
                      <img src={release.artwork_url} alt={release.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Play className="w-12 h-12 text-muted-foreground/30" />
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <p className="font-body text-xs tracking-widest uppercase gradient-gold-text">{release.type}</p>
                    <h3 className="font-display text-2xl text-foreground mt-1">{release.title}</h3>
                    <p className="font-body text-sm text-muted-foreground mt-2 line-clamp-2">{release.title === 'Thank You' ? '"Thank You" — Gannon Waye. Written at a turning point, when staying any longer would have meant abandoning himself all over again. The moment of choosing self respect over repetition.' : release.description}</p>
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
                <Button className="rounded-full px-8 py-5 font-body text-sm tracking-wider uppercase gradient-gold-button border-0">
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