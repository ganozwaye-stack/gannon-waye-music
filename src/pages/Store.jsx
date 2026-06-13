import React, { useState, useRef } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Heart, Sparkles, ShoppingCart, Plus, ZoomIn, Star, Package, Award } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import ProductImageRotator from '@/components/store/ProductImageRotator';
import { useCartStore } from '@/lib/cartStore';
import ProductDetailModal from '@/components/store/ProductDetailModal';
import CartDrawer from '@/components/store/CartDrawer';

// ─── Garden backgrounds (same aesthetic as memorial page) ─────────────────────
const GARDEN_BG   = 'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/b7806166d_generated_image.png';
const GARDEN_MID  = 'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/6591fa60b_generated_image.png';
const GARDEN_DARK = 'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/63f84cf4f_generated_image.png';

// ─── Master product catalogue ─────────────────────────────────────────────────
// All items branded: Thankyou "Respect is Earned" [Product]
const PRODUCTS = [
  {
    id: 'hoodie',
    name: 'Thankyou "Respect is Earned" Oversized Hoodie',
    sub: 'Dark Grey — Premium Heavyweight',
    price: 89,
    category: 'apparel',
    stock: 16,
    sizes: ['XS', 'S', 'M', 'L', 'XL', '2XL'],
    badge: { label: 'In Stock', color: 'text-green-400 border-green-500/30 bg-green-500/10' },
    description: 'This is not just a hoodie. It\'s a statement. Premium heavyweight dark grey fleece — the words "Respect is Earned, Not a Game You Make Me Play" printed across the front. Oversized silhouette. Garment-washed. Built to be worn and felt.',
    images: ['https://media.base44.com/images/public/69eb7905ca6eb4180010f794/4454da55f_RespectisEarnedThankyouDarkGreyHoodieFront.png'],
    dbId: '69f11d1fc43e13c61fe6b9d7',
    featured: true,
    excludeDiscount: false,
  },
  {
    id: 'bundle-winter',
    name: 'Thankyou "Respect is Earned" Winter Writing & Comfort Bundle',
    sub: 'Hoodie + Journal + Pen + Thermos — Limited',
    price: 109,
    category: 'bundle',
    stock: 15,
    badge: { label: 'Bundle Deal', color: 'text-primary border-primary/40 bg-primary/10' },
    description: 'Everything you need for a slow morning, a deep thought, or a hard feeling. The Respect is Earned hoodie, premium journal, quality pen, and insulated thermos flask — all branded with the Thankyou campaign. This bundle is priced as marked. No promo codes apply.',
    images: [
      'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/6822f58e3_4.jpg',
      'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/146ccc6c7_5.jpg',
      'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/3afc9d17f_3.jpg',
      'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/4454da55f_RespectisEarnedThankyouDarkGreyHoodieFront.png',
    ],
    dbId: null,
    featured: true,
    excludeDiscount: true,
    sizes: ['XS', 'S', 'M', 'L', 'XL', '2XL'],
  },
  {
    id: 'journal-bundle',
    name: 'Thankyou "Respect is Earned" Journal, Pen & Thermos Set',
    sub: 'Without Hoodie — Writing Essentials',
    price: 59,
    category: 'bundle',
    stock: 20,
    badge: { label: 'New', color: 'text-cyan-400 border-cyan-500/30 bg-cyan-500/10' },
    description: 'The Respect is Earned journal features the lyric "Respect is Earned, Not a Game You Make Me Play" on the cover. Premium A5 ruled pages, elastic closure. Paired with a quality pen and insulated Thankyou branded thermos flask. Write your truth. Carry it with you.',
    images: [
      'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/6822f58e3_4.jpg',
      'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/146ccc6c7_5.jpg',
      'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/3afc9d17f_3.jpg',
    ],
    dbId: '69fbd261b760426cede1b7a3',
    featured: false,
    excludeDiscount: true,
  },
  {
    id: 'tee',
    name: 'Thankyou "Respect is Earned" Oversized Tee',
    sub: 'Premium Print — Unisex Fit',
    price: 49,
    category: 'apparel',
    stock: 0,
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    badge: { label: 'Sold Out', color: 'text-red-400 border-red-500/30 bg-red-500/10' },
    description: 'The original statement tee. Official Thankyou single artwork on a premium oversized unisex tee. Sold out due to popular demand — join the waitlist to be first when they return.',
    images: [
      'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/dbb657925_IMG_17251.JPG',
      'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/4b7f96472_IMG_1725.JPG',
    ],
    dbId: '69eed3e64e2da78ae4418a99',
    featured: false,
    excludeDiscount: false,
  },
  {
    id: 'tote',
    name: 'Thankyou "Respect is Earned" Tote Bag',
    sub: 'Large Carry · Official Artwork',
    price: 15,
    category: 'accessories',
    stock: 0,
    badge: { label: 'Sold Out', color: 'text-red-400 border-red-500/30 bg-red-500/10' },
    description: 'Large folding tote bag. Official Thankyou single cover artwork front and back. These sold out due to popular demand — they will not be restocked.',
    images: [
      'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/5d1b577f1_2.jpg',
      'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/d45dc7100_RespectisEarnedToteBagFront.png',
    ],
    dbId: '69eed3e64e2da78ae4418a9a',
    featured: false,
    excludeDiscount: false,
    finalSale: true,
  },
  {
    id: 'cd-slim',
    name: 'Thankyou — Official CD Single',
    sub: 'Slim Case Edition',
    price: 10,
    category: 'cd',
    stock: 0,
    badge: { label: 'Sold Out', color: 'text-red-400 border-red-500/30 bg-red-500/10' },
    description: 'The debut single in a slim clear jewel case. A physical piece of this moment.',
    images: ['https://base44.app/api/apps/69eb7905ca6eb4180010f794/files/mp/public/69eb7905ca6eb4180010f794/6fbecc91f_THANKYOUOfficialSingleCover.bmp'],
    dbId: '69f11d1fc43e13c61fe6b9d6',
    featured: false,
    excludeDiscount: false,
  },
  {
    id: 'cd-deluxe',
    name: 'Thankyou — Hand-Signed Deluxe CD Single',
    sub: 'Limited · Personally Signed by Gannon Waye',
    price: 20,
    category: 'cd',
    stock: 0,
    badge: { label: 'Deluxe · Signed', color: 'text-primary border-primary/40 bg-primary/10' },
    description: 'Hand-signed by Gannon Waye. A limited, personal piece of this moment. Once these are gone — they\'re gone forever.',
    images: ['https://media.base44.com/images/public/69eb7905ca6eb4180010f794/c2a1369c4_1.png'],
    dbId: '69eed3e64e2da78ae4418a9d',
    featured: false,
    excludeDiscount: false,
  },
];

