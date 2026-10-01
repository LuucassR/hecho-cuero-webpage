"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { categories, products } from "@/db/schema";
import { categorySchema } from "@/lib/validation/product";

export type CategoryFormState = { error?: string } | undefined;

function parseCategoryForm(formData: FormData) {
  return categorySchema.safeParse({
    name: formData.get("name"),
    slug: formData.get("slug"),
    description: formData.get("description") || undefined,
    imageUrl: formData.get("imageUrl") || undefined,
  });
}

export async function createCategory(
  _prevState: CategoryFormState,
  formData: FormData,
): Promise<CategoryFormState> {
  const parsed = parseCategoryForm(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Datos inválidos." };
  }
  try {
    await db.insert(categories).values(parsed.data);
  } catch {
    return { error: "Ya existe una categoría con ese slug." };
  }
  revalidatePath("/admin/categorias");
  redirect("/admin/categorias");
}

export async function updateCategory(
  id: number,
  _prevState: CategoryFormState,
  formData: FormData,
): Promise<CategoryFormState> {
  const parsed = parseCategoryForm(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Datos inválidos." };
  }
  try {
    await db.update(categories).set(parsed.data).where(eq(categories.id, id));
  } catch {
    return { error: "Ya existe una categoría con ese slug." };
  }
  revalidatePath("/admin/categorias");
  redirect("/admin/categorias");
}

// Refuses to delete a category that still has products, so they get moved to
// another category first instead of silently dropping out of the catalog.
export async function deleteCategory(id: number): Promise<CategoryFormState> {
  const assigned = await db.$count(products, eq(products.categoryId, id));
  if (assigned > 0) {
    return {
      error: `Esta categoría todavía tiene ${assigned} producto(s). Movelos a otra categoría antes de eliminarla.`,
    };
  }
  await db.delete(categories).where(eq(categories.id, id));
  revalidatePath("/admin/categorias");
}
