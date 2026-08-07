"use server";

import { del } from "@vercel/blob";
import { and, asc, eq, inArray, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/db";
import {
  productImages,
  productOptions,
  productOptionValues,
  productVariants,
  productVariantValues,
  products,
} from "@/db/schema";
import {
  productOptionsInputSchema,
  productSchema,
  productVariantsInputSchema,
  type ProductOptionInput,
} from "@/lib/validation/product";

type Tx = Parameters<Parameters<typeof db.transaction>[0]>[0];

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

// Recreates variant rows so they match the cartesian product of the product's
// current options/values, deleting variants that no longer correspond to any
// combination and keeping (untouched) variants that still do.
async function syncProductVariants(tx: Tx, productId: number) {
  const options = await tx.query.productOptions.findMany({
    where: eq(productOptions.productId, productId),
    orderBy: asc(productOptions.position),
    with: { values: { orderBy: asc(productOptionValues.position) } },
  });

  const combos: number[][] =
    options.length === 0
      ? []
      : options.reduce<number[][]>(
          (acc, option) =>
            acc.flatMap((combo) => option.values.map((v) => [...combo, v.id])),
          [[]],
        );
  const comboKeys = new Set(combos.map((combo) => [...combo].sort((a, b) => a - b).join(",")));

  const existingVariants = await tx.query.productVariants.findMany({
    where: eq(productVariants.productId, productId),
    with: { variantValues: true },
  });

  const staleVariantIds = existingVariants
    .filter((variant) => {
      const key = variant.variantValues
        .map((vv) => vv.optionValueId)
        .sort((a, b) => a - b)
        .join(",");
      return !comboKeys.has(key);
    })
    .map((v) => v.id);
  if (staleVariantIds.length > 0) {
    await tx.delete(productVariants).where(inArray(productVariants.id, staleVariantIds));
  }

  const keptKeys = new Set(
    existingVariants
      .filter((v) => !staleVariantIds.includes(v.id))
      .map((v) =>
        v.variantValues
          .map((vv) => vv.optionValueId)
          .sort((a, b) => a - b)
          .join(","),
      ),
  );

  for (const combo of combos) {
    const key = [...combo].sort((a, b) => a - b).join(",");
    if (keptKeys.has(key)) continue;
    const [inserted] = await tx
      .insert(productVariants)
      .values({ productId, stock: 0 })
      .returning({ id: productVariants.id });
    await tx
      .insert(productVariantValues)
      .values(combo.map((optionValueId) => ({ variantId: inserted.id, optionValueId })));
  }

  if (combos.length > 0) {
    const [{ total }] = await tx
      .select({ total: sql<string>`coalesce(sum(${productVariants.stock}), 0)` })
      .from(productVariants)
      .where(eq(productVariants.productId, productId));
    await tx
      .update(products)
      .set({ stock: Number(total) })
      .where(eq(products.id, productId));
  }
}

export type SaveOptionsResult = { error?: string } | undefined;

export async function saveProductOptions(
  productId: number,
  rawOptions: ProductOptionInput[],
): Promise<SaveOptionsResult> {
  const parsed = productOptionsInputSchema.safeParse(rawOptions);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Datos inválidos." };
  }
  const submittedOptions = parsed.data;

  await db.transaction(async (tx) => {
    const existingOptions = await tx.query.productOptions.findMany({
      where: eq(productOptions.productId, productId),
      with: { values: true },
    });
    const existingOptionIds = new Set(existingOptions.map((o) => o.id));
    const existingValueIdsByOption = new Map(
      existingOptions.map((o) => [o.id, new Set(o.values.map((v) => v.id))]),
    );

    const keptOptionIds = new Set<number>();
    const keptValueIds = new Set<number>();

    for (let i = 0; i < submittedOptions.length; i++) {
      const option = submittedOptions[i];
      let optionId = option.id;
      if (optionId !== null && existingOptionIds.has(optionId)) {
        await tx
          .update(productOptions)
          .set({ name: option.name, position: i })
          .where(eq(productOptions.id, optionId));
      } else {
        const [inserted] = await tx
          .insert(productOptions)
          .values({ productId, name: option.name, position: i })
          .returning({ id: productOptions.id });
        optionId = inserted.id;
      }
      keptOptionIds.add(optionId);

      const existingValueIds = existingValueIdsByOption.get(optionId) ?? new Set<number>();
      for (let j = 0; j < option.values.length; j++) {
        const value = option.values[j];
        if (value.id !== null && existingValueIds.has(value.id)) {
          await tx
            .update(productOptionValues)
            .set({ value: value.value, position: j })
            .where(eq(productOptionValues.id, value.id));
          keptValueIds.add(value.id);
        } else {
          const [insertedValue] = await tx
            .insert(productOptionValues)
            .values({ optionId, value: value.value, position: j })
            .returning({ id: productOptionValues.id });
          keptValueIds.add(insertedValue.id);
        }
      }
    }

    const optionIdsToDelete = existingOptions
      .map((o) => o.id)
      .filter((id) => !keptOptionIds.has(id));
    if (optionIdsToDelete.length > 0) {
      await tx.delete(productOptions).where(inArray(productOptions.id, optionIdsToDelete));
    }

    const valueIdsToDelete = existingOptions
      .filter((o) => keptOptionIds.has(o.id))
      .flatMap((o) => o.values.map((v) => v.id))
      .filter((id) => !keptValueIds.has(id));
    if (valueIdsToDelete.length > 0) {
      await tx
        .delete(productOptionValues)
        .where(inArray(productOptionValues.id, valueIdsToDelete));
    }

    await syncProductVariants(tx, productId);
  });

  revalidatePath(`/admin/productos/${productId}/editar`);
}

export type UpdateVariantsResult = { error?: string } | undefined;

export async function updateProductVariants(
  productId: number,
  rawVariants: unknown,
): Promise<UpdateVariantsResult> {
  const parsed = productVariantsInputSchema.safeParse(rawVariants);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Datos inválidos." };
  }

  await db.transaction(async (tx) => {
    for (const variant of parsed.data) {
      await tx
        .update(productVariants)
        .set({
          sku: variant.sku || null,
          priceCents: variant.priceCents,
          stock: variant.stock,
          active: variant.active,
        })
        .where(and(eq(productVariants.id, variant.id), eq(productVariants.productId, productId)));
    }

    const [{ total }] = await tx
      .select({ total: sql<string>`coalesce(sum(${productVariants.stock}), 0)` })
      .from(productVariants)
      .where(eq(productVariants.productId, productId));
    await tx
      .update(products)
      .set({ stock: Number(total) })
      .where(eq(products.id, productId));
  });

  revalidatePath(`/admin/productos/${productId}/editar`);
  revalidatePath("/admin/productos");
}
