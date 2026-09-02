import { useState } from 'react';
import { X, ChevronLeft, ChevronRight, ShoppingCart, Plus, ZoomIn } from 'lucide-react';
import { useCartStore } from '@/lib/cartStore';
import { useToast } from '@/components/ui/use-toast';

const INELIGIBLE_FOR_DISCOUNT = ['cd', 'vinyl', 'song', 'digital', 'music', 'bundle'];

function isEligibleForDiscount(product) {
  if (product?.exclude_from_discounts === true) return false;
  const category = product?.category;
  if (!category) return true;
  const cat = category.toLowerCase();
  return !INELIGIBLE_FOR_DISCOUNT.some(c => cat.includes(c));
}

function getShippingNote(category) {
  if (!category) return 'Delivery within Australia is calculated before payment from the current approved shipping rule.';
  const cat = category.toLowerCase();
  if (cat === 'digital' || cat === 'music') return 'Digital item. No delivery charge applies.';
  return 'Delivery within Australia is calculated before payment from the current approved shipping rule.';
}

export default function ProductDetailModal({ product, allImages, onClose }) {
  const { toast } = useToast();
  const addItem = useCartStore(state => state.addItem);
  const [currentImg, setCurrentImg] = useState(0);
  const [zoomOpen, setZoomOpen] = useState(false);
  const [selectedSize, setSelectedSize] = useState('');
  const [showSizeError, setShowSizeError] = useState(false);

  const images = allImages?.length > 0 ? allImages : (product.image_url ? [product.image_url] : []);
  const hasSize = product.sizes_available?.length > 0;
  const price = product.sale_price ?? product.price ?? 0;
  const inStock = product.stock_quantity > 0;
  const eligible = isEligibleForDiscount(product);

  const prev = () => setCurrentImg(i => (i === 0 ? images.length - 1 : i - 1));
  const next = () => setCurrentImg(i => (i === images.length - 1 ? 0 : i + 1));

  const handleAddToCart = () => {
    if (hasSize && !selectedSize) {
      setShowSizeError(true);
      toast({ title: 'Please select a size', variant: 'destructive' });
      return;
    }
    addItem(product, 1, selectedSize || null);
    setShowSizeError(false);
    toast({ title: 'Added to cart! 🤍', description: product.name });
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div
          role="dialog"
          aria-modal="true"
          aria-label={product.name}
          data-testid="product-detail-modal"
          className="relative bg-card border border-border/40 rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto pointer-events-auto"
          onClick={e => e.stopPropagation()}
        >
          {/* Close */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-secondary/80 flex items-center justify-center text-muted-foreground hover:text-foreground"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="grid md:grid-cols-2">
            {/* Image gallery */}
            <div className="relative bg-secondary/20 rounded-tl-2xl rounded-bl-2xl overflow-hidden">
              {images.length > 0 ? (
                <>
                  <div className="aspect-square relative group">
                    <img
                      src={images[currentImg]}
                      alt={`${product.name} — view ${currentImg + 1}`}
                      className="w-full h-full object-cover cursor-zoom-in"
                      onClick={() => setZoomOpen(true)}
                    />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                      <div className="bg-black/40 rounded-full p-2">
                        <ZoomIn className="w-5 h-5 text-white" />
                      </div>
                    </div>
                    {images.length > 1 && (
                      <>
                        <button onClick={prev} className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/50 flex items-center justify-center text-white hover:bg-black/70">
                          <ChevronLeft className="w-4 h-4" />
                        </button>
                        <button onClick={next} className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/50 flex items-center justify-center text-white hover:bg-black/70">
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </>
                    )}
                  </div>
                  {/* Thumbnails */}
                  {images.length > 1 && (
                    <div className="flex gap-2 p-3 flex-wrap">
                      {images.map((img, i) => (
                        <button
                          key={i}
                          onClick={() => setCurrentImg(i)}
                          className={`w-14 h-14 rounded-lg overflow-hidden border-2 transition-all ${i === currentImg ? 'border-primary' : 'border-transparent opacity-60 hover:opacity-100'}`}
                        >
                          <img src={img} alt={`View ${i + 1}`} className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <div className="aspect-square flex items-center justify-center">
                  <ShoppingCart className="w-16 h-16 text-muted-foreground/20" />
                </div>
              )}
            </div>

            {/* Details */}
            <div className="p-6 flex flex-col gap-4">
              {/* Status badge */}
              <div className="flex items-center gap-2">
                {inStock ? (
                  <span className="font-body text-[9px] tracking-widest uppercase border rounded-full px-2.5 py-1 bg-green-500/15 text-green-400 border-green-500/30">In Stock</span>
                ) : (
                  <span className="font-body text-[9px] tracking-widest uppercase border rounded-full px-2.5 py-1 bg-red-500/15 text-red-400 border-red-500/30">Sold Out</span>
                )}
                {!eligible && (
                  <span className="font-body text-[9px] tracking-widest uppercase border rounded-full px-2.5 py-1 bg-secondary/50 text-muted-foreground border-border/40">Not eligible for promo codes</span>
                )}
              </div>

              <div>
                <h2 className="font-display text-2xl text-foreground leading-tight">{product.name}</h2>
                <p className="font-body text-2xl gradient-gold-glow mt-2 font-medium">${price} AUD</p>
              </div>

              {product.description && (
                <p className="font-body text-sm text-foreground/70 leading-relaxed">{product.description}</p>
              )}

              {/* Size selector */}
              {hasSize && (
                <div>
                  <p className="font-body text-xs tracking-wider uppercase text-muted-foreground mb-2">Select Size</p>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes_available.map(s => {
                      const sizeStock = Number(product.stock_by_variant?.[s]);
                      const unavailable = Number.isFinite(sizeStock) && sizeStock <= 0;
                      return (
                        <button
                          key={s}
                          type="button"
                          disabled={unavailable}
                          onClick={() => { setSelectedSize(s); setShowSizeError(false); }}
                          className={`px-3 py-1.5 rounded-lg border font-body text-sm transition-all disabled:opacity-30 disabled:cursor-not-allowed ${
                            selectedSize === s ? 'border-primary bg-primary/10 text-primary' : 'border-border/50 text-muted-foreground hover:border-primary/30'
                          }`}
                        >
                          {s}{Number.isFinite(sizeStock) ? ` (${sizeStock})` : ''}
                        </button>
                      );
                    })}
                  </div>
                  {showSizeError && <p className="text-xs text-destructive mt-1">Please select a size</p>}
                </div>
              )}

              {/* Shipping note */}
              <div className="bg-secondary/30 rounded-xl p-3">
                <p className="font-body text-xs text-muted-foreground">🚚 {getShippingNote(product.category)}</p>
              </div>

              {/* Image labels for mug */}
              {images.length === 2 && product.name?.toLowerCase().includes('mug') && (
                <div className="flex gap-2 text-xs font-body text-muted-foreground">
                  <button onClick={() => setCurrentImg(0)} className={`flex-1 py-1.5 rounded-lg border transition-all text-center ${currentImg === 0 ? 'border-primary text-primary' : 'border-border/40'}`}>
                    ☕ Front
                  </button>
                  <button onClick={() => setCurrentImg(1)} className={`flex-1 py-1.5 rounded-lg border transition-all text-center ${currentImg === 1 ? 'border-primary text-primary' : 'border-border/40'}`}>
                    ↩ Back
                  </button>
                </div>
              )}

              {inStock ? (
                <button
                  onClick={handleAddToCart}
                  className="w-full rounded-full py-3 gradient-gold-button font-body text-sm tracking-wider uppercase flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" /> Add to Cart
                </button>
              ) : (
                <div className="w-full rounded-full py-3 border border-red-500/30 text-red-400 font-body text-sm tracking-wider uppercase text-center cursor-not-allowed">
                  Sold Out
                </div>
              )}

              {eligible && (
                <p className="font-body text-xs text-muted-foreground/60 text-center">
                  ✓ Promo codes apply to this item
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Image zoom overlay */}
      {zoomOpen && images[currentImg] && (
        <div className="fixed inset-0 z-[60] bg-black/95 flex items-center justify-center p-4" onClick={() => setZoomOpen(false)}>
          <button className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20">
            <X className="w-5 h-5" />
          </button>
          <img src={images[currentImg]} alt={product.name} className="max-w-full max-h-full object-contain" />
        </div>
      )}
    </>
  );
}