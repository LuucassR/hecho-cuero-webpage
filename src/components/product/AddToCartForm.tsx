"use client";

import { useMemo, useState } from "react";
import { useCart } from "@/lib/cart/cart-context";
import { Button } from "@/components/ui/Button";
import { Label } from "@/components/ui/Label";
import { Select } from "@/components/ui/Select";
import { formatCurrency } from "@/lib/format";
import { findMatchingVariant, variantLabel, type ProductOption, type ProductVariant } from "@/lib/variants";

export function AddToCartForm({
  productId,
  slug,
  name,
  priceCents,
  imageUrl,
  stock,
  options = [],
  variants = [],
}: {
  productId: number;
  slug: string;
  name: string;
  priceCents: number;
  imageUrl: string | null;
  stock: number;
  options?: ProductOption[];
  variants?: ProductVariant[];
}) {
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [selection, setSelection] = useState<Record<number, number | "">>(() =>
    Object.fromEntries(options.map((o) => [o.id, ""])),
  );

  const hasVariants = variants.length > 0;
  const selectionComplete = options.every((o) => selection[o.id] !== "");

  const matchedVariant = useMemo(() => {
    if (!hasVariants || !selectionComplete) return null;
    return (
      findMatchingVariant(
        variants,
        options,
        Object.fromEntries(options.map((o) => [o.id, selection[o.id] as number])),
      ) ?? null
    );
  }, [hasVariants, selectionComplete, variants, options, selection]);

  const effectiveStock = hasVariants ? (matchedVariant?.active ? matchedVariant.stock : 0) : stock;
  const effectivePriceCents = matchedVariant?.priceCents ?? priceCents;
  const outOfStock = effectiveStock <= 0;
  const canAdd = hasVariants ? Boolean(matchedVariant) && !outOfStock : !outOfStock;

  function handleAdd() {
    if (!canAdd) return;
    addItem({
      productId,
      variantId: matchedVariant?.id ?? null,
      variantLabel: matchedVariant ? variantLabel(matchedVariant, options) : null,
      slug,
      name,
      priceCents: effectivePriceCents,
      imageUrl,
      quantity,
      stock: effectiveStock,
    });
    setAdded(true);
    window.setTimeout(() => setAdded(false), 2000);
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-brand-700">Pago por transferencia bancaria</p>

      {hasVariants && (
        <div className="space-y-3">
          {options.map((option) => (
            <div key={option.id}>
              <Label htmlFor={`option-${option.id}`}>{option.name}</Label>
              <Select
                id={`option-${option.id}`}
                value={selection[option.id]}
                onChange={(e) => {
                  const value = e.target.value ? Number(e.target.value) : "";
                  setSelection((prev) => ({ ...prev, [option.id]: value }));
                  setQuantity(1);
                }}
              >
                <option value="">Elegir {option.name.toLowerCase()}</option>
                {option.values.map((value) => (
                  <option key={value.id} value={value.id}>
                    {value.value}
                  </option>
                ))}
              </Select>
            </div>
          ))}
          {hasVariants && matchedVariant?.priceCents != null && (
            <p className="text-sm font-medium text-brand-900">
              {formatCurrency(effectivePriceCents)}
            </p>
          )}
          {selectionComplete && !matchedVariant && (
            <p className="text-sm text-red-700">Esa combinación no está disponible.</p>
          )}
          {matchedVariant && outOfStock && (
            <p className="text-sm font-medium text-red-700">Sin stock por el momento.</p>
          )}
        </div>
      )}

      {!hasVariants && outOfStock && (
        <p className="text-sm font-medium text-red-700">Sin stock por el momento.</p>
      )}

      {(hasVariants ? canAdd : !outOfStock) && (
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
              onClick={() => setQuantity((q) => Math.min(effectiveStock, q + 1))}
              disabled={quantity >= effectiveStock}
              aria-label="Sumar"
            >
              +
            </button>
          </div>
          <Button onClick={handleAdd} size="lg" className="flex-1" disabled={!canAdd}>
            {added ? "¡Agregado!" : "Agregar al carrito"}
          </Button>
        </div>
      )}
    </div>
  );
}
