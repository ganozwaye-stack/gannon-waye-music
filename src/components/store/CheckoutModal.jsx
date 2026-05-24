import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { ShoppingBag, Tag, X, ArrowLeft, Minus, Plus, ExternalLink, RefreshCw, AlertTriangle } from 'lucide-react';

const AU_SHIPPING_FLAT = 12.95;
const FREE_SHIPPING_THRESHOLD = 150;
const DIGITAL_CATEGORIES = ['digital', 'support', 'donation'];

function isInternational(address) {
  if (!address) return false;
  const lower = address.toLowerCase();
  return ['usa', 'united states', 'uk', 'united kingdom', 'canada', 'new zealand', 'nz', 'europe', 'india', 'singapore'].some(k => lower.includes(k));
}

function calcPricing(basePrice, category, discountPercent = 0, shippingAddress = '') {
  const isDigital = DIGITAL_CATEGORIES.includes((category || '').toLowerCase());
  const discounted = basePrice * (1 - discountPercent / 100);
  const discount = basePrice - discounted;
  let shipping = 0;
  let shippingLabel = 'Free';
  let internationalQuote = false;
  if (!isDigital) {
    if (isInternational(shippingAddress)) {
      shipping = 0;
      shippingLabel = 'Quote required';
      internationalQuote = true;
    } else if (discounted >= FREE_SHIPPING_THRESHOLD) {
      shippingLabel = 'Free (order ≥ $150)';
    } else {
      shipping = AU_SHIPPING_FLAT;
      shippingLabel = `$${AU_SHIPPING_FLAT.toFixed(2)} AUD`;
    }
  }
  const total = discounted + shipping;
  const gstIncluded = isDigital ? 0 : total / 11;
  return { discounted, discount, shipping, shippingLabel, internationalQuote, gstIncluded, total };
}

