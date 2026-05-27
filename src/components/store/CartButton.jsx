import { useState } from 'react';
import { useCartStore } from '@/lib/cartStore';
import { ShoppingCart } from 'lucide-react';
import CartDrawer from './CartDrawer';

export default function CartButton() {
  const [isOpen, setIsOpen] = useState(false);
  const getItemCount = useCartStore(state => state.getItemCount());
  const count = getItemCount();
  
  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="relative p-2 text-muted-foreground hover:text-foreground transition-colors"
      >
        <ShoppingCart className="w-5 h-5" />
        {count > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs font-body flex items-center justify-center">
            {count}
          </span>
        )}
      </button>
      
      <CartDrawer isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}