import { useState } from 'react';
import { useCartStore } from '@/lib/cartStore';
import { base44 } from '@/api/base44Client';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ExternalLink, AlertTriangle, CheckCircle, X, Tag, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';

const AU_SHIPPING_BASE = 12.95;
const AU_SHIPPING_ADDITIONAL_PER_ITEM = 2.00;
const FREE_SHIPPING_THRESHOLD = 150;
const NO_SHIPPING_CATEGORIES = ['digital', 'support', 'donation', 'song', 'music', 'digital_music'];
const INELIGIBLE_FOR_DISCOUNT = ['cd', 'vinyl', 'song', 'digital', 'support', 'donation', 'shipping', 'music', 'limited_edition_music', 'digital_music'];

function isInternational(address) {
  if (!address) return false;
  const lower = address.toLowerCase();
  return ['usa', 'united states', 'united kingdom', 'canada', 'new zealand', 'nz', 'europe', 'india', 'singapore'].some(k => lower.includes(k));
}

function needsShipping(category) {
  if (!category) return true;
  return !NO_SHIPPING_CATEGORIES.includes(category.toLowerCase().trim());
}

function isEligibleForDiscount(category) {
  if (!category) return true;
  const cat = category.toLowerCase().trim();
  return !INELIGIBLE_FOR_DISCOUNT.some(c => cat.includes(c));
}

function calcCombinedShipping(items, address) {
  const physicalItems = items.filter(item => needsShipping(item.product.category));
  if (physicalItems.length === 0) return { shipping: 0, shippingLabel: 'Free (digital/no shipping)', internationalQuote: false };
  if (isInternational(address)) return { shipping: 0, shippingLabel: 'Quote required (international)', internationalQuote: true };

  const subtotal = items.reduce((sum, item) => {
    const price = item.product.sale_price ?? item.product.price ?? 0;
    return sum + price * item.quantity;
  }, 0);
  if (subtotal >= FREE_SHIPPING_THRESHOLD) return { shipping: 0, shippingLabel: 'Free (order ≥ $150)', internationalQuote: false };

  const totalQty = items.reduce((sum, item) => sum + item.quantity, 0);
  const combined = totalQty <= 1 ? AU_SHIPPING_BASE : AU_SHIPPING_BASE + (totalQty - 1) * AU_SHIPPING_ADDITIONAL_PER_ITEM;
  return {
    shipping: combined,
    shippingLabel: totalQty > 1 ? `$${combined.toFixed(2)} AUD (combined package)` : `$${AU_SHIPPING_BASE.toFixed(2)} AUD`,
    internationalQuote: false,
  };
}