// ─── Interest form ─────────────────────────────────────────────────────────────
function InterestButton({ product }) {
  const { toast } = useToast();
  const key = `interest_${product.id}`;
  const [done, setDone] = useState(() => !!localStorage.getItem(key));
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    try {
      await base44.entities.MerchInterest.create({ product_id: product.id, product_name: product.name, name: 'Interest', email, phone: '', consent_merch: true });
      localStorage.setItem(key, '1');
      setDone(true);
      toast({ title: "You're on the list! We'll let you know when it's back. 🤍" });
    } catch {
      localStorage.setItem(key, '1');
      setDone(true);
      toast({ title: 'Already registered — we have you! 🤍' });
    }
    setLoading(false);
  };

  if (done) return (
    <div className="mt-3 w-full rounded-full py-2.5 font-body text-[10px] tracking-wider uppercase flex items-center justify-center gap-2 border border-primary/40 text-primary bg-primary/10">
      <Heart className="w-3.5 h-3.5 fill-primary" /> On the waitlist
    </div>
  );

  if (show) return (
    <form onSubmit={submit} className="mt-3 space-y-2">
      <input type="email" placeholder="your@email.com" value={email} onChange={e => setEmail(e.target.value)} autoFocus
        className="w-full bg-secondary/50 border border-border/40 rounded-lg px-3 py-2 font-body text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/40" />
      <div className="flex gap-1.5">
        <button type="submit" disabled={loading} className="flex-1 py-2 rounded-full gradient-gold-button font-body text-[10px] tracking-wider uppercase">
          {loading ? '...' : '🤍 Notify me'}
        </button>
        <button type="button" onClick={() => setShow(false)} className="px-3 py-2 rounded-full border border-border/40 font-body text-[10px] text-muted-foreground">✕</button>
      </div>
    </form>
  );

  return (
    <button onClick={() => setShow(true)} className="mt-3 w-full rounded-full py-2.5 font-body text-[10px] tracking-wider uppercase transition-all flex items-center justify-center gap-2 gradient-gold-button hover:opacity-90">
      <Sparkles className="w-3.5 h-3.5" /> Notify me when back
    </button>
  );
}

