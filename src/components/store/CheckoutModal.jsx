import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { ShoppingBag, CheckCircle2, Tag, X, ArrowLeft, Minus, Plus } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import StripePaymentForm from './StripePaymentForm';

// Pricing constants
const GST_RATE = 0.10;
const FEE_RATE = 0.05;
const SHIPPING_CD = 15;
const SHIPPING_OTHER = 20;

function calcPricing(basePrice, category, discountPercent = 0) {
  const shipping = category === 'cd' ? SHIPPING_CD : SHIPPING_OTHER;
  const discounted = basePrice * (1 - discountPercent / 100);
  const subtotal = discounted + shipping;
  const gst = subtotal * GST_RATE;
  const fee = subtotal * FEE_RATE;
  const total = subtotal + gst + fee;
  return { discounted, shipping, gst, fee, total, discount: basePrice - discounted };
}

export default function CheckoutModal({ product, onClose }) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [step, setStep] = useState('details'); // 'details' | 'payment' | 'done'
  const [selectedSize, setSelectedSize] = useState('');
  const [form, setForm] = useState({ customer_name: '', customer_email: '', shipping_address: '' });

  // Promo code state
  const [promoInput, setPromoInput] = useState('');
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [promoLoading, setPromoLoading] = useState(false);

  const [quantity, setQuantity] = useState(1);
  const [addSupport, setAddSupport] = useState(0);
  const hasSize = product.sizes_available?.length > 0;
  const basePricing = calcPricing(product.price * quantity, product.category, appliedPromo?.discount_percent || 0);
  const pricing = { ...basePricing, total: basePricing.total + addSupport };

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

  const removePromo = () => {
    setAppliedPromo(null);
    setPromoInput('');
  };

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
    setStep('payment');
  };

  const handlePaymentSuccess = async (paymentIntent) => {
    await base44.entities.MerchOrder.create({
      customer_name: form.customer_name,
      customer_email: form.customer_email,
      shipping_address: form.shipping_address,
      items: [{ product_id: product.id, product_name: product.name, size: selectedSize, quantity, price: product.price }],
      total_amount: pricing.total,
      promo_code: appliedPromo?.code || null,
      notes: appliedPromo
        ? `Promo: ${appliedPromo.code} (${appliedPromo.discount_percent}% off) | Stripe: ${paymentIntent.id}`
        : `Stripe: ${paymentIntent.id}`,
      status: 'confirmed',
    });
    queryClient.invalidateQueries({ queryKey: ['orders'] });
    setStep('done');
  };

  const handlePaymentError = (message) => {
    toast({ title: message || 'Payment failed. Please try again.', variant: 'destructive' });
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="bg-card border-border/40 max-w-md max-h-[90vh] overflow-y-auto">

        {/* SUCCESS */}
        {step === 'done' && (
          <div className="text-center py-8 space-y-4">
            <CheckCircle2 className="w-14 h-14 text-primary mx-auto" />
            <h3 className="font-display text-2xl text-foreground">Order Confirmed!</h3>
            <p className="font-body text-sm text-muted-foreground leading-relaxed">
              Payment successful! You'll receive a confirmation email shortly. Your order will ship before June 9, 2026.
            </p>
            <Button onClick={onClose} className="rounded-full gradient-gold-button border-0 font-body text-sm tracking-wider uppercase">
              Done
            </Button>
          </div>
        )}

        {/* DETAILS STEP */}
        {step === 'details' && (
          <>
            <DialogHeader>
              <DialogTitle className="font-display text-2xl text-foreground">Order Details</DialogTitle>
              <p className="font-body text-sm text-muted-foreground">{product.name} — <span className="gradient-gold-glow">${product.price?.toFixed(2)}</span></p>
            </DialogHeader>

            <form onSubmit={handleDetailsSubmit} className="space-y-4 mt-2">
              {hasSize && (
                <div>
                  <Label className="font-body text-xs tracking-wider uppercase text-muted-foreground mb-2 block">Size *</Label>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes_available.map(s => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setSelectedSize(s)}
                        className={`px-3 py-1.5 rounded-lg border font-body text-sm transition-all ${
                          selectedSize === s
                            ? 'border-primary bg-primary/10 text-primary'
                            : 'border-border/50 text-muted-foreground hover:border-primary/30'
                        }`}
                      >
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

              {/* Quantity */}
              <div>
                <Label className="font-body text-xs tracking-wider uppercase text-muted-foreground mb-1.5 block">Quantity</Label>
                <div className="flex items-center gap-3">
                  <button type="button" onClick={() => setQuantity(q => Math.max(1, q - 1))} className="w-8 h-8 rounded-full border border-border/50 flex items-center justify-center hover:border-primary/50 transition-colors">
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="font-body text-sm text-foreground w-4 text-center">{quantity}</span>
                  <button type="button" onClick={() => setQuantity(q => Math.min(10, q + 1))} className="w-8 h-8 rounded-full border border-border/50 flex items-center justify-center hover:border-primary/50 transition-colors">
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
              </div>

              <div>
                <Label className="font-body text-xs tracking-wider uppercase text-muted-foreground mb-1.5 block">Shipping Address *</Label>
                <Input placeholder="Street, City, State, Postcode" value={form.shipping_address} onChange={e => setForm(f => ({ ...f, shipping_address: e.target.value }))} className="bg-secondary/50 border-border/40" />
              </div>

              {/* Promo Code */}
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
                    <Input
                      placeholder="e.g. LAUNCH15"
                      value={promoInput}
                      onChange={e => setPromoInput(e.target.value.toUpperCase())}
                      className="bg-secondary/50 border-border/40 font-body tracking-widest uppercase"
                      onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), applyPromo())}
                    />
                    <Button type="button" variant="outline" onClick={applyPromo} disabled={promoLoading} className="shrink-0">
                      {promoLoading ? '...' : 'Apply'}
                    </Button>
                  </div>
                )}
              </div>

              {/* Support add-on */}
              <div className="bg-primary/5 border border-primary/20 rounded-xl p-4">
                <p className="font-body text-xs tracking-wider uppercase text-primary mb-3">Add a contribution to support the music 🤍</p>
                <div className="flex gap-2 flex-wrap">
                  {[0, 5, 10, 25].map(amount => (
                    <button
                      key={amount}
                      type="button"
                      onClick={() => setAddSupport(amount)}
                      className={`px-4 py-1.5 rounded-full font-body text-xs tracking-wider border transition-all ${
                        addSupport === amount
                          ? 'border-primary bg-primary/20 text-primary'
                          : 'border-border/50 text-muted-foreground hover:border-primary/30'
                      }`}
                    >
                      {amount === 0 ? 'No thanks' : `+$${amount}`}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="bg-secondary/40 rounded-xl p-4 space-y-2 text-sm font-body">
                <div className="flex justify-between text-foreground/70">
                  <span>Item{quantity > 1 ? ` × ${quantity}` : ''}</span>
                  <span>${(product.price * quantity).toFixed(2)}</span>
                </div>
                {appliedPromo && (
                  <div className="flex justify-between text-primary">
                    <span>Discount ({appliedPromo.discount_percent}%)</span>
                    <span>−${pricing.discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-foreground/70">
                  <span>Shipping</span>
                  <span>${pricing.shipping.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-foreground/70">
                  <span>GST (10%)</span>
                  <span>${pricing.gst.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-foreground/70">
                  <span>Service & handling (5%)</span>
                  <span>${pricing.fee.toFixed(2)}</span>
                </div>
                {addSupport > 0 && (
                  <div className="flex justify-between text-primary">
                    <span>Support contribution</span>
                    <span>+${addSupport.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between font-semibold text-foreground border-t border-border/40 pt-2">
                  <span>Total</span>
                  <span className="gradient-gold-glow">${pricing.total.toFixed(2)}</span>
                </div>
              </div>

              <Button type="submit" className="w-full rounded-full gradient-gold-button border-0 font-body text-sm tracking-wider uppercase">
                <ShoppingBag className="w-4 h-4 mr-2" /> Continue to Payment — ${pricing.total.toFixed(2)}
              </Button>
            </form>
          </>
        )}

        {/* PAYMENT STEP */}
        {step === 'payment' && (
          <>
            <DialogHeader>
              <DialogTitle className="font-display text-2xl text-foreground">Payment</DialogTitle>
              <p className="font-body text-sm text-muted-foreground">{product.name} — <span className="gradient-gold-glow">${pricing.total.toFixed(2)} AUD</span></p>
            </DialogHeader>

            <button
              onClick={() => setStep('details')}
              className="flex items-center gap-1.5 font-body text-xs text-muted-foreground hover:text-foreground transition-colors mt-1"
            >
              <ArrowLeft className="w-3 h-3" /> Back to details
            </button>

            <div className="mt-4">
              <StripePaymentForm
                amount={pricing.total}
                customerEmail={form.customer_email}
                customerName={form.customer_name}
                productName={product.name}
                metadata={{
                  product_id: product.id,
                  size: selectedSize,
                  shipping_address: form.shipping_address,
                  promo_code: appliedPromo?.code || '',
                }}
                onSuccess={handlePaymentSuccess}
                onError={handlePaymentError}
              />
            </div>

            <p className="font-body text-xs text-muted-foreground text-center mt-2">
              🔒 Payments secured by Stripe
            </p>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}