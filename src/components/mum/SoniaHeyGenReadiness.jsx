import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Film, Lock, ShieldCheck, UploadCloud } from 'lucide-react';

const REQUIREMENTS = [
  'Use Gannon narration first, with exact Sonia photos and no public voice clips unless an exact recording is approved.',
  'Any Sonia-style generated test must stay private and clearly labelled as a tribute review asset.',
  'No new Sonia voice lines unless separately approved by Gannon and family.',
  'Final family consent before any generated Sonia-style visual is embedded or shared.',
];

const SAFETY_LINES = [
  'No public deepfake.',
  'No pretending the AI is literally Sonia.',
  'No invented memories.',
  'No new Sonia voice lines unless separately approved.',
];

export default function SoniaHeyGenReadiness() {
  return (
    <motion.div
      className="mx-auto mt-10 max-w-6xl px-5"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.75, delay: 0.08 }}
    >
      <div className="grid gap-5 rounded-[2rem] border border-[#d4af37]/16 bg-[#071007]/78 p-5 shadow-[0_28px_100px_rgba(0,0,0,0.42)] backdrop-blur-md md:grid-cols-[0.95fr_1.05fr] md:p-7">
        <div className="relative overflow-hidden rounded-[1.6rem] border border-[#d4af37]/14 bg-black/24 p-5">
          <div className="absolute -right-16 -top-16 h-44 w-44 rounded-full bg-[#f5d06e]/12 blur-3xl" />
          <div className="relative">
            <div className="mb-7 flex h-14 w-14 items-center justify-center rounded-full border border-[#d4af37]/24 bg-[#f5d06e]/10 text-[#f5d06e]">
              <Film className="h-6 w-6" />
            </div>
            <p className="font-body text-[9px] uppercase tracking-[0.42em] text-[#d4af37]/52">Private tribute film planning</p>
            <h3 className="mt-4 font-display text-4xl leading-tight text-[#fff7df] md:text-5xl">
              Gannon can guide the film. Mum stays real.
            </h3>
            <p className="mt-5 font-body text-sm leading-7 text-[#fff7df]/62">
              The page is prepared for a future private tribute-film workflow, but no public Sonia avatar is active. The safe launch direction is Gannon guiding the viewer, exact Sonia photos, and protected family recordings kept private unless approved.
            </p>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <div className="rounded-[1.1rem] border border-emerald-400/18 bg-emerald-400/8 p-4">
                <p className="font-body text-[9px] uppercase tracking-[0.28em] text-emerald-200/70">Current status</p>
                <p className="mt-2 font-body text-sm leading-6 text-[#fff7df]/68">No Sonia avatar is active on this page.</p>
              </div>
              <div className="rounded-[1.1rem] border border-amber-300/18 bg-amber-300/8 p-4">
                <p className="font-body text-[9px] uppercase tracking-[0.28em] text-amber-100/70">Launch setting</p>
                <p className="mt-2 font-body text-sm leading-6 text-[#fff7df]/68">Gannon-avatar videos are allowed after script approval; Sonia-style generation stays private unless separately approved.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-[1.5rem] border border-[#d4af37]/14 bg-[#fff7df]/[0.052] p-5">
            <div className="flex items-start gap-3">
              <Lock className="mt-1 h-5 w-5 flex-none text-[#f5d06e]" />
              <div>
                <p className="font-display text-2xl text-[#fff7df]">Creation requirements</p>
                <div className="mt-4 grid gap-3">
                  {REQUIREMENTS.map((item) => (
                    <div key={item} className="flex gap-3">
                      <ShieldCheck className="mt-1 h-4 w-4 flex-none text-[#f5d06e]" />
                      <p className="font-body text-sm leading-6 text-[#fff7df]/62">{item}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {SAFETY_LINES.map((line) => (
              <div key={line} className="rounded-[1rem] border border-[#d4af37]/10 bg-black/18 p-3">
                <p className="font-body text-xs leading-5 text-[#fff7df]/58">{line}</p>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-3 pt-1">
            <a
              href="/remember-mum"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#f5d06e] px-5 py-3 font-body text-[10px] font-bold uppercase tracking-[0.22em] text-[#071007] transition hover:-translate-y-0.5"
            >
              <UploadCloud className="h-4 w-4" />
              Family upload link
            </a>
            <a
              href="/admin/family-uploads"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-[#d4af37]/18 bg-black/20 px-5 py-3 font-body text-[10px] font-bold uppercase tracking-[0.22em] text-[#f5d06e]/80 transition hover:-translate-y-0.5"
            >
              <ExternalLink className="h-4 w-4" />
              Admin review
            </a>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
