import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { ShoppingBag, Tag, Heart, Bell } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import CheckoutModal from '@/components/store/CheckoutModal';
import { useToast } from '@/components/ui/use-toast';
import ProductImageRotator from '@/components/store/ProductImageRotator';

// Badge config per product id
const PRODUCT_BADGES = {
  '69f11d1fc43e13c61fe6b9d6': { label: 'Slim Case', color: 'bg-secondary text-muted-foreground border-border/40' },
  '69eed3e64e2da78ae4418a9d': { label: 'Deluxe · Signed', color: 'bg-primary/20 text-primary border-primary/40' },
  '69f11d1fc43e13c61fe6b9d7': { label: 'Pre-order Open', color: 'bg-green-500/15 text-green-400 border-green-500/30' },
  '69eed3e64e2da78ae4418a9a': { label: 'Open for Orders', color: 'bg-green-500/15 text-green-400 border-green-500/30' },
  '69eed3e64e2da78ae4418a99': { label: 'Open for Orders', color: 'bg-green-500/15 text-green-400 border-green-500/30' },
};

// Per-product config: mode + messaging
const PRODUCT_CONFIG = {
  '69f11d1fc43e13c61fe6b9d6': { mode: 'buy', label: 'Order Now — $10', sub: 'Pre-order · Ships June 2026' },
  '69eed3e64e2da78ae4418a9d': { mode: 'buy', label: 'Order Now — $20', sub: 'Pre-order · Signed · Ships June 2026' },
  '69f11d1fc43e13c61fe6b9d7': { mode: 'buy', label: 'Order Now', sub: 'Pre-order · Ships June 2026' },
  '69eed3e64e2da78ae4418a99': { mode: 'buy', label: 'Order Now', sub: 'Pre-order · Ships July 2026' },
  '69fbd261b760426cede1b7a3': { mode: 'buy', label: 'Order Now', sub: 'Ships June 2026' },
  '69eed3e64e2da78ae4418a9a': { mode: 'buy', label: 'Order Now', sub: 'Pre-order · Ships July 2026' },
};

// Multi-image galleries per product id (auto-rotates in card)
const PRODUCT_GALLERIES = {
  '69eed3e64e2da78ae4418a9a': [
    'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/d45dc7100_RespectisEarnedToteBagFront.png',
    'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/39dab5737_RespectisEarnedToteBagBack.png',
    'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/9259d695b_RespectisEarnedToteBag-Copy.png',
    'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/6e67c609a_RespectisEarnedToteBag.png',
  ],
  '69eed3e64e2da78ae4418a99': [
    'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/dbb657925_IMG_17251.JPG',
    'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/4b7f96472_IMG_1725.JPG',
  ],
};

