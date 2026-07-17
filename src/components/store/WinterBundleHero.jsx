import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, Shield, Snowflake } from 'lucide-react';
import { useCartStore } from '@/lib/cartStore';
import { useToast } from '@/components/ui/use-toast';
import AdminEditButton from '@/components/store/AdminEditButton';
import { STORE_PRODUCTS } from '@/config/storeWorldConfig';

const WINTER_BUNDLE = STORE_PRODUCTS.find(product => product.id === '6a2d595ef7bb7ff53258cdfd');

export default function WinterBundleHero({ onViewCart }) {
  const { toast } = useToast();
  const addItem = useCartStore(state => state.addItem);
  const [added, setAdded] = React.useState(false);
  const images = WINTER_BUNDLE?.images || [];

  const handleAdd = () => {
    if (!WINTER_BUNDLE) return;
    addItem(WINTER_BUNDLE, 1, null);
    setAdded(true);
    toast({ title: 'Winter Bundle added to cart', description: 'No discounts apply - priced as marked.' });
    setTimeout(() => setAdded(false), 4000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      data-testid="winter-bundle-hero"
      className="relative mb-12 overflow-hidden rounded-xl border border-primary/25 bg-card/40"
    >
      <div className="grid gap-6 p-4 md:grid-cols-[1.18fr_1fr] md:p-6 lg:p-8">
        <div className="grid gap-3">
          <div className="aspect-[16/10] overflow-hidden rounded-lg border border-primary/20 bg-black/35">
            <img
              src={images[0]}
              alt={WINTER_BUNDLE?.name || 'Winter Writing & Comfort Bundle'}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="grid grid-cols-3 gap-3">
            {images.slice(1, 4).map((image, index) => (
              <div key={image} className="aspect-[16/10] overflow-hidden rounded-lg border border-border/30 bg-black/30">
                <img
                  src={image}
                  alt={`${WINTER_BUNDLE?.shortName || 'Winter Bundle'} view ${index + 2}`}
                  className="h-full w-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col justify-center gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/15 px-2.5 py-1 font-body text-[9px] uppercase tracking-[0.2em] text-primary">
              <Snowflake className="h-3 w-3" /> Feature Bundle
            </span>
            <span className="flex items-center gap-1.5 rounded-full border border-red-500/25 bg-red-500/10 px-2.5 py-1 font-body text-[9px] uppercase tracking-[0.15em] text-red-400">
              <Shield className="h-3 w-3" /> No further discounts apply
            </span>
            <AdminEditButton href="/admin/merch" label="Edit Bundle" />
          </div>

          <div>
            <h2 className="font-display text-2xl leading-tight text-foreground md:text-3xl">
              {WINTER_BUNDLE?.name || 'Winter Writing & Comfort Bundle'}
            </h2>
            <p className="mt-2 font-display text-3xl gradient-gold-glow">
              {WINTER_BUNDLE?.price || '$119'} <span className="font-body text-base text-muted-foreground">AUD + postage</span>
            </p>
          </div>

          <p className="max-w-xl font-body text-sm leading-relaxed text-muted-foreground">
            {WINTER_BUNDLE?.description}
          </p>

          <ul className="grid gap-1.5 sm:grid-cols-2">
            {(WINTER_BUNDLE?.includes || []).map(item => (
              <li key={item} className="flex items-center gap-2 font-body text-xs text-muted-foreground">
                <span className="h-1 w-1 shrink-0 rounded-full bg-primary" />
                {item}
              </li>
            ))}
          </ul>

          <div className="flex flex-wrap gap-3 pt-2">
            {added ? (
              <>
                <button
                  type="button"
                  onClick={() => onViewCart?.()}
                  className="rounded-full px-6 py-2.5 font-body text-sm uppercase tracking-wider gradient-gold-button"
                >
                  View Cart
                </button>
                <button
                  type="button"
                  onClick={() => setAdded(false)}
                  className="rounded-full border border-border/40 px-5 py-2.5 font-body text-xs text-muted-foreground"
                >
                  Continue Shopping
                </button>
              </>
            ) : (
              <button
                type="button"
                data-testid="winter-bundle-add-to-cart"
                onClick={handleAdd}
                className="flex items-center gap-2 rounded-full px-8 py-2.5 font-body text-sm uppercase tracking-wider gradient-gold-button"
              >
                <ShoppingCart className="h-4 w-4" /> Add Winter Bundle to Cart
              </button>
            )}
          </div>

          <p className="font-body text-[10px] text-muted-foreground/50">
            Base44 stock: {WINTER_BUNDLE?.stock_quantity ?? 0} available. Promo codes do not apply to this bundle.
          </p>
        </div>
      </div>
    </motion.div>
  );
}
