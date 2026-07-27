import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { Clipboard, Move, RotateCcw, ArrowRight, Pause, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import SocialLinks from '@/components/public/SocialLinks';
import ThankYouSingle from '@/components/public/ThankYouSingle';
import SafeSpaceBanner from '@/components/public/SafeSpaceBanner';
import { WITHOUT_YOU_HERE_COVER, WITHOUT_YOU_HERE_PREVIEW } from '@/constants/musicAssets';

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

const GANNON_WAYE_WIDE_BANNER = 'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/f63708f24_b3199b8b-5027-40bd-9c7e-d244defa613b.png';

const HERO_IMAGES = [
  '/images/home/gannon-waye-home-hero-looking-up.png',
];

const HOME_FEATURE_MOMENTS = [
  {
    eyebrow: 'Next single',
    title: 'Without You Here',
    line: 'Your last breath took mine away. There\'s not much more I have to say.',
    copy: 'A tribute, a love letter, and the next chapter in the story.',
    to: '/current-single',
  },
  {
    eyebrow: 'Out now',
    title: 'Thank You',
    line: 'This is what survival sounds like.',
    copy: 'The debut single is streaming now on all leading platforms.',
    to: '/music',
  },
  {
    eyebrow: 'Coming 31 July',
    title: 'Without You Here',
    line: 'Even while leaving, she was still loving me.',
    copy: 'The release story is open now. The memorial garden stays private until the song is released.',
    to: '/current-single',
  },
];

const UPCOMING_RELEASE_PLATFORMS = ['Spotify', 'Apple Music', 'YouTube Music', 'Amazon Music', 'TIDAL'];

const HERO_LAYOUT_STORAGE_KEY = 'gwm-home-hero-layout-draft-v1';
const HERO_LAYOUT_KEYS = ['brand', 'hook', 'player', 'moments'];

function normaliseOffset(value) {
  return {
    x: Number.isFinite(Number(value?.x)) ? Number(value.x) : 0,
    y: Number.isFinite(Number(value?.y)) ? Number(value.y) : 0,
  };
}

function useHeroLayoutEditor() {
  const [enabled, setEnabled] = useState(false);
  const [offsets, setOffsets] = useState(() => (
    HERO_LAYOUT_KEYS.reduce((next, key) => ({ ...next, [key]: { x: 0, y: 0 } }), {})
  ));

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const shouldEnable = params.get('layout') === 'edit' || params.get('edit') === 'hero';
    setEnabled(shouldEnable);

    const saved = window.localStorage.getItem(HERO_LAYOUT_STORAGE_KEY);
    if (!saved) return;

    try {
      const parsed = JSON.parse(saved);
      setOffsets((current) => (
        HERO_LAYOUT_KEYS.reduce((next, key) => ({
          ...next,
          [key]: normaliseOffset(parsed[key] || current[key]),
        }), {})
      ));
    } catch {
      window.localStorage.removeItem(HERO_LAYOUT_STORAGE_KEY);
    }
  }, []);

  useEffect(() => {
    if (!enabled) return;
    window.localStorage.setItem(HERO_LAYOUT_STORAGE_KEY, JSON.stringify(offsets));
  }, [enabled, offsets]);

  const setOffset = useCallback((key, offset) => {
    setOffsets((current) => ({
      ...current,
      [key]: normaliseOffset(offset),
    }));
  }, []);

  const reset = useCallback(() => {
    const resetOffsets = HERO_LAYOUT_KEYS.reduce((next, key) => ({ ...next, [key]: { x: 0, y: 0 } }), {});
    setOffsets(resetOffsets);
    window.localStorage.removeItem(HERO_LAYOUT_STORAGE_KEY);
  }, []);

  return { enabled, offsets, reset, setOffset };
}

