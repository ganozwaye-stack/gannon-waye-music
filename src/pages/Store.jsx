import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { ShoppingBag, Tag, Heart, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useSiteReveal } from '@/hooks/useSiteReveal';
import MerchInterestModal from '@/components/store/MerchInterestModal';
import CountdownTimer from '@/components/public/CountdownTimer';
import WrappedGiftPlaceholder from '@/components/store/WrappedGiftPlaceholder';



const UNLOCK_DATE = '2026-05-10T08:00:00Z';

const TEASER_ITEMS = [
  { label: 'Apparel', hint: 'Something to wear' },
  { label: 'Accessories', hint: 'Carry it with you' },
  { label: 'CD Singles', hint: 'Hold the music' },
  { label: 'Collectibles', hint: 'Limited & signed' },
];

export default function Store() {
  const [interestProduct, setInterestProduct] = useState(null);
  const navigate = useNavigate();
  const { merchRevealed } = useSiteReveal();

  return (
    <div className="min-h-screen py-24 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">

        {/* Page header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-6"
        >
          <p className="font-body text-xs tracking-[0.3em] uppercase gradient-gold-glow mb-4">Official</p>
          <h1 className="font-display text-4xl md:text-6xl text-foreground mb-5">Merch</h1>
          <div className="inline-flex items-center gap-2 bg-card border border-border/40 rounded-full px-5 py-2.5 mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            <p className="font-body text-xs text-muted-foreground tracking-wide">
              Pre-order only · Payment scheduled for June 1, 2026 · No charge today
            </p>
          </div>
          <div className="inline-flex items-center gap-3 bg-primary/10 border border-primary/30 rounded-xl px-5 py-3">
            <Tag className="w-4 h-4 text-primary flex-shrink-0" />
            <span className="font-body text-xs text-foreground/70">Launch offer · First 20 orders:</span>
            <span className="font-display text-base tracking-widest gradient-gold-glow">LAUNCH15</span>
            <span className="font-body text-xs text-primary">= 15% off</span>
          </div>
        </motion.div>

        {/* Support CTA — top */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8 bg-card border border-primary/20 rounded-2xl p-5 text-center"
        >
          <p className="font-body text-sm text-foreground/70 mb-4">Support this project directly and become part of the movement.</p>
          <div className="flex justify-center gap-3 flex-wrap">
            {[5, 10, 25].map(amount => (
              <button
                key={amount}
                onClick={() => navigate('/back-this')}
                className="gradient-gold-button rounded-full px-5 py-2 font-body text-sm tracking-wider"
              >
                ${amount} AUD
              </button>
            ))}
          </div>
        </motion.div>

        {/* Divider */}
        <div className="flex items-center gap-4 my-12">
          <div className="flex-1 h-px bg-border/40" />
          <span className="font-body text-[10px] tracking-[0.3em] uppercase text-muted-foreground/50">Collection</span>
          <div className="flex-1 h-px bg-border/40" />
        </div>

        {/* Wrapped Gift Collection Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
          {TEASER_ITEMS.map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="rounded-2xl border border-border/30 bg-card/40 overflow-hidden backdrop-blur-sm"
            >
              <div className="aspect-square bg-gradient-to-br from-secondary/20 to-secondary/60 flex flex-col items-center justify-center gap-4 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent" />
                <WrappedGiftPlaceholder index={i} />
              </div>
              <div className="p-4 text-center border-t border-border/30">
                <p className="font-display text-sm text-foreground">{item.label}</p>
                <p className="font-body text-[10px] text-muted-foreground/60 mt-1 tracking-wide">{item.hint}</p>
                <p className="font-body text-[9px] text-primary/70 mt-2 tracking-[0.2em] uppercase">Premium Mystery Item</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Footer note */}
        <p className="text-center font-body text-xs text-muted-foreground/50 mt-16 tracking-wide">
          Be a supporter. Help bring this story to life.
        </p>

        {/* Support bottom CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-8 text-center"
        >
          <p className="font-body text-sm text-muted-foreground mb-4">Every contribution matters. Support the debut single.</p>
          <button
            onClick={() => navigate('/back-this')}
            className="gradient-gold-button rounded-full px-8 py-3 font-body text-sm tracking-wider uppercase inline-flex items-center gap-2"
          >
            <Heart className="w-4 h-4" /> Support Now 🤍
          </button>
        </motion.div>
      </div>

      {interestProduct && (
        <MerchInterestModal
          product={interestProduct}
          onClose={() => setInterestProduct(null)}
        />
      )}


    </div>
  );
}