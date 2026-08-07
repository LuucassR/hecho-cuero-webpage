"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { updateProductVariants } from "@/app/admin/productos/actions";
import { variantLabel, type ProductOption, type ProductVariant } from "@/lib/variants";

type Row = {
  id: number;
  label: string;
  sku: string;
  priceCents: string;
  stock: string;
  active: boolean;
};

function toRows(variants: ProductVariant[], options: ProductOption[]): Row[] {
  return variants.map((v) => ({
    id: v.id,
    label: variantLabel(v, options),
    sku: v.sku ?? "",
    priceCents: v.priceCents != null ? String(v.priceCents) : "",
    stock: String(v.stock),
    active: v.active,
  }));
}

export function VariantsTable({
  productId,
  options,
  variants,
}: {
  productId: number;
  options: ProductOption[];
  variants: ProductVariant[];
}) {
  const [rows, setRows] = useState<Row[]>(() => toRows(variants, options));
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const serialized = JSON.stringify(variants);
  const [syncedSerialized, setSyncedSerialized] = useState(serialized);
  if (serialized !== syncedSerialized) {
    setSyncedSerialized(serialized);
    setRows(toRows(variants, options));
  }

  function updateRow(id: number, patch: Partial<Row>) {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  }

  function handleSave() {
    setError(null);
    startTransition(async () => {
      const result = await updateProductVariants(
        productId,
        rows.map((r) => ({
          id: r.id,
          sku: r.sku,
          priceCents: r.priceCents.trim() === "" ? null : Number(r.priceCents),
          stock: Number(r.stock),
          active: r.active,
        })),
      );
      if (result?.error) setError(result.error);
    });
  }

  if (rows.length === 0) {
    return (
      <p className="text-sm text-muted">
        Agregá al menos una opción con valores para generar las combinaciones (variantes).
      </p>
    );
  }

  return (
    <div className="space-y-3">
      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-brand-100/50 text-left text-xs uppercase tracking-wide text-muted">
              <th className="p-3">Combinación</th>
              <th className="p-3">SKU</th>
              <th className="p-3">Precio (centavos)</th>
              <th className="p-3">Stock</th>
              <th className="p-3">Activa</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id} className="border-b border-border last:border-0">
                <td className="p-3 font-medium text-brand-900">{row.label}</td>
                <td className="p-3">
                  <Input
                    value={row.sku}
                    onChange={(e) => updateRow(row.id, { sku: e.target.value })}
                    className="w-32"
                  />
                </td>
                <td className="p-3">
                  <Input
                    value={row.priceCents}
                    onChange={(e) => updateRow(row.id, { priceCents: e.target.value })}
                    placeholder="Precio base"
                    type="number"
                    min={0}
                    className="w-32"
                  />
                </td>
                <td className="p-3">
                  <Input
                    value={row.stock}
                    onChange={(e) => updateRow(row.id, { stock: e.target.value })}
                    type="number"
                    min={0}
                    className="w-24"
                  />
                </td>
                <td className="p-3">
                  <input
                    type="checkbox"
                    checked={row.active}
                    onChange={(e) => updateRow(row.id, { active: e.target.checked })}
                    className="h-4 w-4 rounded border-border accent-brand-800 focus:outline-none focus:ring-2 focus:ring-brand-200"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {error && <p className="text-sm text-red-700">{error}</p>}

      <Button type="button" onClick={handleSave} disabled={isPending} variant="secondary">
        {isPending ? "Guardando..." : "Guardar variantes"}
      </Button>
    </div>
  );
}
