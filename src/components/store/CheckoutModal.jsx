import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { ShoppingBag, CheckCircle2, Tag, X } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';

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
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedSize, setSelectedSize] = useState('');
  const [form, setForm] = useState({ customer_name: '', customer_email: '', shipping_address: '' });

  // Promo code state
  const [promoInput, setPromoInput] = useState('');
  const [appliedPromo, setAppliedPromo] = useState(null); // { code, discount_percent, id }
  const [promoLoading, setPromoLoading] = useState(false);

  const hasSize = product.sizes_available?.length > 0;
  const pricing = calcPricing(product.price, product.category, appliedPromo?.discount_percent || 0);

  const applyPromo = async () => {
    if (!promoInput.trim()) return;
    setPromoLoading(true);
    // PromoCode is admin-only read — use a backend-safe approach via service role isn't available on frontend
    // So we validate by calling the public-readable fields indirectly:
    // Since PromoCode RLS is admin-only, we use InvokeLLM? No — we need a backend function.
    // Instead: store the raw code locally and validate at order submission time via a backend function.
    // For now we do a simple frontend lookup by fetching all (will fail for non-admins due to RLS)
    // We'll build a lightweight validatePromo backend function call.
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.customer_name || !form.customer_email || !form.shipping_address) {
      toast({ title: 'Please fill in all fields', variant: 'destructive' });
      return;
    }
    if (hasSize && !selectedSize) {
      toast({ title: 'Please select a size', variant: 'destructive' });
      return;
    }
    setLoading(true);
    await base44.entities.MerchOrder.create({
      customer_name: form.customer_name,
      customer_email: form.customer_email,
      shipping_address: form.shipping_address,
      items: [{ product_id: product.id, product_name: product.name, size: selectedSize, quantity: 1, price: product.price }],
      total_amount: pricing.total,
      promo_code: appliedPromo?.code || null,
      notes: appliedPromo ? `Promo: ${appliedPromo.code} (${appliedPromo.discount_percent}% off)` : '',
      status: 'pending',
    });
    // Increment promo times_used if applied
    if (appliedPromo?.id) {
      // Handled server-side by validatePromoCode function
    }
    queryClient.invalidateQueries({ queryKey: ['orders'] });
    setSubmitted(true);
    setLoading(false);
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="bg-card border-border/40 max-w-md max-h-[90vh] overflow-y-auto">
        {submitted ? (
          <div className="text-center py-8 space-y-4">
            <CheckCircle2 className="w-14 h-14 text-primary mx-auto" />
            <h3 className="font-display text-2xl text-foreground">Preorder Confirmed!</h3>
            <p className="font-body text-sm text-muted-foreground leading-relaxed">
              You'll receive a confirmation email shortly. Payment won't be charged until <strong className="text-foreground">1 June 2026</strong>.
            </p>
            <Button onClick={onClose} className="rounded-full gradient-gold-button border-0 font-body text-sm tracking-wider uppercase">
              Done
            </Button>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="font-display text-2xl text-foreground">Preorder</DialogTitle>
              <p className="font-body text-sm text-muted-foreground">{product.name} — <span className="gradient-gold-glow">${product.price?.toFixed(2)}</span></p>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4 mt-2">
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
                      placeholder="Enter code e.g. LAUNCH15"
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

              {/* Price Breakdown */}
              <div className="bg-secondary/40 rounded-xl p-4 space-y-2 text-sm font-body">
                <div className="flex justify-between text-foreground/70">
                  <span>Item</span>
                  <span>${product.price?.toFixed(2)}</span>
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
                <div className="flex justify-between font-semibold text-foreground border-t border-border/40 pt-2">
                  <span>Total</span>
                  <span className="gradient-gold-glow">${pricing.total.toFixed(2)}</span>
                </div>
              </div>

              <p className="font-body text-xs text-muted-foreground leading-relaxed">
                ⚠️ This is a preorder. Payment will not be charged until 1 June 2026. You'll receive an email confirmation.
              </p>

              <Button type="submit" disabled={loading} className="w-full rounded-full gradient-gold-button border-0 font-body text-sm tracking-wider uppercase">
                <ShoppingBag className="w-4 h-4 mr-2" />
                {loading ? 'Placing Preorder...' : `Confirm Preorder — $${pricing.total.toFixed(2)}`}
              </Button>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}