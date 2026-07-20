import React, { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useScroll, useTransform } from 'framer-motion';
import {
  ArrowRight,
  BookOpen,
  ChevronDown,
  Clock3,
  Coffee,
  Heart,
  LockKeyhole,
  Music2,
  Pause,
  Play,
  Send,
  ShieldCheck,
  ShoppingBag,
  Sprout,
  UploadCloud,
  Volume2,
  VolumeX,
  X,
} from 'lucide-react';
import { base44 } from '@/api/base44Client';
import SoniaAmbientPlayer from '@/components/mum/SoniaAmbientPlayer';
import SoniaLifelikeAvatar from '@/components/mum/SoniaLifelikeAvatar';
import SoniaHeyGenReadiness from '@/components/mum/SoniaHeyGenReadiness';
import { useSongFeedback } from '@/components/global/SongFeedbackGate';
import { WITHOUT_YOU_HERE_COVER, WITHOUT_YOU_HERE_PREVIEW } from '@/constants/musicAssets';

// Approved direction:
// - one continuous scroll page
// - immersive real-feeling Australian backyard garden
// - pop-up drawers for deeper moments
// - opening uses approved memorial tribute artwork of Sonia in the sky
// - family photos are presented as exact original images only

const SKY_ANGEL_HERO = '/images/mum/sonia_sky_angel_hero.png';
const GARDEN_HERO = 'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/b7806166d_generated_image.png';
const GARDEN_GALLERY = 'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/6591fa60b_generated_image.png';
const GARDEN_MUSIC = 'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/63f84cf4f_generated_image.png';
const GARDEN_WISDOM = 'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/fc387c2b6_generated_image.png';
const SONIA_GARDEN_PHOTO = '/images/mum/memory-lane/ML058_FS116.jpg';
const SONIA_LOVE_PHOTO = '/images/mum/memory-lane/ML061_FS120.jpg';
const AVE_MARIA_GANNON = 'https://media.base44.com/files/public/69eb7905ca6eb4180010f794/6e65f5e12_AveMariaGannonSinging.mp3';
const MEMORY_UPLOAD_PATH = '/remember-mum?invite=family';

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
    source: 'Private family record',
    text: 'Sonia Katisa Waye. 5 February 1961 to 27 April 2022. Aged 61.',
  },
  {
    title: 'Family was her centre',
    source: 'Family remembrance',
    text: 'Totally devoted to family and forever loved by all.',
  },
  {
    title: 'Still our guide',
    source: 'Family poem',
    text: 'Your love is still our guide.',
  },
  {
    title: 'A grateful goodbye',
    source: 'Family thank-you',
    text: "Thank you for celebrating Sonia's life with us.",
  },
];

const MEMORIAL_TEXT_CARDS = [
  {
    eyebrow: 'Life record',
    title: 'Sonia Katisa Waye',
    body: '5 February 1961 to 27 April 2022. Aged 61.',
  },
  {
    eyebrow: 'Home',
    title: 'Peacefully, with family beside her',
    body: 'The private family record remembers Sonia peacefully at home, with her man and children by her side.',
  },
  {
    eyebrow: 'Family',
    title: 'Mother to Carla, Gannon, Jarrad and Crystal',
    body: "Forever loved by all: a mother, soulmate, Nanny, and the centre of so many people's world.",
  },
  {
    eyebrow: 'Nanny',
    title: 'Devoted Nanny to all her grandchildren',
    body: 'Their names are held privately while the page honours the love she gave them all.',
  },
  {
    eyebrow: 'Public tribute',
    title: 'Forever cherished',
    body: 'The public tribute closes with the words: "Forever cherished and in our hearts."',
  },
];

const TATTOO_SCRAPBOOK_PHOTOS = [
  {
    src: 'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/7df2f998b_A181BD35-93F3-41FB-B671-2FABC71B701A.jpg',
    label: 'Tattoo scrapbook memory',
    caption: 'A carrying-her-with-me image. Keep tattoo memories together as one scrapbook moment.',
    source: 'Family tattoo memory',
  },
];

const YOUNGER_YEARS_PHOTOS = [
  {
    src: '/images/mum/memory-lane/ML001_FS006.jpg',
    label: 'Little Sonia',
    caption: 'An early family photo, kept soft and clear as the opening note for her younger-years tribute.',
    source: 'Younger years family archive',
    objectPosition: 'center',
  },
  {
    src: '/images/mum/memory-lane/ML005_FS010.jpg',
    label: 'Young Sonia in the sun',
    caption: 'A younger memory given a gentler frame and light enhancement, without changing who is in the photo.',
    source: 'Younger years family archive',
    objectPosition: 'center 34%',
  },
  {
    src: '/images/mum/memory-lane/ML007_FS013.jpg',
    label: 'That look, that spark',
    caption: 'One of the clearer older images: personality first, archive noise softened.',
    source: 'Younger years family archive',
    objectPosition: 'center 34%',
  },
];

const FAVOURITE_MOMENTS = [
  {
    title: 'Her children',
    note: 'Carla, Gannon, Jarrad and Crystal were the centre of her world.',
    detail: 'This should become one of the strongest emotional feature pieces: not a generic family note, but the truth of what mattered most to her.',
  },
  {
    title: 'Gold jewellery',
    note: 'A little shine, a little glamour, and the kind of detail that felt like her.',
    detail: 'The space is ready for a real approved photo or cutout. No fake jewellery image should be invented for the public page.',
  },
  {
    title: 'Coffee in the garden',
    note: 'Morning comfort, familiar warmth, and the everyday ritual that still feels like home.',
    detail: 'This links the garden, the robe, the chair, and the feeling of visiting her world.',
  },
  {
    title: 'Flowers and colour',
    note: 'Colour, care, and the living softness that belongs in the garden around her.',
    detail: 'Use this as a visual pause between heavier story moments.',
  },
  {
    title: 'The song for Mum',
    note: 'The cover artwork and lyric path sit close to the start, where visitors first enter her world.',
    detail: 'Without You Here is the emotional spine of the page, not background decoration.',
  },
];

const CLEAN_GALLERY_MANIFEST = '/images/mum/memory-lane/_clean_public_gallery_manifest.json';

const USER_REMOVED_MEMORY_SOURCE_IDS = new Set([
  'FS001',
  'FS002',
  'FS003',
  'FS004',
  'FS005',
  'FS008',
  'FS011',
  'FS014',
  'FS016',
]);

const FEATURED_TOP_MEMORY_SOURCE_IDS = new Set(['FS116', 'FS117', 'FS120', 'FS121']);

function memoryLaneSourceId(photo) {
  const value = [photo?.sourceId, photo?.id, photo?.src].filter(Boolean).join(' ');
  const match = value.match(/FS\d{3}/i);
  return match ? match[0].toUpperCase() : '';
}

function memoryLaneId(photo) {
  const value = [photo?.memoryLaneId, photo?.id, photo?.src].filter(Boolean).join(' ');
  const match = value.match(/ML\d{3}/i);
  return match ? match[0].toUpperCase() : '';
}

function isPublicMemoryLanePhoto(photo) {
  const sourceId = memoryLaneSourceId(photo);
  return !sourceId || !USER_REMOVED_MEMORY_SOURCE_IDS.has(sourceId);
}

function isFeaturedTopMemoryPhoto(photo) {
  const sourceId = memoryLaneSourceId(photo);
  const laneId = memoryLaneId(photo);
  return FEATURED_TOP_MEMORY_SOURCE_IDS.has(sourceId) || ['ML058', 'ML059', 'ML061', 'ML062'].includes(laneId);
}

function memoryLaneOrder(photo, index) {
  const value = [photo?.id, photo?.sourceId, photo?.src].filter(Boolean).join(' ');
  const memoryMatch = value.match(/ML(\d{3})/i);
  const sourceMatch = value.match(/FS(\d{3})/i);
  if (memoryMatch) return Number(memoryMatch[1]);
  if (sourceMatch) return Number(sourceMatch[1]) + 1000;
  return index + 2000;
}

function sortMemoryLanePhotos(photos) {
  return [...photos].sort((a, b) => memoryLaneOrder(a, 0) - memoryLaneOrder(b, 0));
}

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

      <CoverArtGardenVeil />
      <LanternCandles />

      <div className="relative z-10">{children}</div>
    </section>
  );
}

