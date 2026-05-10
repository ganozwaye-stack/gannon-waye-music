import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { ShoppingBag, Tag, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import MerchInterestModal from '@/components/store/MerchInterestModal';

// Fallback products shown if DB returns empty (permissions or loading issue)
const FALLBACK_PRODUCTS = [
  {
    id: 'fallback-hoodie',
    name: '"Respect Is Earned" Hoodie — Dark Grey',
    sale_price: 89,
    category: 'apparel',
    image_url: 'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/4454da55f_RespectisEarnedThankyouDarkGreyHoodieFront.png',
    description: "A statement piece. Premium heavyweight dark grey hoodie.",
    sizes_available: ['XS', 'S', 'M', 'L', 'XL', '2XL'],
  },
  {
    id: 'fallback-bundle',
    name: 'Thank You Journal Pen and Thermos Flask Bundle',
    sale_price: 49,
    category: 'bundle',
    image_url: 'https://base44.app/api/apps/69eb7905ca6eb4180010f794/files/mp/public/69eb7905ca6eb4180010f794/e14220834_Bundle.png',
    description: "The complete collector's set. Premium branded journal, custom engraved pen, and stainless steel thermos flask.",
    sizes_available: ['3pc SET'],
  },
];

export default function Store() {
  const [interestProduct, setInterestProduct] = useState(null);
  const navigate = useNavigate();

  const { data: dbProducts = [] } = useQuery({
    queryKey: ['storeProducts'],
    queryFn: () => base44.entities.MerchProduct.filter({ is_active: true }, '-created_date'),
    initialData: [],
  });

  // Use DB products if available, otherwise fallback to hardcoded approved products
  const products = dbProducts.length > 0 ? dbProducts : FALLBACK_PRODUCTS;

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
              Pre-order interest only · No charge today · Payment scheduled for June 1, 2026, subject to confirmation
            </p>
          </div>
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/30 rounded-xl px-5 py-3">
            <Tag className="w-4 h-4 text-primary flex-shrink-0" />
            <span className="font-body text-xs text-foreground/70">Have a promo code? Enter it at checkout for your discount.</span>
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

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {products.map((product, i) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              onClick={() => setInterestProduct(product)}
              className="group rounded-2xl border border-border/30 hover:border-primary/30 bg-card/40 overflow-hidden backdrop-blur-sm transition-all duration-300 cursor-pointer"
            >
              {/* Image area */}
              <div className="aspect-square bg-gradient-to-br from-secondary/20 to-secondary/60 relative overflow-hidden">
                {product.image_url ? (
                  <img src={product.image_url} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ShoppingBag className="w-16 h-16 text-muted-foreground/20" />
                  </div>
                )}
                <div className="absolute top-3 left-3 z-10">
                  <span className="font-body text-[9px] tracking-[0.2em] uppercase bg-background/70 backdrop-blur border border-primary/30 text-primary rounded-full px-2 py-0.5">
                    Pre-order
                  </span>
                </div>
              </div>

              {/* Card footer */}
              <div className="p-5 border-t border-border/30 bg-card/20">
                <p className="font-display text-base text-foreground leading-snug">{product.name}</p>
                <p className="font-body text-sm gradient-gold-glow mt-1 font-medium">
                  ${product.sale_price ?? product.price} plus shipping and fees
                </p>
                <p className="font-body text-[10px] text-muted-foreground/70 mt-1 leading-relaxed">
                  Pre-order interest only. No charge today. Payment scheduled for June 1, 2026, subject to confirmation.
                </p>
                <button
                  onClick={e => { e.stopPropagation(); setInterestProduct(product); }}
                  className="mt-3 w-full gradient-gold-button rounded-full py-2 font-body text-[10px] tracking-wider uppercase"
                >
                  Register Pre-order Interest
                </button>
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