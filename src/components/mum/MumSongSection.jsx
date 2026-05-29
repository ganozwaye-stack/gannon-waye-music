import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp } from 'lucide-react';

const FULL_LYRICS = `Written in the early hours of Mother's Day, 10 May 2026.

"Your last breath took mine away,
there's not much more I have to say.

I don't wanna live this life without my mama,
but somehow I know I have to.

Every morning feels like gravity —
the weight of what you left behind in me.
I reach for you in spaces you once filled,
and find the silence, loving you still.

Your voice, your laugh, your hands, your eyes —
the way you always saw straight through my lies.
You never asked for perfect, just for real.
And real is all I have now left to feel.

Your last breath took mine away,
there's not much more I have to say.

I don't wanna live this life without my mama,
but somehow I know I have to.

Somehow I know I have to."`;

export default function MumSongSection() {
  const [showLyrics, setShowLyrics] = useState(false);

  return (
    <section id="without-you-here" className="px-4 md:px-8 max-w-3xl mx-auto py-24">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
        className="gsap-reveal"
      >
        <p className="font-body text-[9px] tracking-[0.6em] uppercase text-primary/40 mb-3">The Song</p>
        <h2 className="font-display text-4xl md:text-5xl text-foreground mb-2">Without You Here</h2>
        <p className="font-body text-xs text-muted-foreground/40 tracking-wider mb-8">
          Written in the early hours of Mother's Day, 10 May 2026.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1, delay: 0.2 }}
        className="font-body text-base text-foreground/65 leading-relaxed space-y-4 mb-10 gsap-reveal"
      >
        <p>
          "Without You Here" was written in the early hours of Mother's Day, four years after losing my mum.
        </p>
        <p>
          It came from grief, longing, memory, and the unbearable reality of learning how to keep living after losing the person who grounded so much of my world.
        </p>
        <p>
          This song is for the voice I still reach for. The wisdom I still miss. The love that never left me, even after she did.
        </p>
      </motion.div>

      {/* Primary lyric hook */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.9, delay: 0.3 }}
        className="border-l-2 border-primary/30 pl-6 mb-8 gsap-reveal"
      >
        <p className="font-display text-2xl md:text-3xl italic text-foreground/80 leading-relaxed">
          "Your last breath took mine away,<br />
          there's not much more I have to say."
        </p>
      </motion.div>

      {/* Secondary lyric */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.5 }}
        className="border-l-2 border-border/20 pl-6 mb-10"
      >
        <p className="font-display text-lg italic text-foreground/50 leading-relaxed">
          "I don't wanna live this life without my mama,<br />
          but somehow I know I have to."
        </p>
      </motion.div>

      {/* Expandable lyrics */}
      <button
        onClick={() => setShowLyrics(!showLyrics)}
        className="flex items-center gap-2 font-body text-xs tracking-widest uppercase text-primary/50 hover:text-primary transition-colors border border-primary/20 rounded-full px-6 py-2.5 mb-4"
      >
        {showLyrics ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
        {showLyrics ? 'Hide lyrics' : 'Read full lyrics'}
      </button>

      <AnimatePresence>
        {showLyrics && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.6 }}
            className="overflow-hidden"
          >
            <div
              className="rounded-2xl p-8 mt-2"
              style={{
                background: 'rgba(18,8,14,0.6)',
                border: '1px solid rgba(212,175,55,0.1)',
              }}
            >
              <pre className="font-display text-base italic text-foreground/65 leading-loose whitespace-pre-wrap">
                {FULL_LYRICS}
              </pre>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}