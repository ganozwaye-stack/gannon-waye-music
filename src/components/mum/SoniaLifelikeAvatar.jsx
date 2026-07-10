import React from 'react';
import { motion } from 'framer-motion';
import { Camera, Heart, ShieldCheck, Volume2 } from 'lucide-react';

const APPROVED_RULES = [
  'Uses an exact Sonia garden photo only.',
  'No generated face, no face swap, no strange portrait crop.',
  'No talking-mouth avatar is active on this page.',
  'Original Sonia voice notes can play only as original recordings.',
  'Any future animation must be approved before it appears publicly.',
];

export default function SoniaLifelikeAvatar({ onComfort, onVoice }) {
  return (
    <div className="mx-auto mt-14 grid max-w-6xl gap-7 px-5 lg:grid-cols-[0.92fr_1.08fr] lg:items-center">
      <motion.div
        className="relative mx-auto w-full max-w-[460px]"
        initial={{ opacity: 0, y: 26 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.75 }}
      >
        <div className="absolute -inset-8 rounded-[3rem] bg-[#f5d06e]/12 blur-3xl" />
        <div className="absolute -left-10 top-20 h-44 w-44 rounded-full bg-emerald-300/10 blur-3xl" />

        <div className="relative overflow-hidden rounded-[2.3rem] border border-[#d4af37]/24 bg-[#071007]/82 p-4 shadow-[0_32px_110px_rgba(0,0,0,0.52)] backdrop-blur-md">
          <div className="relative overflow-hidden rounded-[1.8rem] bg-[#030603]">
            <motion.img
              src="/images/mum/mum_garden.jpg"
              alt="Sonia in her garden with coffee"
              className="h-[620px] w-full object-cover object-[center_18%] saturate-[1.04] contrast-[1.03]"
              initial={{ opacity: 0, scale: 1.025 }}
              whileInView={{ opacity: 1, scale: 1.045 }}
              viewport={{ once: true }}
              transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
            />

            <div className="absolute inset-0 bg-gradient-to-t from-[#020502] via-transparent to-transparent" />
            <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-[#f5d06e]/10 to-transparent" />

            <div className="absolute bottom-5 left-5 right-5 rounded-[1.4rem] border border-[#d4af37]/18 bg-[#020502]/72 p-4 backdrop-blur-md">
              <p className="font-body text-[9px] uppercase tracking-[0.32em] text-[#d4af37]/62">Exact photo only</p>
              <p className="mt-2 font-display text-2xl text-[#fff7df]">Sonia, in her garden.</p>
              <p className="mt-2 font-body text-xs leading-5 text-[#fff7df]/58">
                This is the safe direction: her real image, softly framed, without inventing a new version of her.
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div
        className="rounded-[2rem] border border-[#d4af37]/16 bg-[#071007]/76 p-6 shadow-[0_26px_90px_rgba(0,0,0,0.38)] backdrop-blur-md md:p-8"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.75, delay: 0.08 }}
      >
        <div className="flex h-12 w-12 items-center justify-center rounded-full border border-[#d4af37]/18 bg-[#f5d06e]/10 text-[#f5d06e]">
          <Camera className="h-5 w-5" />
        </div>

        <p className="mt-6 font-body text-[9px] uppercase tracking-[0.42em] text-[#d4af37]/52">Launch-safe memory presence</p>
        <h3 className="mt-4 font-display text-4xl leading-tight text-[#fff7df] md:text-5xl">
          Her presence should feel real because the image is real.
        </h3>

        <div className="mt-6 rounded-[1.5rem] border border-[#d4af37]/14 bg-[#fff7df]/[0.055] p-5">
          <p className="font-display text-2xl italic leading-snug text-[#fff7df]/90">
            We are not recreating Mum. We are giving her real photos, her real voice notes, and Gannon’s real memories a beautiful place to breathe.
          </p>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {APPROVED_RULES.map((rule) => (
            <div key={rule} className="flex gap-3 rounded-[1.1rem] border border-[#d4af37]/12 bg-black/18 p-4">
              <ShieldCheck className="mt-0.5 h-4 w-4 flex-none text-[#f5d06e]" />
              <p className="font-body text-sm leading-6 text-[#fff7df]/62">{rule}</p>
            </div>
          ))}
        </div>

        <div className="mt-7 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={onComfort}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-[#f5d06e] px-6 py-3 font-body text-[10px] font-bold uppercase tracking-[0.24em] text-[#071007] transition hover:-translate-y-0.5"
          >
            <Heart className="h-4 w-4" />
            Open comfort room
          </button>
          {onVoice && (
            <button
              type="button"
              onClick={onVoice}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-[#d4af37]/24 bg-[#fff7df]/[0.045] px-6 py-3 font-body text-[10px] font-bold uppercase tracking-[0.24em] text-[#f5d06e] transition hover:-translate-y-0.5"
            >
              <Volume2 className="h-4 w-4" />
              Hear real voice notes
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
}
