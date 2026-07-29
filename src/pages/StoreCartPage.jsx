import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ShoppingBag, Trash2, Plus, Minus } from 'lucide-react';
import { useCartStore } from '@/lib/cartStore';
import { Button } from '@/components/ui/button';
import CartItemImage from '@/components/store/CartItemImage';

export default function StoreCartPage() {
  const navigate = useNavigate();
  const items = useCartStore(state => Array.isArray(state.items) ? state.items : []);
  const updateQuantity = useCartStore(state => state.updateQuantity);
  const removeItem = useCartStore(state => state.removeItem);

  const [hasHydrated, setHasHydrated] = useState(false);
  useEffect(() => {
    setHasHydrated(true);
  }, []);
  useEffect(() => {
    if (!hasHydrated) return;
    if (items.length === 0) navigate('/store');
  }, [hasHydrated, items.length, navigate]);

  const subtotal = items.reduce((sum, item) => {
    const price = item.product?.sale_price ?? item.product?.price ?? 0;
    return sum + price * item.quantity;
  }, 0);

  const itemCount = items.reduce((s, i) => s + i.quantity, 0);

  return (
    <div className="min-h-screen py-24 px-4 md:px-6" data-testid="cart-page">
      <div className="max-w-xl mx-auto">
        <button
          onClick={() => navigate('/store')}
          className="flex items-center gap-2 font-body text-xs text-muted-foreground hover:text-foreground mb-8 transition-colors"
        >
          <ArrowLeft className="w-3 h-3" /> Back to Store
        </button>

        {/* Progress */}
        <div className="flex items-center gap-2 mb-8">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-body text-xs font-bold">1</div>
            <span className="font-body text-xs text-primary">Cart</span>
          </div>
          <div className="flex-1 h-px bg-border/40 mx-2" />
          <div className="flex items-center gap-2 opacity-40">
            <div className="w-7 h-7 rounded-full border border-border/50 flex items-center justify-center font-body text-xs">2</div>
            <span className="font-body text-xs text-muted-foreground">Your Details</span>
          </div>
          <div className="flex-1 h-px bg-border/40 mx-2" />
          <div className="flex items-center gap-2 opacity-40">
            <div className="w-7 h-7 rounded-full border border-border/50 flex items-center justify-center font-body text-xs">3</div>
            <span className="font-body text-xs text-muted-foreground">Payment</span>
          </div>
        </div>

        <div className="flex items-center gap-2 mb-6">
          <ShoppingBag className="w-4 h-4 text-primary" />
          <span className="font-body text-xs text-muted-foreground">{itemCount} item{itemCount !== 1 ? 's' : ''} in cart</span>
        </div>

        <h1 className="font-display text-3xl text-foreground mb-8">Your Cart</h1>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          {items.map((item, idx) => {
            const price = item.product?.sale_price ?? item.product?.price ?? 0;
            return (
              <div
                key={`${item.product_id}-${item.size}-${idx}`}
                data-testid="cart-item"
                className="bg-card/40 border border-border/30 rounded-2xl p-4 flex gap-4"
              >
                <CartItemImage
                  product={item.product}
                  alt={item.product?.name}
                  testId="cart-page-item-image"
                  className="w-16 h-16 object-cover rounded-lg shrink-0 bg-secondary/50"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-display text-sm text-foreground leading-snug">{item.product?.name}</p>
                  {item.size && (
                    <p className="font-body text-xs text-muted-foreground mt-0.5">Size: {item.size}</p>
                  )}
                  <p className="font-body text-sm text-primary mt-1">${(price * item.quantity).toFixed(2)} AUD</p>
                  <div className="flex items-center gap-3 mt-2">
                    <button
                      onClick={() => updateQuantity(item.product_id, item.quantity - 1, item.size)}
                      className="w-7 h-7 rounded-full border border-border/50 flex items-center justify-center text-muted-foreground hover:border-primary/40 transition-colors"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="font-body text-sm w-6 text-center">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.product_id, item.quantity + 1, item.size)}
                      className="w-7 h-7 rounded-full border border-border/50 flex items-center justify-center text-muted-foreground hover:border-primary/40 transition-colors"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => removeItem(item.product_id, item.size)}
                      className="ml-auto text-muted-foreground hover:text-destructive transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Subtotal */}
          <div className="bg-card/40 border border-border/30 rounded-2xl p-5">
            <div className="flex justify-between font-body text-sm text-foreground">
              <span>Subtotal</span>
              <span className="gradient-gold-glow font-medium">${subtotal.toFixed(2)} AUD</span>
            </div>
            <p className="font-body text-xs text-muted-foreground mt-1">Shipping calculated at checkout</p>
          </div>

          <Button
            data-testid="proceed-to-details"
            onClick={() => navigate('/store/customer-details')}
            className="w-full rounded-full gradient-gold-button border-0 font-body text-sm tracking-wider uppercase py-6"
          >
            Continue to Your Details →
          </Button>

          <button
            onClick={() => navigate('/store')}
            className="w-full text-center font-body text-xs text-muted-foreground hover:text-foreground transition-colors py-2"
          >
            ← Continue Shopping
          </button>
        </motion.div>
      </div>
    </div>
  );
}