function HeroEditableBlock({ children, className = '', editor, id, label }) {
  const blockRef = useRef(null);
  const dragRef = useRef(null);
  const offset = editor.offsets[id] || { x: 0, y: 0 };

  const handlePointerDown = (event) => {
    if (!editor.enabled) return;
    event.preventDefault();
    event.stopPropagation();
    dragRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      origin: offset,
    };
    blockRef.current?.setPointerCapture?.(event.pointerId);
  };

  const handlePointerMove = (event) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    editor.setOffset(id, {
      x: Math.round(drag.origin.x + event.clientX - drag.startX),
      y: Math.round(drag.origin.y + event.clientY - drag.startY),
    });
  };

  const stopDrag = (event) => {
    if (dragRef.current?.pointerId === event.pointerId) {
      dragRef.current = null;
      blockRef.current?.releasePointerCapture?.(event.pointerId);
    }
  };

  return (
    <div
      ref={blockRef}
      onPointerMove={handlePointerMove}
      onPointerUp={stopDrag}
      onPointerCancel={stopDrag}
      className={`relative ${editor.enabled ? 'rounded-lg ring-1 ring-[#b88a34]/36 ring-offset-4 ring-offset-transparent' : ''} ${className}`}
      style={editor.enabled ? { transform: `translate3d(${offset.x}px, ${offset.y}px, 0)` } : undefined}
    >
      {editor.enabled && (
        <button
          type="button"
          onPointerDown={handlePointerDown}
          className="absolute -top-8 left-0 z-[90] flex cursor-grab items-center gap-1 rounded-full border border-[#b88a34]/40 bg-[#050708]/88 px-3 py-1 font-body text-[10px] uppercase tracking-[0.16em] text-[#d6b56a] shadow-[0_10px_28px_rgba(0,0,0,0.38)] active:cursor-grabbing"
        >
          <Move className="h-3 w-3" /> {label}
        </button>
      )}
      {children}
    </div>
  );
}

