import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, Shield, Snowflake } from 'lucide-react';
import { useCartStore } from '@/lib/cartStore';
import { useToast } from '@/components/ui/use-toast';
import AdminEditButton from '@/components/store/AdminEditButton';

// Winter Writing & Comfort Bundle — static ID
const WINTER_BUNDLE = {
  id: 'winter_writing_bundle',
  name: 'Winter Writing & Comfort Bundle',
  sale_price: 129,
  category: 'bundle',
  stock_quantity: 10,
  description: 'The Winter Writing & Comfort Bundle brings together the Respect Is Earned hoodie, journal, pen, and thermos for a premium comfort set built around reflection, warmth, and self-worth.',
  image_url: 'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/6822f58e3_4.jpg',
  images_array: [
    'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/4454da55f_RespectisEarnedThankyouDarkGreyHoodieFront.png',
    'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/6822f58e3_4.jpg',
    'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/146ccc6c7_5.jpg',
  ],
};

export default function WinterBundleHero({ onViewCart }) {
  const { toast } = useToast();
  const addItem = useCartStore(state => state.addItem);
  const [added, setAdded] = React.useState(false);

  const handleAdd = () => {
    addItem(WINTER_BUNDLE, 1, null);
    setAdded(true);
    toast({ title: 'Winter Bundle added to cart! 🤍', description: 'No discounts apply — priced as marked.' });
    setTimeout(() => setAdded(false), 4000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="relative overflow-hidden rounded-2xl border border-primary/30 bg-gradient-to-br from-slate-900 via-card to-slate-900 mb-12"
    >
      {/* Ambient glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-64 h-64 bg-primary/8 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-48 h-48 bg-blue-500/5 rounded-full blur-2xl" />
      </div>

      <div className="relative z-10 flex flex-col md:flex-row gap-8 p-6 md:p-10">
        {/* Images */}
        <div className="flex gap-3 shrink-0 md:w-80">
          <img
            src="https://media.base44.com/images/public/69eb7905ca6eb4180010f794/4454da55f_RespectisEarnedThankyouDarkGreyHoodieFront.png"
            alt="Hoodie"
            className="w-1/2 rounded-xl object-cover aspect-square"
          />
          <div className="w-1/2 flex flex-col gap-3">
            <img
              src="https://media.base44.com/images/public/69eb7905ca6eb4180010f794/6822f58e3_4.jpg"
              alt="Journal bundle"
              className="w-full rounded-xl object-cover aspect-square"
            />
            <img
              src="https://media.base44.com/images/public/69eb7905ca6eb4180010f794/146ccc6c7_5.jpg"
              alt="Thermos"
              className="w-full rounded-xl object-cover aspect-square"
            />
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-col justify-center gap-4 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-body text-[9px] tracking-[0.2em] uppercase px-2.5 py-1 rounded-full bg-primary/15 border border-primary/30 text-primary flex items-center gap-1.5">
              <Snowflake className="w-3 h-3" /> Feature Bundle
            </span>
            <span className="font-body text-[9px] tracking-[0.15em] uppercase px-2.5 py-1 rounded-full bg-red-500/10 border border-red-500/25 text-red-400 flex items-center gap-1.5">
              <Shield className="w-3 h-3" /> No further discounts apply
            </span>
            <AdminEditButton href="/admin/merch" label="Edit Bundle" />
          </div>

          <div>
            <h2 className="font-display text-2xl md:text-3xl text-foreground leading-tight mb-1">
              Winter Writing &<br />Comfort Bundle
            </h2>
            <p className="font-display text-3xl gradient-gold-glow mt-2">$129 <span className="text-base font-body text-muted-foreground">AUD + postage</span></p>
          </div>

          <p className="font-body text-sm text-muted-foreground leading-relaxed max-w-md">
            Built for cold nights, reflection, comfort, and the lyric that started a movement. Includes the hoodie, journal, pen, and thermos flask.
          </p>

          <ul className="space-y-1.5">
            {[
              'Respect Is Earned Hoodie — Dark Grey',
              'Thankyou Journal',
              'Pen',
              'Thermos Flask',
            ].map(item => (
              <li key={item} className="flex items-center gap-2 font-body text-xs text-muted-foreground">
                <span className="w-1 h-1 rounded-full bg-primary shrink-0" />
                {item}
              </li>
            ))}
          </ul>

          <div className="flex flex-wrap gap-3 pt-2">
            {added ? (
              <>
                <button
                  onClick={() => onViewCart?.()}
                  className="gradient-gold-button rounded-full px-6 py-2.5 font-body text-sm tracking-wider uppercase"
                >
                  View Cart
                </button>
                <button
                  onClick={() => setAdded(false)}
                  className="border border-border/40 rounded-full px-5 py-2.5 font-body text-xs text-muted-foreground"
                >
                  Continue Shopping
                </button>
              </>
            ) : (
              <button
                data-testid="winter-bundle-add-to-cart"
                onClick={handleAdd}
                className="gradient-gold-button rounded-full px-8 py-2.5 font-body text-sm tracking-wider uppercase flex items-center gap-2"
              >
                <ShoppingCart className="w-4 h-4" /> Add Winter Bundle to Cart
              </button>
            )}
          </div>

          <p className="font-body text-[10px] text-muted-foreground/50">
            Promo codes do not apply to this bundle. Price is as marked.
          </p>
        </div>
      </div>
    </motion.div>
  );
}