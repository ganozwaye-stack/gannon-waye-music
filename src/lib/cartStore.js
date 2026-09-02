import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

const CART_STORAGE_KEY = 'gannon_store_cart_v2';
// Version 4 clears carts created before the verified publication gate.
const EXPECTED_VERSION = 5;

// Wipe ALL known legacy cart keys that may contain serialized functions
// This prevents uu(a=>a.getItemCount()) and uu(a=>a.hasItems()) crashes on rehydration
try {
  // Remove old v1 key unconditionally
  localStorage.removeItem('gannon_store_cart');

  // Validate v2 key: if it contains method names (getItemCount, hasItems, getSubtotal)
  // or is missing the __version guard, wipe it so Zustand starts fresh
  const v2Raw = localStorage.getItem(CART_STORAGE_KEY);
  if (v2Raw) {
    let shouldWipe = false;
    try {
      const parsed = JSON.parse(v2Raw);
      const stateStr = JSON.stringify(parsed);
      if (
        stateStr.includes('getItemCount') ||
        stateStr.includes('hasItems') ||
        stateStr.includes('getSubtotal') ||
        (parsed.state && parsed.state.__version !== EXPECTED_VERSION)
      ) {
        shouldWipe = true;
      }
    } catch (_) {
      shouldWipe = true; // corrupt JSON — wipe
    }
    if (shouldWipe) {
      localStorage.removeItem(CART_STORAGE_KEY);
    }
  }
} catch (_) {
  // ignore — SSR or private browsing
}

function availableQuantity(product, size = null) {
  if (!product || typeof product !== 'object') return 0;
  if (size && product.stock_by_variant && Number.isFinite(Number(product.stock_by_variant[size]))) {
    return Math.max(0, Math.trunc(Number(product.stock_by_variant[size])));
  }
  return Math.max(0, Math.trunc(Number(product.stock_quantity || 0)));
}

function safeItems(raw) {
  if (!Array.isArray(raw)) return [];
  return raw.filter(
    item =>
      item &&
      typeof item === 'object' &&
      typeof item.product_id === 'string' &&
      item.product &&
      typeof item.product === 'object' &&
      typeof item.quantity === 'number'
  );
}

export const useCartStore = create(
  persist(
    (set) => ({
      items: [],
      hasHydrated: false,
      __version: EXPECTED_VERSION,

      addItem: (product, quantity = 1, size = null) => {
        set((state) => {
          const existingIndex = state.items.findIndex(
            item => item.product_id === product.id && item.size === size
          );
          const maximum = availableQuantity(product, size);
          if (maximum <= 0) return { items: state.items };

          if (existingIndex >= 0) {
            const newItems = [...state.items];
            const requested = Number(newItems[existingIndex].quantity || 0) + Number(quantity || 0);
            newItems[existingIndex] = {
              ...newItems[existingIndex],
              product,
              quantity: Math.min(maximum, Math.max(1, Math.trunc(requested))),
            };
            return { items: newItems };
          }

          const initialQuantity = Math.min(maximum, Math.max(1, Math.trunc(Number(quantity || 1))));
          return {
            items: [
              ...state.items,
              { product_id: product.id, product, quantity: initialQuantity, size, added_at: Date.now() },
            ],
          };
        });
      },

      removeItem: (productId, size = null) => {
        set((state) => ({
          items: state.items.filter(
            item => !(item.product_id === productId && item.size === size)
          ),
        }));
      },

      updateQuantity: (productId, quantity, size = null) => {
        if (quantity <= 0) {
          set((state) => ({
            items: state.items.filter(
              item => !(item.product_id === productId && item.size === size)
            ),
          }));
          return;
        }
        set((state) => ({
          items: state.items.map(item => {
            if (item.product_id !== productId || item.size !== size) return item;
            const maximum = availableQuantity(item.product, size);
            if (maximum <= 0) return item;
            return {
              ...item,
              quantity: Math.min(maximum, Math.max(1, Math.trunc(Number(quantity || 1)))),
            };
          }),
        }));
      },

      clearCart: () => set({ items: [] }),
    }),
    {
      name: CART_STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
      // Only persist plain items array + version — NEVER persist functions
      partialize: (state) => ({ items: safeItems(state.items), __version: EXPECTED_VERSION }),
      onRehydrateStorage: () => (state) => {
        useCartStore.setState({ hasHydrated: true });
        if (state) {
          state.items = safeItems(state.items);
        }
      },
    }
  )
);

// ─── Safe derived selector hooks ─────────────────────────────────────────────
// Always derive from state.items inline — never call a method stored on state

export const useCartItemCount = () =>
  useCartStore(state =>
    Array.isArray(state.items)
      ? state.items.reduce((sum, item) => sum + Number(item.quantity || 0), 0)
      : 0
  );

export const useCartSubtotal = () =>
  useCartStore(state =>
    Array.isArray(state.items)
      ? state.items.reduce((sum, item) => {
          const price = item.product?.sale_price ?? item.product?.price ?? 0;
          return sum + Number(price) * Number(item.quantity || 0);
        }, 0)
      : 0
  );

export const useCartHasItems = () =>
  useCartStore(state =>
    Array.isArray(state.items) && state.items.length > 0
  );