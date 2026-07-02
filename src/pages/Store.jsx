import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Heart, Plus, ShoppingBag, ShoppingCart, Sparkles, ZoomIn } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import ProductImageRotator from '@/components/store/ProductImageRotator';
import { useCartStore } from '@/lib/cartStore';
import CartDrawer from '@/components/store/CartDrawer';
import {
  POSTER_PRODUCT_FALLBACK,
  POSTER_PRODUCT_ID,
  getProductVariants,
  productWithVariantPrice,
  slugifyProductName,
} from '@/lib/storeProduct';

const STORE_OPEN = true;

const CD_SLIM_ID = '69f11d1fc43e13c61fe6b9d6';
const CD_SIGNED_ID = '69eed3e64e2da78ae4418a9d';
const HOODIE_ID = '69f11d1fc43e13c61fe6b9d7';
const TEE_ID = '69eed3e64e2da78ae4418a99';
const JOURNAL_BUNDLE_ID = '69fbd261b760426cede1b7a3';
const TOTE_ID = '69eed3e64e2da78ae4418a9a';
const MUG_ID = '6a16abb0198d4c5d294edc11';
const WINTER_BUNDLE_ID = 'winter-warmer-bundle-2026';
const POSTER_ID = POSTER_PRODUCT_ID;

const GROUP_ORDER = {
  apparel: 0,
  accessories: 1,
  drinkware: 2,
  bundle: 3,
  poster: 4,
  vinyl: 5,
  cd: 6,
  other: 7,
};

const PRODUCT_BADGES = {
  [CD_SLIM_ID]: { label: 'CD Single', color: 'bg-secondary text-muted-foreground border-border/40' },
  [CD_SIGNED_ID]: { label: 'Signed CD', color: 'bg-primary/20 text-primary border-primary/40' },
  [JOURNAL_BUNDLE_ID]: { label: 'Limited Bundle', color: 'bg-primary/20 text-primary border-primary/40' },
  [TOTE_ID]: { label: 'Limited Series', color: 'bg-primary/20 text-primary border-primary/40' },
  [WINTER_BUNDLE_ID]: { label: 'Winter Warmer', color: 'bg-primary/20 text-primary border-primary/40' },
  [POSTER_ID]: { label: 'Assorted Sizes', color: 'bg-secondary text-muted-foreground border-border/40' },
};

const PRODUCT_CONFIG = {
  [CD_SLIM_ID]: { sub: 'Sold out - official Thankyou CD single.' },
  [CD_SIGNED_ID]: { sub: 'Sold out - deluxe signed edition.' },
  [HOODIE_ID]: { sub: 'Taking pre-orders now - $89 plus postage.' },
  [TEE_ID]: { sub: 'Oversized premium tee - $59 plus postage.' },
  [JOURNAL_BUNDLE_ID]: { sub: 'Limited safe-space journaling bundle - $59 plus postage.' },
  [MUG_ID]: { sub: 'Coffee mug - $9.90 plus postage.' },
  [WINTER_BUNDLE_ID]: { sub: 'Hoodie plus journal, pen and thermos bundle - $129 plus postage.' },
  [TOTE_ID]: { sub: 'Sold out due to popular demand. These will not be restocked.' },
  [POSTER_ID]: { sub: 'Assorted wall poster sizes - pricing varies.' },
};

const PRODUCT_GALLERIES = {
  [MUG_ID]: [
    'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/d1e8a7822_MugFront.png',
    'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/0261db66f_MugBack.png',
  ],
  [TOTE_ID]: [
    'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/d45dc7100_RespectisEarnedToteBagFront.png',
    'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/39dab5737_RespectisEarnedToteBagBack.png',
    'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/9259d695b_RespectisEarnedToteBag-Copy.png',
    'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/6e67c609a_RespectisEarnedToteBag.png',
  ],
  [TEE_ID]: [
    'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/dbb657925_IMG_17251.JPG',
    'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/4b7f96472_IMG_1725.JPG',
  ],
};

