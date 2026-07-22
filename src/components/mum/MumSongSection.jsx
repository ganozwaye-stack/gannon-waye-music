import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { WITHOUT_YOU_HERE_RELEASE_DATE_TEXT } from '@/config/releaseSchedule';

const FULL_LYRICS = `Without You Here

Verse 1
You sent someone to be there when you called
because You didn't want me to be alone.
You said, "My boy... I don't think I've got long"
I'm thinking this must all be wrong.
Stage four, you said I dropped everything,
Flew back and I saw you in pain.
Hard to look into your eyes
This pain I can't disguise.
Never thought that I'd lose you,
It was only twenty days.
Mumma, I can't do this without you,
It's not the way that I had planned.

Chorus
I don't wanna live this life without you here
I never thought the world could feel this wrong
Cause you were the voice
To make my troubles disappear
And now there's silence
where your wisdom used to be
I've been up thinking about how I'm alone
Thinking about how you're not here anymore
You were my best friend
How am I supposed to do this without you here?

Verse 2
There's a wisdom that I'm missing now
without your voice inside my ear.
Sometimes I still try to call you
before remembering you're not here.
And it's hard to picture life
without your eyes looking back at me.
You were the one person
who always truly saw me.
People say that time heals things
but honestly, your absence just gets louder
And some nights I still break down
trying to undo the ending.

Pre-chorus
Now I can't breathe in this living hell
you protected me, I could tell
Thanks for your apology
now go and you'll be free cause

Chorus
I don't wanna live this life without my mama
I never thought the world could feel this wrong
Cause you were the voice
that made my troubles disappear
And now there's silence
where your wisdom used to be
I've been up thinking about how I'm alone
Thinking about how you're not here anymore
You were my best friend
How am I supposed to do this without you here?

Bridge
Two seconds without you feels too long.
Some days I still wanna disappear.
But I know you'd hate to hear me say that
because even while dying,
you were still trying to keep me here.
And maybe that's the hardest part of losing you
Even while leaving. you were still loving me.
Your last breath took mine away
There's not much more I have to say.

Final Chorus
I don't wanna live this life without my mum
But somehow I know I have to
Cause every part of me that survives this,
will survive because of you.
Your voice, your heart
the way you loved me
Still lives inside of me.
I've been up thinking about how I'm alone
Thinking about how you're not here anymore
But I still hear you say
"Boy... you're not finished yet"

Outro
I miss you so much
That's why I wrote this song right here
You didn't want me alone
So I'll learn how to live
carrying your love with me

Written by: Gannon Waye
Mothers Day
10 May 2026 @ 12:30am

Copyright Gannon Waye. All rights reserved.`;

export default function MumSongSection() {
  const [lyricsOpen, setLyricsOpen] = useState(false);

  return (
    <section id="without-you-here" className="px-4 md:px-8 max-w-3xl mx-auto py-16">
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
          Written in the loungeroom, in the early hours of Mothers Day, 10 May 2026.
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
          "Without You Here" was written in the loungeroom, in the early hours of Mothers Day, four years after losing my mum.
        </p>
        <p>
          It came from grief, longing, memory, and the unbearable reality of learning how to keep living after losing the person who grounded so much of my world.
        </p>
        <p>
          This song is for the voice I still reach for. The wisdom I still miss. The love that never left me, even after she did.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.9, delay: 0.3 }}
        className="border-l-2 border-primary/30 pl-6 mb-8 gsap-reveal"
      >
        <p className="font-display text-2xl md:text-3xl italic text-foreground/80 leading-relaxed">
          "Your last breath took mine away.<br />
          There's not much more I have to say."
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.5 }}
        className="border-l-2 border-border/20 pl-6 mb-10"
      >
        <p className="font-display text-lg italic text-foreground/50 leading-relaxed">
          "I don't wanna live this life without my mum,<br />
          but somehow I know I have to."
        </p>
      </motion.div>

      <AnimatePresence mode="wait">
        {!lyricsOpen ? (
          <motion.div
            key="lyrics-preview-closed"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ scale: 1.1, opacity: 0 }}
            className="flex flex-col items-start gap-3 mb-4"
          >
            <p className="font-body text-[9px] tracking-[0.4em] uppercase" style={{ color: 'rgba(212,175,55,0.28)' }}>
              Full lyrics - Releasing {WITHOUT_YOU_HERE_RELEASE_DATE_TEXT}
            </p>
            <motion.button
              onClick={() => setLyricsOpen(true)}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              className="flex items-center gap-3 font-body text-xs tracking-widest uppercase px-6 py-3 rounded-full transition-all"
              style={{ border: '1px solid rgba(212,175,55,0.25)', color: 'rgba(212,175,55,0.65)' }}
            >
              Open the full lyrics preview
            </motion.button>
          </motion.div>
        ) : (
          <motion.div
            key="lyrics-preview-open"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.7 }}
            className="overflow-hidden mb-4"
          >
            <div className="rounded-2xl p-8 mt-2" style={{ background: 'rgba(8,14,8,0.72)', border: '1px solid rgba(212,175,55,0.12)' }}>
              <div className="flex items-center gap-2 mb-4">
                <p className="font-body text-[9px] tracking-[0.4em] uppercase" style={{ color: 'rgba(212,175,55,0.28)' }}>Full lyrics preview - Copyright Gannon Waye 2026</p>
              </div>
              <pre className="font-display text-base italic text-foreground/65 leading-loose whitespace-pre-wrap">
                {FULL_LYRICS}
              </pre>
              <p className="font-body text-[9px] tracking-[0.3em] uppercase mt-4" style={{ color: 'rgba(212,175,55,0.18)' }}>
                Full song releasing {WITHOUT_YOU_HERE_RELEASE_DATE_TEXT} - All rights reserved
              </p>
            </div>
            <button onClick={() => setLyricsOpen(false)} className="mt-3 font-body text-[9px] tracking-[0.3em] uppercase" style={{ color: 'rgba(212,175,55,0.28)' }}>
              Close
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