function HeroLayoutEditorPanel({ editor }) {
  const [copied, setCopied] = useState(false);

  const copyLayout = async () => {
    await navigator.clipboard.writeText(JSON.stringify(editor.offsets, null, 2));
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1400);
  };

  if (!editor.enabled) return null;

  return (
    <div className="fixed bottom-4 right-4 z-[120] w-[min(21rem,calc(100vw-2rem))] rounded-lg border border-[#d4af37]/24 bg-[#050708]/92 p-4 shadow-[0_20px_70px_rgba(0,0,0,0.5)] backdrop-blur-xl">
      <p className="font-body text-[10px] uppercase tracking-[0.28em] text-[#d6b56a]">Hero layout edit mode</p>
      <p className="mt-2 font-body text-xs leading-5 text-[#fff7df]/62">
        Drag the gold handles. Every move saves automatically in this browser. When it feels right, tell Codex "layout done".
      </p>
      <div className="mt-3 flex gap-2">
        <button
          type="button"
          onClick={copyLayout}
          className="inline-flex items-center gap-2 rounded-full border border-[#b88a34]/38 px-3 py-2 font-body text-[10px] uppercase tracking-[0.16em] text-[#d6b56a]"
        >
          <Clipboard className="h-3.5 w-3.5" /> {copied ? 'Copied' : 'Copy'}
        </button>
        <button
          type="button"
          onClick={editor.reset}
          className="inline-flex items-center gap-2 rounded-full border border-[#fff7df]/16 px-3 py-2 font-body text-[10px] uppercase tracking-[0.16em] text-[#fff7df]/76"
        >
          <RotateCcw className="h-3.5 w-3.5" /> Reset
        </button>
      </div>
    </div>
  );
}

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
  const [wyhPlaying, setWyhPlaying] = useState(false);
  const wyhAudioRef = useRef(null);
  const heroLayoutEditor = useHeroLayoutEditor();

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

  useEffect(() => {
    const audio = wyhAudioRef.current;
    if (!audio) return undefined;

    const handleEnded = () => {
      audio.currentTime = 0;
      setWyhPlaying(false);
    };
    const handlePause = () => setWyhPlaying(false);
    const handlePlay = () => setWyhPlaying(true);

    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('play', handlePlay);

    return () => {
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('play', handlePlay);
    };
  }, []);

  const playWithoutYouHerePreview = useCallback(async () => {
    const audio = wyhAudioRef.current;
    if (!audio) return;

    if (audio.currentTime >= (audio.duration || 49) - 0.25) {
      audio.currentTime = 0;
    }

    try {
      audio.muted = false;
      await audio.play();
    } catch (error) {
      console.warn('Without You Here preview could not play.', error);
      setWyhPlaying(false);
    }
  }, []);

  const toggleWithoutYouHerePreview = useCallback(async () => {
    const audio = wyhAudioRef.current;
    if (!audio) return;

    if (!audio.paused) {
      audio.pause();
      return;
    }

    await playWithoutYouHerePreview();
  }, [playWithoutYouHerePreview]);

  return (
    <div className="min-h-screen relative">
      {showCelebration && <CinematicCelebration />}
      <TikTokWelcomeBanner />
      <HeroLayoutEditorPanel editor={heroLayoutEditor} />

      {/* Fixed background — visible behind ALL sections */}
      <div className="fixed inset-0 -z-10">
        <AnimatePresence>
          <motion.img
            key={currentImg}
            src={HERO_IMAGES[currentImg]}
            alt="Gannon Waye"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.9, scale: [1.01, 1.035, 1.01] }}
            exit={{ opacity: 0 }}
            transition={{ opacity: { duration: 1.5 }, scale: { duration: 18, repeat: Infinity, ease: 'easeInOut' } }}
            className="absolute inset-0 h-full w-full object-cover object-[64%_center] [filter:brightness(1.08)_contrast(1.03)]"
          />
        </AnimatePresence>
        <div className="absolute inset-0 bg-[linear-gradient(90deg,#090c0e_0%,rgba(9,12,14,0.64)_25%,rgba(9,12,14,0.18)_52%,rgba(9,12,14,0.08)_72%,rgba(9,12,14,0.32)_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(9,12,14,0.28)_0%,rgba(9,12,14,0.04)_34%,rgba(9,12,14,0.18)_72%,#090c0e_100%)]" />
      </div>

      {/* Hero */}
      <section className="relative min-h-[calc(100svh-4rem)] overflow-hidden px-4 md:px-6">
        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
          <img
            src="/images/music/without-you-here-cover.png"
            alt=""
            className="absolute -left-[12%] bottom-[-28%] w-[72%] max-w-[880px] opacity-[0.12] mix-blend-screen [mask-image:linear-gradient(115deg,black_0%,rgba(0,0,0,0.82)_36%,transparent_76%)]"
          />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_28%_58%,rgba(66,104,132,0.12),transparent_34%),radial-gradient(circle_at_42%_72%,rgba(183,144,61,0.13),transparent_30%)]" />
        </div>
        <div className="relative mx-auto flex min-h-[calc(100svh-4rem)] w-full max-w-[1240px] flex-col justify-between gap-4 py-5 md:py-7">
          <motion.div
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <HeroEditableBlock editor={heroLayoutEditor} id="brand" label="Brand" className="text-center">
              <h1 className="sr-only">Gannon Waye</h1>
              <img
                src="/images/brand/gannon-waye-wordmark-base44.png"
                alt="Gannon Waye"
                className="mx-auto h-auto w-full max-w-[680px] drop-shadow-[0_14px_34px_rgba(0,0,0,0.9)] md:max-w-[880px]"
              />
              <p className="mt-3 font-body text-[10px] font-semibold uppercase tracking-[0.3em] text-[#d0b06c] [text-shadow:0_2px_12px_rgba(0,0,0,0.9)] md:text-xs">
                Singer-songwriter storyteller
              </p>
            </HeroEditableBlock>
          </motion.div>

          <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1.08fr)_minmax(390px,0.82fr)] lg:gap-14">
            <motion.div
              initial={{ opacity: 0, x: -28 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.85, delay: 0.12 }}
              className="max-w-[39rem] text-left"
            >
              <HeroEditableBlock editor={heroLayoutEditor} id="hook" label="Hook" className="relative">
                <p className="font-body text-[10px] font-semibold uppercase tracking-[0.3em] text-[#c5a868] [text-shadow:0_2px_12px_rgba(0,0,0,0.9)]">Next single</p>
                <h2 className="mt-2 font-display text-[clamp(2rem,3.4vw,3.6rem)] font-bold italic leading-[0.9] text-[#f2d493] [text-shadow:0_0_8px_rgba(255,241,199,0.72),0_0_22px_rgba(190,137,44,0.66),0_4px_24px_rgba(0,0,0,0.96)]">
                  Without You Here
                </h2>
                <blockquote
                  aria-label="Your last breath took mine away. There's not much more I have to say."
                  className="mt-5 max-w-[35rem] overflow-visible font-display text-[clamp(1.25rem,2.25vw,2.05rem)] italic leading-[1.08] [text-shadow:0_4px_22px_rgba(0,0,0,0.96)]"
                >
                  <span className="block whitespace-nowrap text-[#f4f0e8]">&ldquo;Your last breath</span>
                  <span className="ml-[12%] block whitespace-nowrap text-[#f4f0e8]">
                    Took <span className="gradient-gold-glow">mine</span>
                  </span>
                  <span className="ml-[12%] block whitespace-nowrap">
                    <span className="gradient-gold-glow">away.</span>{' '}
                    <span className="text-[#f4f0e8]">There&apos;s not</span>
                  </span>
                  <span className="ml-[28%] block whitespace-nowrap text-[#d7d0c5]">much more I have</span>
                  <span className="ml-[28%] block whitespace-nowrap gradient-gold-glow">to say.&rdquo;</span>
                </blockquote>
              </HeroEditableBlock>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 28, rotateY: 5 }}
              animate={{ opacity: 1, x: 0, rotateY: [3, -2, 3] }}
              transition={{ opacity: { duration: 0.85, delay: 0.2 }, x: { duration: 0.85, delay: 0.2 }, rotateY: { duration: 8, repeat: Infinity, ease: 'easeInOut' } }}
              style={{ perspective: 1200 }}
              className="w-full justify-self-end"
            >
              <HeroEditableBlock editor={heroLayoutEditor} id="player" label="Player">
                <div className="w-full max-w-[500px] rounded-lg border border-[#c9aa63]/30 bg-[#0b0d0b]/64 p-5 shadow-[0_24px_70px_rgba(0,0,0,0.5)] backdrop-blur-md">
                  <audio
                    ref={wyhAudioRef}
                    src={WITHOUT_YOU_HERE_PREVIEW}
                    preload="metadata"
                    data-song-title="Without You Here"
                    data-song-artist="Gannon Waye"
                    data-song-feedback-source="home-current-focus-audio"
                    data-song-feedback-exempt="true"
                  />
                  <div className="grid items-center gap-5 sm:grid-cols-[148px_1fr]">
                    <button
                      type="button"
                      onClick={toggleWithoutYouHerePreview}
                      data-song-title="Without You Here"
                      data-song-artist="Gannon Waye"
                      data-song-feedback-source="home-current-focus-cover"
                      data-song-feedback-exempt="true"
                      aria-label={wyhPlaying ? 'Pause Without You Here preview' : 'Play Without You Here preview'}
                      className="group relative aspect-square overflow-hidden rounded border border-[#b7903d]/38 shadow-[0_14px_32px_rgba(0,0,0,0.42)]"
                    >
                      <img src={WITHOUT_YOU_HERE_COVER} alt="Without You Here - Gannon Waye cover art" className="h-full w-full object-cover" />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/18 transition group-hover:bg-black/4">
                        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[linear-gradient(135deg,#8d671d,#b7903d,#c9aa63)] text-[#071007] shadow-[0_0_24px_rgba(183,144,61,0.38)]">
                          {wyhPlaying ? <Pause className="h-6 w-6 fill-current" /> : <Play className="h-6 w-6 fill-current" />}
                        </span>
                      </div>
                    </button>
                    <div className="min-w-0">
                      <p className="font-body text-[9px] font-semibold uppercase tracking-[0.27em] text-[#c9aa63]">Current focus</p>
                      <h2 className="mt-2 font-display text-[1.75rem] font-bold italic leading-none text-[#f2d493] [text-shadow:0_0_14px_rgba(183,144,61,0.48)]">Without You Here</h2>
                      <p className="mt-2 font-body text-[9px] font-semibold uppercase tracking-[0.24em] text-[#f4f0e8]/82">Gannon Waye</p>
                      <p className="mt-3 font-body text-[10px] font-semibold uppercase tracking-[0.2em] text-[#f4f0e8]/88">Releasing 31 July 2026</p>
                      <p className="mt-3 font-body text-[12px] leading-5 text-[#a8a9ad]">
                        Preview plays 3:46 to 4:35. Spotify stream unlocks on release day.
                      </p>
                    </div>
                  </div>
                  <div className="mt-5 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 border-t border-[#c9aa63]/18 pt-4" aria-label="Release platforms coming soon">
                    {UPCOMING_RELEASE_PLATFORMS.map((platform) => (
                      <span key={platform} className="font-body text-[8px] font-semibold uppercase tracking-[0.12em] text-[#f4f0e8]/52">
                        {platform}
                      </span>
                    ))}
                  </div>
                </div>
              </HeroEditableBlock>
            </motion.div>
          </div>

          <div className="text-center">
            <p className="mx-auto max-w-[1100px] font-body text-sm font-medium leading-6 text-[#f4f0e8]/86 md:whitespace-nowrap md:text-[15px]">
              Without You Here is the next chapter: a tribute, a love letter, and the song for the voice I still reach for.
            </p>
            <div className="mt-4 flex flex-wrap justify-center gap-3">
              <button type="button" onClick={toggleWithoutYouHerePreview} className="inline-flex h-10 items-center gap-2 rounded-full bg-[linear-gradient(100deg,#8d671d_0%,#b7903d_48%,#c9aa63_100%)] px-7 font-body text-xs font-semibold uppercase text-[#090c0e] shadow-[0_8px_24px_rgba(0,0,0,0.32)] transition hover:brightness-110">
                {wyhPlaying ? <Pause className="h-3.5 w-3.5 fill-current" /> : <Play className="h-3.5 w-3.5 fill-current" />}
                {wyhPlaying ? 'Pause preview' : 'Play preview'}
              </button>
              <Link to="/this-is-my-life" className="inline-flex h-10 items-center gap-3 rounded-full border border-white/12 bg-black/20 px-7 font-body text-xs font-semibold uppercase text-[#f4f0e8]/86 transition hover:border-[#b7903d]/55 hover:text-white">
                My story <ArrowRight className="h-3.5 w-3.5" />
              </Link>
              <Link to="/current-single" className="inline-flex h-10 items-center gap-3 rounded-full border border-white/12 bg-black/20 px-7 font-body text-xs font-semibold uppercase text-[#f4f0e8]/82 transition hover:border-[#b7903d]/55 hover:text-white">
                Without You Here <ArrowRight className="h-3.5 w-3.5" />
              </Link>
              <a href="https://open.spotify.com/artist/1tu7INPvRAcRihgaEvBVAz" target="_blank" rel="noopener noreferrer" className="inline-flex h-10 items-center gap-2 rounded-full border border-[#9f792d]/48 bg-black/20 px-7 font-body text-xs font-semibold uppercase text-[#f4f0e8]/86 transition hover:bg-[#9f792d]/10">
                <Play className="h-3.5 w-3.5" /> Spotify profile
              </a>
            </div>
          </div>

          <HeroEditableBlock editor={heroLayoutEditor} id="moments" label="Moments">
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.75, delay: 0.38 }}
               className="mx-auto grid w-full max-w-[1120px] gap-4 border-y border-[#9f792d]/20 bg-[#090c0e]/62 py-3 backdrop-blur-sm md:grid-cols-[0.72fr_1fr_1fr_1fr]"
            >
              <div className="text-left md:pr-4">
                 <p className="font-body text-[8px] font-semibold uppercase tracking-[0.26em] text-[#c9aa63]">Worth seeing now</p>
                 <h3 className="mt-2 font-display text-2xl italic leading-tight text-[#f4f0e8]">
                  New music. Real story. No filler.
                </h3>
              </div>
              {HOME_FEATURE_MOMENTS.map((moment) => (
                 <Link key={moment.title} to={moment.to} className="group block border-l border-[#9f792d]/24 pl-4 text-left transition hover:border-[#c9aa63]/70">
                   <p className="font-body text-[8px] font-semibold uppercase tracking-[0.22em] text-[#8f9198] transition group-hover:text-[#c9aa63]">{moment.eyebrow}</p>
                   <h4 className="mt-2 font-display text-lg italic text-[#f4f0e8] transition group-hover:text-white">{moment.title}</h4>
                   <p className="mt-1 font-display text-xs italic leading-5 text-[#c1a566]">"{moment.line}"</p>
                   <p className="mt-2 font-body text-[11px] leading-4 text-[#a3a5aa]">{moment.copy}</p>
                </Link>
              ))}
            </motion.div>
          </HeroEditableBlock>
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

      {/* About Section — magazine 3-column */}
      <section className="px-4 pb-16 pt-10 md:px-6 md:pb-24 md:pt-12 relative">
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


      {/* Full-width Gannon Waye visual bridge */}
      <Link
        to="/music"
        aria-label="Open Gannon Waye music"
        className="group relative block w-full overflow-hidden border-y border-[#b88a34]/24 bg-black"
      >
        <img
          src={GANNON_WAYE_WIDE_BANNER}
          alt="Gannon Waye"
          className="h-auto min-h-[220px] w-full object-cover object-center transition duration-700 group-hover:scale-[1.012]"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/32" />
      </Link>


      {/* Thank You Campaign Visual — LIVE, awaiting Gannon approval in /admin/website-evolution */}
      {site.show_thank_you_campaign_section !== false && <ThankYouCampaignSection />}

      {/* Thankyou Song Story — LIVE, awaiting Gannon review */}
      <ThankYouStorySection />

      {/* Thank You Single - kept lower so the hero and story lead first */}
      <ThankYouSingle />


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