function CoverArtGardenVeil() {
  return (
    <div className="pointer-events-none absolute inset-0 z-[1] overflow-hidden opacity-35">
      <motion.div
        className="absolute -left-28 top-[8%] h-[120%] w-40 rotate-[-13deg] rounded-full blur-[1px] md:w-56"
        style={{
          backgroundImage: `linear-gradient(180deg, rgba(245,208,110,0.48), rgba(245,208,110,0.08)), url(${WITHOUT_YOU_HERE_COVER})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          mixBlendMode: 'screen',
          maskImage: 'linear-gradient(180deg, transparent 0%, #000 18%, #000 80%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(180deg, transparent 0%, #000 18%, #000 80%, transparent 100%)',
        }}
        animate={{ y: [-18, 18, -18], opacity: [0.18, 0.34, 0.18] }}
        transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute -right-28 top-[34%] h-[105%] w-36 rotate-[12deg] rounded-full blur-[1px] md:w-52"
        style={{
          backgroundImage: `linear-gradient(180deg, rgba(245,208,110,0.36), rgba(245,208,110,0.05)), url(${WITHOUT_YOU_HERE_COVER})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          mixBlendMode: 'soft-light',
          maskImage: 'linear-gradient(180deg, transparent 0%, #000 20%, #000 82%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(180deg, transparent 0%, #000 20%, #000 82%, transparent 100%)',
        }}
        animate={{ y: [20, -16, 20], opacity: [0.14, 0.28, 0.14] }}
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
      />
    </div>
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

function WithoutYouHerePreviewPlayer({ onLyrics, variant = 'hero' }) {
  const wide = variant === 'wide';
  const hero = variant === 'hero';
  const audioRef = useRef(null);
  const { requestSongFeedback } = useSongFeedback();
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  const playPreview = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (audio.currentTime >= (audio.duration || 49) - 0.25) {
      audio.currentTime = 0;
      setProgress(0);
    }

    audio.muted = false;
    await audio.play();
    setPlaying(true);
  }, []);

  const togglePreview = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (!audio.paused) {
      audio.pause();
      setPlaying(false);
      return;
    }

    await requestSongFeedback({
      songTitle: 'Without You Here',
      artist: 'Gannon Waye',
      source: `mum-${variant}-without-you-here-player`,
      onApproved: playPreview,
    });
  }, [playPreview, requestSongFeedback, variant]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return undefined;

    const handleTimeUpdate = () => {
      const duration = audio.duration || 49;
      setProgress(Math.min((audio.currentTime / duration) * 100, 100));
    };
    const handlePlay = () => setPlaying(true);
    const handlePause = () => setPlaying(false);
    const handleEnded = () => {
      setPlaying(false);
      audio.currentTime = 0;
      setProgress(0);
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('ended', handleEnded);
    };
  }, []);

  return (
    <div
      className={
        wide
          ? 'mt-8 flex w-full flex-col gap-4 rounded-[1.6rem] border border-[#f5d06e]/20 bg-[#020502]/42 p-4 shadow-[0_22px_70px_rgba(0,0,0,0.34)] backdrop-blur-sm md:flex-row md:items-center md:p-5'
          : 'flex min-h-[360px] w-full max-w-[330px] flex-col justify-between rounded-[1.8rem] border border-[#f5d06e]/24 bg-[#020502]/46 p-5 text-left shadow-[0_28px_86px_rgba(0,0,0,0.34)] backdrop-blur-sm'
      }
      data-song-feedback-exempt="true"
    >
      <audio
        ref={audioRef}
        src={WITHOUT_YOU_HERE_PREVIEW}
        preload="metadata"
        data-song-title="Without You Here"
        data-song-artist="Gannon Waye"
        data-song-feedback-source={`mum-${variant}-without-you-here-audio`}
        data-song-feedback-exempt="true"
      />
      <div className={wide ? 'flex items-center gap-4 md:w-[27%]' : 'flex flex-col gap-4'}>
        <div
          className={
            wide
              ? 'relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-[#f5d06e]/42 shadow-[0_0_34px_rgba(212,175,55,0.26)]'
              : 'relative h-36 w-36 shrink-0 overflow-hidden rounded-2xl border border-[#f5d06e]/42 shadow-[0_0_34px_rgba(212,175,55,0.26)]'
          }
        >
          <img
            src={WITHOUT_YOU_HERE_COVER}
            alt="Without You Here single artwork"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_28%,transparent,rgba(0,0,0,0.22)_70%)]" />
        </div>
        <div className="min-w-0">
          <p className="font-body text-[10px] uppercase tracking-[0.36em] text-[#f5d06e]/74 [text-shadow:0_0_16px_rgba(212,175,55,0.45)]">
            Written for her
          </p>
          <p className={`${hero ? 'max-w-[12rem] text-3xl leading-[0.96]' : 'text-2xl leading-none'} mt-1 font-display italic text-[#fff7df] [text-shadow:0_2px_18px_rgba(0,0,0,0.7),0_0_18px_rgba(212,175,55,0.28)]`}>
            Without You Here
          </p>
          <p className="mt-1 font-body text-[10px] uppercase tracking-[0.24em] text-[#fff7df]/58">
            Gannon Waye
          </p>
          <p className="mt-2 font-body text-[10px] uppercase tracking-[0.22em] text-[#f5d06e]/56">
            Internal preview - 3:46 to 4:35
          </p>
        </div>
      </div>

      <div className={wide ? 'min-w-0 flex-1' : 'mt-7'}>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={togglePreview}
            className={`${hero ? 'h-14 w-14' : 'h-12 w-12'} flex shrink-0 items-center justify-center rounded-full bg-[linear-gradient(135deg,#caa647,#f8dc82)] text-[#071007] shadow-[0_0_30px_rgba(212,175,55,0.34)] transition hover:-translate-y-0.5`}
            aria-label={playing ? 'Pause Without You Here preview' : 'Play Without You Here preview'}
            data-song-feedback-exempt="true"
          >
            {playing ? <Pause className="h-5 w-5 fill-current" /> : <Play className="h-5 w-5 fill-current" />}
          </button>
          <div className="min-w-0 flex-1">
            <div className="h-1.5 overflow-hidden rounded-full bg-[#f5d06e]/18">
              <div
                className="h-full rounded-full bg-[linear-gradient(90deg,#caa647,#f8dc82)] shadow-[0_0_18px_rgba(245,208,110,0.55)]"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="mt-2 flex justify-between font-body text-[10px] uppercase tracking-[0.18em] text-[#fff7df]/50">
              <span>3:46</span>
              <span>4:35</span>
            </div>
          </div>
          <Music2 className="hidden h-5 w-5 shrink-0 text-[#f5d06e]/58 md:block" />
        </div>
        {onLyrics && (
          <button
            type="button"
            onClick={onLyrics}
            className="mt-4 rounded-full border border-[#d4af37]/18 px-4 py-2 font-body text-[10px] uppercase tracking-[0.22em] text-[#f5d06e]/78 transition hover:bg-white/5"
          >
            Lyrics
          </button>
        )}
      </div>
    </div>
  );
}

