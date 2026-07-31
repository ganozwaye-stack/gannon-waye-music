import React, { useCallback, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Eye, Music2, Play, Sparkles } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { WITHOUT_YOU_HERE_COVER } from '@/constants/musicAssets';

const MUM_GARDEN_ACCESS_KEY = 'mum-garden-preview-access-v2';
const MUM_GARDEN_ACCESS_TOKEN_ID_KEY = 'mum-garden-preview-token-id-v1';
const MUM_GARDEN_PREVIEW_QUERY_KEYS = ['preview_token', 'previewToken', 'garden_preview_token', 'gardenToken'];
const SKY_ANGEL_HERO = '/images/mum/sonia_sky_angel_hero.png';
const SONIA_ENTRY_PHOTO = '/images/mum/memory-lane/ML058_FS116.jpg';
const SONIA_LOVE_PHOTO = '/images/mum/memory-lane/ML061_FS120.jpg';
const SONIA_YOUNG_PHOTO = '/images/mum/memory-lane/ML001_FS006.jpg';
const SONIA_KIDS_PHOTO = '/images/mum/memory-lane/ML023_FS057.jpg';
const SONIA_COFFEE_PHOTO = '/images/mum/memory-lane/ML054_FS109.jpg';
const SONIA_TATTOO_PHOTO = 'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/7df2f998b_A181BD35-93F3-41FB-B671-2FABC71B701A.jpg';
const GARDEN_HERO = 'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/b7806166d_generated_image.png';
const GARDEN_GALLERY = 'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/6591fa60b_generated_image.png';
const GARDEN_MUSIC = 'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/63f84cf4f_generated_image.png';
const GARDEN_WISDOM = 'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/fc387c2b6_generated_image.png';

const memoryRail = [
  '/images/mum/memory-lane/ML001_FS006.jpg',
  '/images/mum/memory-lane/ML003_FS034.jpg',
  '/images/mum/memory-lane/ML015_FS041.jpg',
  '/images/mum/memory-lane/ML023_FS057.jpg',
  '/images/mum/memory-lane/ML037_FS082.jpg',
  '/images/mum/memory-lane/ML047_FS099.jpg',
  '/images/mum/memory-lane/ML061_FS120.jpg',
];

const concepts = [
  {
    number: '01',
    title: 'Heavenly Garden Foyer',
    line: 'Sky first, then the visitor enters the living garden.',
    quote: 'As long as you remember me, my memory will live on.',
    image: SKY_ANGEL_HERO,
    accent: 'from-[#f8dc82] via-[#fff3bd] to-[#9f731f]',
  },
  {
    number: '02',
    title: 'Sacred Backyard Walk',
    line: 'The real backyard made cinematic, warm, and continuous.',
    quote: 'The garden becomes the place we meet her.',
    image: GARDEN_HERO,
    accent: 'from-[#d4af37] via-[#f5d06e] to-[#4d6a3a]',
  },
  {
    number: '03',
    title: 'Album World Memorial',
    line: 'The single artwork becomes the visual language of the page.',
    quote: "Your last breath took mine away. There's not much more I have to say.",
    image: GARDEN_MUSIC,
    accent: 'from-[#f5d06e] via-[#ffffff] to-[#31557a]',
  },
  {
    number: '04',
    title: 'Family Keepsake Chapel',
    line: 'Photos, favourite things, coffee, tattoos, and love as sacred objects.',
    quote: 'Children, coffee, gold, flowers, and the little rituals.',
    image: GARDEN_WISDOM,
    accent: 'from-[#fff0ad] via-[#d4af37] to-[#793f25]',
  },
  {
    number: '05',
    title: 'Living Memory Gallery',
    line: 'A side-photo adventure from youngest to newest, with the story in the centre.',
    quote: 'Every photo is a doorway back to her.',
    image: GARDEN_GALLERY,
    accent: 'from-[#f8dc82] via-[#d4af37] to-[#102912]',
  },
];

