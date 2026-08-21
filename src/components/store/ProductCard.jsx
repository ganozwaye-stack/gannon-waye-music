import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, Star, Gift, AlertCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useSiteReveal } from '@/hooks/useSiteReveal';
import FloatingImage from '@/components/public/FloatingImage';
import MagneticButton from '@/components/public/MagneticButton';

const CATEGORY_LABELS = {
  apparel: 'Apparel',
  accessories: 'Accessories',
  vinyl: 'Vinyl',
  cd: 'CD',
  poster: 'Poster',
  bundle: 'Bundle',
  other: 'Other',
};

// Products that are sold out at launch
function isSoldOutAtLaunch(product) {
  const name = product.name?.toLowerCase() || '';
  return (
    product.category === 'cd' ||
    name.includes('hoodie') ||
    name.includes('jumper') ||
    name.includes('journal') ||
    name.includes('notebook')
  );
}

export default function ProductCard({ product, index, onPreorder, onInterest }) {
  const { merchRevealed } = useSiteReveal();
  const isDeluxe = product.name?.toLowerCase().includes('deluxe') || product.name?.toLowerCase().includes('signed');
  const soldOut = merchRevealed && isSoldOutAtLaunch(product);
  const [showBack, setShowBack] = useState(false);
  const hasBackImage = !!product.back_image_url;

  useEffect(() => {
    if (!hasBackImage || !merchRevealed) return;
    const interval = setInterval(() => setShowBack(prev => !prev), 3000);
    return () => clearInterval(interval);
  }, [hasBackImage, merchRevealed]);

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
      {/* Limited Edition ribbon */}
      {isDeluxe && (
        <div className="absolute top-4 left-4 z-10">
          <span className="flex items-center gap-1 bg-primary text-primary-foreground font-body text-[10px] tracking-[0.15em] uppercase px-3 py-1.5 rounded-full font-semibold shadow-md">
            <Star className="w-3 h-3" /> Limited Edition
          </span>
        </div>
      )}

      {/* Sold Out ribbon */}
      {soldOut && (
        <div className="absolute top-4 right-4 z-10">
          <span className="flex items-center gap-1 bg-destructive/90 text-white font-body text-[10px] tracking-[0.15em] uppercase px-3 py-1.5 rounded-full font-semibold shadow-md">
            Sold Out
          </span>
        </div>
      )}

      {/* Image — gift-wrapped until store opens, then real image with optional flip */}
      <FloatingImage className="w-full" amplitude={4} duration={5} delay={(index || 0) * 0.4}>
        <div className="relative aspect-square bg-secondary/40 overflow-hidden perspective">
          {!merchRevealed ? (
            <>
              <img
                src="https://media.base44.com/images/public/69eb7905ca6eb4180010f794/bd4d2cad9_generated_image.png"
                alt="Coming soon"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center gap-2">
                <Gift className="w-8 h-8 text-primary" />
                <p className="font-body text-[10px] tracking-[0.2em] uppercase gradient-gold-text">Revealed May 10</p>
              </div>
            </>
          ) : (
            <div className="w-full h-full relative">
              {product.image_url && (
                <motion.img
                  key="front"
                  src={product.image_url}
                  alt={product.name}
                  initial={{ opacity: 1, rotateY: 0 }}
                  animate={{ opacity: showBack ? 0 : 1, rotateY: showBack ? -90 : 0 }}
                  transition={{ duration: 1.2, ease: 'easeInOut' }}
                  className={`absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ${soldOut ? 'opacity-60 grayscale' : ''}`}
                  style={{ backfaceVisibility: 'hidden' }}
                />
              )}
              {product.back_image_url && (
                <motion.img
                  key="back"
                  src={product.back_image_url}
                  alt={`${product.name} back`}
                  initial={{ opacity: 0, rotateY: 90 }}
                  animate={{ opacity: showBack ? 1 : 0, rotateY: showBack ? 0 : 90 }}
                  transition={{ duration: 1.2, ease: 'easeInOut' }}
                  className={`absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ${soldOut ? 'opacity-60 grayscale' : ''}`}
                  style={{ backfaceVisibility: 'hidden' }}
                />
              )}
              {!product.image_url && !product.back_image_url && (
                <div className="w-full h-full flex items-center justify-center bg-secondary/40">
                  <ShoppingBag className="w-12 h-12 text-muted-foreground/20" />
                </div>
              )}
            </div>
          )}
          <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-card/60 to-transparent pointer-events-none" />
        </div>
      </FloatingImage>

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
          <span className={`font-display text-2xl ${soldOut ? 'text-muted-foreground/50 line-through' : 'gradient-gold-glow'}`}>
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
        <p className="font-body text-xs text-muted-foreground/50 mt-1">Not your style? You can still support this.</p>

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

        {/* Actions */}
        <div className="border-t border-border/30 pt-4 space-y-2">
          {!merchRevealed ? (
            // Before reveal — register interest only
            <MagneticButton strength={0.25} className="w-full">
              <Button
                onClick={() => onInterest(product)}
                className={`w-full rounded-full font-body text-sm tracking-wider uppercase border-0 py-5 ${
                  isDeluxe ? 'gradient-gold-button' : 'bg-secondary/80 text-foreground hover:bg-secondary'
                }`}
              >
                <ShoppingBag className="w-4 h-4" /> Register My Interest
              </Button>
            </MagneticButton>
          ) : soldOut ? (
            // After reveal, sold out — show sold out + interest button
            <>
              <div className="flex items-center justify-center gap-2 py-2 rounded-full bg-destructive/10 border border-destructive/20">
                <AlertCircle className="w-4 h-4 text-destructive/70" />
                <span className="font-body text-sm text-destructive/70 tracking-wider uppercase">Sold Out</span>
              </div>
              <Button
                onClick={() => onInterest(product)}
                variant="outline"
                className="w-full rounded-full font-body text-xs tracking-wider uppercase py-4 border-primary/30 text-primary hover:bg-primary/10"
              >
                Notify Me If Restocked
              </Button>
            </>
          ) : (
            // After reveal, available
            <>
              {product.category === 'cd' && (
                <p className="font-body text-[10px] tracking-wide text-primary/80 text-center">
                  Pre-order · Ships before June 9 via tracked post
                </p>
              )}
              <MagneticButton strength={0.25} className="w-full">
                <Button
                  onClick={() => onPreorder(product)}
                  className="w-full rounded-full font-body text-sm tracking-wider uppercase border-0 py-5 gradient-gold-button"
                >
                  <ShoppingBag className="w-4 h-4" /> {product.category === 'cd' ? 'Pre-order Now' : 'Add to Cart'}
                </Button>
              </MagneticButton>
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
}