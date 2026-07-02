import React, { useEffect, useState, useRef } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { Heart, ChevronDown } from 'lucide-react';
import HeartOfGold from '@/components/mum/HeartOfGold';
import MumStorySection from '@/components/mum/MumStorySection';
import MumSongSection from '@/components/mum/MumSongSection';
import WisdomGarden from '@/components/mum/WisdomGarden';
import MumLetterSection from '@/components/mum/MumLetterSection';
import SoniaAmbientPlayer from '@/components/mum/SoniaAmbientPlayer';
import LyricQuoteWall from '@/components/mum/LyricQuoteWall';
import HandwrittenLetter from '@/components/mum/HandwrittenLetter';
import MemoryWall3D from '@/components/mum/MemoryWall3D';
import SoniaTimeline from '@/components/mum/SoniaTimeline';
import GoldenGatesFinale from '@/components/mum/GoldenGatesFinale';
import MemoryPlaque from '@/components/mum/MemoryPlaque';
import SingleCoverPlaque from '@/components/mum/SingleCoverPlaque';

// ─── Garden environments ──────────────────────────────────────────────────────
const GARDEN_HERO    = 'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/b7806166d_generated_image.png';
const GARDEN_STORY   = 'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/41c0fd18f_generated_image.png';
const GARDEN_GALLERY = 'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/6591fa60b_generated_image.png';
const GARDEN_MUSIC   = 'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/63f84cf4f_generated_image.png';
const GARDEN_WISDOM  = 'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/fc387c2b6_generated_image.png';
const GARDEN_DEEP    = 'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/63f84cf4f_generated_image.png';

// ─── Photo groups (locked — do not auto-assign new images) ───────────────────
const ME_AND_MUM = [
  { src: 'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/8fe42604b_CopyofIMG_5326.jpg', label: 'Gannon & Sonia', caption: 'Two hearts, one love.' },
  { src: 'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/41d549365_49CE40E3-DBDB-46A9-87BE-332F16FAF1BF.jpg', label: 'Her Swallow, His Heart', caption: "Her swallow, now carried over his heart — forever." },
  { src: 'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/0dd386db9_IMG_5681.jpg', label: 'Together', caption: 'Two of a kind. Always.' },
];

const HER = [
  { src: 'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/dc8919b4b_IMG_5624.png', label: 'Sonia — The Portrait', caption: 'This is her. This is Mum.' },
  { src: 'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/e141f17cb_CopyofIMG_5599.JPG', label: 'That Smile', caption: 'Once seen, never forgotten.' },
  { src: 'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/173717f01_CopyofIMG_5440.jpg', label: 'Coffee & Sunshine', caption: 'A coffee in hand — exactly where she belonged.' },
  { src: 'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/6101f75c0_CopyofIMG_5449.jpg', label: 'Her Joy', caption: 'Her joy was simple. Her presence was everything.' },
  { src: 'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/8b2d006fe_CopyofIMG_5501.jpg', label: 'At the Café', caption: 'She made every ordinary moment feel special.' },
];

const HER_HUMOUR = [
  { src: 'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/25ab2bda2_CopyofIMG_5493.JPG', label: 'Looking Up', caption: 'She saw the best in everything — and everyone.' },
  { src: 'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/c6e537a22_CopyofIMG_5466.jpg', label: 'Always Laughing', caption: 'Always the heart of every gathering.' },
  { src: 'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/d5b3ed6ae_CopyofIMG_5464.jpg', label: 'Full of Life', caption: 'Full of life, full of fire.' },
];

const FAMILY = [
  { src: 'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/5544e4f02_5F77A0A5-95B5-4AFC-9BD0-9AAF81AB32DC.jpg', label: 'The Whole Family', caption: 'Together — the way she always wanted it.' },
  { src: 'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/1ddea2586_CopyofIMG_5327.jpg', label: 'Her Granddaughter', caption: 'The love she gave just kept multiplying.' },
  { src: 'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/c1ecb80cd_CopyofIMG_5546.jpg', label: 'Her Faithful Companion', caption: 'Always by her side.' },
];