// Corrected static product data
const FALLBACK_PRODUCTS = [
  {
    id: '69f11d1fc43e13c61fe6b9d6',
    name: '"Thank You" CD Single — Slim Case',
    sale_price: 10,
    category: 'cd',
    stock_quantity: 50,
    image_url: 'https://base44.app/api/apps/69eb7905ca6eb4180010f794/files/mp/public/69eb7905ca6eb4180010f794/6fbecc91f_THANKYOUOfficialSingleCover.bmp',
    description: 'Official debut single in a slim clear plastic jewel case.',
  },
  {
    id: '69eed3e64e2da78ae4418a9d',
    name: 'Thank You — Deluxe Signed CD Single',
    sale_price: 20,
    category: 'cd',
    stock_quantity: 40,
    image_url: 'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/c2a1369c4_1.png',
    description: 'Hand-signed by Gannon Waye. A limited, personal piece of this moment.',
  },
  {
    id: '69f11d1fc43e13c61fe6b9d7',
    name: '"Respect Is Earned" Hoodie — Dark Grey',
    sale_price: 98,
    category: 'apparel',
    stock_quantity: 50,
    sizes_available: ['XS', 'S', 'M', 'L', 'XL', '2XL'],
    image_url: 'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/4454da55f_RespectisEarnedThankyouDarkGreyHoodieFront.png',
    description: 'Premium heavyweight dark grey hoodie. Statement piece.',
  },
  {
    id: '69eed3e64e2da78ae4418a99',
    name: 'Respect Is Earned Oversized Tee',
    sale_price: 59,
    category: 'apparel',
    stock_quantity: 50,
    sizes_available: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    image_url: 'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/dbb657925_IMG_17251.JPG',
    images_array: [
      'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/dbb657925_IMG_17251.JPG',
      'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/4b7f96472_IMG_1725.JPG',
    ],
    description: 'Official debut single artwork on a premium oversized tee.',
  },
  {
    id: '69fbd261b760426cede1b7a3',
    name: 'Thank You Journal Pen and Thermos Flask Bundle',
    sale_price: 54,
    category: 'bundle',
    stock_quantity: 20,
    image_url: 'https://base44.app/api/apps/69eb7905ca6eb4180010f794/files/mp/public/69eb7905ca6eb4180010f794/e14220834_Bundle.png',
    description: 'Journaling, processing, or needing a safe-space kit — this is it.',
  },
  {
    id: '69eed3e64e2da78ae4418a9a',
    name: '"Thank You" Tote Bag',
    sale_price: 15,
    category: 'accessories',
    stock_quantity: 100,
    image_url: 'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/d45dc7100_RespectisEarnedToteBagFront.png',
    images_array: [
      'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/d45dc7100_RespectisEarnedToteBagFront.png',
      'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/39dab5737_RespectisEarnedToteBagBack.png',
      'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/9259d695b_RespectisEarnedToteBag-Copy.png',
      'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/6e67c609a_RespectisEarnedToteBag.png',
    ],
    description: "Large folding tote bag featuring the official 'Thank You' single cover artwork.",
  },
];

function InterestButton({ productId, productName }) {
  const { toast } = useToast();
  const key = `interest_${productId}`;
  const [done, setDone] = useState(() => !!localStorage.getItem(key));
  const [showForm, setShowForm] = useState(false);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    try {
      await base44.entities.MerchInterest.create({ product_id: productId, product_name: productName, name: 'Interest', email, phone: '', consent_merch: true });
      localStorage.setItem(key, '1');
      setDone(true);
      toast({ title: "You're on the list! We'll notify you when available. 🤍" });
    } catch {
      toast({ title: 'Already registered or error — try again.', variant: 'destructive' });
    }
    setLoading(false);
  };

  if (done) {
    return (
      <div className="mt-3 w-full rounded-full py-2 font-body text-[10px] tracking-wider uppercase flex items-center justify-center gap-2 border border-primary/40 text-primary bg-primary/10">
        <Bell className="w-3.5 h-3.5" /> You're on the list
      </div>
    );
  }

  if (showForm) {
    return (
      <form onSubmit={submit} className="mt-3 flex gap-1.5">
        <input
          type="email"
          placeholder="your@email.com"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="flex-1 bg-secondary/50 border border-border/40 rounded-lg px-2 py-1.5 font-body text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/40 min-w-0"
        />
        <button type="submit" disabled={loading} className="shrink-0 px-3 py-1.5 rounded-lg gradient-gold-button font-body text-[10px] tracking-wider uppercase">
          {loading ? '...' : 'Notify me'}
        </button>
      </form>
    );
  }

  return (
    <button
      onClick={() => setShowForm(true)}
      className="mt-3 w-full rounded-full py-2 font-body text-[10px] tracking-wider uppercase transition-all flex items-center justify-center gap-2 border border-border/50 text-muted-foreground hover:border-primary/40 hover:text-primary"
    >
      <Bell className="w-3.5 h-3.5" /> Register Interest
    </button>
  );
}

