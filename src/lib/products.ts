import { and, asc, desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { categories, products } from "@/db/schema";
import type { ProductSummary } from "@/components/product/ProductCard";

function toSummary(p: {
  id: number;
  slug: string;
  name: string;
  priceCents: number;
  stock: number;
  images: { url: string }[];
}): ProductSummary {
  return {
    id: p.id,
    slug: p.slug,
    name: p.name,
    priceCents: p.priceCents,
    stock: p.stock,
    imageUrl: p.images[0]?.url ?? null,
  };
}

export async function getFeaturedProducts(limit = 8): Promise<ProductSummary[]> {
  const rows = await db.query.products.findMany({
    where: eq(products.active, true),
    orderBy: desc(products.createdAt),
    limit,
    with: { images: { orderBy: (img, { asc }) => [asc(img.position)], limit: 1 } },
  });
  return rows.map(toSummary);
}

export async function getAllCategories() {
  return db.query.categories.findMany({ orderBy: asc(categories.name) });
}

export async function getCategoryBySlug(slug: string) {
  return db.query.categories.findFirst({ where: eq(categories.slug, slug) });
}

export type ProductSort = "recientes" | "precio-asc" | "precio-desc";

export async function getProducts(options: {
  categorySlug?: string;
  sort?: ProductSort;
} = {}): Promise<ProductSummary[]> {
  let categoryId: number | undefined;
  if (options.categorySlug) {
    const category = await getCategoryBySlug(options.categorySlug);
    if (!category) return [];
    categoryId = category.id;
  }

  const orderBy =
    options.sort === "precio-asc"
      ? asc(products.priceCents)
      : options.sort === "precio-desc"
        ? desc(products.priceCents)
        : desc(products.createdAt);

  const rows = await db.query.products.findMany({
    where: categoryId
      ? and(eq(products.active, true), eq(products.categoryId, categoryId))
      : eq(products.active, true),
    orderBy,
    with: { images: { orderBy: (img, { asc }) => [asc(img.position)], limit: 1 } },
  });
  return rows.map(toSummary);
}

export async function getProductBySlug(slug: string) {
  return db.query.products.findFirst({
    where: and(eq(products.slug, slug), eq(products.active, true)),
    with: {
      images: { orderBy: (img, { asc }) => [asc(img.position)] },
      category: true,
    },
  });
}
