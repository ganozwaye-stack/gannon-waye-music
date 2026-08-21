import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Lock, Play, Heart, ChevronDown, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import SignatureQuoteDivider from '@/components/public/SignatureQuoteDivider';
import ShareButtons from '@/components/public/ShareButtons';
import EpisodeNotifyModal from '@/components/public/EpisodeNotifyModal';
import GannonSignature from '@/components/global/GannonSignature';

const EPISODES = [
  {
    number: 1,
    title: 'Childhood',
    hook: 'Before I knew what abuse was, it was already shaping everything.',
    quote: 'I learned to survive before I learned to live.',
    excerpt: "I was born into a family that from the outside probably looked normal. But behind closed doors, life was very different. Abuse was woven into my upbringing in ways that became so normal I didn't even question it at the time.",
    status: 'available',
    color: 'from-primary/10',
  },
  {
    number: 2,
    title: 'Identity',
    hook: 'I woke up every day wishing I could be someone else.',
    quote: 'The world kept telling me who I should be. And I kept trying to become it.',
    excerpt: "As I got older, parts of who I naturally was started becoming too much for the people around me. Creativity became too feminine. Music became too gay. I was learning early that authenticity often came with rejection.",
    status: 'available',
    color: 'from-slate-800/30',
  },
  {
    number: 3,
    title: 'Church & Rejection',
    hook: 'I found belonging. Then I came out. And overnight, it all disappeared.',
    quote: 'People I spoke to daily vanished from my life completely. No conversations. No closure. Just silence.',
    excerpt: "At 21, after coming out again, everything disappeared almost overnight. That experience didn't just hurt me emotionally — it dismantled my understanding of belonging, faith, identity, and trust.",
    status: 'available',
    color: 'from-stone-800/30',
  },
  {
    number: 4,
    title: 'Abuse & Relationships',
    hook: 'I believed love and pain were supposed to coexist.',
    quote: 'Chaos felt familiar. So I kept choosing it.',
    excerpt: 'My relationships eventually mirrored the environments I was raised in. I genuinely believed that love and pain coexisted. That enduring suffering was proof of commitment.',
    status: 'coming_soon',
    color: 'from-red-950/20',
  },
  {
    number: 5,
    title: 'Addiction & Recovery',
    hook: 'At 28, something inside me finally broke differently.',
    quote: 'I called my mum straight away. I stayed honest throughout all of it.',
    excerpt: "At 28, after another major loss, something inside me finally broke differently. For the first time in my life, I turned to drugs. And almost immediately, I knew I was in trouble.",
    status: 'coming_soon',
    color: 'from-zinc-800/30',
  },
  {
    number: 6,
    title: 'Losing Mum',
    hook: 'Even while dying, she was still protecting me.',
    quote: "She organised for someone to be with me when she called to say she didn't have long left. Even in death, she was still loving everyone else first.",
    excerpt: 'She was my person. My best friend. The one person who truly understood me. We lost her only twenty days after diagnosis.',
    status: 'coming_soon',
    color: 'from-neutral-800/30',
  },
  {
    number: 7,
    title: 'PTSD & Survival',
    hook: "Trauma doesn't only live in memory. It lives in the body.",
    quote: "It's not just what happened. It's how it stays.",
    excerpt: "Trauma doesn't only live in memory. It lives in the nervous system. In the body. In the silence after survival.",
    status: 'coming_soon',
    color: 'from-gray-800/30',
  },
  {
    number: 8,
    title: 'Rebuilding',
    hook: 'Six years of learning what I should have been taught at the start.',
    quote: 'I learned how to sit with discomfort instead of running from it.',
    excerpt: 'What followed was six years of deep recovery and self-discovery. Learning emotional regulation, self-awareness, trauma processing, accountability, and emotional intelligence.',
    status: 'coming_soon',
    color: 'from-primary/8',
  },
  {
    number: 9,
    title: 'Music & Purpose',
    hook: 'Music became the place where every part of my story finally had somewhere to go.',
    quote: 'If something I create reaches even one person sitting alone believing they are broken beyond repair\u2026 then every part of this journey matters.',
    excerpt: 'Music has become the place where every part of my story finally has somewhere to go — the abuse, the addiction, the grief, the loss, the identity struggles, the faith, the healing.',
    status: 'coming_soon',
    color: 'from-primary/8',
  },
  {
    number: 10,
    title: 'Still Here',
    hook: "After everything\u2026 I'm still here.",
    quote: 'No more abandoning myself. No more repeating the same cycles. No more shrinking to survive.',
    excerpt: "I'm not healed perfectly. I'm not finished growing. But I'm no longer living the life I used to live. Now I choose differently. Now I see clearly.",
    status: 'coming_soon',
    color: 'from-primary/10',
  },
];