const FALLBACK_PRODUCTS = [
  {
    id: CD_SLIM_ID,
    name: 'Thankyou CD Single',
    sale_price: 10,
    category: 'cd',
    stock_quantity: 0,
    price_note: 'Sold Out',
    image_url: 'https://base44.app/api/apps/69eb7905ca6eb4180010f794/files/mp/public/69eb7905ca6eb4180010f794/6fbecc91f_THANKYOUOfficialSingleCover.bmp',
    description: 'Official Thankyou CD single in a slim clear case.',
    is_active: true,
    promo_eligible: false,
    discount_excluded: true,
    exclude_from_discounts: true,
    discount_lock_reason: 'CDs are excluded from discounts.',
  },
  {
    id: CD_SIGNED_ID,
    name: 'Thankyou Deluxe Signed CD Single',
    sale_price: 20,
    category: 'cd',
    stock_quantity: 0,
    price_note: 'Sold Out',
    image_url: 'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/c2a1369c4_1.png',
    description: 'Hand-signed by Gannon Waye. A limited, personal piece of this moment.',
    is_active: true,
    promo_eligible: false,
    discount_excluded: true,
    exclude_from_discounts: true,
    discount_lock_reason: 'CDs are excluded from discounts.',
  },
  {
    id: HOODIE_ID,
    name: 'Thankyou "Respect Is Earned" Oversized Hoodie - Dark Grey',
    sale_price: 89,
    category: 'apparel',
    stock_quantity: 16,
    price_note: '$89 plus postage',
    sizes_available: ['XS', 'S', 'M', 'L', 'XL', '2XL'],
    image_url: 'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/4454da55f_RespectisEarnedThankyouDarkGreyHoodieFront.png',
    description: 'Premium dark grey oversized hoodie from the Thankyou collection.',
    is_active: true,
    promo_eligible: true,
  },
  {
    id: TEE_ID,
    name: 'Thankyou "Respect Is Earned" Oversized Tee',
    sale_price: 59,
    category: 'apparel',
    stock_quantity: 20,
    price_note: '$59 plus postage',
    sizes_available: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    image_url: 'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/dbb657925_IMG_17251.JPG',
    images_array: PRODUCT_GALLERIES[TEE_ID],
    description: 'Premium oversized tee from the Thankyou collection.',
    is_active: true,
    promo_eligible: true,
  },
  {
    id: MUG_ID,
    name: 'Thankyou "Respect Is Earned" Coffee Mug',
    sale_price: 9.9,
    category: 'drinkware',
    stock_quantity: 30,
    price_note: '$9.90 plus postage',
    image_url: PRODUCT_GALLERIES[MUG_ID][0],
    images_array: PRODUCT_GALLERIES[MUG_ID],
    description: 'Coffee mug with the Respect Is Earned Thankyou artwork.',
    is_active: true,
    promo_eligible: true,
  },
  {
    id: JOURNAL_BUNDLE_ID,
    name: 'Thankyou Journal, Pen and Thermos Flask Bundle',
    sale_price: 59,
    category: 'bundle',
    stock_quantity: 20,
    price_note: '$59 plus postage',
    image_url: 'https://base44.app/api/apps/69eb7905ca6eb4180010f794/files/mp/public/69eb7905ca6eb4180010f794/e14220834_Bundle.png',
    description: 'For journaling, processing and building a safe space. This kit brings the essentials together.',
    is_active: true,
    is_featured: true,
    bundle_includes: ['Journal', 'Pen', 'Thermos Flask'],
    promo_eligible: false,
    discount_excluded: true,
    exclude_from_discounts: true,
    discount_lock_reason: 'Limited bundles are excluded from promo discounts.',
  },
  {
    id: WINTER_BUNDLE_ID,
    name: 'Winter Warmer Bundle',
    sale_price: 129,
    category: 'bundle',
    stock_quantity: 12,
    price_note: '$129 plus postage',
    image_url: 'https://base44.app/api/apps/69eb7905ca6eb4180010f794/files/mp/public/69eb7905ca6eb4180010f794/e14220834_Bundle.png',
    description: 'Includes the hoodie plus the journal, pen and thermos flask bundle.',
    is_active: true,
    is_featured: true,
    bundle_includes: [
      'Thankyou "Respect Is Earned" Oversized Hoodie - Dark Grey',
      'Thankyou Journal, Pen and Thermos Flask Bundle',
    ],
    promo_eligible: false,
    discount_excluded: true,
    exclude_from_discounts: true,
    discount_lock_reason: 'Limited bundles are excluded from promo discounts.',
  },
  {
    id: TOTE_ID,
    name: 'Thankyou Tote Bag',
    sale_price: 15,
    category: 'accessories',
    stock_quantity: 0,
    price_note: 'Sold Out',
    image_url: PRODUCT_GALLERIES[TOTE_ID][0],
    images_array: PRODUCT_GALLERIES[TOTE_ID],
    description: 'Limited series tote bag featuring the official Thankyou artwork.',
    is_active: true,
    promo_eligible: true,
  },
  {
    ...POSTER_PRODUCT_FALLBACK,
    price_note: 'A4, A3, A2 and A1 — from $19',
  },
];

