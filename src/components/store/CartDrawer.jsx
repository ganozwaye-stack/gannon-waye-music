import { useCartStore } from '@/lib/cartStore';
import { ShoppingCart, Minus, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

export default function CartDrawer({ isOpen, onClose }) {
  const navigate = useNavigate();
  const rawStore = useCartStore();
  const items = Array.isArray(rawStore.items) ? rawStore.items : [];
  const { updateQuantity, removeItem, clearCart } = rawStore;
  const subtotal = useCartStore(state =>
    (Array.isArray(state.items) ? state.items : []).reduce((sum, item) => {
      const price = item.product?.sale_price ?? item.product?.price ?? 0;
      return sum + price * item.quantity;
    }, 0)
  );
  const itemCount = items.reduce((sum, item) => sum + (item.quantity || 0), 0);
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Drawer */}
      <div data-testid="cart-drawer" className="absolute right-0 top-0 h-full w-full max-w-md bg-card border-l border-border/40 shadow-2xl overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display text-2xl text-foreground">Your Cart</h2>
            <button 
              onClick={onClose}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              ✕
            </button>
          </div>
          
          {items.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingCart className="w-16 h-16 text-muted-foreground/20 mx-auto mb-4" />
              <p className="font-body text-sm text-muted-foreground">Your cart is empty</p>
              <Button 
                onClick={() => {
                  onClose();
                  navigate('/store');
                }}
                variant="outline"
                className="mt-4"
              >
                Continue Shopping
              </Button>
            </div>
          ) : (
            <>
              <div className="space-y-4 mb-6">
                {items.map((item, index) => (
                  <div 
                    key={`${item.product_id}-${item.size}-${index}`}
                    className="flex gap-4 p-4 bg-secondary/30 rounded-xl border border-border/30"
                  >
                    <img 
                      src={item.product.image_url} 
                      alt={item.product.name}
                      className="w-20 h-20 object-cover rounded-lg bg-secondary/50"
                    />
                    <div className="flex-1">
                      <p className="font-display text-sm text-foreground line-clamp-2">
                        {item.product.name}
                      </p>
                      {item.size && (
                        <p className="font-body text-xs text-muted-foreground mt-1">
                          Size: {item.size}
                        </p>
                      )}
                      <p className="font-body text-sm gradient-gold-glow mt-1">
                        ${(item.product.sale_price ?? item.product.price ?? 0).toFixed(2)}
                      </p>
                      
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateQuantity(item.product_id, item.quantity - 1, item.size)}
                            className="w-7 h-7 rounded-full border border-border/50 flex items-center justify-center hover:border-primary/50 transition-colors"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="font-body text-sm text-foreground w-6 text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.product_id, item.quantity + 1, item.size)}
                            className="w-7 h-7 rounded-full border border-border/50 flex items-center justify-center hover:border-primary/50 transition-colors"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                        
                        <button
                          onClick={() => removeItem(item.product_id, item.size)}
                          className="text-muted-foreground hover:text-destructive transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="border-t border-border/40 pt-4 mb-6">
                <div className="flex justify-between items-center mb-4">
                  <span className="font-body text-sm text-muted-foreground">Subtotal</span>
                  <span className="font-display text-lg text-foreground">${subtotal.toFixed(2)} AUD</span>
                </div>
                <p className="font-body text-xs text-muted-foreground/60 mb-4">
                  Shipping and discounts calculated at checkout
                </p>
              </div>
              
              <div className="space-y-3">
                <Button 
                  data-testid="cart-checkout-button"
                  onClick={() => {
                    onClose();
                    navigate('/store/cart-details');
                  }}
                  className="w-full rounded-full gradient-gold-button border-0 font-body text-sm tracking-wider uppercase"
                >
                  Proceed to Checkout · ${subtotal.toFixed(2)} AUD
                </Button>
                <Button 
                  onClick={clearCart}
                  variant="outline"
                  className="w-full rounded-full font-body text-sm"
                >
                  Clear Cart
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}