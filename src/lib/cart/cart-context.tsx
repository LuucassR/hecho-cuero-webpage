"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useState,
} from "react";
import type { CartItem } from "./types";

const STORAGE_KEY = "hecho-cuero-cart-v1";

type State = { items: CartItem[] };

type Action =
  | { type: "HYDRATE"; items: CartItem[] }
  | { type: "ADD_ITEM"; item: CartItem }
  | { type: "REMOVE_ITEM"; productId: number; variantId: number | null }
  | { type: "UPDATE_QUANTITY"; productId: number; variantId: number | null; quantity: number }
  | { type: "CLEAR" };

function isSameLine(
  item: CartItem,
  productId: number,
  variantId: number | null,
) {
  return item.productId === productId && item.variantId === variantId;
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "HYDRATE":
      return { items: action.items };
    case "ADD_ITEM": {
      const existing = state.items.find((i) =>
        isSameLine(i, action.item.productId, action.item.variantId),
      );
      if (existing) {
        const quantity = Math.min(
          existing.quantity + action.item.quantity,
          existing.stock,
        );
        return {
          items: state.items.map((i) =>
            isSameLine(i, action.item.productId, action.item.variantId)
              ? { ...i, quantity }
              : i,
          ),
        };
      }
      return { items: [...state.items, action.item] };
    }
    case "REMOVE_ITEM":
      return {
        items: state.items.filter((i) => !isSameLine(i, action.productId, action.variantId)),
      };
    case "UPDATE_QUANTITY":
      return {
        items: state.items.map((i) =>
          isSameLine(i, action.productId, action.variantId)
            ? { ...i, quantity: Math.max(1, Math.min(action.quantity, i.stock)) }
            : i,
        ),
      };
    case "CLEAR":
      return { items: [] };
    default:
      return state;
  }
}

type CartContextValue = {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (productId: number, variantId: number | null) => void;
  updateQuantity: (productId: number, variantId: number | null, quantity: number) => void;
  clear: () => void;
  subtotalCents: number;
  totalQuantity: number;
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, { items: [] });
  const [isOpen, setIsOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const items = JSON.parse(raw) as CartItem[];
        dispatch({ type: "HYDRATE", items });
      }
    } catch {
      // ignore malformed local storage payloads
    } finally {
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state.items));
  }, [state.items, hydrated]);

  const addItem = useCallback((item: CartItem) => {
    dispatch({ type: "ADD_ITEM", item });
    setIsOpen(true);
  }, []);

  const removeItem = useCallback((productId: number, variantId: number | null) => {
    dispatch({ type: "REMOVE_ITEM", productId, variantId });
  }, []);

  const updateQuantity = useCallback(
    (productId: number, variantId: number | null, quantity: number) => {
      dispatch({ type: "UPDATE_QUANTITY", productId, variantId, quantity });
    },
    [],
  );

  const clear = useCallback(() => dispatch({ type: "CLEAR" }), []);

  const subtotalCents = useMemo(
    () => state.items.reduce((sum, i) => sum + i.priceCents * i.quantity, 0),
    [state.items],
  );
  const totalQuantity = useMemo(
    () => state.items.reduce((sum, i) => sum + i.quantity, 0),
    [state.items],
  );

  const value: CartContextValue = {
    items: state.items,
    addItem,
    removeItem,
    updateQuantity,
    clear,
    subtotalCents,
    totalQuantity,
    isOpen,
    openCart: () => setIsOpen(true),
    closeCart: () => setIsOpen(false),
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart debe usarse dentro de CartProvider");
  }
  return ctx;
}