function formatPrice(product) {
  if (product.price_note) return product.price_note;
  const price = Number(product.sale_price ?? product.price ?? 0);
  if (!price) return 'Price coming soon';
  return `$${price.toLocaleString('en-AU', {
    minimumFractionDigits: price % 1 ? 2 : 0,
    maximumFractionDigits: 2,
  })} plus postage`;
}

function sortProducts(products) {
  return [...products].sort((a, b) => {
    const aOut = a.stock_quantity === 0 ? 1 : 0;
    const bOut = b.stock_quantity === 0 ? 1 : 0;
    if (aOut !== bOut) return aOut - bOut;

    const aFeatured = a.is_featured ? 0 : 1;
    const bFeatured = b.is_featured ? 0 : 1;
    if (aFeatured !== bFeatured) return aFeatured - bFeatured;

    const aGroup = GROUP_ORDER[(a.category || 'other').toLowerCase()] ?? GROUP_ORDER.other;
    const bGroup = GROUP_ORDER[(b.category || 'other').toLowerCase()] ?? GROUP_ORDER.other;
    if (aGroup !== bGroup) return aGroup - bGroup;

    return Number(a.sale_price ?? a.price ?? 0) - Number(b.sale_price ?? b.price ?? 0);
  });
}

function BadgeForProduct({ product }) {
  const badge = PRODUCT_BADGES[product.id];

  if (product.stock_quantity === 0) {
    return (
      <span className="font-body text-[9px] tracking-[0.15em] uppercase border rounded-full px-2 py-0.5 bg-red-500/15 text-red-400 border-red-500/30">
        Sold Out
      </span>
    );
  }

  if (product.is_featured) {
    return (
      <span className="font-body text-[9px] tracking-[0.15em] uppercase border rounded-full px-2 py-0.5 bg-primary/20 text-primary border-primary/40">
        Featured
      </span>
    );
  }

  if (badge) {
    return (
      <span className={`font-body text-[9px] tracking-[0.15em] uppercase border rounded-full px-2 py-0.5 ${badge.color}`}>
        {badge.label}
      </span>
    );
  }

  return null;
}

function InterestButton({ productId, productName }) {
  const { toast } = useToast();
  const key = `interest_${productId}`;
  const [done, setDone] = useState(() => Boolean(localStorage.getItem(key)));
  const [showForm, setShowForm] = useState(false);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    if (!email.trim()) return;
    setLoading(true);

    try {
      await base44.entities.MerchInterest.create({
        product_id: productId,
        product_name: productName,
        name: 'Interest',
        email,
        phone: '',
        consent_merch: true,
      });
      toast({ title: "You're on the list. We'll let you know when this opens." });
    } catch {
      toast({ title: 'Already registered - we have you.' });
    } finally {
      localStorage.setItem(key, '1');
      setDone(true);
      setLoading(false);
    }
  };

  if (done) {
    return (
      <div className="mt-3 w-full rounded-full py-2.5 font-body text-[10px] tracking-wider uppercase flex items-center justify-center gap-2 border border-primary/40 text-primary bg-primary/10">
        <Heart className="w-3.5 h-3.5 fill-primary" /> Interest saved
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
          onChange={(event) => setEmail(event.target.value)}
          autoFocus
          className="w-full bg-secondary/50 border border-border/40 rounded-lg px-3 py-2 font-body text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/40"
        />
        <div className="flex gap-1.5">
          <button type="submit" disabled={loading} className="flex-1 py-2 rounded-full gradient-gold-button font-body text-[10px] tracking-wider uppercase">
            {loading ? 'Saving...' : 'Notify me'}
          </button>
          <button type="button" onClick={() => setShowForm(false)} className="px-3 py-2 rounded-full border border-border/40 font-body text-[10px] text-muted-foreground">
            Cancel
          </button>
        </div>
      </form>
    );
  }

  return (
    <button
      onClick={() => setShowForm(true)}
      className="mt-3 w-full rounded-full py-2.5 font-body text-[10px] tracking-wider uppercase transition-all flex items-center justify-center gap-2 border border-primary/40 text-primary hover:bg-primary/10"
    >
      <Sparkles className="w-3.5 h-3.5" /> Notify me
    </button>
  );
}

