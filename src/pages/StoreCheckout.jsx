import { useState } from 'react';
import { useCartStore } from '@/lib/cartStore';
import { base44 } from '@/api/base44Client';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ExternalLink, AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';

const AU_SHIPPING_BASE = 12.95;
const AU_SHIPPING_ADDITIONAL_PER_ITEM = 2.00;
const FREE_SHIPPING_THRESHOLD = 150;
const NO_SHIPPING_CATEGORIES = ['digital', 'support', 'donation', 'song', 'music', 'digital_music', 'cd', 'vinyl'];

function isInternational(address) {
  if (!address) return false;
  const lower = address.toLowerCase();
  return ['usa', 'united states', 'united kingdom', 'canada', 'new zealand', 'nz', 'europe', 'india', 'singapore'].some(k => lower.includes(k));
}

function needsShipping(category) {
  if (!category) return true;
  return !NO_SHIPPING_CATEGORIES.includes(category.toLowerCase().trim());
}

function calcCombinedShipping(items, address) {
  const physicalItems = items.filter(item => needsShipping(item.product.category));
  if (physicalItems.length === 0) return { shipping: 0, shippingLabel: 'Free', internationalQuote: false };
  
  const totalQty = items.reduce((sum, item) => sum + item.quantity, 0);
  
  if (isInternational(address)) {
    return { shipping: 0, shippingLabel: 'Quote required', internationalQuote: true };
  }
  
  const subtotal = items.reduce((sum, item) => {
    const price = item.product.sale_price ?? item.product.price ?? 0;
    return sum + (price * item.quantity);
  }, 0);
  
  if (subtotal >= FREE_SHIPPING_THRESHOLD) {
    return { shipping: 0, shippingLabel: 'Free (order ≥ $150)', internationalQuote: false };
  }
  
  const combinedShipping = totalQty <= 1
    ? AU_SHIPPING_BASE
    : AU_SHIPPING_BASE + (totalQty - 1) * AU_SHIPPING_ADDITIONAL_PER_ITEM;
  
  return { 
    shipping: combinedShipping, 
    shippingLabel: totalQty > 1 
      ? `$${combinedShipping.toFixed(2)} AUD (combined package)`
      : `$${AU_SHIPPING_BASE.toFixed(2)} AUD`,
    internationalQuote: false 
  };
}

export default function StoreCheckout() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { items, getSubtotal, clearCart } = useCartStore();
  
  const [form, setForm] = useState({ customer_name: '', customer_email: '', shipping_address: '' });
  const [addSupport, setAddSupport] = useState(0);
  const [redirecting, setRedirecting] = useState(false);
  const [checkoutError, setCheckoutError] = useState(null);
  const [promoCode, setPromoCode] = useState('');
  const [promoValidated, setPromoValidated] = useState(null);
  
  const subtotal = getSubtotal();
  const totalQty = items.reduce((sum, item) => sum + item.quantity, 0);
  const shipping = calcCombinedShipping(items, form.shipping_address);
  
  const discountAmount = promoValidated?.discount || 0;
  const total = subtotal - discountAmount + shipping.shipping + addSupport;
  
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
          productName: 'Multi-item order',
          amount: total,
          metadata: {
            items: JSON.stringify(items.map(item => ({
              product_id: item.product.id,
              product_name: item.product.name,
              price: item.product.sale_price ?? item.product.price,
              quantity: item.quantity,
              size: item.size
            }))),
            quantity: String(totalQty),
            shipping_address: form.shipping_address,
            add_support: String(addSupport),
            shipping_amount: String(shipping.internationalQuote ? 0 : shipping.shipping),
            promo_code: promoValidated?.code || '',
            discount_amount: String(discountAmount),
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
          <Button onClick={() => navigate('/store')} className="mt-4" variant="outline">
            Return to Store
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen py-24 px-4">
      <div className="max-w-3xl mx-auto">
        <button 
          onClick={() => navigate('/store')}
          className="flex items-center gap-2 font-body text-sm text-muted-foreground hover:text-foreground mb-6"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Store
        </button>
        
        <h1 className="font-display text-3xl text-foreground mb-8">Checkout</h1>
        
        <div className="grid md:grid-cols-2 gap-8">
          {/* Order Summary */}
          <div className="bg-secondary/30 rounded-xl p-6 h-fit">
            <h2 className="font-display text-xl text-foreground mb-4">Order Summary</h2>
            <div className="space-y-3 mb-4">
              {items.map((item, index) => (
                <div key={`${item.product_id}-${item.size}-${index}`} className="flex gap-3">
                  <img 
                    src={item.product.image_url} 
                    alt={item.product.name}
                    className="w-16 h-16 object-cover rounded-lg bg-secondary/50"
                  />
                  <div className="flex-1">
                    <p className="font-display text-sm text-foreground line-clamp-2">
                      {item.product.name}
                    </p>
                    {item.size && (
                      <p className="font-body text-xs text-muted-foreground">Size: {item.size}</p>
                    )}
                    <p className="font-body text-xs text-muted-foreground">Qty: {item.quantity}</p>
                    <p className="font-body text-sm gradient-gold-glow mt-1">
                      ${((item.product.sale_price ?? item.product.price ?? 0) * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="border-t border-border/40 pt-4 space-y-2 text-sm font-body">
              <div className="flex justify-between text-foreground/70">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-green-400">
                  <span>Discount ({promoValidated?.code})</span>
                  <span>-${discountAmount.toFixed(2)}</span>
                </div>
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
              <Input 
                placeholder="Your name" 
                value={form.customer_name} 
                onChange={e => setForm(f => ({ ...f, customer_name: e.target.value }))} 
                className="bg-secondary/50 border-border/40" 
              />
            </div>
            <div>
              <Label className="font-body text-xs tracking-wider uppercase text-muted-foreground mb-1.5 block">Email</Label>
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
            
            <div>
              <Label className="font-body text-xs tracking-wider uppercase text-muted-foreground mb-1.5 block">Promo Code</Label>
              <div className="flex gap-2">
                <Input 
                  placeholder="Enter code" 
                  value={promoCode} 
                  onChange={e => setPromoCode(e.target.value)}
                  className="bg-secondary/50 border-border/40" 
                />
                <Button 
                  variant="outline"
                  onClick={() => {
                    // TODO: Validate promo code server-side
                    toast({ title: 'Promo validation coming soon', description: 'Use F20UN26DVIP or F30MOM26A' });
                  }}
                >
                  Apply
                </Button>
              </div>
            </div>
            
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