import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Film, Lock, Mic2, ShieldCheck, UploadCloud } from 'lucide-react';

const REQUIREMENTS = [
  'One approved Sonia reference photo or short video that the family is comfortable uploading to HeyGen.',
  'A short approved script written as Gannon speaking about Sonia, not Sonia speaking new words.',
  'A chosen voice direction: Gannon narration, original Sonia clips only, or clearly labelled synthetic review material.',
  'Final family consent before any generated Sonia-style video is embedded or shared.',
];

const SAFETY_LINES = [
  'No public deepfake.',
  'No pretending the AI is literally Sonia.',
  'No invented memories.',
  'No new Sonia voice lines unless separately approved.',
];

export default function SoniaHeyGenReadiness({ onVoice }) {
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
            <p className="font-body text-[9px] uppercase tracking-[0.42em] text-[#d4af37]/52">HeyGen real-life version</p>
            <h3 className="mt-4 font-display text-4xl leading-tight text-[#fff7df] md:text-5xl">
              Ready to create, locked until approved.
            </h3>
            <p className="mt-5 font-body text-sm leading-7 text-[#fff7df]/62">
              The page is prepared for a future lifelike review film, but no Sonia photo, video, or voice has been uploaded to HeyGen from this build. The first safe version should feel like a memorial film with Gannon guiding the viewer, not technology pretending Mum is alive.
            </p>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <div className="rounded-[1.1rem] border border-emerald-400/18 bg-emerald-400/8 p-4">
                <p className="font-body text-[9px] uppercase tracking-[0.28em] text-emerald-200/70">Current status</p>
                <p className="mt-2 font-body text-sm leading-6 text-[#fff7df]/68">No private HeyGen Sonia/Gannon avatar found yet.</p>
              </div>
              <div className="rounded-[1.1rem] border border-amber-300/18 bg-amber-300/8 p-4">
                <p className="font-body text-[9px] uppercase tracking-[0.28em] text-amber-100/70">Launch setting</p>
                <p className="mt-2 font-body text-sm leading-6 text-[#fff7df]/68">Review-only until Gannon approves the exact generated output.</p>
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
              href="/family/sonia-upload?invite=family"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#f5d06e] px-5 py-3 font-body text-[10px] font-bold uppercase tracking-[0.22em] text-[#071007] transition hover:-translate-y-0.5"
            >
              <UploadCloud className="h-4 w-4" />
              Family upload link
            </a>
            {onVoice && (
              <button
                type="button"
                onClick={onVoice}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-[#d4af37]/24 bg-[#fff7df]/[0.045] px-5 py-3 font-body text-[10px] font-bold uppercase tracking-[0.22em] text-[#f5d06e] transition hover:-translate-y-0.5"
              >
                <Mic2 className="h-4 w-4" />
                Review original voice
              </button>
            )}
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