function ProductCard({ product, onCheckout, onViewCart }) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const addItem = useCartStore((state) => state.addItem);
  const [selectedSize, setSelectedSize] = useState('');
  const [showSizeError, setShowSizeError] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);

  const cfg = PRODUCT_CONFIG[product.id];
  const isMusic = product.category === 'cd' || product.category === 'vinyl';
  const galleryImages = PRODUCT_GALLERIES[product.id] || (product.images_array?.length > 0 ? product.images_array : null);
  const variants = getProductVariants(product);
  const hasSize = variants.length > 0;
  const canBuy = STORE_OPEN && product.stock_quantity !== 0 && Number(product.sale_price ?? product.price ?? 0) > 0;
  const productRoute = `/store/product/${slugifyProductName(product.name)}`;

  const handleAddToCart = () => {
    if (hasSize && !selectedSize) {
      setShowSizeError(true);
      toast({ title: 'Please select a size', variant: 'destructive' });
      return;
    }

    const selectedVariant = variants.find((variant) => variant.value === selectedSize);
    addItem(
      productWithVariantPrice(product, selectedVariant),
      1,
      selectedVariant?.label || selectedSize || null
    );
    setSelectedSize('');
    setShowSizeError(false);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 4000);
    toast({ title: 'Added to cart', description: product.name });
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
        <div className="relative cursor-pointer" onClick={() => navigate(productRoute)}>
          {galleryImages ? (
            <ProductImageRotator
              images={galleryImages}
              alt={product.name}
              aspectClass={isMusic ? 'aspect-[4/3]' : 'aspect-square'}
            />
          ) : product.image_url ? (
            <div className={`${isMusic ? 'aspect-[4/3]' : 'aspect-square'} bg-gradient-to-br from-secondary/20 to-secondary/60 overflow-hidden`}>
              <img data-testid="product-image" src={product.image_url} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            </div>
          ) : (
            <div className={`${isMusic ? 'aspect-[4/3]' : 'aspect-square'} bg-gradient-to-br from-secondary/20 to-secondary/60 flex items-center justify-center`}>
              <ShoppingBag className="w-16 h-16 text-muted-foreground/20" />
            </div>
          )}

          <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-black/50 rounded-full p-1.5">
            <ZoomIn className="w-3.5 h-3.5 text-white" />
          </div>

          <div className="absolute top-3 left-3 z-10">
            <BadgeForProduct product={product} />
          </div>
        </div>

        <div className="p-4 border-t border-border/30 bg-card/20">
          <button
            data-testid="product-title"
            onClick={() => navigate(productRoute)}
            className="font-display text-sm text-foreground leading-snug text-left hover:text-primary transition-colors"
          >
            {product.name}
          </button>
          <p data-testid="product-price" className="font-body text-sm gradient-gold-glow mt-1 font-medium">{formatPrice(product)}</p>
          <p className="font-body text-xs text-muted-foreground/75 mt-2 leading-relaxed">{product.description}</p>

          {cfg?.sub && (
            <p className="font-body text-[10px] text-muted-foreground/60 mt-2 leading-relaxed">{cfg.sub}</p>
          )}

          {product.bundle_includes?.length > 0 && (
            <div className="mt-3 rounded-xl border border-border/30 bg-secondary/20 p-3">
              <p className="font-body text-[10px] tracking-widest uppercase text-muted-foreground mb-1">Includes</p>
              <ul className="space-y-1">
                {product.bundle_includes.map((item) => (
                  <li key={item} className="font-body text-xs text-foreground/80">- {item}</li>
                ))}
              </ul>
            </div>
          )}

          {product.exclude_from_discounts && (
            <p className="font-body text-[10px] text-muted-foreground/60 mt-2">{product.discount_lock_reason || 'Excluded from promo discounts.'}</p>
          )}

          {hasSize && canBuy && (
            <div className="mt-3">
              <div className="flex flex-wrap gap-2 justify-center">
                {variants.map((variant) => (
                  <button
                    key={variant.value}
                    type="button"
                    onClick={() => {
                      setSelectedSize(variant.value);
                      setShowSizeError(false);
                    }}
                    className={`px-3 py-1 rounded-lg border font-body text-xs transition-all ${
                      selectedSize === variant.value
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-border/50 text-muted-foreground hover:border-primary/30'
                    }`}
                  >
                    {variant.label}
                    {product.category === 'poster' && variant.price ? ` — $${variant.price}` : ''}
                  </button>
                ))}
              </div>
              {showSizeError && <p className="text-xs text-destructive mt-1 text-center">Please select a size</p>}
            </div>
          )}

          {canBuy ? (
            addedToCart ? (
              <div data-testid="add-to-cart-success" className="mt-3 space-y-1.5">
                <p className="text-center font-body text-[10px] text-green-400 tracking-wider">Added to cart</p>
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
                    onClick={() => {
                      setAddedToCart(false);
                      onViewCart?.();
                    }}
                    className="w-full rounded-full py-2 font-body text-[9px] tracking-wider uppercase border border-primary/50 text-primary hover:bg-primary/10 transition-all"
                  >
                    View Cart
                  </button>
                  <button
                    data-testid="go-to-checkout-button"
                    onClick={onCheckout}
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
          ) : product.stock_quantity === 0 ? (
            <div className="mt-3 w-full rounded-xl py-2.5 px-3 font-body text-[10px] tracking-wider uppercase text-center border border-red-500/30 text-red-400 bg-red-500/10 cursor-not-allowed">
              Sold Out
            </div>
          ) : (
            <InterestButton productId={product.id} productName={product.name} />
          )}
        </div>
      </motion.div>

    </>
  );
}

