import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { ShoppingBag, Heart, Sparkles, ShoppingCart, Plus, ZoomIn } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import ProductImageRotator from '@/components/store/ProductImageRotator';
import { useCartStore } from '@/lib/cartStore';
import ProductDetailModal from '@/components/store/ProductDetailModal';
import CartDrawer from '@/components/store/CartDrawer';
import WinterBundleHero from '@/components/store/WinterBundleHero';
import AdminEditButton from '@/components/store/AdminEditButton';

// Badge config per product id — only show special labels, stock status handled dynamically
const PRODUCT_BADGES = {
  '69f11d1fc43e13c61fe6b9d6': { label: 'Slim Case', color: 'bg-secondary text-muted-foreground border-border/40' },
  '69eed3e64e2da78ae4418a9d': { label: 'Deluxe · Signed', color: 'bg-primary/20 text-primary border-primary/40' },
  '69f11d1fc43e13c61fe6b9d7': { label: 'Available Now', color: 'bg-green-500/15 text-green-400 border-green-500/30' },
  '69eed3e64e2da78ae4418a99': { label: 'In Stock', color: 'bg-green-500/15 text-green-400 border-green-500/30' },
};

// Store is OPEN — products show buy button
const STORE_OPEN = true;

// Per-product config: sub-label only (no buy mode while store closed)
const PRODUCT_CONFIG = {
  '69f11d1fc43e13c61fe6b9d6': { sub: 'Sold out · Thank you for the love 🤍' },
  '69eed3e64e2da78ae4418a9d': { sub: 'Sold out · Limited hand-signed edition' },
  '69f11d1fc43e13c61fe6b9d7': { sub: '⚡ Get in fast — stock running out · New shipment on its way · $89' },
  '69eed3e64e2da78ae4418a99': { sub: 'Sold out · Oversized premium tee · $49' },
  '69fbd261b760426cede1b7a3': { sub: '❄️ Also available in the Winter Writing & Comfort Bundle — $129 with hoodie, pen & thermo. Journal features "Respect Is Earned, Not A Game You Make Me Play" lyric.' },
  '69eed3e64e2da78ae4418a9a': { sub: 'Sold out due to popular demand. These will not be restocked. 🤍' },
};

// Multi-image galleries per product id (auto-rotates in card)
const MUG_ID = '6a16abb0198d4c5d294edc11';
// Use explicit string keys — computed key [MUG_ID] can cause runtime errors in some build paths
const PRODUCT_GALLERIES = {
  '6a16abb0198d4c5d294edc11': [
    'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/d1e8a7822_MugFront.png',
    'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/0261db66f_MugBack.png',
  ],
  '69eed3e64e2da78ae4418a9a': [
    'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/5d1b577f1_2.jpg',
    'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/d45dc7100_RespectisEarnedToteBagFront.png',
    'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/39dab5737_RespectisEarnedToteBagBack.png',
  ],
  '69fbd261b760426cede1b7a3': [
    'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/6822f58e3_4.jpg',
    'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/146ccc6c7_5.jpg',
    'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/3afc9d17f_3.jpg',
  ],
  '69eed3e64e2da78ae4418a99': [
    'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/dbb657925_IMG_17251.JPG',
    'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/4b7f96472_IMG_1725.JPG',
  ],
};

// Poster size → price map (for variant pricing display)
const POSTER_SIZE_PRICES = {
  'A4 — $19': 19,
  'A3 — $29': 29,
  'A2 — $39': 39,
  'A1 — $59': 59,
};

