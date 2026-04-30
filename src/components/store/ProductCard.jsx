import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, Star, Lock, Gift } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useSiteReveal } from '@/hooks/useSiteReveal';

const CATEGORY_LABELS = {
  apparel: 'Apparel',
  accessories: 'Accessories',
  vinyl: 'Vinyl',
  cd: 'CD',
  poster: 'Poster',
  bundle: 'Bundle',
  other: 'Other',
};

export default function ProductCard({ product, index, onPreorder, onInterest }) {
  const { merchRevealed } = useSiteReveal();
  const isDeluxe = product.name?.toLowerCase().includes('deluxe') || product.name?.toLowerCase().includes('signed');
  const isCD = product.category === 'cd';

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07, duration: 0.5 }}
      className={`group relative flex flex-col rounded-3xl overflow-hidden border bg-card transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-black/30 ${
        isDeluxe
          ? 'border-primary/40 shadow-lg shadow-primary/10 hover:border-primary/70'
          : 'border-border/40 hover:border-primary/25'
      }`}
    >
      {/* Special Edition ribbon */}
      {isDeluxe && (
        <div className="absolute top-4 left-4 z-10">
          <span className="flex items-center gap-1 bg-primary text-primary-foreground font-body text-[10px] tracking-[0.15em] uppercase px-3 py-1.5 rounded-full font-semibold shadow-md">
            <Star className="w-3 h-3" /> Limited Edition
          </span>
        </div>
      )}

      {/* Image — always gift-wrapped until store opens */}
      <div className="relative aspect-square bg-secondary/40 overflow-hidden">
        <img
          src="https://media.base44.com/images/public/69eb7905ca6eb4180010f794/bd4d2cad9_generated_image.png"
          alt="Coming soon"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center gap-2">
          <Gift className="w-8 h-8 text-primary" />
          <p className="font-body text-[10px] tracking-[0.2em] uppercase gradient-gold-text">Revealed May 10</p>
        </div>
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-card/60 to-transparent pointer-events-none" />
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-6 gap-4">

        {/* Category + Price row */}
        <div className="flex items-center justify-between">
          <Badge
            variant="outline"
            className="font-body text-[10px] tracking-[0.15em] uppercase border-primary/25 text-primary/80 px-2.5 py-1"
          >
            {CATEGORY_LABELS[product.category] || product.category}
          </Badge>
          <span className="font-display text-2xl gradient-gold-glow">
            ${product.price?.toFixed(2)}
          </span>
        </div>

        {/* Name */}
        <div>
          <h3 className="font-display text-xl text-foreground leading-snug">
            {product.name}
          </h3>
        </div>

        {/* Description */}
        <p className="font-body text-sm text-foreground/55 leading-relaxed line-clamp-3 flex-1">
          {product.description}
        </p>

        {/* Sizes */}
        {product.sizes_available?.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {product.sizes_available.map(s => (
              <span
                key={s}
                className="font-body text-[11px] tracking-wider border border-border/50 rounded-lg px-2.5 py-1 text-muted-foreground bg-secondary/30"
              >
                {s}
              </span>
            ))}
          </div>
        )}

        {/* Divider */}
        <div className="border-t border-border/30 pt-4 space-y-2">
          {merchRevealed ? (
            <>
              {isCD && (
                <p className="font-body text-[10px] tracking-wide text-primary/80 text-center">
                  Pre-order · Full payment now · Ships before June 9 via tracked post
                </p>
              )}
              <Button
                onClick={() => onPreorder ? onPreorder(product) : onInterest(product)}
                className={`w-full rounded-full font-body text-sm tracking-wider uppercase border-0 py-5 gradient-gold-button`}
              >
                <ShoppingBag className="w-4 h-4" /> {isCD ? 'Pre-order Now' : 'Add to Cart'}
              </Button>
            </>
          ) : (
            <Button
              onClick={() => onInterest(product)}
              className={`w-full rounded-full font-body text-sm tracking-wider uppercase border-0 py-5 ${
                isDeluxe
                  ? 'gradient-gold-button'
                  : 'bg-secondary/80 text-foreground hover:bg-secondary'
              }`}
            >
              <ShoppingBag className="w-4 h-4" /> Register My Interest
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  );
}