export default function Store() {
  const navigate = useNavigate();
  const [cartOpen, setCartOpen] = useState(false);
  const cartItems = useCartStore((state) => (Array.isArray(state.items) ? state.items : []));
  const itemCount = cartItems.reduce((sum, item) => sum + (item.quantity || 0), 0);
  const hasItems = cartItems.length > 0;

  const { data: dbProducts } = useQuery({
    queryKey: ['storeProducts'],
    queryFn: () => base44.entities.MerchProduct.filter({ is_active: true }, '-created_date'),
    staleTime: 60_000,
  });

  const products = Array.isArray(dbProducts) && dbProducts.length > 0 ? dbProducts : FALLBACK_PRODUCTS;
  const sortedProducts = sortProducts(products);
  const cdProducts = sortedProducts.filter((product) => product.category === 'cd' || product.category === 'vinyl');
  const merchProducts = sortedProducts.filter((product) => product.category !== 'cd' && product.category !== 'vinyl');

  return (
    <div data-testid="store-page" className="min-h-screen py-24 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-6"
        >
          <p className="font-body text-xs tracking-[0.3em] uppercase gradient-gold-glow mb-4">Official Thankyou Collection</p>
          <h1 className="font-display text-4xl md:text-6xl text-foreground mb-5">Merch</h1>
          <div className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/30 rounded-xl px-5 py-3 mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            <p className="font-body text-xs text-green-300">
              Store is open - order now. Shipping Australia-wide.
            </p>
          </div>
          {hasItems && (
            <div className="mt-4 inline-flex items-center gap-2 bg-primary/10 border border-primary/30 rounded-xl px-4 py-2">
              <ShoppingCart className="w-4 h-4 text-primary" />
              <span className="font-body text-xs text-primary">
                {itemCount} item{itemCount !== 1 ? 's' : ''} in cart - ready for checkout
              </span>
            </div>
          )}
        </motion.div>

        {cdProducts.length > 0 && (
          <>
            <div className="flex items-center gap-4 mt-12 mb-6">
              <div className="flex-1 h-px bg-border/40" />
              <span className="font-body text-[10px] tracking-[0.3em] uppercase text-muted-foreground/50">CD Options</span>
              <div className="flex-1 h-px bg-border/40" />
            </div>
            <div className="flex justify-center">
              <div data-testid="product-grid" className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-3xl">
                {cdProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onCheckout={() => navigate('/store/cart-details')}
                    onViewCart={() => setCartOpen(true)}
                  />
                ))}
              </div>
            </div>
          </>
        )}

        {merchProducts.length > 0 && (
          <>
            <div className="flex items-center gap-4 mt-14 mb-6">
              <div className="flex-1 h-px bg-border/40" />
              <span className="font-body text-[10px] tracking-[0.3em] uppercase text-muted-foreground/50">Merch</span>
              <div className="flex-1 h-px bg-border/40" />
            </div>
            <div data-testid="product-grid" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {merchProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onCheckout={() => navigate('/store/cart-details')}
                  onViewCart={() => setCartOpen(true)}
                />
              ))}
            </div>
          </>
        )}

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
          Thankyou is available now on all major platforms.
        </p>
      </div>

      {hasItems && (
        <div
          data-testid="store-sticky-checkout"
          className="fixed bottom-0 left-0 right-0 z-40 bg-card/95 backdrop-blur-md border-t border-primary/30 px-4 py-3 flex items-center justify-between gap-4 shadow-2xl"
        >
          <div className="flex items-center gap-3">
            <ShoppingCart className="w-5 h-5 text-primary shrink-0" />
            <div>
              <p className="font-body text-sm text-foreground font-semibold">
                {itemCount} item{itemCount !== 1 ? 's' : ''} in cart
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

      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />
    </div>
  );
}
