import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useScroll, useTransform } from 'framer-motion';
import {
  BookOpen,
  ChevronDown,
  Coffee,
  Heart,
  Image as ImageIcon,
  Music2,
  Play,
  Send,
  ShieldCheck,
  ShoppingBag,
  UploadCloud,
  X,
} from 'lucide-react';
import { base44 } from '@/api/base44Client';
import SoniaAmbientPlayer from '@/components/mum/SoniaAmbientPlayer';
import SoniaLifelikeAvatar from '@/components/mum/SoniaLifelikeAvatar';
import SoniaHeyGenReadiness from '@/components/mum/SoniaHeyGenReadiness';
import SoniaVoiceNotes from '@/components/mum/SoniaVoiceNotes';
import { WITHOUT_YOU_HERE_COVER } from '@/constants/musicAssets';

// Approved direction:
// - one continuous scroll page
// - immersive real-feeling Australian backyard garden
// - pop-up drawers for deeper moments
// - no generated family members or fake Sonia likenesses
// - family photos are presented as exact original images only

const GARDEN_HERO = 'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/b7806166d_generated_image.png';
const GARDEN_GALLERY = 'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/6591fa60b_generated_image.png';
const GARDEN_MUSIC = 'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/63f84cf4f_generated_image.png';
const GARDEN_WISDOM = 'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/fc387c2b6_generated_image.png';
const SKY_ANGEL_HERO = '/images/mum/sonia_sky_angel_hero.png';

const REAL_PHOTOS = [
  {
    src: 'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/3892d6143_093DD58D-2A3E-46F2-B235-ABD31D530F48.jpg',
    label: 'Her world',
    caption: 'Morning sun, garden, robe, coffee — the place that still feels like Mum.',
    source: 'Original family photo',
  },
  {
    src: 'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/0300de0f5_3B567D3B-59A6-4B35-8222-64534D6BE5BB.jpg',
    label: 'Still smiling, always',
    caption: 'That cheeky, living spark — the part of her everyone still recognises.',
    source: 'Original family photo',
  },
  {
    src: 'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/c828ecdaa_48963FA0-D6D3-4132-94AC-BCDE290D8224.jpg',
    label: 'Surrounded by her people',
    caption: 'The family gathered around her — exactly as the photo was taken.',
    source: 'Original family photo',
  },
  {
    src: 'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/c1ecb80cd_CopyofIMG_5546.jpg',
    label: 'Flowers for Sonia',
    caption: 'A softer object-memory: colour, care, and the way love kept arriving.',
    source: 'Original family photo',
  },
  {
    src: 'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/0aecb0f25_882C79FF-0CD6-4379-9F15-06F4C8D5BB73.jpeg',
    label: 'Backyard history',
    caption: 'The family-story feeling this page carries: real, Australian, lived-in.',
    source: 'Original family photo',
  },
];

const SERVICE_CARD_QUOTES = [
  {
    title: 'Her life, remembered',
    source: 'Funeral service card',
    text: 'Sonia Katisa Waye · 5 February 1961 — 27 April 2022 · Aged 61.',
  },
  {
    title: 'Family was her centre',
    source: 'Funeral service card',
    text: 'Totally devoted to family and forever loved by all.',
  },
  {
    title: 'Still our guide',
    source: 'The Broken Chain · service card',
    text: 'Your love is still our guide.',
  },
  {
    title: 'A grateful goodbye',
    source: 'Funeral service card',
    text: 'Thank you for celebrating Sonia’s life with us.',
  },
];

const MEMORIAL_TEXT_CARDS = [
  {
    eyebrow: 'Service card',
    title: 'Sonia Katisa Waye',
    body: '5 February 1961 — 27 April 2022. Aged 61.',
  },
  {
    eyebrow: 'Home',
    title: 'Peacefully, with family beside her',
    body: 'The service card remembers Sonia passing peacefully at home, with her man and children by her side.',
  },
  {
    eyebrow: 'Family',
    title: 'Mother to Carla, Gannon, Jarrad and Crystal',
    body: 'Forever loved by all — a mother, soulmate, Nanny, and the centre of so many people’s world.',
  },
  {
    eyebrow: 'Nanny',
    title: 'Devoted Nanny to all her grandchildren',
    body: 'Their names are held privately while the page honours the love she gave them all.',
  },
  {
    eyebrow: 'Public tribute',
    title: 'Forever cherished',
    body: 'The newspaper notice closes with the words: “Forever cherished and in our hearts.”',
  },
];

const CAPTURED_SLIDESHOW_PHOTOS = [
  {
    src: 'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/1ddea2586_CopyofIMG_5327.jpg',
    label: 'S03 · Simple love',
    caption: 'A younger memory with the same backyard feeling.',
    source: 'Captured from older Mum image wall',
  },
  {
    src: 'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/173717f01_CopyofIMG_5440.jpg',
    label: 'S07 · Coffee and sun',
    caption: 'A grounded everyday moment — the kind of memory the garden should hold.',
    source: 'Captured from older Mum image wall',
  },
  {
    src: 'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/6101f75c0_CopyofIMG_5449.jpg',
    label: 'S08 · Family gathered',
    caption: 'Backyard, family, guitar, and the sense of home.',
    source: 'Captured from older Mum image wall',
  },
  {
    src: 'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/c828ecdaa_48963FA0-D6D3-4132-94AC-BCDE290D8224.jpg',
    label: 'S13 · Surrounded',
    caption: 'A family moment that feels alive rather than heavy.',
    source: 'Captured from older Mum image wall',
  },
  {
    src: 'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/e08e9be77_CopyofD355346C-88AB-482B-AF02-8C0FFBC2FDDE.JPG',
    label: 'S17 · Her companion',
    caption: 'One of the gentle animal memories from the older image wall.',
    source: 'Captured from older Mum image wall',
  },
];

const TATTOO_SCRAPBOOK_PHOTOS = [
  {
    src: 'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/7df2f998b_A181BD35-93F3-41FB-B671-2FABC71B701A.jpg',
    label: 'Tattoo scrapbook memory',
    caption: 'A carrying-her-with-me image. Keep tattoo memories together as one scrapbook moment.',
    source: 'Family tattoo memory',
  },
  {
    src: 'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/41d549365_49CE40E3-DBDB-46A9-87BE-332F16FAF1BF.jpg',
    label: 'Tattoo scrapbook memory',
    caption: 'A carrying-her-with-me image. Keep tattoo memories together as one scrapbook moment.',
    source: 'Family tattoo memory',
  },
  {
    src: 'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/942521645_CopyofIMG_5460.JPG',
    label: 'Tattoo scrapbook memory',
    caption: 'A carrying-her-with-me image. Keep tattoo memories together as one scrapbook moment.',
    source: 'Family tattoo memory',
  },
  {
    src: 'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/01878507b_CopyofIMG_5454.jpg',
    label: 'Tattoo scrapbook memory',
    caption: 'A carrying-her-with-me image. Keep tattoo memories together as one scrapbook moment.',
    source: 'Family tattoo memory',
  },
];

const CLEAN_GALLERY_MANIFEST = '/images/mum/memory-lane/_clean_public_gallery_manifest.json';

const GUESTBOOK_STORAGE_KEY = 'sonia-memory-guestbook-submissions-v1';
const FAMILY_UPLOAD_STORAGE_KEY = 'sonia-family-upload-submissions-v1';
const MUM_GARDEN_ACCESS_KEY = 'mum-garden-unlocked-v1';
const MUM_GARDEN_PASSCODE = 'soniagarden2026';

const LYRIC_MOMENTS = [
  {
    kicker: 'Verse one',
    title: 'The first step into the garden',
    line: "I don't wanna live this life without you here",
  },
  {
    kicker: 'Chorus',
    title: 'The line fans remember',
    line: 'How am I supposed to do this without you here?',
  },
  {
    kicker: 'Bridge',
    title: 'The quiet room',
    line: 'Two seconds without you feels too long.',
  },
];