function MumSkyFoyer({ onEnterGarden, onOpenLyrics }) {
  return (
    <section id="hero" className="relative min-h-screen overflow-hidden bg-[#020502]">
      <img
        src={SKY_ANGEL_HERO}
        alt="Memorial artwork of Sonia Waye held in a blue sky above soft clouds."
        className="absolute inset-0 h-full w-full object-cover object-[50%_24%]"
      />
      <motion.div
        className="absolute -left-[10%] bottom-[2%] h-56 w-[64%] rounded-full bg-white/36 blur-3xl"
        animate={{ x: [0, 24, 0], opacity: [0.32, 0.48, 0.32] }}
        transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute right-[-8%] top-[10%] h-64 w-[58%] rounded-full bg-[#ffe7b0]/24 blur-3xl"
        animate={{ x: [0, -22, 0], opacity: [0.28, 0.44, 0.28] }}
        transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }}
      />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,12,28,0.08)_0%,rgba(5,12,28,0.02)_32%,rgba(9,18,13,0.15)_64%,rgba(3,8,4,0.76)_100%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_22%,rgba(255,237,176,0.2),transparent_30%),linear-gradient(90deg,rgba(2,5,2,0.48),transparent_30%,transparent_64%,rgba(2,5,2,0.42))]" />

      <div className="relative z-10 flex min-h-screen flex-col px-5 pb-8 pt-24 text-[#fff7df] md:px-10 md:pt-24 lg:px-14">
        <p className="mx-auto max-w-6xl text-center font-body text-[10px] uppercase tracking-[0.66em] text-[#f5d06e]/88 [text-shadow:0_2px_12px_rgba(0,0,0,0.74),0_0_24px_rgba(212,175,55,0.68)] md:text-sm md:tracking-[0.86em]">
          A tribute to forever in our hearts
        </p>

        <div className="grid flex-1 gap-8 pt-7 md:grid-cols-[0.74fr_1.12fr_0.92fr] md:items-start md:pt-0">
          <blockquote className="max-w-[16rem] self-start pt-[6vh] font-display text-3xl italic leading-[1.18] text-[#fff2bd] [text-shadow:0_3px_16px_rgba(0,0,0,0.82),0_0_26px_rgba(212,175,55,0.4)] sm:text-4xl md:max-w-[18rem] md:pt-[16vh] md:text-5xl">
            <span className="block">"As long</span>
            <span className="block pt-2">as you</span>
            <span className="block pt-2">remember</span>
            <span className="block pt-2">me, my</span>
            <span className="block pt-2">memory</span>
            <span className="block pt-2">will live on."</span>
          </blockquote>

          <div className="self-start text-center md:pt-[20vh]">
            <p className="font-display text-2xl italic leading-none text-[#f5d06e]/92 [text-shadow:0_3px_14px_rgba(0,0,0,0.74),0_0_24px_rgba(212,175,55,0.58)] md:-translate-x-24 md:text-3xl">
              In Loving Memory of
            </p>
            <h1 className="mt-1 bg-gradient-to-b from-[#fff8dc] via-[#f5d06e] to-[#b98a2b] bg-clip-text font-display text-7xl leading-[0.82] text-transparent [filter:drop-shadow(0_4px_12px_rgba(0,0,0,0.72))_drop-shadow(0_0_26px_rgba(212,175,55,0.42))] sm:text-8xl md:text-9xl">
              Sonia
            </h1>
            <p className="mt-4 text-center font-body text-2xl text-[#fff2bd]/90 [text-shadow:0_3px_12px_rgba(0,0,0,0.76),0_0_18px_rgba(212,175,55,0.45)] md:translate-x-24 md:text-3xl">
              <span className="inline-block min-w-[17.2rem] text-left tracking-[0.26em]">
                Katisa Waye
              </span>
            </p>
            <p className="mt-5 text-center font-body text-xs text-[#f5d06e]/78 [text-shadow:0_3px_12px_rgba(0,0,0,0.76),0_0_16px_rgba(212,175,55,0.42)] md:translate-x-24 md:text-sm">
              <span className="inline-block min-w-[17.2rem] text-justify tracking-[0.62em] after:inline-block after:w-full after:content-['']">
                1961 - 2022
              </span>
            </p>
            <button
              type="button"
              onClick={onEnterGarden}
              className="mt-8 inline-flex items-center justify-center gap-3 rounded-full border border-[#ffe28a]/48 bg-[linear-gradient(135deg,#caa647,#f8dc82)] px-7 py-3 font-body text-[10px] font-bold uppercase tracking-[0.32em] text-[#071007] shadow-[0_0_36px_rgba(212,175,55,0.36),0_18px_50px_rgba(0,0,0,0.32)] transition hover:-translate-y-0.5 md:translate-x-8"
            >
              Enter Sonia's Garden
              <ChevronDown className="h-4 w-4" />
            </button>
          </div>

          <div className="hidden self-start justify-self-end pt-[15vh] md:block">
            <WithoutYouHerePreviewPlayer onLyrics={onOpenLyrics} />
          </div>
        </div>
      </div>
    </section>
  );
}

function SoniaGardenPresenceFeature() {
  return (
    <motion.div
      className="relative min-h-[420px] overflow-hidden rounded-[2rem] border border-[#d4af37]/18 bg-[#061006]/44 shadow-[0_28px_95px_rgba(0,0,0,0.38)]"
      initial={{ opacity: 0, x: 30 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: '-12%' }}
      transition={{ duration: 0.85 }}
    >
      <img
        src={GARDEN_HERO}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover"
        style={{ filter: 'brightness(0.72) saturate(1.05)' }}
      />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_24%_26%,rgba(245,208,110,0.24),transparent_30%),linear-gradient(90deg,rgba(4,10,4,0.28),rgba(4,10,4,0.12)_44%,rgba(4,10,4,0.74))]" />
      <motion.div
        className="absolute left-2 top-8 h-72 w-40 rounded-full bg-[#f5d06e]/18 blur-3xl"
        animate={{ opacity: [0.16, 0.34, 0.16], x: [0, 22, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
      />
      <div className="absolute -right-4 bottom-4 top-8 flex w-[72%] max-w-[520px] items-center justify-center pr-4">
        <div className="relative aspect-[4/5] w-full max-w-[360px]">
          <div className="absolute -inset-10 rounded-full bg-[radial-gradient(circle,rgba(255,237,178,0.32),rgba(212,175,55,0.12)_42%,transparent_68%)] blur-2xl" />
          <div className="absolute -left-10 top-8 h-52 w-28 rotate-12 rounded-full bg-[#fff2bd]/16 blur-2xl" />
          <div className="absolute -right-8 top-16 h-64 w-28 -rotate-12 rounded-full bg-[#f5d06e]/16 blur-2xl" />
          <div
            className="absolute -inset-3 bg-[linear-gradient(145deg,#6f4c12,#f7dc82_42%,#fff4bd_52%,#a9791f_78%,#4d350d)] shadow-[0_0_42px_rgba(245,208,110,0.28),0_30px_90px_rgba(0,0,0,0.52)]"
            style={{ borderRadius: '48% 48% 42% 42% / 56% 56% 38% 38%' }}
          />
          <div
            className="relative h-full w-full overflow-hidden border border-[#fff0ad]/45 bg-[#071007] shadow-[inset_0_0_32px_rgba(255,244,189,0.16)]"
            style={{ borderRadius: '48% 48% 42% 42% / 56% 56% 38% 38%' }}
          >
            <img
              src={SONIA_GARDEN_PHOTO}
              alt="Sonia memory portrait."
              className="h-full w-full object-cover object-center opacity-96"
              style={{ filter: 'brightness(1.05) contrast(1.04) saturate(1.02)' }}
            />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_48%_24%,transparent_30%,rgba(255,242,189,0.08)_48%,rgba(7,16,7,0.2)_70%,rgba(7,16,7,0.58)_100%)]" />
            <div className="absolute inset-x-8 top-6 h-px bg-gradient-to-r from-transparent via-[#fff2bd]/68 to-transparent" />
          </div>
          <div className="absolute -bottom-7 left-1/2 h-16 w-48 -translate-x-1/2 rounded-full bg-[#f5d06e]/18 blur-3xl" />
        </div>
      </div>
      <div className="absolute bottom-5 left-5 max-w-[17rem] rounded-[1.25rem] border border-[#d4af37]/18 bg-[#071007]/68 p-4 backdrop-blur-md">
        <p className="font-body text-[9px] uppercase tracking-[0.36em] text-[#d4af37]/62">She is here in the garden</p>
        <p className="mt-2 font-display text-2xl italic leading-tight text-[#fff7df] [text-shadow:0_3px_16px_rgba(0,0,0,0.82)]">
          A memory held close, right at the entrance to her garden.
        </p>
      </div>
    </motion.div>
  );
}

