import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { Music2, ChevronDown, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import GannonSignature from '@/components/global/GannonSignature';
import LyricsScroller from '@/components/public/LyricsScroller';
import CinematicLyricsPlayer from '@/components/public/CinematicLyricsPlayer';

export default function LyricsPage() {
  const [openId, setOpenId] = useState(null);
  const [cinematicRelease, setCinematicRelease] = useState(null);

  const { data: releases } = useQuery({
    queryKey: ['releases'],
    queryFn: () => base44.entities.Release.list('-release_date'),
    initialData: [],
  });

  const localReleases = [
    {
      id: 'thank-you',
      title: 'Thank You',
      type: 'Single',
      status: 'released',
      isLocked: false,
      is_published: true,
      artwork_url: '/images/thank_you_cover.png',
      credits: 'Written & Performed by Gannon Waye',
      lyrics: `ThankYou 

Verse 1 
I crossed the oceans just to see your face 
But you met my love with cold, entitled grace 
You wore your ego like a crown so high 
Now I see the truth and I won’t stand by 
The spell is broken, I can feel it lift 
You were never home, you were just a drift  

Pre-Chorus 
I won’t take this anymore 
Watch me walking out that door  

Chorus 
Thank you for showing me just who you are 
Never once did you shine like a loving star 
I see you clearly now, I choose another way 
Respect is earned, not a game you make me play 
You showed me everything I’ll never desire 
Now I’m free and I’m dancing in the fire 
Goodbye, dear sir, your arrogance exposed 
I’m leaving for good, every chapter closed 
Thank you  

Verse 2 
I spent the holidays with your family 
They were the ones who really valued me 
They saw my heart, they saw the love I gave 
While you just took and tried to make me misbehave 
They had the grace that you could never find 
They held the warmth you left behind  

Pre-Chorus 
I won’t take this anymore 
Watch me walking out that door  

Chorus 
Thank you for showing me just who you are 
Never once did you shine like a loving star 
I see you clearly now, I choose another way 
Respect is earned, not a game you make me play 
You showed me everything I’ll never desire 
Now I’m free and I’m dancing in the fire 
Goodbye, dear sir, your arrogance exposed 
I’m leaving for good, every chapter closed 
Thank you  

Bridge 
You thought you broke me, but I broke the chain 
Turned all your chaos into my champagne 
I found my power in the hurt you gave 
Turned every tear into a tidal wave 
Now when I look back, I just raise a glass 
To the boy who chose himself at last  

Chorus 
Thank you for showing me just who you are 
Never once did you shine like a loving star 
I see you clearly now, I choose another way 
Respect is earned, not a game you make me play 
You showed me everything I’ll never desire 
Now I’m free and I’m dancing in the fire 
Goodbye, dear sir, your arrogance exposed 
I’m leaving for good, every chapter closed 
Thank you 

Copyright © Gannon Waye 2026`
    },
    {
      id: 'without-you-here',
      title: 'Without You Here',
      type: 'Single',
      status: 'recording',
      isLocked: true,
      is_published: true,
      artwork_url: '/images/mum/mum_gannon_young.jpg',
      credits: 'Written & Performed by Gannon Waye',
      lyrics: `Without You Here

Verse 1
You sent someone to be there when you called
because You didn’t want me to be alone.
You said, “My boy… I don’t think I’ve got long”
I’m thinking this must all be wrong.
Stage four, you said I dropped everything, 
I flew back and I saw you in pain. 
Hard to look into your eyes
This pain I can’t disguise.
Never thought that I’d lose you,
It was only twenty days.
Mumma, I can’t do this without you,
It’s not the way that I had planned.

Chorus
I don’t wanna live this life without you here
I never thought the world could feel this wrong
Cause you were the voice
that made my troubles disappear
And now there’s silence
where your wisdom used to be
I’ve been up thinking about how I’m alone
Thinking about how you’re not here anymore
You were my best friend
How am I supposed to do this without you here?

Verse 2
There’s a wisdom that I’m missing now
without your voice inside my ear.
Sometimes I still go to call you
before remembering you’re not here.
And it’s hard to picture life
without your eyes looking back at me.
You were the one person
who always truly saw me.
People say that time heals things
but honestly, your absence just gets louder
And some nights I still break down
trying to undo the ending.

Pre-chorus
Now I can’t breathe in this living hell
you protected me, I could tell
Thanks for your apology 
now go and you’ll be free but

Chorus
I don’t wanna live this life without you here
I never thought the world could feel this wrong
Cause you were the voice
that made my troubles disappear
And now there’s silence
where your wisdom used to be
I’ve been up thinking about how I’m alone
Thinking about how you’re not here anymore
You were my best friend
How am I supposed to do this without you here?

Bridge
Two seconds without you feels too long.
Some days I still wanna disappear.
But I know you’d hate to hear me say that
because even while dying,
you were still trying to help me heal
And maybe that’s the hardest part of losing you
Even while leaving. you were still loving me.
Your last breath took mine away
There’s not much more I have to say.

Final Chorus
I don’t wanna live this life without my mama
But somehow I know I have to
Cause every part of me that survives this,
will survive because of you.
Your voice, your heart
the way you loved us
Still lives inside of me.
I’ve been up thinking about how I’m alone
Thinking about how you’re not here anymore
But I still hear you say
“Boy… you’re not finished yet”

Outro
I miss you so much
That’s why I wrote this song right here
You didn’t want me alone
So I’ll learn how to live
carrying your love with me

Written by: Gannon Waye 
Mothers Day 10 May 2026 @ 12:30am`
    },
    {
      id: 'will-you-even-listen',
      title: 'Will You Even Listen',
      type: 'Single',
      status: 'recording',
      isLocked: true,
      is_published: true,
      artwork_url: '/images/will_you_even_listen_cover.png',
      credits: 'Written & Performed by Gannon Waye',
      lyrics: `Will You Even Listen

[Verse 1]
If I tell you everything 
that's going on inside of me
Will you even listen?
Will you even care?
Everything that's happening is happening to me!!
The storm in my mind is tearing me apart,
A million whys I can't answer, no end or start.  

[Pre-Chorus]
I’m shattered by the weight I carry,
Confused, wounded, feeling buried.
Need you to stand, to hold me tight,
Help me through this endless night.  

[Chorus]
No words can heal this headache in my head,
A hurricane of questions, tears unsaid.
You’ve got to man up, be the strength I trust,
Help me heal, rebuild from this dust.
Take the pain, the tears, the blame,
Together, we can break the chains.  

[Verse 2]
Lies unfolded on our first trip away,
Hidden truths that haunted every day.
My mind's a battlefield of doubt and pain,
The damage done, I’m left to feel the strain.
Planned a Christmas Eve to propose,
But darkness crept where love once rose.
Betrayal whispers, cut so deep,
In the silence, I can't find sleep.  

[Pre-Chorus]
I’m shattered by the weight I carry,
Confused, wounded, feeling buried.
Need you to stand, to hold me tight,
Help me through this endless night.  

[Chorus]
No words can heal this headache in my head,
A hurricane of questions, tears unsaid.
You’ve got to man up, be the strength I trust,
Help me heal, rebuild from this dust.
Take the pain, the tears, the blame,
Together, we can break the chains.  

[Bridge]
The hurt, the lies, the scars I wear,
A testament to how much I care.
But I need your help, your song to my tears,
To fight this agony and face my fears.  

[Pre-Chorus]
I’m shattered by the weight I carry,
Confused, wounded, feeling buried.
Need you to stand, to hold me tight,
Help me through this endless night.  

[Chorus]
No words can heal this headache in my head,
A hurricane of questions, tears unsaid.
You’ve got to man up, be the strength I trust,
Help me heal, rebuild from this dust.
Take the pain, the tears, the blame,
Together, we can break the chains. 

[Outro]
In dismissive words or distant eyes,
I seek the truth beyond the lies.
Though chaos reigns within my mind,
With you beside me, I’ll find the light.  

Written by: Gannon Waye
Copyright © - Gannon Waye, 2025`
    }
  ];

  // Merge releases from database with our hardcoded local releases.
  // Local releases take precedence to ensure correct status/lyrics.
  const withLyrics = [
    ...localReleases,
    ...releases.filter(r => r.is_published && r.lyrics && !localReleases.some(lr => lr.title.toLowerCase() === r.title.toLowerCase()))
  ];

  return (
    <div className="min-h-screen py-24 px-4 md:px-8 bg-background text-foreground">
      <div className="max-w-3xl mx-auto">

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-14"
        >
          <p className="font-body text-xs tracking-[0.3em] uppercase gradient-gold-glow mb-4">Words & Meaning</p>
          <h1 className="font-display text-4xl md:text-6xl text-foreground mb-5">Lyrics</h1>
          <p className="font-body text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
            Every word is intentional. Read along, sit with it, or find the line that feels like yours.
          </p>
        </motion.div>

        {withLyrics.length === 0 ? (
          <div className="text-center py-20">
            <Music2 className="w-14 h-14 text-muted-foreground/20 mx-auto mb-4" />
            <p className="font-body text-muted-foreground">Lyrics will be revealed when "Thank You" by Gannon Waye drops on June 5, 2026.</p>
            <Link to="/music" className="mt-4 inline-block">
              <Button variant="outline" className="rounded-full font-body text-sm tracking-wider uppercase mt-4">
                Go to Music
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {withLyrics.map((release, i) => (
              <motion.div
                key={release.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className="bg-card border border-border/40 rounded-2xl overflow-hidden shadow-lg shadow-black/10"
              >
                <button
                  onClick={() => setOpenId(openId === release.id ? null : release.id)}
                  className="w-full flex items-center justify-between px-6 py-5 text-left hover:bg-secondary/20 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    {release.artwork_url && (
                      <img src={release.artwork_url} alt={release.title} className="w-12 h-12 rounded-lg object-cover border border-[#c9a84c]/20" />
                    )}
                    <div>
                      <p className="font-display text-xl text-foreground">{release.title}</p>
                      <p className="font-body text-xs text-muted-foreground uppercase tracking-widest mt-0.5">{release.type}</p>
                    </div>
                  </div>
                  <ChevronDown className={`w-5 h-5 text-muted-foreground transition-transform ${openId === release.id ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {openId === release.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-8 border-t border-border/30 pt-6 space-y-6">
                        {release.isLocked ? (
                          <div className="bg-gradient-to-br from-card to-secondary/30 rounded-2xl p-8 border border-border/40 backdrop-blur-md text-center py-12 relative overflow-hidden">
                            <div className="absolute -inset-10 bg-gradient-to-r from-yellow-500/10 to-amber-500/10 rounded-full blur-2xl opacity-60 animate-pulse pointer-events-none" />
                            
                            <div className="relative z-10 flex flex-col items-center">
                              <div className="w-16 h-16 rounded-full bg-secondary/50 flex items-center justify-center border border-yellow-500/30 text-yellow-500 mb-4 shadow-lg shadow-yellow-500/5">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
                                </svg>
                              </div>
                              <h3 className="font-display text-2xl text-foreground mb-2">Studio Session</h3>
                              <p className="font-body text-sm text-yellow-500/90 tracking-wider uppercase font-semibold mb-3">Release Pending</p>
                              <p className="font-body text-base text-muted-foreground max-w-md">
                                Lyrics under studio wraps — Single drop coming soon.
                              </p>
                            </div>
                          </div>
                        ) : (
                          <>
                            {/* Cinematic Trigger Button */}
                            <div className="p-1 bg-gradient-to-r from-amber-500/20 to-yellow-600/20 rounded-2xl border border-yellow-500/20">
                              <Button
                                onClick={() => setCinematicRelease(release)}
                                className="w-full py-6 rounded-xl font-body text-sm font-semibold gradient-gold-button border-0 flex items-center justify-center gap-2 text-black"
                              >
                                <Sparkles className="w-4 h-4" /> ⚡ Launch Cinematic Interactive Player
                              </Button>
                            </div>

                            {/* Scroller */}
                            <LyricsScroller release={release} />

                            {/* Traditional view */}
                            <div>
                              <p className="font-body text-xs text-muted-foreground uppercase tracking-widest mb-4">Traditional View</p>
                              <pre className="font-display text-foreground/80 leading-loose text-base whitespace-pre-wrap italic bg-secondary/10 border border-border/20 rounded-xl p-6 select-text">
                                {release.lyrics}
                              </pre>
                            </div>
                          </>
                        )}
                        {release.credits && (
                          <p className="font-body text-xs text-muted-foreground mt-6 pt-4 border-t border-border/30">
                            {release.credits}
                          </p>
                        )}
                        {/* Signature */}
                        <div className="flex justify-end mt-8 pr-4">
                          <GannonSignature />
                        </div>

                        <div className="flex gap-3 mt-5 flex-wrap">
                          {release.spotify_link && (
                            <a href={release.spotify_link} target="_blank" rel="noopener noreferrer">
                              <Button size="sm" className="rounded-full gap-2 font-body text-xs gradient-gold-button border-0">
                                🎧 Listen on Spotify
                              </Button>
                            </a>
                          )}
                          {release.apple_music_link && (
                            <a href={release.apple_music_link} target="_blank" rel="noopener noreferrer">
                              <Button size="sm" variant="outline" className="rounded-full gap-2 font-body text-xs">
                                🍎 Apple Music
                              </Button>
                            </a>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        )}

        <div className="mt-12 text-center">
          <Link to="/back-this">
            <Button variant="outline" className="rounded-full font-body text-sm tracking-wider uppercase border-primary/30 text-primary hover:bg-primary/10">
              Support the Music 🤍
            </Button>
          </Link>
        </div>

      </div>

      {/* Cinematic Lyrics Player Modal Overlay */}
      <AnimatePresence>
        {cinematicRelease && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50"
          >
            <CinematicLyricsPlayer 
              release={cinematicRelease} 
              onClose={() => setCinematicRelease(null)} 
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}