// ─── Product card — illuminated, elevated ─────────────────────────────────────
function ProductCard({ product, onCheckout, onViewCart, featured = false }) {
  const { toast } = useToast();
  const addItem = useCartStore(state => state.addItem);
  const [selectedSize, setSelectedSize] = useState('');
  const [sizeError, setSizeError] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const cardRef = useRef(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setMousePos({ x: (e.clientX - rect.left) / rect.width, y: (e.clientY - rect.top) / rect.height });
  };

  const handleAddToCart = () => {
    if (product.sizes?.length > 0 && !selectedSize) {
      setSizeError(true);
      toast({ title: 'Please select a size', variant: 'destructive' });
      return;
    }
    const cartProduct = {
      id: product.dbId || product.id,
      name: product.name,
      sale_price: product.price,
      image_url: product.images?.[0],
      sizes_available: product.sizes,
    };
    addItem(cartProduct, 1, selectedSize || null);
    setSelectedSize('');
    setSizeError(false);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 4000);
    toast({ title: 'Added to cart! 🤍', description: product.name });
  };

  const allImages = product.images || [];
  const isCd = product.category === 'cd';

  return (
    <>
      <motion.div
        ref={cardRef}
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        data-testid="product-card"
        className={`group relative rounded-2xl overflow-hidden transition-all duration-500 ${featured ? 'border-2' : 'border'}`}
        style={{
          borderColor: isHovered ? 'rgba(212,175,55,0.50)' : featured ? 'rgba(212,175,55,0.22)' : 'rgba(255,255,255,0.07)',
          background: 'rgba(5,8,5,0.80)',
          backdropFilter: 'blur(12px)',
          boxShadow: isHovered
            ? '0 20px 60px rgba(0,0,0,0.7), 0 0 40px rgba(212,175,55,0.15)'
            : featured ? '0 8px 40px rgba(0,0,0,0.5), 0 0 20px rgba(212,175,55,0.08)' : '0 4px 20px rgba(0,0,0,0.4)',
          transform: isHovered ? `perspective(800px) rotateX(${(mousePos.y - 0.5) * -4}deg) rotateY(${(mousePos.x - 0.5) * 4}deg) translateY(-4px)` : 'perspective(800px) rotateX(0) rotateY(0)',
        }}
      >
        {/* Spotlight follow effect */}
        {isHovered && (
          <div className="absolute inset-0 pointer-events-none z-0 rounded-2xl overflow-hidden">
            <div style={{
              position: 'absolute',
              width: 200, height: 200,
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(212,175,55,0.12) 0%, transparent 70%)',
              left: `${mousePos.x * 100}%`,
              top: `${mousePos.y * 100}%`,
              transform: 'translate(-50%,-50%)',
              pointerEvents: 'none',
            }} />
          </div>
        )}

        {/* Featured crown */}
        {featured && (
          <div className="absolute top-0 left-0 right-0 h-0.5 z-10"
            style={{ background: 'linear-gradient(90deg, transparent, rgba(212,175,55,0.7), transparent)' }} />
        )}

        {/* Image */}
        <div className="relative cursor-pointer z-10" onClick={() => setDetailOpen(true)}>
          {allImages.length > 1 ? (
            <ProductImageRotator images={allImages} alt={product.name} aspectClass={isCd ? 'aspect-[4/3]' : featured ? 'aspect-[3/4]' : 'aspect-square'} />
          ) : allImages.length === 1 ? (
            <div className={`${isCd ? 'aspect-[4/3]' : featured ? 'aspect-[3/4]' : 'aspect-square'} overflow-hidden`}
              style={{ background: 'radial-gradient(ellipse at 50% 30%, rgba(212,175,55,0.06) 0%, rgba(5,8,5,0.9) 100%)' }}>
              <img data-testid="product-image" src={allImages[0]} alt={product.name}
                className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-700"
                style={{ padding: '8%', filter: 'drop-shadow(0 8px 24px rgba(0,0,0,0.6))' }} />
            </div>
          ) : (
            <div className={`${isCd ? 'aspect-[4/3]' : 'aspect-square'} flex items-center justify-center`}
              style={{ background: 'rgba(5,8,5,0.9)' }}>
              <ShoppingBag className="w-16 h-16" style={{ color: 'rgba(212,175,55,0.15)' }} />
            </div>
          )}

          {/* Zoom */}
          <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity rounded-full p-1.5"
            style={{ background: 'rgba(0,0,0,0.6)' }}>
            <ZoomIn className="w-3.5 h-3.5 text-white" />
          </div>

          {/* Badge */}
          <div className="absolute top-3 left-3 z-20">
            <span className={`font-body text-[9px] tracking-[0.15em] uppercase border rounded-full px-2 py-0.5 ${product.badge.color}`}>
              {product.badge.label}
            </span>
          </div>

          {/* Exclude discount badge */}
          {product.excludeDiscount && (
            <div className="absolute top-3 right-3 z-20">
              <span className="font-body text-[8px] tracking-[0.1em] uppercase border rounded-full px-2 py-0.5 border-yellow-500/30 bg-yellow-500/10 text-yellow-400">
                Price as marked
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="relative z-10 p-4" style={{ borderTop: '1px solid rgba(212,175,55,0.08)' }}>
          <p className="font-body text-[9px] tracking-[0.2em] uppercase mb-1" style={{ color: 'rgba(212,175,55,0.40)' }}>
            {product.sub}
          </p>
          <p data-testid="product-title" className="font-display text-sm text-foreground leading-snug mb-1">{product.name}</p>
          <p data-testid="product-price" className="font-display text-lg gradient-gold-glow font-medium">${product.price} <span className="font-body text-xs text-muted-foreground">AUD</span></p>

          {product.excludeDiscount && (
            <p className="font-body text-[9px] text-yellow-400/60 mt-0.5">No promo codes · discount as marked</p>
          )}

          {product.finalSale && (
            <p className="font-body text-[9px] text-red-400/60 mt-0.5">Final sale · will not restock</p>
          )}

          <p className="font-body text-xs leading-relaxed mt-2 line-clamp-2" style={{ color: 'rgba(245,235,200,0.35)' }}>
            {product.description}
          </p>

          {/* Sizes */}
          {product.sizes && product.stock > 0 && (
            <div className="mt-3">
              <div className="flex flex-wrap gap-1.5">
                {product.sizes.map(s => (
                  <button key={s} type="button" onClick={() => { setSelectedSize(s); setSizeError(false); }}
                    className={`px-2.5 py-1 rounded-lg border font-body text-[10px] transition-all ${selectedSize === s ? 'border-primary bg-primary/10 text-primary' : 'border-border/40 text-muted-foreground hover:border-primary/30'}`}>
                    {s}
                  </button>
                ))}
              </div>
              {sizeError && <p className="text-xs text-destructive mt-1">Please select a size</p>}
            </div>
          )}

          {/* CTA */}
          {product.stock > 0 ? (
            addedToCart ? (
              <div className="mt-3 space-y-1.5">
                <p className="text-center font-body text-[10px] text-green-400 tracking-wider">✓ Added to cart</p>
                <div className="flex flex-col gap-1.5">
                  <button onClick={() => setAddedToCart(false)}
                    className="w-full rounded-full py-2 font-body text-[9px] tracking-wider uppercase border border-border/40 text-muted-foreground hover:border-primary/30">
                    Continue Shopping
                  </button>
                  <button onClick={() => { setAddedToCart(false); onViewCart?.(); }}
                    className="w-full rounded-full py-2 font-body text-[9px] tracking-wider uppercase border border-primary/40 text-primary hover:bg-primary/10">
                    View Cart
                  </button>
                  <button onClick={() => onCheckout?.()}
                    className="w-full rounded-full py-2 font-body text-[9px] tracking-wider uppercase gradient-gold-button">
                    Checkout
                  </button>
                </div>
              </div>
            ) : (
              <button data-testid="add-to-cart-btn" onClick={handleAddToCart}
                className="mt-3 w-full rounded-full py-2.5 font-body text-[10px] tracking-wider uppercase transition-all flex items-center justify-center gap-2 gradient-gold-button hover:opacity-90">
                <Plus className="w-3.5 h-3.5" /> Add to Cart
              </button>
            )
          ) : product.finalSale ? (
            <div className="mt-3 w-full rounded-xl py-2.5 font-body text-[10px] text-center border border-red-500/30 text-red-400 bg-red-500/10">
              Sold out · Final run
            </div>
          ) : (
            <InterestButton product={product} />
          )}
        </div>
      </motion.div>

      {detailOpen && (
        <ProductDetailModal
          product={{ id: product.dbId || product.id, name: product.name, sale_price: product.price, image_url: product.images?.[0], description: product.description, sizes_available: product.sizes }}
          allImages={allImages}
          onClose={() => setDetailOpen(false)}
        />
      )}
    </>
  );
}