function ProductCard({ product, onSelect }) {
  const price = product.sale_price ?? product.price;
  const cfg = PRODUCT_CONFIG[product.id];
  const isInterest = cfg?.mode === 'interest';
  const soldOut = !isInterest && (product.stock_quantity === 0 || cfg?.mode === 'soldout');
  const badge = PRODUCT_BADGES[product.id];
  const isCd = product.category === 'cd';
  const galleryImages = PRODUCT_GALLERIES[product.id] || (product.images_array?.length > 0 ? product.images_array : null);
  const singleImage = product.image_url;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group rounded-2xl border border-border/30 hover:border-primary/30 bg-card/40 overflow-hidden backdrop-blur-sm transition-all duration-300"
    >
      {/* Image */}
      <div className="relative">
        {galleryImages ? (
          <ProductImageRotator
            images={galleryImages}
            alt={product.name}
            aspectClass={isCd ? 'aspect-[4/3]' : 'aspect-square'}
          />
        ) : singleImage ? (
          <div className={`${isCd ? 'aspect-[4/3]' : 'aspect-square'} bg-gradient-to-br from-secondary/20 to-secondary/60 overflow-hidden`}>
            <img src={singleImage} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          </div>
        ) : (
          <div className={`${isCd ? 'aspect-[4/3]' : 'aspect-square'} bg-gradient-to-br from-secondary/20 to-secondary/60 flex items-center justify-center`}>
            <ShoppingBag className="w-16 h-16 text-muted-foreground/20" />
          </div>
        )}
        {badge && (
          <div className="absolute top-3 left-3 z-10">
            <span className={`font-body text-[9px] tracking-[0.15em] uppercase border rounded-full px-2 py-0.5 ${badge.color}`}>
              {badge.label}
            </span>
          </div>
        )}
        {soldOut && !isInterest && (
          <div className="absolute inset-0 bg-background/60 flex items-center justify-center">
            <span className="font-body text-xs tracking-widest uppercase text-muted-foreground border border-border rounded-full px-3 py-1">Coming soon</span>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-border/30 bg-card/20">
        <p className="font-display text-sm text-foreground leading-snug">{product.name}</p>
        <p className="font-body text-sm gradient-gold-glow mt-1 font-medium">${price} AUD</p>
        {cfg?.sub && !soldOut && (
          <p className="font-body text-[10px] text-muted-foreground/60 mt-1 leading-relaxed">{cfg.sub}</p>
        )}

        {isInterest ? (
          <InterestButton productId={product.id} productName={product.name} />
        ) : soldOut ? (
          <InterestButton productId={product.id} productName={product.name} />
        ) : (
          <button
            onClick={() => onSelect(product)}
            className="mt-3 w-full rounded-full py-2 font-body text-[10px] tracking-wider uppercase transition-all gradient-gold-button"
          >
            {cfg?.label || 'Order Now'}
          </button>
        )}
      </div>
    </motion.div>
  );
}

export default function Store() {
  const [checkoutProduct, setCheckoutProduct] = useState(null);
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
          className="text-center mb-6"
        >
          <p className="font-body text-xs tracking-[0.3em] uppercase gradient-gold-glow mb-4">Official</p>
          <h1 className="font-display text-4xl md:text-6xl text-foreground mb-5">Merch</h1>
          <div className="inline-flex items-center gap-2 bg-primary/5 border border-primary/20 rounded-xl px-5 py-3 mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            <p className="font-body text-xs text-foreground/70">
              Pre-orders open · Payment processed on or after <strong>June 1, 2026</strong> · Orders updated with shipping info
            </p>
          </div>
          <div className="inline-flex items-center gap-2 bg-card border border-border/40 rounded-full px-5 py-2">
            <Tag className="w-3.5 h-3.5 text-primary" />
            <span className="font-body text-xs text-muted-foreground">Have a promo code? Enter it at checkout.</span>
          </div>
        </motion.div>

        {/* CD Row */}
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
                  <ProductCard key={product.id} product={product} onSelect={setCheckoutProduct} />
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
                <ProductCard key={product.id} product={product} onSelect={setCheckoutProduct} />
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
            <Heart className="w-4 h-4" /> Support Now
          </button>
        </motion.div>

        <p className="text-center font-body text-xs text-muted-foreground/40 mt-10 tracking-wide">
          Thank You, official release date 05 June 2026.
        </p>
      </div>

      {checkoutProduct && (
        <CheckoutModal
          product={checkoutProduct}
          onClose={() => setCheckoutProduct(null)}
        />
      )}
    </div>
  );
}