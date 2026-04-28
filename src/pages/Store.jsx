import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { ShoppingBag, Star, Package, Lock, Gift } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import MerchInterestModal from '@/components/store/MerchInterestModal';
import CheckoutModal from '@/components/store/CheckoutModal';
import CountdownTimer from '@/components/public/CountdownTimer';

// May 10 2026 at 6pm AEST = 08:00 UTC
const UNLOCK_DATE = new Date('2026-05-10T08:00:00Z');

const CATEGORY_LABELS = {
  apparel: 'Apparel',
  accessories: 'Accessories',
  vinyl: 'Vinyl',
  cd: 'CD',
  poster: 'Poster',
  bundle: 'Bundle',
  other: 'Other',
};

function StoreLocked() {
  return (
    <div className="min-h-screen py-20 px-4 md:px-6 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="text-center max-w-xl mx-auto"
      >
        <div className="w-20 h-20 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-8">
          <Lock className="w-8 h-8 text-primary" />
        </div>

        <p className="font-body text-xs tracking-[0.3em] uppercase gradient-gold-glow mb-3">Official Merch</p>
        <h1 className="font-display text-4xl md:text-6xl text-foreground mb-4">Store Opens</h1>
        <p className="font-body text-sm text-muted-foreground mb-2">May 10 · 6pm AEST</p>
        <p className="font-body text-sm text-foreground/50 max-w-sm mx-auto mb-10 leading-relaxed">
          Exclusive merchandise drops alongside the artwork and release date reveal. Come back then.
        </p>

        <CountdownTimer targetDate={UNLOCK_DATE.toISOString()} />

        <div className="mt-12 pt-8 border-t border-border/30">
          <p className="font-body text-xs tracking-widest uppercase text-muted-foreground mb-3">Want to be first in line?</p>
          <a href="/community">
            <Button className="rounded-full font-body text-sm tracking-wider uppercase px-8 gradient-gold-button border-0">
              Join the Community
            </Button>
          </a>
        </div>
      </motion.div>
    </div>
  );
}

export default function Store() {
  const [interestProduct, setInterestProduct] = useState(null);
  const [checkoutProduct, setCheckoutProduct] = useState(null);

  const isLocked = new Date() < UNLOCK_DATE;

  const { data: products } = useQuery({
    queryKey: ['merchProducts'],
    queryFn: () => base44.entities.MerchProduct.filter({ is_active: true }),
    initialData: [],
    enabled: !isLocked,
  });

  if (isLocked) return <StoreLocked />;

  const sorted = [...products].sort((a, b) => {
    if (a.category === 'cd' && b.category !== 'cd') return -1;
    if (a.category !== 'cd' && b.category === 'cd') return 1;
    return 0;
  });

  const isDeluxe = (p) => p.name?.toLowerCase().includes('deluxe') || p.name?.toLowerCase().includes('signed');

  return (
    <div className="min-h-screen py-20 px-4 md:px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <p className="font-body text-xs tracking-[0.3em] uppercase gradient-gold-glow mb-4">Official</p>
          <h1 className="font-display text-4xl md:text-6xl text-foreground mb-4">Merch Store</h1>
          <p className="font-body text-sm text-muted-foreground max-w-xl mx-auto leading-relaxed">
            All items are preorders. Payment won't be processed until <strong className="text-foreground">1 June 2026</strong>.
            Prices include GST. Shipping calculated at checkout.
          </p>
        </motion.div>

        {sorted.length === 0 ? (
          <div className="text-center py-20">
            <ShoppingBag className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
            <p className="font-body text-muted-foreground">Store coming soon.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {sorted.map((product, i) => {
              const deluxe = isDeluxe(product);
              return (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className={`relative rounded-2xl overflow-hidden border bg-card flex flex-col transition-all hover:border-primary/30 ${
                    deluxe ? 'border-primary/50 shadow-lg shadow-primary/10' : 'border-border/40'
                  }`}
                >
                  {deluxe && (
                    <div className="absolute top-3 left-3 z-10">
                      <span className="flex items-center gap-1 bg-primary text-primary-foreground font-body text-[10px] tracking-widest uppercase px-2.5 py-1 rounded-full font-semibold">
                        <Star className="w-3 h-3" /> Special Edition
                      </span>
                    </div>
                  )}

                  <div className="aspect-square bg-secondary/50 overflow-hidden">
                    {product.image_url ? (
                      <img
                        src={product.image_url}
                        alt={product.name}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Package className="w-16 h-16 text-muted-foreground/20" />
                      </div>
                    )}
                  </div>

                  <div className="p-5 flex flex-col flex-1">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <Badge variant="outline" className="font-body text-[10px] tracking-widest uppercase border-primary/30 text-primary mb-2">
                          {CATEGORY_LABELS[product.category] || product.category}
                        </Badge>
                        <h3 className="font-display text-xl text-foreground leading-tight">{product.name}</h3>
                      </div>
                      <p className="font-display text-xl gradient-gold-glow flex-shrink-0">${product.price?.toFixed(2)}</p>
                    </div>

                    <p className="font-body text-sm text-foreground/60 leading-relaxed flex-1 mb-4 line-clamp-3">
                      {product.description}
                    </p>

                    {product.sizes_available?.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {product.sizes_available.map(s => (
                          <span key={s} className="font-body text-[11px] border border-border/50 rounded px-2 py-0.5 text-muted-foreground">
                            {s}
                          </span>
                        ))}
                      </div>
                    )}

                    <Button
                      onClick={() => setCheckoutProduct(product)}
                      className={`w-full rounded-full font-body text-sm tracking-wider uppercase border-0 ${
                        deluxe ? 'gradient-gold-button' : 'bg-secondary text-foreground hover:bg-secondary/80'
                      }`}
                    >
                      <ShoppingBag className="w-4 h-4 mr-2" /> Preorder Now
                    </Button>

                    <button
                      onClick={() => setInterestProduct(product)}
                      className="mt-2 font-body text-xs text-muted-foreground hover:text-primary transition-colors text-center w-full py-1"
                    >
                      Register interest only →
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {interestProduct && (
        <MerchInterestModal
          product={interestProduct}
          onClose={() => setInterestProduct(null)}
        />
      )}

      {checkoutProduct && (
        <CheckoutModal
          product={checkoutProduct}
          onClose={() => setCheckoutProduct(null)}
        />
      )}
    </div>
  );
}