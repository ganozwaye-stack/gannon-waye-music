import React from 'react';
import MumHero from '@/components/mum/MumHero';
import MumStorySection from '@/components/mum/MumStorySection';
import MumMemoryGallery from '@/components/mum/MumMemoryGallery';
import MumMemoryObjects from '@/components/mum/MumMemoryObjects';
import MumSongSection from '@/components/mum/MumSongSection';
import MumLetterSection from '@/components/mum/MumLetterSection';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';

function GoldDivider() {
  return (
    <div className="flex items-center gap-4 my-4 px-4 max-w-xl mx-auto">
      <div className="flex-1 h-px bg-gradient-to-r from-transparent to-primary/20" />
      <Heart className="w-3 h-3 text-primary/30" />
      <div className="flex-1 h-px bg-gradient-to-l from-transparent to-primary/20" />
    </div>
  );
}

export default function MumTribute() {
  return (
    <div className="min-h-screen relative">

      {/* Cinematic site-wide background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0" style={{
          background: 'linear-gradient(145deg, #0d0608 0%, #180a0d 35%, #0d1008 65%, #080d09 100%)'
        }} />
        {/* Subtle warm glow top */}
        <motion.div
          className="absolute top-0 left-0 right-0 h-72 opacity-[0.06]"
          animate={{ opacity: [0.04, 0.09, 0.04] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
          style={{ background: 'radial-gradient(ellipse at 50% 0%, #c9783a 0%, transparent 70%)' }}
        />
        {/* Subtle burgundy ambient */}
        <div className="absolute inset-0 opacity-[0.04]" style={{
          background: 'radial-gradient(ellipse at 30% 50%, #7a1a28 0%, transparent 60%)'
        }} />
      </div>

      {/* Page content — pt-20 accounts for fixed nav height */}
      <div className="relative z-10 pt-20 pb-32">
        <MumHero />
        <GoldDivider />
        <MumStorySection />
        <GoldDivider />
        <MumMemoryGallery />
        <GoldDivider />
        <MumMemoryObjects />
        <GoldDivider />
        <MumSongSection />
        <GoldDivider />
        <MumLetterSection />
      </div>
    </div>
  );
}