import React from 'react';
import { motion } from 'framer-motion';
import { Lock, ShoppingBag, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import CountdownTimer from './CountdownTimer';
import { useSiteReveal } from '@/hooks/useSiteReveal';

const UNLOCK_DATE = '2026-05-10T02:00:00Z'; // midday AEST May 10

const TEASER_ITEMS = [
  { label: 'Apparel', hint: 'Something to wear' },
  { label: 'Accessories', hint: 'Carry it with you' },
  { label: 'CD Singles', hint: 'Hold the music' },
  { label: 'Collectibles', hint: 'Limited & signed' },
];

export default function MerchTeaserSection() {
  const { merchRevealed } = useSiteReveal();
  const isUnlocked = merchRevealed;

  return (
    <section className="py-16 md:py-24 px-4 md:px-6">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <p className="font-body text-xs tracking-[0.3em] uppercase gradient-gold-glow mb-4">Official Merch</p>
          <h2 className="font-display text-3xl md:text-5xl text-foreground mb-3">
            {isUnlocked ? 'Shop Now' : 'Something Is Coming'}
          </h2>
          {!isUnlocked && (
            <>
              <p className="font-body text-sm text-muted-foreground max-w-md mx-auto mb-6 leading-relaxed">
                The official Gannon Waye merch store drops on May 10 at 6pm AEST — the same moment as the artwork and release date reveal.
              </p>
              <div className="flex justify-center">
                <CountdownTimer targetDate={UNLOCK_DATE} />
              </div>
            </>
          )}
        </motion.div>

        {/* Blurred / locked product silhouettes */}
        {!isUnlocked && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-10">
            {TEASER_ITEMS.map((item, i) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="rounded-2xl border border-border/30 bg-card/60 overflow-hidden"
              >
                {/* Blurred placeholder image area */}
                <div className="aspect-square bg-secondary/60 flex flex-col items-center justify-center gap-2 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent" />
                  <Lock className="w-6 h-6 text-primary/40" />
                  <p className="font-body text-[10px] tracking-[0.2em] uppercase text-muted-foreground/60">Locked</p>
                </div>
                <div className="p-3 text-center">
                  <p className="font-display text-sm text-foreground/70">{item.label}</p>
                  <p className="font-body text-[11px] text-muted-foreground/50 mt-0.5">{item.hint}</p>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-10"
        >
          {isUnlocked ? (
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