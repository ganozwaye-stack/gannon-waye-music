import React from 'react';
import { Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { ArrowRight, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import SocialLinks from '@/components/public/SocialLinks';
import SafeSpaceBanner from '@/components/public/SafeSpaceBanner';
import StoreWorldTeaser from '@/components/public/StoreWorldTeaser';
import { useSiteReveal } from '@/hooks/useSiteReveal';
import FirstVisitOnboarding from '@/components/public/FirstVisitOnboarding';
import ThankYouProjectCTA from '@/components/public/ThankYouProjectCTA';
import HomeEmailSignup from '@/components/public/HomeEmailSignup';
import GoldenEmbers from '@/components/three/GoldenEmbers';
import MagneticButton from '@/components/public/MagneticButton';
import TiltCard from '@/components/public/TiltCard';
import HeroSongPlayer from '@/components/public/HeroSongPlayer';
import { usePlayerStore } from '@/lib/playerStore';

// House style: never use the em dash (—). Use commas, colons, or the middot (·) instead.
// Hero imagery supplied by Gannon, August 2026. Do not reassign these.
const HERO_IMAGE = 'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/cb360d5ee_image.png';
const WYH_ARTWORK = 'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/9c05e7539_image.png';
const MUM_IMAGE = 'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/0edc48d83_image.png';
const WYH_STENCIL = 'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/43bac050a_image.png';

// Cover art comes from each release's artwork_url in the database, the single source of truth.
// Do not hardcode per-song cover overrides here (that caused mis-assigned artwork in the past).

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
  const { artworkRevealed } = useSiteReveal();
  const wyhRelease = releases.find((r) => r.title === 'Without You Here');
  const wyhSpotify = wyhRelease?.spotify_link || 'https://open.spotify.com/track/6lX5V0j0bQiLOzldueTmnz';
  const playTrack = usePlayerStore((s) => s.playTrack);

  return (
    <div className="min-h-screen relative">
      <FirstVisitOnboarding />

      {/* HERO: two columns. Left: artwork + single info. Right: welcome write-up, with the stencil as a backdrop. */}
      <section className="relative min-h-[100svh] overflow-hidden">
        {/* Background: Gannon looking up into the golden sky */}
        <motion.img
          src={HERO_IMAGE}
          alt="Gannon Waye, Without You Here"
          initial={{ scale: 1.06, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ opacity: { duration: 2.4 }, scale: { duration: 22, ease: 'easeOut' } }}
          className="absolute inset-0 w-full h-full object-cover"
          style={{ objectPosition: 'center' }}
        />

        {/* Mum: ethereal, watching over from the sky glow */}
        <img
          src={MUM_IMAGE}
          alt=""
          aria-hidden
          className="absolute z-[2] w-[40%] max-w-[420px] aspect-square object-cover rounded-full opacity-40 mix-blend-screen pointer-events-none"
          style={{
            top: '5%',
            right: '6%',
            maskImage: 'radial-gradient(circle, black 52%, transparent 74%)',
            WebkitMaskImage: 'radial-gradient(circle, black 52%, transparent 74%)',
            filter: 'drop-shadow(0 0 28px rgba(212,175,55,0.35))',
          }}
        />

        {/* "Without You Here" stencil, stretched out as a background design staple on the right */}
        <motion.img
          src={WYH_STENCIL}
          alt=""
          aria-hidden
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 0.22, x: 0 }}
          transition={{ duration: 1.8, delay: 0.5 }}
          className="absolute z-[2] pointer-events-none select-none w-[60%] max-w-[42rem]"
          style={{ right: '-3%', top: '50%', transform: 'translateY(-50%)', filter: 'drop-shadow(0 0 30px rgba(212,175,55,0.4))' }}
        />

        {/* Dark scrim, readable on both sides */}
        <div className="absolute inset-0 z-[3]" style={{ background: 'linear-gradient(90deg, rgba(8,8,14,0.88) 0%, rgba(8,8,14,0.5) 45%, rgba(8,8,14,0.85) 100%)' }} />
        <div className="absolute bottom-0 left-0 right-0 h-48 z-[3] pointer-events-none" style={{ background: 'linear-gradient(to top, hsl(var(--background)) 0%, transparent 100%)' }} />
        <div className="absolute top-0 left-0 right-0 h-28 z-[3] pointer-events-none" style={{ background: 'linear-gradient(to bottom, hsl(var(--background)) 0%, transparent 100%)' }} />

        {/* Golden embers */}
        <div className="absolute inset-0 z-[4] pointer-events-none">
          <GoldenEmbers />
        </div>

        {/* Two-column content: artwork + single info on the left, welcome write-up on the right */}
        <div className="relative z-10 min-h-[100svh] grid md:grid-cols-2 gap-8 items-center px-6 md:px-16 lg:px-24 py-28 md:py-20">
          {/* LEFT: single info and CTAs */}
          <div className="max-w-xl w-full">
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.6, delay: 0.4 }}
              className="font-body text-[10px] tracking-[0.45em] uppercase text-primary/70 mb-5"
            >
              The New Single · A Film For Mum
            </motion.p>

            {/* Cover artwork and revolving hook lyrics */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.6, delay: 0.6 }}
              className="mb-6"
            >
              <HeroSongPlayer artwork={WYH_ARTWORK} spotifyLink={wyhSpotify} />
            </motion.div>

            <motion.p
              className="font-body text-[11px] tracking-[0.22em] uppercase text-foreground/50 mb-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.6, delay: 1.1 }}
            >
              Gannon Waye
            </motion.p>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.6, delay: 1.3 }}
              className="font-body text-sm text-foreground/65 max-w-sm leading-relaxed italic mb-7"
            >
              A raw, acoustic letter to Sonia, written in the early hours of Mother's Day, four years after she left.
            </motion.p>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.4, delay: 1.6 }}
              className="flex flex-wrap gap-3"
            >
              <MagneticButton>
                <Button
                  type="button"
                  onClick={() => playTrack(wyhSpotify, { title: 'Without You Here', artwork: WYH_ARTWORK })}
                  className="gap-2 px-7 py-4 text-sm tracking-wider uppercase font-body rounded-full gradient-gold-button border-0"
                >
                  <Play className="w-3.5 h-3.5" /> Listen Here
                </Button>
              </MagneticButton>
              <MagneticButton>
                <Link to="/remember-mum">
                  <Button variant="outline" className="gap-2 px-7 py-4 text-sm tracking-wider uppercase font-body rounded-full border-foreground/20 hover:bg-foreground/5">
                    Her Story <ArrowRight className="w-3.5 h-3.5" />
                  </Button>
                </Link>
              </MagneticButton>
              <MagneticButton>
                <Link to="/back-this">
                  <Button variant="outline" className="gap-2 px-7 py-4 text-sm tracking-wider uppercase font-body rounded-full border-primary/40 text-primary hover:bg-primary/10">
                    Be Part Of This 🤍
                  </Button>
                </Link>
              </MagneticButton>
            </motion.div>

            {/* Out now badge */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.4, delay: 1.9 }}
              className="mt-7 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/25"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              <p className="font-body text-[10px] tracking-[0.3em] uppercase text-primary">Out Now · Listen Everywhere</p>
            </motion.div>
          </div>

          {/* RIGHT: welcome / mission write-up */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.6, delay: 0.8 }}
            className="max-w-md w-full md:pl-4"
          >
            <p className="font-body text-[10px] tracking-[0.45em] uppercase text-primary/70 mb-4">Welcome</p>
            <p className="font-body text-base md:text-lg text-foreground/80 leading-relaxed">
              I'm a singer-songwriter from Adelaide, now based in Melbourne. I write from lived experience about grief, healing, and the quiet courage it takes to love yourself. My mission is to make music that helps anyone who hears it feel less alone, and to honour the people who shaped us. This is independent, heart-first art, powered by community, with 10% of all support going to 1800RESPECT.
            </p>
          </motion.div>
        </div>
      </section>

      {/* About Section: magazine 3-column */}
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

          {/* 3-column magazine layout, hidden on mobile */}
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

            {/* Centre, quote centrepiece */}
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

          {/* Mobile fallback, stacked, full story */}
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

      {/* Boutique Store World CTA */}
      <StoreWorldTeaser />

      {/* Thank You Project CTA: donations, community, socials */}
      <section className="py-16 px-4 md:px-6">
        <div className="max-w-4xl mx-auto">
          <ThankYouProjectCTA context="Every contribution fuels independent music, supports healing, and builds a community where stories matter. 10% of all support goes to 1800RESPECT. Join the Thank You Project today." />
        </div>
      </section>

      {/* Email Signup, collect fan emails for release updates */}
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

            {/* Album, featured at top center */}
            {releases.find(r => r.type === 'album' && r.is_published) && (
              <div className="mb-8 max-w-2xl mx-auto">
                <div className="relative overflow-hidden rounded-2xl p-8 md:p-10 text-center"
                  style={{
                    background: 'linear-gradient(135deg, rgba(212,175,55,0.12) 0%, rgba(245,208,110,0.06) 50%, rgba(212,175,55,0.12) 100%)',
                    border: '2px solid rgba(245,208,110,0.35)',
                    boxShadow: '0 0 50px rgba(212,175,55,0.12)',
                  }}>
                  <p className="font-body text-[10px] tracking-[0.3em] uppercase gradient-gold-glow mb-3">Album, Releasing Next Year</p>
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
              {/* Without You Here now shows from the published releases list below, no longer a Coming Soon card */}
              {releases.filter((r) => r.is_published).slice(0, 2).map((release) => (
                <TiltCard key={release.id} max={6} className="rounded-2xl">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="group relative overflow-hidden rounded-2xl bg-card/60 backdrop-blur-sm border border-border/40 hover:border-primary/30 transition-all"
                >
                  <div className="aspect-square bg-secondary/50 overflow-hidden">
                    {release.artwork_url ? (
                      <img
                        src={release.artwork_url}
                        alt={`${release.title}, Gannon Waye`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
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