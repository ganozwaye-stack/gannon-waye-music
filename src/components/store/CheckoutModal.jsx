import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { ShoppingBag, CheckCircle2 } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';

export default function CheckoutModal({ product, onClose }) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedSize, setSelectedSize] = useState('');
  const [form, setForm] = useState({ customer_name: '', customer_email: '', shipping_address: '' });

  const hasSize = product.sizes_available?.length > 0;

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
      total_amount: product.price,
      status: 'pending',
    });
    queryClient.invalidateQueries({ queryKey: ['orders'] });
    setSubmitted(true);
    setLoading(false);
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="bg-card border-border/40 max-w-md">
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
                <Input
                  placeholder="Your name"
                  value={form.customer_name}
                  onChange={e => setForm(f => ({ ...f, customer_name: e.target.value }))}
                  className="bg-secondary/50 border-border/40"
                />
              </div>

              <div>
                <Label className="font-body text-xs tracking-wider uppercase text-muted-foreground mb-1.5 block">Email *</Label>
                <Input
                  type="email"
                  placeholder="you@example.com"
                  value={form.customer_email}
                  onChange={e => setForm(f => ({ ...f, customer_email: e.target.value }))}
                  className="bg-secondary/50 border-border/40"
                />
              </div>

              <div>
                <Label className="font-body text-xs tracking-wider uppercase text-muted-foreground mb-1.5 block">Shipping Address *</Label>
                <Input
                  placeholder="Street, City, State, Postcode"
                  value={form.shipping_address}
                  onChange={e => setForm(f => ({ ...f, shipping_address: e.target.value }))}
                  className="bg-secondary/50 border-border/40"
                />
              </div>

              <p className="font-body text-xs text-muted-foreground leading-relaxed">
                ⚠️ This is a preorder. Payment will not be charged until 1 June 2026. You'll receive an email confirmation.
              </p>

              <Button
                type="submit"
                disabled={loading}
                className="w-full rounded-full gradient-gold-button border-0 font-body text-sm tracking-wider uppercase"
              >
                <ShoppingBag className="w-4 h-4 mr-2" />
                {loading ? 'Placing Preorder...' : 'Confirm Preorder'}
              </Button>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}