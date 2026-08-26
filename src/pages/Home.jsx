import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import SocialLinks from '@/components/public/SocialLinks';
import SafeSpaceBanner from '@/components/public/SafeSpaceBanner';
import StoreWorldTeaser from '@/components/public/StoreWorldTeaser';
import FirstVisitOnboarding from '@/components/public/FirstVisitOnboarding';
import ThankYouProjectCTA from '@/components/public/ThankYouProjectCTA';
import HomeEmailSignup from '@/components/public/HomeEmailSignup';
import GoldenEmbers from '@/components/three/GoldenEmbers';
import MagneticButton from '@/components/public/MagneticButton';
import TiltCard from '@/components/public/TiltCard';
import HeroWelcomeBanner from '@/components/public/HeroWelcomeBanner';
import MarqueeBar from '@/components/public/MarqueeBar';
import PressKitHomeSection from '@/components/public/PressKitHomeSection';
import { trackEvent } from '@/lib/analytics';
import { usePlayerStore } from '@/lib/playerStore';
import { PUBLIC_RELEASE_FILTER, isPublicRelease } from '@/lib/publicRelease';

// House style: never use the em dash (—). Use commas, colons, or the middot (·) instead.
// Hero imagery supplied by Gannon, August 2026. Do not reassign these.
const HERO_IMAGE = 'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/cb360d5ee_image.png';
const WYH_STENCIL = 'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/b82279641_without-you-here-stencil-outline-only-transparent-tight-2026-08-03.png';
const HERO_VIDEO = 'https://media.base44.com/videos/public/69eb7905ca6eb4180010f794/8e23b3544_Ambient_Hero_Loop.mp4';
const HERO_PORTRAIT = 'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/637f52efd_image.png';
const WYH_ANGEL = 'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/3df8d7b0d_image.png';

// Cover art comes from each release's artwork_url in the database, the single source of truth.
// Do not hardcode per-song cover overrides here (that caused mis-assigned artwork in the past).