const KEEPSAKES = [
  { title: 'Lyric Poster', note: 'A framed line from the song, held like a memory.' },
  { title: 'Garden Candle', note: 'Warm light, soft eucalyptus, a quiet place to sit.' },
  { title: 'Coffee Mug', note: 'For the morning moments that still feel like Mum.' },
  { title: 'Journal', note: 'A place for letters, memories, and words left unsaid.' },
];

function setMetaTag(selector, attributes) {
  if (typeof document === 'undefined') return;
  let tag = document.head.querySelector(selector);
  if (!tag) {
    tag = document.createElement('meta');
    document.head.appendChild(tag);
  }
  Object.entries(attributes).forEach(([key, value]) => tag.setAttribute(key, value));
}

function setLinkTag(selector, attributes) {
  if (typeof document === 'undefined') return;
  let tag = document.head.querySelector(selector);
  if (!tag) {
    tag = document.createElement('link');
    document.head.appendChild(tag);
  }
  Object.entries(attributes).forEach(([key, value]) => tag.setAttribute(key, value));
}

function GardenWorld({ children, image = GARDEN_HERO, id, minHeight = '100vh', brightness = 0.58, align = 'center' }) {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], ['-2%', '6%']);

  return (
    <section id={id} className="relative overflow-hidden" style={{ minHeight }}>
      <motion.div className="absolute inset-0 scale-[1.06]" style={{ y }}>
        <img
          src={image}
          alt=""
          aria-hidden="true"
          className="h-full w-full object-cover"
          style={{
            objectPosition: align,
            filter: `brightness(${brightness}) saturate(1.04) contrast(1.06)`,
          }}
        />
      </motion.div>

      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(circle at 18% 18%, rgba(245,208,110,0.18), transparent 30%),
            radial-gradient(circle at 80% 22%, rgba(232,125,42,0.16), transparent 30%),
            linear-gradient(90deg, rgba(3,8,4,0.90), rgba(3,8,4,0.20) 40%, rgba(3,8,4,0.88)),
            linear-gradient(0deg, rgba(2,5,2,0.96), rgba(2,5,2,0.18) 48%, rgba(2,5,2,0.62))
          `,
        }}
      />

      <div className="absolute inset-0 pointer-events-none opacity-50">
        {[...Array(22)].map((_, index) => (
          <motion.span
            key={index}
            className="absolute h-1 w-1 rounded-full bg-[#f5d06e]"
            style={{
              left: `${(index * 11) % 96}%`,
              top: `${(index * 17) % 92}%`,
              opacity: 0.18,
            }}
            animate={{ y: [0, -18, 0], opacity: [0.06, 0.36, 0.06] }}
            transition={{ duration: 5 + (index % 5), repeat: Infinity, delay: index * 0.22 }}
          />
        ))}
      </div>

      <LanternCandles />

      <div className="relative z-10">{children}</div>
    </section>
  );
}

function SectionHeading({ eyebrow, title, children }) {
  return (
    <motion.div
      className="mx-auto max-w-3xl px-5 text-center"
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-15%' }}
      transition={{ duration: 0.75 }}
    >
      <p className="font-body text-[10px] uppercase tracking-[0.62em] text-[#d4af37]/55">{eyebrow}</p>
      <h2 className="mt-4 font-display text-4xl text-[#fff7df] md:text-6xl">{title}</h2>
      {children && <div className="mx-auto mt-5 max-w-2xl font-body text-sm leading-7 text-[#fff7df]/62 md:text-base">{children}</div>}
    </motion.div>
  );
}

function GoldButton({ children, onClick, subtle = false, icon: Icon }) {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 font-body text-[11px] font-semibold uppercase tracking-[0.24em] transition duration-300 hover:-translate-y-0.5"
      style={{
        color: subtle ? 'rgba(245,208,110,0.82)' : '#061006',
        background: subtle ? 'rgba(255,255,255,0.055)' : 'linear-gradient(135deg,#caa647,#f5d06e)',
        border: subtle ? '1px solid rgba(212,175,55,0.22)' : '1px solid rgba(255,230,140,0.55)',
        boxShadow: subtle ? '0 16px 44px rgba(0,0,0,0.28)' : '0 18px 50px rgba(212,175,55,0.28)',
      }}
    >
      {Icon && <Icon className="h-4 w-4" />}
      {children}
    </button>
  );
}

function SkyToGardenPrologue({ onEnterGarden, onOpenLyrics, onOpenPhoto }) {
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  });

  const skyOpacity = useTransform(scrollYProgress, [0, 0.28, 0.54], [1, 1, 0]);
  const skyScale = useTransform(scrollYProgress, [0, 1], [1, 1.06]);
  const skyY = useTransform(scrollYProgress, [0, 1], ['0%', '4%']);
  const gardenOpacity = useTransform(scrollYProgress, [0.1, 0.42, 0.72], [0, 0.72, 1]);
  const gardenScale = useTransform(scrollYProgress, [0.1, 1], [1.12, 1.01]);
  const gardenY = useTransform(scrollYProgress, [0, 1], ['6%', '0%']);
  const angelTextOpacity = useTransform(scrollYProgress, [0, 0.18, 0.3], [1, 1, 0]);
  const angelTextY = useTransform(scrollYProgress, [0, 0.34], [0, -38]);
  const gardenTextOpacity = useTransform(scrollYProgress, [0.28, 0.44, 0.7], [0, 1, 1]);
  const gardenTextY = useTransform(scrollYProgress, [0.28, 0.48], [36, 0]);
  const scrollCueOpacity = useTransform(scrollYProgress, [0, 0.14, 0.24], [0.55, 0.85, 0]);

  return (
    <section ref={sectionRef} id="hero" className="relative h-[180vh] bg-[#020814]">
      <div className="sticky top-0 h-screen overflow-hidden">
        <motion.div className="absolute inset-0" style={{ opacity: skyOpacity, scale: skyScale, y: skyY }}>
          <img
            src={SKY_ANGEL_HERO}
            alt=""
            aria-hidden="true"
            className="h-full w-full object-cover object-center"
          />
        </motion.div>

        <motion.div className="absolute inset-0" style={{ opacity: gardenOpacity, scale: gardenScale, y: gardenY }}>
          <img
            src={GARDEN_HERO}
            alt=""
            aria-hidden="true"
            className="h-full w-full object-cover object-center"
          />
        </motion.div>

        <div
          className="absolute inset-0"
          style={{
            background: `
              linear-gradient(180deg, rgba(6,20,46,0.34) 0%, rgba(7,16,26,0.05) 24%, rgba(6,14,11,0.18) 62%, rgba(3,8,4,0.92) 100%),
              linear-gradient(180deg, rgba(8,17,38,0.18) 0%, rgba(8,15,20,0.14) 32%, rgba(4,10,6,0.42) 66%, rgba(3,8,4,0.76) 100%),
              radial-gradient(circle at 50% 18%, rgba(255,241,212,0.24), transparent 30%),
              radial-gradient(circle at 12% 28%, rgba(163,198,255,0.2), transparent 24%),
              radial-gradient(circle at 84% 22%, rgba(250,213,135,0.16), transparent 24%)
            `,
          }}
        />

        <motion.div
          className="absolute inset-x-0 top-[14vh] z-10 mx-auto max-w-4xl px-6 text-center md:px-10"
          style={{ opacity: angelTextOpacity, y: angelTextY }}
        >
          <p className="font-body text-[10px] uppercase tracking-[0.78em] text-white/64">For Mum · Sonia Katisa Waye</p>
          <h1 className="mt-6 font-display text-5xl leading-[0.95] text-white md:text-7xl">
            She meets us in the sky first.
          </h1>
          <p className="mx-auto mt-6 max-w-2xl font-body text-base leading-8 text-white/72 md:text-lg">
            A peaceful blue opening before the page carries visitors down through light, clouds, and into the garden that still feels like her.
          </p>
        </motion.div>

        <motion.div
          className="absolute bottom-8 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-2 text-white/58 md:flex"
          style={{ opacity: scrollCueOpacity }}
        >
          <span className="font-body text-[9px] uppercase tracking-[0.42em]">Scroll into the garden</span>
          <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 2, repeat: Infinity }}>
            <ChevronDown className="h-5 w-5" />
          </motion.div>
        </motion.div>

        <motion.div
          className="absolute inset-x-0 bottom-[11vh] z-10 mx-auto max-w-6xl px-5 md:px-10"
          style={{ opacity: gardenTextOpacity, y: gardenTextY }}
        >
          <div className="max-w-2xl rounded-[2rem] border border-[#d4af37]/18 bg-[#071007]/56 p-6 shadow-[0_30px_100px_rgba(0,0,0,0.4)] backdrop-blur-md md:p-8">
            <p className="font-body text-[10px] uppercase tracking-[0.72em] text-[#d4af37]/55">Mum's Garden</p>
            <h2 className="mt-5 font-display text-5xl leading-[0.95] text-[#fff7df] md:text-7xl">
              Then the garden begins.
            </h2>
            <p className="mt-6 max-w-xl font-body text-base leading-8 text-[#fff7df]/66 md:text-lg">
              From the sky, the page settles into her garden — and from there the story, the music, the photos, and the memories unfold as one long walk with her.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <GoldButton onClick={onEnterGarden} icon={ChevronDown}>
                Enter her garden
              </GoldButton>
              <GoldButton onClick={onOpenLyrics} subtle icon={Music2}>
                Without You Here
              </GoldButton>
              <GoldButton onClick={onOpenPhoto} subtle icon={ImageIcon}>
                View real photo
              </GoldButton>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function StickyListenBar({ onLyrics }) {
  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [0, 280, 560], [0, 0.12, 1]);
  const y = useTransform(scrollY, [0, 560], [26, 0]);

  return (
    <motion.div
      className="fixed bottom-4 left-1/2 z-50 w-[calc(100%-1.5rem)] max-w-3xl -translate-x-1/2 rounded-full border border-[#d4af37]/20 bg-[#071007]/88 px-3 py-2 shadow-[0_22px_80px_rgba(0,0,0,0.55)] backdrop-blur-xl md:bottom-6 md:px-4"
      style={{ opacity, y }}
    >
      <div className="flex items-center gap-3">
        <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full border border-[#d4af37]/35 shadow-[0_0_28px_rgba(212,175,55,0.25)]">
          <img
            src={WITHOUT_YOU_HERE_COVER}
            alt="Without You Here artwork"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 flex items-center justify-center bg-black/24 text-[#fff7df]">
            <Play className="h-4 w-4 fill-current drop-shadow" />
          </div>
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate font-display text-sm text-[#fff7df]">Without You Here</p>
          <p className="truncate font-body text-[10px] uppercase tracking-[0.22em] text-[#d4af37]/46">Gannon Waye · for Mum</p>
        </div>
        <button
          onClick={onLyrics}
          className="hidden rounded-full border border-[#d4af37]/18 px-4 py-2 font-body text-[10px] uppercase tracking-[0.24em] text-[#f5d06e]/78 transition hover:bg-white/5 sm:block"
        >
          Lyrics
        </button>
        <button className="rounded-full bg-[#f5d06e] px-4 py-2 font-body text-[10px] font-bold uppercase tracking-[0.24em] text-[#071007]">
          Listen
        </button>
      </div>
    </motion.div>
  );
}

function LuxuryObjectScene({ onComfort }) {
  return (
    <motion.div
      className="relative mx-auto mt-12 max-w-5xl overflow-hidden rounded-[2rem] border border-[#d4af37]/18 bg-[#071007]/58 p-5 shadow-[0_30px_100px_rgba(0,0,0,0.38)] backdrop-blur-md md:p-8"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
    >
      <div className="grid gap-5 md:grid-cols-[1.1fr_0.9fr]">
        <div
          className="relative min-h-[320px] overflow-hidden rounded-[1.5rem]"
          style={{
            backgroundImage: `linear-gradient(180deg, rgba(4,9,4,0.18), rgba(4,9,4,0.76)), url(${GARDEN_HERO})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="absolute left-5 top-5 rounded-full border border-[#d4af37]/20 bg-[#071007]/70 px-4 py-2 font-body text-[10px] uppercase tracking-[0.32em] text-[#f5d06e]/70 backdrop-blur">
            Real garden world
          </div>
          <div className="absolute bottom-6 left-6 right-6 rounded-[1.2rem] border border-white/10 bg-[#0b1309]/76 p-5 backdrop-blur-md">
            <p className="font-display text-2xl text-[#fff7df]">Robe. Coffee. Garden. Song.</p>
            <p className="mt-2 font-body text-sm leading-6 text-[#fff7df]/58">
              Mum is not recreated. The page carries her through the real objects, exact photos, lyrics, and the world she loved.
            </p>
          </div>
        </div>
        <div className="grid content-between gap-4 rounded-[1.5rem] border border-[#d4af37]/14 bg-[#fff7df]/[0.055] p-5">
          {[
            ['Burgundy robe', 'Her outside chair, her comfort, her everyday presence.'],
            ['Coffee mug', 'A simple object that instantly feels like home.'],
            ['Orange vine', 'The colour and movement that makes the garden breathe.'],
            ['Candles', 'The quiet ritual that lets visitors pause with her.'],
          ].map(([title, note]) => (
            <div key={title} className="rounded-2xl border border-white/8 bg-black/18 p-4">
              <p className="font-display text-lg text-[#fff7df]">{title}</p>
              <p className="mt-1 font-body text-xs leading-5 text-[#fff7df]/52">{note}</p>
            </div>
          ))}
          <GoldButton onClick={onComfort} subtle icon={Coffee}>
            Enter the quiet room
          </GoldButton>
        </div>
      </div>
    </motion.div>
  );
}

