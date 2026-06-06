import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Heart } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

// New immersive components
import GardenImmersionBackground from '@/components/mum/GardenImmersionBackground';
import MumMemorialNav            from '@/components/mum/MumMemorialNav';
import ImmersiveGardenHero       from '@/components/mum/ImmersiveGardenHero';
import GardenSectionDivider      from '@/components/mum/GardenSectionDivider';
import ThankYouPlayer            from '@/components/mum/ThankYouPlayer';

// Existing content sections
import MumStorySection  from '@/components/mum/MumStorySection';
import MemoryWall3D     from '@/components/mum/MemoryWall3D';
import MumSongSection   from '@/components/mum/MumSongSection';
import WisdomGarden     from '@/components/mum/WisdomGarden';
import MumLetterSection from '@/components/mum/MumLetterSection';
import GardenAtmosphere from '@/components/mum/GardenAtmosphere';

// Approval images — ready to be assigned to sections
const GANNON_AND_SONIA = 'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/fd71e9213_QEHH7866.JPG';
const LUXURY_BG        = 'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/0b65e1e62_luxury_bg.jpg';

// ────────────────────────────────────────────────────────────────────────────
//  LIGHT A CANDLE section
// ────────────────────────────────────────────────────────────────────────────
function LightACandle() {
  const [lit, setLit] = React.useState(false);

  return (
    <section
      id="light-a-candle"
      className="relative py-24 px-6 max-w-2xl mx-auto text-center gsap-reveal"
    >
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
      >
        <p className="font-body text-[9px] tracking-[0.6em] uppercase text-primary/40 mb-4">
          Light a Candle
        </p>
        <h2 className="font-display text-3xl md:text-5xl text-foreground mb-6">
          In Her Honour
        </h2>

        {/* Candle */}
        <div className="flex justify-center mb-8">
          <button
            onClick={() => setLit(true)}
            aria-label="Light a candle for Sonia"
            className="group relative w-20 transition-transform duration-300 hover:scale-110 active:scale-95"
          >
            {/* Flame */}
            {lit && (
              <motion.div
                className="absolute -top-8 left-1/2 -translate-x-1/2"
                initial={{ opacity: 0, scaleY: 0 }}
                animate={{ opacity: 1, scaleY: 1 }}
                transition={{ duration: 0.6, ease: 'backOut' }}
              >
                <motion.div
                  className="w-5 h-8 rounded-full"
                  animate={{ scaleX: [1, 1.2, 0.9, 1.1, 1], scaleY: [1, 0.9, 1.1, 0.95, 1] }}
                  transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
                  style={{
                    background:  'radial-gradient(ellipse at 50% 80%, #fff 0%, #f5c842 35%, #e07c10 70%, transparent 100%)',
                    boxShadow:   '0 0 18px 6px rgba(245,200,66,0.55), 0 0 40px 10px rgba(220,140,20,0.25)',
                  }}
                />
              </motion.div>
            )}

            {/* Candle body */}
            <div
              className="w-full rounded-sm relative overflow-hidden"
              style={{
                height:     '80px',
                background: lit
                  ? 'linear-gradient(135deg, #f5ead0 0%, #ede0b6 60%, #d4b87a 100%)'
                  : 'linear-gradient(135deg, #d0c8b0 0%, #bbb090 100%)',
                border:     `1px solid ${lit ? 'rgba(212,175,55,0.60)' : 'rgba(180,160,120,0.30)'}`,
                boxShadow:  lit ? '0 0 30px rgba(245,200,66,0.25)' : 'none',
                transition: 'all 0.8s ease',
              }}
            >
              {/* Drips */}
              <div className="absolute top-0 left-1/3 w-1 h-3 rounded-b-full"
                style={{ background: 'rgba(255,255,255,0.4)' }} />
            </div>

            {/* Wick */}
            <div className="w-px h-3 bg-foreground/30 mx-auto" />
          </button>
        </div>

        {lit ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <p className="font-display text-xl italic text-primary/80 mb-2">
              "A light for Sonia — may she feel our love."
            </p>
            <p className="font-body text-sm text-muted-foreground/45">
              Your candle is lit. She is with us.
            </p>
          </motion.div>
        ) : (
          <div>
            <p className="font-body text-sm text-foreground/45 mb-2 max-w-sm mx-auto">
              Click the candle to light it in memory of Sonia Katisa Waye.
            </p>
            <p className="font-body text-xs text-muted-foreground/30 italic">
              A small act of love that carries enormous weight.
            </p>
          </div>
        )}
      </motion.div>
    </section>
  );
}

