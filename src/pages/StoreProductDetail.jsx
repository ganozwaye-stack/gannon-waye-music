import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { useCartStore } from '@/lib/cartStore';
import { useToast } from '@/components/ui/use-toast';
import { ShoppingCart, ArrowLeft, Heart, Package } from 'lucide-react';
import { STORE_PRODUCTS } from '@/config/storeWorldConfig';

// Slug → product ID lookup (all known slug variants)
const SLUG_MAP = {
  'winter-writing-comfort-bundle': 'winter-bundle',
  'thankyou-journal-pen-thermos-bundle': 'journal-bundle',
  'journal-pen-thermos-bundle': 'journal-bundle',
  'respect-is-earned-oversized-hoodie': 'hoodie',
  'thankyou-respect-is-earned-hoodie-front': 'hoodie',
  'respect-is-earned-coffee-mug': 'mug',
  'thankyou-respect-is-earned-coffee-mug': 'mug',
  'respect-is-earned-wall-poster': 'poster',
  'respect-is-earned-assorted-wall-poster-pricing-from-19': 'poster',
  '6a2d595ef7bb7ff53258cdfe': 'poster',
  'thankyou-respect-is-earned-wall-poster': 'poster',
  'thankyou-cd-collectable': 'cd',
  'thankyou-cd': 'cd',
  'tote-bag-waitlist': 'tote',
  'thankyou-tote-bag': 'tote',
  'memorial': 'mums-garden',
  'mums-garden': 'mums-garden',
};

const PRODUCT_DETAILS = {
  'winter-bundle': {
    description: 'The ultimate winter writing and comfort bundle. Includes the Thankyou Journal, premium pen, thermos flask, and the Respect Is Earned hoodie. Everything you need to write your story and stay warm this winter.',
    includes: ['Thankyou Journal', 'Premium pen', 'Thermos Flask', '"Respect Is Earned" Hoodie'],
    sizes: ['XS', 'S', 'M', 'L', 'XL', '2XL'],
    emoji: '❄️',
  },
  'journal-bundle': {
    description: 'Write your story. Stay warm. Stay grateful. The Thankyou trio — journal, pen and flask — for moments of reflection.',
    includes: ['Thankyou Journal', 'Premium pen', 'Thermos Flask'],
    sizes: [],
    emoji: '📓',
  },
  hoodie: {
    description: 'Premium heavyweight oversized dark grey hoodie. "Respect Is Earned, Not A Game You Make Me Play." — a statement piece for those who know their worth.',
    includes: ['Oversized heavyweight hoodie', 'Unisex fit', 'Lyric print'],
    sizes: ['XS', 'S', 'M', 'L', 'XL', '2XL'],
    emoji: '🖤',
  },
  mug: {
    description: 'Start every morning with intention. Ceramic coffee mug featuring the "Respect Is Earned" lyric. Microwave and dishwasher safe.',
    includes: ['Ceramic mug', 'Gift-ready packaging'],
    sizes: [],
    emoji: '☕',
  },
  poster: {
    description: 'Premium wall poster featuring the "Respect Is Earned" lyric artwork. Printed on 250gsm matte premium stock. Choose your size — price updates on selection.',
    includes: ['Premium 250gsm matte stock', 'Select size at checkout', 'Print-on-demand — ships within 5–7 business days'],
    sizes: ['A4 — $19', 'A3 — $29', 'A2 — $39', 'A1 — $59'],
    emoji: '🖼️',
    posterPricing: { 'A4 — $19': 19, 'A3 — $29': 29, 'A2 — $39': 39, 'A1 — $59': 59 },
    needsImages: true,
  },
  cd: {
    description: 'Limited edition physical CDs and music collectables. Signed by Gannon Waye. A personal piece of this moment in music history.',
    includes: ['Physical CD', 'Hand-signed by Gannon Waye', 'Collector\'s packaging'],
    sizes: [],
    emoji: '💿',
  },
  tote: {
    description: 'The official Thankyou tote bag sold out due to incredible demand. These will not be restocked. Thank you for the love. 🤍',
    includes: [],
    sizes: [],
    emoji: '👜',
    soldOutPermanent: true,
  },
  'mums-garden': {
    description: 'A private tribute. Enter with love.',
    includes: [],
    sizes: [],
    emoji: '🌸',
  },
};