function LyricLanterns({ onOpen }) {
  return (
    <div className="mx-auto mt-14 grid max-w-5xl gap-5 px-5 md:grid-cols-3">
      {LYRIC_MOMENTS.map((moment, index) => (
        <motion.button
          key={moment.title}
          onClick={() => onOpen(moment)}
          className="group text-left"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.65, delay: index * 0.08 }}
        >
          <div className="relative min-h-[270px] overflow-hidden rounded-[1.7rem] border border-[#d4af37]/18 bg-[#071007]/68 p-5 shadow-[0_24px_80px_rgba(0,0,0,0.35)] backdrop-blur-md transition duration-300 group-hover:-translate-y-1 group-hover:border-[#d4af37]/36">
            <div className="absolute inset-x-10 top-0 h-28 rounded-full bg-[#f5d06e]/18 blur-3xl" />
            <div className="relative flex h-full flex-col justify-between">
              <span className="w-fit rounded-full border border-[#d4af37]/16 bg-[#f5d06e]/8 px-3 py-1 font-body text-[9px] uppercase tracking-[0.34em] text-[#d4af37]/62">
                {moment.kicker}
              </span>
              <div>
                <p className="font-display text-2xl italic leading-snug text-[#fff7df]/92">“{moment.line}”</p>
                <p className="mt-5 font-body text-xs uppercase tracking-[0.26em] text-[#d4af37]/52">Open lyric drawer</p>
              </div>
            </div>
          </div>
        </motion.button>
      ))}
    </div>
  );
}

