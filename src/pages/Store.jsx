import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { ShoppingBag, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import MerchInterestModal from '@/components/store/MerchInterestModal';
import CheckoutModal from '@/components/store/CheckoutModal';
import ProductCard from '@/components/store/ProductCard';
import CountdownTimer from '@/components/public/CountdownTimer';

// May 10 2026 at 6pm AEST = 08:00 UTC
const UNLOCK_DATE = new Date('2026-05-10T08:00:00Z');


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
          <h1 className="font-display text-4xl md:text-6xl text-foreground mb-5">Merch Store</h1>
          <div className="inline-flex items-center gap-2 bg-card border border-border/40 rounded-full px-5 py-2.5">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            <p className="font-body text-xs text-muted-foreground tracking-wide">
              Preorders open · Payment charged <strong className="text-foreground">1 June 2026</strong> · Prices include GST
            </p>
          </div>
        </motion.div>

        {/* Divider */}
        <div className="flex items-center gap-4 my-12">
          <div className="flex-1 h-px bg-border/40" />
          <span className="font-body text-[10px] tracking-[0.3em] uppercase text-muted-foreground/50">Collection</span>
          <div className="flex-1 h-px bg-border/40" />
        </div>

        {sorted.length === 0 ? (
          <div className="text-center py-24">
            <ShoppingBag className="w-16 h-16 text-muted-foreground/20 mx-auto mb-4" />
            <p className="font-body text-muted-foreground">Store coming soon.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {sorted.map((product, i) => (
              <ProductCard
                key={product.id}
                product={product}
                index={i}
                onPreorder={setCheckoutProduct}
                onInterest={setInterestProduct}
              />
            ))}
          </div>
        )}

        {/* Footer note */}
        <p className="text-center font-body text-xs text-muted-foreground/50 mt-16 tracking-wide">
          All purchases are preorders. You will receive an order confirmation by email. Shipping calculated at checkout.
        </p>
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