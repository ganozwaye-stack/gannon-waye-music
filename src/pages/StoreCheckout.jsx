import { useState, useEffect } from 'react';
import { useCartStore } from '@/lib/cartStore';
import { base44 } from '@/api/base44Client';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft, AlertTriangle, CheckCircle, X,
  Tag, Info, Minus, Plus, Trash2, Pencil, Lock,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

const DETAILS_KEY = 'gannon_checkout_details_v1';

const NO_SHIPPING_CATS = ['digital', 'support', 'donation', 'song', 'music', 'digital_music'];
const INELIGIBLE_DISCOUNT_CATS = ['cd', 'vinyl', 'song', 'digital', 'support', 'donation', 'shipping', 'music', 'limited_edition_music', 'digital_music', 'bundle', 'bundles'];
const BLOCKED_SYNTHETIC_PRODUCT_IDS = new Set(['mug-addon', 'poster-addon']);

function needsShipping(cat) { return !NO_SHIPPING_CATS.includes((cat || '').toLowerCase().trim()); }
function isEligible(cat) { const c = (cat || '').toLowerCase().trim(); return !INELIGIBLE_DISCOUNT_CATS.some(x => c.includes(x)); }

// Map merch category → shipping product type for rate lookup
function mapProductType(category) {
  const c = (category || '').toLowerCase().trim();
  if (c === 'vinyl') return 'vinyl';
  if (c === 'cd') return 'cd';
  if (c === 'bundle') return 'bundle';
  if (['apparel', 'accessories', 'poster'].includes(c)) return 'merch';
  return 'other';
}

// Local fallback if backend rate lookup fails
const FALLBACK_BASE = 12.95;
const FALLBACK_PER_EXTRA = 2.00;
const FALLBACK_FREE_THRESHOLD = 150;
function fallbackShipping(items, country) {
  const physical = items.filter(i => needsShipping(i.product?.category));
  if (physical.length === 0) return { amount: 0, label: 'Free (digital)', intl: false };
  const isIntl = country && country !== 'Australia';
  if (isIntl) return { amount: 0, label: 'International — quote required', intl: true };
  const subtotal = items.reduce((s, i) => s + (i.product?.sale_price ?? 0) * i.quantity, 0);
  if (subtotal >= FALLBACK_FREE_THRESHOLD) return { amount: 0, label: 'Free (order ≥ $150)', intl: false };
  const qty = physical.reduce((s, i) => s + i.quantity, 0);
  const amt = qty <= 1 ? FALLBACK_BASE : FALLBACK_BASE + (qty - 1) * FALLBACK_PER_EXTRA;
  return { amount: parseFloat(amt.toFixed(2)), label: `$${amt.toFixed(2)} AUD`, intl: false };
}

