import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import MovingHeart from './MovingHeart';

const LYRICS = `Your last breath took mine away,
there's not much more I have to say.

I don't wanna live this life without my mama,
but somehow I know I have to.

Every morning I reach for the phone,
every night I feel it most — I'm alone.
Your voice is the one I still need to hear,
your name is the one I call when no one's near.

You left the way you lived — protecting me,
even while leaving, you were still loving me.`;

export default function MumSongSection() {
  const [lyricsOpen, setLyricsOpen] = useState(false);

  return (
    <section id="the-song" className="px-4 md:px-8 max-w-3xl mx-auto py-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-12"
      >
        <p className="font-body text-[10px] tracking-[0.5em] uppercase gradient-gold-glow mb-3">Without You Here</p>
        <p className="font-body text-xs text-muted-foreground/50">Written in the early hours of Mother's Day, 10 May 2026</p>
      </motion.div>

      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="bg-card/25 border border-primary/10 rounded-3xl p-8 md:p-10"
        >
          <p className="font-body text-foreground/68 leading-relaxed text-base mb-5">
            "Without You Here" was written in the early hours of Mother's Day, four years after losing my mum.
          </p>
          <p className="font-body text-foreground/68 leading-relaxed text-base mb-5">
            It came from grief, longing, memory, and the unbearable reality of learning how to keep living after losing the person who grounded so much of my world.
          </p>
          <p className="font-body text-foreground/68 leading-relaxed text-base">
            This song is for the voice I still reach for.<br />
            The wisdom I still miss.<br />
            The love that never left me, even after she did.
          </p>
        </motion.div>

        {/* Primary lyric hook card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="gsap-reveal border border-primary/22 rounded-2xl p-8 text-center"
          style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(212,175,55,0.04) 0%, transparent 70%), rgba(0,0,0,0.2)' }}
        >
          <MovingHeart size="sm" />
          <p className="font-display text-2xl md:text-3xl italic text-foreground/88 leading-relaxed mt-5 mb-4">
            "Your last breath took mine away,<br />
            there's not much more I have to say."
          </p>
          <div className="w-10 h-px bg-primary/25 mx-auto my-4" />
          <p className="font-display text-lg italic text-foreground/55 leading-relaxed">
            "I don't wanna live this life without my mama,<br />
            but somehow I know I have to."
          </p>
        </motion.div>

        {/* Expandable lyrics */}
        <div className="text-center">
          <button
            onClick={() => setLyricsOpen(!lyricsOpen)}
            className="inline-flex items-center gap-2 font-body text-xs tracking-wider uppercase text-primary/55 hover:text-primary transition-colors border border-primary/18 rounded-full px-6 py-2.5"
          >
            {lyricsOpen ? 'Close Lyrics' : 'Read Full Lyrics'}
            <ChevronDown className={`w-3 h-3 transition-transform ${lyricsOpen ? 'rotate-180' : ''}`} />
          </button>
        </div>

        <AnimatePresence>
          {lyricsOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="overflow-hidden"
            >
              <div className="bg-card/25 border border-primary/10 rounded-2xl p-8">
                <pre className="font-display text-base italic text-foreground/65 leading-relaxed whitespace-pre-wrap text-center">
                  {LYRICS}
                </pre>
                <p className="font-body text-[10px] text-muted-foreground/35 text-center mt-6 tracking-widest uppercase">
                  Written · Mother's Day · 10 May 2026 · 12:30am
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}