// ─── Floating gold particles for the store atmosphere ─────────────────────────
function StoreParticles() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {[...Array(20)].map((_, i) => (
        <motion.div key={i} className="absolute rounded-full"
          style={{
            width: 1.5 + (i % 3),
            height: 1.5 + (i % 3),
            background: `rgba(212,175,55,${0.08 + (i % 4) * 0.04})`,
            left: `${(i * 5.1) % 98}%`,
            top: `${(i * 7.3) % 95}%`,
          }}
          animate={{ y: [0, -40 - i * 3, 0], opacity: [0, 0.5, 0] }}
          transition={{ duration: 8 + i * 0.6, repeat: Infinity, delay: i * 0.5, ease: 'easeInOut' }}
        />
      ))}
    </div>
  );
}

// ─── Main Store page ──────────────────────────────────────────────────────────
export default function Store() {
  const navigate = useNavigate();
  const [cartOpen, setCartOpen] = useState(false);
  const cartItems = useCartStore(state => Array.isArray(state.items) ? state.items : []);
  const getItemCount = cartItems.reduce((sum, item) => sum + (item.quantity || 0), 0);
  const hasItems = cartItems.length > 0;
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 400], [0, 60]);

  const featured = PRODUCTS.filter(p => p.featured);
  const apparel = PRODUCTS.filter(p => p.category === 'apparel' && !p.featured);
  const bundles = PRODUCTS.filter(p => p.category === 'bundle' && !p.featured);
  const accessories = PRODUCTS.filter(p => p.category === 'accessories' || p.category === 'cd');

  return (
    <div data-testid="store-page" className="relative min-h-screen overflow-x-hidden" style={{ background: '#020802' }}>
      <StoreParticles />

      {/* ── Hero background (garden world) */}
      <motion.div className="fixed inset-0 z-0 pointer-events-none" style={{ y: heroY }}>
        <img src={GARDEN_BG} alt="" className="w-full h-full object-cover"
          style={{ filter: 'brightness(0.20) saturate(0.85)' }} />
        <div className="absolute inset-0" style={{
          background: 'radial-gradient(ellipse 80% 60% at 50% 40%, rgba(212,175,55,0.06) 0%, transparent 70%)',
        }} />
        <div className="absolute inset-0" style={{
          background: `
            linear-gradient(to right, rgba(2,5,2,0.95) 0%, transparent 30%),
            linear-gradient(to left, rgba(2,5,2,0.95) 0%, transparent 30%),
            linear-gradient(to bottom, rgba(2,5,2,0.90) 0%, transparent 25%),
            linear-gradient(to top, rgba(2,5,2,0.90) 0%, rgba(2,5,2,0.30) 40%, transparent 70%)
          `,
        }} />
      </motion.div>

      {/* ── Page content */}
      <div className="relative z-10 pt-24 pb-32 px-4 md:px-8">
        <div className="max-w-6xl mx-auto">

          {/* Header */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-4">
            <p className="font-body text-[9px] tracking-[0.55em] uppercase mb-3" style={{ color: 'rgba(212,175,55,0.40)' }}>
              Official Store · Gannon Waye
            </p>
            <h1 className="font-display text-5xl md:text-7xl text-foreground mb-2">Merch</h1>
            <p className="font-body text-sm max-w-sm mx-auto mb-4" style={{ color: 'rgba(245,235,200,0.40)' }}>
              Every item is part of the Thankyou campaign. Wear the words. Carry the story.
            </p>
            <div className="inline-flex items-center gap-2 rounded-xl px-4 py-2 mb-3"
              style={{ background: 'rgba(74,222,128,0.06)', border: '1px solid rgba(74,222,128,0.20)' }}>
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              <p className="font-body text-xs text-green-300">Store open · Australia-wide shipping</p>
            </div>
            {hasItems && (
              <div className="mt-3 inline-flex items-center gap-2 rounded-xl px-4 py-2"
                style={{ background: 'rgba(212,175,55,0.06)', border: '1px solid rgba(212,175,55,0.20)' }}>
                <ShoppingCart className="w-4 h-4 text-primary" />
                <span className="font-body text-xs text-primary">{getItemCount} item{getItemCount !== 1 ? 's' : ''} in cart · ready for checkout</span>
              </div>
            )}
          </motion.div>

          {/* ── Featured: Hoodie + Winter Bundle */}
          <div className="mt-14">
            <div className="flex items-center gap-4 mb-8">
              <div className="flex-1 h-px" style={{ background: 'linear-gradient(to right, transparent, rgba(212,175,55,0.2))' }} />
              <div className="flex items-center gap-2">
                <Star className="w-3 h-3" style={{ color: 'rgba(212,175,55,0.5)' }} />
                <span className="font-body text-[10px] tracking-[0.3em] uppercase" style={{ color: 'rgba(212,175,55,0.45)' }}>Featured</span>
                <Star className="w-3 h-3" style={{ color: 'rgba(212,175,55,0.5)' }} />
              </div>
              <div className="flex-1 h-px" style={{ background: 'linear-gradient(to left, transparent, rgba(212,175,55,0.2))' }} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {featured.map(p => (
                <ProductCard key={p.id} product={p} featured onCheckout={() => navigate('/store/cart-details')} onViewCart={() => setCartOpen(true)} />
              ))}
            </div>
          </div>

          {/* ── Apparel */}
          {apparel.length > 0 && (
            <div className="mt-16">
              <div className="flex items-center gap-4 mb-6">
                <div className="flex-1 h-px bg-border/30" />
                <span className="font-body text-[10px] tracking-[0.3em] uppercase text-muted-foreground/50">Apparel</span>
                <div className="flex-1 h-px bg-border/30" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {apparel.map(p => <ProductCard key={p.id} product={p} onCheckout={() => navigate('/store/cart-details')} onViewCart={() => setCartOpen(true)} />)}
              </div>
            </div>
          )}

          {/* ── Bundles (non-featured) */}
          {bundles.length > 0 && (
            <div className="mt-16">
              <div className="flex items-center gap-4 mb-6">
                <div className="flex-1 h-px bg-border/30" />
                <span className="font-body text-[10px] tracking-[0.3em] uppercase text-muted-foreground/50">Bundles</span>
                <div className="flex-1 h-px bg-border/30" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {bundles.map(p => <ProductCard key={p.id} product={p} onCheckout={() => navigate('/store/cart-details')} onViewCart={() => setCartOpen(true)} />)}
              </div>
            </div>
          )}

          {/* ── Accessories + Music */}
          {accessories.length > 0 && (
            <div className="mt-16">
              <div className="flex items-center gap-4 mb-6">
                <div className="flex-1 h-px bg-border/30" />
                <span className="font-body text-[10px] tracking-[0.3em] uppercase text-muted-foreground/50">Accessories & Music</span>
                <div className="flex-1 h-px bg-border/30" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {accessories.map(p => <ProductCard key={p.id} product={p} onCheckout={() => navigate('/store/cart-details')} onViewCart={() => setCartOpen(true)} />)}
              </div>
            </div>
          )}

          {/* ── Poster CTA */}
          <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="mt-16 p-6 rounded-2xl text-center"
            style={{ border: '1px solid rgba(212,175,55,0.15)', background: 'rgba(212,175,55,0.03)' }}>
            <Award className="w-6 h-6 mx-auto mb-3" style={{ color: 'rgba(212,175,55,0.4)' }} />
            <p className="font-display text-xl text-foreground mb-1">Thankyou "Respect is Earned" Wall Poster</p>
            <p className="font-body text-xs mb-3" style={{ color: 'rgba(245,235,200,0.45)' }}>
              Assorted sizes · Pricing varies · Print-on-demand · Shipped directly to you
            </p>
            <button onClick={() => navigate('/store/poster')}
              className="rounded-full font-body text-xs tracking-wider uppercase px-6 py-2.5 transition-all"
              style={{ border: '1px solid rgba(212,175,55,0.35)', color: 'rgba(212,175,55,0.70)' }}>
              View Poster Options & Pricing →
            </button>
          </motion.div>

          {/* ── Support CTA */}
          <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="mt-8 rounded-2xl p-5 text-center"
            style={{ border: '1px solid rgba(212,175,55,0.12)', background: 'rgba(212,175,55,0.02)' }}>
            <p className="font-body text-sm mb-1" style={{ color: 'rgba(245,235,200,0.50)' }}>Not your style? You can still support this.</p>
            <button onClick={() => navigate('/back-this')}
              className="mt-3 gradient-gold-button rounded-full px-8 py-2.5 font-body text-sm tracking-wider uppercase inline-flex items-center gap-2">
              <Heart className="w-4 h-4" /> Support Now
            </button>
          </motion.div>

          <p className="text-center font-body text-xs mt-10 tracking-wide" style={{ color: 'rgba(212,175,55,0.20)' }}>
            Thank You — Official Release 05 June 2026 · Gannon Waye
          </p>
        </div>
      </div>

      {/* Sticky checkout */}
      {hasItems && (
        <div data-testid="store-sticky-checkout"
          className="fixed bottom-0 left-0 right-0 z-40 backdrop-blur-md border-t px-4 py-3 flex items-center justify-between gap-4 shadow-2xl"
          style={{ background: 'rgba(5,8,5,0.95)', borderColor: 'rgba(212,175,55,0.25)' }}>
          <div className="flex items-center gap-3">
            <ShoppingCart className="w-5 h-5 text-primary shrink-0" />
            <p className="font-body text-sm text-foreground font-semibold">{getItemCount} item{getItemCount !== 1 ? 's' : ''} in cart</p>
          </div>
          <button data-testid="store-sticky-checkout-button" onClick={() => navigate('/store/cart-details')}
            className="gradient-gold-button rounded-full px-6 py-2 font-body text-sm tracking-wider uppercase shrink-0">
            Checkout
          </button>
        </div>
      )}

      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />
    </div>
  );
}