import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import SetFreeFeatureColumn from '@/components/public/SetFreeFeatureColumn';

// The right-hand stack of the home hero: the time-of-day welcome and the
// Set Free box, high on the page beside the heart planet. The welcome card
// is bigger and see-through (owner-directed 25 September 2026): the galaxy
// shows through, the text stays readable. Left aligned, never centred.
export default function HomeHeroWelcomeStack({ settings = {} }) {
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="space-y-4 text-left">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.2 }}
        className="relative rounded-2xl border border-primary/25 bg-card/15 backdrop-blur-md px-6 py-6 overflow-hidden"
      >
        <motion.div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'linear-gradient(115deg, rgba(212,175,55,0.10) 0%, transparent 55%, rgba(212,175,55,0.08) 100%)' }}
          animate={{ opacity: [0.4, 0.85, 0.4] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
        />
        <div className="relative">
          <div className="flex items-center gap-2.5 mb-2.5">
            <motion.span
              className="w-1.5 h-1.5 rounded-full bg-primary"
              animate={{ scale: [1, 1.6, 1], opacity: [1, 0.5, 1] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
            />
            <p className="font-body text-xs tracking-[0.25em] uppercase text-primary/80">{greeting}, and welcome</p>
          </div>
          <h2 className="font-display text-3xl md:text-4xl gradient-gold-text">I'm Gannon Waye</h2>
          <p className="font-body text-[10px] tracking-[0.3em] uppercase text-foreground/50 mt-1.5 mb-4">Singer · Songwriter · Melbourne</p>
          <p className="font-body text-sm md:text-[15px] text-foreground/90 leading-relaxed">
            Independent, heart-first art made after everything life threw at it. I write the songs that say what you cannot say yet, and I built this space for anyone who still needs proof that being knocked down is not the end of the story. You are not alone here.
          </p>
          <p className="font-body text-sm md:text-[15px] text-foreground/90 leading-relaxed mt-3">
            Today the new single, Set Free, is out in the world: a song about reclaiming your voice, protecting your peace and choosing what happens next. Stay a while, wander the boutique, leave me a message. Whatever brought you here, you are safe and you are welcome.
          </p>
          <div className="mt-5 flex flex-wrap gap-2.5">
            <Link
              to="/music"
              className="inline-flex items-center gap-1.5 rounded-full px-5 py-2.5 font-body text-[10px] tracking-wider uppercase gradient-gold-button border-0"
            >
              Hear the Music <ArrowRight className="w-3 h-3" />
            </Link>
            <Link
              to="/biography"
              className="inline-flex items-center gap-1.5 rounded-full px-5 py-2.5 font-body text-[10px] tracking-wider uppercase border border-primary/40 text-primary hover:bg-primary/10 transition-colors"
            >
              My Story
            </Link>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.35 }}
      >
        <SetFreeFeatureColumn settings={settings} />
      </motion.div>
    </div>
  );
}