function SoniaGardenWelcome({ onOpenLyrics }) {
  return (
    <GardenWorld id="garden-entry" image={GARDEN_HERO} brightness={0.66} minHeight="100vh" align="center 45%">
      <div className="flex min-h-screen items-center px-5 py-24 md:px-10 md:py-28">
        <div className="mx-auto w-full max-w-7xl">
          <div className="rounded-[2.2rem] border border-[#d4af37]/16 bg-[#071007]/30 p-6 shadow-[0_30px_110px_rgba(0,0,0,0.36)] backdrop-blur-sm md:p-8 lg:p-10">
            <div className="grid gap-8 lg:grid-cols-[0.82fr_1.18fr] lg:items-center">
              <div>
                <p className="font-body text-[10px] uppercase tracking-[0.72em] text-[#f5d06e]/62 [text-shadow:0_0_16px_rgba(212,175,55,0.35)]">Mum's Garden</p>
                <h1 className="mt-5 font-display text-5xl leading-[0.95] text-[#fff7df] [text-shadow:0_3px_18px_rgba(0,0,0,0.78),0_0_22px_rgba(212,175,55,0.22)] md:text-7xl">
                  Welcome to Sonia's Garden
                </h1>
                <p className="mt-6 max-w-2xl font-body text-base leading-8 text-[#fff7df]/72 md:text-lg">
                  A soft walk through the world she left behind: the garden light, the family photos, the song written for her, and the ordinary details that made Sonia feel like home.
                </p>
              </div>
              <SoniaGardenPresenceFeature />
            </div>
            <WithoutYouHerePreviewPlayer onLyrics={onOpenLyrics} variant="wide" />
          </div>
        </div>
      </div>
    </GardenWorld>
  );
}

