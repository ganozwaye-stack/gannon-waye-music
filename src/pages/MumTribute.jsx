import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
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
  useEffect(() => {
    // Cinematic section reveals — fade + lift every section heading and card
    const ctx = gsap.context(() => {
      gsap.utils.toArray('.gsap-reveal').forEach((el, i) => {
        gsap.fromTo(el,
          { opacity: 0, y: 50 },
          {
            opacity: 1, y: 0,
            duration: 1,
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
  }, []);

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

      {/* ── Page content ── pt-20 clears fixed nav ── */}
      <div className="relative z-10 pt-20 pb-32">
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
      </div>
    </div>
  );
}