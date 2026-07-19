import React from 'react';
import { motion } from 'framer-motion';
import { LockKeyhole, Mic2, ShieldCheck } from 'lucide-react';

const VOICE_NOTES = [
  {
    id: 'happy-birthday',
    title: 'Happy Birthday voice note',
    note: 'Original Sonia recording kept as a family memory.',
  },
  {
    id: 'voicemail',
    title: 'Voicemail from Mum',
    note: 'Original voicemail audio, presented as she left it.',
  },
  {
    id: 'horsham',
    title: 'Horsham voice note',
    note: 'Original voice note for the private family archive.',
  },
];

export default function SoniaVoiceNotes() {
  return (
    <motion.section
      id="sonia-voice-notes"
      className="mx-auto mt-16 max-w-4xl px-4"
      initial={{ opacity: 0, y: 26 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-12%' }}
      transition={{ duration: 0.8 }}
    >
      <div className="rounded-[2rem] border border-[#d4af37]/16 bg-[#071007]/76 p-5 shadow-[0_28px_95px_rgba(0,0,0,0.40)] backdrop-blur-md md:p-7">
        <div className="grid gap-6 md:grid-cols-[0.82fr_1.18fr] md:items-start">
          <div>
            <div className="flex h-12 w-12 items-center justify-center rounded-full border border-[#d4af37]/18 bg-[#f5d06e]/10 text-[#f5d06e]">
              <Mic2 className="h-5 w-5" />
            </div>
            <p className="mt-5 font-body text-[9px] uppercase tracking-[0.42em] text-[#d4af37]/52">Her real voice</p>
            <h3 className="mt-3 font-display text-3xl leading-tight text-[#fff7df] md:text-4xl">
              Voice notes Sonia left behind.
            </h3>
            <p className="mt-4 font-body text-sm leading-7 text-[#fff7df]/58">
              These recordings are real, intimate, and family-sensitive. For the public garden, they stay protected unless Gannon and family approve an exact clip and placement.
            </p>
            <div className="mt-5 flex gap-3 rounded-[1.2rem] border border-[#d4af37]/12 bg-black/18 p-4">
              <ShieldCheck className="mt-0.5 h-4 w-4 flex-none text-[#f5d06e]" />
              <p className="font-body text-xs leading-6 text-[#fff7df]/50">
                Launch-safe setting: no public raw voice notes, no fake talking-mouth avatar, and no generated voice saying new words as Sonia.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {VOICE_NOTES.map((voice) => (
              <article
                key={voice.id}
                className="rounded-[1.35rem] border border-[#d4af37]/14 bg-[#fff7df]/[0.045] p-4"
              >
                <div className="mb-3 flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#f5d06e]/12 text-[#f5d06e]">
                    <LockKeyhole className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="font-display text-xl text-[#fff7df]">{voice.title}</h4>
                    <p className="mt-1 font-body text-xs leading-5 text-[#fff7df]/48">{voice.note}</p>
                  </div>
                </div>
                <div className="rounded-full border border-[#d4af37]/12 bg-black/18 px-4 py-2 font-body text-[10px] uppercase tracking-[0.22em] text-[#d4af37]/56">
                  Private archive only
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </motion.section>
  );
}
