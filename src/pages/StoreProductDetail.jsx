import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, Check, ChevronLeft, ChevronRight, ShoppingCart } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { useCartStore } from '@/lib/cartStore';
import { useToast } from '@/components/ui/use-toast';
import {
  POSTER_PRODUCT_FALLBACK,
  getProductVariants,
  productMatchesRoute,
  productWithVariantPrice,
} from '@/lib/storeProduct';

function formatAud(value) {
  return Number(value || 0).toLocaleString('en-AU', {
    style: 'currency',
    currency: 'AUD',
    minimumFractionDigits: Number(value) % 1 ? 2 : 0,
  });
}

export default function StoreProductDetail() {
  const { productKey } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const addItem = useCartStore((state) => state.addItem);
  const [selectedVariantValue, setSelectedVariantValue] = useState('');
  const [currentImage, setCurrentImage] = useState(0);

  const { data: dbProducts = [], isLoading } = useQuery({
    queryKey: ['storeProductDetail', productKey],
    queryFn: () => base44.entities.MerchProduct.filter({ is_active: true }, '-updated_date'),
    staleTime: 60_000,
  });

  const product = useMemo(() => {
    const candidates = [...(Array.isArray(dbProducts) ? dbProducts : []), POSTER_PRODUCT_FALLBACK];
    return candidates.find((candidate) => productMatchesRoute(candidate, productKey));
  }, [dbProducts, productKey]);

  const variants = useMemo(() => getProductVariants(product), [product]);
  const selectedVariant = variants.find((variant) => variant.value === selectedVariantValue);
  const images = product?.images_array?.length
    ? product.images_array
    : product?.image_url
      ? [product.image_url]
      : [];
  const displayedPrice = selectedVariant?.price ?? product?.sale_price ?? product?.price ?? 0;
  const inStock = Number(product?.stock_quantity ?? 0) > 0;

  useEffect(() => {
    setSelectedVariantValue('');
    setCurrentImage(0);
  }, [product?.id]);

  if (isLoading && !product) {
    return (
      <div className="min-h-screen py-28 px-4">
        <div className="max-w-5xl mx-auto animate-pulse space-y-5">
          <div className="h-8 w-48 rounded bg-secondary/50" />
          <div className="h-[520px] rounded-3xl bg-secondary/30" />
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen py-32 px-4 text-center">
        <h1 className="font-display text-4xl text-foreground">Product not found</h1>
        <p className="font-body text-muted-foreground mt-3">This product may have moved or is no longer available.</p>
        <button onClick={() => navigate('/store')} className="mt-8 gradient-gold-button rounded-full px-8 py-3 font-body uppercase tracking-wider">
          Back to Store
        </button>
      </div>
    );
  }

  const addToCart = () => {
    if (variants.length > 0 && !selectedVariant) {
      toast({ title: 'Please select a size', variant: 'destructive' });
      return;
    }

    const pricedProduct = productWithVariantPrice(product, selectedVariant);
    addItem(pricedProduct, 1, selectedVariant?.label || null);
    toast({
      title: 'Added to cart',
      description: `${product.name}${selectedVariant ? ` — ${selectedVariant.label}` : ''}`,
    });
  };

  return (
    <div data-testid="product-detail-page" className="min-h-screen py-24 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        <button
          data-testid="back-to-store"
          onClick={() => navigate('/store')}
          className="mb-6 inline-flex items-center gap-2 font-body text-sm text-muted-foreground hover:text-primary"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Store
        </button>

        <div className="grid lg:grid-cols-2 gap-8 rounded-3xl border border-border/30 bg-card/40 p-4 md:p-8">
          <section>
            <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-secondary/20">
              {images[currentImage] ? (
                <img
                  data-testid="product-detail-image"
                  src={images[currentImage]}
                  alt={`${product.name} artwork ${currentImage + 1}`}
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground">Image unavailable</div>
              )}
              {images.length > 1 && (
                <>
                  <button
                    aria-label="Previous artwork"
                    onClick={() => setCurrentImage((index) => (index === 0 ? images.length - 1 : index - 1))}
                    className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-black/60 p-2 text-white"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    aria-label="Next artwork"
                    onClick={() => setCurrentImage((index) => (index === images.length - 1 ? 0 : index + 1))}
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-black/60 p-2 text-white"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}
            </div>

            {images.length > 1 && (
              <div className="grid grid-cols-4 sm:grid-cols-7 gap-2 mt-3">
                {images.map((image, index) => (
                  <button
                    key={image}
                    onClick={() => setCurrentImage(index)}
                    className={`aspect-square rounded-lg overflow-hidden border-2 ${
                      currentImage === index ? 'border-primary' : 'border-transparent opacity-70'
                    }`}
                  >
                    <img src={image} alt={`Artwork ${index + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </section>

          <section className="flex flex-col">
            <div className="flex flex-wrap gap-2">
              <span className="rounded-full border border-green-500/30 bg-green-500/10 px-3 py-1 font-body text-[10px] uppercase tracking-wider text-green-300">
                {inStock ? 'Available' : 'Sold Out'}
              </span>
              {product.category === 'poster' && (
                <span className="rounded-full border border-primary/30 bg-primary/10 px-3 py-1 font-body text-[10px] uppercase tracking-wider text-primary">
                  Real artwork verified
                </span>
              )}
            </div>

            <h1 data-testid="product-detail-title" className="font-display text-4xl md:text-5xl text-foreground mt-5">
              {product.name}
            </h1>
            <p data-testid="product-detail-price" className="font-body text-3xl gradient-gold-glow mt-4">
              {selectedVariant ? `${formatAud(displayedPrice)} — ${selectedVariant.label}` : `From ${formatAud(displayedPrice)}`}
            </p>
            <p className="font-body text-sm leading-7 text-foreground/70 mt-5 whitespace-pre-line">{product.description}</p>

            {variants.length > 0 && (
              <div className="mt-7">
                <p className="font-body text-xs uppercase tracking-[0.2em] text-muted-foreground mb-3">Select size</p>
                <div data-testid="product-variant-options" className="grid grid-cols-2 gap-3">
                  {variants.map((variant) => (
                    <button
                      key={variant.value}
                      data-testid={`variant-${variant.label.toLowerCase()}`}
                      onClick={() => setSelectedVariantValue(variant.value)}
                      className={`rounded-xl border p-3 text-left transition-colors ${
                        selectedVariantValue === variant.value
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-border/40 text-foreground hover:border-primary/40'
                      }`}
                    >
                      <span className="font-display text-lg">{variant.label}</span>
                      <span className="block font-body text-xs mt-1">{formatAud(variant.price)}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-7 rounded-2xl border border-border/30 bg-secondary/20 p-4 space-y-2">
              <p className="font-body text-xs text-foreground/80 flex items-center gap-2"><Check className="w-4 h-4 text-primary" /> Ships Australia-wide</p>
              <p className="font-body text-xs text-foreground/80 flex items-center gap-2"><Check className="w-4 h-4 text-primary" /> Size and price are preserved in your cart</p>
              <p className="font-body text-xs text-foreground/80 flex items-center gap-2"><Check className="w-4 h-4 text-primary" /> Shipping is shown before payment</p>
            </div>

            <div className="mt-auto pt-8 grid sm:grid-cols-2 gap-3">
              <button
                data-testid="product-add-to-cart"
                disabled={!inStock}
                onClick={addToCart}
                className="rounded-full py-3 gradient-gold-button font-body text-sm uppercase tracking-wider disabled:opacity-40"
              >
                Add to Cart
              </button>
              <button
                data-testid="product-view-cart"
                onClick={() => navigate('/store/cart-details')}
                className="rounded-full py-3 border border-primary/40 text-primary font-body text-sm uppercase tracking-wider flex items-center justify-center gap-2"
              >
                <ShoppingCart className="w-4 h-4" /> View Cart
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