const OLD_DAYS = [
  { src: 'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/9c9ab1261_CopyofIMG_2987.jpg', label: 'Young Sonia', caption: 'She was always this radiant.' },
  { src: 'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/e08e9be77_CopyofD355346C-88AB-482B-AF02-8C0FFBC2FDDE.JPG', label: 'Her Animals', caption: 'Free spirit — she loved the outdoors and her animals.' },
];

// ─── Floating pollen ──────────────────────────────────────────────────────────
function Pollen({ count = 20 }) {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden>
      {[...Array(count)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: `${1 + (i % 3) * 0.8}px`,
            height: `${1 + (i % 3) * 0.8}px`,
            background: `rgba(212,175,55,${0.10 + (i % 5) * 0.07})`,
            left: `${(i * 3.71 + 2) % 96}%`,
            top: `${(i * 6.13 + 4) % 90}%`,
          }}
          animate={{ y: [0, -(20 + (i % 4) * 14), 0], x: [(i % 2 === 0 ? -5 : 5), 0, (i % 2 === 0 ? 4 : -4)], opacity: [0.03, 0.45, 0.03] }}
          transition={{ duration: 6 + (i % 5) * 1.6, repeat: Infinity, delay: i * 0.35, ease: 'easeInOut' }}
        />
      ))}
    </div>
  );
}

// ─── Garden scene wrapper ─────────────────────────────────────────────────────
function GardenScene({ photo, brightness = 0.5, blur = 0, parallaxSpeed = 0.2, children, id, minH = '100vh' }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], ['0%', `${parallaxSpeed * 40}%`]);

  return (
    <section id={id} ref={ref} className="relative overflow-hidden flex items-center justify-center" style={{ minHeight: minH }}>
      <motion.div className="absolute inset-0 w-full" style={{ y, height: '130%', top: '-15%' }}>
        <img src={photo} alt="" aria-hidden style={{
          width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 30%',
          filter: `brightness(${brightness}) saturate(0.92) contrast(1.08)${blur > 0 ? ` blur(${blur}px)` : ''}`,
          display: 'block',
        }} />
      </motion.div>
      <motion.div className="absolute inset-0 pointer-events-none"
        animate={{ opacity: [0.18, 0.35, 0.18] }}
        transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
        style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 35%, rgba(60,30,5,0.22) 0%, transparent 70%)' }}
      />
      <div className="absolute bottom-0 left-0 right-0 h-1/3 pointer-events-none" style={{
        background: 'linear-gradient(to top, rgba(10,20,10,0.30) 0%, rgba(15,35,10,0.10) 50%, transparent 100%)',
      }} />
      <div className="absolute inset-0 pointer-events-none" style={{
        background: `
          linear-gradient(to right,  rgba(2,5,2,0.88) 0%, rgba(2,5,2,0.30) 18%, transparent 40%),
          linear-gradient(to left,   rgba(2,5,2,0.88) 0%, rgba(2,5,2,0.30) 18%, transparent 40%),
          linear-gradient(to bottom, rgba(2,5,2,0.72) 0%, transparent 22%),
          linear-gradient(to top,    rgba(2,5,2,0.88) 0%, rgba(2,5,2,0.45) 30%, transparent 55%)
        `,
      }} />
      <Pollen count={18} />
      <div className="relative z-10 w-full">{children}</div>
    </section>
  );
}

