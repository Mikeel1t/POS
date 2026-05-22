import { create } from "zustand";
import type { CartItem, Product } from "../types";

interface CartState {
  items: CartItem[];
  addItem: (product: Product) => void;
  removeItem: (productId: number) => void;
  updateQty: (productId: number, qty: number) => void;
  clear: () => void;
  total: () => number;
  subtotal: () => number;
  taxTotal: () => number;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],

  addItem: (product) => {
    const existing = get().items.find((i) => i.product.id === product.id);
    if (existing) {
      set({
        items: get().items.map((i) =>
          i.product.id === product.id ? { ...i, quantity: i.quantity + 1 } : i
        ),
      });
    } else {
      set({ items: [...get().items, { product, quantity: 1 }] });
    }
  },

  removeItem: (productId) =>
    set({ items: get().items.filter((i) => i.product.id !== productId) }),

  updateQty: (productId, qty) =>
    set({
      items: get().items.map((i) =>
        i.product.id === productId ? { ...i, quantity: qty } : i
      ),
    }),

  clear: () => set({ items: [] }),

  subtotal: () =>
    get().items.reduce((acc, i) => acc + i.product.unit_price * i.quantity, 0),

  taxTotal: () =>
  get().items.reduce((acc, i) => {
    const rate =
      i.product.tax_config?.rate ?? 0;

    return (
      acc +
      i.product.unit_price *
      i.quantity *
      rate
    );
  }, 0),

  total: () => get().subtotal() + get().taxTotal(),
}));