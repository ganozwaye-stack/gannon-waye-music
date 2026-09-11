import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { MessageCircle, ShoppingBag, Sparkles, Headphones } from 'lucide-react';

// Ambient brand loop, the approved campfire video used across the site.
const GUIDE_VIDEO =
  'https://media.base44.com/videos/public/69eb7905ca6eb4180010f794/8e23b3544_Ambient_Hero_Loop.mp4';

// Narrations are recorded with the site voice, from Gannon-approved copy.
// House style: no em dashes, gold essence palette only.
const LESSONS = [
  {
    key: 'community',
    icon: MessageCircle,
    title: 'Join the Community',
    description:
      'How to share your story, be recognised for showing up, and keep the words that matter to you close.',
    audioUrl:
      'https://media.base44.com/files/public/69eb7905ca6eb4180010f794/f17812bcd_speech.mp3',
    steps: [
      { label: 'See the fan leaderboard', to: '/fan-leaderboard' },
      { label: 'Open your fan profile', to: '/fan-profile' },
      { label: 'Save a lyric you love', to: '/lyrics' },
    ],
  },
  {
    key: 'store',
    icon: ShoppingBag,
    title: 'Buy Music and Merch',
    description:
      'A walkthrough of the boutique: live prices on the storefront, checkout, receipts and order tracking.',
    audioUrl:
      'https://media.base44.com/files/public/69eb7905ca6eb4180010f794/9c5bd3347_speech.mp3',
    steps: [
      { label: 'Enter the boutique', to: '/store' },
      { label: 'Track an order', to: '/order-status' },
      { label: 'Ask about anything', to: '/contact' },
    ],
  },
  {
    key: 'features',
    icon: Sparkles,
    title: 'Use the New Features',
    description:
      'Pre-saving, release update emails, your dashboard, and finding the right song for your mood.',
    audioUrl:
      'https://media.base44.com/files/public/69eb7905ca6eb4180010f794/4f3899c55_speech.mp3',
    steps: [
      { label: 'Pre-save the next release', to: '/presave' },
      { label: 'Discover music by mood', to: '/discover' },
      { label: 'Manage your emails', to: '/email-preferences' },
    ],
  },
];

export default function FanGuide() {
  return (
    <div className="min-h-screen py-20 px-4 md:px-6">
      {/* Header with the ambient brand loop behind it */}
      <section className="relative overflow-hidden rounded-3xl border border-border/30 mb-14"
        style={{ background: 'linear-gradient(135deg, rgba(8,8,14,0.6), rgba(8,8,14,0.3))' }}>
        <video
          src={GUIDE_VIDEO}
          autoPlay
          loop
          muted
          playsInline
          aria-hidden
          className="absolute inset-0 w-full h-full object-cover opacity-20 pointer-events-none"
        />
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(110% 80% at 50% 40%, rgba(8,8,14,0) 40%, rgba(8,8,14,0.8) 100%)' }} />
        <div className="relative z-10 text-center px-6 py-20">
          <p className="font-body text-xs tracking-[0.35em] uppercase gradient-gold-glow mb-4">Fan Guide</p>
          <h1 className="font-display text-4xl md:text-6xl gradient-gold-text mb-4">Everything Here Is For You</h1>
          <p className="font-body text-sm text-foreground/80 max-w-xl mx-auto leading-relaxed">
            Three short walkthroughs with audio guidance, each under a minute. Press play
            and follow along, or read the steps if you prefer.
          </p>
        </div>
      </section>

      {/* Lessons */}
      <div className="max-w-3xl mx-auto space-y-6">
        {LESSONS.map((lesson, index) => {
          const Icon = lesson.icon;
          return (
            <motion.article
              key={lesson.key}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6 }}
              className="rounded-2xl border border-border/40 p-6 md:p-8"
              style={{ background: 'linear-gradient(135deg, rgba(8,8,14,0.55), rgba(8,8,14,0.25))' }}
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="w-11 h-11 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center text-primary flex-shrink-0">
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-body text-[9px] tracking-[0.3em] uppercase text-muted-foreground mb-1">
                    Lesson {index + 1}
                  </p>
                  <h2 className="font-body text-xl md:text-2xl gradient-gold-text">{lesson.title}</h2>
                </div>
              </div>

              <p className="font-body text-sm text-foreground/80 leading-relaxed mb-5">
                {lesson.description}
              </p>

              {/* Audio guidance */}
              <div className="mb-5">
                <p className="font-body text-[10px] tracking-[0.25em] uppercase text-muted-foreground mb-2 flex items-center gap-2">
                  <Headphones className="w-3.5 h-3.5 text-primary" /> Listen along
                </p>
                <audio controls preload="none" src={lesson.audioUrl} className="w-full" aria-label={`Audio guidance for ${lesson.title}`} />
              </div>

              {/* Jump straight in */}
              <div className="flex flex-wrap gap-2">
                {lesson.steps.map((step) => (
                  <Link
                    key={step.to}
                    to={step.to}
                    className="font-body text-xs tracking-wider uppercase px-4 py-2 rounded-full border border-primary/30 text-primary hover:bg-primary/10 hover:border-primary/50 transition-colors"
                  >
                    {step.label}
                  </Link>
                ))}
              </div>
            </motion.article>
          );
        })}
      </div>

      <p className="font-display text-sm italic text-center text-muted-foreground mt-12 max-w-md mx-auto leading-relaxed">
        If anything is ever unclear, ask me directly on the contact page. No question is too small here.
      </p>
    </div>
  );
}