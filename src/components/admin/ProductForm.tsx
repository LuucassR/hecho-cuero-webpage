"use client";

import { useActionState, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { SpecificationsInput } from "@/components/admin/SpecificationsInput";
import { slugify } from "@/lib/slugify";
import type { ProductFormState } from "@/app/admin/productos/actions";

type Category = { id: number; name: string };

export function ProductForm({
  action,
  categories,
  defaultValues,
  submitLabel,
  hasVariants = false,
}: {
  action: (state: ProductFormState, formData: FormData) => Promise<ProductFormState>;
  categories: Category[];
  defaultValues?: {
    name: string;
    slug: string;
    description: string;
    priceCents: number;
    stock: number;
    specifications: string[];
    categoryId: number | null;
    active: boolean;
  };
  submitLabel: string;
  hasVariants?: boolean;
}) {
  const [state, formAction, pending] = useActionState(action, undefined);
  const [slugTouched, setSlugTouched] = useState(Boolean(defaultValues));
  const [slug, setSlug] = useState(defaultValues?.slug ?? "");

  return (
    <form action={formAction} className="max-w-2xl space-y-5">
      <div>
        <Label htmlFor="name">Nombre</Label>
        <Input
          id="name"
          name="name"
          required
          defaultValue={defaultValues?.name}
          onChange={(e) => {
            if (!slugTouched) setSlug(slugify(e.target.value));
          }}
        />
      </div>

      <div>
        <Label htmlFor="slug">Slug (URL)</Label>
        <Input
          id="slug"
          name="slug"
          required
          value={slug}
          onChange={(e) => {
            setSlugTouched(true);
            setSlug(slugify(e.target.value));
          }}
        />
      </div>

      <div>
        <Label htmlFor="description">Descripción</Label>
        <Textarea
          id="description"
          name="description"
          rows={4}
          defaultValue={defaultValues?.description}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="priceCents">Precio (en centavos)</Label>
          <Input
            id="priceCents"
            name="priceCents"
            type="number"
            min={0}
            required
            defaultValue={defaultValues?.priceCents}
          />
          <p className="mt-1 text-xs text-muted">Ej: 1500000 = $15.000</p>
        </div>
        <div>
          <Label htmlFor="stock">Stock</Label>
          <Input
            id="stock"
            name="stock"
            type="number"
            min={0}
            required
            readOnly={hasVariants}
            defaultValue={defaultValues?.stock}
            className={hasVariants ? "bg-brand-100 text-muted" : undefined}
          />
          {hasVariants && (
            <p className="mt-1 text-xs text-muted">
              Se calcula automáticamente según el stock de las variantes.
            </p>
          )}
        </div>
      </div>

      <SpecificationsInput defaultValues={defaultValues?.specifications} />

      <div>
        <Label htmlFor="categoryId">Categoría</Label>
        <Select id="categoryId" name="categoryId" defaultValue={defaultValues?.categoryId ?? ""}>
          <option value="">Sin categoría</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </Select>
      </div>

      <div className="flex items-center gap-2">
        <input
          id="active"
          name="active"
          type="checkbox"
          defaultChecked={defaultValues?.active ?? true}
          className="h-4 w-4 rounded border-border accent-brand-800 focus:outline-none focus:ring-2 focus:ring-brand-200"
        />
        <Label htmlFor="active" className="mb-0">
          Visible en la tienda
        </Label>
      </div>

      {state?.error && <p className="text-sm text-red-700">{state.error}</p>}

      <Button type="submit" disabled={pending}>
        {pending ? "Guardando..." : submitLabel}
      </Button>
    </form>
  );
}
