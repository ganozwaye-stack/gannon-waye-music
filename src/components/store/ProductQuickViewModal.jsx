import { useMemo, useState } from 'react';
import { STORE_PRODUCTS, STORE_ADDONS } from '@/config/storeWorldConfig';
import { useCartStore } from '@/lib/cartStore';

const ACCENT = '#D4AF37';

function ProductImage({ src, alt, emoji }) {
  const [imgError, setImgError] = useState(false);
  return imgError || !src
    ? <div style={{ width: '100%', height: '100%', background: '#111', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem' }}>{emoji || '🛍️'}</div>
    : <img src={src} alt={alt} onError={() => setImgError(true)} style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '18px' }} />;
}

export default function ProductQuickViewModal({ productId, onClose }) {
  const product = STORE_PRODUCTS.find(p => p.id === productId);
  const [selectedImage, setSelectedImage] = useState(0);
  const [qty, setQty] = useState(1);
  const [selectedSize, setSelectedSize] = useState(product?.options?.size?.[0] || '');
  const [selectedAddons, setSelectedAddons] = useState([]);

  const addonOptions = useMemo(() => {
    if (!product?.addons) return [];
    return STORE_ADDONS.filter(addon => product.addons.includes(addon.id));
  }, [product]);

  const addItem = useCartStore(state => state.addItem);

  if (!product) return null;

  const isSoldOut = product.status === 'sold_out';
  const isMemorial = product.status === 'memorial';

  const toggleAddon = (addonId) => {
    setSelectedAddons(prev => prev.includes(addonId) ? prev.filter(id => id !== addonId) : [...prev, addonId]);
  };

  const subtotal = !isSoldOut && !isMemorial
    ? product.priceValue * qty + selectedAddons.reduce((sum, addonId) => {
        const addon = STORE_ADDONS.find(a => a.id === addonId);
        return sum + (addon?.priceValue || 0);
      }, 0)
    : 0;

  const handleAddToCart = () => {
    // Build a product-shaped object compatible with cartStore (expects product.id, product.sale_price)
    const productForCart = {
      id: product.id,
      name: product.name,
      sale_price: product.priceValue,
      price: product.priceValue,
      image_url: product.images?.[0],
      excludeFromDiscounts: product.excludeFromDiscounts || false,
      category: product.category,
    };
    addItem(productForCart, qty, selectedSize || null);

    // Also add any selected add-ons as separate cart items
    selectedAddons.forEach(addonId => {
      const addon = STORE_ADDONS.find(a => a.id === addonId);
      if (addon) {
        addItem({
          id: addon.id,
          name: addon.name,
          sale_price: addon.priceValue,
          price: addon.priceValue,
          image_url: addon.image,
        }, 1, null);
      }
    });

    onClose();
  };

  const handleCheckout = () => {
    handleAddToCart();
    window.location.href = '/store/cart-details';
  };

  const labelStyle = { color: ACCENT, fontSize: '10px', letterSpacing: '0.18em', textTransform: 'uppercase', fontWeight: 700, margin: '0 0 8px' };
  const selectStyle = { width: '100%', padding: '12px', background: '#080808', border: '1px solid rgba(212,175,55,0.25)', borderRadius: '8px', color: '#fff' };
  const qtyBtn = { width: 42, border: 'none', background: '#151515', color: ACCENT, cursor: 'pointer', padding: '10px 0', fontSize: '18px' };
  const primaryButton = { padding: '13px 18px', borderRadius: '8px', border: 'none', background: 'linear-gradient(135deg, #B8860B, #D4AF37, #FFF8DC, #D4AF37)', color: '#111', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.12em', cursor: 'pointer', width: '100%', fontSize: '12px' };
  const outlineButton = { padding: '13px 18px', borderRadius: '8px', border: '1px solid rgba(212,175,55,0.45)', background: 'transparent', color: ACCENT, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', cursor: 'pointer', width: '100%', fontSize: '12px' };
  const ghostButton = { padding: '13px 18px', borderRadius: '8px', border: 'none', background: 'transparent', color: '#777', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', cursor: 'pointer', width: '100%', fontSize: '12px' };

  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.76)', backdropFilter: 'blur(10px)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '22px' }}>
      <div onClick={(e) => e.stopPropagation()} style={{ width: 'min(980px, 100%)', maxHeight: '92vh', overflowY: 'auto', background: 'linear-gradient(135deg, #111 0%, #17110b 100%)', border: '1px solid rgba(212,175,55,0.28)', borderRadius: '18px', boxShadow: '0 30px 100px rgba(0,0,0,0.85)', color: '#fff', position: 'relative' }}>
        <button type="button" onClick={onClose} style={{ position: 'absolute', top: '14px', right: '14px', width: '38px', height: '38px', borderRadius: '50%', border: '1px solid rgba(212,175,55,0.35)', background: 'rgba(0,0,0,0.45)', color: ACCENT, fontSize: '24px', cursor: 'pointer', zIndex: 5, lineHeight: 1 }}>×</button>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '28px', padding: '30px' }}>
          {/* Images */}
          <div>
            <div style={{ background: '#050505', border: '1px solid rgba(212,175,55,0.18)', borderRadius: '14px', aspectRatio: '1/1', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
              <ProductImage src={product.images?.[selectedImage]} alt={product.name} emoji="🛍️" />
            </div>
            {product.images?.length > 1 && (
              <div style={{ display: 'flex', gap: '10px', marginTop: '12px', flexWrap: 'wrap' }}>
                {product.images.map((image, index) => (
                  <button key={index} type="button" onClick={() => setSelectedImage(index)} style={{ width: '60px', height: '60px', borderRadius: '8px', border: index === selectedImage ? `2px solid ${ACCENT}` : '1px solid rgba(212,175,55,0.2)', background: '#050505', padding: '4px', cursor: 'pointer', overflow: 'hidden' }}>
                    <ProductImage src={image} alt={`view ${index + 1}`} emoji="🛍️" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div>
            {product.badge && (
              <div style={{ display: 'inline-block', padding: '5px 9px', borderRadius: '999px', border: '1px solid rgba(212,175,55,0.35)', color: ACCENT, fontSize: '10px', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '12px' }}>{product.badge}</div>
            )}
            <h2 style={{ margin: '0 0 10px', fontSize: 'clamp(1.2rem,3vw,1.7rem)', lineHeight: 1.2 }}>{product.name}</h2>
            <p style={{ color: '#777', lineHeight: 1.7, fontSize: '13px', marginBottom: '16px' }}>{product.description}</p>

            <div style={{ color: isSoldOut ? '#e05555' : ACCENT, fontSize: '1.6rem', fontWeight: 800, marginBottom: '18px' }}>
              {product.price}
              {product.priceNote && !isSoldOut && <span style={{ fontSize: '0.72rem', color: '#777', marginLeft: '8px' }}>{product.priceNote}</span>}
            </div>

            {product.includes && (
              <div style={{ marginBottom: '16px' }}>
                <p style={labelStyle}>Includes</p>
                <ul style={{ color: '#aaa', fontSize: '13px', lineHeight: 1.8, paddingLeft: '18px', margin: 0 }}>
                  {product.includes.map(item => <li key={item}>{item}</li>)}
                </ul>
              </div>
            )}

            {product.options?.size?.length > 0 && !isSoldOut && (
              <div style={{ marginBottom: '16px' }}>
                <p style={labelStyle}>Size</p>
                <select value={selectedSize} onChange={(e) => setSelectedSize(e.target.value)} style={selectStyle}>
                  {product.options.size.map(size => <option key={size} value={size}>{size}</option>)}
                </select>
              </div>
            )}

            {!isSoldOut && !isMemorial && (
              <div style={{ marginBottom: '16px' }}>
                <p style={labelStyle}>Quantity</p>
                <div style={{ display: 'inline-flex', border: '1px solid rgba(212,175,55,0.28)', borderRadius: '8px', overflow: 'hidden' }}>
                  <button type="button" onClick={() => setQty(q => Math.max(1, q - 1))} style={qtyBtn}>−</button>
                  <span style={{ padding: '10px 18px', color: '#fff' }}>{qty}</span>
                  <button type="button" onClick={() => setQty(q => q + 1)} style={qtyBtn}>+</button>
                </div>
              </div>
            )}

            {addonOptions.length > 0 && !isSoldOut && !isMemorial && (
              <div style={{ marginBottom: '20px' }}>
                <p style={labelStyle}>Complete the experience</p>
                <div style={{ display: 'grid', gap: '10px' }}>
                  {addonOptions.map(addon => (
                    <label key={addon.id} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px', border: '1px solid rgba(212,175,55,0.18)', borderRadius: '10px', cursor: 'pointer', background: selectedAddons.includes(addon.id) ? 'rgba(212,175,55,0.12)' : 'rgba(255,255,255,0.02)' }}>
                      <input type="checkbox" checked={selectedAddons.includes(addon.id)} onChange={() => toggleAddon(addon.id)} />
                      <div style={{ width: 42, height: 42, flexShrink: 0, borderRadius: 6, overflow: 'hidden', background: '#111' }}>
                        <ProductImage src={addon.image} alt={addon.name} emoji="🛍️" />
                      </div>
                      <span style={{ flex: 1, color: '#ddd', fontSize: 12 }}>{addon.name}</span>
                      <strong style={{ color: ACCENT, fontSize: 12 }}>{addon.price}</strong>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {!isSoldOut && !isMemorial ? (
              <div style={{ display: 'grid', gap: '10px' }}>
                <button type="button" onClick={handleAddToCart} style={primaryButton}>Add to Cart — ${subtotal.toFixed(2)}</button>
                <button type="button" onClick={handleCheckout} style={outlineButton}>Checkout Now</button>
                <button type="button" onClick={onClose} style={ghostButton}>Continue Shopping</button>
              </div>
            ) : isMemorial ? (
              <button type="button" onClick={() => { window.location.href = product.link; }} style={outlineButton}>Visit Private Tribute</button>
            ) : (
              <button type="button" onClick={onClose} style={outlineButton}>Sold Out — Continue Shopping</button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}