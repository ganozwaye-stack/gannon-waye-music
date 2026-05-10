import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, ShoppingBag, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import CountdownTimer from './CountdownTimer';
import { useSiteReveal } from '@/hooks/useSiteReveal';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import MerchInterestModal from '@/components/store/MerchInterestModal';

const UNLOCK_DATE = '2026-05-10T08:00:00Z';

const TEASER_ITEMS = [
  { label: 'Apparel', hint: 'Something to wear' },
  { label: 'Accessories', hint: 'Carry it with you' },
  { label: 'CD Singles', hint: 'Hold the music' },
  { label: 'Collectibles', hint: 'Limited & signed' },
];

export default function MerchTeaserSection() {
  const { merchRevealed } = useSiteReveal();
  const [interestProduct, setInterestProduct] = useState(null);

  const { data: products = [] } = useQuery({
    queryKey: ['merchProducts'],
    queryFn: () => base44.entities.MerchProduct.filter({ is_active: true }),
    initialData: [],
    enabled: merchRevealed,
  });

  const preview = products.slice(0, 4);

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
            {merchRevealed ? 'Shop Now' : 'Something Is Coming'}
          </h2>
          {!merchRevealed && (
            <>
              <p className="font-body text-sm text-muted-foreground max-w-md mx-auto mb-6 leading-relaxed">
                The official Gannon Waye merch store opens June 10 — the same moment as the debut single drop.
              </p>
              <div className="flex justify-center">
                <CountdownTimer targetDate={UNLOCK_DATE} />
              </div>
            </>
          )}
          {merchRevealed && (
            <p className="font-body text-sm text-muted-foreground max-w-md mx-auto mb-2 leading-relaxed">
              The store is open. Limited quantities — get in before it's gone.
            </p>
          )}
        </motion.div>

        {/* Locked silhouettes before reveal */}
        {!merchRevealed && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-10">
            {TEASER_ITEMS.map((item, i) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                onClick={() => setInterestProduct({ id: `teaser-${item.label.toLowerCase()}`, name: item.label })}
                className="rounded-2xl border border-border/30 hover:border-primary/30 bg-card/60 overflow-hidden cursor-pointer transition-all"
              >
                <div className="aspect-square bg-secondary/60 flex flex-col items-center justify-center gap-2 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent" />
                  <Lock className="w-6 h-6 text-primary/40" />
                  <p className="font-body text-[10px] tracking-[0.2em] uppercase text-muted-foreground/60">Pre-order</p>
                </div>
                <div className="p-3 text-center">
                  <p className="font-display text-sm text-foreground/70">{item.label}</p>
                  <p className="font-body text-[11px] text-muted-foreground/50 mt-0.5">{item.hint}</p>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Real products after reveal */}
        {merchRevealed && preview.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-10">
            {preview.map((product, i) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                onClick={() => setInterestProduct(product)}
                className="rounded-2xl border border-border/30 bg-card/60 overflow-hidden hover:border-primary/30 transition-all cursor-pointer"
              >
                <div className="aspect-square bg-secondary/60 overflow-hidden">
                  {product.image_url ? (
                    <img src={product.image_url} alt={product.name} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ShoppingBag className="w-8 h-8 text-muted-foreground/20" />
                    </div>
                  )}
                </div>
                <div className="p-3 text-center">
                  <p className="font-display text-sm text-foreground leading-snug">{product.name}</p>
                  <p className="font-body text-xs gradient-gold-glow mt-1">${(product.sale_price ?? product.price ?? 0).toFixed(2)}</p>
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
          {merchRevealed ? (
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

      {interestProduct && (
        <MerchInterestModal
          product={interestProduct}
          onClose={() => setInterestProduct(null)}
        />
      )}
    </section>
  );
}