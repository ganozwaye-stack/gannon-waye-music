import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { ShoppingBag, Tag, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import MerchInterestModal from '@/components/store/MerchInterestModal';

// Badge config per product id or category
const PRODUCT_BADGES = {
  '69f11d1fc43e13c61fe6b9d6': { label: 'Deluxe · Signed', color: 'bg-primary/20 text-primary border-primary/40' },
  '69eed3e64e2da78ae4418a9d': { label: 'Collector\'s Edition', color: 'bg-primary/20 text-primary border-primary/40' },
  '69f11d1fc43e13c61fe6b9d7': { label: 'Taking pre-orders now', color: 'bg-green-500/15 text-green-400 border-green-500/30' },
  '69eed3e64e2da78ae4418a99': { label: 'Taking pre-orders now', color: 'bg-green-500/15 text-green-400 border-green-500/30' },
  '69fbd261b760426cede1b7a3': { label: 'Limited series · Almost sold out', color: 'bg-amber-500/15 text-amber-400 border-amber-500/30' },
  '69eed3e64e2da78ae4418a9a': { label: 'Limited series · Almost sold out', color: 'bg-amber-500/15 text-amber-400 border-amber-500/30' },
};

// Launch discount deadline: Sunday 5pm AEST
const LAUNCH_DEADLINE = new Date('2026-05-17T17:00:00+10:00');
const isLaunchActive = () => new Date() < LAUNCH_DEADLINE;

// Fallback if DB returns empty
const FALLBACK_PRODUCTS = [
  {
    id: '69f11d1fc43e13c61fe6b9d6',
    name: 'Thank You — Deluxe Signed CD Single',
    sale_price: 10,
    category: 'cd',
    stock_quantity: 50,
    image_url: 'https://base44.app/api/apps/69eb7905ca6eb4180010f794/files/mp/public/69eb7905ca6eb4180010f794/6fbecc91f_THANKYOUOfficialSingleCover.bmp',
    description: "This is more than a CD. It's a moment. Hand-signed by Gannon Waye himself.",
  },
  {
    id: '69eed3e64e2da78ae4418a9d',
    name: '"Thank You" CD Single — Slim Case',
    sale_price: 20,
    category: 'cd',
    stock_quantity: 40,
    image_url: 'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/c2a1369c4_1.png',
    description: "Physical CD single presented in a slim clear plastic jewel case.",
  },
  {
    id: '69f11d1fc43e13c61fe6b9d7',
    name: '"Respect Is Earned" Hoodie — Dark Grey',
    sale_price: 98,
    category: 'apparel',
    stock_quantity: 50,
    sizes_available: ['XS', 'S', 'M', 'L', 'XL', '2XL'],
    image_url: 'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/4454da55f_RespectisEarnedThankyouDarkGreyHoodieFront.png',
    description: "A statement piece. Premium heavyweight dark grey hoodie.",
  },
  {
    id: '69eed3e64e2da78ae4418a99',
    name: 'Respect Is Earned Oversized Tee',
    sale_price: 59,
    category: 'apparel',
    stock_quantity: 20,
    sizes_available: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    image_url: 'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/4765f5793_generated_image.png',
    description: "Official debut single artwork on a premium oversized tee.",
  },
  {
    id: '69fbd261b760426cede1b7a3',
    name: 'Thank You Journal Pen and Thermos Flask Bundle',
    sale_price: 54,
    category: 'bundle',
    stock_quantity: 20,
    image_url: 'https://base44.app/api/apps/69eb7905ca6eb4180010f794/files/mp/public/69eb7905ca6eb4180010f794/e14220834_Bundle.png',
    description: "For anyone journaling, processing, or needing a safe-space bundle, this kit is all you need.",
  },
  {
    id: '69eed3e64e2da78ae4418a9a',
    name: '"Thank You" Tote Bag',
    sale_price: 15,
    category: 'accessories',
    stock_quantity: 100,
    image_url: 'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/fe7b6b744_generated_image.png',
    description: "Large folding tote bag featuring the official 'Thank You' single cover artwork.",
  },
];

function ProductCard({ product, onSelect, large }) {
  const price = product.sale_price ?? product.price;
  const soldOut = product.stock_quantity === 0 || product.is_active === false;
  const badge = PRODUCT_BADGES[product.id];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      onClick={() => !soldOut && onSelect(product)}
      className={`group rounded-2xl border border-border/30 hover:border-primary/30 bg-card/40 overflow-hidden backdrop-blur-sm transition-all duration-300 ${soldOut ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}
    >
      {/* Image */}
      <div className={`${large ? 'aspect-[4/3]' : 'aspect-square'} bg-gradient-to-br from-secondary/20 to-secondary/60 relative overflow-hidden`}>
        {product.image_url ? (
          <img src={product.image_url} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <ShoppingBag className="w-16 h-16 text-muted-foreground/20" />
          </div>
        )}
        {/* Top-left badge */}
        {badge && (
          <div className="absolute top-3 left-3 z-10">
            <span className={`font-body text-[9px] tracking-[0.15em] uppercase border rounded-full px-2 py-0.5 ${badge.color}`}>
              {badge.label}
            </span>
          </div>
        )}
        {soldOut && (
          <div className="absolute inset-0 bg-background/60 flex items-center justify-center">
            <span className="font-body text-xs tracking-widest uppercase text-muted-foreground border border-border rounded-full px-3 py-1">Sold out</span>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-border/30 bg-card/20">
        <p className="font-display text-sm text-foreground leading-snug">{product.name}</p>
        <p className="font-body text-sm gradient-gold-glow mt-1 font-medium">
          ${price} plus shipping and fees
        </p>
        <p className="font-body text-[10px] text-muted-foreground/60 mt-1 leading-relaxed">
          Pre-order interest only. No charge today. Payment scheduled for June 1, 2026, subject to confirmation.
        </p>
        <button
          onClick={e => { e.stopPropagation(); if (!soldOut) onSelect(product); }}
          disabled={soldOut}
          className={`mt-3 w-full rounded-full py-2 font-body text-[10px] tracking-wider uppercase transition-all ${soldOut ? 'bg-secondary/50 text-muted-foreground cursor-not-allowed' : 'gradient-gold-button'}`}
        >
          {soldOut ? 'Sold Out' : 'Register Pre-order Interest'}
        </button>
      </div>
    </motion.div>
  );
}

export default function Store() {
  const [interestProduct, setInterestProduct] = useState(null);
  const navigate = useNavigate();

  const { data: dbProducts = [] } = useQuery({
    queryKey: ['storeProducts'],
    queryFn: () => base44.entities.MerchProduct.filter({ is_active: true }, '-created_date'),
    initialData: [],
  });

  const products = dbProducts.length > 0 ? dbProducts : FALLBACK_PRODUCTS;

  const cdProducts = products.filter(p => p.category === 'cd');
  const merchProducts = products.filter(p => p.category !== 'cd');

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

          {/* Launch discount banner */}
          {isLaunchActive() && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 bg-amber-500/10 border border-amber-500/40 rounded-xl px-5 py-3 max-w-xl mx-auto"
            >
              <p className="font-body text-xs text-amber-300 text-center leading-relaxed">
                🔥 <strong>Launch offer: use code THANKYOU15 for 15% off eligible Thank You merch until 5pm Sunday.</strong> While stocks last.
              </p>
            </motion.div>
          )}
        </motion.div>

        {/* CD Row — centred, slightly larger */}
        {cdProducts.length > 0 && (
          <>
            <div className="flex items-center gap-4 mt-12 mb-6">
              <div className="flex-1 h-px bg-border/40" />
              <span className="font-body text-[10px] tracking-[0.3em] uppercase text-muted-foreground/50">CD Singles</span>
              <div className="flex-1 h-px bg-border/40" />
            </div>
            <div className="flex justify-center">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-2xl">
                {cdProducts.map(product => (
                  <ProductCard key={product.id} product={product} onSelect={setInterestProduct} large />
                ))}
              </div>
            </div>
          </>
        )}

        {/* Merch Row */}
        {merchProducts.length > 0 && (
          <>
            <div className="flex items-center gap-4 mt-14 mb-6">
              <div className="flex-1 h-px bg-border/40" />
              <span className="font-body text-[10px] tracking-[0.3em] uppercase text-muted-foreground/50">Apparel &amp; Accessories</span>
              <div className="flex-1 h-px bg-border/40" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {merchProducts.map(product => (
                <ProductCard key={product.id} product={product} onSelect={setInterestProduct} />
              ))}
            </div>
          </>
        )}

        {/* Support CTA */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 bg-card border border-primary/20 rounded-2xl p-5 text-center"
        >
          <p className="font-body text-sm text-foreground/70 mb-1">Not your style? You can still support this.</p>
          <button
            onClick={() => navigate('/back-this')}
            className="mt-3 gradient-gold-button rounded-full px-8 py-2.5 font-body text-sm tracking-wider uppercase inline-flex items-center gap-2"
          >
            <Heart className="w-4 h-4" /> Support Now 🤍
          </button>
        </motion.div>

        <p className="text-center font-body text-xs text-muted-foreground/40 mt-10 tracking-wide">
          Thank You, official release date 05 June 2026. Available on all leading platforms from 05 June 2026.
        </p>
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