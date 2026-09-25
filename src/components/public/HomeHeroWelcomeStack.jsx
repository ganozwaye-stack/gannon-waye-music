import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import HeroWelcomeBanner from '@/components/public/HeroWelcomeBanner';
import SetFreeFeatureColumn from '@/components/public/SetFreeFeatureColumn';

// The right-hand stack of the home hero. Owner-directed 25 September 2026:
// the time-of-day welcome, the Set Free feature box and the previous release
// all sit UP HIGH, stacked on the right side of the hero, beside the heart
// planet in the middle. Left aligned, never centred.
export default function HomeHeroWelcomeStack({ previousRelease, previousLink, settings = {} }) {
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="space-y-4 text-left">
      {/* Welcome greeting card, compact for the hero */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.2 }}
        className="relative rounded-2xl border border-primary/30 bg-card/60 backdrop-blur px-5 py-5 overflow-hidden"
      >
        <motion.div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'linear-gradient(115deg, rgba(212,175,55,0.14) 0%, transparent 55%, rgba(212,175,55,0.10) 100%)' }}
          animate={{ opacity: [0.4, 0.9, 0.4] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
        />
        <div className="relative">
          <div className="flex items-center gap-2.5 mb-2">
            <motion.span
              className="w-1.5 h-1.5 rounded-full bg-primary"
              animate={{ scale: [1, 1.6, 1], opacity: [1, 0.5, 1] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
            />
            <p className="font-body text-[11px] tracking-[0.25em] uppercase text-primary/80">{greeting}, and welcome</p>
          </div>
          <h2 className="font-display text-2xl md:text-3xl gradient-gold-text">I'm Gannon Waye</h2>
          <p className="font-body text-[10px] tracking-[0.3em] uppercase text-foreground/50 mt-1 mb-3">Singer · Songwriter · Melbourne</p>
          <p className="font-body text-sm text-foreground/85 leading-relaxed">
            Independent, heart-first art made after everything life threw at it. You are not alone here.
          </p>
          <div className="mt-4 flex flex-wrap gap-2.5">
            <Link
              to="/music"
              className="inline-flex items-center gap-1.5 rounded-full px-5 py-2 font-body text-[10px] tracking-wider uppercase gradient-gold-button border-0"
            >
              Hear the Music <ArrowRight className="w-3 h-3" />
            </Link>
            <Link
              to="/biography"
              className="inline-flex items-center gap-1.5 rounded-full px-5 py-2 font-body text-[10px] tracking-wider uppercase border border-primary/40 text-primary hover:bg-primary/10 transition-colors"
            >
              My Story
            </Link>
          </div>
        </div>
      </motion.div>

      {/* The Set Free box */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.35 }}
      >
        <SetFreeFeatureColumn settings={settings} />
      </motion.div>

      {/* Previous release */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.5 }}
      >
        <p className="font-body text-[10px] tracking-[0.35em] uppercase gradient-gold-glow mb-3 text-left">Previous Release</p>
        <HeroWelcomeBanner release={previousRelease} releaseLink={previousLink} badgeLabel="Previous release" />
        {previousRelease?.title === 'Without You Here' && (
          <div className="-mt-3 text-left">
            <Link to="/remember-mum" className="inline-flex items-center gap-1 font-body text-xs tracking-wider uppercase gradient-gold-text hover:opacity-80 transition-opacity">
              Read Mum's story <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        )}
      </motion.div>
    </div>
  );
}