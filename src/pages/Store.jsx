import { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { ShoppingBag, Sparkles, ShoppingCart, Plus, ZoomIn, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import ProductImageRotator from '@/components/store/ProductImageRotator';
import { useCartStore } from '@/lib/cartStore';
import ProductDetailModal from '@/components/store/ProductDetailModal';
import CartDrawer from '@/components/store/CartDrawer';
import AdminEditButton from '@/components/store/AdminEditButton';
import NeonBrandTitle from '@/components/store/NeonBrandTitle';
import LockedStorefrontHero from '@/components/store/LockedStorefrontHero';

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
  '69f11d1fc43e13c61fe6b9d7': { sub: 'Owner-counted stock in S, M, L and XL. Delivery is calculated before payment.' },
  '69fbd261b760426cede1b7a3': { sub: 'Journal, pen and thermos flask set. Delivery is calculated before payment.' },
};

// Multi-image galleries per product id (auto-rotates in card)
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
  'A4: $19': 19,
  'A3: $29': 29,
  'A2: $39': 39,
  'A1: $59': 59,
};

// Corrected static product data
// Legacy hard coded catalogue removed. Public products must come from verified live records.

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
      {/* animate, NOT whileInView.
          whileInView starts the card at opacity 0 and only reveals it when an
          IntersectionObserver fires. If anything stops the page scrolling — as the
          root-level overflow rule did — the observer never fires and EVERY PRODUCT
          CARD STAYS INVISIBLE. A customer sees an empty shop. Verified against live:
          five store-load tests failed on `product-card` not being visible.
          A decorative fade is never worth risking the whole catalogue. Mount-time
          animation keeps the same look with no dependency on scroll. */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
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
                    {s}{Number.isFinite(product.stock_by_variant?.[s]) ? ` (${product.stock_by_variant[s]})` : ''}
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
    queryFn: () => base44.entities.MerchProduct.filter({ is_active: true, publication_status: 'live', is_stage_one_sale: true }, '-created_date'),
    staleTime: 60_000,
  });
  // Fail closed. Never replace missing data with invented products, stock or prices.
  const products = Array.isArray(dbProducts) ? dbProducts : [];

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
    <div data-testid="store-page" className={`min-h-screen pb-24 ${hasItems ? 'pb-36' : ''}`}>
      {/* Locked boutique hero — the fixed neon storefront render. System rule: never swapped or pasted over. */}
      <LockedStorefrontHero />
      <div className="max-w-6xl mx-auto px-4 md:px-8 pt-12">

        {/* Cart button handled globally by CartButton component in Navbar — no duplicate needed */}

        {/* Page header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-6"
        >
          <div className="mb-6">
            <NeonBrandTitle />
          </div>
          {products.length > 0 ? (
            <div className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/30 rounded-xl px-5 py-3 mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
              <p className="font-body text-xs text-green-300">
                Current owner-approved stock is available for delivery within Australia.
              </p>
            </div>
          ) : (
            <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/30 rounded-xl px-5 py-3 mb-3">
              <Sparkles className="w-4 h-4 text-primary" />
              <p className="font-body text-xs text-primary">
                New merchandise is being prepared. Nothing will be offered until price, stock and fulfilment are verified.
              </p>
            </div>
          )}
          <p className="font-body text-[11px] text-muted-foreground mt-2">
            Prices are in AUD. Delivery is shown before payment. Gannon Waye Music ABN 22 931 809 349. No GST is charged.
          </p>
          {hasItems && (
          <div className="mt-4 inline-flex items-center gap-2 bg-primary/10 border border-primary/30 rounded-xl px-4 py-2">
          <ShoppingCart className="w-4 h-4 text-primary" />
          <span className="font-body text-xs text-primary">
            {getItemCount} item{getItemCount !== 1 ? 's' : ''} in cart · ready for checkout
          </span>
          </div>
          )}
        </motion.div>

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


        <p className="text-center font-body text-xs text-muted-foreground/40 mt-10 tracking-wide">
          Independent music, merchandise, and community support.
        </p>
      </div>

      {/* Sticky checkout bar — appears when cart has items */}
      {hasItems && (
        <div
          data-testid="store-sticky-checkout"
          className="fixed bottom-0 left-0 right-0 z-40 bg-card/95 backdrop-blur-md border-t border-primary/30 px-4 pt-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] flex items-center justify-between gap-4 shadow-2xl"
        >
          <div className="flex items-center gap-3">
            <ShoppingCart className="w-5 h-5 text-primary shrink-0" />
            <div>
              <p className="font-body text-xs sm:text-sm text-foreground font-semibold">
                {getItemCount} item{getItemCount !== 1 ? 's' : ''} in cart
              </p>
            </div>
          </div>
          <button
            data-testid="store-sticky-checkout-button"
            onClick={() => navigate('/store/cart-details')}
            className="gradient-gold-button rounded-full px-5 sm:px-6 py-2 font-body text-xs sm:text-sm tracking-wider uppercase shrink-0"
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