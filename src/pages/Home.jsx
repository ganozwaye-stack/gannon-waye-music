import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import SocialLinks from '@/components/public/SocialLinks';
import ThankYouSingle from '@/components/public/ThankYouSingle';
import SafeSpaceBanner from '@/components/public/SafeSpaceBanner';

import ThankYouHeroBanner from '@/components/public/ThankYouHeroBanner';
import VideoPreviewSection from '@/components/public/VideoPreviewSection';
import MerchTeaserSection from '@/components/public/MerchTeaserSection';
import StoreWorldTeaser from '@/components/public/StoreWorldTeaser';
import { useSiteReveal } from '@/hooks/useSiteReveal';
import HeroQuoteRotator from '@/components/public/HeroQuoteRotator';
import FanMediaUpload from '@/components/public/FanMediaUpload';
import TikTokWelcomeBanner from '@/components/public/TikTokWelcomeBanner';
import SupporterLeaderboard from '@/components/public/SupporterLeaderboard';
import FanHighlightCommunity from '@/components/public/FanHighlightCommunity';
import FeaturedVideoSection from '@/components/public/FeaturedVideoSection';
import ThankYouCampaignSection from '@/components/public/ThankYouCampaignSection';
import ThankYouStorySection from '@/components/public/ThankYouStorySection';
import FirstVisitOnboarding from '@/components/public/FirstVisitOnboarding';
import ThankYouProjectCTA from '@/components/public/ThankYouProjectCTA';
import HomeEmailSignup from '@/components/public/HomeEmailSignup';
import GoldenEmbers from '@/components/three/GoldenEmbers';
import MagneticButton from '@/components/public/MagneticButton';
import FloatingImage from '@/components/public/FloatingImage';
import TiltCard from '@/components/public/TiltCard';