function getMumGardenPreviewTokenFromUrl() {
  if (typeof window === 'undefined') return '';
  const params = new URLSearchParams(window.location.search);
  for (const key of MUM_GARDEN_PREVIEW_QUERY_KEYS) {
    const token = params.get(key)?.trim();
    if (token) return token;
  }
  return '';
}

function removeMumGardenPreviewTokenFromUrl() {
  if (typeof window === 'undefined') return;
  const url = new URL(window.location.href);
  let changed = false;
  for (const key of MUM_GARDEN_PREVIEW_QUERY_KEYS) {
    if (url.searchParams.has(key)) {
      url.searchParams.delete(key);
      changed = true;
    }
  }
  if (changed) {
    window.history.replaceState(window.history.state, document.title, `${url.pathname}${url.search}${url.hash}`);
  }
}

function unwrapBase44Data(response) {
  return response?.data || response || {};
}

function PrivatePreviewNotice({ validationStatus, validationError }) {
  return (
    <main className="min-h-screen bg-[#030604] px-5 py-32 text-[#fff7df]">
      <div className="mx-auto max-w-2xl rounded-[2rem] border border-[#d4af37]/20 bg-[#071007]/80 p-8 text-center shadow-[0_28px_90px_rgba(0,0,0,0.42)]">
        <p className="font-body text-[10px] uppercase tracking-[0.42em] text-[#f5d06e]/62">Private design lab</p>
        <h1 className="mt-4 font-display text-5xl">Sonia's Garden drafts</h1>
        <p className="mt-5 font-body text-sm leading-7 text-[#fff7df]/62">
          Use a validated preview link so the draft concepts stay out of the public memorial flow.
        </p>
        {validationStatus === 'validating' && (
          <p className="mt-4 font-body text-xs uppercase tracking-[0.24em] text-[#f5d06e]/66">Checking preview token</p>
        )}
        {validationError && <p className="mt-4 font-body text-xs text-amber-300">{validationError}</p>}
      </div>
    </main>
  );
}

function MiniPlayer({ compact = false }) {
  return (
    <div className={`rounded-[1.5rem] border border-[#f5d06e]/24 bg-[#020502]/62 ${compact ? 'p-3' : 'p-4'} shadow-[0_20px_70px_rgba(0,0,0,0.38)] backdrop-blur-md`}>
      <div className="flex items-center gap-4">
        <div className={`${compact ? 'h-16 w-16' : 'h-24 w-24'} shrink-0 overflow-hidden rounded-xl border border-[#f5d06e]/34`}>
          <img src={WITHOUT_YOU_HERE_COVER} alt="Without You Here artwork" className="h-full w-full object-cover" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-body text-[9px] uppercase tracking-[0.34em] text-[#f5d06e]/66">Without You Here</p>
          <p className="mt-1 font-display text-2xl italic leading-none text-[#fff7df]">Gannon Waye</p>
          <div className="mt-4 flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[linear-gradient(135deg,#caa647,#f8dc82)] text-[#061006] shadow-[0_0_28px_rgba(245,208,110,0.34)]">
              <Play className="h-4 w-4 fill-current" />
            </span>
            <span className="h-1.5 flex-1 rounded-full bg-[#f5d06e]/18">
              <span className="block h-full w-[46%] rounded-full bg-[linear-gradient(90deg,#caa647,#f8dc82)]" />
            </span>
            <Music2 className="h-4 w-4 text-[#f5d06e]/62" />
          </div>
        </div>
      </div>
    </div>
  );
}

function Polaroid({ src, label, className = '' }) {
  return (
    <div className={`rounded-[1.15rem] bg-[#f8ecd0] p-2 shadow-[0_24px_70px_rgba(0,0,0,0.36)] ${className}`}>
      <img src={src} alt={label} className="aspect-[4/5] w-full rounded-[0.82rem] object-cover" />
      <p className="truncate px-1 pb-1 pt-2 font-body text-[9px] uppercase tracking-[0.18em] text-[#6f4c12]">{label}</p>
    </div>
  );
}

function RailPreview() {
  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-7">
      {memoryRail.map((src, index) => (
        <Polaroid
          key={src}
          src={src}
          label={`Memory ${index + 1}`}
          className={index % 2 === 0 ? '-rotate-2' : 'rotate-2'}
        />
      ))}
    </div>
  );
}

