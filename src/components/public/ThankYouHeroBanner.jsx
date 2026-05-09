import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import CountdownTimer from './CountdownTimer';
import { useSiteReveal } from '@/hooks/useSiteReveal';



export default function ThankYouHeroBanner() {
  const { released, releaseDateIso, releaseDateText } = useSiteReveal();

  return (
    <section className="relative w-full overflow-hidden bg-card border-b border-border/40">
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] rounded-full bg-primary/6 blur-3xl"
          animate={{ opacity: [0.4, 0.8, 0.4] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      <div className="max-w-6xl mx-auto px-4 md:px-8 py-10 md:py-14 relative">
        <div className="grid grid-cols-1 md:grid-cols-[auto_1fr] gap-8 md:gap-14 items-center">

          {/* Artwork box */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7 }}
            className="relative w-52 h-52 md:w-64 md:h-64 mx-auto md:mx-0 flex-shrink-0"
          >
            <motion.div
              className="absolute -inset-1 rounded-2xl bg-gradient-to-br from-primary/60 via-primary/20 to-primary/60"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            />
            <div className="relative w-full h-full rounded-2xl overflow-hidden bg-secondary/80 border border-border/40">
              <img src="https://media.base44.com/images/public/69eb7905ca6eb4180010f794/6dde7d697_2.jpg" alt="Thank You — Gannon Waye single cover" className="w-full h-full object-cover" />
            </div>
          </motion.div>

          {/* Text content */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="text-center md:text-left"
          >
            <div className="flex items-center gap-2 justify-center md:justify-start mb-3">
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              <p className="font-body text-xs tracking-[0.3em] uppercase gradient-gold-glow">Debut Single</p>
            </div>

            <h2 className="font-display text-4xl md:text-6xl text-foreground italic mb-2">Thank You</h2>
            <p className="font-body text-sm text-foreground/50 mb-6 max-w-md">
              A powerful expression of gratitude born from tragic heartbreak—where the rose-colored glasses fell away and the hard truths became clear.
            </p>

            <div className="space-y-4">
              <p className="font-body text-xs tracking-[0.2em] uppercase gradient-gold-glow mb-2">Coming {releaseDateText} · All leading platforms</p>
              {!released && <CountdownTimer targetDate={releaseDateIso} />}
              <Link to="/music" className="inline-block mt-3">
                <Button className="rounded-full gap-2 font-body text-sm tracking-wider uppercase px-7 gradient-gold-button border-0">
                  {released ? 'Listen Now' : 'Pre-save Coming Soon'} <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}