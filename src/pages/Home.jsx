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
import { WITHOUT_YOU_HERE_COVER } from '@/constants/musicAssets';

function CinematicCelebration() {
  const canvasRef = useRef(null);
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    class Particle {
      constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.color = color;
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 5 + 2;
        this.vx = Math.cos(angle) * speed;
        this.vy = Math.sin(angle) * speed;
        this.alpha = 1;
        this.decay = Math.random() * 0.015 + 0.01;
        this.gravity = 0.05;
      }
      update() {
        this.vx *= 0.98;
        this.vy *= 0.98;
        this.vy += this.gravity;
        this.x += this.vx;
        this.y += this.vy;
        this.alpha -= this.decay;
      }
      draw(c) {
        c.save();
        c.globalAlpha = this.alpha;
        c.fillStyle = this.color;
        c.beginPath();
        c.arc(this.x, this.y, Math.random() * 2 + 1, 0, Math.PI * 2);
        c.fill();
        c.restore();
      }
    }

    class Firework {
      constructor() {
        this.x = Math.random() * width;
        this.y = height;
        this.tx = this.x + (Math.random() * 200 - 100);
        this.ty = Math.random() * (height * 0.4) + 100;
        const speed = Math.random() * 4 + 8;
        const angle = Math.atan2(this.ty - this.y, this.tx - this.x);
        this.vx = Math.cos(angle) * speed;
        this.vy = Math.sin(angle) * speed;
        this.exploded = false;
        this.color = `hsl(${Math.random() * 360}, 100%, 70%)`;
      }
      update() {
        this.x += this.vx;
        this.y += this.vy;
        if (this.vy >= 0 || this.y <= this.ty) {
          this.exploded = true;
        }
      }
      draw(c) {
        c.save();
        c.fillStyle = '#c9a84c';
        c.beginPath();
        c.arc(this.x, this.y, 2.5, 0, Math.PI * 2);
        c.fill();
        c.restore();
      }
    }

    let fireworks = [];
    let particles = [];
    let tick = 0;

    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      tick++;

      ctx.save();
      const leftAngle = Math.sin(tick * 0.005) * 0.2 + 0.3;
      const rightAngle = Math.cos(tick * 0.005) * 0.2 - 0.3;
      
      let gradient = ctx.createLinearGradient(0, height, Math.cos(leftAngle) * height, 0);
      gradient.addColorStop(0, 'rgba(201, 168, 76, 0.12)');
      gradient.addColorStop(1, 'rgba(201, 168, 76, 0)');
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.moveTo(0, height);
      ctx.lineTo(Math.cos(leftAngle - 0.08) * height * 1.5, 0);
      ctx.lineTo(Math.cos(leftAngle + 0.08) * height * 1.5, 0);
      ctx.closePath();
      ctx.fill();

      gradient = ctx.createLinearGradient(width, height, width + Math.sin(rightAngle) * height, 0);
      gradient.addColorStop(0, 'rgba(201, 168, 76, 0.12)');
      gradient.addColorStop(1, 'rgba(201, 168, 76, 0)');
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.moveTo(width, height);
      ctx.lineTo(width + Math.sin(rightAngle - 0.08) * height * 1.5, 0);
      ctx.lineTo(width + Math.sin(rightAngle + 0.08) * height * 1.5, 0);
      ctx.closePath();
      ctx.fill();
      ctx.restore();

      if (Math.random() < 0.02) {
        fireworks.push(new Firework());
      }

      fireworks.forEach((fw, i) => {
        fw.update();
        fw.draw(ctx);
        if (fw.exploded) {
          for (let p = 0; p < 60; p++) {
            particles.push(new Particle(fw.x, fw.y, fw.color));
          }
          fireworks.splice(i, 1);
        }
      });

      particles.forEach((p, i) => {
        p.update();
        p.draw(ctx);
        if (p.alpha <= 0) {
          particles.splice(i, 1);
        }
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    const handleCanvasClick = (e) => {
      const clickX = e.clientX;
      const clickY = e.clientY;
      const color = `hsl(${Math.random() * 360}, 100%, 75%)`;
      for (let p = 0; p < 40; p++) {
        particles.push(new Particle(clickX, clickY, color));
      }
    };
    window.addEventListener('click', handleCanvasClick);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('click', handleCanvasClick);
    };
  }, []);

  if (!isOpen) return null;

  return (
    <>
      <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-[100]" />
      <div className="fixed bottom-6 right-6 z-[110] max-w-sm w-full bg-card/90 backdrop-blur-md border border-primary/30 rounded-2xl p-6 shadow-2xl">
        <div className="flex justify-between items-start gap-4">
          <div className="space-y-2 text-left">
            <span className="inline-block bg-primary/20 text-primary border border-primary/30 rounded-full px-2.5 py-0.5 font-body text-[10px] tracking-widest uppercase">
              🎉 Release Celebration
            </span>
            <h3 className="font-display text-xl text-foreground italic">"Thank You" is Live!</h3>
            <p className="font-body text-xs text-muted-foreground leading-relaxed">
              Gannon's debut single is streaming globally. Click anywhere on your screen to launch celebratory fireworks! 🎆
            </p>
            <div className="pt-2 flex gap-2">
              <a href="https://open.spotify.com/artist/1tu7INPvRAcRihgaEvBVAz" target="_blank" rel="noopener noreferrer">
                <Button size="sm" className="rounded-full text-[10px] font-body uppercase tracking-wider gradient-gold-button border-0 h-8">
                  Spotify
                </Button>
              </a>
              <a href="/music">
                <Button size="sm" variant="outline" className="rounded-full text-[10px] font-body uppercase tracking-wider h-8">
                  Listen
                </Button>
              </a>
            </div>
          </div>
          <button onClick={() => setIsOpen(false)} className="text-muted-foreground hover:text-foreground text-sm font-semibold p-1">
            ✕
          </button>
        </div>
      </div>
    </>
  );
}
import ThankYouHeroBanner from '@/components/public/ThankYouHeroBanner';
import VideoPreviewSection from '@/components/public/VideoPreviewSection';
import MerchTeaserSection from '@/components/public/MerchTeaserSection';
import { useSiteReveal } from '@/hooks/useSiteReveal';
import HeroQuoteRotator from '@/components/public/HeroQuoteRotator';
import FanMediaUpload from '@/components/public/FanMediaUpload';
import TikTokWelcomeBanner from '@/components/public/TikTokWelcomeBanner';
import SupporterLeaderboard from '@/components/public/SupporterLeaderboard';
import FanHighlightCommunity from '@/components/public/FanHighlightCommunity';
import FeaturedVideoSection from '@/components/public/FeaturedVideoSection';
import ThankYouCampaignSection from '@/components/public/ThankYouCampaignSection';
import ThankYouStorySection from '@/components/public/ThankYouStorySection';