export default function CheckoutModal({ product, onClose }) {
  const { toast } = useToast();
  const [step, setStep] = useState('details');
  const [selectedSize, setSelectedSize] = useState('');
  const [form, setForm] = useState({ customer_name: '', customer_email: '', shipping_address: '' });
  const [promoInput, setPromoInput] = useState('');
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [promoLoading, setPromoLoading] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [addSupport, setAddSupport] = useState(0);
  const [redirecting, setRedirecting] = useState(false);
  const [checkoutError, setCheckoutError] = useState(null);

  const hasSize = product.sizes_available?.length > 0;
  const productPrice = product.sale_price ?? product.price ?? 0;
  const basePricing = calcPricing(productPrice * quantity, product.category, appliedPromo?.discount_percent || 0, form.shipping_address);
  const pricing = { ...basePricing, total: Number((basePricing.total + addSupport).toFixed(2)) };

  const applyPromo = async () => {
    if (!promoInput.trim()) return;
    setPromoLoading(true);
    try {
      const res = await base44.functions.invoke('validatePromoCode', { code: promoInput.trim().toUpperCase() });
      if (res.data?.valid) {
        setAppliedPromo({ code: res.data.code, discount_percent: res.data.discount_percent, id: res.data.id });
        toast({ title: `${res.data.discount_percent}% discount applied!` });
      } else {
        toast({ title: res.data?.reason || 'Invalid or expired code', variant: 'destructive' });
      }
    } catch {
      toast({ title: 'Could not validate code. Try again.', variant: 'destructive' });
    }
    setPromoLoading(false);
  };

  const removePromo = () => { setAppliedPromo(null); setPromoInput(''); };

  const handleDetailsSubmit = (e) => {
    e.preventDefault();
    if (!form.customer_name || !form.customer_email || !form.shipping_address) {
      toast({ title: 'Please fill in all fields', variant: 'destructive' });
      return;
    }
    if (hasSize && !selectedSize) {
      toast({ title: 'Please select a size', variant: 'destructive' });
      return;
    }
    setCheckoutError(null);
    setStep('confirm');
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
          customerEmail: form.customer_email,
          customerName: form.customer_name,
          productName: product.name,
          amount: pricing.total,
          metadata: {
            product_id: product.id,
            product_category: product.category,
            sale_price: String(productPrice),
            size: selectedSize,
            quantity: String(quantity),
            shipping_address: form.shipping_address,
            promo_code: appliedPromo?.code || '',
            promo_id: appliedPromo?.id || '',
            promo_discount_percent: String(appliedPromo?.discount_percent || 0),
            add_support: String(addSupport),
            shipping_amount: String(pricing.internationalQuote ? 0 : pricing.shipping),
            gst_included: String(pricing.gstIncluded.toFixed(2)),
          },
        }),
        timeout,
      ]);

      if (res.data?.url) {
        window.location.href = res.data.url;
        // Leave redirecting=true — page is navigating away
      } else {
        throw new Error(res.data?.error || 'Checkout could not be prepared. Please try again.');
      }
    } catch (err) {
      setCheckoutError(err.message || 'Checkout failed. You have not been charged. Please try again.');
      setRedirecting(false);
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="bg-card border-border/40 max-w-md max-h-[90vh] overflow-y-auto">

        {/* DETAILS STEP */}
        {step === 'details' && (
          <>
            <DialogHeader>
              <DialogTitle className="font-display text-2xl text-foreground">Order Details</DialogTitle>
              <p className="font-body text-sm text-muted-foreground">{product.name} — <span className="gradient-gold-glow">${productPrice.toFixed(2)}</span></p>
            </DialogHeader>

            <form onSubmit={handleDetailsSubmit} className="space-y-4 mt-2">
              {hasSize && (
                <div>
                  <Label className="font-body text-xs tracking-wider uppercase text-muted-foreground mb-2 block">Size *</Label>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes_available.map(s => (
                      <button key={s} type="button" onClick={() => setSelectedSize(s)}
                        className={`px-3 py-1.5 rounded-lg border font-body text-sm transition-all ${selectedSize === s ? 'border-primary bg-primary/10 text-primary' : 'border-border/50 text-muted-foreground hover:border-primary/30'}`}>
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <Label className="font-body text-xs tracking-wider uppercase text-muted-foreground mb-1.5 block">Full Name *</Label>
                <Input placeholder="Your name" value={form.customer_name} onChange={e => setForm(f => ({ ...f, customer_name: e.target.value }))} className="bg-secondary/50 border-border/40" />
              </div>
              <div>
                <Label className="font-body text-xs tracking-wider uppercase text-muted-foreground mb-1.5 block">Email *</Label>
                <Input type="email" placeholder="you@example.com" value={form.customer_email} onChange={e => setForm(f => ({ ...f, customer_email: e.target.value }))} className="bg-secondary/50 border-border/40" />
              </div>

              <div>
                <Label className="font-body text-xs tracking-wider uppercase text-muted-foreground mb-1.5 block">Quantity</Label>
                <div className="flex items-center gap-3">
                  <button type="button" onClick={() => setQuantity(q => Math.max(1, q - 1))} className="w-8 h-8 rounded-full border border-border/50 flex items-center justify-center hover:border-primary/50 transition-colors"><Minus className="w-3 h-3" /></button>
                  <span className="font-body text-sm text-foreground w-4 text-center">{quantity}</span>
                  <button type="button" onClick={() => setQuantity(q => Math.min(10, q + 1))} className="w-8 h-8 rounded-full border border-border/50 flex items-center justify-center hover:border-primary/50 transition-colors"><Plus className="w-3 h-3" /></button>
                </div>
              </div>

              <div>
                <Label className="font-body text-xs tracking-wider uppercase text-muted-foreground mb-1.5 block">Shipping Address *</Label>
                <Input placeholder="Street, City, State, Postcode" value={form.shipping_address} onChange={e => setForm(f => ({ ...f, shipping_address: e.target.value }))} className="bg-secondary/50 border-border/40" />
              </div>

              <div>
                <Label className="font-body text-xs tracking-wider uppercase text-muted-foreground mb-1.5 block">Promo Code</Label>
                {appliedPromo ? (
                  <div className="flex items-center justify-between bg-primary/10 border border-primary/30 rounded-lg px-3 py-2">
                    <div className="flex items-center gap-2">
                      <Tag className="w-4 h-4 text-primary" />
                      <span className="font-body text-sm text-primary font-medium">{appliedPromo.code}</span>
                      <span className="font-body text-xs text-primary/70">— {appliedPromo.discount_percent}% off</span>
                    </div>
                    <button type="button" onClick={removePromo}><X className="w-4 h-4 text-primary/60 hover:text-primary" /></button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <Input placeholder="e.g. LAUNCH15" value={promoInput} onChange={e => setPromoInput(e.target.value.toUpperCase())} className="bg-secondary/50 border-border/40 font-body tracking-widest uppercase" onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), applyPromo())} />
                    <Button type="button" variant="outline" onClick={applyPromo} disabled={promoLoading} className="shrink-0">{promoLoading ? '...' : 'Apply'}</Button>
                  </div>
                )}
              </div>

              <div className="bg-primary/5 border border-primary/20 rounded-xl p-4">
                <p className="font-body text-xs tracking-wider uppercase text-primary mb-3">Add a contribution to support the music 🤍</p>
                <div className="flex gap-2 flex-wrap">
                  {[0, 5, 10, 25].map(amount => (
                    <button key={amount} type="button" onClick={() => setAddSupport(amount)}
                      className={`px-4 py-1.5 rounded-full font-body text-xs tracking-wider border transition-all ${addSupport === amount ? 'border-primary bg-primary/20 text-primary' : 'border-border/50 text-muted-foreground hover:border-primary/30'}`}>
                      {amount === 0 ? 'No thanks' : `+$${amount}`}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="bg-secondary/40 rounded-xl p-4 space-y-2 text-sm font-body">
                <div className="flex justify-between text-foreground/70">
                  <span>Subtotal{quantity > 1 ? ` × ${quantity}` : ''}</span>
                  <span>${(productPrice * quantity).toFixed(2)}</span>
                </div>
                {appliedPromo && (
                  <div className="flex justify-between text-primary">
                    <span>Discount ({appliedPromo.discount_percent}%)</span>
                    <span>−${pricing.discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-foreground/70">
                  <span>Shipping (Australia)</span>
                  <span className={pricing.shipping === 0 && !pricing.internationalQuote ? 'text-green-400' : ''}>{pricing.internationalQuote ? 'Quote required' : pricing.shipping === 0 ? 'Free' : `$${pricing.shipping.toFixed(2)}`}</span>
                </div>
                {pricing.internationalQuote && <p className="text-xs text-amber-400">International shipping: we'll contact you with a quote before dispatch.</p>}
                {pricing.gstIncluded > 0 && (
                  <div className="flex justify-between text-muted-foreground text-xs">
                    <span>Includes GST</span><span>(${pricing.gstIncluded.toFixed(2)})</span>
                  </div>
                )}
                {addSupport > 0 && (
                  <div className="flex justify-between text-primary">
                    <span>Support contribution 🤍</span><span>+${addSupport.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between font-semibold text-foreground border-t border-border/40 pt-2">
                  <span>Total</span>
                  <span className="gradient-gold-glow">${pricing.total.toFixed(2)} AUD</span>
                </div>
              </div>

              <Button type="submit" className="w-full rounded-full gradient-gold-button border-0 font-body text-sm tracking-wider uppercase">
                <ShoppingBag className="w-4 h-4 mr-2" /> Continue to Payment — ${pricing.total.toFixed(2)}
              </Button>
            </form>
          </>
        )}

        {/* CONFIRM + REDIRECT STEP */}
        {step === 'confirm' && (
          <>
            <DialogHeader>
              <DialogTitle className="font-display text-2xl text-foreground">Confirm Order</DialogTitle>
              <p className="font-body text-sm text-muted-foreground">{product.name} — <span className="gradient-gold-glow">${pricing.total.toFixed(2)} AUD</span></p>
            </DialogHeader>

            <button onClick={() => setStep('details')} className="flex items-center gap-1.5 font-body text-xs text-muted-foreground hover:text-foreground transition-colors mt-1">
              <ArrowLeft className="w-3 h-3" /> Back to details
            </button>

            <div className="mt-4 space-y-4">
              {/* Order summary */}
              <div className="bg-secondary/40 rounded-xl p-4 space-y-2 text-sm font-body">
                <div className="flex justify-between text-foreground/70"><span>Name</span><span>{form.customer_name}</span></div>
                <div className="flex justify-between text-foreground/70"><span>Email</span><span className="truncate ml-4">{form.customer_email}</span></div>
                {selectedSize && <div className="flex justify-between text-foreground/70"><span>Size</span><span>{selectedSize}</span></div>}
                <div className="flex justify-between text-foreground/70"><span>Quantity</span><span>{quantity}</span></div>
                {appliedPromo && <div className="flex justify-between text-primary"><span>Promo</span><span>{appliedPromo.code} ({appliedPromo.discount_percent}% off)</span></div>}
                <div className="flex justify-between font-semibold text-foreground border-t border-border/40 pt-2">
                  <span>Total</span>
                  <span className="gradient-gold-glow">${pricing.total.toFixed(2)} AUD</span>
                </div>
              </div>

              {checkoutError && (
                <div className="flex items-start gap-2 p-3 bg-destructive/10 border border-destructive/30 rounded-xl">
                  <AlertTriangle className="w-4 h-4 text-destructive shrink-0 mt-0.5" />
                  <div>
                    <p className="font-body text-sm text-destructive font-medium">Checkout failed</p>
                    <p className="font-body text-xs text-muted-foreground mt-1">{checkoutError}</p>
                    <p className="font-body text-xs text-muted-foreground mt-1">You have <strong>not</strong> been charged.</p>
                  </div>
                </div>
              )}

              <div className="bg-secondary/30 border border-border/40 rounded-xl p-3 text-center">
                <p className="font-body text-xs text-foreground/70 leading-relaxed">
                  🔒 You'll be redirected to Stripe's secure checkout page to enter your payment details.
                </p>
              </div>

              {checkoutError ? (
                <Button onClick={handleCheckout} disabled={redirecting} className="w-full rounded-full gradient-gold-button border-0 font-body text-sm tracking-wider uppercase gap-2">
                  <RefreshCw className="w-4 h-4" /> Try Again
                </Button>
              ) : (
                <Button onClick={handleCheckout} disabled={redirecting} className="w-full rounded-full gradient-gold-button border-0 font-body text-sm tracking-wider uppercase gap-2">
                  {redirecting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                      Redirecting to secure payment…
                    </>
                  ) : (
                    <>
                      <ExternalLink className="w-4 h-4" />
                      Pay ${pricing.total.toFixed(2)} AUD — Secure Checkout
                    </>
                  )}
                </Button>
              )}

              <p className="font-body text-xs text-muted-foreground text-center">
                🔒 Payments processed securely by Stripe. Your card details are never stored by us.
              </p>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}