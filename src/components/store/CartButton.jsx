import { useState } from 'react';
import { useCartStore } from '@/lib/cartStore';
import { ShoppingCart } from 'lucide-react';
import CartDrawer from './CartDrawer';

export default function CartButton() {
  const [isOpen, setIsOpen] = useState(false);
  const items = useCartStore(state => Array.isArray(state.items) ? state.items : []);
  const count = items.reduce((sum, item) => sum + (item.quantity || 0), 0);
  
  return (
    <>
      {/* Fixed portal — z-[60] sits above z-50 navbar so Playwright pointer events land on the button */}
      <div className="fixed top-3 right-4 z-[60]" style={{ pointerEvents: 'auto' }}>
        <button
          data-testid="cart-button"
          onClick={() => setIsOpen(true)}
          className="relative p-2 bg-background/80 backdrop-blur-sm border border-border/40 rounded-full text-muted-foreground hover:text-foreground hover:border-primary/40 transition-all"
        >
          <ShoppingCart className="w-5 h-5" />
          {count > 0 && (
            <span data-testid="cart-count" className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs font-body flex items-center justify-center">
              {count}
            </span>
          )}
        </button>
      </div>

      <CartDrawer isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}