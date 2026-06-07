import React, { useEffect, useState, useRef } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { Heart, ChevronDown, Play, Pause } from 'lucide-react';
import HeartOfGold from '@/components/mum/HeartOfGold';
import MumStorySection  from '@/components/mum/MumStorySection';
import MemoryWall3D     from '@/components/mum/MemoryWall3D';
import MumSongSection   from '@/components/mum/MumSongSection';
import WisdomGarden     from '@/components/mum/WisdomGarden';
import MumLetterSection from '@/components/mum/MumLetterSection';
import SoniaAmbientPlayer from '@/components/mum/SoniaAmbientPlayer';
import LyricQuoteWall    from '@/components/mum/LyricQuoteWall';
import HandwrittenLetter from '@/components/mum/HandwrittenLetter';

// ─── AI-generated garden environments (no people) ────────────────────────────
const GARDEN_HERO      = 'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/5f0f0c511_generated_image.png'; // stone path into light
const GARDEN_STORY     = 'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/a142dd0b1_generated_image.png'; // golden hour cottage garden
const GARDEN_GALLERY   = 'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/1be31c33f_generated_image.png'; // wisteria archway at dusk
const GARDEN_MUSIC     = 'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/6f860b910_generated_image.png'; // roses and candles
const GARDEN_WISDOM    = 'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/b68f54dba_generated_image.png'; // twilight fireflies
const GARDEN_LETTERS   = 'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/a142dd0b1_generated_image.png'; // warm cottage garden
const GARDEN_DEEP      = 'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/5f0f0c511_generated_image.png'; // path/candle closing

// ─── Sonia's real photos — Gallery section only ───────────────────────────────
const SONIA_GARDEN  = 'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/042dbd116_reel1_s2_keyframe.jpg';
const SONIA_DOGS    = 'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/215477423_0fdbdb2a-c851-496c-a6d1-e777ae1bfc6a.jpg';
const SONIA_MUG     = 'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/da5efd6c2_reel1_s2_keyframe1.jpg';
const GANNON_SONIA  = 'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/fd71e9213_QEHH7866.JPG';

// ─── Floating pollen particles ────────────────────────────────────────────────
function Pollen({ count = 28 }) {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden>
      {[...Array(count)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width:  `${1 + (i % 3) * 0.8}px`,
            height: `${1 + (i % 3) * 0.8}px`,
            background: `rgba(212,175,55,${0.10 + (i % 5) * 0.07})`,
            left: `${(i * 3.71 + 2) % 96}%`,
            top:  `${(i * 6.13 + 4) % 90}%`,
          }}
          animate={{
            y:       [0, -(20 + (i % 4) * 14), 0],
            x:       [(i % 2 === 0 ? -5 : 5), 0, (i % 2 === 0 ? 4 : -4)],
            opacity: [0.03, 0.45, 0.03],
          }}
          transition={{
            duration: 6 + (i % 5) * 1.6,
            repeat: Infinity,
            delay: i * 0.35,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
}

// ─── Full-bleed garden scene — each section uses this ─────────────────────────
function GardenScene({ photo, brightness = 0.5, blur = 0, parallaxSpeed = 0.2, children, id, minH = '100vh' }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], ['0%', `${parallaxSpeed * 40}%`]);

  return (
    <section
      id={id}
      ref={ref}
      className="relative overflow-hidden flex items-center justify-center"
      style={{ minHeight: minH }}
    >
      {/* ── The garden photograph — it IS the world ── */}
      <motion.div
        className="absolute inset-0 w-full"
        style={{ y, height: '130%', top: '-15%' }}
      >
        <img
          src={photo}
          alt=""
          aria-hidden
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center 30%',
            filter: `brightness(${brightness}) saturate(0.92) contrast(1.08)${blur > 0 ? ` blur(${blur}px)` : ''}`,
            display: 'block',
          }}
        />
      </motion.div>

      {/* ── Gold atmosphere ── */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        animate={{ opacity: [0.18, 0.30, 0.18] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
        style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 35%, rgba(110,60,10,0.22) 0%, transparent 70%)' }}
      />

      {/* ── Deep forest edges — immersion vignette ── */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: `
          linear-gradient(to right,  rgba(2,5,2,0.88) 0%, rgba(2,5,2,0.30) 18%, transparent 40%),
          linear-gradient(to left,   rgba(2,5,2,0.88) 0%, rgba(2,5,2,0.30) 18%, transparent 40%),
          linear-gradient(to bottom, rgba(2,5,2,0.72) 0%, transparent 22%),
          linear-gradient(to top,    rgba(2,5,2,0.88) 0%, rgba(2,5,2,0.45) 30%, transparent 55%)
        `,
      }} />

      {/* ── Pollen in the air ── */}
      <Pollen count={18} />

      {/* ── Content floats inside the garden ── */}
      <div className="relative z-10 w-full">
        {children}
      </div>
    </section>
  );
}

