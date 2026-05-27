import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const CART_STORAGE_KEY = 'gannon_store_cart';

export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [], // [{ product_id, product, quantity, size, added_at }]
      
      addItem: (product, quantity = 1, size = null) => {
        set((state) => {
          const existingIndex = state.items.findIndex(
            item => item.product_id === product.id && item.size === size
          );
          
          if (existingIndex >= 0) {
            // Update quantity of existing item
            const newItems = [...state.items];
            newItems[existingIndex] = {
              ...newItems[existingIndex],
              quantity: newItems[existingIndex].quantity + quantity
            };
            return { items: newItems };
          }
          
          // Add new item
          return {
            items: [
              ...state.items,
              {
                product_id: product.id,
                product,
                quantity,
                size,
                added_at: Date.now()
              }
            ]
          };
        });
      },
      
      removeItem: (productId, size = null) => {
        set((state) => ({
          items: state.items.filter(item => !(item.product_id === productId && item.size === size))
        }));
      },
      
      updateQuantity: (productId, quantity, size = null) => {
        if (quantity <= 0) {
          get().removeItem(productId, size);
          return;
        }
        
        set((state) => ({
          items: state.items.map(item =>
            item.product_id === productId && item.size === size
              ? { ...item, quantity }
              : item
          )
        }));
      },
      
      clearCart: () => set({ items: [] }),
      
      getItemCount: () => {
        const state = get();
        return state.items.reduce((sum, item) => sum + item.quantity, 0);
      },
      
      getSubtotal: () => {
        const state = get();
        return state.items.reduce((sum, item) => {
          const price = item.product.sale_price ?? item.product.price ?? 0;
          return sum + (price * item.quantity);
        }, 0);
      },
      
      hasItems: () => {
        const state = get();
        return state.items.length > 0;
      }
    }),
    {
      name: CART_STORAGE_KEY,
    }
  )
);