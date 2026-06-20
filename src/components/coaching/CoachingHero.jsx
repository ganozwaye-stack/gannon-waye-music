import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export default function CoachingHero({ hook, subhook, primaryCTA, primaryLink, secondaryCTA, secondaryLink, badge }) {
  return (
    <section className="relative min-h-[70vh] flex items-center justify-center py-24 px-4 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background z-0" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(201,168,76,0.06)_0%,transparent_70%)] z-0" />

      <div className="relative z-10 max-w-3xl mx-auto text-center">
        {badge && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <span className="inline-block border border-primary/30 text-primary font-body text-[9px] tracking-[0.3em] uppercase px-4 py-1.5 rounded-full mb-6">
              {badge}
            </span>
          </motion.div>
        )}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="font-display text-3xl md:text-5xl text-foreground leading-tight italic mb-6"
        >
          {hook}
        </motion.h1>
        {subhook && (
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="font-body text-base md:text-lg text-foreground/70 leading-relaxed max-w-2xl mx-auto mb-10"
          >
            {subhook}
          </motion.p>
        )}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-3 justify-center"
        >
          {primaryCTA && (
            <Link to={primaryLink || '/coaching/intake'}>
              <Button className="gradient-gold-button border-0 rounded-full px-8 py-5 font-body text-sm tracking-wider uppercase">
                {primaryCTA}
              </Button>
            </Link>
          )}
          {secondaryCTA && (
            <Link to={secondaryLink || '/coaching/workbooks'}>
              <Button variant="outline" className="rounded-full px-8 py-5 font-body text-sm tracking-wider uppercase border-foreground/20 hover:bg-foreground/5">
                {secondaryCTA}
              </Button>
            </Link>
          )}
        </motion.div>
      </div>
    </section>
  );
}