// ─── Candle lighter ───────────────────────────────────────────────────────────
function Candle() {
  const [lit, setLit] = useState(false);
  return (
    <button
      onClick={() => setLit(true)}
      aria-label="Light a candle for Sonia"
      className="group relative flex flex-col items-center transition-transform duration-300 hover:scale-110 active:scale-95"
      style={{ width: 56 }}
    >
      <AnimatePresence>
        {lit && (
          <motion.div
            className="absolute"
            style={{ bottom: '100%', marginBottom: 4 }}
            initial={{ opacity: 0, scaleY: 0 }}
            animate={{ opacity: 1, scaleY: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: 'backOut' }}
          >
            <motion.div
              style={{
                width: 18, height: 30, borderRadius: '50% 50% 30% 30%',
                background: 'radial-gradient(ellipse at 50% 85%, #fff 0%, #f5c842 40%, #e07c10 75%, transparent 100%)',
                boxShadow: '0 0 20px 8px rgba(245,200,66,0.6), 0 0 50px 14px rgba(220,130,20,0.22)',
              }}
              animate={{ scaleX: [1, 1.18, 0.9, 1.12, 1], scaleY: [1, 0.88, 1.12, 0.94, 1] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
            />
          </motion.div>
        )}
      </AnimatePresence>
      <div style={{
        width: '100%', height: 72, borderRadius: 3,
        background: lit
          ? 'linear-gradient(180deg,#f5ead0 0%,#ede0b6 70%,#c9a84c 100%)'
          : 'linear-gradient(180deg,#c8c0a4 0%,#a8a080 100%)',
        border: `1px solid ${lit ? 'rgba(212,175,55,0.7)' : 'rgba(180,160,120,0.25)'}`,
        boxShadow: lit ? '0 0 40px rgba(245,200,66,0.30), 0 0 80px rgba(212,175,55,0.12)' : 'none',
        transition: 'all 0.8s ease',
        position: 'relative', overflow: 'hidden',
      }}>
        {lit && <div style={{ position: 'absolute', top: 0, left: '35%', width: 3, height: 10, borderRadius: '0 0 4px 4px', background: 'rgba(255,255,255,0.35)' }} />}
      </div>
      <div style={{ width: 1, height: 10, background: 'rgba(200,180,140,0.4)' }} />
    </button>
  );
}

// ─── Nav ──────────────────────────────────────────────────────────────────────
const NAV = [
  { id: 'hero',    label: 'Home'      },
  { id: 'candles', label: '♥ Candle'  },
  { id: 'story',   label: 'Her Story' },
  { id: 'letters', label: 'Her Letter'},
  { id: 'music',   label: 'Music'     },
  { id: 'lyrics',  label: 'Her Song'  },
  { id: 'gallery', label: 'Gallery'   },
];

function Nav() {
  const [show, setShow] = useState(false);
  const [active, setActive] = useState('hero');

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 80);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) setActive(e.target.id); }),
      { rootMargin: '-45% 0px -45% 0px' }
    );
    NAV.forEach(n => { const el = document.getElementById(n.id); if (el) obs.observe(el); });
    return () => obs.disconnect();
  }, []);

  return (
    <motion.div
      className="fixed top-16 left-0 right-0 z-50 flex justify-center px-3"
      style={{ pointerEvents: show ? 'auto' : 'none' }}
      animate={{ opacity: show ? 1 : 0, y: show ? 0 : -10 }}
      transition={{ duration: 0.3 }}
    >
      <div
        className="flex items-center gap-0.5 px-2 py-1.5 rounded-full flex-wrap justify-center"
        style={{
          background: 'rgba(4,7,4,0.80)',
          backdropFilter: 'blur(18px)',
          WebkitBackdropFilter: 'blur(18px)',
          border: '1px solid rgba(212,175,55,0.16)',
          boxShadow: '0 8px 40px rgba(0,0,0,0.55)',
        }}
      >
        {NAV.map(n => (
          <button
            key={n.id}
            onClick={() => document.getElementById(n.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
            className="font-body text-[9px] md:text-[10px] uppercase px-3 py-1.5 rounded-full transition-all duration-300"
            style={{
              letterSpacing: '0.16em',
              color: active === n.id ? 'rgba(245,208,110,1)' : 'rgba(212,175,55,0.42)',
              background: active === n.id ? 'rgba(212,175,55,0.11)' : 'transparent',
            }}
          >
            {n.label}
          </button>
        ))}
      </div>
    </motion.div>
  );
}

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────
export default function MumTribute() {
  const { scrollY } = useScroll();
  const heroOpacity = useTransform(scrollY, [0, 500], [1, 0]);
  const heroY       = useTransform(scrollY, [0, 500], [0, -80]);

  return (
    <div className="relative overflow-x-hidden" style={{ background: '#020502' }}>
      <Nav />

      {/* ══════════════════════════════════════════════════════════════════
          SECTION 1 — HERO
          The garden opens around you. Sonia is at the centre.
          You are already inside.
      ══════════════════════════════════════════════════════════════════ */}
      <section id="hero" className="relative overflow-hidden" style={{ minHeight: '100vh' }}>
        {/* Background: deep misty garden layer */}
        <div className="absolute inset-0">
          <img src={GARDEN_DEEP} alt="" aria-hidden style={{
            width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 25%',
            filter: 'brightness(0.35) saturate(0.88)',
          }} />
        </div>
        {/* Mid layer: stone path garden, slightly brighter, parallax */}
        <motion.div
          className="absolute inset-0"
          style={{ y: useTransform(scrollY, [0, 800], [0, 80]) }}
        >
          <img src={GARDEN_HERO} alt="" aria-hidden style={{
            width: '100%', height: '110%', objectFit: 'cover', objectPosition: 'center 30%',
            filter: 'brightness(0.68) saturate(1.08) contrast(1.06)',
          }} />
        </motion.div>
        {/* Gold atmosphere pulse */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          animate={{ opacity: [0.20, 0.38, 0.20] }}
          transition={{ duration: 10, repeat: Infinity }}
          style={{ background: 'radial-gradient(ellipse 65% 55% at 50% 38%, rgba(120,65,8,0.28) 0%, transparent 70%)' }}
        />
        {/* Deep vignette — forest closes in from all sides */}
        <div className="absolute inset-0 pointer-events-none" style={{
          background: `
            linear-gradient(to right,  rgba(2,5,2,0.95) 0%, rgba(2,5,2,0.45) 16%, transparent 38%),
            linear-gradient(to left,   rgba(2,5,2,0.95) 0%, rgba(2,5,2,0.45) 16%, transparent 38%),
            linear-gradient(to bottom, rgba(2,5,2,0.85) 0%, transparent 30%),
            linear-gradient(to top,    rgba(2,5,2,0.96) 0%, rgba(2,5,2,0.60) 28%, transparent 55%)
          `,
        }} />
        <Pollen count={30} />

        {/* Hero copy — floats in the garden air */}
        <motion.div
          className="absolute inset-0 flex flex-col items-center justify-end pb-16 px-6 text-center z-10"
          style={{ opacity: heroOpacity, y: heroY }}
        >
          <p className="font-body text-[8px] tracking-[0.8em] uppercase mb-5" style={{ color: 'rgba(212,175,55,0.40)' }}>
            A Tribute · Forever in Our Hearts
          </p>

          <HeartOfGold size="lg" />

          <div className="mt-6 mb-3">
            <p className="font-display italic mb-1" style={{ color: 'rgba(245,208,110,0.45)', fontSize: 'clamp(0.9rem,2.2vw,1.2rem)' }}>
              In Loving Memory of
            </p>
            <h1
              className="font-display leading-none"
              style={{
                fontSize: 'clamp(3.5rem,11vw,7.5rem)',
                background: 'linear-gradient(145deg,#c9a84c 0%,#f5d06e 38%,#ffe08a 50%,#f5d06e 62%,#c9a84c 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                filter: 'drop-shadow(0 0 30px rgba(212,175,55,0.40))',
              }}
            >Sonia</h1>
            <h2
              className="font-display text-foreground/75 tracking-widest"
              style={{ fontSize: 'clamp(1.1rem,3.5vw,2.2rem)', letterSpacing: '0.14em' }}
            >Katisa Waye</h2>
            <p className="font-body tracking-[0.65em] mt-2" style={{ color: 'rgba(212,175,55,0.42)', fontSize: '0.7rem' }}>
              1961 – 2022
            </p>
          </div>

          <div className="flex items-center gap-3 my-4">
            <div className="w-14 h-px" style={{ background: 'linear-gradient(to right,transparent,rgba(212,175,55,0.35))' }} />
            <Heart className="w-3 h-3" fill="rgba(212,175,55,0.25)" style={{ color: 'rgba(212,175,55,0.3)' }} />
            <div className="w-14 h-px" style={{ background: 'linear-gradient(to left,transparent,rgba(212,175,55,0.35))' }} />
          </div>

          <blockquote className="mb-8 max-w-sm">
            <p className="font-display italic text-foreground/65 leading-relaxed" style={{ fontSize: 'clamp(1rem,2.5vw,1.4rem)' }}>
              "Forever in our hearts,<br />always in our lives."
            </p>
          </blockquote>

          <div className="flex flex-wrap justify-center gap-3">
            <button
              onClick={() => document.getElementById('story')?.scrollIntoView({ behavior: 'smooth' })}
              className="rounded-full font-body text-xs tracking-widest uppercase px-8 py-3 font-semibold transition-all hover:scale-105"
              style={{
                background: 'linear-gradient(135deg,#c9a84c,#f5d06e)',
                color: '#060c06',
                boxShadow: '0 0 24px rgba(212,175,55,0.40)',
              }}
            >Enter Her Garden</button>
            <button
              onClick={() => document.getElementById('candles')?.scrollIntoView({ behavior: 'smooth' })}
              className="rounded-full font-body text-xs tracking-widest uppercase px-8 py-3 transition-all hover:bg-white/5"
              style={{ border: '1px solid rgba(212,175,55,0.28)', color: 'rgba(212,175,55,0.72)' }}
            >♥ Light a Candle</button>
          </div>

          <motion.div
            className="mt-10 flex flex-col items-center"
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2.5, repeat: Infinity }}
          >
            <ChevronDown className="w-5 h-5" style={{ color: 'rgba(212,175,55,0.22)' }} />
          </motion.div>
        </motion.div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          SECTION 2 — CANDLES + WISDOM (moved to top)
      ══════════════════════════════════════════════════════════════════ */}
      <GardenScene id="candles" photo={GARDEN_WISDOM} brightness={0.50} parallaxSpeed={0.18} minH="auto">
        <div className="py-20 px-6 max-w-2xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 1 }}>
            <p className="font-body text-[9px] tracking-[0.6em] uppercase mb-4" style={{ color: 'rgba(212,175,55,0.40)' }}>Light a Candle</p>
            <h2 className="font-display text-3xl md:text-5xl text-foreground mb-6">In Her Honour</h2>
            <div className="flex justify-center gap-6 mb-8">
              <Candle /><Candle /><Candle />
            </div>
            <p className="font-body text-sm mb-2 max-w-sm mx-auto" style={{ color: 'rgba(245,235,200,0.45)' }}>
              Click a candle to light it in memory of Sonia Katisa Waye.
            </p>
          </motion.div>
        </div>
        <div className="pb-16">
          <div className="text-center mb-10 px-6">
            <p className="font-body text-[9px] tracking-[0.6em] uppercase mb-3" style={{ color: 'rgba(212,175,55,0.38)' }}>Her World</p>
            <h2 className="font-display text-3xl md:text-5xl text-foreground mb-3">Sonia's Garden</h2>
            <p className="font-body text-sm max-w-md mx-auto" style={{ color: 'rgba(245,235,200,0.42)' }}>
              The world she created with love — her wisdom, her ways, her warmth.
            </p>
          </div>
          <WisdomGarden />
        </div>
      </GardenScene>

      {/* ══════════════════════════════════════════════════════════════════
          SECTION 3 — HER STORY
      ══════════════════════════════════════════════════════════════════ */}
      <GardenScene id="story" photo={GARDEN_STORY} brightness={0.46} parallaxSpeed={0.25} minH="auto">
        <MumStorySection />
      </GardenScene>

      {/* ══════════════════════════════════════════════════════════════════
          SECTION 4 — LETTER TO MUM (handwritten, flows into the page)
      ══════════════════════════════════════════════════════════════════ */}
      <GardenScene id="letters" photo={GARDEN_LETTERS} brightness={0.38} parallaxSpeed={0.20} minH="auto">
        <HandwrittenLetter />
      </GardenScene>

      {/* ══════════════════════════════════════════════════════════════════
          SECTION 5 — MUSIC (Ave Maria + Amazing Grace — ambient)
      ══════════════════════════════════════════════════════════════════ */}
      <GardenScene id="music" photo={GARDEN_MUSIC} brightness={0.44} parallaxSpeed={0.22} minH="auto">
        <div className="py-20">
          <SoniaAmbientPlayer />
          <div className="mt-16">
            <MumSongSection />
          </div>
        </div>
      </GardenScene>

      {/* ══════════════════════════════════════════════════════════════════
          SECTION 6 — LYRIC QUOTE WALL — Without You Here
      ══════════════════════════════════════════════════════════════════ */}
      <GardenScene id="lyrics" photo={GARDEN_WISDOM} brightness={0.40} parallaxSpeed={0.20} minH="auto">
        <div className="py-20">
          <LyricQuoteWall />
        </div>
      </GardenScene>

      {/* ══════════════════════════════════════════════════════════════════
          SECTION 7 — GALLERY
      ══════════════════════════════════════════════════════════════════ */}
      <GardenScene id="gallery" photo={GARDEN_GALLERY} brightness={0.52} parallaxSpeed={0.18} minH="auto">
        <div className="py-20 px-6 max-w-5xl mx-auto">
          <motion.div className="text-center mb-10" initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 1 }}>
            <p className="font-body text-[9px] tracking-[0.6em] uppercase mb-3" style={{ color: 'rgba(212,175,55,0.38)' }}>Gallery</p>
            <h2 className="font-display text-3xl md:text-5xl text-foreground mb-3">Moments We'll Cherish Forever</h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {[
              { src: GANNON_SONIA, label: 'Gannon & Sonia', caption: 'Two hearts, one love.' },
              { src: SONIA_GARDEN, label: 'Her Garden', caption: 'Her favourite place in the world.' },
              { src: SONIA_DOGS,   label: 'Sonia & Her Dogs', caption: 'Joy in every moment.' },
              { src: SONIA_MUG,    label: 'Sonia & Her Music', caption: 'Always listening. Always proud.' },
            ].map((img, i) => (
              <motion.div key={i} className="relative overflow-hidden rounded-2xl group" style={{ border: '1px solid rgba(212,175,55,0.15)', aspectRatio: '4/3' }} initial={{ opacity: 0, scale: 0.96 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: i * 0.12 }}>
                <img src={img.src} alt={img.label} className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700" style={{ filter: 'brightness(0.82) saturate(0.95)' }} />
                <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(3,6,3,0.88) 0%, transparent 50%)' }} />
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <p className="font-display text-lg text-foreground/90">{img.label}</p>
                  <p className="font-body text-xs italic" style={{ color: 'rgba(212,175,55,0.55)' }}>{img.caption}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </GardenScene>

      {/* ══════════════════════════════════════════════════════════════════
          SECTION 8 — MEMORIES (3D wall)
      ══════════════════════════════════════════════════════════════════ */}
      <GardenScene id="memories" photo={GARDEN_STORY} brightness={0.38} blur={0.5} parallaxSpeed={0.24} minH="auto">
        <div className="py-16">
          <div className="text-center mb-10 px-6">
            <p className="font-body text-[9px] tracking-[0.6em] uppercase mb-3" style={{ color: 'rgba(212,175,55,0.38)' }}>Legacy</p>
            <h2 className="font-display text-3xl md:text-5xl text-foreground mb-3">Memories That Still Move</h2>
          </div>
          <MemoryWall3D />
        </div>
      </GardenScene>

      {/* ══════════════════════════════════════════════════════════════════
          SECTION 9 — CLOSING CANDLE MOMENT (footer area)
      ══════════════════════════════════════════════════════════════════ */}
      <GardenScene id="close" photo={GARDEN_MUSIC} brightness={0.55} parallaxSpeed={0.15} minH="50vh">
        <div className="py-20 px-6 max-w-xl mx-auto text-center">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.5 }}
            className="font-display italic text-2xl md:text-3xl"
            style={{ color: 'rgba(245,208,110,0.45)' }}
          >
            "She is still here — in the garden, in the music, in us."
          </motion.p>
        </div>
      </GardenScene>

      {/* ── Footer ── */}
      <div
        className="text-center py-16 px-6"
        style={{ background: 'linear-gradient(to bottom, rgba(2,5,2,0) 0%, rgba(2,5,2,1) 40%)' }}
      >
        <Heart className="w-4 h-4 mx-auto mb-4" fill="rgba(212,175,55,0.15)" style={{ color: 'rgba(212,175,55,0.22)' }} />
        <p className="font-body text-[9px] tracking-[0.5em] uppercase" style={{ color: 'rgba(212,175,55,0.22)' }}>
          1961 – 2022 &nbsp;·&nbsp; Forever in our hearts &nbsp;·&nbsp; gannonwaye.com
        </p>
      </div>
    </div>
  );
}