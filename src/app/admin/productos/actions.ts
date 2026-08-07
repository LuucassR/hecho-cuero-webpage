"use server";

import { del } from "@vercel/blob";
import { asc, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { productImages, products } from "@/db/schema";
import { productSchema } from "@/lib/validation/product";

export type ProductFormState = { error?: string } | undefined;

function parseProductForm(formData: FormData) {
  const categoryIdRaw = formData.get("categoryId");
  const specifications = formData
    .getAll("specifications")
    .map((value) => String(value).trim())
    .filter((value) => value.length > 0);

  return productSchema.safeParse({
    name: formData.get("name"),
    slug: formData.get("slug"),
    description: formData.get("description") ?? "",
    priceCents: formData.get("priceCents"),
    stock: formData.get("stock"),
    specifications,
    categoryId: categoryIdRaw && categoryIdRaw !== "" ? categoryIdRaw : null,
    active: formData.get("active") === "on",
  });
}

export async function createProduct(
  _prevState: ProductFormState,
  formData: FormData,
): Promise<ProductFormState> {
  const parsed = parseProductForm(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Datos inválidos." };
  }

  let insertedId: number;
  try {
    const [inserted] = await db.insert(products).values(parsed.data).returning({ id: products.id });
    insertedId = inserted.id;
  } catch {
    return { error: "Ya existe un producto con ese slug." };
  }

  revalidatePath("/admin/productos");
  redirect(`/admin/productos/${insertedId}/editar`);
}

export async function updateProduct(
  id: number,
  _prevState: ProductFormState,
  formData: FormData,
): Promise<ProductFormState> {
  const parsed = parseProductForm(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Datos inválidos." };
  }

  try {
    await db
      .update(products)
      .set({ ...parsed.data, updatedAt: new Date() })
      .where(eq(products.id, id));
  } catch {
    return { error: "Ya existe un producto con ese slug." };
  }

  revalidatePath("/admin/productos");
  revalidatePath(`/admin/productos/${id}/editar`);
  return { error: undefined };
}

export async function toggleProductActive(id: number, active: boolean) {
  await db.update(products).set({ active, updatedAt: new Date() }).where(eq(products.id, id));
  revalidatePath("/admin/productos");
}

export async function deleteProduct(id: number) {
  const images = await db.query.productImages.findMany({
    where: eq(productImages.productId, id),
  });
  await Promise.all(
    images.map((img) => del(img.url).catch(() => undefined)),
  );
  await db.delete(products).where(eq(products.id, id));
  revalidatePath("/admin/productos");
  redirect("/admin/productos");
}

export async function attachProductImage(productId: number, url: string) {
  const existing = await db.query.productImages.findMany({
    where: eq(productImages.productId, productId),
    orderBy: asc(productImages.position),
  });
  const nextPosition = existing.length > 0 ? existing[existing.length - 1].position + 1 : 0;

  await db.insert(productImages).values({
    productId,
    url,
    alt: "",
    position: nextPosition,
  });
  revalidatePath(`/admin/productos/${productId}/editar`);
}

export async function removeProductImage(imageId: number, productId: number) {
  const image = await db.query.productImages.findFirst({
    where: eq(productImages.id, imageId),
  });
  if (image) {
    await del(image.url).catch(() => undefined);
    await db.delete(productImages).where(eq(productImages.id, imageId));
  }
  revalidatePath(`/admin/productos/${productId}/editar`);
}
