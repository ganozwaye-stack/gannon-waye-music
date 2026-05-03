import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, ShoppingBag, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import CountdownTimer from './CountdownTimer';
import { useSiteReveal } from '@/hooks/useSiteReveal';

const UNLOCK_DATE = '2026-05-10T04:00:00Z';

const TEASER_ITEMS = [
  { label: 'Apparel', hint: 'Something to wear' },
  { label: 'Accessories', hint: 'Carry it with you' },
  { label: 'CD Singles', hint: 'Hold the music' },
  { label: 'Collectibles', hint: 'Limited & signed' },
];

function LockedCard({ item, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08, duration: 0.5 }}
      className="rounded-2xl border border-border/30 bg-card/60 overflow-hidden"
    >
      <div className="aspect-square bg-secondary/60 flex flex-col items-center justify-center gap-2 relative overflow-hidden">
        {/* Cloth movement loop */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-primary/8 via-transparent to-primary/5"
          animate={{ scale: [1, 1.02, 1], opacity: [0.9, 1, 0.9] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: index * 0.4 }}
        />
        {/* Light leak pulse */}
        <motion.div
          className="absolute inset-0"
          style={{ background: 'radial-gradient(ellipse at 30% 30%, rgba(245,208,110,0.15) 0%, transparent 70%)' }}
          animate={{ opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: index * 0.4 }}
        />
        <Lock className="w-6 h-6 text-primary/40 relative z-10" />
        <p className="font-body text-[10px] tracking-[0.2em] uppercase text-muted-foreground/60 relative z-10">Locked</p>
      </div>
      <div className="p-3 text-center">
        <p className="font-display text-sm text-foreground/70">{item.label}</p>
        <p className="font-body text-[11px] text-muted-foreground/50 mt-0.5">{item.hint}</p>
      </div>
    </motion.div>
  );
}

function UnwrapCard({ item, index }) {
  const [unwrapped, setUnwrapped] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08, duration: 0.5 }}
      className="rounded-2xl border border-primary/30 bg-card/60 overflow-hidden cursor-pointer"
      onClick={() => setUnwrapped(true)}
    >
      <div className="aspect-square bg-secondary/60 flex flex-col items-center justify-center gap-2 relative overflow-hidden">
        {/* Cloth overlay */}
        <AnimatePresence>
          {!unwrapped && (
            <motion.div
              key="cloth"
              className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-2"
              style={{ background: 'linear-gradient(160deg, rgba(201,168,76,0.18) 0%, rgba(14,17,23,0.85) 100%)' }}
              exit={{ y: 120, opacity: 0 }}
              transition={{ duration: 0.9, ease: [0.4, 0, 0.2, 1] }}
            >
              <motion.div
                animate={{ scale: [1, 1.02, 1], opacity: [0.9, 1, 0.9] }}
                transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: index * 0.4 }}
                className="flex flex-col items-center gap-2"
              >
                <ShoppingBag className="w-8 h-8 text-primary/60" />
                <p className="font-body text-[10px] tracking-[0.2em] uppercase gradient-gold-text">Tap to Peek</p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
        {/* Revealed */}
        <AnimatePresence>
          {unwrapped && (
            <motion.div
              key="revealed"
              className="absolute inset-0 flex flex-col items-center justify-center gap-2"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, ease: [0.0, 0.0, 0.2, 1] }}
              style={{ background: 'radial-gradient(ellipse at center, rgba(245,208,110,0.15) 0%, transparent 70%)' }}
            >
              <p className="font-display text-2xl gradient-gold-glow">{item.label}</p>
              <p className="font-body text-xs text-muted-foreground">{item.hint}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <div className="p-3 text-center">
        <p className="font-display text-sm text-foreground/70">{item.label}</p>
        <p className="font-body text-[11px] text-muted-foreground/50 mt-0.5">{item.hint}</p>
      </div>
    </motion.div>
  );
}

export default function MerchTeaserSection() {
  const { merchRevealed } = useSiteReveal();

  return (
    <section className="py-16 md:py-24 px-4 md:px-6">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.0, 0.0, 0.2, 1] }}
          className="text-center mb-10"
        >
          <p className="font-body text-xs tracking-[0.3em] uppercase gradient-gold-glow mb-4">Official Merch</p>
          <h2 className="font-display text-3xl md:text-5xl text-foreground mb-3">
            {merchRevealed ? 'Shop Now' : 'Something Is Coming'}
          </h2>
          {!merchRevealed && (
            <>
              <p className="font-body text-sm text-muted-foreground max-w-md mx-auto mb-6 leading-relaxed">
                The official Gannon Waye merch store drops on May 10 at 2pm AEST — the same moment as the artwork and release date reveal.
              </p>
              <div className="flex justify-center">
                <CountdownTimer targetDate={UNLOCK_DATE} />
              </div>
            </>
          )}
        </motion.div>

        {/* Locked cards — pre-reveal with cloth animation */}
        {!merchRevealed && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-10">
            {TEASER_ITEMS.map((item, i) => (
              <LockedCard key={item.label} item={item} index={i} />
            ))}
          </div>
        )}

        {/* Artwork revealed but not released — peek/unwrap */}
        {merchRevealed && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-10">
            {TEASER_ITEMS.map((item, i) => (
              <UnwrapCard key={item.label} item={item} index={i} />
            ))}
          </div>
        )}

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center mt-10"
        >
          {merchRevealed ? (
            <Link to="/store">
              <Button className="rounded-full px-8 py-5 font-body text-sm tracking-wider uppercase gradient-gold-button border-0">
                Shop the Drop <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          ) : (
            <Link to="/community">
              <Button variant="outline" className="rounded-full px-8 py-5 font-body text-sm tracking-wider uppercase border-foreground/20">
                <ShoppingBag className="w-4 h-4 mr-2" /> Be First to Know
              </Button>
            </Link>
          )}
        </motion.div>
      </div>
    </section>
  );
}