"use client";

import { useActionState, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Textarea } from "@/components/ui/Textarea";
import { slugify } from "@/lib/slugify";
import type { CategoryFormState } from "@/app/admin/categorias/actions";

export function CategoryForm({
  action,
  defaultValues,
  submitLabel,
}: {
  action: (state: CategoryFormState, formData: FormData) => Promise<CategoryFormState>;
  defaultValues?: {
    name: string;
    slug: string;
    description: string | null;
    imageUrl?: string | null;
  };
  submitLabel: string;
}) {
  const [state, formAction, pending] = useActionState(action, undefined);
  const [slugTouched, setSlugTouched] = useState(Boolean(defaultValues));
  const [slug, setSlug] = useState(defaultValues?.slug ?? "");
  const [imageUrl, setImageUrl] = useState(defaultValues?.imageUrl ?? "");

  return (
    <form action={formAction} className="max-w-lg space-y-4">
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
        <Label htmlFor="description">Descripción (opcional)</Label>
        <Textarea id="description" name="description" rows={2} defaultValue={defaultValues?.description ?? ""} />
      </div>
      <div>
        <Label htmlFor="imageUrl">Imagen (URL, opcional)</Label>
        <Input
          id="imageUrl"
          name="imageUrl"
          placeholder="/mi-imagen.jpg"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
        />
        {imageUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imageUrl}
            alt="Vista previa"
            className="mt-3 h-32 w-32 rounded-xl border border-border object-cover"
          />
        )}
      </div>
      {state?.error && <p className="text-sm text-red-700">{state.error}</p>}
      <Button type="submit" disabled={pending}>
        {pending ? "Guardando..." : submitLabel}
      </Button>
    </form>
  );
}