export default function StoreCheckout() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const rawItems = useCartStore(state => state.items);
  const items = Array.isArray(rawItems) ? rawItems : [];
  const { updateQuantity, removeItem } = useCartStore();
  const [hasHydrated, setHasHydrated] = useState(false);
  useEffect(() => {
    setHasHydrated(true);
  }, []);

  const [details, setDetails] = useState(null);
  const [promoCode, setPromoCode] = useState('');
  const [promo, setPromo] = useState(null);
  const [promoError, setPromoError] = useState(null);
  const [promoLoading, setPromoLoading] = useState(false);
  const [redirecting, setRedirecting] = useState(false);
  const [checkoutError, setCheckoutError] = useState(null);
  const [addSupport, setAddSupport] = useState(0);
  const [shipping, setShipping] = useState({ amount: 0, label: 'Calculating…', intl: false });

  useEffect(() => {
    try {
      const saved = localStorage.getItem(DETAILS_KEY);
      if (saved) setDetails(JSON.parse(saved));
    } catch {}
  }, []);

  // Fetch live shipping rate from backend (configurable rate rules)
  useEffect(() => {
    if (!hasHydrated || items.length === 0 || !details) return;

    const physical = items.filter(i => needsShipping(i.product?.category));
    if (physical.length === 0) {
      setShipping({ amount: 0, label: 'Free (digital)', intl: false });
      return;
    }

    const isIntl = details.country && details.country !== 'Australia';
    if (isIntl) {
      setShipping({ amount: 0, label: 'International — quote required', intl: true });
      return;
    }

    const cartTotal = items.reduce((s, i) => s + (i.product?.sale_price ?? 0) * i.quantity, 0);
    const totalQty = physical.reduce((s, i) => s + i.quantity, 0);
    const productType = mapProductType(physical[0]?.product?.category);

    let cancelled = false;
    setShipping(prev => ({ ...prev, label: 'Calculating…' }));

    base44.functions.invoke('calculateShippingRate', {
      destination: 'australia',
      product_type: productType,
      quantity: totalQty,
      cart_total: cartTotal,
    }).then(res => {
      if (cancelled) return;
      const data = res.data;
      if (data && data.shipping_cost !== null && data.shipping_cost !== undefined) {
        setShipping({
          amount: parseFloat(data.shipping_cost),
          label: data.free_shipping ? 'Free (threshold reached)' : `$${parseFloat(data.shipping_cost).toFixed(2)} AUD`,
          intl: false,
        });
      } else {
        setShipping(fallbackShipping(items, details.country));
      }
    }).catch(() => {
      if (!cancelled) setShipping(fallbackShipping(items, details.country));
    });

    return () => { cancelled = true; };
  }, [hasHydrated, items, details]);

  // Redirect if no details filled
  useEffect(() => {
    if (!hasHydrated) return;
    if (items.length === 0) return; // handled below
    if (details !== null && !details.full_name) navigate('/store/cart-details');
  }, [hasHydrated, details, items.length, navigate]);

  const discountPercent = promo?.discount_percent || 0;
  const isOwnerOverride = promo?.is_owner_override === true;
  const freeShipping = promo?.free_shipping === true;
  const hasPhysicalItems = items.some(i => needsShipping(i.product?.category));
  const isInternationalQuoteRequired = hasPhysicalItems && details?.country && details.country !== 'Australia';
  const hasBlockedSyntheticItems = items.some(i =>
    BLOCKED_SYNTHETIC_PRODUCT_IDS.has(i.product_id) || BLOCKED_SYNTHETIC_PRODUCT_IDS.has(i.product?.id)
  );

  // Per-item cent-level math — mirrors createCheckoutSession backend exactly
  const subtotalCents = items.reduce((s, i) => s + Math.round((i.product?.sale_price ?? 0) * 100) * i.quantity, 0);
  const merchTotalCents = items.reduce((s, i) => {
    const eligible = isOwnerOverride || isEligible(i.product?.category);
    const price = i.product?.sale_price ?? 0;
    const discountedPerUnit = eligible && promo
      ? price * (1 - discountPercent / 100)
      : price;
    const unitAmountCents = Math.max(50, Math.round(discountedPerUnit * 100));
    return s + unitAmountCents * i.quantity;
  }, 0);
  const discountAmountCents = subtotalCents - merchTotalCents;

  const subtotal = subtotalCents / 100;
  const discountAmount = discountAmountCents / 100;
  const shippingAmount = freeShipping ? 0 : shipping.amount;
  const total = (merchTotalCents + Math.round(shippingAmount * 100) + Math.round(addSupport * 100)) / 100;

  const handleValidatePromo = async () => {
    if (!promoCode.trim()) return;
    setPromoLoading(true);
    setPromoError(null);
    setPromo(null);
    try {
      const res = await base44.functions.invoke('validatePromoCode', {
        code: promoCode.trim(),
        email: details?.email || undefined,
        cart_items: items.map(i => ({
          product_id: i.product.id,
          product_name: i.product.name,
          price: i.product.sale_price ?? 0,
          quantity: i.quantity,
          category: i.product.category || '',
        })),
      });
      if (!res.data?.valid) {
        setPromoError(res.data?.reason || 'This code is not valid.');
      } else {
        setPromo(res.data);
        toast({ title: `✅ ${res.data.code} applied — ${res.data.discount_percent}% off ${res.data.is_owner_override ? 'all items' : 'eligible merch'}${res.data.free_shipping ? ' + free shipping' : ''}` });
      }
    } catch {
      setPromoError('Could not validate code. Please try again.');
    }
    setPromoLoading(false);
  };

  const handlePay = async () => {
    if (redirecting) return;
    if (isInternationalQuoteRequired) {
      setCheckoutError('International delivery needs a shipping quote before payment. Please contact Gannon or change the delivery country to Australia before checkout.');
      return;
    }
    if (hasBlockedSyntheticItems) {
      setCheckoutError('One or more add-on items are no longer approved for checkout. Please remove them from the cart and add the real mug or poster product instead.');
      return;
    }
    setRedirecting(true);
    setCheckoutError(null);

    // Stage customer record
    try {
      await base44.entities.StoreCustomer.create({
        full_name: details.full_name,
        email: details.email,
        mobile: details.mobile,
        street_address: details.street_address,
        suburb: details.suburb,
        state: details.state,
        postcode: details.postcode,
        country: details.country,
        dob: details.dob || undefined,
        business_name: details.business_name || undefined,
        abn: details.abn || undefined,
        marketing_opt_in: details.marketing_opt_in || false,
        order_support_consent: details.order_support_consent !== false,
        source: 'store_checkout',
      });
    } catch (_) {
      // Non-blocking — continue to Stripe even if customer record fails
    }

    const timeout = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Checkout timed out. Please try again.')), 15000)
    );
    try {
      const res = await Promise.race([
        base44.functions.invoke('createCheckoutSession', {
          customerEmail: details.email || undefined,
          customerName: details.full_name,
          metadata: {
            items: JSON.stringify(items.map(i => ({
              product_id: i.product.id,
              product_name: i.product.name,
              price: i.product.sale_price ?? 0,
              quantity: i.quantity,
              size: i.size || '',
              category: i.product.category || '',
            }))),
            shipping_address: `${details.street_address}, ${details.suburb} ${details.state} ${details.postcode}, ${details.country}`,
            mobile: details.mobile,
            promo_code: promo?.code || '',
            promo_discount_percent: String(discountPercent),
            promo_free_shipping: String(freeShipping),
            promo_override: promo?.is_owner_override ? 'true' : 'false',
            discount_amount: String(discountAmount),
            add_support: String(addSupport),
            shipping_amount: String(shippingAmount),
          },
        }),
        timeout,
      ]);

      if (res.data?.url) {
        window.location.href = res.data.url;
      } else {
        throw new Error(res.data?.error || 'Checkout could not be prepared.');
      }
    } catch (err) {
      const realError = err?.response?.data?.friendly_message
        || err?.response?.data?.error
        || err?.message
        || 'Checkout failed. You have not been charged.';
      setCheckoutError(realError);
      setRedirecting(false);
    }
  };

  // Loading state
  if (!hasHydrated && items.length === 0) {
    return (
      <div className="min-h-screen py-24 px-4 flex items-center justify-center" data-testid="checkout-page">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin mx-auto"></div>
          <p className="font-body text-xs text-muted-foreground mt-4 tracking-widest uppercase">Loading Checkout…</p>
        </div>
      </div>
    );
  }

  // ─── Empty cart ───────────────────────────────────────────────────────────
  if (items.length === 0) {
    return (
      <div className="min-h-screen py-24 px-4">
        <div className="max-w-xl mx-auto text-center" data-testid="checkout-page">
          <p className="font-body text-lg text-muted-foreground mb-6">Your cart is empty.</p>
          <Button data-testid="empty-cart-return-store" onClick={() => navigate('/store')} variant="outline" className="rounded-full">
            Return to Store
          </Button>
        </div>
      </div>
    );
  }

  if (!details) {
    return (
      <div className="min-h-screen py-24 px-4 flex items-center justify-center">
        <div className="text-center">
          <p className="font-body text-sm text-muted-foreground mb-4">Loading your details…</p>
          <Button onClick={() => navigate('/store/cart-details')} className="rounded-full gradient-gold-button border-0">
            Enter Details
          </Button>
        </div>
      </div>
    );
  }

  const deliveryAddress = `${details.street_address}, ${details.suburb} ${details.state} ${details.postcode}, ${details.country}`;

  return (
    <div className="min-h-screen py-24 px-4 md:px-6" data-testid="checkout-page">
      <div className="max-w-4xl mx-auto">

        {/* Back */}
        <button onClick={() => navigate('/store')} className="flex items-center gap-2 font-body text-xs text-muted-foreground hover:text-foreground mb-8 transition-colors">
          <ArrowLeft className="w-3 h-3" /> Back to Store
        </button>

        {/* Progress */}
        <div className="flex items-center gap-2 mb-8">
          <div className="flex items-center gap-2 opacity-60">
            <div className="w-7 h-7 rounded-full bg-primary/40 text-primary-foreground flex items-center justify-center font-body text-xs">✓</div>
            <span className="font-body text-xs text-muted-foreground">Your Details</span>
          </div>
          <div className="flex-1 h-px bg-primary/30 mx-2" />
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-body text-xs font-bold">2</div>
            <span className="font-body text-xs text-primary">Review Order</span>
          </div>
          <div className="flex-1 h-px bg-border/40 mx-2" />
          <div className="flex items-center gap-2 opacity-40">
            <div className="w-7 h-7 rounded-full border border-border/50 flex items-center justify-center font-body text-xs">3</div>
            <span className="font-body text-xs text-muted-foreground">Payment</span>
          </div>
        </div>

        <h1 className="font-display text-3xl text-foreground mb-8">Review Your Order</h1>

        <div className="grid md:grid-cols-[1fr_380px] gap-8 items-start">

          {/* LEFT: Details + Items */}
          <div className="space-y-6">

            {/* Customer summary */}
            <div data-testid="checkout-customer-summary" className="bg-card/40 border border-border/30 rounded-2xl p-5">
              <div className="flex items-center justify-between mb-3">
                <p className="font-body text-xs tracking-widest uppercase text-muted-foreground">Contact Details</p>
                <button onClick={() => navigate('/store/cart-details')} className="flex items-center gap-1 font-body text-xs text-primary hover:underline">
                  <Pencil className="w-3 h-3" /> Edit
                </button>
              </div>
              <p className="font-body text-sm text-foreground">{details.full_name}</p>
              <p className="font-body text-xs text-muted-foreground">{details.email}</p>
              <p className="font-body text-xs text-muted-foreground">{details.mobile}</p>
            </div>

            {/* Delivery summary */}
            <div data-testid="checkout-delivery-summary" className="bg-card/40 border border-border/30 rounded-2xl p-5">
              <div className="flex items-center justify-between mb-3">
                <p className="font-body text-xs tracking-widest uppercase text-muted-foreground">Delivery Address</p>
                <button onClick={() => navigate('/store/cart-details')} className="flex items-center gap-1 font-body text-xs text-primary hover:underline">
                  <Pencil className="w-3 h-3" /> Edit
                </button>
              </div>
              <p className="font-body text-sm text-foreground">{deliveryAddress}</p>
            </div>

            {/* Cart items — editable */}
            <div data-testid="checkout-items" className="bg-card/40 border border-border/30 rounded-2xl p-5">
              <div className="flex items-center justify-between mb-4">
                <p className="font-body text-xs tracking-widest uppercase text-muted-foreground">Order Items</p>
                <button onClick={() => navigate('/store')} className="flex items-center gap-1 font-body text-xs text-primary hover:underline">
                  <Pencil className="w-3 h-3" /> Edit Cart
                </button>
              </div>

              <div className="space-y-4">
                {items.map((item, idx) => {
                  const price = item.product?.sale_price ?? 0;
                  return (
                    <motion.div
                      key={`${item.product_id}-${item.size || 'no-size'}-${idx}`}
                      data-testid="cart-line"
                      layout
                      className="flex gap-4 p-4 bg-secondary/30 rounded-xl border border-border/20"
                    >
                      <img
                        src={item.product?.image_url}
                        alt={item.product?.name}
                        className="w-20 h-20 object-cover rounded-lg bg-secondary/50 shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-display text-sm text-foreground line-clamp-2">{item.product?.name}</p>
                        <p className="font-body text-sm gradient-gold-glow mt-1">${(price * item.quantity).toFixed(2)} AUD</p>

                        {item.size && (
                          <p className="font-body text-xs text-muted-foreground mt-1">
                            Size: <strong>{item.size}</strong>
                          </p>
                        )}

                        {/* Size change for apparel */}
                        {item.product?.sizes_available?.length > 0 && (
                          <div className="mt-2">
                            <p className="font-body text-[10px] text-muted-foreground/60 mb-1">Change size:</p>
                            <div className="flex flex-wrap gap-1">
                              {item.product.sizes_available.map(s => (
                                <button
                                  key={s}
                                  data-testid="cart-line-size-select"
                                  onClick={() => {
                                    // Check if that size already exists — if so, merge, else update this line
                                    const existingOther = items.findIndex(
                                      (x, xi) => xi !== idx && x.product_id === item.product_id && x.size === s
                                    );
                                    if (existingOther >= 0) {
                                      // Merge into that line and remove this one
                                      updateQuantity(item.product_id, items[existingOther].quantity + item.quantity, s);
                                      removeItem(item.product_id, item.size);
                                    } else {
                                      // Just change the size on this line
                                      removeItem(item.product_id, item.size);
                                      useCartStore.getState().addItem(item.product, item.quantity, s);
                                    }
                                  }}
                                  className={`px-2 py-0.5 rounded font-body text-[10px] border transition-all ${
                                    item.size === s
                                      ? 'border-primary bg-primary/10 text-primary'
                                      : 'border-border/40 text-muted-foreground hover:border-primary/30'
                                  }`}
                                >
                                  {s}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}

                        <div className="flex items-center justify-between mt-3">
                          <div className="flex items-center gap-2">
                            <button
                              data-testid="cart-line-decrease"
                              onClick={() => updateQuantity(item.product_id, item.quantity - 1, item.size)}
                              className="w-7 h-7 rounded-full border border-border/50 flex items-center justify-center hover:border-primary/50 transition-colors"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="font-body text-sm text-foreground w-6 text-center">{item.quantity}</span>
                            <button
                              data-testid="cart-line-increase"
                              onClick={() => updateQuantity(item.product_id, item.quantity + 1, item.size)}
                              className="w-7 h-7 rounded-full border border-border/50 flex items-center justify-center hover:border-primary/50 transition-colors"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                          <button
                            data-testid="cart-line-remove"
                            onClick={() => removeItem(item.product_id, item.size)}
                            className="text-muted-foreground/50 hover:text-destructive transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* RIGHT: Totals + Pay */}
          <div className="space-y-5 md:sticky md:top-24">

            {/* Promo */}
            <div className="bg-card/40 border border-border/30 rounded-2xl p-5">
              <p className="font-body text-xs tracking-widest uppercase text-muted-foreground mb-3">Promo Code</p>
              <div className="flex gap-2">
                <input
                  data-testid="promo-code-input"
                  placeholder="Enter code"
                  value={promoCode}
                  onChange={e => { setPromoCode(e.target.value); setPromoError(null); if (promo) setPromo(null); }}
                  onKeyDown={e => e.key === 'Enter' && handleValidatePromo()}
                  className="flex-1 bg-secondary/50 border border-border/40 rounded-md px-3 py-2 font-body text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/40"
                />
                {promo ? (
                  <button onClick={() => { setPromo(null); setPromoCode(''); }} className="px-3 py-2 rounded-md border border-border/40 text-muted-foreground hover:text-foreground transition-colors">
                    <X className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    data-testid="apply-promo-code"
                    onClick={handleValidatePromo}
                    disabled={promoLoading || !promoCode.trim()}
                    className="px-4 py-2 rounded-md gradient-gold-button font-body text-xs tracking-wider uppercase disabled:opacity-50"
                  >
                    {promoLoading ? '...' : 'Apply'}
                  </button>
                )}
              </div>
              {promo && (
                <div className="mt-2 flex items-center gap-2 text-primary text-xs font-body">
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>{promo.code} — {discountPercent}% off {isOwnerOverride ? 'all items' : 'eligible merch'}{freeShipping ? ' + free shipping' : ''}</span>
                </div>
              )}
              {promoError && (
                <p className="mt-2 text-xs text-destructive font-body flex items-center gap-1">
                  <X className="w-3 h-3" /> {promoError}
                </p>
              )}
            </div>

            {/* Optional support */}
            <div className="bg-card/40 border border-border/30 rounded-2xl p-5">
              <p className="font-body text-xs tracking-widest uppercase text-muted-foreground mb-3">Add Support 🤍 (optional)</p>
              <div className="flex gap-2 flex-wrap">
                {[0, 5, 10, 25].map(amt => (
                  <button
                    key={amt}
                    onClick={() => setAddSupport(amt)}
                    className={`px-4 py-1.5 rounded-full font-body text-xs border transition-all ${
                      addSupport === amt ? 'border-primary bg-primary/20 text-primary' : 'border-border/50 text-muted-foreground hover:border-primary/30'
                    }`}
                  >
                    {amt === 0 ? 'No thanks' : `+$${amt}`}
                  </button>
                ))}
              </div>
            </div>

            {/* Totals */}
            <div className="bg-card/40 border border-border/30 rounded-2xl p-5 space-y-2">
              <div data-testid="checkout-subtotal" className="flex justify-between font-body text-sm text-foreground/70">
                <span>Subtotal</span><span>${subtotal.toFixed(2)}</span>
              </div>
              {promo && (
                <div className="flex justify-between font-body text-sm text-primary">
                  <span className="flex items-center gap-1"><Tag className="w-3 h-3" />{promo.code} ({discountPercent}%)</span>
                  <span>−${discountAmount.toFixed(2)}</span>
                </div>
              )}
              <div data-testid="checkout-shipping" className="flex justify-between font-body text-sm text-foreground/70">
                <span>Shipping</span>
                <span className={shippingAmount === 0 && !shipping.intl ? 'text-primary' : ''}>
                  {freeShipping ? 'Free (promo code)' : shipping.intl ? 'Quote required' : shipping.amount === 0 ? 'Free' : shipping.label}
                </span>
              </div>
              {addSupport > 0 && (
                <div className="flex justify-between font-body text-sm text-primary">
                  <span>Support 🤍</span><span>+${addSupport.toFixed(2)}</span>
                </div>
              )}
              {promo && !isOwnerOverride && (
                <div className="flex items-start gap-1.5 text-xs text-muted-foreground bg-secondary/30 rounded-lg px-3 py-2 mt-1">
                  <Info className="w-3 h-3 mt-0.5 shrink-0" />
                  <span>Shipping and CDs/vinyl are excluded from promo discounts.</span>
                </div>
              )}
              <div data-testid="checkout-total" className="flex justify-between font-display text-lg text-foreground border-t border-border/40 pt-3">
                <span>Total</span>
                <span className="gradient-gold-glow">${total.toFixed(2)} AUD</span>
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

            {isInternationalQuoteRequired && (
              <div data-testid="international-shipping-block" className="flex items-start gap-2 p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl">
                <AlertTriangle className="w-4 h-4 text-amber-300 shrink-0 mt-0.5" />
                <div>
                  <p className="font-body text-sm text-amber-200 font-medium">Shipping quote required</p>
                  <p className="font-body text-xs text-muted-foreground mt-1">
                    International orders are review-only for now. Payment is locked until postage is quoted and approved.
                  </p>
                </div>
              </div>
            )}

            {hasBlockedSyntheticItems && (
              <div data-testid="blocked-addon-checkout" className="flex items-start gap-2 p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl">
                <AlertTriangle className="w-4 h-4 text-amber-300 shrink-0 mt-0.5" />
                <div>
                  <p className="font-body text-sm text-amber-200 font-medium">Cart item needs review</p>
                  <p className="font-body text-xs text-muted-foreground mt-1">
                    Old add-on items are blocked until they are converted into real store products with stock and fulfilment rules.
                  </p>
                </div>
              </div>
            )}

            <Button
              data-testid="checkout-pay-button"
              onClick={handlePay}
              disabled={redirecting || items.length === 0 || isInternationalQuoteRequired || hasBlockedSyntheticItems}
              className="w-full rounded-full gradient-gold-button border-0 font-body text-sm tracking-wider uppercase py-6 gap-2"
            >
              {redirecting ? (
                <>
                  <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  Redirecting…
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  {isInternationalQuoteRequired
                    ? 'Shipping Quote Required'
                    : hasBlockedSyntheticItems
                      ? 'Remove Add-on Item'
                      : `Confirm & Pay $${total.toFixed(2)} AUD`}
                </>
              )}
            </Button>

            <p className="text-center font-body text-xs text-muted-foreground">
              🔒 Payments processed securely by Stripe. Your card details are never stored by us.
            </p>

            <div className="flex gap-3">
              <button onClick={() => navigate('/store/cart-details')} className="flex-1 text-center font-body text-xs text-muted-foreground hover:text-foreground transition-colors py-2">
                ← Edit Details
              </button>
              <button onClick={() => navigate('/store')} className="flex-1 text-center font-body text-xs text-muted-foreground hover:text-foreground transition-colors py-2">
                Exit Checkout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
