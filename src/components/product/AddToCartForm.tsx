"use client";

import { useState } from "react";
import { useCart } from "@/lib/cart/cart-context";
import { Button } from "@/components/ui/Button";

export function AddToCartForm({
  productId,
  slug,
  name,
  priceCents,
  imageUrl,
  stock,
}: {
  productId: number;
  slug: string;
  name: string;
  priceCents: number;
  imageUrl: string | null;
  stock: number;
}) {
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const outOfStock = stock <= 0;

  function handleAdd() {
    addItem({ productId, slug, name, priceCents, imageUrl, quantity, stock });
    setAdded(true);
    window.setTimeout(() => setAdded(false), 2000);
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-brand-700">Pago por transferencia bancaria</p>

      {outOfStock ? (
        <p className="text-sm font-medium text-red-700">Sin stock por el momento.</p>
      ) : (
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3 rounded-full border border-border px-2 py-1">
            <button
              className="flex h-8 w-8 items-center justify-center rounded-full text-brand-900 disabled:opacity-40"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              disabled={quantity <= 1}
              aria-label="Restar"
            >
              −
            </button>
            <span className="w-6 text-center text-sm">{quantity}</span>
            <button
              className="flex h-8 w-8 items-center justify-center rounded-full text-brand-900 disabled:opacity-40"
              onClick={() => setQuantity((q) => Math.min(stock, q + 1))}
              disabled={quantity >= stock}
              aria-label="Sumar"
            >
              +
            </button>
          </div>
          <Button onClick={handleAdd} size="lg" className="flex-1">
            {added ? "¡Agregado!" : "Agregar al carrito"}
          </Button>
        </div>
      )}
    </div>
  );
}