export default function StoreProductDetail() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const addItem = useCartStore(s => s.addItem);

  // Get slug from URL — support slug lookup, ID lookup, and fallback
  const slug = window.location.pathname.split('/store/product/')[1] || '';
  const mappedId = SLUG_MAP[slug];
  // Try: slug map → direct ID match → match by link suffix
  const product = mappedId
    ? STORE_PRODUCTS.find(p => p.id === mappedId)
    : STORE_PRODUCTS.find(p => p.id === slug) ||
      STORE_PRODUCTS.find(p => p.link && p.link.endsWith('/' + slug));
  const productId = product?.id || '';
  const details = PRODUCT_DETAILS[productId];

  const [selectedSize, setSelectedSize] = useState('');
  const [qty, setQty] = useState(1);
  const [waitlistEmail, setWaitlistEmail] = useState('');
  const [waitlistDone, setWaitlistDone] = useState(false);

  // Poster: derive price from selected size
  const posterPricing = details?.posterPricing || null;
  const displayPrice = posterPricing && selectedSize
    ? `$${posterPricing[selectedSize]}`
    : product.price || 'POA';

  if (!product) {
    return (
      <div style={{ minHeight: '100vh', background: '#0a0a0a', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '16px', color: '#fff' }}>
        <p style={{ fontSize: '40px' }}>🛍️</p>
        <p style={{ color: '#888', fontSize: '14px' }}>Product not found.</p>
        <button onClick={() => navigate('/store')} style={{ padding: '10px 24px', borderRadius: '6px', background: '#C9A84C', color: '#111', border: 'none', cursor: 'pointer', fontSize: '12px', fontWeight: 700 }}>
          Back to Store
        </button>
      </div>
    );
  }

  const isSoldOut = product.status === 'sold_out';
  const isTribute = product.status === 'memorial';
  const hasSizes = details?.sizes?.length > 0;

  if (isTribute) {
    navigate('/mums-garden');
    return null;
  }

  const handleAddToCart = () => {
    if (hasSizes && !selectedSize) {
      toast({ title: 'Please select a size', variant: 'destructive' });
      return;
    }
    const cartProduct = {
      id: product.id,
      name: product.name,
      sale_price: parseFloat((product.price || '$0').replace(/[^0-9.]/g, '')) || 0,
      image_url: null,
      category: 'merch',
    };
    addItem(cartProduct, qty, selectedSize || null);
    toast({ title: 'Added to cart! 🤍', description: product.name });
    navigate('/store/cart-details');
  };

  const handleWaitlist = async (e) => {
    e.preventDefault();
    if (!waitlistEmail.trim()) return;
    try {
      await base44.entities.MerchInterest.create({ product_id: product.id, product_name: product.name, email: waitlistEmail, consent_merch: true });
    } catch {}
    setWaitlistDone(true);
    toast({ title: "You're on the waitlist! We'll notify you. 🤍" });
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', color: '#fff', fontFamily: "'Inter', sans-serif", paddingBottom: '80px' }}>
      {/* Back nav */}
      <div style={{ padding: '20px 24px 0', maxWidth: '900px', margin: '0 auto' }}>
        <button onClick={() => navigate('/store')} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'none', border: 'none', color: '#888', cursor: 'pointer', fontSize: '12px', letterSpacing: '0.05em' }}>
          <ArrowLeft style={{ width: '14px', height: '14px' }} /> Back to Store
        </button>
      </div>

      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '32px 24px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '48px' }}>
        {/* Product image / emoji */}
        <div style={{ background: 'rgba(201,168,76,0.04)', border: '1px solid rgba(201,168,76,0.15)', borderRadius: '16px', aspectRatio: '1', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '80px' }}>
          {details?.emoji || '🛍️'}
        </div>

        {/* Product info */}
        <div>
          {isSoldOut && (
            <span style={{ fontSize: '10px', fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', padding: '3px 8px', borderRadius: '4px', background: 'rgba(239,68,68,0.15)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.3)', marginBottom: '12px', display: 'inline-block' }}>
              Sold Out
            </span>
          )}
          {product.badge && !isSoldOut && (
            <span style={{ fontSize: '10px', fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', padding: '3px 8px', borderRadius: '4px', background: 'rgba(201,168,76,0.15)', color: '#C9A84C', border: '1px solid rgba(201,168,76,0.3)', marginBottom: '12px', display: 'inline-block' }}>
              {product.badge}
            </span>
          )}

          <h1 style={{ fontSize: '22px', fontWeight: 700, lineHeight: 1.3, marginBottom: '8px', marginTop: '10px' }}>{product.name}</h1>

          <p style={{ fontSize: '22px', color: '#C9A84C', fontWeight: 700, marginBottom: '16px' }}>
            {displayPrice}
            {product.priceNote && <span style={{ fontSize: '12px', color: '#888', marginLeft: '6px', fontWeight: 400 }}>{product.priceNote}</span>}
          </p>

          {/* Poster needs-images notice */}
          {details?.needsImages && (
            <div style={{ padding: '10px 14px', borderRadius: '8px', background: 'rgba(234,179,8,0.08)', border: '1px solid rgba(234,179,8,0.3)', marginBottom: '16px' }}>
              <p style={{ fontSize: '11px', color: '#facc15', margin: 0 }}>
                🖼️ Poster artwork images coming soon. Size pricing is live — order now and your print will be prepared once artwork is confirmed.
              </p>
            </div>
          )}

          {/* Permanent sold out notice */}
          {details?.soldOutPermanent && (
            <div style={{ padding: '10px 14px', borderRadius: '8px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)', marginBottom: '16px' }}>
              <p style={{ fontSize: '11px', color: '#f87171', margin: 0 }}>These will not be restocked. 🤍</p>
            </div>
          )}

          <p style={{ color: '#999', fontSize: '14px', lineHeight: 1.7, marginBottom: '20px' }}>
            {details?.description || product.tooltip}
          </p>

          {details?.includes?.length > 0 && (
            <div style={{ marginBottom: '20px' }}>
              <p style={{ fontSize: '10px', color: '#666', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '8px' }}>Includes</p>
              {details.includes.map((item, i) => (
                <p key={i} style={{ fontSize: '13px', color: '#bbb', marginBottom: '4px' }}>✓ {item}</p>
              ))}
            </div>
          )}

          {hasSizes && !isSoldOut && (
            <div style={{ marginBottom: '20px' }}>
              <p style={{ fontSize: '10px', color: '#666', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '8px' }}>Select Size</p>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {details.sizes.map(s => (
                  <button key={s} onClick={() => setSelectedSize(s)} style={{
                    padding: '7px 14px', borderRadius: '6px', fontSize: '12px', cursor: 'pointer', transition: 'all 0.15s',
                    background: selectedSize === s ? 'rgba(201,168,76,0.15)' : 'rgba(255,255,255,0.04)',
                    border: `1px solid ${selectedSize === s ? '#C9A84C' : 'rgba(255,255,255,0.1)'}`,
                    color: selectedSize === s ? '#C9A84C' : '#bbb',
                  }}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {!isSoldOut && (
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '20px' }}>
              <p style={{ fontSize: '11px', color: '#666', marginRight: '4px' }}>Qty:</p>
              <button onClick={() => setQty(Math.max(1, qty - 1))} style={{ width: '32px', height: '32px', borderRadius: '6px', background: '#1a1a1a', border: '1px solid #333', color: '#fff', cursor: 'pointer', fontSize: '16px' }}>−</button>
              <span style={{ minWidth: '28px', textAlign: 'center', fontSize: '14px' }}>{qty}</span>
              <button onClick={() => setQty(qty + 1)} style={{ width: '32px', height: '32px', borderRadius: '6px', background: '#1a1a1a', border: '1px solid #333', color: '#fff', cursor: 'pointer', fontSize: '16px' }}>+</button>
            </div>
          )}

          {/* CTA */}
          {isSoldOut ? (
            waitlistDone ? (
              <div style={{ padding: '14px', borderRadius: '8px', background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)', color: '#22c55e', fontSize: '13px', textAlign: 'center' }}>
                <Heart style={{ width: '16px', height: '16px', display: 'inline', marginRight: '6px' }} /> You're on the list!
              </div>
            ) : (
              <form onSubmit={handleWaitlist} style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <input
                  type="email"
                  placeholder="your@email.com"
                  value={waitlistEmail}
                  onChange={e => setWaitlistEmail(e.target.value)}
                  style={{ flex: 1, minWidth: '180px', padding: '12px 14px', borderRadius: '8px', background: '#1a1a1a', border: '1px solid #333', color: '#fff', fontSize: '13px', outline: 'none' }}
                />
                <button type="submit" style={{ padding: '12px 20px', borderRadius: '8px', background: 'linear-gradient(135deg, #B8860B, #C9A84C, #FFF8DC, #C9A84C, #B8860B)', color: '#111', border: 'none', cursor: 'pointer', fontSize: '12px', fontWeight: 700, letterSpacing: '0.08em' }}>
                  Join Waitlist
                </button>
              </form>
            )
          ) : (
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <button onClick={handleAddToCart} style={{ flex: 1, padding: '14px 20px', borderRadius: '8px', background: 'linear-gradient(135deg, #B8860B, #C9A84C, #FFF8DC, #C9A84C, #B8860B)', color: '#111', border: 'none', cursor: 'pointer', fontSize: '13px', fontWeight: 700, letterSpacing: '0.08em', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                <ShoppingCart style={{ width: '16px', height: '16px' }} /> Add to Cart
              </button>
              <button onClick={() => navigate('/store-world')} style={{ padding: '14px 18px', borderRadius: '8px', background: 'transparent', border: '1px solid rgba(201,168,76,0.3)', color: '#C9A84C', cursor: 'pointer', fontSize: '12px' }}>
                <Package style={{ width: '14px', height: '14px' }} />
              </button>
            </div>
          )}

          <p style={{ fontSize: '11px', color: '#555', marginTop: '16px' }}>
            Ships Australia-wide · Official Gannon Waye merchandise
          </p>
        </div>
      </div>
    </div>
  );
}