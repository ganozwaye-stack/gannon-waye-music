import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { ShoppingBag, Tag, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import MerchInterestModal from '@/components/store/MerchInterestModal';
import CheckoutModal from '@/components/store/CheckoutModal';
import ProductCard from '@/components/store/ProductCard';



export default function Store() {
  const [interestProduct, setInterestProduct] = useState(null);
  const [checkoutProduct, setCheckoutProduct] = useState(null);
  const navigate = useNavigate();

  const { data: products } = useQuery({
    queryKey: ['merchProducts'],
    queryFn: () => base44.entities.MerchProduct.filter({ is_active: true }),
    initialData: [],
  });

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
          <div className="inline-flex items-center gap-2 bg-card border border-border/40 rounded-full px-5 py-2.5 mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            <p className="font-body text-xs text-muted-foreground tracking-wide">
              Store opens May 10 at 6pm AEST · Register your interest to be first in line
            </p>
          </div>
          <div className="inline-flex items-center gap-3 bg-primary/10 border border-primary/30 rounded-xl px-5 py-3">
            <Tag className="w-4 h-4 text-primary flex-shrink-0" />
            <span className="font-body text-xs text-foreground/70">Launch offer · First 20 orders:</span>
            <span className="font-display text-base tracking-widest gradient-gold-glow">LAUNCH15</span>
            <span className="font-body text-xs text-primary">= 15% off</span>
          </div>
        </motion.div>

        {/* Support fallback — top */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8 bg-card border border-primary/20 rounded-2xl p-5 text-center"
        >
          <p className="font-body text-sm text-foreground/70 mb-4">If nothing here is for you, you can still be part of this.</p>
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
                onInterest={setInterestProduct}
                onPreorder={setCheckoutProduct}
              />
            ))}
          </div>
        )}

        {/* Footer note */}
        <p className="text-center font-body text-xs text-muted-foreground/50 mt-16 tracking-wide">
          Register your interest and you will be first to know when the store officially opens.
        </p>

        {/* Support bottom CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-8 text-center"
        >
          <p className="font-body text-sm text-muted-foreground mb-4">Still want to support? You can back the music directly.</p>
          <button
            onClick={() => navigate('/back-this')}
            className="gradient-gold-button rounded-full px-8 py-3 font-body text-sm tracking-wider uppercase inline-flex items-center gap-2"
          >
            <Heart className="w-4 h-4" /> Be Part of This 🤍
          </button>
        </motion.div>
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