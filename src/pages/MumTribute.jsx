import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Lock, Eye, EyeOff, Sparkles } from 'lucide-react';
import { useAuth } from '@/lib/AuthContext';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);
import ImmersiveHero from '@/components/mum/ImmersiveHero';
import MumStorySection from '@/components/mum/MumStorySection';
import MemoryWall3D from '@/components/mum/MemoryWall3D';
import MumSongSection from '@/components/mum/MumSongSection';
import WisdomGarden from '@/components/mum/WisdomGarden';
import MumLetterSection from '@/components/mum/MumLetterSection';
import GardenAtmosphere from '@/components/mum/GardenAtmosphere';
import FloatingSonia from '@/components/mum/FloatingSonia';

function GoldDivider() {
  return (
    <div className="flex items-center gap-4 my-2 px-4 max-w-xl mx-auto">
      <div className="flex-1 h-px bg-gradient-to-r from-transparent to-primary/15" />
      <Heart className="w-3 h-3 text-primary/25" />
      <div className="flex-1 h-px bg-gradient-to-l from-transparent to-primary/15" />
    </div>
  );
}

export default function MumTribute() {
  const [passcode, setPasscode] = useState('');
  const [error, setError] = useState('');
  const [showPasscode, setShowPasscode] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(() => {
    return localStorage.getItem('sonia_garden_authorized') === 'true';
  });

  const { user } = useAuth();

  // If Gannon is logged in as admin, automatically unlock the page
  useEffect(() => {
    if (user?.role === 'admin') {
      setIsAuthorized(true);
    }
  }, [user]);

  useEffect(() => {
    if (!isAuthorized) return;

    // Cinematic section reveals — fade + lift every section heading and card
    const ctx = gsap.context(() => {
      gsap.utils.toArray('.gsap-reveal').forEach((el) => {
        gsap.fromTo(el,
          { opacity: 0, y: 50 },
          {
            opacity: 1, y: 0,
            duration: 1.2,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 90%',
              toggleActions: 'play none none none',
            },
          }
        );
      });

      // Parallax on section background glows
      gsap.utils.toArray('.gsap-parallax').forEach((el) => {
        gsap.fromTo(el,
          { y: -30 },
          {
            y: 30,
            ease: 'none',
            scrollTrigger: {
              trigger: el,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 2,
            },
          }
        );
      });
    });

    return () => ctx.revert();
  }, [isAuthorized]);

  const handleUnlockSubmit = (e) => {
    e.preventDefault();
    if (passcode.trim().toLowerCase() === 'soniagarden2026') {
      localStorage.setItem('sonia_garden_authorized', 'true');
      setIsAuthorized(true);
      setError('');
    } else {
      setError('Oh darling, that is not the right key. Try again.');
      setPasscode('');
    }
  };

  return (
    <div className="min-h-screen relative overflow-x-hidden">
      {/* ── Site-wide cinematic background ── */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0" style={{
          background: 'linear-gradient(145deg, #0a0407 0%, #160810 30%, #0c1008 60%, #080b07 100%)'
        }} />
        {/* Breathing warm top glow */}
        <motion.div
          className="absolute top-0 left-0 right-0 h-80 opacity-[0.05]"
          animate={{ opacity: [0.03, 0.07, 0.03] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
          style={{ background: 'radial-gradient(ellipse at 50% 0%, #b86020 0%, transparent 70%)' }}
        />
        {/* Burgundy ambient */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          background: 'radial-gradient(ellipse at 20% 60%, #6e1525 0%, transparent 55%)'
        }} />
      </div>

      <AnimatePresence mode="wait">
        {!isAuthorized ? (
          /* ── COMMEMORATIVE UNDER CONSTRUCTION GATE ── */
          <motion.div
            key="lock-gate"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -40 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-50 min-h-screen flex flex-col items-center justify-center px-6 py-20 text-center"
          >
            {/* Blurry, dreamlike artwork background layer */}
            <div 
              className="absolute inset-0 pointer-events-none opacity-[0.12] z-0"
              style={{
                backgroundImage: 'url(/images/mum/sonia_garden_tribute.jpg)',
                backgroundPosition: 'center',
                backgroundSize: 'cover',
                filter: 'blur(35px) saturate(1.2)',
              }}
            />

            <div className="relative z-10 max-w-xl mx-auto flex flex-col items-center gap-8">
              {/* Premium Rose & Gold Shield Icon */}
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, duration: 1 }}
                className="relative w-20 h-20 flex items-center justify-center rounded-full border border-primary/30"
                style={{
                  background: 'radial-gradient(circle, rgba(110,21,37,0.15) 0%, transparent 80%)',
                  boxShadow: '0 0 30px rgba(212,175,55,0.08)',
                }}
              >
                <Lock className="w-6 h-6 text-primary/70 animate-pulse" />
                <motion.div
                  className="absolute inset-0 rounded-full border border-dashed border-primary/10"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
                />
              </motion.div>

              {/* Title & Memorial Headers */}
              <div className="space-y-3">
                <p className="font-body text-[10px] tracking-[0.6em] uppercase text-primary/45">
                  A Living Memory
                </p>
                <h1 className="font-display text-4xl md:text-5xl text-foreground">
                  Sonia Katisa Waye
                </h1>
                <p className="font-body text-xs text-primary/40 tracking-[0.4em]">
                  1961 – 2022
                </p>
              </div>

              {/* Gold Divider */}
              <div className="w-16 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

              {/* The Loving Quote */}
              <blockquote className="border-l border-primary/20 pl-6 py-1 max-w-md text-left">
                <p className="font-display text-lg md:text-xl italic text-foreground/80 leading-relaxed">
                  "Your last breath took mine away,<br />
                  there's not much more I have to say."
                </p>
                <p className="font-body text-[9px] text-muted-foreground/45 mt-2 tracking-widest uppercase">
                  Without You Here · Mother's Day 2026
                </p>
              </blockquote>

              {/* Status Note */}
              <div className="space-y-2 max-w-sm">
                <h2 className="font-display text-sm italic text-foreground/75 flex items-center justify-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-primary/60" />
                  Sonia's Garden of Wisdom
                </h2>
                <p className="font-body text-[11px] text-muted-foreground/50 leading-relaxed">
                  This memorial space is currently being tended. Enter the passcode below to step inside and visit her garden.
                </p>
              </div>

              {/* Passcode Entry Form */}
              <form onSubmit={handleUnlockSubmit} className="w-full max-w-xs space-y-4">
                <div className="relative">
                  <input
                    type={showPasscode ? 'text' : 'password'}
                    value={passcode}
                    onChange={(e) => {
                      setPasscode(e.target.value);
                      setError('');
                    }}
                    placeholder="Enter garden passcode..."
                    className="w-full rounded-full bg-black/60 border border-primary/25 px-5 py-3 pr-12 text-xs text-center text-foreground placeholder-muted-foreground/35 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all duration-300"
                    style={{
                      boxShadow: '0 4px 15px rgba(0,0,0,0.4)',
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasscode(!showPasscode)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground/40 hover:text-muted-foreground transition-colors"
                  >
                    {showPasscode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {error && (
                  <motion.p
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-[10px] text-red-400 italic font-body"
                  >
                    {error}
                  </motion.p>
                )}

                <button
                  type="submit"
                  disabled={!passcode.trim()}
                  className="w-full gradient-gold-button rounded-full py-3 text-[10px] font-bold uppercase tracking-wider border-0 disabled:opacity-50 disabled:pointer-events-none transition-all duration-300"
                >
                  Step Inside
                </button>
              </form>

              {/* Subtle footer credit */}
              <p className="font-body text-[9px] text-muted-foreground/20 mt-6 tracking-widest uppercase">
                Gannon Waye · Memorial Gate
              </p>
            </div>
          </motion.div>
        ) : (
          /* ── THE FULL REDESIGNED TRIBUTE PAGE ── */
          <motion.div
            key="tribute-content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="relative z-10 pt-20 pb-32"
          >
            {/* Float bubble for quick wisdom access */}
            <FloatingSonia />

            <ImmersiveHero />
            <GoldDivider />
            <MumStorySection />
            <GoldDivider />
            <MemoryWall3D />
            <GoldDivider />
            <MumSongSection />
            <GoldDivider />
            <GardenAtmosphere>
              <WisdomGarden />
            </GardenAtmosphere>
            <GoldDivider />
            <MumLetterSection />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}