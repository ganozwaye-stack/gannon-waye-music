import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '@/lib/cartStore';
import { useToast } from '@/components/ui/use-toast';
import { X, Plus, Minus, ShoppingCart, ChevronLeft, ChevronRight } from 'lucide-react';

const G = '#D4AF37';

// Upsell add-ons (shown only for purchasable products)
const ADDONS = [
  { id: 'mug-addon', name: 'Add a Gannon Waye Coffee Mug', price: 10, productId: '6a16abb0198d4c5d294edc11', description: '"Respect Is Earned" ceramic mug' },
  { id: 'poster-addon', name: 'Add a Wall Poster', price: 19, productId: 'poster-product', description: 'A4 wall poster — limited edition' },
];

// Bundle product IDs — excluded from promo codes
export const BUNDLE_IDS = ['winter-bundle', 'journal-bundle', '69fbd261b760426cede1b7a3'];

// Map config IDs to real MerchProduct data
const PRODUCT_DETAILS = {
  'winter-bundle': {
    realId: 'winter-bundle-fake', // config-only, no real entity ID yet
    name: 'Winter Writing & Comfort Bundle',
    price: 129,
    priceDisplay: '$129',
    priceNote: '+ postage · discount already applied',
    description: 'The ultimate winter writing companion — journal, pen, thermos flask, and the Respect Is Earned Hoodie. Everything you need for warmth, reflection, and expression.',
    images: [
      'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/6822f58e3_4.jpg',
      'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/146ccc6c7_5.jpg',
      'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/3afc9d17f_3.jpg',
    ],
    sizes: [],
    stock: 20,
    isBundle: true,
    entityId: '69fbd261b760426cede1b7a3',
  },
  'journal-bundle': {
    name: 'Thankyou Journal, Pen & Thermos Flask Bundle',
    price: 59,
    priceDisplay: '$59',
    priceNote: '+ postage',
    description: 'The Thankyou trio — a beautiful journal featuring "Respect Is Earned, Not A Game You Make Me Play", a gold pen, and a premium thermos flask.',
    images: [
      'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/6822f58e3_4.jpg',
      'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/3afc9d17f_3.jpg',
    ],
    sizes: [],
    stock: 20,
    isBundle: true,
    entityId: '69fbd261b760426cede1b7a3',
  },
  'hoodie': {
    name: 'Thankyou "Respect Is Earned" Oversized Hoodie — Dark Grey',
    price: 89,
    priceDisplay: '$89',
    priceNote: '+ postage',
    description: 'Premium heavyweight oversized dark grey hoodie. A statement piece for those who know. Comfort-first, identity-forward.',
    images: [
      'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/4454da55f_RespectisEarnedThankyouDarkGreyHoodieFront.png',
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL', '2XL'],
    stock: 16,
    isBundle: false,
    entityId: '69f11d1fc43e13c61fe6b9d7',
  },
  'mug': {
    name: 'Thankyou "Respect Is Earned" Coffee Mug',
    price: 9.90,
    priceDisplay: '$9.90',
    priceNote: '+ postage',
    description: 'A daily reminder in ceramic form. The Respect Is Earned mug — start every morning with purpose.',
    images: [
      'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/d1e8a7822_MugFront.png',
      'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/0261db66f_MugBack.png',
    ],
    sizes: [],
    stock: 50,
    isBundle: false,
    entityId: '6a16abb0198d4c5d294edc11',
  },
  'poster': {
    name: 'Thankyou "Respect Is Earned" Wall Poster',
    price: 19,
    priceDisplay: 'From $19',
    priceNote: 'A4 · A3 · A2 · A1',
    description: 'Limited edition wall poster. Hang it. Own it. Let it speak for you.',
    images: [
      'https://base44.app/api/apps/69eb7905ca6eb4180010f794/files/mp/public/69eb7905ca6eb4180010f794/6fbecc91f_THANKYOUOfficialSingleCover.bmp',
    ],
    sizes: ['A4 — $19', 'A3 — $29', 'A2 — $39', 'A1 — $59'],
    stock: 50,
    isBundle: false,
    entityId: 'poster-id',
    sizeVariantPrices: { 'A4 — $19': 19, 'A3 — $29': 29, 'A2 — $39': 39, 'A1 — $59': 59 },
  },
  'cd': {
    name: 'CD & Music Collectables',
    price: null,
    priceDisplay: 'Sold Out',
    priceNote: null,
    description: 'Signed CDs and limited music collectables. Thank you for the incredible love — sold out due to popular demand.',
    images: [
      'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/c2a1369c4_1.png',
      'https://base44.app/api/apps/69eb7905ca6eb4180010f794/files/mp/public/69eb7905ca6eb4180010f794/6fbecc91f_THANKYOUOfficialSingleCover.bmp',
    ],
    sizes: [],
    stock: 0,
    isBundle: false,
    entityId: null,
  },
  'tote': {
    name: '"Thankyou" Tote Bag',
    price: null,
    priceDisplay: 'Sold Out',
    priceNote: null,
    description: 'Large folding tote bag featuring the official Thankyou single cover artwork. Sold out — demand was incredible. 🤍',
    images: [
      'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/5d1b577f1_2.jpg',
      'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/d45dc7100_RespectisEarnedToteBagFront.png',
    ],
    sizes: [],
    stock: 0,
    isBundle: false,
    entityId: '69eed3e64e2da78ae4418a9a',
  },
};

export default function ProductQuickViewModal({ productId, onClose }) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const addItem = useCartStore(state => state.addItem);

  const details = PRODUCT_DETAILS[productId];
  const [imgIndex, setImgIndex] = useState(0);
  const [qty, setQty] = useState(1);
  const [selectedSize, setSelectedSize] = useState('');
  const [sizeError, setSizeError] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const [selectedAddons, setSelectedAddons] = useState([]);

  const isSoldOut = !details || details.stock === 0;
  const hasSizes = details?.sizes?.length > 0;
  const images = details?.images || [];
  const sizeVariantPrices = details?.sizeVariantPrices || null;

  const resolvedPrice = sizeVariantPrices && selectedSize
    ? sizeVariantPrices[selectedSize]
    : details?.price;

  // Close on Escape
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  // Prevent body scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  const handleAddToCart = useCallback(() => {
    if (hasSizes && !selectedSize) {
      setSizeError(true);
      return;
    }
    setSizeError(false);

    // Build a fake product object compatible with cartStore
    const cartProduct = {
      id: details.entityId || productId,
      name: details.name,
      sale_price: resolvedPrice || details.price,
      image_url: images[0] || '',
      category: details.isBundle ? 'bundle' : 'apparel',
      stock_quantity: details.stock,
      sizes_available: details.sizes,
      _isBundle: details.isBundle,
    };
    addItem(cartProduct, qty, selectedSize || null);

    // Add any selected add-ons
    selectedAddons.forEach(addonId => {
      const addon = ADDONS.find(a => a.id === addonId);
      if (!addon) return;
      addItem({
        id: addon.productId,
        name: addon.name,
        sale_price: addon.price,
        image_url: '',
        category: 'accessories',
        stock_quantity: 50,
      }, 1, null);
    });

    setAddedToCart(true);
    toast({ title: `Added to cart 🤍`, description: details.name });
  }, [details, resolvedPrice, qty, selectedSize, selectedAddons, hasSizes, addItem, toast, productId, images]);

  const toggleAddon = (id) => {
    setSelectedAddons(prev => prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]);
  };

  if (!details) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Quick view: ${details.name}`}
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0,
        background: 'rgba(0,0,0,0.82)',
        backdropFilter: 'blur(6px)',
        zIndex: 1000,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '16px',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: 'linear-gradient(160deg, #111009, #0d0b07)',
          border: '1px solid rgba(212,175,55,0.22)',
          borderRadius: '14px',
          width: '100%',
          maxWidth: '820px',
          maxHeight: '90vh',
          overflow: 'hidden',
          overflowY: 'auto',
          boxShadow: '0 40px 100px rgba(0,0,0,0.8), 0 0 60px rgba(212,175,55,0.07)',
          position: 'relative',
          fontFamily: "'Inter', sans-serif",
        }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          aria-label="Close"
          style={{
            position: 'sticky', top: '12px',
            float: 'right',
            zIndex: 20, marginRight: '12px', marginTop: '12px',
            background: 'rgba(30,25,15,0.9)', border: '1px solid rgba(212,175,55,0.25)',
            borderRadius: '50%', width: '34px', height: '34px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', color: '#D4AF37',
          }}
        >
          <X size={16} />
        </button>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 0, minHeight: '400px' }}>
          {/* ── IMAGE PANEL ── */}
          <div style={{
            flex: '1 1 340px',
            minHeight: '320px',
            background: 'linear-gradient(135deg, #1a1610, #0d0b07)',
            position: 'relative',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            overflow: 'hidden',
          }}>
            {images.length > 0 ? (
              <>
                <img
                  src={images[imgIndex]}
                  alt={details.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', minHeight: '320px' }}
                />
                {/* Image nav */}
                {images.length > 1 && (
                  <>
                    <button
                      onClick={() => setImgIndex(i => (i - 1 + images.length) % images.length)}
                      aria-label="Previous image"
                      style={{ position: 'absolute', left: '8px', top: '50%', transform: 'translateY(-50%)', background: 'rgba(0,0,0,0.7)', border: '1px solid rgba(212,175,55,0.3)', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#D4AF37' }}
                    >
                      <ChevronLeft size={16} />
                    </button>
                    <button
                      onClick={() => setImgIndex(i => (i + 1) % images.length)}
                      aria-label="Next image"
                      style={{ position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)', background: 'rgba(0,0,0,0.7)', border: '1px solid rgba(212,175,55,0.3)', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#D4AF37' }}
                    >
                      <ChevronRight size={16} />
                    </button>
                    {/* Thumbnail dots */}
                    <div style={{ position: 'absolute', bottom: '10px', left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: '6px' }}>
                      {images.map((_, i) => (
                        <button
                          key={i}
                          onClick={() => setImgIndex(i)}
                          aria-label={`Image ${i + 1}`}
                          style={{
                            width: i === imgIndex ? '20px' : '6px',
                            height: '6px',
                            borderRadius: '3px',
                            background: i === imgIndex ? G : 'rgba(212,175,55,0.35)',
                            border: 'none', cursor: 'pointer',
                            transition: 'all 0.2s',
                          }}
                        />
                      ))}
                    </div>
                  </>
                )}
                {isSoldOut && (
                  <div style={{
                    position: 'absolute', top: '12px', left: '12px',
                    background: 'rgba(120,0,0,0.9)', color: '#fff',
                    fontSize: '9px', fontWeight: 800, letterSpacing: '0.12em',
                    padding: '3px 10px', borderRadius: '4px', textTransform: 'uppercase',
                  }}>
                    Sold Out
                  </div>
                )}
                {details.isBundle && !isSoldOut && (
                  <div style={{
                    position: 'absolute', top: '12px', left: '12px',
                    background: 'rgba(212,175,55,0.9)', color: '#111',
                    fontSize: '9px', fontWeight: 800, letterSpacing: '0.12em',
                    padding: '3px 10px', borderRadius: '4px', textTransform: 'uppercase',
                  }}>
                    Bundle
                  </div>
                )}
              </>
            ) : (
              <div style={{ color: 'rgba(212,175,55,0.2)', fontSize: '40px' }}>🛍️</div>
            )}
          </div>

          {/* ── INFO PANEL ── */}
          <div style={{ flex: '1 1 320px', padding: '28px 28px 24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Name */}
            <div>
              <p style={{ color: 'rgba(212,175,55,0.5)', fontSize: '10px', letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '6px' }}>
                Gannon Waye Official
              </p>
              <h2 style={{ color: '#f0f0f0', fontSize: '18px', fontWeight: 700, lineHeight: 1.3, margin: 0 }}>
                {details.name}
              </h2>
            </div>

            {/* Price */}
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
              <span style={{ color: isSoldOut ? '#e05555' : G, fontSize: '22px', fontWeight: 800 }}>
                {isSoldOut ? 'Sold Out' : (sizeVariantPrices && selectedSize ? `$${sizeVariantPrices[selectedSize]}` : details.priceDisplay)}
              </span>
              {details.priceNote && !isSoldOut && (
                <span style={{ color: '#555', fontSize: '11px' }}>{details.priceNote}</span>
              )}
            </div>

            {/* Description */}
            <p style={{ color: '#888', fontSize: '13px', lineHeight: 1.7, margin: 0 }}>
              {details.description}
            </p>

            {/* Bundle note */}
            {details.isBundle && (
              <div style={{
                background: 'rgba(212,175,55,0.06)', border: '1px solid rgba(212,175,55,0.18)',
                borderRadius: '6px', padding: '8px 12px',
                color: 'rgba(212,175,55,0.7)', fontSize: '11px', lineHeight: 1.5,
              }}>
                ✦ Bundle discount already applied · Cannot be combined with promo codes
              </div>
            )}

            {/* Size selector */}
            {hasSizes && !isSoldOut && (
              <div>
                <p style={{ color: '#888', fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '8px' }}>
                  Select {sizeVariantPrices ? 'Size & Price' : 'Size'}
                  {sizeError && <span style={{ color: '#e05555', marginLeft: '8px' }}>← required</span>}
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {details.sizes.map(s => (
                    <button
                      key={s}
                      onClick={() => { setSelectedSize(s); setSizeError(false); }}
                      style={{
                        padding: '6px 12px',
                        borderRadius: '6px',
                        fontSize: '11px',
                        fontWeight: 600,
                        cursor: 'pointer',
                        transition: 'all 0.15s',
                        background: selectedSize === s ? 'rgba(212,175,55,0.15)' : 'transparent',
                        border: `1px solid ${selectedSize === s ? 'rgba(212,175,55,0.7)' : 'rgba(212,175,55,0.2)'}`,
                        color: selectedSize === s ? G : '#888',
                      }}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity (only if purchasable) */}
            {!isSoldOut && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <p style={{ color: '#888', fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase', margin: 0 }}>Qty</p>
                <div style={{ display: 'flex', alignItems: 'center', border: '1px solid rgba(212,175,55,0.25)', borderRadius: '6px', overflow: 'hidden' }}>
                  <button
                    onClick={() => setQty(q => Math.max(1, q - 1))}
                    aria-label="Decrease quantity"
                    style={{ padding: '6px 10px', background: 'transparent', border: 'none', cursor: 'pointer', color: G }}
                  >
                    <Minus size={12} />
                  </button>
                  <span style={{ padding: '6px 14px', color: '#f0f0f0', fontSize: '13px', fontWeight: 700, minWidth: '36px', textAlign: 'center' }}>
                    {qty}
                  </span>
                  <button
                    onClick={() => setQty(q => q + 1)}
                    aria-label="Increase quantity"
                    style={{ padding: '6px 10px', background: 'transparent', border: 'none', cursor: 'pointer', color: G }}
                  >
                    <Plus size={12} />
                  </button>
                </div>
              </div>
            )}

            {/* Add-ons upsell (only for purchasable, non-bundle products) */}
            {!isSoldOut && !details.isBundle && (
              <div>
                <p style={{ color: '#555', fontSize: '10px', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '8px' }}>
                  Add-ons
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {ADDONS.filter(a => a.productId !== details.entityId).map(addon => (
                    <label
                      key={addon.id}
                      style={{
                        display: 'flex', alignItems: 'center', gap: '10px',
                        padding: '8px 12px',
                        borderRadius: '7px',
                        border: `1px solid ${selectedAddons.includes(addon.id) ? 'rgba(212,175,55,0.45)' : 'rgba(212,175,55,0.12)'}`,
                        background: selectedAddons.includes(addon.id) ? 'rgba(212,175,55,0.06)' : 'transparent',
                        cursor: 'pointer', transition: 'all 0.15s',
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={selectedAddons.includes(addon.id)}
                        onChange={() => toggleAddon(addon.id)}
                        style={{ accentColor: G, width: '14px', height: '14px' }}
                      />
                      <div>
                        <div style={{ color: '#ccc', fontSize: '12px' }}>{addon.name}</div>
                        <div style={{ color: G, fontSize: '11px', fontWeight: 700 }}>${addon.price}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* CTA buttons */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: 'auto' }}>
              {!isSoldOut ? (
                <>
                  {addedToCart ? (
                    <div style={{ textAlign: 'center', color: '#6ee76e', fontSize: '12px', fontWeight: 600, padding: '4px 0' }}>
                      ✓ Added to cart
                    </div>
                  ) : (
                    <button
                      onClick={handleAddToCart}
                      style={{
                        padding: '13px 24px', borderRadius: '7px',
                        background: 'linear-gradient(135deg, #B8860B, #D4AF37, #FFF8DC, #D4AF37, #B8860B)',
                        color: '#111', fontWeight: 800, fontSize: '12px',
                        letterSpacing: '0.15em', textTransform: 'uppercase',
                        border: 'none', cursor: 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                        boxShadow: '0 4px 20px rgba(212,175,55,0.3)',
                      }}
                    >
                      <ShoppingCart size={14} /> Add to Cart
                    </button>
                  )}
                  {addedToCart && (
                    <button
                      onClick={() => navigate('/store/cart-details')}
                      style={{
                        padding: '12px 24px', borderRadius: '7px',
                        background: 'linear-gradient(135deg, #B8860B, #D4AF37, #FFF8DC, #D4AF37, #B8860B)',
                        color: '#111', fontWeight: 800, fontSize: '12px',
                        letterSpacing: '0.15em', textTransform: 'uppercase',
                        border: 'none', cursor: 'pointer',
                        boxShadow: '0 4px 20px rgba(212,175,55,0.3)',
                      }}
                    >
                      Checkout →
                    </button>
                  )}
                  <button
                    onClick={onClose}
                    style={{
                      padding: '11px 24px', borderRadius: '7px',
                      background: 'transparent',
                      color: '#888', fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase',
                      border: '1px solid rgba(212,175,55,0.18)', cursor: 'pointer',
                      transition: 'all 0.15s',
                    }}
                    onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(212,175,55,0.4)'}
                    onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(212,175,55,0.18)'}
                  >
                    Continue Shopping
                  </button>
                </>
              ) : (
                <>
                  {/* Sold out — waitlist */}
                  <WaitlistForm productId={productId} productName={details.name} />
                  <button
                    onClick={onClose}
                    style={{
                      padding: '11px 24px', borderRadius: '7px',
                      background: 'transparent',
                      color: '#888', fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase',
                      border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer',
                    }}
                  >
                    Continue Shopping
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Simple waitlist form for sold-out products
function WaitlistForm({ productId, productName }) {
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [done, setDone] = useState(() => !!localStorage.getItem(`wl_${productId}`));
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    try {
      const { base44: client } = await import('@/api/base44Client');
      await client.entities.MerchInterest.create({
        product_id: productId,
        product_name: productName,
        name: 'Waitlist',
        email,
        consent_merch: true,
      });
      localStorage.setItem(`wl_${productId}`, '1');
      setDone(true);
      toast({ title: "You're on the waitlist 🤍 We'll notify you." });
    } catch {
      localStorage.setItem(`wl_${productId}`, '1');
      setDone(true);
      toast({ title: "Already registered — we have you! 🤍" });
    }
    setLoading(false);
  };

  if (done) {
    return (
      <div style={{
        padding: '12px 16px', borderRadius: '7px',
        background: 'rgba(212,175,55,0.06)', border: '1px solid rgba(212,175,55,0.25)',
        color: 'rgba(212,175,55,0.8)', fontSize: '12px', textAlign: 'center',
      }}>
        ♡ You're on the waitlist — we'll let you know
      </div>
    );
  }

  return (
    <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <input
        type="email"
        placeholder="your@email.com — notify me when available"
        value={email}
        onChange={e => setEmail(e.target.value)}
        style={{
          padding: '10px 14px', borderRadius: '7px',
          background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(212,175,55,0.2)',
          color: '#f0f0f0', fontSize: '12px', outline: 'none',
        }}
      />
      <button
        type="submit"
        disabled={loading}
        style={{
          padding: '12px', borderRadius: '7px',
          background: 'linear-gradient(135deg, #B8860B, #D4AF37, #FFF8DC, #D4AF37, #B8860B)',
          color: '#111', fontWeight: 800, fontSize: '11px',
          letterSpacing: '0.15em', textTransform: 'uppercase',
          border: 'none', cursor: 'pointer',
        }}
      >
        {loading ? '...' : '♡ Notify Me When Available'}
      </button>
    </form>
  );
}