import { useEffect, useMemo, useState } from 'react';
import { useCartStore } from '@/lib/cartStore';
import { base44 } from '@/api/base44Client';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft, AlertTriangle, Minus, Plus, Trash2, Pencil, Lock,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const DETAILS_KEY = 'gannon_checkout_details_v1';

function itemAvailability(item) {
  const product = item?.product || {};
  if (item?.size && product.stock_by_variant && Number.isFinite(product.stock_by_variant[item.size])) {
    return Number(product.stock_by_variant[item.size]);
  }
  return Number(product.stock_quantity || 0);
}

export default function StoreCheckout() {
  const navigate = useNavigate();
  const rawItems = useCartStore(state => state.items);
  const items = Array.isArray(rawItems) ? rawItems : [];
  const { updateQuantity, removeItem } = useCartStore();

  const [hasHydrated, setHasHydrated] = useState(false);
  const [details, setDetails] = useState(null);
  const [redirecting, setRedirecting] = useState(false);
  const [checkoutError, setCheckoutError] = useState(null);
  const [shipping, setShipping] = useState({ status: 'loading', amount: 0, label: 'Calculating delivery...' });

  useEffect(() => setHasHydrated(true), []);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(DETAILS_KEY);
      if (saved) setDetails(JSON.parse(saved));
    } catch {
      setDetails(null);
    }
  }, []);

  useEffect(() => {
    if (!hasHydrated || items.length === 0 || !details) return;

    if (details.country !== 'Australia') {
      setShipping({ status: 'error', amount: 0, label: 'Current checkout is available within Australia only.' });
      return;
    }

    let cancelled = false;
    setShipping({ status: 'loading', amount: 0, label: 'Calculating delivery...' });

    base44.functions.invoke('calculateShippingRate', {
      destination: 'australia',
      cart_items: items.map(item => ({
        product_id: item.product_id,
        quantity: Number(item.quantity || 1),
        size: item.size || '',
      })),
    }).then(response => {
      if (cancelled) return;
      const data = response.data;
      if (!data || data.shipping_cost === null || data.shipping_cost === undefined) {
        throw new Error(data?.error || 'Delivery could not be calculated.');
      }
      const amount = Number(data.shipping_cost);
      setShipping({
        status: 'ready',
        amount,
        label: amount > 0 ? `$${amount.toFixed(2)} AUD` : 'No delivery charge',
      });
    }).catch(error => {
      if (cancelled) return;
      setShipping({
        status: 'error',
        amount: 0,
        label: error?.message || 'Delivery could not be calculated. Please try again.',
      });
    });

    return () => { cancelled = true; };
  }, [hasHydrated, items, details]);

  useEffect(() => {
    if (!hasHydrated) return;
    if (items.length === 0) return;
    if (details !== null && !details.full_name) navigate('/store/cart-details');
  }, [hasHydrated, details, items.length, navigate]);

  const subtotal = useMemo(() => items.reduce((sum, item) => {
    const price = Number(item.product?.sale_price ?? 0);
    return sum + price * Number(item.quantity || 0);
  }, 0), [items]);

  const total = subtotal + (shipping.status === 'ready' ? shipping.amount : 0);

  const handlePay = async () => {
    if (redirecting || shipping.status !== 'ready' || items.length === 0 || !details) return;
    setRedirecting(true);
    setCheckoutError(null);

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
        marketing_opt_in: details.marketing_opt_in || false,
        order_support_consent: details.order_support_consent !== false,
        source: 'store_checkout',
      });
    } catch {
      // Customer staging is helpful but must never create a duplicate charge.
    }

    const timeout = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Checkout timed out. You have not been charged. Please try again.')), 15000)
    );

    try {
      const response = await Promise.race([
        base44.functions.invoke('createCheckoutSession', {
          customerEmail: details.email,
          customerName: details.full_name,
          metadata: {
            items: JSON.stringify(items.map(item => ({
              product_id: item.product_id,
              quantity: Number(item.quantity || 1),
              size: item.size || '',
            }))),
            shipping_address: `${details.street_address}, ${details.suburb} ${details.state} ${details.postcode}, Australia`,
            shipping_country: 'Australia',
            mobile: details.mobile,
            displayed_shipping_amount: String(shipping.amount.toFixed(2)),
          },
        }),
        timeout,
      ]);

      if (!response.data?.url) {
        throw new Error(response.data?.friendly_message || response.data?.error || 'Checkout could not be prepared.');
      }

      window.location.href = response.data.url;
    } catch (error) {
      setCheckoutError(
        error?.response?.data?.friendly_message ||
        error?.response?.data?.error ||
        error?.message ||
        'Checkout failed. You have not been charged.'
      );
      setRedirecting(false);
    }
  };

  if (!hasHydrated && items.length === 0) {
    return (
      <div className="min-h-screen py-24 px-4 flex items-center justify-center" data-testid="checkout-page">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin mx-auto" />
          <p className="font-body text-xs text-muted-foreground mt-4 tracking-widest uppercase">Loading Checkout...</p>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen py-24 px-4">
        <div className="max-w-xl mx-auto text-center" data-testid="checkout-page">
          <p className="font-body text-lg text-muted-foreground mb-6">Your cart is empty.</p>
          <Button onClick={() => navigate('/store')} variant="outline" className="rounded-full">Return to Store</Button>
        </div>
      </div>
    );
  }

  if (!details) {
    return (
      <div className="min-h-screen py-24 px-4 flex items-center justify-center">
        <div className="text-center">
          <p className="font-body text-sm text-muted-foreground mb-4">Enter your delivery details before reviewing the order.</p>
          <Button onClick={() => navigate('/store/cart-details')} className="rounded-full gradient-gold-button border-0">Enter Details</Button>
        </div>
      </div>
    );
  }

  const deliveryAddress = `${details.street_address}, ${details.suburb} ${details.state} ${details.postcode}, Australia`;

  return (
    <div className="min-h-screen py-24 px-4 md:px-6" data-testid="checkout-page">
      <div className="max-w-4xl mx-auto">
        <button onClick={() => navigate('/store')} className="flex items-center gap-2 font-body text-xs text-muted-foreground hover:text-foreground mb-8 transition-colors">
          <ArrowLeft className="w-3 h-3" /> Back to Store
        </button>

        <div className="flex items-center gap-2 mb-8">
          <div className="flex items-center gap-2 opacity-60">
            <div className="w-7 h-7 rounded-full bg-primary/40 text-primary-foreground flex items-center justify-center font-body text-xs">1</div>
            <span className="font-body text-xs text-muted-foreground hidden sm:inline">Your Details</span>
          </div>
          <div className="flex-1 h-px bg-primary/30 mx-2" />
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-body text-xs font-bold">2</div>
            <span className="font-body text-xs text-primary hidden sm:inline">Review Order</span>
          </div>
          <div className="flex-1 h-px bg-border/40 mx-2" />
          <div className="flex items-center gap-2 opacity-40">
            <div className="w-7 h-7 rounded-full border border-border/50 flex items-center justify-center font-body text-xs">3</div>
            <span className="font-body text-xs text-muted-foreground hidden sm:inline">Secure Payment</span>
          </div>
        </div>

        <h1 className="font-display text-3xl text-foreground mb-8">Review Your Order</h1>

        <div className="grid md:grid-cols-[1fr_380px] gap-8 items-start">
          <div className="space-y-6">
            <div className="bg-card/40 border border-border/30 rounded-2xl p-5">
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

            <div className="bg-card/40 border border-border/30 rounded-2xl p-5">
              <div className="flex items-center justify-between mb-3">
                <p className="font-body text-xs tracking-widest uppercase text-muted-foreground">Delivery Address</p>
                <button onClick={() => navigate('/store/cart-details')} className="flex items-center gap-1 font-body text-xs text-primary hover:underline">
                  <Pencil className="w-3 h-3" /> Edit
                </button>
              </div>
              <p className="font-body text-sm text-foreground">{deliveryAddress}</p>
            </div>

            <div className="bg-card/40 border border-border/30 rounded-2xl p-5">
              <div className="flex items-center justify-between mb-4">
                <p className="font-body text-xs tracking-widest uppercase text-muted-foreground">Order Items</p>
                <button onClick={() => navigate('/store')} className="flex items-center gap-1 font-body text-xs text-primary hover:underline">
                  <Pencil className="w-3 h-3" /> Edit Cart
                </button>
              </div>

              <div className="space-y-4">
                {items.map((item, index) => {
                  const price = Number(item.product?.sale_price ?? 0);
                  const available = itemAvailability(item);
                  return (
                    <motion.div
                      key={`${item.product_id}-${item.size || 'no-size'}-${index}`}
                      layout
                      className="flex gap-4 p-4 bg-secondary/30 rounded-xl border border-border/20"
                    >
                      {item.product?.image_url && (
                        <img src={item.product.image_url} alt={item.product.name} className="w-20 h-20 object-cover rounded-lg bg-secondary/50 shrink-0" />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="font-display text-sm text-foreground line-clamp-2">{item.product?.name}</p>
                        <p className="font-body text-sm gradient-gold-glow mt-1">${(price * item.quantity).toFixed(2)} AUD</p>
                        {item.size && <p className="font-body text-xs text-muted-foreground mt-1">Size: <strong>{item.size}</strong></p>}

                        {item.product?.sizes_available?.length > 0 && (
                          <div className="mt-2">
                            <p className="font-body text-[10px] text-muted-foreground/60 mb-1">Change size:</p>
                            <div className="flex flex-wrap gap-1">
                              {item.product.sizes_available.map(size => {
                                const sizeStock = Number(item.product.stock_by_variant?.[size] ?? 0);
                                return (
                                  <button
                                    key={size}
                                    type="button"
                                    disabled={sizeStock <= 0}
                                    onClick={() => {
                                      const existingOther = items.findIndex((candidate, candidateIndex) =>
                                        candidateIndex !== index && candidate.product_id === item.product_id && candidate.size === size
                                      );
                                      if (existingOther >= 0) {
                                        updateQuantity(item.product_id, items[existingOther].quantity + item.quantity, size);
                                        removeItem(item.product_id, item.size);
                                      } else {
                                        removeItem(item.product_id, item.size);
                                        useCartStore.getState().addItem(item.product, item.quantity, size);
                                      }
                                    }}
                                    className={`px-2 py-0.5 rounded font-body text-[10px] border transition-all disabled:opacity-30 ${
                                      item.size === size
                                        ? 'border-primary bg-primary/10 text-primary'
                                        : 'border-border/40 text-muted-foreground hover:border-primary/30'
                                    }`}
                                  >
                                    {size} ({sizeStock})
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        )}

                        <div className="flex items-center justify-between mt-3">
                          <div className="flex items-center gap-2">
                            <button type="button" onClick={() => updateQuantity(item.product_id, item.quantity - 1, item.size)} className="w-7 h-7 rounded-full border border-border/50 flex items-center justify-center hover:border-primary/50 transition-colors">
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="font-body text-sm text-foreground w-6 text-center">{item.quantity}</span>
                            <button
                              type="button"
                              disabled={item.quantity >= available}
                              onClick={() => updateQuantity(item.product_id, item.quantity + 1, item.size)}
                              className="w-7 h-7 rounded-full border border-border/50 flex items-center justify-center hover:border-primary/50 transition-colors disabled:opacity-30"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                          <button type="button" onClick={() => removeItem(item.product_id, item.size)} className="text-muted-foreground/50 hover:text-destructive transition-colors">
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

          <div className="space-y-5 md:sticky md:top-24">
            <div className="bg-card/40 border border-border/30 rounded-2xl p-5 space-y-2">
              <div className="flex justify-between font-body text-sm text-foreground/70">
                <span>Products</span><span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-body text-sm text-foreground/70">
                <span>Delivery</span><span>{shipping.label}</span>
              </div>
              <div className="flex justify-between font-display text-lg text-foreground border-t border-border/40 pt-3">
                <span>Total</span><span className="gradient-gold-glow">${total.toFixed(2)} AUD</span>
              </div>
              <p className="font-body text-[11px] text-muted-foreground pt-2">
                Gannon Waye Music ABN 22 931 809 349. No GST is charged.
              </p>
            </div>

            {shipping.status === 'error' && (
              <div className="flex items-start gap-2 p-3 bg-destructive/10 border border-destructive/30 rounded-xl">
                <AlertTriangle className="w-4 h-4 text-destructive shrink-0 mt-0.5" />
                <p className="font-body text-xs text-muted-foreground">{shipping.label}</p>
              </div>
            )}

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
              data-testid="checkout-pay-button"
              onClick={handlePay}
              disabled={redirecting || shipping.status !== 'ready' || items.length === 0}
              className="w-full rounded-full gradient-gold-button border-0 font-body text-sm tracking-wider uppercase py-6 gap-2"
            >
              {redirecting ? (
                <>
                  <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  Redirecting...
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  Confirm and Pay ${total.toFixed(2)} AUD
                </>
              )}
            </Button>

            <p className="text-center font-body text-xs text-muted-foreground">
              Payments are processed securely by Stripe. Your card details are not stored by this site.
            </p>

            <div className="flex gap-3">
              <button onClick={() => navigate('/store/cart-details')} className="flex-1 text-center font-body text-xs text-muted-foreground hover:text-foreground transition-colors py-2">Edit Details</button>
              <button onClick={() => navigate('/store')} className="flex-1 text-center font-body text-xs text-muted-foreground hover:text-foreground transition-colors py-2">Exit Checkout</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
