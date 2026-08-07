"use client";

import { clsx } from "clsx";
import { useCart } from "@/lib/cart/cart-context";
import { CartContents } from "./CartContents";

export function CartDrawer() {
  const { isOpen, closeCart } = useCart();

  return (
    <div
      className={clsx(
        "fixed inset-0 z-50 transition-opacity",
        isOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0",
      )}
      aria-hidden={!isOpen}
    >
      <div
        className="absolute inset-0 bg-brand-950/40"
        onClick={closeCart}
      />
      <div
        className={clsx(
          "absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-cream-100 p-6 shadow-2xl transition-transform duration-300",
          isOpen ? "translate-x-0" : "translate-x-full",
        )}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-xl text-brand-900">Tu carrito</h2>
          <button
            onClick={closeCart}
            aria-label="Cerrar carrito"
            className="flex h-9 w-9 items-center justify-center rounded-full text-brand-900 hover:bg-brand-100"
          >
            ✕
          </button>
        </div>
        <CartContents onNavigate={closeCart} />
      </div>
    </div>
  );
}