export default function StoreCheckout() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const rawItems = useCartStore(state => state.items);
  const items = Array.isArray(rawItems) ? rawItems : [];
  const clearCart = useCartStore(state => state.clearCart);
  const getSubtotal = useCartStore(state => {
    const safeItems = Array.isArray(state.items) ? state.items : [];
    return safeItems.reduce((sum, item) => {
      const price = item.product?.sale_price ?? item.product?.price ?? 0;
      return sum + price * (item.quantity || 0);
    }, 0);
  });

  const [form, setForm] = useState({ customer_name: '', customer_email: '', shipping_address: '' });
  const [addSupport, setAddSupport] = useState(0);
  const [redirecting, setRedirecting] = useState(false);
  const [checkoutError, setCheckoutError] = useState(null);
  const [promoCode, setPromoCode] = useState('');
  const [promoValidated, setPromoValidated] = useState(null);
  const [promoError, setPromoError] = useState(null);
  const [promoLoading, setPromoLoading] = useState(false);

  const subtotal = getSubtotal;
  const totalQty = items.reduce((sum, item) => sum + (item.quantity || 0), 0);
  const shipping = calcCombinedShipping(items, form.shipping_address);

  // Compute eligible vs ineligible subtotal for promo
  const eligibleSubtotal = items.reduce((sum, item) => {
    if (!isEligibleForDiscount(item.product.category)) return sum;
    return sum + (item.product.sale_price ?? item.product.price ?? 0) * item.quantity;
  }, 0);
  const ineligibleSubtotal = subtotal - eligibleSubtotal;
  const ineligibleItems = items.filter(item => !isEligibleForDiscount(item.product.category));

  const discountPercent = promoValidated?.discount_percent || 0;
  const discountAmount = promoValidated?.discount_amount ?? (eligibleSubtotal * discountPercent / 100);
  const total = subtotal - discountAmount + shipping.shipping + addSupport;

  const handleValidatePromo = async () => {
    if (!promoCode.trim()) return;
    setPromoLoading(true);
    setPromoError(null);
    setPromoValidated(null);
    try {
      const cartForValidation = items.map(item => ({
        product_id: item.product.id,
        product_name: item.product.name,
        price: item.product.sale_price ?? item.product.price ?? 0,
        quantity: item.quantity,
        category: item.product.category || '',
      }));

      const res = await base44.functions.invoke('validatePromoCode', {
        code: promoCode.trim(),
        email: form.customer_email || undefined,
        cart_items: cartForValidation,
      });

      if (!res.data?.valid) {
        const reason = res.data?.reason || '';
        if (reason.toLowerCase().includes('not found') || reason.toLowerCase().includes('inactive')) {
          setPromoError('This code is no longer active.');
        } else if (res.data?.all_items_excluded) {
          setPromoError('This code applies to eligible merch only. Your cart contains only excluded items.');
        } else {
          setPromoError(res.data?.reason || 'This code is not valid.');
        }
      } else {
        // Valid — set promo with guard results
        setPromoValidated({
          code: res.data.code,
          discount_percent: res.data.discount_percent,
          discount_amount: res.data.discount_amount ?? (eligibleSubtotal * res.data.discount_percent / 100),
          eligible_subtotal: res.data.eligible_subtotal ?? eligibleSubtotal,
          excluded_subtotal: res.data.excluded_subtotal ?? ineligibleSubtotal,
          excluded_items: res.data.excluded_items || [],
          all_items_excluded: res.data.all_items_excluded || false,
          id: res.data.id,
        });
        toast({ title: `✅ ${res.data.code} applied — ${res.data.discount_percent}% off eligible merch` });
      }
    } catch {
      setPromoError('Could not validate code. Please try again.');
    }
    setPromoLoading(false);
  };

  const handleCheckout = async () => {
    if (redirecting) return;
    setRedirecting(true);
    setCheckoutError(null);

    const timeout = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Checkout timed out. Please try again.')), 15000)
    );

    try {
      const res = await Promise.race([
        base44.functions.invoke('createCheckoutSession', {
          customerEmail: form.customer_email || undefined,
          customerName: form.customer_name,
          metadata: {
            items: JSON.stringify(items.map(item => ({
              product_id: item.product.id,
              product_name: item.product.name,
              price: item.product.sale_price ?? item.product.price,
              quantity: item.quantity,
              size: item.size,
              category: item.product.category || '',
            }))),
            quantity: String(totalQty),
            shipping_address: form.shipping_address,
            add_support: String(addSupport),
            promo_code: promoValidated?.code || '',
            promo_discount_percent: String(discountPercent),
            discount_amount: String(discountAmount.toFixed(2)),
          },
        }),
        timeout,
      ]);

      if (res.data?.code === 'STRIPE_CONFIG_ERROR' || res.data?.code === 'STRIPE_MODE_MISMATCH') {
        throw new Error(res.data.friendly_message || 'Checkout is temporarily unavailable.');
      }

      if (res.data?.url) {
        clearCart();
        window.location.href = res.data.url;
      } else {
        throw new Error(res.data?.error || 'Checkout could not be prepared.');
      }
    } catch (err) {
      setCheckoutError(err.message || 'Checkout failed. You have not been charged.');
      setRedirecting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen py-24 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <p className="font-body text-lg text-muted-foreground">Your cart is empty</p>
          <Button onClick={() => navigate('/store')} className="mt-4" variant="outline">Return to Store</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-24 px-4">
      <div className="max-w-3xl mx-auto">
        <button onClick={() => navigate('/store')} className="flex items-center gap-2 font-body text-sm text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="w-4 h-4" /> Back to Store
        </button>

        <h1 className="font-display text-3xl text-foreground mb-8">Checkout</h1>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Order Summary */}
          <div className="bg-secondary/30 rounded-xl p-6 h-fit">
            <h2 className="font-display text-xl text-foreground mb-4">Order Summary</h2>
            <div className="space-y-3 mb-4">
              {items.map((item, index) => {
                const eligible = isEligibleForDiscount(item.product.category);
                return (
                  <div key={`${item.product_id}-${item.size}-${index}`} className="flex gap-3">
                    <img
                      src={item.product.image_url}
                      alt={item.product.name}
                      className="w-16 h-16 object-cover rounded-lg bg-secondary/50"
                    />
                    <div className="flex-1">
                      <p className="font-display text-sm text-foreground line-clamp-2">{item.product.name}</p>
                      {item.size && <p className="font-body text-xs text-muted-foreground">Size: {item.size}</p>}
                      <p className="font-body text-xs text-muted-foreground">Qty: {item.quantity}</p>
                      <p className="font-body text-sm gradient-gold-glow mt-1">
                        ${((item.product.sale_price ?? item.product.price ?? 0) * item.quantity).toFixed(2)}
                      </p>
                      {promoValidated && !eligible && (
                        <p className="font-body text-[10px] text-amber-400 mt-0.5">Excluded from promo</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="border-t border-border/40 pt-4 space-y-2 text-sm font-body">
              <div className="flex justify-between text-foreground/70">
                <span>Product subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              {promoValidated && (
                <>
                  <div className="flex justify-between text-foreground/50 text-xs">
                    <span>Eligible merch subtotal</span>
                    <span>${(promoValidated.eligible_subtotal ?? eligibleSubtotal).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-green-400">
                    <span className="flex items-center gap-1"><Tag className="w-3 h-3" />{promoValidated.code} ({discountPercent}% off)</span>
                    <span>-${discountAmount.toFixed(2)}</span>
                  </div>
                  {ineligibleItems.length > 0 && (
                    <div className="text-xs text-amber-400/80 bg-amber-400/5 border border-amber-400/20 rounded-lg px-3 py-2">
                      <p className="flex items-center gap-1 mb-1"><Info className="w-3 h-3" /> Excluded from discount:</p>
                      <p>Shipping, {ineligibleItems.map(i => i.product.name).join(', ')}{addSupport > 0 ? ', support contribution' : ''}</p>
                    </div>
                  )}
                </>
              )}
              <div className="flex justify-between text-foreground/70">
                <span>Shipping</span>
                <span className={shipping.shipping === 0 && !shipping.internationalQuote ? 'text-green-400' : ''}>
                  {shipping.internationalQuote ? 'Quote required' : shipping.shipping === 0 ? 'Free' : shipping.shippingLabel}
                </span>
              </div>
              {addSupport > 0 && (
                <div className="flex justify-between text-primary">
                  <span>Support contribution 🤍</span>
                  <span>+${addSupport.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between font-semibold text-foreground border-t border-border/40 pt-2">
                <span>Total</span>
                <span className="gradient-gold-glow">${total.toFixed(2)} AUD</span>
              </div>
            </div>
          </div>

          {/* Checkout Form */}
          <div className="space-y-4">
            <div>
              <Label className="font-body text-xs tracking-wider uppercase text-muted-foreground mb-1.5 block">Full Name *</Label>
              <Input placeholder="Your name" value={form.customer_name} onChange={e => setForm(f => ({ ...f, customer_name: e.target.value }))} className="bg-secondary/50 border-border/40" />
            </div>
            <div>
              <Label className="font-body text-xs tracking-wider uppercase text-muted-foreground mb-1.5 block">Email</Label>
              <Input type="email" placeholder="you@example.com" value={form.customer_email} onChange={e => setForm(f => ({ ...f, customer_email: e.target.value }))} className="bg-secondary/50 border-border/40" />
            </div>
            <div>
              <Label className="font-body text-xs tracking-wider uppercase text-muted-foreground mb-1.5 block">Shipping Address *</Label>
              <Input placeholder="Street, City, State, Postcode" value={form.shipping_address} onChange={e => setForm(f => ({ ...f, shipping_address: e.target.value }))} className="bg-secondary/50 border-border/40" />
            </div>

            {/* PROMO CODE — fully connected */}
            <div>
              <Label className="font-body text-xs tracking-wider uppercase text-muted-foreground mb-1.5 block">Promo Code</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="Enter code"
                  value={promoCode}
                  onChange={e => { setPromoCode(e.target.value); setPromoError(null); if (promoValidated) setPromoValidated(null); }}
                  onKeyDown={e => e.key === 'Enter' && handleValidatePromo()}
                  className="bg-secondary/50 border-border/40"
                />
                {promoValidated ? (
                  <Button variant="outline" onClick={() => { setPromoValidated(null); setPromoCode(''); }} className="shrink-0">
                    <X className="w-4 h-4" />
                  </Button>
                ) : (
                  <Button variant="outline" onClick={handleValidatePromo} disabled={promoLoading || !promoCode.trim()} className="shrink-0">
                    {promoLoading ? <div className="w-4 h-4 border-2 border-muted-foreground/30 border-t-foreground rounded-full animate-spin" /> : 'Apply'}
                  </Button>
                )}
              </div>
              {promoValidated && (
                <div className="mt-2 flex items-center gap-2 text-green-400 text-xs font-body">
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>{promoValidated.code} applied — {discountPercent}% off eligible merch</span>
                </div>
              )}
              {promoError && (
                <p className="mt-2 text-xs text-destructive font-body flex items-center gap-1">
                  <X className="w-3 h-3" /> {promoError}
                </p>
              )}
            </div>

            <div className="bg-primary/5 border border-primary/20 rounded-xl p-4">
              <p className="font-body text-xs tracking-wider uppercase text-primary mb-3">Support the music 🤍 (optional)</p>
              <div className="flex gap-2 flex-wrap">
                {[0, 5, 10, 25].map(amount => (
                  <button
                    key={amount}
                    type="button"
                    onClick={() => setAddSupport(amount)}
                    className={`px-4 py-1.5 rounded-full font-body text-xs tracking-wider border transition-all ${
                      addSupport === amount ? 'border-primary bg-primary/20 text-primary' : 'border-border/50 text-muted-foreground hover:border-primary/30'
                    }`}
                  >
                    {amount === 0 ? 'No thanks' : `+$${amount}`}
                  </button>
                ))}
              </div>
            </div>

            {checkoutError && (
              <div className="flex items-start gap-2 p-3 bg-destructive/10 border border-destructive/30 rounded-xl">
                <AlertTriangle className="w-4 h-4 text-destructive shrink-0 mt-0.5" />
                <div>
                  <p className="font-body text-sm text-destructive font-medium">Checkout failed</p>
                  <p className="font-body text-xs text-muted-foreground mt-1">{checkoutError}</p>
                </div>
              </div>
            )}

            <Button
              onClick={handleCheckout}
              disabled={redirecting || !form.customer_name || !form.shipping_address}
              className="w-full rounded-full gradient-gold-button border-0 font-body text-sm tracking-wider uppercase gap-2"
            >
              {redirecting ? (
                <>
                  <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  Redirecting to secure payment…
                </>
              ) : (
                <>
                  <ExternalLink className="w-4 h-4" />
                  Pay ${total.toFixed(2)} AUD — Secure Checkout
                </>
              )}
            </Button>

            <p className="font-body text-xs text-muted-foreground text-center">
              🔒 Payments processed securely by Stripe. Your card details are never stored by us.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}