function WithoutYouHereCoverFeature() {
  return (
    <motion.div
      className="mx-auto mt-14 grid max-w-5xl gap-6 px-5 md:grid-cols-[0.72fr_1fr] md:items-center"
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.75 }}
    >
      <div className="relative mx-auto w-full max-w-[360px]">
        <div className="absolute -inset-5 rounded-[2rem] bg-[#f5d06e]/10 blur-3xl" />
        <div className="relative overflow-hidden rounded-[1.8rem] border border-[#d4af37]/24 bg-black/35 shadow-[0_30px_100px_rgba(0,0,0,0.48)]">
          <img
            src={WITHOUT_YOU_HERE_COVER}
            alt="Without You Here — Gannon Waye single cover"
            className="block w-full"
            loading="lazy"
          />
        </div>
      </div>
      <div className="rounded-[1.8rem] border border-[#d4af37]/16 bg-[#071007]/70 p-6 shadow-[0_24px_80px_rgba(0,0,0,0.34)] backdrop-blur-md md:p-8">
        <p className="font-body text-[9px] uppercase tracking-[0.46em] text-[#d4af37]/52">Featured single artwork</p>
        <h3 className="mt-4 font-display text-4xl leading-tight text-[#fff7df] md:text-5xl">
          The song has a face now.
        </h3>
        <p className="mt-5 font-body text-sm leading-7 text-[#fff7df]/58">
          Gannon wrote “Without You Here” in his loungeroom. Mum’s Garden is the place the song now leads people into: a gentle memorial world where grief, love, photos, and memories can land.
        </p>
        <p className="mt-4 rounded-[1.15rem] border border-[#d4af37]/14 bg-[#f5d06e]/[0.055] p-4 font-body text-xs leading-6 text-[#fff7df]/56">
          Important release note: the song was not written in a garden. The garden is the tribute experience being built around Sonia’s memory.
        </p>
      </div>
    </motion.div>
  );
}

function PhotoGarden({ onOpen }) {
  return (
    <div className="mx-auto mt-14 grid max-w-6xl gap-5 px-5 sm:grid-cols-2 lg:grid-cols-3">
      {REAL_PHOTOS.map((photo, index) => (
        <motion.button
          key={photo.src}
          onClick={() => onOpen({
            ...photo,
            label: 'Original family photograph',
            caption: 'Held exactly as the original image was provided. No people are generated, swapped, redrawn, or replaced.',
            source: 'Family photo archive',
          })}
          className="group text-left"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.65, delay: (index % 3) * 0.08 }}
        >
          <div className="overflow-hidden rounded-[1.6rem] border border-[#d4af37]/16 bg-[#071007]/66 shadow-[0_26px_84px_rgba(0,0,0,0.35)] backdrop-blur-md transition duration-300 group-hover:-translate-y-1 group-hover:border-[#d4af37]/30">
            <div className="relative aspect-[4/3] overflow-hidden">
              <img
                src={photo.src}
                alt="Original family memory photograph"
                loading="lazy"
                className="h-full w-full object-cover object-top transition duration-700 group-hover:scale-105"
                style={{ filter: 'brightness(0.92) saturate(0.98)' }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#071007]/52 via-transparent to-transparent opacity-0 transition group-hover:opacity-100" />
              <span className="sr-only">Open original family photograph</span>
            </div>
          </div>
        </motion.button>
      ))}
    </div>
  );
}