// ─── Candle ───────────────────────────────────────────────────────────────────
function Candle() {
  const [lit, setLit] = useState(false);
  return (
    <button onClick={() => setLit(true)} aria-label="Light a candle" className="group relative flex flex-col items-center transition-transform duration-300 hover:scale-110 active:scale-95" style={{ width: 56 }}>
      <AnimatePresence>
        {lit && (
          <motion.div className="absolute" style={{ bottom: '100%', marginBottom: 4 }}
            initial={{ opacity: 0, scaleY: 0 }} animate={{ opacity: 1, scaleY: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5, ease: 'backOut' }}>
            <motion.div style={{ width: 18, height: 30, borderRadius: '50% 50% 30% 30%', background: 'radial-gradient(ellipse at 50% 85%, #fff 0%, #f5c842 40%, #e07c10 75%, transparent 100%)', boxShadow: '0 0 20px 8px rgba(245,200,66,0.6), 0 0 50px 14px rgba(220,130,20,0.22)' }}
              animate={{ scaleX: [1, 1.18, 0.9, 1.12, 1], scaleY: [1, 0.88, 1.12, 0.94, 1] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }} />
          </motion.div>
        )}
      </AnimatePresence>
      <div style={{ width: '100%', height: 72, borderRadius: 3, background: lit ? 'linear-gradient(180deg,#f5ead0 0%,#ede0b6 70%,#c9a84c 100%)' : 'linear-gradient(180deg,#c8c0a4 0%,#a8a080 100%)', border: `1px solid ${lit ? 'rgba(212,175,55,0.7)' : 'rgba(180,160,120,0.25)'}`, boxShadow: lit ? '0 0 40px rgba(245,200,66,0.30), 0 0 80px rgba(212,175,55,0.12)' : 'none', transition: 'all 0.8s ease' }} />
    </button>
  );
}

// ─── Nav ──────────────────────────────────────────────────────────────────────
const NAV = [
  { id: 'entrance',  label: 'Entrance'  },
  { id: 'me-mum',   label: 'Me & Mum'  },
  { id: 'her',      label: 'Her'       },
  { id: 'humour',   label: 'Humour'    },
  { id: 'family',   label: 'Family'    },
  { id: 'words',    label: 'Her Words' },
  { id: 'timeline', label: 'Journey'   },
  { id: 'olddays',  label: 'Old Days'  },
  { id: 'gates',    label: '✦ Gates'   },
];

