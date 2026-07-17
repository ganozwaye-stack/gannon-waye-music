import React, { useState, useEffect } from 'react';
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
import FanMediaUpload from '@/components/public/FanMediaUpload';
import TikTokWelcomeBanner from '@/components/public/TikTokWelcomeBanner';
import SupporterLeaderboard from '@/components/public/SupporterLeaderboard';
import FanHighlightCommunity from '@/components/public/FanHighlightCommunity';
import FeaturedVideoSection from '@/components/public/FeaturedVideoSection';
import ThankYouCampaignSection from '@/components/public/ThankYouCampaignSection';
import ThankYouStorySection from '@/components/public/ThankYouStorySection';
import FirstVisitOnboarding from '@/components/public/FirstVisitOnboarding';
import ThankYouProjectCTA from '@/components/public/ThankYouProjectCTA';
import SignatureQuoteDivider from '@/components/public/SignatureQuoteDivider';

const HERO_IMAGES = [
  'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/c053c0cf4_generated_image.png',
];

const WITHOUT_YOU_HERE_COVER = 'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/e8df43132_ChatGPTImageJun23202603_50_22PM.png';
const SPOTIFY_ARTIST_URL = 'https://open.spotify.com/artist/1tu7INPvRAcRihgaEvBVAz';

const HERO_FEATURES = [
  {
    eyebrow: 'New music',
    title: 'Without You Here',
    line: 'Your voice, your heart, the way you loved me still lives inside of me.',
    copy: 'The next single arrives 31 July 2026: grief, love, and the moment a goodbye becomes a song.',
    to: '/mum',
  },
  {
    eyebrow: 'Out now',
    title: 'Thank You',
    line: 'This is what survival sounds like.',
    copy: 'The debut single is streaming now, written at the moment self-respect finally became louder than the cycle.',
    to: '/music',
  },
  {
    eyebrow: 'Worth seeing',
    title: "Mum's Garden",
    line: 'Even while leaving, she was still loving me.',
    copy: 'Step into the memorial space, hear the internal preview, and sit with the story behind Without You Here.',
    to: '/mum',
  },
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
            className="absolute inset-y-0 right-0 h-full w-full md:w-[68%] object-cover object-center"
            style={{ WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 18%)', maskImage: 'linear-gradient(to right, transparent 0%, black 18%)' }}
          />
        </AnimatePresence>
      </div>

      {/* Hero */}
      <section className="relative min-h-[calc(100svh-4rem)] md:min-h-[760px] flex items-start">
        <div className="absolute inset-0 bg-gradient-to-r from-background/96 via-background/76 to-background/18 z-10" />
        <div className="absolute inset-0 bg-gradient-to-b from-background/10 via-transparent to-background/86 z-10" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_74%_42%,rgba(212,175,55,0.12),transparent_48%)] z-10" />
        <div className="relative z-20 w-full px-4 sm:px-6 pt-7 pb-12 md:pt-10 md:pb-16 lg:pt-12">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20, filter: 'blur(8px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ duration: 0.8, delay: 0.25 }}
              className="text-center mb-7 md:mb-9"
            >
              <h1 className="sr-only">Gannon Waye</h1>
              <img
                src="https://media.base44.com/images/public/69eb7905ca6eb4180010f794/172f64a6b_0fac46594_generated_image-Edited.png"
                alt="Gannon Waye"
                className="mx-auto w-[min(92vw,760px)] h-auto"
                style={{ maxHeight: '168px' }}
              />
              <p className="font-body text-xs md:text-sm tracking-[0.28em] uppercase gradient-gold-glow mt-5">
                Singer-songwriter storyteller
              </p>
            </motion.div>
            <div className="grid lg:grid-cols-[minmax(0,0.95fr)_minmax(320px,0.72fr)] items-center gap-7 lg:gap-12">
              <div className="max-w-2xl text-left lg:pl-4">
            <p className="font-body text-[10px] md:text-xs tracking-[0.34em] uppercase gradient-gold-glow mb-4">
              Next single
            </p>
            <motion.h2
              initial={{ opacity: 0, y: 20, filter: 'blur(6px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ duration: 0.7, delay: 0.9 }}
              className="font-display text-3xl md:text-4xl xl:text-5xl text-foreground italic leading-tight mt-2 mb-2 max-w-3xl">
              "Your last breath took mine away. There's not much more I have to say."
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.2 }}
              className="font-body text-sm md:text-base text-foreground/68 mt-5 max-w-xl leading-relaxed">
              Without You Here is the next chapter: a tribute, a love letter, and the song for the voice I still reach for.
            </motion.p>

          {/* "Thank You" + "Without You Here" teaser strip in the hero */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.35 }}
            className="hidden"
          >
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-foreground/45 animate-pulse" />
              <p className="font-body text-[10px] tracking-[0.26em] uppercase text-muted-foreground">Debut Single</p>
            </div>
            <p className="font-display text-lg text-foreground italic">"Thank You"</p>
            <div className="w-px h-4 bg-border/60 hidden sm:block" />
            <div className="flex flex-col items-start gap-1">
              <p className="font-body text-[10px] tracking-[0.2em] uppercase text-muted-foreground">Out Now</p>
              <Link to="/music" className="font-display text-base text-foreground/85 italic hover:text-foreground transition-colors">Stream Now →</Link>
            </div>
            <div className="w-px h-4 bg-border/60 hidden sm:block" />
            <div className="flex flex-col items-start gap-1">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-foreground/35 animate-pulse" />
                <p className="font-body text-[10px] tracking-[0.2em] uppercase text-muted-foreground">Next Single</p>
              </div>
              <Link to="/mum" className="font-display text-base text-foreground/80 italic hover:underline">"Without You Here" — Releasing 31 July 2026 →</Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mt-7 flex flex-col sm:flex-row gap-3 justify-start"
          >
            <Link to="/music" className="w-full sm:w-auto">
              <Button className="gap-2 w-full sm:w-auto px-8 py-5 text-sm tracking-wider uppercase font-body rounded-full gradient-gold-button border-0">
                <Play className="w-4 h-4" /> Stream Now
              </Button>
            </Link>
            <Link to="/this-is-my-life" className="w-full sm:w-auto">
              <Button variant="outline" className="gap-2 w-full sm:w-auto px-8 py-5 text-sm tracking-wider uppercase font-body rounded-full border-foreground/20 hover:bg-foreground/5">
                My Story <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link to="/mum" className="w-full sm:w-auto">
              <Button variant="outline" className="gap-2 w-full sm:w-auto px-8 py-5 text-sm tracking-wider uppercase font-body rounded-full border-foreground/20 text-foreground/80 hover:bg-foreground/5">
                Without You Here <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </motion.div>
            </div>
            <motion.div
              initial={{ opacity: 0, x: 18, scale: 0.98 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.55 }}
              className="rounded-2xl border border-primary/28 bg-card/58 backdrop-blur-md p-4 sm:p-5 shadow-[0_0_48px_rgba(212,175,55,0.12)]"
            >
              <div className="grid sm:grid-cols-[160px_1fr] gap-5 items-center">
                <div className="relative aspect-square overflow-hidden rounded-xl border border-primary/25 bg-secondary/50">
                  <img
                    src={WITHOUT_YOU_HERE_COVER}
                    alt="Without You Here single cover"
                    className="h-full w-full object-cover"
                  />
                  <Link
                    to="/mum"
                    aria-label="Open Without You Here release page"
                    className="absolute inset-0 flex items-center justify-center bg-background/10 transition-colors hover:bg-background/0"
                  >
                    <span className="flex h-14 w-14 items-center justify-center rounded-full gradient-gold-button shadow-[0_0_28px_rgba(255,224,138,0.38)]">
                      <Play className="h-6 w-6" />
                    </span>
                  </Link>
                </div>
                <div className="text-left">
                  <p className="font-body text-[10px] tracking-[0.32em] uppercase gradient-gold-glow mb-2">
                    Current single
                  </p>
                  <h3 className="font-display text-3xl text-foreground italic leading-tight">
                    Without You Here
                  </h3>
                  <p className="font-body text-xs tracking-[0.18em] uppercase text-foreground/62 mt-3">
                    Releasing 31 July 2026
                  </p>
                  <p className="font-body text-sm text-muted-foreground mt-4 leading-relaxed">
                    Spotify goes live on release day. Until then, follow the artist profile and stream Thank You.
                  </p>
                  <div className="mt-5 flex flex-col gap-2">
                    <a
                      href={SPOTIFY_ARTIST_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 rounded-full border border-primary/35 px-5 py-3 font-body text-xs tracking-wider uppercase text-foreground transition-colors hover:bg-primary/10"
                    >
                      <Play className="h-3.5 w-3.5" /> Spotify profile
                    </a>
                    <Link to="/music" className="inline-flex items-center justify-center rounded-full gradient-gold-button px-5 py-3 font-body text-xs tracking-wider uppercase">
                      Stream Thank You now
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.95 }}
            className="mt-10 md:mt-14 border-y border-primary/20 bg-background/20 backdrop-blur-[2px] py-5 md:py-6"
          >
            <div className="grid gap-5 md:grid-cols-[0.72fr_1fr_1fr_1fr] md:items-stretch">
              <div className="text-left md:pr-5">
                <p className="font-body text-[10px] tracking-[0.34em] uppercase gradient-gold-glow mb-2">
                  Worth seeing now
                </p>
                <h2 className="font-display text-2xl md:text-3xl text-foreground italic leading-tight">
                  New music. Real story. No filler.
                </h2>
              </div>
              {HERO_FEATURES.map((feature) => (
                <Link
                  key={feature.title}
                  to={feature.to}
                  className="group border-l border-primary/20 pl-4 text-left transition-colors hover:border-primary/55"
                >
                  <p className="font-body text-[9px] tracking-[0.26em] uppercase text-foreground/45 group-hover:text-primary/75 transition-colors">
                    {feature.eyebrow}
                  </p>
                  <p className="font-display text-xl text-foreground italic mt-1">
                    {feature.title}
                  </p>
                  <p className="font-display text-sm gradient-gold-glow italic leading-relaxed mt-2">
                    "{feature.line}"
                  </p>
                  <p className="font-body text-xs text-muted-foreground leading-relaxed mt-3 max-w-sm">
                    {feature.copy}
                  </p>
                </Link>
              ))}
            </div>
          </motion.div>
          </div>
        </div>
      </section>

      {/* Thank You Single — moved up */}
      <ThankYouSingle />

      {/* Thank You Campaign Visual — LIVE, awaiting Gannon approval in /admin/website-evolution */}
      {site.show_thank_you_campaign_section !== false && <ThankYouCampaignSection />}

      {/* Thankyou Song Story — LIVE, awaiting Gannon review */}
      <ThankYouStorySection />

      <SignatureQuoteDivider quoteIndex={3} />

      {/* About Section — magazine 3-column */}
      <section className="py-12 md:py-16 px-4 md:px-6 relative">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8"
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
              className="font-body text-foreground/70 leading-relaxed text-sm text-left space-y-4 pt-8 flex flex-col items-start"
            >
              <p className="max-w-[34rem]">I'm a singer-songwriter born and raised in Adelaide, now calling Melbourne home for over 13 years. Music has always been more than sound to me. It's the language I use to understand people, emotion, and the parts of life that don't always have words.</p>
              <p className="max-w-[32rem]">I think deeply, feel deeply, and notice what others often miss. I'm obsessed with travel and culture. I care about people's wellbeing, sometimes more than they even realise about themselves. That perspective finds its way into everything I write.</p>
              <p className="italic text-sm max-w-[35rem]">I've been misunderstood and mislabelled more times than I can count. But I've learned that being misunderstood doesn't mean you're wrong. It often means you're seeing something others aren't ready for yet.</p>
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
                <p className="mt-2 text-primary/60 not-italic tracking-widest uppercase text-[9px]">Gannon Waye</p>
              </div>
              <div className="w-0.5 h-6 bg-gradient-to-b from-primary/30 to-primary" />
            </motion.div>

            {/* Right column */}
            <motion.div
              initial={{ opacity: 0, x: 16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="font-body text-foreground/70 leading-relaxed text-sm text-right space-y-4 pt-8 flex flex-col items-end"
            >
              <p className="max-w-[32rem]">My journey hasn't been simple. I've experienced loss, grief, and environments that challenged my sense of self. But those experiences shaped me and gave me something real to say.</p>
              <p className="max-w-[35rem]">I began singing at a young age, runner up in Adelaide Search for a Star, Top 100 in the early days of Australian Idol, and a few others. But this isn't about trophies. The past decade has been about something far more personal: developing my own voice and writing from lived experience.</p>
              <p className="max-w-[29rem]">That work is now becoming an album: a collection for anyone who needs a message of hope, or an anthem that reminds them they're not alone.</p>
            </motion.div>
          </div>

          {/* Mobile fallback — stacked, full story */}
          <div className="md:hidden space-y-6">
            <p className="font-body text-foreground/70 leading-relaxed text-sm text-left">
              I'm a singer-songwriter born and raised in Adelaide, now calling Melbourne home for over 13 years. Music has always been more than sound to me. It's the language I use to understand people, emotion, and the parts of life that don't always have words.
            </p>
            <p className="font-body text-foreground/70 leading-relaxed text-sm text-left">
              I think deeply, feel deeply, and notice what others often miss. I'm obsessed with travel and culture. I care about people's wellbeing, sometimes more than they even realise about themselves. That perspective finds its way into everything I write.
            </p>
            <p className="font-body text-foreground/70 leading-relaxed text-sm text-left italic">
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
            <p className="font-body text-foreground/70 leading-relaxed text-sm text-left">
              My journey hasn't been simple. I've experienced loss, grief, and environments that challenged my sense of self. But those experiences shaped me and gave me something real to say.
            </p>
            <p className="font-body text-foreground/70 leading-relaxed text-sm text-left">
              I began singing at a young age, runner up in Adelaide Search for a Star, Top 100 in the early days of Australian Idol, and a few others. But this isn't about trophies. The past decade has been about something far more personal: developing my own voice and writing from lived experience.
            </p>
            <p className="font-body text-foreground/70 leading-relaxed text-sm text-left">
              That work is now becoming an album, a collection for anyone who needs a message of hope or just an anthem that reminds them they're not alone.
            </p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-10 flex justify-center"
          >
            <SocialLinks settings={site} className="justify-center" />
          </motion.div>
        </div>
      </section>



      {/* Merch Teaser */}
      <MerchTeaserSection />

      {/* Boutique Store World CTA */}
      <StoreWorldTeaser />

      <SignatureQuoteDivider quoteIndex={9} />

      {/* Fan Highlight Wall + Join Community (Merged) */}
      <FanHighlightCommunity />

      {/* Thank You Hero Banner */}
      <ThankYouHeroBanner />

      {/* Featured Video */}
      <FeaturedVideoSection />

      {/* Social Videos Preview */}
      <VideoPreviewSection />



      {/* Fan Media Upload */}
      <FanMediaUpload />

      {/* Supporter Leaderboard */}
      <SupporterLeaderboard />

      {/* Thank You Project CTA — donations, community, socials */}
      <section className="py-10 md:py-12 px-4 md:px-6">
        <div className="max-w-4xl mx-auto">
          <ThankYouProjectCTA context="Every contribution fuels independent music, supports healing, and builds a community where stories matter. 10% of all support goes to 1800RESPECT. Join the Thank You Project today." />
        </div>
      </section>

      {/* Safe Space Banner */}
      <SafeSpaceBanner />

      {/* Latest Releases Preview */}
      {releases.length > 0 && (
        <section className="py-12 md:py-16 px-4 md:px-6">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-8"
            >
              <p className="font-body text-xs tracking-[0.3em] uppercase gradient-gold-glow mb-4">Latest</p>
              <h2 className="font-display text-3xl md:text-5xl text-foreground">Music</h2>
            </motion.div>

            {/* Album — featured at top center */}
            {releases.find(r => r.type === 'album' && r.is_published) && (
              <div className="mb-8 max-w-3xl">
                <div className="relative overflow-hidden rounded-2xl p-6 md:p-8 text-left"
                  style={{
                    background: 'linear-gradient(135deg, rgba(212,175,55,0.12) 0%, rgba(245,208,110,0.06) 50%, rgba(212,175,55,0.12) 100%)',
                    border: '2px solid rgba(245,208,110,0.35)',
                    boxShadow: '0 0 50px rgba(212,175,55,0.12)',
                  }}>
                  <p className="font-body text-[10px] tracking-[0.3em] uppercase gradient-gold-glow mb-3">Album - Releasing Next Year</p>
                  <h3 className="font-display text-3xl md:text-4xl text-foreground mb-2">{releases.find(r => r.type === 'album').title}</h3>
                  <p className="font-body text-sm text-muted-foreground">{releases.find(r => r.type === 'album').description}</p>
                  <div className="flex items-center justify-start gap-2 mt-4">
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
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="group relative overflow-hidden rounded-2xl bg-card/60 backdrop-blur-sm border border-primary/20 hover:border-primary/40 transition-all"
              >
                <div className="aspect-square bg-secondary/30 overflow-hidden relative">
                  <img
                    src="https://media.base44.com/images/public/69eb7905ca6eb4180010f794/e8df43132_ChatGPTImageJun23202603_50_22PM.png"
                    alt="Without You Here — Gannon Waye single cover"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
                  <div className="absolute top-3 right-3 flex items-center gap-1.5 px-3 py-1 rounded-full bg-background/70 backdrop-blur-sm border border-primary/30">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                    <p className="font-body text-[9px] tracking-[0.2em] uppercase text-primary">Coming Soon</p>
                  </div>
                </div>
                <div className="p-6">
                  <p className="font-body text-xs tracking-widest uppercase gradient-gold-glow">Single</p>
                  <h3 className="font-display text-2xl text-foreground mt-1 italic">Without You Here</h3>
                  <p className="font-body text-sm text-muted-foreground mt-2">A tribute. A love letter. A song for the voice I still reach for.</p>
                  <p className="font-body text-xs text-primary/70 mt-3 italic">Releasing 31 July 2026</p>
                </div>
              </motion.div>
              {releases.filter((r) => r.is_published).slice(0, 2).map((release) => (
                <motion.div
                  key={release.id}
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
                    <p className="font-body text-xs tracking-widest uppercase gradient-gold-glow">{release.type}</p>
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
              ))}
            </div>
            <div className="text-center mt-8">
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