function TattooScrapbook({ onOpen }) {
  return (
    <div className="mx-auto mt-12 max-w-6xl px-5">
      <div className="rounded-[2.2rem] border border-[#d4af37]/16 bg-[#071007]/72 p-5 shadow-[0_28px_90px_rgba(0,0,0,0.38)] backdrop-blur-md md:p-8">
        <div className="mb-7 max-w-2xl">
          <p className="font-body text-[9px] uppercase tracking-[0.38em] text-[#d4af37]/52">Carrying her with you</p>
          <h3 className="mt-3 font-display text-3xl text-[#fff7df]">The tattoo memories stay together, scrapbook-style.</h3>
          <p className="mt-4 font-body text-sm leading-7 text-[#fff7df]/52">
            These are treated as one intimate collage, not scattered through the garden. Final public use still needs your approval.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {TATTOO_SCRAPBOOK_PHOTOS.map((photo, index) => (
            <motion.button
              key={`${photo.src}-${index}`}
              onClick={() => onOpen(photo)}
              className="group relative text-left"
              initial={{ opacity: 0, y: 24, rotate: index % 2 === 0 ? -2 : 2 }}
              whileInView={{ opacity: 1, y: 0, rotate: index % 2 === 0 ? -1.5 : 1.5 }}
              viewport={{ once: true }}
              transition={{ duration: 0.65, delay: index * 0.06 }}
            >
              <div className="rounded-[1.1rem] bg-[#f6edd0] p-2 shadow-[0_22px_70px_rgba(0,0,0,0.35)] transition duration-300 group-hover:-translate-y-1 group-hover:rotate-0">
                <div className="aspect-[4/5] overflow-hidden rounded-[0.75rem] bg-[#071007]">
                  <img
                    src={photo.src}
                    alt="Tattoo memory collage image"
                    loading="lazy"
                    className="h-full w-full object-cover object-center transition duration-700 group-hover:scale-105"
                    style={{ filter: 'brightness(0.94) saturate(0.96)' }}
                  />
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}

function LanternCandles() {
  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-0 h-64 overflow-hidden opacity-75">
      {[...Array(13)].map((_, index) => (
        <motion.span
          key={index}
          className="absolute bottom-8 block h-16 w-7 rounded-t-full border border-[#f5d06e]/18 bg-[#f5d06e]/[0.045] shadow-[0_0_38px_rgba(245,208,110,0.18)]"
          style={{ left: `${4 + index * 8}%` }}
          animate={{ y: [0, -12, 0], opacity: [0.35, 0.78, 0.35] }}
          transition={{ duration: 4.5 + (index % 4), repeat: Infinity, delay: index * 0.2 }}
        >
          <span className="absolute left-1/2 top-3 h-5 w-3 -translate-x-1/2 rounded-full bg-[#f5d06e]/45 blur-[2px]" />
        </motion.span>
      ))}
    </div>
  );
}

function CapturedSlideshow({ onOpen }) {
  const [cleanGallery, setCleanGallery] = useState([]);

  useEffect(() => {
    let alive = true;

    fetch(CLEAN_GALLERY_MANIFEST)
      .then((response) => (response.ok ? response.json() : Promise.reject(new Error('Clean gallery manifest unavailable'))))
      .then((manifest) => {
        if (!alive) return;
        setCleanGallery(Array.isArray(manifest?.items) ? manifest.items : []);
      })
      .catch(() => {
        if (!alive) return;
        setCleanGallery([]);
      });

    return () => {
      alive = false;
    };
  }, []);

  const galleryPhotos = cleanGallery.length > 0 ? cleanGallery : CAPTURED_SLIDESHOW_PHOTOS;

  return (
    <div className="mx-auto mt-14 max-w-6xl px-5">
      <div className="overflow-hidden rounded-[2rem] border border-[#d4af37]/16 bg-[#071007]/70 p-4 shadow-[0_28px_90px_rgba(0,0,0,0.38)] backdrop-blur-md md:p-6">
        <div className="mb-5 flex flex-col justify-between gap-3 md:flex-row md:items-end">
          <div>
            <p className="font-body text-[9px] uppercase tracking-[0.38em] text-[#d4af37]/52">Memory lane</p>
            <h3 className="mt-2 font-display text-3xl text-[#fff7df]">A cleaned walk through her life, held without labels.</h3>
          </div>
          <p className="max-w-md font-body text-xs leading-6 text-[#fff7df]/48">
            This gallery is auto-screened to remove doubles, blurred candidates, service-card scans, newspaper crops, approval sheets, and funeral-room/coffin/grave-style material from the public garden.
          </p>
        </div>

        <div className="grid max-h-[740px] gap-3 overflow-y-auto pr-1 sm:grid-cols-2 lg:grid-cols-4">
          {galleryPhotos.map((photo, index) => (
            <motion.button
              key={`${photo.src}-${index}`}
              onClick={() => onOpen({
                ...photo,
                label: 'Original memory image',
                caption: photo.caption || 'Captured for Gannon and family approval before public use.',
              })}
              className="group text-left"
              initial={{ opacity: 0, x: 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: (index % 8) * 0.025 }}
            >
              <div className="overflow-hidden rounded-[1.25rem] border border-[#d4af37]/12 bg-black/24 transition duration-300 group-hover:-translate-y-1 group-hover:border-[#d4af37]/30">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img
                    src={photo.src}
                    alt="Captured slideshow memory"
                    loading="lazy"
                    className="h-full w-full object-cover object-top transition duration-700 group-hover:scale-105"
                    style={{ filter: 'brightness(0.92) saturate(0.98)' }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#071007]/46 via-transparent to-transparent opacity-0 transition group-hover:opacity-100" />
                  <span className="sr-only">Open captured slideshow memory</span>
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}


function FamilyContributionAccess() {
  const contributionPath = '/family/sonia-upload?invite=family';
  const reviewPath = '/admin/family-uploads';
  const displayContributionUrl = typeof window !== 'undefined'
    ? `${window.location.origin}${contributionPath}`
    : contributionPath;

  return (
    <div className="mx-auto mt-12 max-w-5xl px-5">
      <div className="grid gap-5 rounded-[2rem] border border-[#d4af37]/16 bg-[#071007]/72 p-5 shadow-[0_26px_90px_rgba(0,0,0,0.35)] backdrop-blur-md md:grid-cols-[1fr_auto] md:items-center md:p-7">
        <div>
          <p className="font-body text-[9px] uppercase tracking-[0.42em] text-[#d4af37]/52">Family contribution access</p>
          <h3 className="mt-3 font-display text-3xl text-[#fff7df]">Send this to your brother before launch.</h3>
          <p className="mt-4 font-body text-sm leading-7 text-[#fff7df]/58">
            He can submit photos, stories, voice notes, eulogy pieces, and context. Nothing goes public automatically; it lands in your review area first.
          </p>
          <p className="mt-4 rounded-[1rem] border border-[#d4af37]/12 bg-black/18 p-3 font-mono text-xs text-[#fff7df]/60">
            {displayContributionUrl}
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row md:flex-col">
          <a
            href={contributionPath}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-[#f5d06e] px-5 py-3 font-body text-[10px] font-bold uppercase tracking-[0.24em] text-[#071007] transition hover:-translate-y-0.5"
          >
            <UploadCloud className="h-4 w-4" />
            Open family link
          </a>
          <a
            href={reviewPath}
            className="inline-flex items-center justify-center gap-2 rounded-full border border-[#d4af37]/22 bg-[#fff7df]/[0.04] px-5 py-3 font-body text-[10px] font-bold uppercase tracking-[0.24em] text-[#f5d06e] transition hover:-translate-y-0.5"
          >
            <ShieldCheck className="h-4 w-4" />
            Review submissions
          </a>
        </div>
      </div>
    </div>
  );
}

function MumPrivateGate({ onUnlock }) {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const contributionPath = '/family/sonia-upload?invite=family';

  const submit = (event) => {
    event.preventDefault();
    if (code.trim().toLowerCase() === MUM_GARDEN_PASSCODE) {
      setError('');
      onUnlock();
      return;
    }
    setError('That code did not unlock the private preview.');
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#020502] px-5 py-12 text-[#fff7df]">
      <img
        src={GARDEN_HERO}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover opacity-45"
        style={{ filter: 'brightness(0.54) saturate(1.05)' }}
      />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_18%,rgba(245,208,110,0.18),transparent_34%),linear-gradient(90deg,rgba(2,5,2,0.94),rgba(2,5,2,0.70),rgba(2,5,2,0.94))]" />

      <section className="relative z-10 w-full max-w-2xl rounded-[2rem] border border-[#d4af37]/20 bg-[#071007]/82 p-6 text-center shadow-[0_34px_120px_rgba(0,0,0,0.58)] backdrop-blur-xl md:p-9">
        <ShieldCheck className="mx-auto h-10 w-10 text-[#f5d06e]" />
        <p className="mt-5 font-body text-[10px] uppercase tracking-[0.46em] text-[#d4af37]/55">Private pre-launch memorial</p>
        <h1 className="mt-4 font-display text-4xl leading-tight text-[#fff7df] md:text-6xl">Mum&apos;s Garden is closed for family review.</h1>
        <p className="mx-auto mt-5 max-w-xl font-body text-sm leading-7 text-[#fff7df]/62">
          This page is ready to inspect, but it is intentionally kept behind a private preview code until Gannon approves it for launch.
        </p>

        <form onSubmit={submit} className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row">
          <input
            value={code}
            onChange={(event) => setCode(event.target.value)}
            placeholder="Enter preview code"
            className="min-h-[48px] flex-1 rounded-full border border-[#d4af37]/20 bg-black/32 px-5 font-body text-sm text-[#fff7df] outline-none placeholder:text-[#fff7df]/34 focus:border-[#f5d06e]/60"
          />
          <button
            type="submit"
            className="rounded-full bg-[#f5d06e] px-6 py-3 font-body text-[10px] font-bold uppercase tracking-[0.24em] text-[#071007] transition hover:-translate-y-0.5"
          >
            Unlock
          </button>
        </form>
        {error && <p className="mt-3 font-body text-xs text-amber-300">{error}</p>}

        <div className="mt-8 rounded-[1.4rem] border border-[#d4af37]/14 bg-black/22 p-4">
          <p className="font-body text-[9px] uppercase tracking-[0.34em] text-[#d4af37]/45">Family uploads stay open</p>
          <p className="mt-3 font-body text-sm leading-6 text-[#fff7df]/58">
            Family and friends can still send memories, photos, videos, voice notes, and eulogy pieces for Gannon to approve.
          </p>
          <a
            href={contributionPath}
            className="mt-4 inline-flex items-center justify-center gap-2 rounded-full border border-[#d4af37]/24 bg-[#fff7df]/[0.045] px-5 py-3 font-body text-[10px] font-bold uppercase tracking-[0.22em] text-[#f5d06e] transition hover:-translate-y-0.5"
          >
            <UploadCloud className="h-4 w-4" />
            Open family upload link
          </a>
        </div>
      </section>
    </main>
  );
}

function MemoryGuestbook() {
  const [form, setForm] = useState({
    name: '',
    relationship: '',
    contact: '',
    memoryTitle: '',
    memoryText: '',
    submissionType: 'story',
    consentToReview: false,
    consentToPublish: false,
    file: null,
  });
  const [status, setStatus] = useState('idle');

  const update = (field, value) => setForm((current) => ({ ...current, [field]: value }));

  const submitMemory = async (event) => {
    event.preventDefault();
    if (!form.name.trim() || !form.memoryText.trim() || !form.consentToReview) {
      setStatus('missing');
      return;
    }

    setStatus('saving');

    let fileUrl = '';
    let fileName = form.file?.name || '';

    try {
      if (form.file && base44?.integrations?.Core?.UploadFile) {
        const uploaded = await base44.integrations.Core.UploadFile({ file: form.file });
        fileUrl = uploaded?.file_url || uploaded?.url || uploaded?.data?.file_url || '';
      }
    } catch (error) {
      console.warn('Memory file upload will need review', error);
    }

    const submission = {
      submitter_name: form.name.trim(),
      relationship_to_sonia: form.relationship.trim(),
      contact: form.contact.trim(),
      memory_title: form.memoryTitle.trim(),
      memory_text: form.memoryText.trim(),
      submission_type: form.submissionType,
      consent_to_review: form.consentToReview,
      consent_to_publish_if_approved: form.consentToPublish,
      approval_status: 'pending',
      is_public: false,
      source_page: typeof window !== 'undefined' ? window.location.pathname : 'mum',
      submitted_at: new Date().toISOString(),
    };

    if (fileUrl) submission.file_url = fileUrl;
    if (fileName) submission.file_name = fileName;

    try {
      await base44.entities.SoniaMemorySubmission.create(submission);
    } catch {
      const saved = JSON.parse(localStorage.getItem(GUESTBOOK_STORAGE_KEY) || '[]');
      localStorage.setItem(
        GUESTBOOK_STORAGE_KEY,
        JSON.stringify([{ ...submission, id: crypto?.randomUUID?.() || String(Date.now()) }, ...saved])
      );
    }

    const localReviewQueue = JSON.parse(localStorage.getItem(FAMILY_UPLOAD_STORAGE_KEY) || '[]');
    localStorage.setItem(
      FAMILY_UPLOAD_STORAGE_KEY,
      JSON.stringify([
        {
          id: crypto?.randomUUID?.() || String(Date.now()),
          name: submission.submitter_name,
          relationship: submission.relationship_to_sonia,
          contact: submission.contact,
          uploadType: submission.submission_type,
          memoryTitle: submission.memory_title,
          memory: submission.memory_text,
          fileName: submission.file_name,
          status: 'pending',
          createdAt: submission.submitted_at,
          source: 'Mum Garden guestbook',
        },
        ...localReviewQueue,
      ])
    );

    setStatus('saved');
    setForm({
      name: '',
      relationship: '',
      contact: '',
      memoryTitle: '',
      memoryText: '',
      submissionType: 'story',
      consentToReview: false,
      consentToPublish: false,
      file: null,
    });
  };

  return (
    <div className="mx-auto mt-14 max-w-5xl px-5">
      <div className="grid gap-5 lg:grid-cols-[0.88fr_1.12fr]">
        <motion.div
          className="relative overflow-hidden rounded-[2rem] border border-[#d4af37]/16 bg-[#071007]/72 p-6 shadow-[0_26px_90px_rgba(0,0,0,0.35)] backdrop-blur-md md:p-8"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <div className="absolute -right-16 -top-16 h-44 w-44 rounded-full bg-[#f5d06e]/10 blur-3xl" />
          <ShieldCheck className="h-8 w-8 text-[#f5d06e]/60" />
          <h3 className="mt-5 font-display text-4xl leading-tight text-[#fff7df]">Share your own memory of Sonia.</h3>
          <p className="mt-5 font-body text-sm leading-7 text-[#fff7df]/58">
            Friends and family can send a story, photo, video, voice note, or a small message about how Sonia blessed their life.
          </p>
          <p className="mt-5 rounded-[1.2rem] border border-[#d4af37]/12 bg-[#f5d06e]/[0.055] p-4 font-body text-sm leading-6 text-[#fff7df]/58">
            Nothing appears on the page automatically. Every submission stays private until Gannon reviews and approves it.
          </p>
        </motion.div>

        <motion.form
          onSubmit={submitMemory}
          className="rounded-[2rem] border border-[#d4af37]/16 bg-[#071007]/78 p-5 shadow-[0_26px_90px_rgba(0,0,0,0.35)] backdrop-blur-md md:p-7"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.06 }}
        >
          <div className="grid gap-3 sm:grid-cols-2">
            <input className="rounded-full border border-[#d4af37]/14 bg-[#071007]/80 px-4 py-3 font-body text-sm text-[#fff7df] outline-none placeholder:text-[#fff7df]/28 focus:border-[#d4af37]/38" placeholder="Your name" value={form.name} onChange={(event) => update('name', event.target.value)} />
            <input className="rounded-full border border-[#d4af37]/14 bg-[#071007]/80 px-4 py-3 font-body text-sm text-[#fff7df] outline-none placeholder:text-[#fff7df]/28 focus:border-[#d4af37]/38" placeholder="Relationship to Sonia" value={form.relationship} onChange={(event) => update('relationship', event.target.value)} />
            <input className="rounded-full border border-[#d4af37]/14 bg-[#071007]/80 px-4 py-3 font-body text-sm text-[#fff7df] outline-none placeholder:text-[#fff7df]/28 focus:border-[#d4af37]/38" placeholder="Email or phone, optional" value={form.contact} onChange={(event) => update('contact', event.target.value)} />
            <select className="rounded-full border border-[#d4af37]/14 bg-[#071007]/80 px-4 py-3 font-body text-sm text-[#fff7df] outline-none focus:border-[#d4af37]/38" value={form.submissionType} onChange={(event) => update('submissionType', event.target.value)}>
              <option value="story">Story</option>
              <option value="photo">Photo</option>
              <option value="video">Video</option>
              <option value="voice_note">Voice note</option>
              <option value="eulogy">Eulogy / speech</option>
              <option value="other">Other</option>
            </select>
          </div>

          <input className="mt-3 w-full rounded-full border border-[#d4af37]/14 bg-[#071007]/80 px-4 py-3 font-body text-sm text-[#fff7df] outline-none placeholder:text-[#fff7df]/28 focus:border-[#d4af37]/38" placeholder="Memory title" value={form.memoryTitle} onChange={(event) => update('memoryTitle', event.target.value)} />
          <textarea className="mt-3 min-h-[150px] w-full rounded-[1.4rem] border border-[#d4af37]/14 bg-[#071007]/80 px-4 py-4 font-body text-sm leading-6 text-[#fff7df] outline-none placeholder:text-[#fff7df]/28 focus:border-[#d4af37]/38" placeholder="Write your memory of Sonia..." value={form.memoryText} onChange={(event) => update('memoryText', event.target.value)} />

          <label className="mt-3 flex cursor-pointer items-center gap-3 rounded-[1.25rem] border border-dashed border-[#d4af37]/18 bg-[#fff7df]/[0.04] p-4 font-body text-sm text-[#fff7df]/56">
            <UploadCloud className="h-5 w-5 text-[#f5d06e]/62" />
            <span>{form.file ? form.file.name : 'Attach a photo, video, audio file, or document'}</span>
            <input type="file" className="hidden" onChange={(event) => update('file', event.target.files?.[0] || null)} />
          </label>

          <div className="mt-4 space-y-3 font-body text-xs leading-5 text-[#fff7df]/52">
            <label className="flex items-start gap-3">
              <input type="checkbox" className="mt-1" checked={form.consentToReview} onChange={(event) => update('consentToReview', event.target.checked)} />
              I consent to Gannon reviewing this memory for Sonia’s tribute archive.
            </label>
            <label className="flex items-start gap-3">
              <input type="checkbox" className="mt-1" checked={form.consentToPublish} onChange={(event) => update('consentToPublish', event.target.checked)} />
              If Gannon approves it, I consent to this memory being displayed on Sonia’s memorial page.
            </label>
          </div>

          {status === 'missing' && <p className="mt-4 font-body text-xs text-amber-300">Please add your name, a memory, and review consent.</p>}
          {status === 'saved' && <p className="mt-4 font-body text-xs text-emerald-300">Thank you. Your memory has been saved for Gannon to review.</p>}

          <button
            type="submit"
            disabled={status === 'saving'}
            className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#f5d06e] px-6 py-3 font-body text-[11px] font-bold uppercase tracking-[0.24em] text-[#071007] transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Send className="h-4 w-4" />
            {status === 'saving' ? 'Saving for review...' : 'Submit memory for review'}
          </button>
        </motion.form>
      </div>
    </div>
  );
}

function ServiceCardSection() {
  return (
    <div className="mx-auto mt-14 max-w-6xl px-5">
      <motion.div
        className="rounded-[2rem] border border-[#d4af37]/16 bg-[#071007]/72 p-5 shadow-[0_26px_90px_rgba(0,0,0,0.35)] backdrop-blur-md md:p-7"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, delay: 0.08 }}
      >
        <p className="font-body text-[10px] uppercase tracking-[0.42em] text-[#d4af37]/52">From the service card</p>
        <h3 className="mt-4 font-display text-4xl leading-tight text-[#fff7df] md:text-5xl">
          The facts are kept. The funeral feeling is softened.
        </h3>
        <p className="mt-5 font-body text-sm leading-7 text-[#fff7df]/58">
          The original service card and newspaper notice are preserved in the private source archive, but the public page uses garden cards and respectful copy instead of showing document scans. This keeps the launch page warm, living, and song-led.
        </p>

        <div className="mt-7 grid gap-4 sm:grid-cols-2">
          {MEMORIAL_TEXT_CARDS.map((card) => (
            <div key={card.title} className="rounded-[1.25rem] border border-[#d4af37]/12 bg-[#fff7df]/[0.055] p-4">
              <p className="font-body text-[9px] uppercase tracking-[0.28em] text-[#d4af37]/48">{card.eyebrow}</p>
              <p className="mt-2 font-display text-xl text-[#fff7df]">{card.title}</p>
              <p className="mt-3 font-body text-sm leading-6 text-[#fff7df]/62">{card.body}</p>
            </div>
          ))}
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {SERVICE_CARD_QUOTES.map((quote) => (
            <div key={quote.title} className="rounded-[1.1rem] border border-[#d4af37]/10 bg-black/18 p-4">
              <p className="font-body text-[8px] uppercase tracking-[0.26em] text-[#d4af37]/40">{quote.source}</p>
              <p className="mt-2 font-body text-sm leading-6 text-[#fff7df]/56">{quote.text}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

function KeepsakeBridge({ onOpen }) {
  return (
    <div className="mx-auto mt-14 grid max-w-5xl gap-5 px-5 md:grid-cols-4">
      {KEEPSAKES.map((item, index) => (
        <motion.button
          key={item.title}
          onClick={() => onOpen(item)}
          className="group min-h-[230px] rounded-[1.5rem] border border-[#d4af37]/16 bg-[#071007]/68 p-5 text-left shadow-[0_22px_70px_rgba(0,0,0,0.32)] backdrop-blur-md transition hover:-translate-y-1 hover:border-[#d4af37]/34"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.65, delay: index * 0.05 }}
        >
          <div className="mb-8 flex h-12 w-12 items-center justify-center rounded-full bg-[#f5d06e]/12 text-[#f5d06e]">
            <ShoppingBag className="h-5 w-5" />
          </div>
          <p className="font-display text-xl text-[#fff7df]">{item.title}</p>
          <p className="mt-3 font-body text-sm leading-6 text-[#fff7df]/52">{item.note}</p>
        </motion.button>
      ))}
    </div>
  );
}


function Drawer({ drawer, onClose }) {
  if (!drawer) return null;

  const content = (() => {
    if (drawer.type === 'photo') {
      const source = drawer.data.source || 'Family memory archive';
      const title = drawer.data.label || 'Original memory image';
      const caption = drawer.data.caption || 'Held for Gannon and family approval before public use.';

      return (
        <div className="grid gap-5 md:grid-cols-[0.9fr_1.1fr]">
          <div className="overflow-hidden rounded-[1.4rem] border border-[#d4af37]/14 bg-black/28">
            <img src={drawer.data.src} alt={title} className="max-h-[64vh] w-full object-contain" />
          </div>
          <div>
            <p className="font-body text-[10px] uppercase tracking-[0.38em] text-[#d4af37]/52">{source}</p>
            <h3 className="mt-3 font-display text-4xl text-[#fff7df]">{title}</h3>
            <p className="mt-4 font-body text-base leading-8 text-[#fff7df]/64">{caption}</p>
            <p className="mt-8 rounded-2xl border border-[#d4af37]/14 bg-[#f5d06e]/8 p-4 font-body text-sm leading-6 text-[#fff7df]/56">
              This slot uses the exact original uploaded image. No people are generated, swapped, redrawn, or replaced.
            </p>
          </div>
        </div>
      );
    }

    if (drawer.type === 'lyric') {
      return (
        <div>
          <p className="font-body text-[10px] uppercase tracking-[0.38em] text-[#d4af37]/52">{drawer.data.kicker} · Without You Here</p>
          <h3 className="mt-3 font-display text-4xl text-[#fff7df]">{drawer.data.title}</h3>
          <div className="mt-6 rounded-[1.4rem] border border-[#d4af37]/16 bg-[#fff7df]/[0.06] p-6">
            <p className="font-display text-3xl italic leading-snug text-[#fff7df]/90">“{drawer.data.line}”</p>
            <p className="mt-5 font-body text-xs uppercase tracking-[0.28em] text-[#d4af37]/48">Source · Gannon Waye lyric</p>
          </div>
        </div>
      );
    }

    if (drawer.type === 'comfort') {
      return (
        <div className="grid gap-5 md:grid-cols-[0.85fr_1.15fr]">
          <div
            className="min-h-[260px] rounded-[1.4rem]"
            style={{
              backgroundImage: `linear-gradient(180deg, rgba(3,8,4,0.2), rgba(3,8,4,0.82)), url(${GARDEN_WISDOM})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
          <div>
            <p className="font-body text-[10px] uppercase tracking-[0.38em] text-[#d4af37]/52">Comfort garden</p>
            <h3 className="mt-3 font-display text-4xl text-[#fff7df]">When you miss her most</h3>
            <p className="mt-5 font-body text-base leading-8 text-[#fff7df]/64">
              Step away from the noise for a moment: candlelight, coffee, a quiet lyric, and words held from the family story.
            </p>
            <p className="mt-5 font-body text-sm leading-6 text-[#fff7df]/46">
              It honours Sonia’s memory; it does not pretend to be Sonia.
            </p>
          </div>
        </div>
      );
    }

    return (
      <div>
        <p className="font-body text-[10px] uppercase tracking-[0.38em] text-[#d4af37]/52">Gentle keepsake bridge</p>
        <h3 className="mt-3 font-display text-4xl text-[#fff7df]">{drawer.data.title}</h3>
        <p className="mt-5 font-body text-base leading-8 text-[#fff7df]/64">{drawer.data.note}</p>
        <div className="mt-8 rounded-[1.4rem] border border-[#d4af37]/16 bg-[#fff7df]/[0.06] p-5">
          <p className="font-body text-sm leading-6 text-[#fff7df]/56">
            Keepsakes appear only after the story and song have had room to land: carrying a memory, not being sold to.
          </p>
        </div>
      </div>
    );
  })();

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/62 p-3 backdrop-blur-sm md:p-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="relative max-h-[86vh] w-full max-w-[980px] overflow-y-auto rounded-[2rem] border border-[#d4af37]/18 bg-[#071007]/95 p-5 shadow-[0_30px_120px_rgba(0,0,0,0.68)] backdrop-blur-xl md:p-8"
          initial={{ opacity: 0, scale: 0.94, y: 24 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 18 }}
          transition={{ type: 'spring', damping: 28, stiffness: 260 }}
          onClick={(event) => event.stopPropagation()}
        >
          <button
            onClick={onClose}
            className="absolute right-5 top-5 flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-[#fff7df]/72 transition hover:bg-white/10"
            aria-label="Close drawer"
          >
            <X className="h-4 w-4" />
          </button>
          <div className="pr-12">{content}</div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default function MumTribute() {
  const [drawer, setDrawer] = useState(null);
  const [unlocked, setUnlocked] = useState(() => {
    if (typeof window === 'undefined') return false;
    const isAdminRoute = window.location.pathname.startsWith('/admin/');
    const storedUnlock = window.sessionStorage.getItem(MUM_GARDEN_ACCESS_KEY) === 'true';
    const accessCode = new URLSearchParams(window.location.search).get('access') || '';
    return isAdminRoute || storedUnlock || accessCode.toLowerCase() === MUM_GARDEN_PASSCODE;
  });

  const openDrawer = (type, data = {}) => setDrawer({ type, data });

  useEffect(() => {
    if (typeof document === 'undefined' || typeof window === 'undefined') return;
    const title = 'Mum’s Garden | Sonia Waye Memorial | Gannon Waye Music';
    const description = 'A private pre-launch memorial garden for Sonia Waye: photos, memories, music, family contributions, and Gannon Waye’s Without You Here.';
    const image = `${window.location.origin}${WITHOUT_YOU_HERE_COVER}`;
    const url = `${window.location.origin}/mum`;

    document.title = title;
    setMetaTag('meta[name="description"]', { name: 'description', content: description });
    setMetaTag('meta[property="og:title"]', { property: 'og:title', content: title });
    setMetaTag('meta[property="og:description"]', { property: 'og:description', content: description });
    setMetaTag('meta[property="og:type"]', { property: 'og:type', content: 'website' });
    setMetaTag('meta[property="og:url"]', { property: 'og:url', content: url });
    setMetaTag('meta[property="og:image"]', { property: 'og:image', content: image });
    setMetaTag('meta[name="twitter:card"]', { name: 'twitter:card', content: 'summary_large_image' });
    setMetaTag('meta[name="twitter:title"]', { name: 'twitter:title', content: title });
    setMetaTag('meta[name="twitter:description"]', { name: 'twitter:description', content: description });
    setMetaTag('meta[name="twitter:image"]', { name: 'twitter:image', content: image });
    setLinkTag('link[rel="canonical"]', { rel: 'canonical', href: url });
  }, []);

  useEffect(() => {
    if (!unlocked || typeof window === 'undefined') return;
    window.sessionStorage.setItem(MUM_GARDEN_ACCESS_KEY, 'true');
  }, [unlocked]);

  if (!unlocked) {
    return <MumPrivateGate onUnlock={() => setUnlocked(true)} />;
  }

  return (
    <main className="relative overflow-x-hidden bg-[#020502] pb-24 text-[#fff7df]">
      <StickyListenBar onLyrics={() => openDrawer('lyric', LYRIC_MOMENTS[0])} />
      <SkyToGardenPrologue
        onEnterGarden={() => document.getElementById('world')?.scrollIntoView({ behavior: 'smooth' })}
        onOpenLyrics={() => document.getElementById('lyrics')?.scrollIntoView({ behavior: 'smooth' })}
        onOpenPhoto={() => openDrawer('photo', REAL_PHOTOS[0])}
      />

      <div className="relative z-20 -mt-[28vh]">
        <GardenWorld id="world" image={GARDEN_HERO} brightness={0.52} minHeight="auto" align="center 45%">
          <div className="py-24 md:py-32">
            <SectionHeading eyebrow="The garden world" title="Real backyard, made sacred.">
              <p>
                A more immaculate, luminous version of the world that still feels like her: robe, coffee, chair, leaves, light, lyrics, and exact family images.
              </p>
            </SectionHeading>
            <LuxuryObjectScene onComfort={() => openDrawer('comfort')} />
          </div>
        </GardenWorld>
      </div>

      <GardenWorld id="service-card" image={GARDEN_MUSIC} brightness={0.46} minHeight="auto">
        <div className="py-24 md:py-32">
          <SectionHeading eyebrow="Her life remembered" title="The service card, held gently.">
            <p>
              The service card and newspaper tribute are held softly here as memory anchors, with the weight lifted into warmth, garden light, and love.
            </p>
          </SectionHeading>
          <ServiceCardSection />
        </div>
      </GardenWorld>

      <GardenWorld id="lyrics" image={GARDEN_WISDOM} brightness={0.48} minHeight="auto">
        <div className="py-24 md:py-32">
          <SectionHeading eyebrow="Without You Here" title="Lyrics as the path through the garden.">
            <p>
              The lyrics become lanterns in the page, guiding visitors through the garden without breaking the feeling of the walk.
            </p>
          </SectionHeading>
          <WithoutYouHereCoverFeature />
          <LyricLanterns onOpen={(moment) => openDrawer('lyric', moment)} />
        </div>
      </GardenWorld>

      <GardenWorld id="songs-for-sonia" image={GARDEN_MUSIC} brightness={0.48} minHeight="auto">
        <div className="py-24 md:py-32">
          <SectionHeading eyebrow="Songs sung for Sonia" title="Ave Maria and Amazing Grace.">
            <p>
              These play options give visitors a real emotional bridge: Gannon’s voice, Sonia’s memory, and the promise kept.
            </p>
          </SectionHeading>
          <div className="mt-14">
            <SoniaAmbientPlayer />
          </div>
          <SoniaVoiceNotes />
        </div>
      </GardenWorld>

      <GardenWorld id="photos" image={GARDEN_GALLERY} brightness={0.54} minHeight="auto">
        <div className="py-24 md:py-32">
          <SectionHeading eyebrow="Memory gallery" title="Exact photos, placed beautifully.">
            <p>
              Every family photo stays true to the original. Images are framed gently, with real people and real memories left intact.
            </p>
          </SectionHeading>
          <PhotoGarden onOpen={(photo) => openDrawer('photo', photo)} />
          <TattooScrapbook onOpen={(photo) => openDrawer('photo', photo)} />
          <CapturedSlideshow onOpen={(photo) => openDrawer('photo', photo)} />
        </div>
      </GardenWorld>

      <GardenWorld id="sonia-guide" image={GARDEN_WISDOM} brightness={0.46} minHeight="auto">
        <div className="py-24 md:py-32">
          <SectionHeading eyebrow="Sonia’s Memory Presence" title="No fake Mum. Just her, held beautifully.">
            <p>
              This section uses exact Sonia imagery and original voice notes only. No strange avatar crop, no generated replacement person, and no pretending technology can replace her.
            </p>
          </SectionHeading>
          <SoniaLifelikeAvatar
            onComfort={() => openDrawer('comfort')}
            onVoice={() => document.getElementById('sonia-voice-notes')?.scrollIntoView({ behavior: 'smooth', block: 'center' })}
          />
          <SoniaHeyGenReadiness
            onVoice={() => document.getElementById('sonia-voice-notes')?.scrollIntoView({ behavior: 'smooth', block: 'center' })}
          />
        </div>
      </GardenWorld>

      <GardenWorld id="comfort" image={GARDEN_MUSIC} brightness={0.46} minHeight="auto">
        <div className="mx-auto max-w-5xl px-5 py-24 text-center md:py-32">
          <SectionHeading eyebrow="Comfort room" title="A quiet place when they miss her.">
            <p>
              A quiet garden room for grief, comfort, music, and honest remembrance — inspired by Sonia, never pretending to replace her.
            </p>
          </SectionHeading>
          <div className="mt-12">
            <GoldButton onClick={() => openDrawer('comfort')} icon={Coffee}>
              Open the quiet room
            </GoldButton>
          </div>
        </div>
      </GardenWorld>

      <GardenWorld id="guestbook" image={GARDEN_WISDOM} brightness={0.48} minHeight="auto">
        <div className="py-24 md:py-32">
          <SectionHeading eyebrow="Sonia’s guestbook" title="Let others tell the world how she blessed them.">
            <p>
              Visitors can submit their own memories, photos, videos, voice notes, eulogies, or stories. Everything goes to review first.
            </p>
          </SectionHeading>
          <FamilyContributionAccess />
          <MemoryGuestbook />
        </div>
      </GardenWorld>

      <GardenWorld id="keepsakes" image={GARDEN_HERO} brightness={0.50} minHeight="auto">
        <div className="py-24 md:py-32">
          <SectionHeading eyebrow="Carry the memory" title="A gentle bridge into keepsakes.">
            <p>
              Keepsakes sit near the end of the journey, after the visitor has felt the garden and the song. The tone stays memory-first.
            </p>
          </SectionHeading>
          <KeepsakeBridge onOpen={(item) => openDrawer('keepsake', item)} />
        </div>
      </GardenWorld>

      <GardenWorld id="close" image={GARDEN_MUSIC} brightness={0.58} minHeight="64vh">
        <div className="flex min-h-[64vh] items-center justify-center px-5 py-24 text-center">
          <div className="max-w-2xl">
            <Heart className="mx-auto mb-6 h-5 w-5 text-[#d4af37]/50" fill="rgba(212,175,55,0.18)" />
            <p className="font-display text-4xl italic leading-tight text-[#fff7df]/88 md:text-6xl">
              She is still here — in the garden, in the music, in us.
            </p>
            <div className="mt-9 flex justify-center">
              <GoldButton onClick={() => openDrawer('lyric', LYRIC_MOMENTS[0])} icon={BookOpen}>
                Return to the song
              </GoldButton>
            </div>
          </div>
        </div>
      </GardenWorld>

      <Drawer drawer={drawer} onClose={() => setDrawer(null)} />
    </main>
  );
}