const HERO_IMAGES = [
  'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/c053c0cf4_generated_image.png',
];

const HOME_FEATURE_MOMENTS = [
  {
    eyebrow: 'New music',
    title: 'Without You Here',
    line: '"Your last breath took mine away. There\'s not much more I have to say."',
  },
  {
    eyebrow: 'Out now',
    title: 'Thank You',
    line: '"This is what survival sounds like."',
  },
  {
    eyebrow: 'Worth seeing',
    title: "Mum's Garden",
    line: '"Even while leaving, she was still loving me."',
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
  const [showCelebration, setShowCelebration] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImg((i) => (i + 1) % HERO_IMAGES.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const checkCelebration = () => {
      const params = new URLSearchParams(window.location.search);
      if (params.get('celebration') === 'true') {
        setShowCelebration(true);
      }
    };
    checkCelebration();
    const timer = setInterval(checkCelebration, 60000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen relative">
      {showCelebration && <CinematicCelebration />}
      <TikTokWelcomeBanner />

      {/* Fixed background — visible behind ALL sections */}
      <div className="fixed inset-0 -z-10">
        <AnimatePresence>
          <motion.img
            key={currentImg}
            src={HERO_IMAGES[currentImg]}
            alt="Gannon Waye"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.68, scale: [1.02, 1.055, 1.02] }}
            exit={{ opacity: 0 }}
            transition={{ opacity: { duration: 1.5 }, scale: { duration: 18, repeat: Infinity, ease: 'easeInOut' } }}
            className="absolute inset-0 w-full h-full object-cover object-[center_50%]"
          />
        </AnimatePresence>
        <div className="absolute inset-0 bg-[linear-gradient(90deg,#050708_0%,rgba(5,7,8,0.68)_21%,rgba(5,7,8,0.12)_50%,rgba(5,7,8,0.76)_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,7,8,0.82)_0%,rgba(5,7,8,0.24)_26%,rgba(5,7,8,0.52)_66%,#050708_100%)]" />
        <div className="absolute inset-0 opacity-[0.08] mix-blend-screen [background-image:repeating-linear-gradient(90deg,rgba(255,231,157,0.35)_0px,rgba(255,231,157,0.35)_1px,transparent_1px,transparent_5px)]" />
        <motion.div
          className="absolute inset-x-0 top-[18%] h-px bg-gradient-to-r from-transparent via-[#f5d06e]/40 to-transparent"
          animate={{ opacity: [0.22, 0.56, 0.22], y: [0, 18, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      {/* Hero */}
      <section className="relative min-h-[100svh] overflow-hidden px-4 py-10 md:px-8 md:py-14">
        <div className="mx-auto flex min-h-[calc(100svh-7rem)] w-full max-w-7xl flex-col justify-center gap-8">
          <motion.div
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="bg-gradient-to-b from-[#fff8dc] via-[#f5d06e] to-[#b88926] bg-clip-text font-display text-5xl font-semibold uppercase leading-[0.9] tracking-[0.08em] text-transparent [filter:drop-shadow(0_4px_18px_rgba(0,0,0,0.86))_drop-shadow(0_0_28px_rgba(212,175,55,0.34))] sm:text-7xl lg:text-8xl">
              Gannon Waye
            </h1>
            <p className="mt-4 font-body text-[10px] uppercase tracking-[0.42em] text-[#f5d06e]/80 [text-shadow:0_2px_14px_rgba(0,0,0,0.8),0_0_18px_rgba(212,175,55,0.36)] md:text-xs">
              Singer-songwriter storyteller
            </p>
          </motion.div>

          <div className="grid items-end gap-6 lg:grid-cols-[0.95fr_0.6fr_0.95fr]">
            <motion.div
              initial={{ opacity: 0, x: -28 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.85, delay: 0.12 }}
              className="max-w-xl text-left"
            >
              <p className="font-body text-[10px] uppercase tracking-[0.48em] text-[#d4af37]/76">Next single</p>
              <blockquote className="mt-5 font-display text-3xl italic leading-[1.05] text-[#fff7df] [text-shadow:0_4px_20px_rgba(0,0,0,0.86),0_0_24px_rgba(212,175,55,0.25)] md:text-5xl">
                "Your last breath took mine away. There's not much more I have to say."
              </blockquote>
              <p className="mt-5 max-w-md font-body text-sm leading-7 text-[#fff7df]/68">
                Without You Here is the next chapter: a tribute, a love letter, and the song for the voice I still reach for.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link to="/music">
                  <Button className="gap-2 rounded-full border-0 bg-[linear-gradient(135deg,#caa647,#f8dc82)] px-7 py-5 font-body text-xs uppercase tracking-[0.2em] text-[#071007] shadow-[0_0_34px_rgba(212,175,55,0.24)]">
                    <Play className="w-4 h-4" /> Stream now
                  </Button>
                </Link>
                <Link to="/this-is-my-life">
                  <Button variant="outline" className="gap-2 rounded-full border-[#fff7df]/18 bg-black/12 px-7 py-5 font-body text-xs uppercase tracking-[0.2em] text-[#fff7df] hover:bg-[#fff7df]/6">
                    My story <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
                <Link to="/mum">
                  <Button variant="outline" className="gap-2 rounded-full border-[#d4af37]/28 bg-black/12 px-7 py-5 font-body text-xs uppercase tracking-[0.2em] text-[#f5d06e] hover:bg-[#d4af37]/10">
                    Without You Here <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </motion.div>

            <div className="hidden min-h-[12rem] lg:block" aria-hidden="true" />

            <motion.div
              initial={{ opacity: 0, x: 28, rotateY: 5 }}
              animate={{ opacity: 1, x: 0, rotateY: [3, -2, 3] }}
              transition={{ opacity: { duration: 0.85, delay: 0.2 }, x: { duration: 0.85, delay: 0.2 }, rotateY: { duration: 8, repeat: Infinity, ease: 'easeInOut' } }}
              className="justify-self-end"
              style={{ perspective: 1200 }}
            >
              <div className="w-full max-w-[430px] rounded-lg border border-[#d4af37]/24 bg-[#060806]/58 p-5 shadow-[0_28px_95px_rgba(0,0,0,0.52),0_0_42px_rgba(212,175,55,0.12)] backdrop-blur-md">
                <div className="grid gap-4 sm:grid-cols-[116px_1fr]">
                  <div className="relative aspect-square overflow-hidden rounded-lg border border-[#f5d06e]/34 shadow-[0_0_28px_rgba(212,175,55,0.22)]">
                    <img src={WITHOUT_YOU_HERE_COVER} alt="Without You Here - Gannon Waye cover art" className="h-full w-full object-cover" />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/16">
                      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[linear-gradient(135deg,#caa647,#f8dc82)] text-[#071007] shadow-[0_0_26px_rgba(212,175,55,0.42)]">
                        <Play className="h-5 w-5 fill-current" />
                      </span>
                    </div>
                  </div>
                  <div className="min-w-0">
                    <p className="font-body text-[9px] uppercase tracking-[0.38em] text-[#d4af37]/72">Current focus</p>
                    <h2 className="mt-2 font-display text-3xl italic leading-none text-[#fff7df]">Without You Here</h2>
                    <p className="mt-2 font-body text-[10px] uppercase tracking-[0.24em] text-[#fff7df]/54">Gannon Waye</p>
                    <p className="mt-3 font-body text-xs leading-6 text-[#fff7df]/58">
                      Releasing 31 July 2026. Until Spotify is live, the memorial page carries the private timed preview.
                    </p>
                  </div>
                </div>
                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  <a href="https://open.spotify.com/artist/1tu7INPvRAcRihgaEvBVAz" target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" className="w-full rounded-full border-[#d4af37]/28 bg-black/16 font-body text-[10px] uppercase tracking-[0.22em] text-[#f5d06e] hover:bg-[#d4af37]/10">
                      Spotify profile
                    </Button>
                  </a>
                  <Link to="/music">
                    <Button className="w-full rounded-full border-0 bg-[linear-gradient(135deg,#caa647,#f8dc82)] font-body text-[10px] uppercase tracking-[0.22em] text-[#071007]">
                      Stream Thank You
                    </Button>
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.38 }}
            className="grid gap-4 border-y border-[#d4af37]/10 py-5 md:grid-cols-3"
          >
            {HOME_FEATURE_MOMENTS.map((moment) => (
              <Link key={moment.title} to={moment.title === "Mum's Garden" ? '/mum' : '/music'} className="group block">
                <p className="font-body text-[9px] uppercase tracking-[0.34em] text-[#d4af37]/60">{moment.eyebrow}</p>
                <h3 className="mt-2 font-display text-xl italic text-[#fff7df] transition group-hover:text-[#f5d06e]">{moment.title}</h3>
                <p className="mt-2 font-body text-xs leading-5 text-[#fff7df]/54">{moment.line}</p>
              </Link>
            ))}
          </motion.div>
        </div>
      </section>
      <section className="hidden relative min-h-[100svh] flex items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-b from-background/10 via-background/20 to-background/90 z-10" />
        <div className="relative z-20 text-center px-6 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <img src="https://media.base44.com/images/public/69eb7905ca6eb4180010f794/172f64a6b_0fac46594_generated_image-Edited.png" alt="Gannon Waye" className="max-w-full h-auto" style={{ maxHeight: '120px' }} />
            <p className="font-body text-xs tracking-[0.3em] uppercase gradient-gold-glow mb-8 mt-6">Singer, Songwriter, Storyteller</p>
            <h2 className="font-display text-2xl md:text-3xl text-foreground italic leading-snug mt-2 mb-2">
              "For them, it was about appearance.<br className="hidden sm:block" /> For me, I was breaking inside."
            </h2>
            <p className="font-body text-sm md:text-base text-foreground/60 mt-3 max-w-xl mx-auto leading-relaxed px-2">
              This is more than music. This is choosing yourself.
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
              <p className="font-body text-[10px] tracking-[0.2em] uppercase text-muted-foreground">Artwork & Song Release: Out Now</p>
              <Link to="/music" className="font-display text-base text-primary italic hover:underline">Stream Now →</Link>
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
                <Play className="w-4 h-4" /> Stream Now
              </Button>
            </Link>
            <Link to="/this-is-my-life" className="w-full sm:w-auto">
              <Button variant="outline" className="gap-2 w-full sm:w-auto px-8 py-5 text-sm tracking-wider uppercase font-body rounded-full border-foreground/20 hover:bg-foreground/5">
                My Story <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link to="/back-this" className="w-full sm:w-auto">
              <Button variant="outline" className="gap-2 w-full sm:w-auto px-8 py-5 text-sm tracking-wider uppercase font-body rounded-full border-primary/40 text-primary hover:bg-primary/10">
                Be Part Of This 🤍
              </Button>
            </Link>
          </motion.div>
          

        </div>
      </section>

      {/* Thank You Single — moved up */}
      <ThankYouSingle />

      {/* Thank You Campaign Visual — LIVE, awaiting Gannon approval in /admin/website-evolution */}
      {site.show_thank_you_campaign_section !== false && <ThankYouCampaignSection />}

      {/* Thankyou Song Story — LIVE, awaiting Gannon review */}
      <ThankYouStorySection />

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
                    {release.title === 'Thank You' ? (
                      <img src="https://media.base44.com/images/public/69eb7905ca6eb4180010f794/6dde7d697_2.jpg" alt="Thank You — Gannon Waye single cover" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : release.title === 'Without You Here' ? (
                      <img src={WITHOUT_YOU_HERE_COVER} alt="Without You Here — Gannon Waye single cover" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
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
                    <p className="font-body text-sm text-muted-foreground mt-2 line-clamp-2">{release.title === 'Thank You' ? '"Thank You" was written at a turning point. When staying any longer would have meant abandoning himself all over again. This song is not about the pain. It is about the line being drawn. "Thank You" is what it sounds like when you break a cycle and refuse to return to it.' : release.description}</p>
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