function GardenAmbientAveMaria() {
  const audioRef = useRef(null);
  const [audible, setAudible] = useState(false);
  const [playing, setPlaying] = useState(false);

  const startAmbient = useCallback(async ({ makeAudible = false } = {}) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.loop = true;
    audio.volume = 0.11;
    audio.muted = !makeAudible;
    await audio.play();
    setPlaying(true);
    setAudible(makeAudible);
  }, []);

  useEffect(() => {
    startAmbient({ makeAudible: false }).catch(() => {});
  }, [startAmbient]);

  useEffect(() => {
    const handleFirstGesture = () => {
      startAmbient({ makeAudible: true }).catch(() => {});
    };
    window.addEventListener('pointerdown', handleFirstGesture, { once: true });
    return () => window.removeEventListener('pointerdown', handleFirstGesture);
  }, [startAmbient]);

  const toggleAmbient = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (audible && !audio.paused) {
      audio.pause();
      setPlaying(false);
      setAudible(false);
      return;
    }

    await startAmbient({ makeAudible: true }).catch(() => {});
  };

  return (
    <div
      className="fixed bottom-4 left-4 z-50 max-w-[calc(100vw-2rem)] rounded-full border border-[#d4af37]/18 bg-[#071007]/76 px-3 py-2 shadow-[0_18px_60px_rgba(0,0,0,0.42)] backdrop-blur-xl md:bottom-6 md:left-6"
      data-song-feedback-exempt="true"
    >
      <audio
        ref={audioRef}
        src={AVE_MARIA_GANNON}
        preload="metadata"
        data-song-title="Ave Maria"
        data-song-artist="Gannon Waye"
        data-song-feedback-source="sonia-garden-ambient-ave-maria"
        data-song-feedback-exempt="true"
      />
      <button
        type="button"
        onClick={toggleAmbient}
        className="flex items-center gap-2 rounded-full text-left font-body text-[9px] uppercase tracking-[0.2em] text-[#fff7df]/64 transition hover:text-[#f5d06e]"
        aria-label={audible ? 'Pause Ave Maria garden ambience' : 'Play Ave Maria garden ambience'}
      >
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[linear-gradient(135deg,#caa647,#f8dc82)] text-[#071007] shadow-[0_0_22px_rgba(212,175,55,0.32)]">
          {audible && playing ? <Volume2 className="h-3.5 w-3.5" /> : <VolumeX className="h-3.5 w-3.5" />}
        </span>
        <span className="hidden sm:block">
          Ave Maria ambience
        </span>
      </button>
    </div>
  );
}

function StickyListenBar({ onLyrics }) {
  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [0, 280, 560], [0, 0.12, 1]);
  const y = useTransform(scrollY, [0, 560], [26, 0]);
  const audioRef = useRef(null);
  const { requestSongFeedback } = useSongFeedback();
  const [playing, setPlaying] = useState(false);

  const playPreview = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (audio.currentTime >= (audio.duration || 49) - 0.25) {
      audio.currentTime = 0;
    }

    audio.muted = false;
    await audio.play();
    setPlaying(true);
  }, []);

  const togglePreview = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (!audio.paused) {
      audio.pause();
      setPlaying(false);
      return;
    }

    await requestSongFeedback({
      songTitle: 'Without You Here',
      artist: 'Gannon Waye',
      source: 'mum-sticky-listen-bar',
      onApproved: playPreview,
    });
  }, [playPreview, requestSongFeedback]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return undefined;

    const handlePlay = () => setPlaying(true);
    const handlePause = () => setPlaying(false);
    const handleEnded = () => {
      audio.currentTime = 0;
      setPlaying(false);
    };

    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('ended', handleEnded);
    };
  }, []);

  return (
    <motion.div
      className="fixed bottom-4 left-1/2 z-50 w-[calc(100%-1.5rem)] max-w-3xl -translate-x-1/2 rounded-[1.6rem] border border-[#d4af37]/20 bg-[#071007]/88 px-3 py-2.5 shadow-[0_22px_80px_rgba(0,0,0,0.55)] backdrop-blur-xl sm:rounded-full md:bottom-6 md:left-auto md:right-6 md:w-[420px] md:translate-x-0 md:px-4"
      style={{ opacity, y }}
      data-song-feedback-exempt="true"
    >
      <audio
        ref={audioRef}
        src={WITHOUT_YOU_HERE_PREVIEW}
        preload="metadata"
        data-song-title="Without You Here"
        data-song-artist="Gannon Waye"
        data-song-feedback-source="mum-sticky-listen-bar-audio"
        data-song-feedback-exempt="true"
      />
      <div className="flex items-center gap-3">
        <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full border border-[#d4af37]/35 shadow-[0_0_28px_rgba(212,175,55,0.25)]">
          <img
            src={WITHOUT_YOU_HERE_COVER}
            alt="Without You Here artwork"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 flex items-center justify-center bg-black/24 text-[#fff7df]">
            {playing ? <Pause className="h-4 w-4 fill-current drop-shadow" /> : <Play className="h-4 w-4 fill-current drop-shadow" />}
          </div>
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-display text-sm leading-snug text-[#fff7df]">Without You Here</p>
          <p className="font-body text-[10px] uppercase leading-snug tracking-[0.16em] text-[#d4af37]/46 sm:tracking-[0.22em]">Gannon Waye · for Mum</p>
        </div>
        <button
          onClick={onLyrics}
          className="hidden shrink-0 rounded-full border border-[#d4af37]/18 px-4 py-2 font-body text-[10px] uppercase tracking-[0.24em] text-[#f5d06e]/78 transition hover:bg-white/5 sm:block"
        >
          Lyrics
        </button>
        <button
          onClick={togglePreview}
          className="shrink-0 rounded-full bg-[#f5d06e] px-4 py-2 font-body text-[10px] font-bold uppercase tracking-[0.24em] text-[#071007]"
        >
          {playing ? 'Pause' : 'Listen'}
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

function FavouriteThingsFeature({ onOpen }) {
  return (
    <div className="mx-auto mt-16 max-w-6xl px-5">
      <div className="mb-8 grid gap-5 md:grid-cols-[0.92fr_1.08fr] md:items-end">
        <div>
          <p className="font-body text-[9px] uppercase tracking-[0.38em] text-[#d4af37]/52">Favourite things</p>
          <h3 className="mt-3 font-display text-4xl leading-tight text-[#fff7df] md:text-5xl">
            The things that made the garden feel like Sonia.
          </h3>
        </div>
        <p className="font-body text-sm leading-7 text-[#fff7df]/54">
          These are memory plaques rather than product cards. Some can open now, and some are waiting for an approved real photo before they become visual cutouts.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        {FAVOURITE_MOMENTS.map((item, index) => (
          <motion.button
            key={item.title}
            type="button"
            onClick={() => onOpen(item)}
            className={`group relative min-h-[240px] overflow-hidden rounded-[1.6rem] border border-[#d4af37]/14 bg-[#071007]/68 p-5 text-left shadow-[0_20px_70px_rgba(0,0,0,0.3)] backdrop-blur-md transition duration-300 hover:-translate-y-1 hover:border-[#d4af37]/34 ${index === 0 ? 'lg:col-span-2' : ''}`}
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: index * 0.05 }}
          >
            <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-[#f5d06e]/10 blur-3xl transition group-hover:bg-[#f5d06e]/18" />
            <div className="relative flex min-h-[208px] flex-col justify-between">
              <div>
                <div className="mb-6 flex h-11 w-11 items-center justify-center rounded-full border border-[#d4af37]/18 bg-[#f5d06e]/12 text-[#f5d06e] shadow-[0_0_22px_rgba(212,175,55,0.22)]">
                  <Heart className="h-4 w-4" fill="rgba(245,208,110,0.18)" />
                </div>
                <p className="font-display text-2xl leading-tight text-[#fff7df]">{item.title}</p>
                <p className="mt-3 font-body text-sm leading-6 text-[#fff7df]/58">{item.note}</p>
              </div>
              <p className="mt-6 font-body text-[10px] uppercase tracking-[0.24em] text-[#d4af37]/58">
                Open memory note
              </p>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
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
          <div className="relative flex min-h-[320px] overflow-hidden rounded-[1.7rem] border border-[#d4af37]/18 bg-[#071007]/68 p-5 shadow-[0_24px_80px_rgba(0,0,0,0.35)] backdrop-blur-md transition duration-300 group-hover:-translate-y-1 group-hover:border-[#d4af37]/36 sm:min-h-[290px] md:min-h-[310px]">
            <div className="absolute inset-x-10 top-0 h-28 rounded-full bg-[#f5d06e]/18 blur-3xl" />
            <div className="relative flex min-h-full flex-1 flex-col justify-between gap-10">
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

function memoryLanePhotoLabel(photo, index) {
  const laneId = memoryLaneId(photo);
  if (photo?.label) return photo.label;
  if (laneId) return `Memory ${Number(laneId.replace('ML', ''))}`;
  return `Memory ${index + 1}`;
}

function MemoryLaneJourneyCard({ photo, index, onOpen, side = 'left', compact = false }) {
  const displayPhoto = {
    ...photo,
    label: memoryLanePhotoLabel(photo, index),
    caption: photo.caption || 'Ready for Gannon to caption during review.',
    source: photo.source || 'Cleaned Mum Garden image audit',
  };

  return (
    <motion.button
      key={`${photo.src}-${index}-${side}`}
      onClick={() => onOpen(displayPhoto)}
      className={`group relative block w-full shrink-0 snap-start text-left ${compact ? 'max-w-[150px]' : ''}`}
      initial={{ opacity: 0, y: 26, rotate: side === 'left' ? -1.5 : 1.5 }}
      whileInView={{ opacity: 1, y: 0, rotate: side === 'left' ? -0.8 : 0.8 }}
      viewport={{ once: true, margin: '-10%' }}
      transition={{ duration: 0.62, delay: Math.min(index * 0.025, 0.22) }}
    >
      <div className="relative rounded-[1.05rem] bg-[linear-gradient(145deg,#7d5b19,#f5d06e_48%,#8d651c)] p-[1px] shadow-[0_18px_60px_rgba(0,0,0,0.32),0_0_20px_rgba(212,175,55,0.12)] transition duration-300 group-hover:-translate-y-1 group-hover:shadow-[0_22px_70px_rgba(0,0,0,0.38),0_0_28px_rgba(245,208,110,0.24)]">
        <div className="rounded-[1rem] bg-[#f8ecd0]/94 p-1.5">
          <div className="relative [perspective:1200px]">
            <div className="relative aspect-[4/5] rounded-[0.72rem] transition duration-700 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]">
              <div className="absolute inset-0 overflow-hidden rounded-[0.72rem] bg-[#071007] [backface-visibility:hidden]">
                <img
                  src={photo.src}
                  alt={displayPhoto.label || 'Sonia family memory photograph'}
                  loading="lazy"
                  className="h-full w-full object-cover object-center transition duration-700 group-hover:scale-105"
                  style={{ filter: 'brightness(1.02) contrast(1.04) saturate(1.02)' }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#071007]/56 via-transparent to-transparent" />
              </div>
              <div className="absolute inset-0 flex rounded-[0.72rem] bg-[#071007]/92 p-3 [backface-visibility:hidden] [transform:rotateY(180deg)]">
                <div className="flex min-h-full flex-col justify-between">
                  <div>
                    <p className="font-body text-[8px] uppercase tracking-[0.24em] text-[#d4af37]/62">
                      Memory note
                    </p>
                    <p className="mt-2 font-display text-lg leading-tight text-[#fff7df]">
                      {displayPhoto.label}
                    </p>
                  </div>
                  <p className="line-clamp-5 font-body text-[10px] leading-5 text-[#fff7df]/58">
                    {displayPhoto.caption}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="px-1.5 pb-1 pt-2">
            <p className="truncate font-body text-[9px] font-bold uppercase tracking-[0.18em] text-[#6f4c12]">
              {displayPhoto.label}
            </p>
          </div>
        </div>
      </div>
      <span className="sr-only">Open memory photo</span>
    </motion.button>
  );
}

function MemoryLaneCenterMoment({ eyebrow, title, body, quote, image }) {
  return (
    <motion.div
      className="relative overflow-hidden rounded-[1.7rem] border border-[#d4af37]/14 bg-[#071007]/62 p-5 shadow-[0_24px_78px_rgba(0,0,0,0.35)] backdrop-blur-md"
      initial={{ opacity: 0, y: 34 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-14%' }}
      transition={{ duration: 0.72 }}
    >
      {image && (
        <img
          src={image}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover opacity-24"
          style={{ filter: 'brightness(0.72) saturate(1.06)' }}
        />
      )}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_16%,rgba(245,208,110,0.2),transparent_34%),linear-gradient(135deg,rgba(7,16,7,0.62),rgba(7,16,7,0.86))]" />
      <div className="relative">
        <p className="font-body text-[9px] uppercase tracking-[0.42em] text-[#f5d06e]/62">{eyebrow}</p>
        <h4 className="mt-3 font-display text-3xl leading-tight text-[#fff7df] [text-shadow:0_3px_16px_rgba(0,0,0,0.78)] md:text-4xl">
          {title}
        </h4>
        <p className="mt-4 font-body text-sm leading-7 text-[#fff7df]/62">{body}</p>
        {quote && (
          <blockquote className="mt-6 border-l border-[#f5d06e]/48 pl-5 font-display text-2xl italic leading-tight text-[#fff8df] [text-shadow:0_3px_18px_rgba(0,0,0,0.82),0_0_18px_rgba(212,175,55,0.2)]">
            {quote}
          </blockquote>
        )}
      </div>
    </motion.div>
  );
}

function MemoryLaneCoverMoment({ onOpenLyrics }) {
  return (
    <motion.div
      className="relative overflow-hidden rounded-[1.8rem] border border-[#f5d06e]/18 bg-[#020502]/60 p-5 shadow-[0_28px_90px_rgba(0,0,0,0.42)]"
      initial={{ opacity: 0, y: 34 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-14%' }}
      transition={{ duration: 0.72 }}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_16%_22%,rgba(245,208,110,0.18),transparent_34%),radial-gradient(circle_at_88%_18%,rgba(116,139,93,0.18),transparent_34%)]" />
      <div className="relative grid gap-5 xl:grid-cols-[0.45fr_1fr] xl:items-center">
        <div className="overflow-hidden rounded-[1.2rem] border border-[#f5d06e]/36 bg-[#071007] shadow-[0_0_42px_rgba(212,175,55,0.2)]">
          <img
            src={WITHOUT_YOU_HERE_COVER}
            alt="Without You Here single artwork"
            className="aspect-square w-full object-cover"
          />
        </div>
        <div>
          <p className="font-body text-[9px] uppercase tracking-[0.42em] text-[#f5d06e]/62">The song at the centre</p>
          <h4 className="mt-3 font-display text-4xl italic leading-none text-[#fff7df] [text-shadow:0_3px_18px_rgba(0,0,0,0.82)]">
            Without You Here
          </h4>
          <p className="mt-3 font-body text-sm uppercase tracking-[0.22em] text-[#fff7df]/54">Gannon Waye</p>
          <p className="mt-4 font-body text-sm leading-7 text-[#fff7df]/62">
            The cover art belongs near the memories, as the bridge between the garden, the grief, and the way her love keeps moving through the page.
          </p>
        </div>
      </div>
      <div className="relative mt-6">
        <WithoutYouHerePreviewPlayer onLyrics={onOpenLyrics} variant="wide" />
      </div>
    </motion.div>
  );
}

function SoniaLoveFeature({ onOpen }) {
  const photo = {
    src: SONIA_LOVE_PHOTO,
    label: 'Love stayed close',
    caption: 'A feature memory of Sonia and the love beside her, held as a real photo rather than a cutout effect.',
    source: 'Memory lane FS120',
  };

  return (
    <motion.button
      type="button"
      onClick={() => onOpen(photo)}
      className="group relative block w-full overflow-hidden rounded-[1.9rem] border border-[#f5d06e]/22 bg-[#071007]/68 p-3 text-left shadow-[0_32px_100px_rgba(0,0,0,0.44)]"
      initial={{ opacity: 0, y: 34 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-14%' }}
      transition={{ duration: 0.72 }}
    >
      <div className="absolute -inset-10 bg-[radial-gradient(circle_at_52%_24%,rgba(255,244,189,0.24),transparent_38%),radial-gradient(circle_at_18%_76%,rgba(245,208,110,0.16),transparent_32%)] blur-2xl" />
      <div className="relative overflow-hidden rounded-[1.45rem] border border-[#fff0ad]/30 bg-[#020502]">
        <img
          src={SONIA_LOVE_PHOTO}
          alt="Sonia and her partner sharing a kiss"
          className="aspect-[16/10] w-full object-cover object-center transition duration-700 group-hover:scale-[1.025]"
          style={{ filter: 'brightness(1.02) contrast(1.04) saturate(0.98)' }}
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(7,16,7,0.04),rgba(7,16,7,0.48)),radial-gradient(circle_at_50%_10%,rgba(255,244,189,0.14),transparent_38%)]" />
      </div>
      <div className="relative -mt-12 ml-4 max-w-[21rem] rounded-[1.25rem] border border-[#f5d06e]/16 bg-[#071007]/76 p-4 shadow-[0_22px_70px_rgba(0,0,0,0.42)] backdrop-blur-md">
        <p className="font-body text-[9px] uppercase tracking-[0.38em] text-[#f5d06e]/66">Love stayed close</p>
        <p className="mt-2 font-display text-2xl italic leading-tight text-[#fff7df] [text-shadow:0_3px_16px_rgba(0,0,0,0.82)]">
          A real moment, kept sacred, not dressed up beyond recognition.
        </p>
      </div>
    </motion.button>
  );
}

function MemoryLaneCenterStack({ onOpen, onOpenLyrics }) {
  return (
    <div className="relative space-y-10">
      <div className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-[#d4af37]/18 to-transparent" />
      <MemoryLaneCenterMoment
        eyebrow="Real backyard made sacred"
        title="The garden becomes the place we meet her."
        body="The page should feel like stepping from the sky into the backyard she loved: soft light, real family photos, music close by, and enough room for every memory to breathe."
        quote="As long as you remember me, my memory will live on."
        image={GARDEN_GALLERY}
      />
      <MemoryLaneCoverMoment onOpenLyrics={onOpenLyrics} />
      <SoniaLoveFeature onOpen={onOpen} />
      <MemoryLaneCenterMoment
        eyebrow="Lyric moment"
        title="Even while leaving, she was still loving."
        body="Short signature lines can appear as small cinematic pauses between the photos, so visitors feel the story instead of reading one long block."
        quote="Your last breath took mine away. There's not much more I have to say."
        image={GARDEN_WISDOM}
      />
      <MemoryLaneCenterMoment
        eyebrow="Favourite things"
        title="Children, coffee, gold, flowers, and the little rituals."
        body="This centre lane is ready for your approved photo of the kids with Mum, jewellery details, coffee memories, and the tattoo-making images when we confirm the right files."
        image={GARDEN_MUSIC}
      />
    </div>
  );
}

function PhotoGarden({ onOpen, onOpenLyrics }) {
  const [galleryPhotos, setGalleryPhotos] = useState([]);

  useEffect(() => {
    let alive = true;

    fetch(CLEAN_GALLERY_MANIFEST)
      .then((response) => (response.ok ? response.json() : Promise.reject(new Error('Clean gallery manifest unavailable'))))
      .then((manifest) => {
        if (!alive) return;
        setGalleryPhotos(Array.isArray(manifest?.items) ? manifest.items : []);
      })
      .catch(() => {
        if (!alive) return;
        setGalleryPhotos([]);
      });

    return () => {
      alive = false;
    };
  }, []);

  const approvedCleanGallery = sortMemoryLanePhotos(
    galleryPhotos.filter(isPublicMemoryLanePhoto).filter((photo) => !isFeaturedTopMemoryPhoto(photo)),
  );
  const approvedFallbackGallery = REAL_PHOTOS.filter((photo) => !isFeaturedTopMemoryPhoto(photo));
  const journeyPhotos = approvedCleanGallery.length > 0 ? approvedCleanGallery : approvedFallbackGallery;
  const leftPhotos = journeyPhotos.filter((_, index) => index % 2 === 0);
  const rightPhotos = journeyPhotos.filter((_, index) => index % 2 === 1);

  return (
    <div className="mx-auto mt-16 max-w-[1400px] px-4 sm:px-5">
      <div className="relative overflow-hidden rounded-[2.2rem] border border-[#d4af37]/14 bg-[#071007]/62 shadow-[0_34px_120px_rgba(0,0,0,0.42)] backdrop-blur-sm">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(245,208,110,0.16),transparent_34%),linear-gradient(180deg,rgba(7,16,7,0.12),rgba(7,16,7,0.78))]" />
        <div className="relative px-4 py-9 sm:px-6 md:px-8 lg:px-10">
          <div className="mx-auto max-w-3xl text-center">
            <p className="font-body text-[9px] uppercase tracking-[0.46em] text-[#d4af37]/58">Memory lane</p>
            <h3 className="mt-3 font-display text-4xl leading-tight text-[#fff7df] [text-shadow:0_3px_18px_rgba(0,0,0,0.74),0_0_20px_rgba(212,175,55,0.18)] md:text-5xl">
              A walk through her life.
            </h3>
            <p className="mx-auto mt-4 max-w-2xl font-body text-sm leading-7 text-[#fff7df]/58">
              The earliest memories begin at the top. Each photo becomes a small stop along the garden path, ready for your notes and stories.
            </p>
          </div>

          <div className="mt-9 flex gap-3 overflow-x-auto pb-4 lg:hidden">
            {journeyPhotos.map((photo, index) => (
              <MemoryLaneJourneyCard
                key={`${photo.src}-mobile-${index}`}
                photo={photo}
                index={index}
                onOpen={onOpen}
                side={index % 2 === 0 ? 'left' : 'right'}
                compact
              />
            ))}
          </div>

          <div className="relative mt-12 hidden grid-cols-[minmax(130px,180px)_minmax(0,1fr)_minmax(130px,180px)] gap-8 lg:grid">
            <div className="space-y-10">
              {leftPhotos.map((photo, index) => (
                <MemoryLaneJourneyCard
                  key={`${photo.src}-left-${index}`}
                  photo={photo}
                  index={index * 2}
                  onOpen={onOpen}
                  side="left"
                />
              ))}
            </div>

            <div className="relative rounded-[2rem] border border-[#d4af37]/10 bg-[#061006]/28 p-6 shadow-[inset_0_0_90px_rgba(0,0,0,0.24)]">
              <MemoryLaneCenterStack onOpen={onOpen} onOpenLyrics={onOpenLyrics} />
            </div>

            <div className="space-y-10 pt-24">
              {rightPhotos.map((photo, index) => (
                <MemoryLaneJourneyCard
                  key={`${photo.src}-right-${index}`}
                  photo={photo}
                  index={index * 2 + 1}
                  onOpen={onOpen}
                  side="right"
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function YoungerYearsTribute({ onOpen }) {
  return (
    <div className="mx-auto mt-14 max-w-6xl px-5">
      <div className="mb-6 max-w-3xl">
        <p className="font-body text-[9px] uppercase tracking-[0.38em] text-[#d4af37]/52">Younger years</p>
        <h3 className="mt-3 font-display text-3xl text-[#fff7df]">A softer space for the earlier photos.</h3>
        <p className="mt-4 font-body text-sm leading-7 text-[#fff7df]/52">
          These older images are kept true to the archive, with light, contrast, and framing improved on the page so they feel cared for without changing the people inside them.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {YOUNGER_YEARS_PHOTOS.map((photo, index) => (
          <motion.button
            key={photo.src}
            onClick={() => onOpen(photo)}
            className="group text-left"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.65, delay: index * 0.07 }}
          >
            <div className="overflow-hidden rounded-lg border border-[#d4af37]/14 bg-[#071007]/72 shadow-[0_24px_80px_rgba(0,0,0,0.34)] backdrop-blur-md transition duration-300 group-hover:-translate-y-1 group-hover:border-[#d4af37]/30">
              <div className="relative aspect-[4/5] overflow-hidden bg-black/28">
                <img
                  src={photo.src}
                  alt={photo.label}
                  loading="lazy"
                  className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                  style={{
                    objectPosition: photo.objectPosition,
                    filter: 'brightness(1.04) contrast(1.08) saturate(1.04) sepia(0.05)',
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#071007]/66 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <p className="font-display text-xl text-[#fff7df]">{photo.label}</p>
                  <p className="mt-1 font-body text-[10px] uppercase tracking-[0.22em] text-[#d4af37]/58">Open photo</p>
                </div>
              </div>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
}

function TattooScrapbook({ onOpen }) {
  return (
    <div className="mx-auto mt-12 max-w-6xl px-5">
      <div className="rounded-[2.2rem] border border-[#d4af37]/16 bg-[#071007]/72 p-5 shadow-[0_28px_90px_rgba(0,0,0,0.38)] backdrop-blur-md md:p-8">
        <div className="mb-7 max-w-2xl">
          <p className="font-body text-[9px] uppercase tracking-[0.38em] text-[#d4af37]/52">Carrying her with you</p>
          <h3 className="mt-3 font-display text-3xl text-[#fff7df]">Tattoo scrapbook memories stay together.</h3>
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

function CapturedSlideshow() {
  return null;
}


function FamilyContributionAccess() {
  const contributionPath = MEMORY_UPLOAD_PATH;
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
  const contributionPath = MEMORY_UPLOAD_PATH;

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
    <main className="relative min-h-screen overflow-hidden bg-[#030804] text-[#fff7df]">
      <img
        src={SKY_ANGEL_HERO}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover object-[50%_22%]"
        style={{ filter: 'brightness(0.72) saturate(1.04) contrast(1.02)' }}
      />
      <img
        src={GARDEN_HERO}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover object-center opacity-48 mix-blend-multiply"
        style={{ filter: 'brightness(0.78) saturate(1.08)' }}
      />
      <div
        className="absolute inset-0"
        style={{
          background: `
            linear-gradient(180deg, rgba(7,17,38,0.34) 0%, rgba(6,12,12,0.20) 36%, rgba(3,8,4,0.92) 100%),
            linear-gradient(90deg, rgba(2,5,2,0.94) 0%, rgba(2,5,2,0.62) 44%, rgba(2,5,2,0.84) 100%),
            radial-gradient(circle at 24% 22%, rgba(245,208,110,0.20), transparent 30%),
            radial-gradient(circle at 72% 16%, rgba(255,247,223,0.18), transparent 28%)
          `,
        }}
      />

      <div className="relative z-10 flex min-h-screen flex-col justify-between px-5 py-6 md:px-10 md:py-8">
        <header className="flex items-center justify-between gap-4">
          <a
            href="/"
            className="inline-flex items-center gap-3 font-body text-[10px] font-semibold uppercase tracking-[0.28em] text-[#fff7df]/70 transition hover:text-[#f5d06e]"
          >
            <Heart className="h-4 w-4 text-[#f5d06e]" fill="rgba(245,208,110,0.18)" />
            Gannon Waye
          </a>
          <a
            href={contributionPath}
            className="hidden items-center gap-2 rounded-full border border-[#f5d06e]/24 bg-[#fff7df]/[0.055] px-4 py-2 font-body text-[10px] font-bold uppercase tracking-[0.2em] text-[#f5d06e] backdrop-blur-md transition hover:-translate-y-0.5 hover:bg-[#fff7df]/[0.08] sm:inline-flex"
          >
            <UploadCloud className="h-4 w-4" />
            Send a memory
          </a>
        </header>

        <section className="grid flex-1 items-center gap-10 py-16 md:grid-cols-[minmax(0,1.05fr)_minmax(280px,0.62fr)] md:py-20">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 border border-[#f5d06e]/18 bg-black/22 px-3 py-2 font-body text-[9px] font-bold uppercase tracking-[0.34em] text-[#f5d06e]/76 backdrop-blur-md">
              <Sprout className="h-3.5 w-3.5" />
              Coming soon
            </div>
            <h1 className="mt-7 max-w-4xl font-display text-5xl leading-[0.92] text-white sm:text-6xl md:text-8xl">
              Mum&apos;s Garden is being prepared with care.
            </h1>
            <p className="mt-7 max-w-2xl font-body text-base leading-8 text-[#fff7df]/74 md:text-lg">
              A memorial garden for Sonia Waye is almost ready: music, photos, family memories, and a quiet place to visit when love needs somewhere to go.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href={contributionPath}
                className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full bg-[#f5d06e] px-6 py-3 font-body text-[10px] font-bold uppercase tracking-[0.22em] text-[#071007] transition hover:-translate-y-0.5"
              >
                <UploadCloud className="h-4 w-4" />
                Send a memory
              </a>
              <a
                href="/music"
                className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full border border-[#fff7df]/18 bg-[#fff7df]/[0.055] px-6 py-3 font-body text-[10px] font-bold uppercase tracking-[0.22em] text-[#fff7df] backdrop-blur-md transition hover:-translate-y-0.5 hover:border-[#f5d06e]/36"
              >
                <Music2 className="h-4 w-4" />
                Gannon&apos;s music
              </a>
            </div>
          </div>

          <aside className="border border-[#d4af37]/18 bg-[#071007]/72 p-5 shadow-[0_28px_90px_rgba(0,0,0,0.42)] backdrop-blur-xl md:p-6">
            <div className="flex items-start gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#f5d06e]/12 text-[#f5d06e]">
                <Clock3 className="h-5 w-5" />
              </div>
              <div>
                <p className="font-body text-[9px] font-bold uppercase tracking-[0.28em] text-[#d4af37]/56">Launch status</p>
                <p className="mt-2 font-display text-2xl leading-tight text-[#fff7df]">Final family review is open now.</p>
              </div>
            </div>

            <div className="mt-6 space-y-4 font-body text-sm leading-6 text-[#fff7df]/62">
              <p>The public garden is intentionally held until the images, wording, music links, and consent language are approved.</p>
              <p>Family and friends can still contribute memories while the page is being finished.</p>
            </div>

            <form onSubmit={submit} className="mt-7 space-y-3">
              <label htmlFor="mum-garden-preview-code" className="flex items-center gap-2 font-body text-[9px] font-bold uppercase tracking-[0.24em] text-[#d4af37]/54">
                <LockKeyhole className="h-3.5 w-3.5" />
                Private preview
              </label>
              <div className="flex flex-col gap-3 sm:flex-row">
                <input
                  id="mum-garden-preview-code"
                  value={code}
                  onChange={(event) => setCode(event.target.value)}
                  placeholder="Preview code"
                  className="min-h-[48px] min-w-0 flex-1 border border-[#d4af37]/20 bg-black/34 px-4 font-body text-sm text-[#fff7df] outline-none placeholder:text-[#fff7df]/34 focus:border-[#f5d06e]/60"
                />
                <button
                  type="submit"
                  className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full bg-[#f5d06e] px-5 py-3 font-body text-[10px] font-bold uppercase tracking-[0.2em] text-[#071007] transition hover:-translate-y-0.5"
                >
                  Unlock
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
              {error && <p className="font-body text-xs text-amber-300">{error}</p>}
            </form>

            <a
              href={contributionPath}
              className="mt-6 inline-flex w-full min-h-[48px] items-center justify-center gap-2 rounded-full border border-[#d4af37]/24 bg-[#fff7df]/[0.045] px-5 py-3 font-body text-[10px] font-bold uppercase tracking-[0.2em] text-[#f5d06e] transition hover:-translate-y-0.5"
            >
              <ShieldCheck className="h-4 w-4" />
              Family upload link stays open
            </a>
          </aside>
        </section>

        <footer className="flex flex-col gap-3 border-t border-[#fff7df]/10 pt-5 font-body text-[10px] uppercase tracking-[0.24em] text-[#fff7df]/46 sm:flex-row sm:items-center sm:justify-between">
          <span>Sonia Katisa Waye memorial garden</span>
          <span>Music, memory, family review</span>
        </footer>
      </div>
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
        <p className="font-body text-[10px] uppercase tracking-[0.42em] text-[#d4af37]/52">Her life remembered</p>
        <h3 className="mt-4 font-display text-4xl leading-tight text-[#fff7df] md:text-5xl">
          The facts are kept softly.
        </h3>
        <p className="mt-5 font-body text-sm leading-7 text-[#fff7df]/58">
          The original records stay preserved in the private source archive, while the public page carries only gentle garden cards and respectful copy. This keeps the launch page warm, living, and song-led.
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

    if (drawer.type === 'favorite') {
      return (
        <div className="grid gap-5 md:grid-cols-[0.72fr_1.28fr] md:items-stretch">
          <div
            className="min-h-[260px] rounded-[1.4rem] border border-[#d4af37]/14"
            style={{
              backgroundImage: `linear-gradient(180deg, rgba(3,8,4,0.16), rgba(3,8,4,0.82)), url(${GARDEN_HERO})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
          <div>
            <p className="font-body text-[10px] uppercase tracking-[0.38em] text-[#d4af37]/52">Favourite things</p>
            <h3 className="mt-3 font-display text-4xl text-[#fff7df]">{drawer.data.title}</h3>
            <p className="mt-5 font-body text-base leading-8 text-[#fff7df]/64">{drawer.data.note}</p>
            <div className="mt-6 rounded-[1.4rem] border border-[#d4af37]/16 bg-[#fff7df]/[0.06] p-5">
              <p className="font-body text-sm leading-6 text-[#fff7df]/58">{drawer.data.detail}</p>
            </div>
            <p className="mt-5 font-body text-xs leading-6 text-[#fff7df]/42">
              This is a visual memory note. If a real matching photo is approved, this drawer can become a richer feature with the exact image.
            </p>
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

export default function MumTribute({ mode = 'foyer' }) {
  const [drawer, setDrawer] = useState(null);
  const isGardenMode = mode === 'garden';
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
    const title = isGardenMode
      ? 'Sonia’s Garden | Sonia Waye Memorial | Gannon Waye Music'
      : 'In Loving Memory of Sonia | Gannon Waye Music';
    const description = isGardenMode
      ? 'A private pre-launch memorial garden for Sonia Waye: photos, memories, music, family contributions, and Gannon Waye’s Without You Here.'
      : 'A sky foyer for Sonia Waye: a loving entry point into Mum’s Garden, held in music, family memory, and gold light.';
    const image = `${window.location.origin}${WITHOUT_YOU_HERE_COVER}`;
    const url = `${window.location.origin}${isGardenMode ? '/mum/garden' : '/mum'}`;

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
  }, [isGardenMode]);

  useEffect(() => {
    if (!unlocked || typeof window === 'undefined') return;
    window.sessionStorage.setItem(MUM_GARDEN_ACCESS_KEY, 'true');
  }, [unlocked]);

  if (!unlocked) {
    return <MumPrivateGate onUnlock={() => setUnlocked(true)} />;
  }

  if (!isGardenMode) {
    return (
      <main className="relative overflow-x-hidden bg-[#020502] text-[#fff7df]">
        <MumSkyFoyer
          onEnterGarden={() => {
            const query = window.location.search || '';
            window.location.href = `/mum/garden${query}`;
          }}
          onOpenLyrics={() => {
            const query = window.location.search || '';
            window.location.href = `/mum/garden${query}#lyrics`;
          }}
        />
      </main>
    );
  }

  return (
    <main className="relative overflow-x-hidden bg-[#020502] pb-24 text-[#fff7df]">
      <GardenAmbientAveMaria />
      <StickyListenBar onLyrics={() => openDrawer('lyric', LYRIC_MOMENTS[0])} />
      <SoniaGardenWelcome onOpenLyrics={() => document.getElementById('lyrics')?.scrollIntoView({ behavior: 'smooth' })} />

      <div className="relative z-0">
        <GardenWorld id="world" image={GARDEN_HERO} brightness={0.62} minHeight="auto" align="center 45%">
          <div className="py-24 md:py-32">
            <SectionHeading eyebrow="The garden world" title="Real backyard, made sacred.">
              <p>
                A more immaculate, luminous version of the world that still feels like her: robe, coffee, chair, leaves, light, lyrics, and exact family images.
              </p>
            </SectionHeading>
            <WithoutYouHereCoverFeature />
            <LuxuryObjectScene onComfort={() => openDrawer('comfort')} />
            <FavouriteThingsFeature onOpen={(item) => openDrawer('favorite', item)} />
          </div>
        </GardenWorld>
      </div>

      <GardenWorld id="service-card" image={GARDEN_MUSIC} brightness={0.46} minHeight="auto">
        <div className="py-24 md:py-32">
          <SectionHeading eyebrow="Her life remembered" title="The formal facts, held gently.">
            <p>
              The family records are held softly here as memory anchors, with the weight lifted into warmth, garden light, and love.
            </p>
          </SectionHeading>
          <ServiceCardSection />
        </div>
      </GardenWorld>

      <GardenWorld id="lyrics" image={GARDEN_WISDOM} brightness={0.48} minHeight="auto">
        <div className="py-28 pb-36 md:py-36 md:pb-44">
          <SectionHeading eyebrow="Without You Here" title="Lyrics as the path through the garden.">
            <p>
              The lyrics become lanterns in the page, guiding visitors through the garden without breaking the feeling of the walk.
            </p>
          </SectionHeading>
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
        </div>
      </GardenWorld>

      <GardenWorld id="photos" image={GARDEN_GALLERY} brightness={0.54} minHeight="auto">
        <div className="py-24 md:py-32">
          <SectionHeading eyebrow="Memory gallery" title="Exact photos, placed beautifully.">
            <p>
              Every family photo stays true to the original. Images are framed gently, with real people and real memories left intact.
            </p>
          </SectionHeading>
          <YoungerYearsTribute onOpen={(photo) => openDrawer('photo', photo)} />
          <CapturedSlideshow onOpen={(photo) => openDrawer('photo', photo)} />
          <PhotoGarden
            onOpen={(photo) => openDrawer('photo', photo)}
            onOpenLyrics={() => openDrawer('lyric', LYRIC_MOMENTS[0])}
          />
          <TattooScrapbook onOpen={(photo) => openDrawer('photo', photo)} />
        </div>
      </GardenWorld>

      <GardenWorld id="sonia-guide" image={GARDEN_WISDOM} brightness={0.46} minHeight="auto">
        <div className="py-24 md:py-32">
          <SectionHeading eyebrow="Sonia’s Memory Presence" title="No fake Mum. Just her, held beautifully.">
            <p>
              This section uses exact Sonia imagery and protected family recordings only where approved. No strange avatar crop, no generated replacement person, and no pretending technology can replace her.
            </p>
          </SectionHeading>
          <SoniaLifelikeAvatar
            onComfort={() => openDrawer('comfort')}
          />
          <SoniaHeyGenReadiness />
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