function Nav() {
  const [show, setShow] = useState(false);
  const [active, setActive] = useState('entrance');
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
    <motion.div className="fixed top-16 left-0 right-0 z-50 flex justify-center px-3"
      style={{ pointerEvents: show ? 'auto' : 'none' }}
      animate={{ opacity: show ? 1 : 0, y: show ? 0 : -10 }} transition={{ duration: 0.3 }}>
      <div className="flex items-center gap-0.5 px-2 py-1.5 rounded-full flex-wrap justify-center"
        style={{ background: 'rgba(4,7,4,0.80)', backdropFilter: 'blur(18px)', WebkitBackdropFilter: 'blur(18px)', border: '1px solid rgba(212,175,55,0.16)', boxShadow: '0 8px 40px rgba(0,0,0,0.55)' }}>
        {NAV.map(n => (
          <button key={n.id}
            onClick={() => document.getElementById(n.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
            className="font-body text-[9px] md:text-[10px] uppercase px-3 py-1.5 rounded-full transition-all duration-300"
            style={{ letterSpacing: '0.16em', color: active === n.id ? 'rgba(245,208,110,1)' : 'rgba(212,175,55,0.42)', background: active === n.id ? 'rgba(212,175,55,0.11)' : 'transparent' }}>
            {n.label}
          </button>
        ))}
      </div>
    </motion.div>
  );
}

// ─── Main page ─────────────────────────────────────────────────────────────────
export default function MumTribute() {
  const { scrollY } = useScroll();
  const heroOpacity = useTransform(scrollY, [0, 500], [1, 0]);
  const heroY = useTransform(scrollY, [0, 500], [0, -80]);

  return (
    <div className="relative overflow-x-hidden" style={{ background: '#020502' }}>
      <Nav />

      {/* ══ SCENE 1 — GARDEN ENTRANCE ══════════════════════════════════════════ */}
      <section id="entrance" className="relative overflow-hidden" style={{ minHeight: '100vh' }}>
        <div className="absolute inset-0">
          <img src={GARDEN_DEEP} alt="" aria-hidden style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 25%', filter: 'brightness(0.35) saturate(0.88)' }} />
        </div>
        <motion.div className="absolute inset-0" style={{ y: useTransform(scrollY, [0, 800], [0, 100]) }}>
          <img src="https://media.base44.com/images/public/69eb7905ca6eb4180010f794/ef4adf36e_generated_image.png" alt="" aria-hidden style={{ width: '100%', height: '115%', objectFit: 'cover', objectPosition: 'center 30%', filter: 'brightness(0.45) saturate(1.1)' }} />
        </motion.div>
        <motion.div className="absolute inset-0" style={{ y: useTransform(scrollY, [0, 800], [0, 60]) }}>
          <img src={GARDEN_HERO} alt="" aria-hidden style={{ width: '100%', height: '110%', objectFit: 'cover', objectPosition: 'center 30%', filter: 'brightness(0.55) saturate(1.12) contrast(1.04)', mixBlendMode: 'multiply', opacity: 0.7 }} />
        </motion.div>
        <div className="absolute inset-0 pointer-events-none" style={{
          background: `
            linear-gradient(to right,  rgba(2,5,2,0.95) 0%, rgba(2,5,2,0.45) 16%, transparent 38%),
            linear-gradient(to left,   rgba(2,5,2,0.95) 0%, rgba(2,5,2,0.45) 16%, transparent 38%),
            linear-gradient(to bottom, rgba(2,5,2,0.85) 0%, transparent 30%),
            linear-gradient(to top,    rgba(2,5,2,0.96) 0%, rgba(2,5,2,0.60) 28%, transparent 55%)
          `,
        }} />
        <Pollen count={30} />

        <motion.div className="absolute inset-0 flex flex-col items-center justify-end pb-16 px-6 text-center z-10"
          style={{ opacity: heroOpacity, y: heroY }}>
          <p className="font-body text-[8px] tracking-[0.8em] uppercase mb-5" style={{ color: 'rgba(212,175,55,0.40)' }}>
            A Tribute · Forever in Our Hearts
          </p>
          <HeartOfGold size="lg" />
          <div className="mt-6 mb-3">
            <p className="font-display italic mb-1" style={{ color: 'rgba(245,208,110,0.45)', fontSize: 'clamp(0.9rem,2.2vw,1.2rem)' }}>In Loving Memory of</p>
            <h1 className="font-display leading-none" style={{
              fontSize: 'clamp(3.5rem,11vw,7.5rem)',
              background: 'linear-gradient(145deg,#c9a84c 0%,#f5d06e 38%,#ffe08a 50%,#f5d06e 62%,#c9a84c 100%)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
              filter: 'drop-shadow(0 0 40px rgba(255,220,80,0.75)) drop-shadow(0 0 80px rgba(212,175,55,0.45)) drop-shadow(0 2px 4px rgba(0,0,0,0.9))',
            }}>Sonia</h1>
            <h2 className="font-display text-foreground/90 tracking-widest" style={{ fontSize: 'clamp(1.1rem,3.5vw,2.2rem)', letterSpacing: '0.14em', textShadow: '0 0 20px rgba(212,175,55,0.5), 0 2px 8px rgba(0,0,0,0.9)' }}>Katisa Waye</h2>
            <p className="font-body tracking-[0.65em] mt-2" style={{ color: 'rgba(212,175,55,0.42)', fontSize: '0.7rem' }}>1961 – 2022</p>
          </div>
          <div className="flex items-center gap-3 my-4">
            <div className="w-14 h-px" style={{ background: 'linear-gradient(to right,transparent,rgba(212,175,55,0.35))' }} />
            <Heart className="w-3 h-3" fill="rgba(212,175,55,0.25)" style={{ color: 'rgba(212,175,55,0.3)' }} />
            <div className="w-14 h-px" style={{ background: 'linear-gradient(to left,transparent,rgba(212,175,55,0.35))' }} />
          </div>
          <blockquote className="mb-8 max-w-sm">
            <p className="font-display italic text-foreground/65 leading-relaxed" style={{ fontSize: 'clamp(1rem,2.5vw,1.4rem)' }}>
              "As long as you remember me,<br />my memory will live on."
            </p>
            <p className="font-body text-xs mt-2" style={{ color: 'rgba(212,175,55,0.28)' }}>— from the funeral service</p>
          </blockquote>
          <div className="flex flex-wrap justify-center gap-3">
            <button onClick={() => document.getElementById('me-mum')?.scrollIntoView({ behavior: 'smooth' })}
              className="rounded-full font-body text-xs tracking-widest uppercase px-8 py-3 font-semibold transition-all hover:scale-105"
              style={{ background: 'linear-gradient(135deg,#c9a84c,#f5d06e)', color: '#060c06', boxShadow: '0 0 24px rgba(212,175,55,0.40)' }}>
              Enter Her Garden
            </button>
            <button onClick={() => document.getElementById('candles')?.scrollIntoView({ behavior: 'smooth' })}
              className="rounded-full font-body text-xs tracking-widest uppercase px-8 py-3 transition-all hover:bg-white/5"
              style={{ border: '1px solid rgba(212,175,55,0.28)', color: 'rgba(212,175,55,0.72)' }}>
              ♥ Light a Candle
            </button>
          </div>
          <motion.div className="mt-10 mb-6" animate={{ y: [0, 8, 0] }} transition={{ duration: 2.5, repeat: Infinity }}>
            <ChevronDown className="w-5 h-5" style={{ color: 'rgba(212,175,55,0.22)' }} />
          </motion.div>
          <SingleCoverPlaque size="sm" delay={0.6} />
        </motion.div>
      </section>

      {/* ══ CANDLES (floats after entrance) ════════════════════════════════════ */}
      <GardenScene id="candles" photo={GARDEN_WISDOM} brightness={0.50} parallaxSpeed={0.18} minH="auto">
        <div className="py-20 px-6 max-w-2xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 1 }}>
            <p className="font-body text-[9px] tracking-[0.6em] uppercase mb-4" style={{ color: 'rgba(212,175,55,0.40)' }}>Light a Candle</p>
            <h2 className="font-display text-3xl md:text-5xl text-foreground mb-6">In Her Honour</h2>
            <div className="flex justify-center gap-6 mb-6">
              <Candle /><Candle /><Candle />
            </div>
            <p className="font-body text-sm max-w-sm mx-auto" style={{ color: 'rgba(245,235,200,0.45)' }}>
              Click a candle to light it in memory of Sonia Katisa Waye.
            </p>
          </motion.div>
          <div className="mt-10">
            <SingleCoverPlaque size="sm" delay={0.3} />
          </div>
        </div>
      </GardenScene>

      {/* ══ SCENE 2 — ME & MUM ══════════════════════════════════════════════════ */}
      <GardenScene id="me-mum" photo={GARDEN_GALLERY} brightness={0.48} parallaxSpeed={0.20} minH="auto">
        <div className="py-20 px-6 max-w-4xl mx-auto">
          <motion.div className="text-center mb-12" initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <p className="font-body text-[9px] tracking-[0.6em] uppercase mb-3" style={{ color: 'rgba(212,175,55,0.38)' }}>Scene Two</p>
            <h2 className="font-display text-3xl md:text-5xl text-foreground mb-2">Me & Mum</h2>
            <p className="font-body text-sm max-w-sm mx-auto" style={{ color: 'rgba(245,235,200,0.40)' }}>
              Not a gallery. Memory plaques. Each one a stop on the journey.
            </p>
          </motion.div>
          <div className="flex flex-wrap justify-center gap-10">
            {ME_AND_MUM.map((p, i) => (
              <MemoryPlaque key={i} photo={p.src} label={p.label} caption={p.caption} delay={i * 0.15} />
            ))}
          </div>
          <div className="mt-12">
            <SingleCoverPlaque size="sm" delay={0.4} />
          </div>
        </div>
      </GardenScene>

      {/* ══ SCENE 3 — HER (portraits, coffee, sunshine) ═════════════════════════ */}
      <GardenScene id="her" photo={GARDEN_WISDOM} brightness={0.46} parallaxSpeed={0.22} minH="auto">
        <div className="py-20 px-6 max-w-4xl mx-auto">
          <motion.div className="text-center mb-12" initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <p className="font-body text-[9px] tracking-[0.6em] uppercase mb-3" style={{ color: 'rgba(212,175,55,0.38)' }}>Scene Three</p>
            <h2 className="font-display text-3xl md:text-5xl text-foreground mb-2">Her</h2>
            <p className="font-body text-sm max-w-sm mx-auto" style={{ color: 'rgba(245,235,200,0.40)' }}>
              Portraits. Coffee. Sunshine. Smile. Garden benches.
            </p>
          </motion.div>
          <div className="flex flex-wrap justify-center gap-8">
            {HER.map((p, i) => (
              <MemoryPlaque key={i} photo={p.src} label={p.label} caption={p.caption} delay={i * 0.12} />
            ))}
          </div>
          <div className="mt-14">
            <WisdomGarden />
          </div>
          <div className="mt-12">
            <SingleCoverPlaque size="sm" delay={0.4} />
          </div>
        </div>
      </GardenScene>

      {/* ══ SCENE 4 — HER HUMOUR ════════════════════════════════════════════════ */}
      <GardenScene id="humour" photo={GARDEN_STORY} brightness={0.44} parallaxSpeed={0.20} minH="auto">
        <div className="py-20 px-6 max-w-4xl mx-auto">
          <motion.div className="text-center mb-12" initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <p className="font-body text-[9px] tracking-[0.6em] uppercase mb-3" style={{ color: 'rgba(212,175,55,0.38)' }}>Scene Four</p>
            <h2 className="font-display text-3xl md:text-5xl text-foreground mb-2">Her Humour</h2>
            <p className="font-body text-sm max-w-sm mx-auto" style={{ color: 'rgba(245,235,200,0.40)' }}>
              Funny moments. Laughter. The mug. The look. Those eyes.
            </p>
          </motion.div>
          <div className="flex flex-wrap justify-center gap-8">
            {HER_HUMOUR.map((p, i) => (
              <MemoryPlaque key={i} photo={p.src} label={p.label} caption={p.caption} delay={i * 0.12} />
            ))}
          </div>
          <div className="mt-12">
            <SingleCoverPlaque size="sm" delay={0.4} />
          </div>
        </div>
      </GardenScene>

      {/* ══ SCENE 5 — FAMILY ════════════════════════════════════════════════════ */}
      <GardenScene id="family" photo={GARDEN_GALLERY} brightness={0.50} parallaxSpeed={0.18} minH="auto">
        <div className="py-20 px-6 max-w-4xl mx-auto">
          <motion.div className="text-center mb-12" initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <p className="font-body text-[9px] tracking-[0.6em] uppercase mb-3" style={{ color: 'rgba(212,175,55,0.38)' }}>Scene Five</p>
            <h2 className="font-display text-3xl md:text-5xl text-foreground mb-2">Family</h2>
            <p className="font-body text-sm max-w-sm mx-auto" style={{ color: 'rgba(245,235,200,0.40)' }}>
              Each image — a stop on the journey. Not stacked. Not a wall. A pathway.
            </p>
          </motion.div>
          <div className="flex flex-wrap justify-center gap-8">
            {FAMILY.map((p, i) => (
              <MemoryPlaque key={i} photo={p.src} label={p.label} caption={p.caption} delay={i * 0.15} />
            ))}
          </div>
          <div className="mt-12">
            <SingleCoverPlaque size="sm" delay={0.4} />
          </div>
        </div>
      </GardenScene>

      {/* ══ SCENE 6 — HER STORY ═════════════════════════════════════════════════ */}
      <GardenScene id="story" photo={GARDEN_STORY} brightness={0.46} parallaxSpeed={0.25} minH="auto">
        <MumStorySection />
        <div className="mt-12 px-6">
          <SingleCoverPlaque size="md" delay={0.3} />
        </div>
      </GardenScene>

      {/* ══ SCENE 7 — HER WORDS ═════════════════════════════════════════════════ */}
      <GardenScene id="words" photo={GARDEN_MUSIC} brightness={0.44} parallaxSpeed={0.22} minH="auto">
        <div className="py-20">
          <div className="text-center mb-10 px-6">
            <p className="font-body text-[9px] tracking-[0.6em] uppercase mb-3" style={{ color: 'rgba(212,175,55,0.38)' }}>Scene Seven</p>
            <h2 className="font-display text-3xl md:text-5xl text-foreground mb-2">Her Words</h2>
            <p className="font-body text-sm max-w-sm mx-auto" style={{ color: 'rgba(245,235,200,0.40)' }}>
              Quotes. Voice. Music. The song written for her.
            </p>
          </div>
          <SoniaAmbientPlayer />
          <div className="mt-10">
            <LyricQuoteWall />
          </div>
          <div className="mt-12">
            <MumSongSection />
          </div>
          <div className="mt-12">
            <SingleCoverPlaque size="md" delay={0.3} />
          </div>
        </div>
      </GardenScene>

      {/* ══ HANDWRITTEN LETTER ══════════════════════════════════════════════════ */}
      <GardenScene id="letters" photo={GARDEN_STORY} brightness={0.38} parallaxSpeed={0.20} minH="auto">
        <HandwrittenLetter />
        <div className="mt-12 px-6">
          <SingleCoverPlaque size="sm" delay={0.3} />
        </div>
      </GardenScene>

      {/* ══ SCENE 8 — TIMELINE (her journey) ════════════════════════════════════ */}
      <GardenScene id="timeline" photo={GARDEN_WISDOM} brightness={0.42} parallaxSpeed={0.18} minH="auto">
        <SoniaTimeline />
        <div className="mt-12 px-6">
          <SingleCoverPlaque size="sm" delay={0.3} />
        </div>
      </GardenScene>

      {/* ══ SCENE 8b — OLD DAYS (vintage pathway) ══════════════════════════════ */}
      <GardenScene id="olddays" photo={GARDEN_STORY} brightness={0.38} blur={0.5} parallaxSpeed={0.24} minH="auto">
        <div className="py-20 px-6 max-w-4xl mx-auto">
          <motion.div className="text-center mb-12" initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <p className="font-body text-[9px] tracking-[0.6em] uppercase mb-3" style={{ color: 'rgba(212,175,55,0.38)' }}>Scene Eight</p>
            <h2 className="font-display text-3xl md:text-5xl text-foreground mb-2">Old Days</h2>
            <p className="font-body text-sm max-w-sm mx-auto" style={{ color: 'rgba(245,235,200,0.40)' }}>
              The vintage pathway. Older photographs. Family history.
            </p>
          </motion.div>
          <div className="flex flex-wrap justify-center gap-8">
            {OLD_DAYS.map((p, i) => (
              <MemoryPlaque key={i} photo={p.src} label={p.label} caption={p.caption} delay={i * 0.15} />
            ))}
          </div>
          <div className="mt-14">
            <MemoryWall3D />
          </div>
          <div className="mt-12">
            <SingleCoverPlaque size="sm" delay={0.4} />
          </div>
        </div>
      </GardenScene>

      {/* ══ SCENE 9 — GOLDEN GATES FINALE ══════════════════════════════════════ */}
      <GardenScene id="gates" photo={GARDEN_DEEP} brightness={0.30} parallaxSpeed={0.15} minH="auto">
        <GoldenGatesFinale />
        <div className="mt-12 px-6 pb-8">
          <SingleCoverPlaque size="md" delay={0.4} />
        </div>
      </GardenScene>

      {/* Footer */}
      <div className="text-center py-16 px-6" style={{ background: 'linear-gradient(to bottom, rgba(2,5,2,0) 0%, rgba(2,5,2,1) 40%)' }}>
        <Heart className="w-4 h-4 mx-auto mb-4" fill="rgba(212,175,55,0.15)" style={{ color: 'rgba(212,175,55,0.22)' }} />
        <p className="font-body text-[9px] tracking-[0.5em] uppercase" style={{ color: 'rgba(212,175,55,0.22)' }}>
          1961 – 2022 &nbsp;·&nbsp; Forever in our hearts &nbsp;·&nbsp; gannonwaye.com
        </p>
      </div>
    </div>
  );
}