function ConceptBoard({ concept, index }) {
  const isSky = index === 0;
  const isAlbum = index === 2;
  const isKeepsake = index === 3;
  const isGallery = index === 4;

  return (
    <motion.section
      id={`concept-${concept.number}`}
      className="relative min-h-screen overflow-hidden border-t border-[#d4af37]/10"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-12%' }}
      transition={{ duration: 0.8 }}
    >
      <img
        src={concept.image}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover"
        style={{ filter: 'brightness(0.5) saturate(1.05) contrast(1.04)' }}
      />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(3,6,4,0.94),rgba(3,6,4,0.2)_48%,rgba(3,6,4,0.9)),radial-gradient(circle_at_50%_8%,rgba(245,208,110,0.22),transparent_36%)]" />
      <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl flex-col justify-center px-5 py-24 md:px-8">
        <div className="grid gap-10 lg:grid-cols-[0.42fr_0.58fr] lg:items-center">
          <div>
            <div className={`mb-5 inline-flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br ${concept.accent} font-body text-sm font-bold text-[#061006] shadow-[0_0_42px_rgba(245,208,110,0.28)]`}>
              {concept.number}
            </div>
            <p className="font-body text-[10px] uppercase tracking-[0.46em] text-[#f5d06e]/70">Style direction</p>
            <h2 className="mt-4 font-display text-5xl leading-[0.95] text-[#fff7df] [text-shadow:0_4px_22px_rgba(0,0,0,0.84),0_0_24px_rgba(212,175,55,0.22)] md:text-7xl">
              {concept.title}
            </h2>
            <p className="mt-6 max-w-xl font-body text-base leading-8 text-[#fff7df]/68">{concept.line}</p>
            <blockquote className="mt-8 max-w-xl border-l border-[#f5d06e]/50 pl-5 font-display text-3xl italic leading-tight text-[#fff7df] [text-shadow:0_3px_18px_rgba(0,0,0,0.78)]">
              {concept.quote}
            </blockquote>
          </div>

          <div className="relative">
            {isSky && (
              <div className="grid gap-5 md:grid-cols-[0.8fr_1.2fr] md:items-center">
                <div className="relative mx-auto aspect-[4/5] w-full max-w-[270px] overflow-hidden rounded-[48%_48%_42%_42%/56%_56%_38%_38%] border border-[#fff0ad]/38 bg-[#071007] shadow-[0_0_70px_rgba(245,208,110,0.22)]">
                  <img src={SONIA_ENTRY_PHOTO} alt="Sonia memory portrait" className="h-full w-full object-cover" />
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_18%,transparent_34%,rgba(7,16,7,0.5)_100%)]" />
                </div>
                <MiniPlayer />
              </div>
            )}

            {index === 1 && (
              <div className="space-y-5">
                <div className="rounded-[2rem] border border-[#f5d06e]/18 bg-[#071007]/62 p-5 shadow-[0_28px_95px_rgba(0,0,0,0.38)] backdrop-blur-md">
                  <p className="font-body text-[9px] uppercase tracking-[0.36em] text-[#f5d06e]/62">Welcome to Sonia's Garden</p>
                  <h3 className="mt-3 font-display text-4xl text-[#fff7df]">A living walk, not a static memorial.</h3>
                  <p className="mt-4 font-body text-sm leading-7 text-[#fff7df]/62">
                    Backgrounds fall into each other: sky, garden light, family moments, then the song.
                  </p>
                </div>
                <RailPreview />
              </div>
            )}

            {isAlbum && (
              <div className="grid gap-5 md:grid-cols-[0.95fr_1.05fr] md:items-center">
                <div className="overflow-hidden rounded-[1.7rem] border border-[#f5d06e]/28 shadow-[0_0_70px_rgba(245,208,110,0.2)]">
                  <img src={WITHOUT_YOU_HERE_COVER} alt="Without You Here artwork" className="aspect-square w-full object-cover" />
                </div>
                <div className="space-y-5">
                  <MiniPlayer compact />
                  <div className="rounded-[1.5rem] border border-[#d4af37]/16 bg-[#071007]/68 p-5 backdrop-blur-md">
                    <p className="font-display text-3xl italic leading-tight text-[#fff7df]">
                      The artwork can weave like light through the garden.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {isKeepsake && (
              <div className="grid gap-4 sm:grid-cols-2">
                <Polaroid src={SONIA_KIDS_PHOTO} label="Her children" className="-rotate-2" />
                <Polaroid src={SONIA_COFFEE_PHOTO} label="Coffee and comfort" className="rotate-2" />
                <Polaroid src={SONIA_TATTOO_PHOTO} label="Tattoo memory" className="rotate-1" />
                <Polaroid src={SONIA_LOVE_PHOTO} label="Love stayed close" className="-rotate-1" />
              </div>
            )}

            {isGallery && (
              <div className="rounded-[2rem] border border-[#d4af37]/16 bg-[#071007]/60 p-5 shadow-[0_28px_95px_rgba(0,0,0,0.42)] backdrop-blur-md">
                <RailPreview />
                <div className="mt-6 grid gap-4 md:grid-cols-2">
                  <div className="rounded-[1.4rem] border border-[#d4af37]/12 bg-[#020502]/46 p-5">
                    <p className="font-body text-[9px] uppercase tracking-[0.34em] text-[#f5d06e]/62">Centre moment</p>
                    <p className="mt-3 font-display text-3xl italic leading-tight text-[#fff7df]">Every scroll lands on a memory with a reason.</p>
                  </div>
                  <MiniPlayer compact />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.section>
  );
}

export default function MumDesignLab() {
  const [allowed, setAllowed] = useState(() => {
    if (typeof window === 'undefined') return false;
    window.sessionStorage.removeItem('sonia-design-lab-access');
    return window.sessionStorage.getItem(MUM_GARDEN_ACCESS_KEY) === 'validated';
  });
  const [validationStatus, setValidationStatus] = useState('idle');
  const [validationError, setValidationError] = useState('');

  const validatePreviewToken = useCallback(async (rawToken) => {
    const previewToken = String(rawToken || '').trim();
    if (!previewToken) return false;

    setValidationStatus('validating');
    setValidationError('');

    try {
      const response = await base44.functions.invoke('validateMumGardenPreviewToken', {
        token: previewToken,
        route: typeof window !== 'undefined' ? window.location.pathname : 'mum-design-lab',
      });
      const data = unwrapBase44Data(response);

      if (data.valid === true) {
        if (typeof window !== 'undefined') {
          window.sessionStorage.setItem(MUM_GARDEN_ACCESS_KEY, 'validated');
          if (data.token_id) {
            window.sessionStorage.setItem(MUM_GARDEN_ACCESS_TOKEN_ID_KEY, String(data.token_id));
          } else {
            window.sessionStorage.removeItem(MUM_GARDEN_ACCESS_TOKEN_ID_KEY);
          }
          removeMumGardenPreviewTokenFromUrl();
        }
        setAllowed(true);
        setValidationStatus('validated');
        return true;
      }
    } catch (_) {
      setValidationError('The preview token could not be checked right now.');
      setValidationStatus('idle');
      return false;
    }

    if (typeof window !== 'undefined') {
      window.sessionStorage.removeItem(MUM_GARDEN_ACCESS_KEY);
      window.sessionStorage.removeItem(MUM_GARDEN_ACCESS_TOKEN_ID_KEY);
    }
    setAllowed(false);
    setValidationStatus('idle');
    setValidationError('That preview token could not be validated.');
    return false;
  }, []);

  useEffect(() => {
    document.title = "Sonia's Garden Design Lab | Gannon Waye";
    if (allowed || typeof window === 'undefined') return;
    const previewToken = getMumGardenPreviewTokenFromUrl();
    if (!previewToken) return;
    validatePreviewToken(previewToken);
  }, [allowed, validatePreviewToken]);

  if (!allowed) return <PrivatePreviewNotice validationStatus={validationStatus} validationError={validationError} />;

  return (
    <main className="min-h-screen bg-[#030604] text-[#fff7df]">
      <section className="relative overflow-hidden px-5 py-24 md:px-8">
        <img src={SKY_ANGEL_HERO} alt="" aria-hidden="true" className="absolute inset-0 h-full w-full object-cover opacity-58" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(3,6,4,0.74),rgba(3,6,4,0.96)),radial-gradient(circle_at_50%_18%,rgba(245,208,110,0.24),transparent_34%)]" />
        <div className="relative z-10 mx-auto max-w-6xl text-center">
          <p className="font-body text-[10px] uppercase tracking-[0.54em] text-[#f5d06e]/72">Private draft site</p>
          <h1 className="mt-5 font-display text-6xl leading-[0.92] text-[#fff7df] [text-shadow:0_4px_24px_rgba(0,0,0,0.88),0_0_28px_rgba(212,175,55,0.22)] md:text-8xl">
            Five ways Sonia's Garden could feel.
          </h1>
          <p className="mx-auto mt-7 max-w-3xl font-body text-base leading-8 text-[#fff7df]/66">
            Pick the pieces that feel like Mum: foyer, garden flow, memory lane, music player, favourite things, and the premium tone.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            {concepts.map((concept) => (
              <a
                key={concept.number}
                href={`#concept-${concept.number}`}
                className="inline-flex items-center gap-2 rounded-full border border-[#d4af37]/20 bg-[#071007]/52 px-5 py-3 font-body text-[10px] uppercase tracking-[0.24em] text-[#f5d06e] backdrop-blur-md transition hover:border-[#f5d06e]/46 hover:bg-[#f5d06e]/10"
              >
                <Eye className="h-3.5 w-3.5" />
                {concept.number}
              </a>
            ))}
          </div>
        </div>
        <Sparkles className="absolute bottom-10 left-1/2 h-5 w-5 -translate-x-1/2 text-[#f5d06e]/62" />
      </section>

      {concepts.map((concept, index) => (
        <ConceptBoard key={concept.number} concept={concept} index={index} />
      ))}

      <section className="px-5 py-20 md:px-8">
        <div className="mx-auto max-w-5xl rounded-[2rem] border border-[#d4af37]/18 bg-[#071007]/72 p-8 shadow-[0_30px_95px_rgba(0,0,0,0.42)]">
          <p className="font-body text-[10px] uppercase tracking-[0.44em] text-[#f5d06e]/62">Emergent prompt pack</p>
          <h2 className="mt-4 font-display text-5xl text-[#fff7df]">Ready to ask Emergent for five more.</h2>
          <p className="mt-5 font-body text-sm leading-7 text-[#fff7df]/62">
            Build five alternative Sonia's Garden memorial concepts using the current Gannon Waye gold/black cinematic brand, the sky foyer, a continuous garden journey, side memory-lane photos, meaningful centre moments, the Without You Here artwork/player, and strict public rules: no grave images, no funeral-room imagery, no blurred filler, and no images without Sonia unless they are approved object memories.
          </p>
          <a
            href="/mum/garden"
            className="mt-7 inline-flex items-center gap-3 rounded-full bg-[linear-gradient(135deg,#caa647,#f8dc82)] px-6 py-3 font-body text-[10px] font-bold uppercase tracking-[0.26em] text-[#061006] shadow-[0_18px_50px_rgba(212,175,55,0.28)]"
          >
            Back to live garden
            <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </section>
    </main>
  );
}