// ────────────────────────────────────────────────────────────────────────────
//  GALLERY section — images pending approval / allocation
// ────────────────────────────────────────────────────────────────────────────
function Gallery() {
  return (
    <section id="gallery" className="relative py-20 px-6 max-w-5xl mx-auto gsap-reveal">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
        className="text-center mb-10"
      >
        <p className="font-body text-[9px] tracking-[0.6em] uppercase text-primary/40 mb-3">Gallery</p>
        <h2 className="font-display text-3xl md:text-5xl text-foreground mb-4">Moments We'll Cherish Forever</h2>
        <p className="font-body text-sm text-muted-foreground/45 max-w-md mx-auto">
          These images are awaiting your approval and allocation to the correct section.<br />
          Each one will be placed under your chosen heading.
        </p>
      </motion.div>

      {/* ── APPROVAL QUEUE ── Each image brought for assignment ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Image A — Gannon & Sonia together */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative overflow-hidden rounded-2xl group"
          style={{ border: '1px solid rgba(212,175,55,0.18)', aspectRatio: '4/3' }}
        >
          <img
            src={GANNON_AND_SONIA}
            alt="Gannon and Sonia together"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            style={{ filter: 'brightness(0.85)' }}
          />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(3,6,3,0.80) 0%, transparent 55%)' }} />
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <span className="font-body text-[8px] tracking-widest uppercase px-2.5 py-1 rounded-full" style={{ background: 'rgba(212,175,55,0.18)', color: 'rgba(212,175,55,0.8)', border: '1px solid rgba(212,175,55,0.25)' }}>
              ★ Awaiting your approval — which section does this belong under?
            </span>
            <p className="font-display text-lg text-foreground/80 mt-2">Gannon &amp; Sonia</p>
            <p className="font-body text-xs text-muted-foreground/50">Her Story · Gallery · Our Love · Legacy</p>
          </div>
        </motion.div>

        {/* Image B — Sonia sitting alone (portrait) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.15 }}
          className="relative overflow-hidden rounded-2xl group"
          style={{ border: '1px solid rgba(212,175,55,0.18)', aspectRatio: '4/3' }}
        >
          <img
            src="https://media.base44.com/images/public/69eb7905ca6eb4180010f794/042dbd116_reel1_s2_keyframe.jpg"
            alt="Sonia in her garden — peaceful"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            style={{ filter: 'brightness(0.85)' }}
          />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(3,6,3,0.80) 0%, transparent 55%)' }} />
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <span className="font-body text-[8px] tracking-widest uppercase px-2.5 py-1 rounded-full" style={{ background: 'rgba(212,175,55,0.18)', color: 'rgba(212,175,55,0.8)', border: '1px solid rgba(212,175,55,0.25)' }}>
              ★ Awaiting your approval — which section does this belong under?
            </span>
            <p className="font-display text-lg text-foreground/80 mt-2">Sonia in Her Garden</p>
            <p className="font-body text-xs text-muted-foreground/50">Her Story · Gallery · Her World</p>
          </div>
        </motion.div>

        {/* Image C — Sonia with dogs, full tribute artwork */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="relative overflow-hidden rounded-2xl group"
          style={{ border: '1px solid rgba(212,175,55,0.18)', aspectRatio: '4/3' }}
        >
          <img
            src="https://media.base44.com/images/public/69eb7905ca6eb4180010f794/215477423_0fdbdb2a-c851-496c-a6d1-e777ae1bfc6a.jpg"
            alt="Sonia Katisa Waye with her dogs"
            className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700"
            style={{ filter: 'brightness(0.85)' }}
          />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(3,6,3,0.80) 0%, transparent 55%)' }} />
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <span className="font-body text-[8px] tracking-widest uppercase px-2.5 py-1 rounded-full" style={{ background: 'rgba(212,175,55,0.18)', color: 'rgba(212,175,55,0.8)', border: '1px solid rgba(212,175,55,0.25)' }}>
              ★ Awaiting your approval — which section does this belong under?
            </span>
            <p className="font-display text-lg text-foreground/80 mt-2">Sonia with Her Dogs</p>
            <p className="font-body text-xs text-muted-foreground/50">Her World · Gallery · Her Story</p>
          </div>
        </motion.div>

        {/* Image D — Sonia holding the Thank You mug (keyframe 2) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.45 }}
          className="relative overflow-hidden rounded-2xl group"
          style={{ border: '1px solid rgba(212,175,55,0.18)', aspectRatio: '4/3' }}
        >
          <img
            src="https://media.base44.com/images/public/69eb7905ca6eb4180010f794/da5efd6c2_reel1_s2_keyframe1.jpg"
            alt="Sonia holding the Thank You mug"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            style={{ filter: 'brightness(0.85)' }}
          />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(3,6,3,0.80) 0%, transparent 55%)' }} />
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <span className="font-body text-[8px] tracking-widest uppercase px-2.5 py-1 rounded-full" style={{ background: 'rgba(212,175,55,0.18)', color: 'rgba(212,175,55,0.8)', border: '1px solid rgba(212,175,55,0.25)' }}>
              ★ Awaiting your approval — which section does this belong under?
            </span>
            <p className="font-display text-lg text-foreground/80 mt-2">Sonia &amp; Her Music Mug</p>
            <p className="font-body text-xs text-muted-foreground/50">Our Love · Legacy · Gallery</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ────────────────────────────────────────────────────────────────────────────
//  SECTION HEADING HELPER
// ────────────────────────────────────────────────────────────────────────────
function SectionLabel({ label, title, sub }) {
  return (
    <motion.div
      className="text-center mb-10 gsap-reveal"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 1 }}
    >
      {label && <p className="font-body text-[9px] tracking-[0.65em] uppercase text-primary/40 mb-3">{label}</p>}
      {title && <h2 className="font-display text-3xl md:text-5xl text-foreground mb-3">{title}</h2>}
      {sub   && <p className="font-body text-sm text-muted-foreground/45 max-w-lg mx-auto leading-relaxed">{sub}</p>}
    </motion.div>
  );
}

// ────────────────────────────────────────────────────────────────────────────
//  MAIN PAGE
// ────────────────────────────────────────────────────────────────────────────
export default function MumTribute() {
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray('.gsap-reveal').forEach((el) => {
        gsap.fromTo(el,
          { opacity: 0, y: 50 },
          {
            opacity: 1, y: 0,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 92%',
              toggleActions: 'play none none none',
            },
          }
        );
      });
    });
    return () => ctx.revert();
  }, []);

  return (
    <div className="min-h-screen relative overflow-x-hidden">

      {/* ── IMMERSIVE GARDEN BACKGROUND — fixed, covers entire viewport ── */}
      <GardenImmersionBackground />

      {/* ── STICKY MEMORIAL NAV ── */}
      <MumMemorialNav />

      {/* ── ALL PAGE CONTENT above the background ── */}
      <div className="relative z-10 pt-0 pb-32">

        {/* HERO — full viewport, Sonia centred in her garden */}
        <ImmersiveGardenHero />

        <GardenSectionDivider light />

        {/* HER STORY */}
        <section id="her-story" className="pt-8">
          <MumStorySection />
        </section>

        <GardenSectionDivider />

        {/* GALLERY — images for approval */}
        <Gallery />

        <GardenSectionDivider />

        {/* HER WORLD — Wisdom Garden */}
        <section id="her-world" className="relative py-4">
          <SectionLabel
            label="Her World"
            title="Sonia's Garden"
            sub="The world she created with love — her wisdom, her ways, her warmth."
          />
          <GardenAtmosphere>
            <WisdomGarden />
          </GardenAtmosphere>
        </section>

        <GardenSectionDivider />

        {/* OUR LOVE — The Song */}
        <section id="our-love" className="pt-4">
          <SectionLabel
            label="Our Love"
            title="The Music"
            sub="Songs written for her. A love that lives in every note."
          />

          {/* Thank You — streaming player */}
          <div className="max-w-3xl mx-auto px-4 md:px-8 mb-12">
            <p className="font-body text-[9px] tracking-[0.5em] uppercase text-primary/35 mb-4 text-center">
              Now Playing
            </p>
            <ThankYouPlayer />
          </div>

          {/* Without You Here — lyrics */}
          <MumSongSection />
        </section>

        <GardenSectionDivider />

        {/* LETTERS */}
        <section id="letters" className="pt-4">
          <SectionLabel
            label="Letters"
            title="Words Unsent"
            sub="Share your memories and messages. She is still listening."
          />
          <MumLetterSection />
        </section>

        <GardenSectionDivider />

        {/* MEMORIES THAT STILL MOVE (MemoryWall3D) */}
        <section id="legacy" className="pt-4">
          <SectionLabel
            label="Legacy"
            title="Memories That Still Move"
            sub="These are the moments that breathe. They never stop moving, because she never stopped loving."
          />
          <MemoryWall3D />
        </section>

        <GardenSectionDivider light />

        {/* LIGHT A CANDLE */}
        <LightACandle />

        {/* Footer */}
        <motion.div
          className="text-center py-16 px-6 gsap-reveal"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2 }}
        >
          <Heart className="w-5 h-5 text-primary/30 mx-auto mb-4" fill="rgba(212,175,55,0.15)" />
          <p className="font-body text-[9px] tracking-[0.5em] uppercase text-muted-foreground/25">
            1961 – 2022 &nbsp;·&nbsp; Forever in our hearts &nbsp;·&nbsp; www.gannonwaye.com
          </p>
        </motion.div>
      </div>
    </div>
  );
}