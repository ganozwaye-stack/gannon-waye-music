import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import MerchInterestModal from '@/components/store/MerchInterestModal';

const LAUNCH_DEADLINE = new Date('2026-05-17T17:00:00+10:00');
const isLaunchActive = () => new Date() < LAUNCH_DEADLINE;

const FALLBACK_PRODUCTS = [
  {
    id: 'fallback-hoodie',
    name: '"Respect Is Earned" Hoodie - Dark Grey',
    sale_price: 98,
    category: 'apparel',
    image_url: 'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/4454da55f_RespectisEarnedThankyouDarkGreyHoodieFront.png',
  },
  {
    id: 'fallback-bundle',
    name: 'Thank You Journal Pen and Thermos Flask Bundle',
    sale_price: 59,
    category: 'bundle',
    image_url: 'https://base44.app/api/apps/69eb7905ca6eb4180010f794/files/mp/public/69eb7905ca6eb4180010f794/e14220834_Bundle.png',
  },
];

export default function MerchTeaserSection() {
  const [interestProduct, setInterestProduct] = useState(null);

  const { data: dbProducts = [] } = useQuery({
    queryKey: ['merchProducts'],
    queryFn: () => base44.entities.MerchProduct.filter({ is_active: true }),
    initialData: [],
  });

  const products = dbProducts.length > 0 ? dbProducts.slice(0, 4) : FALLBACK_PRODUCTS;

  return (
    <section className="py-12 md:py-16 px-4 md:px-6">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8"
        >
          <p className="font-body text-xs tracking-[0.26em] uppercase gradient-gold-glow mb-3">Official Merch</p>
          <h2 className="font-display text-3xl md:text-5xl text-foreground mb-3">
            Official Merch
          </h2>
          <p className="font-body text-sm text-muted-foreground max-w-md mx-auto mb-2 leading-relaxed">
            Pre-order interest open now. No charge today. Payment scheduled for June 1, 2026.
          </p>
          {isLaunchActive() && (
            <p className="font-body text-xs gradient-gold-glow max-w-sm mx-auto mt-2">
              <strong>Current promo codes can be applied at checkout on eligible Thank You merch.</strong> While stocks last.
            </p>
          )}
        </motion.div>

        {/* Product grid — always shows real products with prices */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-10">
          {products.map((product, i) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              onClick={() => setInterestProduct(product)}
              className="rounded-2xl border border-border/30 bg-card/60 overflow-hidden hover:border-primary/30 transition-all cursor-pointer"
            >
              <div className="aspect-square bg-secondary/60 overflow-hidden relative">
                {product.image_url ? (
                  <img src={product.image_url} alt={product.name} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ShoppingBag className="w-8 h-8 text-muted-foreground/20" />
                  </div>
                )}
              </div>
              <div className="p-3 text-left">
                <p className="font-display text-sm text-foreground leading-snug">{product.name}</p>
                <p className="font-body text-xs gradient-gold-glow mt-1">
                  ${product.sale_price ?? product.price} plus shipping and fees
                </p>
                <Link to="/store" onClick={e => e.stopPropagation()}>
                  <button className="mt-2 w-full gradient-gold-button rounded-full py-1.5 font-body text-[10px] tracking-wider uppercase">
                    View in Store
                  </button>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-8"
        >
          <Link to="/store">
            <Button className="rounded-full px-8 py-5 font-body text-sm tracking-wider uppercase gradient-gold-button border-0">
              View All Merch <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </motion.div>
      </div>

      {interestProduct && (
        <MerchInterestModal
          product={interestProduct}
          onClose={() => setInterestProduct(null)}
        />
      )}
    </section>
  );
}
