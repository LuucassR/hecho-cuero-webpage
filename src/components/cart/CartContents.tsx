"use client";

import Link from "next/link";
import { useCart } from "@/lib/cart/cart-context";
import { formatCurrency } from "@/lib/format";
import { ProductImage } from "@/components/product/ProductImage";
import { LinkButton } from "@/components/ui/Button";

export function CartContents({ onNavigate }: { onNavigate?: () => void }) {
  const { items, removeItem, updateQuantity, subtotalCents } = useCart();

  if (items.length === 0) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4 py-16 text-center">
        <p className="text-muted">Tu carrito está vacío.</p>
        <LinkButton href="/productos" onClick={onNavigate}>
          Ver productos
        </LinkButton>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col">
      <ul className="flex-1 divide-y divide-border">
        {items.map((item) => (
          <li key={item.productId} className="flex gap-4 py-4">
            <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg">
              <ProductImage
                src={item.imageUrl}
                alt={item.name}
                className="h-20 w-20"
                sizes="80px"
              />
            </div>
            <div className="flex flex-1 flex-col justify-between">
              <div className="flex items-start justify-between gap-2">
                <Link
                  href={`/productos/${item.slug}`}
                  onClick={onNavigate}
                  className="text-sm font-medium text-brand-900 hover:underline"
                >
                  {item.name}
                </Link>
                <button
                  onClick={() => removeItem(item.productId)}
                  className="text-xs text-muted hover:text-red-700"
                  aria-label={`Quitar ${item.name}`}
                >
                  Quitar
                </button>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button
                    className="flex h-7 w-7 items-center justify-center rounded-full border border-border text-brand-900 disabled:opacity-40"
                    onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                    disabled={item.quantity <= 1}
                    aria-label="Restar"
                  >
                    −
                  </button>
                  <span className="w-6 text-center text-sm">{item.quantity}</span>
                  <button
                    className="flex h-7 w-7 items-center justify-center rounded-full border border-border text-brand-900 disabled:opacity-40"
                    onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                    disabled={item.quantity >= item.stock}
                    aria-label="Sumar"
                  >
                    +
                  </button>
                </div>
                <span className="text-sm font-medium text-brand-900">
                  {formatCurrency(item.priceCents * item.quantity)}
                </span>
              </div>
            </div>
          </li>
        ))}
      </ul>
      <div className="space-y-4 border-t border-border pt-4">
        <div className="flex items-center justify-between text-sm text-muted">
          <span>Envío</span>
          <span>Se calcula en el checkout</span>
        </div>
        <div className="flex items-center justify-between text-base font-semibold text-brand-900">
          <span>Subtotal</span>
          <span>{formatCurrency(subtotalCents)}</span>
        </div>
        <LinkButton href="/checkout" onClick={onNavigate} className="w-full" size="lg">
          Ir a pagar
        </LinkButton>
        <LinkButton
          href="/carrito"
          onClick={onNavigate}
          variant="outline"
          className="w-full"
        >
          Ver carrito
        </LinkButton>
      </div>
    </div>
  );
}