// Corrected static product data
const FALLBACK_PRODUCTS = [
  {
    id: '69f11d1fc43e13c61fe6b9d6',
    name: '"Thank You" CD Single Slim Case',
    sale_price: 10,
    category: 'cd',
    stock_quantity: 0,
    image_url: 'https://base44.app/api/apps/69eb7905ca6eb4180010f794/files/mp/public/69eb7905ca6eb4180010f794/6fbecc91f_THANKYOUOfficialSingleCover.bmp',
    description: 'Official debut single in a slim clear plastic jewel case.',
  },
  {
    id: '69eed3e64e2da78ae4418a9d',
    name: 'Thank You — Deluxe Signed CD Single',
    sale_price: 20,
    category: 'cd',
    stock_quantity: 0,
    image_url: 'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/c2a1369c4_1.png',
    description: 'Hand-signed by Gannon Waye. A limited, personal piece of this moment.',
  },
  {
    id: '69f11d1fc43e13c61fe6b9d7',
    name: '"Respect Is Earned" Hoodie Dark Grey',
    sale_price: 89,
    category: 'apparel',
    stock_quantity: 16,
    sizes_available: ['XS', 'S', 'M', 'L', 'XL', '2XL'],
    image_url: 'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/4454da55f_RespectisEarnedThankyouDarkGreyHoodieFront.png',
    description: 'Premium heavyweight dark grey hoodie. Statement piece.',
  },
  {
    id: '69eed3e64e2da78ae4418a99',
    name: 'Respect Is Earned Oversized Tee',
    sale_price: 49,
    category: 'apparel',
    stock_quantity: 0,
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
    sale_price: 59,
    category: 'bundle',
    stock_quantity: 20,
    image_url: 'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/6822f58e3_4.jpg',
    images_array: [
      'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/6822f58e3_4.jpg',
      'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/146ccc6c7_5.jpg',
      'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/3afc9d17f_3.jpg',
    ],
    description: 'Journaling, processing, or needing a safe-space kit — this is it.',
  },
  {
    id: '69eed3e64e2da78ae4418a9a',
    name: '"Thank You" Tote Bag',
    sale_price: 15,
    category: 'accessories',
    stock_quantity: 0,
    image_url: 'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/5d1b577f1_2.jpg',
    images_array: [
      'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/5d1b577f1_2.jpg',
      'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/d45dc7100_RespectisEarnedToteBagFront.png',
      'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/39dab5737_RespectisEarnedToteBagBack.png',
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
      toast({ title: "You're on the list! We'll let you know the moment orders open. 🤍" });
    } catch {
      toast({ title: 'Already registered — we have you! 🤍' });
      localStorage.setItem(key, '1');
      setDone(true);
    }
    setLoading(false);
  };

  if (done) {
    return (
      <div className="mt-3 w-full rounded-full py-2.5 font-body text-[10px] tracking-wider uppercase flex items-center justify-center gap-2 border border-primary/40 text-primary bg-primary/10">
        <Heart className="w-3.5 h-3.5 fill-primary" /> I love this — I'm on the list!
      </div>
    );
  }

  if (showForm) {
    return (
      <form onSubmit={submit} className="mt-3 space-y-2">
        <input
          type="email"
          placeholder="your@email.com"
          value={email}
          onChange={e => setEmail(e.target.value)}
          autoFocus
          className="w-full bg-secondary/50 border border-border/40 rounded-lg px-3 py-2 font-body text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/40"
        />
        <div className="flex gap-1.5">
          <button type="submit" disabled={loading} className="flex-1 py-2 rounded-full gradient-gold-button font-body text-[10px] tracking-wider uppercase">
            {loading ? '...' : '🤍 Notify me when open'}
          </button>
          <button type="button" onClick={() => setShowForm(false)} className="px-3 py-2 rounded-full border border-border/40 font-body text-[10px] text-muted-foreground">
            ✕
          </button>
        </div>
      </form>
    );
  }

  return (
    <div className="mt-3 space-y-1.5">
      <button
        onClick={() => setShowForm(true)}
        className="w-full rounded-full py-2.5 font-body text-[10px] tracking-wider uppercase transition-all flex items-center justify-center gap-2 gradient-gold-button hover:opacity-90"
      >
        <Sparkles className="w-3.5 h-3.5" /> I love this! Notify me
      </button>
      <p className="text-center font-body text-[9px] text-muted-foreground/50 tracking-wide">Orders open soon — be first to know</p>
    </div>
  );
}

