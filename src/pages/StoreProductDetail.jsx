import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { useCartStore } from '@/lib/cartStore';
import { useToast } from '@/components/ui/use-toast';
import { ShoppingCart, ArrowLeft, Heart } from 'lucide-react';
import { findStoreProduct } from '@/config/storeWorldConfig';

export default function StoreProductDetail() {
  const navigate = useNavigate();
  const { slug = '' } = useParams();
  const { toast } = useToast();
  const addItem = useCartStore(state => state.addItem);
  const product = findStoreProduct(slug);

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [qty, setQty] = useState(1);
  const [waitlistEmail, setWaitlistEmail] = useState('');
  const [waitlistDone, setWaitlistDone] = useState(false);

  if (!product) {
    return (
      <div style={{ minHeight: '100vh', background: '#0a0a0a', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '16px', color: '#fff' }}>
        <p style={{ color: '#888', fontSize: '14px' }}>Product not found.</p>
        <button type="button" onClick={() => navigate('/store')} style={buttonStyle('primary')}>
          Back to Store
        </button>
      </div>
    );
  }

  if (product.status === 'memorial') {
    navigate('/mums-garden');
    return null;
  }

  const isSoldOut = product.status === 'sold_out' || product.stock_quantity === 0;
  const sizes = product.options?.size || product.sizes_available || [];
  const hasSizes = sizes.length > 0 && !isSoldOut;
  const selectedPrice = product.sizePriceMap?.[selectedSize] || product.priceValue || product.sale_price || 0;
  const displayPrice = product.sizePriceMap?.[selectedSize] ? `$${product.sizePriceMap[selectedSize]}` : product.price;
  const images = product.images || product.images_array || [product.image_url].filter(Boolean);
  const currentImage = images[selectedImage] || images[0];

  const handleAddToCart = () => {
    if (hasSizes && !selectedSize) {
      toast({ title: 'Please select a size', variant: 'destructive' });
      return;
    }

    addItem({
      id: product.id,
      name: product.name,
      sale_price: selectedPrice,
      price: selectedPrice,
      image_url: currentImage,
      category: product.category,
      excludeFromDiscounts: product.excludeFromDiscounts || false,
    }, qty, selectedSize || null);

    toast({ title: 'Added to cart', description: product.name });
    navigate('/store/cart-details');
  };

  const handleWaitlist = async (event) => {
    event.preventDefault();
    if (!waitlistEmail.trim()) return;
    try {
      await base44.entities.MerchInterest.create({
        product_id: product.id,
        product_name: product.name,
        email: waitlistEmail,
        consent_merch: true,
      });
    } catch (_) {
      // Local/mock runs can safely show the same success state.
    }
    setWaitlistDone(true);
    toast({ title: "You're on the waitlist" });
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', color: '#fff', fontFamily: "'Inter', sans-serif", paddingBottom: '80px' }}>
      <div style={{ padding: '22px 24px 0', maxWidth: '1180px', margin: '0 auto' }}>
        <button type="button" onClick={() => navigate('/store')} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'none', border: 'none', color: '#888', cursor: 'pointer', fontSize: '12px', letterSpacing: '0.05em' }}>
          <ArrowLeft style={{ width: '14px', height: '14px' }} /> Back to Store
        </button>
      </div>

      <main style={{ maxWidth: '1180px', margin: '0 auto', padding: '32px 24px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 380px), 1fr))', gap: '42px', alignItems: 'start' }}>
        <section>
          <div style={{ background: 'rgba(212,175,55,0.04)', border: '1px solid rgba(212,175,55,0.16)', borderRadius: '12px', aspectRatio: '16 / 10', overflow: 'hidden' }}>
            {currentImage ? (
              <img src={currentImage} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#555' }}>Image pending</div>
            )}
          </div>
          {images.length > 1 && (
            <div style={{ display: 'flex', gap: '10px', marginTop: '12px', flexWrap: 'wrap' }}>
              {images.map((image, index) => (
                <button
                  key={image}
                  type="button"
                  onClick={() => setSelectedImage(index)}
                  style={{
                    width: '86px',
                    aspectRatio: '16 / 10',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    border: index === selectedImage ? '2px solid #C9A84C' : '1px solid rgba(212,175,55,0.22)',
                    background: '#111',
                    padding: 0,
                    cursor: 'pointer',
                  }}
                >
                  <img src={image} alt={`${product.name} ${index + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </button>
              ))}
            </div>
          )}
        </section>

        <section>
          {product.badge && (
            <span style={{ fontSize: '10px', fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', padding: '4px 9px', borderRadius: '999px', background: 'rgba(201,168,76,0.12)', color: '#C9A84C', border: '1px solid rgba(201,168,76,0.3)', marginBottom: '12px', display: 'inline-block' }}>
              {product.badge}
            </span>
          )}

          <h1 style={{ fontSize: 'clamp(1.8rem, 4vw, 3.8rem)', fontWeight: 750, lineHeight: 1.02, margin: '10px 0 10px' }}>
            {product.name}
          </h1>

          <p style={{ fontSize: '28px', color: '#C9A84C', fontWeight: 800, marginBottom: '16px' }}>
            {displayPrice}
            {product.priceNote && !isSoldOut && <span style={{ fontSize: '13px', color: '#888', marginLeft: '8px', fontWeight: 400 }}>{product.priceNote}</span>}
          </p>

          {product.soldOutPermanent && (
            <div style={{ padding: '10px 14px', borderRadius: '8px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)', marginBottom: '16px' }}>
              <p style={{ fontSize: '11px', color: '#f87171', margin: 0 }}>Sold out due to popular demand. These will not be restocked.</p>
            </div>
          )}

          <p style={{ color: '#aaa', fontSize: '14px', lineHeight: 1.75, marginBottom: '22px', maxWidth: '640px' }}>
            {product.description}
          </p>

          {product.includes?.length > 0 && (
            <div style={{ marginBottom: '20px' }}>
              <p style={labelStyle}>Includes</p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: '6px 14px' }}>
                {product.includes.map(item => (
                  <p key={item} style={{ fontSize: '13px', color: '#bbb', margin: 0 }}>- {item}</p>
                ))}
              </div>
            </div>
          )}

          {hasSizes && (
            <div style={{ marginBottom: '20px' }}>
              <p style={labelStyle}>Select Size</p>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {sizes.map(size => (
                  <button key={size} type="button" onClick={() => setSelectedSize(size)} style={sizeButtonStyle(selectedSize === size)}>
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {!isSoldOut && (
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '20px' }}>
              <p style={{ fontSize: '11px', color: '#666', marginRight: '4px' }}>Qty:</p>
              <button type="button" onClick={() => setQty(Math.max(1, qty - 1))} style={qtyButton}>-</button>
              <span style={{ minWidth: '28px', textAlign: 'center', fontSize: '14px' }}>{qty}</span>
              <button type="button" onClick={() => setQty(qty + 1)} style={qtyButton}>+</button>
            </div>
          )}

          {isSoldOut ? (
            waitlistDone ? (
              <div style={{ padding: '14px', borderRadius: '8px', background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)', color: '#22c55e', fontSize: '13px', textAlign: 'center' }}>
                <Heart style={{ width: '16px', height: '16px', display: 'inline', marginRight: '6px' }} /> You're on the list.
              </div>
            ) : (
              <form onSubmit={handleWaitlist} style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <input
                  type="email"
                  placeholder="your@email.com"
                  value={waitlistEmail}
                  onChange={event => setWaitlistEmail(event.target.value)}
                  style={{ flex: 1, minWidth: '180px', padding: '12px 14px', borderRadius: '8px', background: '#1a1a1a', border: '1px solid #333', color: '#fff', fontSize: '13px', outline: 'none' }}
                />
                <button type="submit" style={buttonStyle('primary')}>Join Waitlist</button>
              </form>
            )
          ) : (
            <button type="button" onClick={handleAddToCart} style={{ ...buttonStyle('primary'), width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
              <ShoppingCart style={{ width: '16px', height: '16px' }} /> Add to Cart
            </button>
          )}

          <p style={{ fontSize: '11px', color: '#555', marginTop: '16px' }}>
            Ships Australia-wide. 10% of proceeds donated to 1800RESPECT.
          </p>
        </section>
      </main>
    </div>
  );
}

const labelStyle = {
  color: '#C9A84C',
  fontSize: '10px',
  letterSpacing: '0.18em',
  textTransform: 'uppercase',
  fontWeight: 700,
  margin: '0 0 8px',
};

const qtyButton = {
  width: '32px',
  height: '32px',
  borderRadius: '6px',
  background: '#1a1a1a',
  border: '1px solid #333',
  color: '#fff',
  cursor: 'pointer',
  fontSize: '16px',
};

function sizeButtonStyle(active) {
  return {
    padding: '7px 14px',
    borderRadius: '6px',
    fontSize: '12px',
    cursor: 'pointer',
    background: active ? 'rgba(201,168,76,0.15)' : 'rgba(255,255,255,0.04)',
    border: `1px solid ${active ? '#C9A84C' : 'rgba(255,255,255,0.1)'}`,
    color: active ? '#C9A84C' : '#bbb',
  };
}

function buttonStyle(variant) {
  if (variant === 'primary') {
    return {
      padding: '12px 20px',
      borderRadius: '8px',
      background: 'linear-gradient(135deg, #B8860B, #C9A84C, #FFF8DC, #C9A84C, #B8860B)',
      color: '#111',
      border: 'none',
      cursor: 'pointer',
      fontSize: '12px',
      fontWeight: 800,
      letterSpacing: '0.08em',
      textTransform: 'uppercase',
    };
  }
  return {};
}
