import { and, asc, count, desc, eq } from "drizzle-orm";
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

// Each card loads its own image, so the page size is also the number of image
// requests per visit. Keep it small and let people page through the rest.
export const PRODUCTS_PER_PAGE = 12;

export type ProductsPage = {
  items: ProductSummary[];
  total: number;
  page: number;
  totalPages: number;
};

export async function getProductsPage(options: {
  categorySlug?: string;
  sort?: ProductSort;
  page?: number;
} = {}): Promise<ProductsPage> {
  let categoryId: number | undefined;
  if (options.categorySlug) {
    const category = await getCategoryBySlug(options.categorySlug);
    if (!category) return { items: [], total: 0, page: 1, totalPages: 1 };
    categoryId = category.id;
  }

  const where = categoryId
    ? and(eq(products.active, true), eq(products.categoryId, categoryId))
    : eq(products.active, true);

  // `id` breaks ties so products never repeat or vanish between pages.
  const orderBy =
    options.sort === "precio-asc"
      ? [asc(products.priceCents), asc(products.id)]
      : options.sort === "precio-desc"
        ? [desc(products.priceCents), asc(products.id)]
        : [desc(products.createdAt), desc(products.id)];

  const [{ total }] = await db.select({ total: count() }).from(products).where(where);
  const totalPages = Math.max(1, Math.ceil(total / PRODUCTS_PER_PAGE));
  const page = Math.min(Math.max(1, Math.trunc(options.page ?? 1) || 1), totalPages);

  const rows = await db.query.products.findMany({
    where,
    orderBy,
    limit: PRODUCTS_PER_PAGE,
    offset: (page - 1) * PRODUCTS_PER_PAGE,
    with: { images: { orderBy: (img, { asc }) => [asc(img.position)], limit: 1 } },
  });
  return { items: rows.map(toSummary), total, page, totalPages };
}

export async function getProductBySlug(slug: string) {
  return db.query.products.findFirst({
    where: and(eq(products.slug, slug), eq(products.active, true)),
    with: {
      images: { orderBy: (img, { asc }) => [asc(img.position)] },
      category: true,
      options: {
        orderBy: (opt, { asc }) => [asc(opt.position)],
        with: { values: { orderBy: (val, { asc }) => [asc(val.position)] } },
      },
      variants: {
        with: { variantValues: { with: { optionValue: true } } },
      },
    },
  });
}