function ProductCard({ product, onCheckout, onViewCart }) {
  const { toast } = useToast();
  const addItem = useCartStore(state => state.addItem);
  const [selectedSize, setSelectedSize] = useState('');
  const [showSizeError, setShowSizeError] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);

  const isPoster = product.category === 'poster';
  const hasPosterVariantPricing = isPoster && product.sizes_available?.some(s => POSTER_SIZE_PRICES[s]);
  const basePrice = hasPosterVariantPricing
    ? POSTER_SIZE_PRICES[selectedSize] ?? Math.min(...product.sizes_available.map(s => POSTER_SIZE_PRICES[s]).filter(Boolean))
    : (product.sale_price ?? product.price);
  const price = basePrice;
  const cfg = PRODUCT_CONFIG[product.id];
  const badge = PRODUCT_BADGES[product.id];
  const isCd = product.category === 'cd';
  const galleryImages = PRODUCT_GALLERIES[product.id] || (product.images_array?.length > 0 ? product.images_array : null);
  const allImages = galleryImages || (product.image_url ? [product.image_url] : []);
  const singleImage = product.image_url;
  const hasSize = product.sizes_available?.length > 0;
  
  const handleAddToCart = () => {
    if (hasSize && !selectedSize) {
      setShowSizeError(true);
      toast({ title: 'Please select a size', variant: 'destructive' });
      return;
    }
    
    addItem(product, 1, selectedSize || null);
    setSelectedSize('');
    setShowSizeError(false);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 4000);
    toast({ title: 'Added to cart! 🤍', description: product.name });
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        data-testid="product-card"
        className="group rounded-2xl border border-border/30 hover:border-primary/30 bg-card/40 overflow-hidden backdrop-blur-sm transition-all duration-300"
      >
        {/* Image — click to open detail modal */}
        <div className="relative cursor-pointer" onClick={() => setDetailOpen(true)}>
          {galleryImages ? (
            <ProductImageRotator
              images={galleryImages}
              alt={product.name}
              aspectClass={isCd ? 'aspect-[4/3]' : 'aspect-square'}
            />
          ) : singleImage ? (
            <div className={`${isCd ? 'aspect-[4/3]' : 'aspect-square'} bg-gradient-to-br from-secondary/20 to-secondary/60 overflow-hidden`}>
              <img data-testid="product-image" src={singleImage} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            </div>
          ) : (
            <div className={`${isCd ? 'aspect-[4/3]' : 'aspect-square'} bg-gradient-to-br from-secondary/20 to-secondary/60 flex items-center justify-center`}>
              <ShoppingBag className="w-16 h-16 text-muted-foreground/20" />
            </div>
          )}
          {/* Zoom hint */}
          <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-black/50 rounded-full p-1.5">
            <ZoomIn className="w-3.5 h-3.5 text-white" />
          </div>
          <div className="absolute top-3 left-3 z-10">
            {product.stock_quantity === 0 ? (
              <span className="font-body text-[9px] tracking-[0.15em] uppercase border rounded-full px-2 py-0.5 bg-red-500/15 text-red-400 border-red-500/30">
                Sold Out
              </span>
            ) : badge ? (
              <span className={`font-body text-[9px] tracking-[0.15em] uppercase border rounded-full px-2 py-0.5 ${badge.color}`}>
                {badge.label}
              </span>
            ) : (
              <span className="font-body text-[9px] tracking-[0.15em] uppercase border rounded-full px-2 py-0.5 bg-green-500/15 text-green-400 border-green-500/30">
                In Stock
              </span>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border/30 bg-card/20">
          <div className="flex items-start justify-between gap-2 mb-1">
            <p data-testid="product-title" className="font-display text-sm text-foreground leading-snug">{product.name}</p>
            <AdminEditButton href={`/admin/merch`} label="Edit" className="shrink-0" />
          </div>
          <p data-testid="product-price" className="font-body text-sm gradient-gold-glow font-medium">${price} AUD</p>
          {cfg?.sub && (
            <p className="font-body text-[10px] text-muted-foreground/60 mt-1 leading-relaxed">{cfg.sub}</p>
          )}

          {hasSize && (
            <div className="mt-3">
              <div className="flex flex-wrap gap-2 justify-center">
                {product.sizes_available.map(s => (
                  <button 
                    key={s} 
                    type="button" 
                    onClick={() => {
                      setSelectedSize(s);
                      setShowSizeError(false);
                    }}
                    className={`px-3 py-1 rounded-lg border font-body text-xs transition-all ${
                      selectedSize === s 
                        ? 'border-primary bg-primary/10 text-primary' 
                        : 'border-border/50 text-muted-foreground hover:border-primary/30'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
              {showSizeError && (
                <p className="text-xs text-destructive mt-1 text-center">Please select a size</p>
              )}
            </div>
          )}
          
          {STORE_OPEN && product.stock_quantity > 0 ? (
            addedToCart ? (
              <div data-testid="add-to-cart-success" className="mt-3 space-y-1.5">
                <p className="text-center font-body text-[10px] text-green-400 tracking-wider">✓ Added to cart</p>
                <div className="flex flex-col gap-1.5">
                  <button
                    data-testid="continue-shopping-button"
                    onClick={() => setAddedToCart(false)}
                    className="w-full rounded-full py-2 font-body text-[9px] tracking-wider uppercase border border-border/50 text-muted-foreground hover:border-primary/30 transition-all"
                  >
                    Continue Shopping
                  </button>
                  <button
                    data-testid="view-cart-button"
                    onClick={() => { setAddedToCart(false); onViewCart && onViewCart(); }}
                    className="w-full rounded-full py-2 font-body text-[9px] tracking-wider uppercase border border-primary/50 text-primary hover:bg-primary/10 transition-all"
                  >
                    View Cart
                  </button>
                  <button
                    data-testid="go-to-checkout-button"
                    onClick={() => onCheckout && onCheckout()}
                    className="w-full rounded-full py-2 font-body text-[9px] tracking-wider uppercase gradient-gold-button transition-all"
                  >
                    Checkout
                  </button>
                </div>
              </div>
            ) : (
              <button
                data-testid="add-to-cart-btn"
                onClick={handleAddToCart}
                className="mt-3 w-full rounded-full py-2.5 font-body text-[10px] tracking-wider uppercase transition-all flex items-center justify-center gap-2 gradient-gold-button hover:opacity-90"
              >
                <Plus className="w-3.5 h-3.5" /> Add to Cart
              </button>
            )
          ) : STORE_OPEN && product.stock_quantity === 0 ? (
            <div className="mt-3 w-full rounded-xl py-2.5 px-3 font-body text-[10px] tracking-wider uppercase text-center border border-red-500/30 text-red-400 bg-red-500/10 cursor-not-allowed">
              {product.id === '69eed3e64e2da78ae4418a9a' 
                ? "Sold out due to popular demand. These will not be restocked." 
                : "Sold Out · Due to Popular Demand"
              }
            </div>
          ) : (
            <InterestButton productId={product.id} productName={product.name} />
          )}
        </div>
      </motion.div>

      {detailOpen && (
        <ProductDetailModal
          product={product}
          allImages={allImages}
          onClose={() => setDetailOpen(false)}
        />
      )}
    </>
  );
}

export default function Store() {
  const navigate = useNavigate();
  const [cartOpen, setCartOpen] = useState(false);
  // Guard as array — corrupted localStorage can return undefined/object and crash with uu(...) is not a function
  const cartItems = useCartStore(state => Array.isArray(state.items) ? state.items : []);
  const getItemCount = cartItems.reduce((sum, item) => sum + (item.quantity || 0), 0);
  const hasItems = cartItems.length > 0;

  const { data: dbProducts } = useQuery({
    queryKey: ['storeProducts'],
    queryFn: () => base44.entities.MerchProduct.filter({ is_active: true }, '-created_date'),
    staleTime: 60_000,
  });
  // Always fall back to FALLBACK_PRODUCTS immediately — no blank state while DB loads
  const resolvedProducts = Array.isArray(dbProducts) && dbProducts.length > 0 ? dbProducts : FALLBACK_PRODUCTS;

  const products = resolvedProducts;

  // Sort: merch groups first, then music, sold-out last
  const GROUP_ORDER = { apparel: 0, accessories: 1, drinkware: 2, bundle: 3, poster: 4, vinyl: 5, cd: 6, other: 7 };
  const sortedProducts = [...products].sort((a, b) => {
    const aOut = a.stock_quantity === 0 ? 1 : 0;
    const bOut = b.stock_quantity === 0 ? 1 : 0;
    if (aOut !== bOut) return aOut - bOut;
    const aGroup = GROUP_ORDER[a.category] ?? 7;
    const bGroup = GROUP_ORDER[b.category] ?? 7;
    if (aGroup !== bGroup) return aGroup - bGroup;
    return (a.sale_price ?? 0) - (b.sale_price ?? 0);
  });

  const cdProducts = sortedProducts.filter(p => p.category === 'cd' || p.category === 'vinyl');
  const merchProducts = sortedProducts.filter(p => p.category !== 'cd' && p.category !== 'vinyl');

  return (
    <div data-testid="store-page" className="min-h-screen py-24 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        
        {/* Cart button handled globally by CartButton component in Navbar — no duplicate needed */}

        {/* Page header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-6"
        >
          <p className="font-body text-xs tracking-[0.3em] uppercase gradient-gold-glow mb-4">Official</p>
          <h1 className="font-display text-4xl md:text-6xl text-foreground mb-5">Merch</h1>
          <div className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/30 rounded-xl px-5 py-3 mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            <p className="font-body text-xs text-green-300">
              Store is <strong>open</strong> — order now. Shipping Australia-wide.
            </p>
          </div>
          {hasItems && (
          <div className="mt-4 inline-flex items-center gap-2 bg-primary/10 border border-primary/30 rounded-xl px-4 py-2">
          <ShoppingCart className="w-4 h-4 text-primary" />
          <span className="font-body text-xs text-primary">
            {getItemCount} item{getItemCount !== 1 ? 's' : ''} in cart · ready for checkout
          </span>
          </div>
          )}
        </motion.div>

        {/* Winter Bundle Hero — always featured at top of merch */}
        <WinterBundleHero onViewCart={() => setCartOpen(true)} />

        {/* CD Row */}
        {cdProducts.length > 0 && (
          <>
            <div className="flex items-center gap-4 mt-12 mb-6">
              <div className="flex-1 h-px bg-border/40" />
              <span className="font-body text-[10px] tracking-[0.3em] uppercase text-muted-foreground/50">Music</span>
              <div className="flex-1 h-px bg-border/40" />
            </div>
            <div className="flex justify-center">
              <div data-testid="product-grid" className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-2xl">
                {cdProducts.map(product => (
                   <ProductCard key={product.id} product={product} onCheckout={() => navigate('/store/cart-details')} onViewCart={() => setCartOpen(true)} />
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
              <span className="font-body text-[10px] tracking-[0.3em] uppercase text-muted-foreground/50">Merch</span>
              <div className="flex-1 h-px bg-border/40" />
            </div>
            <div data-testid="product-grid" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {merchProducts.map(product => (
                 <ProductCard key={product.id} product={product} onCheckout={() => navigate('/store/cart-details')} onViewCart={() => setCartOpen(true)} />
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

      {/* Sticky checkout bar — appears when cart has items */}
      {hasItems && (
        <div
          data-testid="store-sticky-checkout"
          className="fixed bottom-0 left-0 right-0 z-40 bg-card/95 backdrop-blur-md border-t border-primary/30 px-4 py-3 flex items-center justify-between gap-4 shadow-2xl"
        >
          <div className="flex items-center gap-3">
            <ShoppingCart className="w-5 h-5 text-primary shrink-0" />
            <div>
              <p className="font-body text-sm text-foreground font-semibold">
                {getItemCount} item{getItemCount !== 1 ? 's' : ''} in cart
              </p>
            </div>
          </div>
          <button
            data-testid="store-sticky-checkout-button"
            onClick={() => navigate('/store/cart-details')}
            className="gradient-gold-button rounded-full px-6 py-2 font-body text-sm tracking-wider uppercase shrink-0"
          >
            Checkout
          </button>
        </div>
      )}

      {/* Cart Drawer */}
      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />
    </div>
  );
}