export default function Home() {
  const { data: settings } = useQuery({
    queryKey: ['siteSettings'],
    queryFn: () => base44.entities.SiteSettings.list(),
    initialData: []
  });

  const { data: releaseCandidates = [] } = useQuery({
    queryKey: ['home-public-releases'],
    queryFn: () => base44.entities.Release.filter(PUBLIC_RELEASE_FILTER, '-release_date', 50),
    initialData: [],
  });

  const site = settings[0] || {};
  const releases = releaseCandidates.filter(isPublicRelease);
  const currentSingle = releases.find((release) => release.is_current_single === true) || releases[0] || null;
  const currentArt = currentSingle?.artwork_url || HERO_IMAGE;
  const currentSpotify = currentSingle?.spotify_link || '';
  const currentLink = currentSingle?.id ? `/release/${currentSingle.id}` : '/music';
  const currentTitle = currentSingle?.title || 'Gannon Waye Music';
  const currentHeroCopy = currentSingle?.current_single_hero_copy
    || currentSingle?.description
    || 'Music is shared here only when it is ready.';
  const approvedAlbum = releases.find((release) => release.type === 'album') || null;
  const playTrack = usePlayerStore((state) => state.playTrack);

  // 3D immersive parallax: layers drift at different rates as the hero scrolls away.
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const yContent = useTransform(scrollYProgress, [0, 1], [0, -140]);
  const yStencil = useTransform(scrollYProgress, [0, 1], [0, -70]);
  const scaleEmbers = useTransform(scrollYProgress, [0, 1], [1, 1.2]);
  const opacityHero = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <div className="min-h-screen relative">
      <FirstVisitOnboarding />

      {/* HERO: two columns. Left: artwork + single info. Right: welcome write-up, with the stencil as a backdrop. */}
      <section ref={heroRef} className="relative min-h-[100svh] overflow-hidden" style={{ perspective: '1200px' }}>
        {/* Ambient base glow (face photo removed; fire embers carry the hero) */}
        <div className="absolute inset-0 z-0" style={{ background: 'radial-gradient(120% 80% at 50% 18%, rgba(212,175,55,0.10), rgba(8,8,14,0) 60%)' }} />
        

        {/* Ambient fire / campfire hero loop, restored */}
        <video
          src={HERO_VIDEO}
          autoPlay
          loop
          muted
          playsInline
          aria-hidden
          className="absolute inset-0 z-[1] w-full h-full object-cover opacity-25 pointer-events-none" />

        {/* Mum, the angel in the Without You Here artwork. Faint, far left, behind everything — her presence at the fire. Slow, almost-imperceptible drift. */}
        {currentSingle?.title === 'Without You Here' && (
          <motion.img
            src={WYH_ANGEL}
            alt=""
            aria-hidden
            className="absolute z-[2] pointer-events-none select-none w-[40%] max-w-[440px] aspect-square object-cover rounded-full"
            style={{
              left: '-4%',
              top: '24%',
              opacity: 0.4,
              maskImage: 'radial-gradient(circle, black 52%, transparent 76%)',
              WebkitMaskImage: 'radial-gradient(circle, black 52%, transparent 76%)',
              filter: 'drop-shadow(0 0 50px rgba(212,175,55,0.18))',
            }}
            animate={{ x: [0, -10, 8, 0], y: [0, 8, -6, 0], scale: [1, 1.02, 1.01, 1] }}
            transition={{ duration: 34, repeat: Infinity, ease: 'easeInOut' }}
          />
        )}

        {/* Gannon, side profile looking up. Right-aligned to the edge, behind everything, standing at the fire. Slow cinematic drift — barely moving, but moving. */}
        <motion.img
          src={HERO_PORTRAIT}
          alt="Gannon Waye"
          aria-hidden
          className="absolute z-[2] pointer-events-none select-none inset-0 w-full h-full object-cover"
          style={{
            opacity: 0.5,
            objectPosition: 'right center',
            maskImage: 'linear-gradient(to right, transparent 0%, black 26%, black 100%)',
            WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 26%, black 100%)',
            filter: 'drop-shadow(0 0 40px rgba(212,175,55,0.22))'
          }}
          animate={{ x: [0, -8, 6, 0], y: [0, -8, 6, 0], scale: [1, 1.02, 1, 1] }}
          transition={{ duration: 30, repeat: Infinity, ease: 'easeInOut' }} />

        {/* Without You Here artwork now lives as a circular medallion in the left single box */}
        

        {/* "Without You Here" stencil, stretched out as a background design staple on the right */}
        {currentSingle?.title === 'Without You Here' && (
          <motion.img
            src={WYH_STENCIL}
            alt=""
            aria-hidden
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 0.3, x: 0 }}
            transition={{ duration: 1.8, delay: 0.5 }}
            className="absolute z-[2] pointer-events-none select-none w-[95%] max-w-[62rem]"
            style={{ right: '-4%', top: '2%', filter: 'drop-shadow(0 0 34px rgba(212,175,55,0.45))', y: yStencil }}
          />
        )}
        

        {/* Subtle vignette for depth, plus page-blend fades top & bottom */}
        <div className="absolute inset-0 z-[3] pointer-events-none" style={{ background: 'radial-gradient(130% 90% at 50% 40%, rgba(8,8,14,0) 40%, rgba(8,8,14,0.65) 100%)' }} />
        <div className="absolute bottom-0 left-0 right-0 h-40 z-[3] pointer-events-none" style={{ background: 'linear-gradient(to top, hsl(var(--background)) 0%, transparent 100%)' }} />
        <div className="absolute top-0 left-0 right-0 h-16 z-[3] pointer-events-none" style={{ background: 'linear-gradient(to bottom, hsl(var(--background)) 0%, transparent 100%)' }} />

        {/* Golden embers, the fire of the hero */}
        <motion.div className="absolute inset-0 z-[4] pointer-events-none" style={{ scale: scaleEmbers }}>
          <GoldenEmbers />
        </motion.div>

        {/* Two-column content: artwork + single info on the left, welcome write-up on the right */}
        <motion.div style={{ y: yContent, opacity: opacityHero }} className="relative z-10 min-h-[92svh] flex flex-col px-6 md:px-16 lg:px-24 pt-10 md:pt-14 pb-12">
          {/* Top-center wordmark */}
          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.6, delay: 0.2 }}
            className="text-center font-body text-4xl md:text-6xl tracking-[0.18em] uppercase gradient-gold-text mb-3 md:mb-4">
            Thanking You Kindly
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.6, delay: 0.35 }}
            className="text-center font-body text-xs md:text-sm tracking-[0.4em] uppercase gradient-gold-glow mb-8 md:mb-10">
            Carry the Message
          </motion.p>

          <div className="grid md:grid-cols-2 gap-8 items-start flex-1">
          {/* LEFT: single info and CTAs */}
          <div className="max-w-xl w-full text-center mx-auto">
          <div className="rounded-2xl border border-border/25 px-5 py-4 backdrop-blur-[2px]"
               style={{ background: 'linear-gradient(135deg, rgba(8,8,14,0.5) 0%, rgba(8,8,14,0.32) 60%, rgba(8,8,14,0.18) 100%)', boxShadow: '0 8px 28px rgba(0,0,0,0.28)' }}>
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.6, delay: 0.4 }}
              className="font-body text-base tracking-[0.45em] uppercase gradient-gold-text mb-4">
              
              {currentSingle ? 'New Release' : 'Music'}
            </motion.p>

            {/* Cover artwork */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.6, delay: 0.6 }}
              className="mb-4">
              
              <Link to={currentLink} className="block mx-auto rounded-full overflow-hidden border-2 border-primary/40 hover:border-primary/70 transition-colors aspect-square max-w-[140px]"
                style={{ boxShadow: '0 0 24px rgba(212,175,55,0.35), 0 6px 18px rgba(0,0,0,0.45)' }}>
                <img src={currentArt} alt={`${currentTitle}, Gannon Waye`} className="w-full h-full object-cover" />
              </Link>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.6, delay: 1.3 }}
              className="font-body text-sm text-foreground/85 max-w-sm mx-auto leading-relaxed italic mb-3 text-center" style={{ textShadow: '0 1px 3px rgba(0,0,0,0.65)' }}>
              
              {currentHeroCopy}
            </motion.p>

            {currentSingle?.title === 'Without You Here' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.4, delay: 1.4 }}
              className="mb-5 text-center">
              
              <Link to="/remember-mum" className="inline-flex items-center gap-1 font-body text-xs tracking-wider uppercase gradient-gold-text hover:opacity-80 transition-opacity">
                Read Mum's story <ArrowRight className="w-3 h-3" />
              </Link>
            </motion.div>
            )}
          </div>

            {/* CTAs: Listen Here, Back The Thankyou Project, Out Now in a row beneath the CD */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.4, delay: 1.6 }}
              className="flex flex-wrap items-center justify-center gap-2.5 mt-2">
              {currentSpotify && (
                <MagneticButton>
                  <Button
                    type="button"
                    onClick={() => {
                      trackEvent('stream_click', {
                        platform: 'spotify',
                        source: 'hero_listen_here',
                        release_id: currentSingle?.id,
                      });
                      playTrack(currentSpotify, { title: currentTitle, artwork: currentArt });
                    }}
                    className="gap-2 px-5 py-2.5 text-xs tracking-wider uppercase font-body rounded-full gradient-gold-button border-0 whitespace-nowrap"
                  >
                    <Play className="w-3 h-3" /> Listen Here
                  </Button>
                </MagneticButton>
              )}
              <MagneticButton>
                <Link to="/back-this">
                  <Button variant="outline" className="gap-2 px-5 py-2.5 text-xs tracking-wider uppercase font-body rounded-full border-primary/40 text-primary hover:bg-primary/10 whitespace-nowrap">
                    Back The Thankyou Project 🤍
                  </Button>
                </Link>
              </MagneticButton>
              {currentSingle && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 1.4, delay: 1.9 }}
                  className="flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-full bg-primary/10 border border-primary/25 whitespace-nowrap w-fit"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                  <p className="font-body text-[10px] tracking-[0.3em] uppercase gradient-gold-text">New Single · Out Now</p>
                </motion.div>
              )}
            </motion.div>

          </div>

          {/* RIGHT: welcome / mission write-up */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.6, delay: 0.8 }}
            className="max-w-md w-full md:pl-4 pb-20">
            
            {/* Streaming player, top of the right column, below WAYE */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.4, delay: 0.6 }}
              className="mb-8">
              <HeroWelcomeBanner release={currentSingle} releaseLink={currentLink} />
            </motion.div>

            <div className="relative rounded-2xl border border-border/30 px-5 py-4 backdrop-blur-[2px]"
                 style={{ background: 'linear-gradient(135deg, rgba(8,8,14,0.5) 0%, rgba(8,8,14,0.32) 60%, rgba(8,8,14,0.18) 100%)', boxShadow: '0 8px 28px rgba(0,0,0,0.28)' }}>
            <motion.p
              initial={{ opacity: 0, letterSpacing: '0.8em' }}
              animate={{ opacity: 1, letterSpacing: '0.45em' }}
              transition={{ duration: 1.4, delay: 0.4 }}
              className="font-body uppercase gradient-gold-text text-base my-2 px-1">WELCOME</motion.p>
            <p className="font-body text-sm text-foreground/85 leading-relaxed" style={{ textShadow: '0 1px 3px rgba(0,0,0,0.65)' }}>I'm a singer-songwriter from Adelaide, now based in Melbourne. I write from lived experience about grief, healing, and the quiet courage it takes to love yourself. My mission is to make music that helps anyone who hears it feel less alone, and to honour the people who shaped us. This is independent, heart-first art, powered by community, with 10% of all support going to 1800RESPECT. Every song is recorded honestly, voice and guitar first, so the feeling stays intact. Whether you're carrying loss, rebuilding after hard years, or learning to like yourself again, you're in the right place, and you're not alone here.

            </p>
            </div>


          </motion.div>
          </div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 2 }}
          className="absolute bottom-24 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 pointer-events-none">
          <span className="font-body text-[9px] tracking-[0.35em] uppercase text-muted-foreground">Scroll</span>
          <span className="block w-px h-10 bg-gradient-to-b from-primary/70 to-transparent" />
        </motion.div>
      </section>

      {/* Rotating marquee bar */}
      <MarqueeBar />

      {/* About Section: magazine 3-column */}
      <section className="py-10 md:py-14 px-4 md:px-6 relative">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-10">
            
            <p className="font-body text-xs tracking-[0.3em] uppercase gradient-gold-glow mb-4">About</p>
            <h2 className="font-body text-3xl md:text-5xl gradient-gold-text text-[hsl(var(--foreground))]">The Story</h2>
          </motion.div>

          {/* 3-column magazine layout, hidden on mobile */}
          <div className="hidden md:grid grid-cols-[1fr_auto_1fr] gap-4 items-start">
            {/* Left column */}
            <motion.div
              initial={{ opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="font-body text-foreground/70 leading-relaxed text-sm text-left space-y-4 pt-8">
              
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
              className="w-52 flex flex-col items-center gap-1">
              
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
              className="font-body text-foreground/70 leading-relaxed text-sm text-right space-y-4 pt-8">
              
              <p>My journey hasn't been simple. I've experienced loss, grief, and environments that challenged my sense of self. But those experiences shaped me and gave me something real to say.</p>
              <p>I began singing at a young age, runner up in Adelaide Search for a Star, Top 100 in the early days of Australian Idol, and a few others. But this isn't about trophies. The past decade has been about something far more personal: developing my own voice and writing from lived experience.</p>
              <p>That work shapes the music and stories I continue to create for anyone who needs hope or a reminder that they are not alone.</p>
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
              That work shapes the music and stories I continue to create for anyone who needs hope or a reminder that they are not alone.
            </p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-12 flex justify-center">
            
            <SocialLinks settings={site} className="justify-center" />
          </motion.div>
        </div>
      </section>

      {/* Music: latest releases, moved up to follow the Story */}
      {/* Latest Releases Preview */}
      {releases.length > 0 &&
      <section className="py-10 md:py-14 px-4 md:px-6">
          <div className="max-w-6xl mx-auto">
            <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12">
            
              <p className="font-body text-xs tracking-[0.3em] uppercase gradient-gold-glow mb-4">Latest</p>
              <h2 className="font-body text-3xl md:text-5xl gradient-gold-text">Music</h2>
            </motion.div>

            {/* Album, featured at top center */}
            {approvedAlbum &&
          <div className="mb-8 max-w-2xl mx-auto">
                <div className="relative overflow-hidden rounded-2xl p-8 md:p-10 text-center"
            style={{
              background: 'linear-gradient(135deg, rgba(212,175,55,0.12) 0%, rgba(245,208,110,0.06) 50%, rgba(212,175,55,0.12) 100%)',
              border: '2px solid rgba(245,208,110,0.35)',
              boxShadow: '0 0 50px rgba(212,175,55,0.12)'
            }}>
                  <p className="font-body text-[10px] tracking-[0.3em] uppercase gradient-gold-glow mb-3">Current Album</p>
                  <h3 className="font-body text-3xl md:text-4xl gradient-gold-text mb-2">{approvedAlbum.title}</h3>
                  <p className="font-body text-sm text-muted-foreground">{approvedAlbum.description}</p>
                  <div className="flex items-center justify-center gap-2 mt-4">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                    </span>
                    <span className="font-body text-xs gradient-gold-text uppercase tracking-wider">Public Release</span>
                  </div>
                </div>
              </div>
          }

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-5 max-w-xl mx-auto">
              {/* Without You Here now shows from the published releases list below, no longer a Coming Soon card */}
              {releases.slice(0, 2).map((release) =>
            <TiltCard key={release.id} max={6} className="rounded-2xl">
                <Link to={`/release/${release.id}`}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="group relative overflow-hidden rounded-2xl bg-card/60 backdrop-blur-sm border border-border/40 hover:border-primary/30 transition-all h-full">
                  
                  <div className="aspect-square bg-secondary/50 overflow-hidden">
                    {release.artwork_url ?
                    <img
                      src={release.artwork_url}
                      alt={`${release.title}, Gannon Waye`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" /> :


                    <div className="w-full h-full flex items-center justify-center">
                        <Play className="w-12 h-12 text-muted-foreground/30" />
                      </div>
                    }
                  </div>
                  <div className="p-6">
                    <p className="font-body text-xs tracking-widest uppercase gradient-gold-text">{release.type}</p>
                    <h3 className="font-body text-2xl gradient-gold-text mt-1">{release.title}</h3>
                    <p className="font-body text-sm text-muted-foreground mt-2 line-clamp-2">{release.description}</p>
                    {release.release_date &&
                    <p className="font-body text-xs text-muted-foreground mt-3">
                        Released {new Date(release.release_date).toLocaleDateString('en-AU', { month: 'long', day: 'numeric', year: 'numeric' })}
                      </p>
                    }
                  </div>
                </motion.div>
                </Link>
                </TiltCard>
            )}
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
      }

      {/* Digital Press Kit */}
      <PressKitHomeSection />

      {/* Boutique Store World CTA */}
      <StoreWorldTeaser />

      {/* Thank You Project CTA: donations, community, socials */}
      <section className="py-10 px-4 md:px-6">
        <div className="max-w-4xl mx-auto">
          <ThankYouProjectCTA context="Every contribution fuels independent music, supports healing, and builds a community where stories matter. 10% of all support goes to 1800RESPECT. Join the Thank You Project today." />
        </div>
      </section>

      {/* Email Signup, collect fan emails for release updates */}
      <HomeEmailSignup />

      {/* Safe Space Banner */}
      <SafeSpaceBanner />
    </div>);

}