function EpisodeCard({ episode, index, onNotify }) {
  const [expanded, setExpanded] = useState(false);
  const isAvailable = episode.status === 'available';

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05, duration: 0.6 }}
      className={`relative rounded-3xl overflow-hidden border transition-all duration-300 ${
        isAvailable
          ? 'border-primary/30 hover:border-primary/60 cursor-pointer'
          : 'border-border/30 opacity-70'
      }`}
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${episode.color} to-transparent pointer-events-none`} />

      <div
        className="relative p-6 md:p-8"
        onClick={isAvailable ? () => setExpanded(!expanded) : undefined}
      >
        <div className="flex items-center justify-between mb-4">
          <span className="font-body text-[10px] tracking-[0.3em] uppercase text-muted-foreground/60">
            Episode {String(episode.number).padStart(2, '0')}
          </span>
          {isAvailable ? (
            <span className="flex items-center gap-1.5 font-body text-[10px] tracking-widest uppercase text-primary bg-primary/10 px-3 py-1 rounded-full">
              <Play className="w-2.5 h-2.5" /> Read Now
            </span>
          ) : (
            <button
              onClick={(e) => { e.stopPropagation(); onNotify && onNotify(episode); }}
              className="flex items-center gap-1.5 font-body text-[10px] tracking-widest uppercase text-muted-foreground/70 bg-secondary/50 px-3 py-1 rounded-full hover:text-primary hover:border-primary/30 border border-transparent transition-all"
            >
              <Lock className="w-2.5 h-2.5" /> Notify Me
            </button>
          )}
        </div>

        <h3 className="font-display text-2xl md:text-3xl text-foreground mb-2">{episode.title}</h3>
        <p className="font-body text-sm text-foreground/60 leading-relaxed mb-4 italic">{episode.hook}</p>

        <div className="border-l-2 border-primary/40 pl-4 mb-4">
          <p className="font-display text-base gradient-gold-glow italic leading-relaxed">&ldquo;{episode.quote}&rdquo;</p>
        </div>

        {isAvailable && (
          <>
            <button
              onClick={() => setExpanded(!expanded)}
              className="flex items-center gap-2 font-body text-xs tracking-wider uppercase text-primary/70 hover:text-primary transition-colors"
            >
              {expanded ? 'Close' : 'Read excerpt'}
              <ChevronDown className={`w-3 h-3 transition-transform ${expanded ? 'rotate-180' : ''}`} />
            </button>
            <AnimatePresence>
              {expanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <p className="font-body text-sm text-foreground/70 leading-relaxed mt-4 border-t border-border/30 pt-4">
                    {episode.excerpt}
                  </p>
                  <Link to="/back-this" className="inline-flex items-center gap-1.5 mt-4 font-body text-xs text-primary hover:underline">
                    Support this project <ArrowRight className="w-3 h-3" />
                  </Link>
                  <div className="mt-3 flex gap-3">
                    <Link to="/back-this">
                      <button className="font-body text-xs tracking-wider uppercase text-muted-foreground hover:text-primary transition-colors">
                        Support this project 🤍
                      </button>
                    </Link>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </>
        )}
      </div>
    </motion.div>
  );
}

export default function ThisIsMyLife() {
  const [notifyEpisode, setNotifyEpisode] = useState(null);

  return (
    <div className="min-h-screen">

      <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://media.base44.com/images/public/69eb7905ca6eb4180010f794/f5c21dab8_d1726a55-8788-4809-8fe0-1f6814d0da37.png"
            alt="Gannon Waye"
            className="w-full h-full object-cover object-center opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/40 to-background" />
        </div>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="relative z-10 text-center px-6 max-w-3xl mx-auto"
        >
          <p className="font-body text-[10px] tracking-[0.4em] uppercase gradient-gold-glow mb-5">A True Story &middot; In Ten Parts</p>
          <h1 className="font-display text-5xl md:text-7xl text-foreground mb-6 leading-tight">
            This Is My Life
          </h1>
          <p className="font-body text-base md:text-lg text-foreground/60 leading-relaxed max-w-xl mx-auto">
            I&apos;m not sharing my story because I have everything figured out.
            I&apos;m sharing it because I know what it feels like to believe you&apos;re alone.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/music">
              <Button className="rounded-full px-8 py-5 font-body text-sm tracking-wider uppercase gradient-gold-button border-0">
                Hear the Music
              </Button>
            </Link>
            <Link to="/back-this">
              <Button variant="outline" className="rounded-full px-8 py-5 font-body text-sm tracking-wider uppercase border-primary/30 text-primary hover:bg-primary/10">
                <Heart className="w-4 h-4 mr-2" /> Support This
              </Button>
            </Link>
          </div>
        </motion.div>
      </section>

      {/* About / Bio section */}
      <section className="py-16 md:py-20 px-4 md:px-8 border-b border-border/20">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <p className="font-body text-xs tracking-[0.3em] uppercase gradient-gold-glow mb-3">About Gannon</p>
            <h2 className="font-display text-3xl md:text-5xl text-foreground mb-6">Singer. Songwriter. Storyteller.</h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-10 items-start">
            <div className="space-y-4 font-body text-foreground/75 leading-relaxed text-base">
              <p>I was born in Adelaide and now call Melbourne home, a city I've lived in for over 13 years. Music has always been more than sound to me. It's the language I use to understand people, emotion, and the parts of life that don't always have words.</p>
              <p>I think deeply, feel deeply, and notice what others often miss. I'm obsessed with travel and culture. I care about people's wellbeing — sometimes more than they even realise about themselves. That perspective finds its way into everything I write.</p>
              <p>There has been a lot of loss in my world. Losing my Mum not too long ago, who was my best friend and my biggest fan. Also people I love that took their own life and others with diagnoses no one saw coming. These experiences did not just hurt, they reshaped me.</p>
              <p className="italic">I've been misunderstood and mislabelled more times than I can count. But I've learned that being misunderstood doesn't mean you're wrong. It often means you're seeing something others aren't ready for yet.</p>
              <p>Everything I create now comes from that moment of choosing myself. This is not just music. This is choosing yourself.</p>
            </div>

            <div className="flex flex-col items-center gap-6 md:w-52">
              <div className="border-l-2 border-primary pl-4 py-2">
                <p className="font-display text-base gradient-gold-glow italic leading-7">
                  "For them, it was about appearance.<br/>For me, I was breaking inside."
                </p>
                <p className="font-body text-xs text-muted-foreground mt-2 tracking-widest uppercase">Gannon Waye</p>
              </div>
              <div className="flex justify-center">
                <GannonSignature />
              </div>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mt-10 flex flex-col sm:flex-row gap-3 justify-center"
          >
            <Link to="/music">
              <Button className="rounded-full px-7 py-4 font-body text-sm tracking-wider uppercase gradient-gold-button border-0 w-full sm:w-auto">
                Hear the Music <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Link to="/back-this">
              <Button variant="outline" className="rounded-full px-7 py-4 font-body text-sm tracking-wider uppercase border-primary/30 text-primary hover:bg-primary/10 w-full sm:w-auto">
                <Heart className="w-4 h-4 mr-2" /> Support the Project 🤍
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      <section className="py-16 md:py-24 px-4 md:px-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <p className="font-body text-xs tracking-[0.3em] uppercase gradient-gold-glow mb-3">The Series</p>
            <h2 className="font-display text-3xl md:text-5xl text-foreground mb-4">Ten Episodes. One Life.</h2>
            <p className="font-body text-sm text-muted-foreground max-w-lg mx-auto leading-relaxed">
              From childhood to today. Read the chapters as they&apos;re released, or dive into what&apos;s available now.
            </p>
          </motion.div>

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-5 top-4 bottom-4 w-px bg-gradient-to-b from-primary/50 via-primary/20 to-transparent md:left-6" />
            {EPISODES.map((episode, i) => (
              <div key={episode.number} className="relative pl-14 md:pl-20 mb-6">
                {/* Timeline node */}
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                  className={`absolute left-0 top-4 w-10 h-10 md:w-12 md:h-12 rounded-full border-2 flex items-center justify-center font-display text-xs md:text-sm z-10 ${
                    episode.status === 'available'
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-border/50 bg-background text-muted-foreground/50'
                  }`}
                >
                  {String(episode.number).padStart(2, '0')}
                </motion.div>
                <EpisodeCard episode={episode} index={i} onNotify={setNotifyEpisode} />
                {(i === 2 || i === 5 || i === 8) && (
                  <SignatureQuoteDivider quoteIndex={Math.floor(i / 3)} />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-6 text-center border-t border-border/30">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-xl mx-auto"
        >
          <p className="font-display text-2xl md:text-3xl gradient-gold-glow italic mb-4">
            &ldquo;After everything&hellip; I&apos;m still here.&rdquo;
          </p>
          <p className="font-body text-sm text-muted-foreground mb-8 leading-relaxed">
            New episodes release as the story unfolds. Sign up to be notified when the next chapter drops.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/email-preferences">
              <Button className="rounded-full px-8 py-5 font-body text-sm tracking-wider uppercase gradient-gold-button border-0">
                Notify Me of New Episodes
              </Button>
            </Link>
            <Link to="/back-this">
              <Button variant="outline" className="rounded-full px-8 py-5 font-body text-sm tracking-wider uppercase border-foreground/20">
                Be Part of This
              </Button>
            </Link>
          </div>
          <div className="mt-8 flex justify-center">
            <ShareButtons
              url="https://gannonwaye.com/this-is-my-life"
              text="This Is My Life — Gannon Waye. A true story in ten parts."
            />
          </div>
        </motion.div>
      </section>

      {notifyEpisode && (
        <EpisodeNotifyModal episode={notifyEpisode} onClose={() => setNotifyEpisode(null)} />
      )}

    </div>
  );
}