const HERO_IMAGES = [
  'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/4c4319141_image.png',
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
      <FirstVisitOnboarding />
      <TikTokWelcomeBanner />

      {/* Fixed background — visible behind ALL sections */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <AnimatePresence>
          <motion.img
            key={currentImg}
            src={HERO_IMAGES[currentImg]}
            alt="Gannon Waye"
            initial={{ opacity: 0, scale: 1.15 }}
            animate={{ opacity: 0.55, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ opacity: { duration: 1.5 }, scale: { duration: 8, ease: 'easeOut' } }}
            className="absolute inset-0 w-full h-full object-cover object-[center_50%]"
          />
        </AnimatePresence>
      </div>

      {/* Hero — Without You Here cinematic centerpiece */}
      <section className="relative min-h-[100svh] flex items-center justify-center overflow-hidden">
        <motion.img
          src="https://media.base44.com/images/public/69eb7905ca6eb4180010f794/e8df43132_ChatGPTImageJun23202603_50_22PM.png"
          alt="Without You Here — Gannon Waye"
          initial={{ scale: 1.18, opacity: 0 }}
          animate={{ scale: 1.05, opacity: 0.6 }}
          transition={{ scale: { duration: 20, ease: 'easeInOut', repeat: Infinity, repeatType: 'reverse' }, opacity: { duration: 2 } }}
          className="absolute inset-0 w-full h-full object-cover object-[center_30%] z-0"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/55 to-background/95 z-10" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(212,175,55,0.05),transparent_60%)] z-10" />
        <div className="absolute top-0 left-0 right-0 h-[7vh] bg-background z-20 pointer-events-none" />
        <div className="absolute bottom-0 left-0 right-0 h-[8vh] bg-gradient-to-t from-background via-background/80 to-transparent z-20 pointer-events-none" />
        <div className="absolute inset-0 z-[15] pointer-events-none">
          <GoldenEmbers />
        </div>
        <div className="relative z-20 text-center px-6 max-w-4xl mx-auto">
            <motion.img
              initial={{ opacity: 0, y: 20, filter: 'blur(8px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ duration: 0.8, delay: 0.3 }}
              src="https://media.base44.com/images/public/69eb7905ca6eb4180010f794/172f64a6b_0fac46594_generated_image-Edited.png" alt="Gannon Waye" className="max-w-full h-auto mx-auto" style={{ maxHeight: '120px' }} />
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="font-body text-xs tracking-[0.3em] uppercase gradient-gold-glow mb-8 mt-6">Singer, Songwriter, Storyteller</motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 20, filter: 'blur(6px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ duration: 0.7, delay: 0.9 }}
              className="font-display text-2xl md:text-3xl text-foreground italic leading-snug mt-2 mb-2">
              "For them, it was about appearance.<br className="hidden sm:block" /> For me, I was breaking inside."
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.2 }}
              className="font-body text-sm md:text-base text-foreground/60 mt-3 max-w-xl mx-auto leading-relaxed px-2">
              This is more than music. This is choosing yourself.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.5 }}
              className="mt-6">
              <HeroQuoteRotator />
            </motion.div>

          {/* Without You Here — cinematic title */}
          <motion.div
            initial={{ opacity: 0, y: 24, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 1, delay: 0.4 }}
            className="mt-10"
          >
            <p className="font-body text-[10px] tracking-[0.4em] uppercase text-primary/70 mb-3">The New Single · A Film For Mum</p>
            <h1 className="font-display text-5xl md:text-7xl gradient-gold-glow italic leading-[1.05]">Without You Here</h1>
            <p className="font-body text-sm md:text-base text-foreground/70 mt-4 max-w-xl mx-auto italic leading-relaxed">
              A raw, acoustic letter to Sonia — written in the early hours of Mother's Day, four years after she left.
            </p>
            <div className="inline-flex items-center gap-2 mt-5 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/30">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              <p className="font-body text-[10px] tracking-[0.3em] uppercase text-primary">Coming Soon · Date To Be Announced</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mt-8 flex flex-col sm:flex-row gap-3 justify-center px-4"
          >
            <MagneticButton className="w-full sm:w-auto">
              <Link to="/presave" className="w-full sm:w-auto">
                <Button className="gap-2 w-full sm:w-auto px-8 py-5 text-sm tracking-wider uppercase font-body rounded-full gradient-gold-button border-0">
                  <Play className="w-4 h-4" /> Pre-save
                </Button>
              </Link>
            </MagneticButton>
            <MagneticButton className="w-full sm:w-auto">
              <Link to="/remember-mum" className="w-full sm:w-auto">
                <Button variant="outline" className="gap-2 w-full sm:w-auto px-8 py-5 text-sm tracking-wider uppercase font-body rounded-full border-foreground/20 hover:bg-foreground/5">
                  Her Story <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </MagneticButton>
            <MagneticButton className="w-full sm:w-auto">
              <Link to="/back-this" className="w-full sm:w-auto">
                <Button variant="outline" className="gap-2 w-full sm:w-auto px-8 py-5 text-sm tracking-wider uppercase font-body rounded-full border-primary/40 text-primary hover:bg-primary/10">
                  Be Part Of This 🤍
                </Button>
              </Link>
            </MagneticButton>
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
              <p>I'm a singer-songwriter born and raised in Adelaide, now calling Melbourne home for over 13 years. Music has always been more than sound to me. It's the language I use to understand people, emotion, and the parts of life that don't always have words.</p>
              <p>I think deeply, feel deeply, and notice what others often miss. I'm obsessed with travel and culture. I care about people's wellbeing, sometimes more than they even realise about themselves. That perspective finds its way into everything I write.</p>
              <p className="italic text-sm">I've been misunderstood and mislabelled more times than I can count. But I've learned that being misunderstood doesn't mean you're wrong. It often means you're seeing something others aren't ready for yet.</p>
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
              <p>I began singing at a young age, runner up in Adelaide Search for a Star, Top 100 in the early days of Australian Idol, and a few others. But this isn't about trophies. The past decade has been about something far more personal: developing my own voice and writing from lived experience.</p>
              <p>That work is now becoming an album, a collection for anyone who needs a message of hope or just an anthem that reminds them they're not alone.</p>
            </motion.div>
          </div>

          {/* Mobile fallback — stacked, full story */}
          <div className="md:hidden space-y-6">
            <p className="font-body text-foreground/70 leading-relaxed text-sm text-center">
              I'm a singer-songwriter born and raised in Adelaide, now calling Melbourne home for over 13 years. Music has always been more than sound to me. It's the language I use to understand people, emotion, and the parts of life that don't always have words.
            </p>
            <p className="font-body text-foreground/70 leading-relaxed text-sm text-center">
              I think deeply, feel deeply, and notice what others often miss. I'm obsessed with travel and culture. I care about people's wellbeing, sometimes more than they even realise about themselves. That perspective finds its way into everything I write.
            </p>
            <p className="font-body text-foreground/70 leading-relaxed text-sm text-center italic">
              I've been misunderstood and mislabelled more times than I can count. But I've learned that being misunderstood doesn't mean you're wrong. It often means you're seeing something others aren't ready for yet.
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
              I began singing at a young age, runner up in Adelaide Search for a Star, Top 100 in the early days of Australian Idol, and a few others. But this isn't about trophies. The past decade has been about something far more personal: developing my own voice and writing from lived experience.
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



      {/* Merch Teaser */}
      <MerchTeaserSection />

      {/* Boutique Store World CTA */}
      <StoreWorldTeaser />

      {/* Fan Highlight Wall + Join Community (Merged) */}
      <FanHighlightCommunity />



      {/* Featured Video */}
      <FeaturedVideoSection />

      {/* Social Videos Preview */}
      <VideoPreviewSection />



      {/* Fan Media Upload */}
      <FanMediaUpload />

      {/* Supporter Leaderboard */}
      <SupporterLeaderboard />

      {/* Thank You Project CTA — donations, community, socials */}
      <section className="py-16 px-4 md:px-6">
        <div className="max-w-4xl mx-auto">
          <ThankYouProjectCTA context="Every contribution fuels independent music, supports healing, and builds a community where stories matter. 10% of all support goes to 1800RESPECT. Join the Thank You Project today." />
        </div>
      </section>

      {/* Email Signup — collect fan emails for release updates */}
      <HomeEmailSignup />

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

            {/* Album — featured at top center */}
            {releases.find(r => r.type === 'album' && r.is_published) && (
              <div className="mb-8 max-w-2xl mx-auto">
                <div className="relative overflow-hidden rounded-2xl p-8 md:p-10 text-center"
                  style={{
                    background: 'linear-gradient(135deg, rgba(212,175,55,0.12) 0%, rgba(245,208,110,0.06) 50%, rgba(212,175,55,0.12) 100%)',
                    border: '2px solid rgba(245,208,110,0.35)',
                    boxShadow: '0 0 50px rgba(212,175,55,0.12)',
                  }}>
                  <p className="font-body text-[10px] tracking-[0.3em] uppercase gradient-gold-glow mb-3">Album — Releasing Next Year</p>
                  <h3 className="font-display text-3xl md:text-4xl text-foreground mb-2">{releases.find(r => r.type === 'album').title}</h3>
                  <p className="font-body text-sm text-muted-foreground">{releases.find(r => r.type === 'album').description}</p>
                  <div className="flex items-center justify-center gap-2 mt-4">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                    </span>
                    <span className="font-body text-xs text-primary/70 uppercase tracking-wider">In Production</span>
                  </div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
              {/* Without You Here — Coming Soon card */}
              <TiltCard max={6} className="rounded-2xl">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="group relative overflow-hidden rounded-2xl bg-card/60 backdrop-blur-sm border border-primary/20 hover:border-primary/40 transition-all"
              >
                <div className="aspect-square bg-secondary/30 overflow-hidden relative">
                  <FloatingImage className="w-full h-full" amplitude={5} duration={5}>
                    <img
                      src="https://media.base44.com/images/public/69eb7905ca6eb4180010f794/e8df43132_ChatGPTImageJun23202603_50_22PM.png"
                      alt="Without You Here — Gannon Waye single cover"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </FloatingImage>
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
                  <div className="absolute top-3 right-3 flex items-center gap-1.5 px-3 py-1 rounded-full bg-background/70 backdrop-blur-sm border border-primary/30">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                    <p className="font-body text-[9px] tracking-[0.2em] uppercase text-primary">Coming Soon</p>
                  </div>
                </div>
                <div className="p-6">
                  <p className="font-body text-xs tracking-widest uppercase gradient-gold-text">Single</p>
                  <h3 className="font-display text-2xl text-foreground mt-1 italic">Without You Here</h3>
                  <p className="font-body text-sm text-muted-foreground mt-2">A tribute. A love letter. A song for the voice I still reach for.</p>
                  <p className="font-body text-xs text-primary/60 mt-3 italic">Date to be announced very soon</p>
                </div>
              </motion.div>
              </TiltCard>
              {releases.filter((r) => r.is_published).slice(0, 2).map((release) => (
                <TiltCard key={release.id} max={6} className="rounded-2xl">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="group relative overflow-hidden rounded-2xl bg-card/60 backdrop-blur-sm border border-border/40 hover:border-primary/30 transition-all"
                >
                  <div className="aspect-square bg-secondary/50 overflow-hidden">
                    {release.title === 'Thank You' ? (
                      <img src="https://media.base44.com/images/public/69eb7905ca6eb4180010f794/6dde7d697_2.jpg" alt="Thank You — Gannon Waye single cover" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
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
                    <p className="font-body text-sm text-muted-foreground mt-2 line-clamp-2">{release.title === 'Thank You' ? '"Thank You" was written at a turning point, when staying any longer would have meant abandoning himself all over again. This song is not about the pain. It is about the line being drawn. "Thank You" is what it sounds like when you break a cycle and refuse to return to it.' : release.description}</p>
                    {release.release_date && (
                      <p className="font-body text-xs text-muted-foreground mt-3">
                        {new Date(release.release_date) > new Date() ? 'Coming ' : 'Released '}
                        {new Date(release.release_date).toLocaleDateString('en-AU', { month: 'long', day: 'numeric', year: 'numeric' })}
                      </p>
                    )}
                  </div>
                </motion.div>
                </TiltCard>
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