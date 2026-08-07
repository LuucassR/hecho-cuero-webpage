import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { ProductCard } from "@/components/product/ProductCard";
import { SortSelect } from "@/components/product/SortSelect";
import { getAllCategories, getProducts, type ProductSort } from "@/lib/products";
import { clsx } from "clsx";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Todos los productos — Hecho Cuero",
};

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ categoria?: string; orden?: string }>;
}) {
  const params = await searchParams;
  const sort = (params.orden as ProductSort) ?? "recientes";

  const [products, categories] = await Promise.all([
    getProducts({ categorySlug: params.categoria, sort }),
    getAllCategories(),
  ]);

  return (
    <Container className="py-12">
      <h1 className="mb-8 font-display text-3xl text-brand-900">Todos los productos</h1>

      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap gap-2">
          <Link
            href="/productos"
            className={clsx(
              "rounded-full px-4 py-1.5 text-sm font-medium",
              !params.categoria
                ? "bg-brand-900 text-cream-100"
                : "bg-brand-100 text-brand-800 hover:bg-brand-200",
            )}
          >
            Todas
          </Link>
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/productos?categoria=${cat.slug}`}
              className={clsx(
                "rounded-full px-4 py-1.5 text-sm font-medium",
                params.categoria === cat.slug
                  ? "bg-brand-900 text-cream-100"
                  : "bg-brand-100 text-brand-800 hover:bg-brand-200",
              )}
            >
              {cat.name}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2 text-sm">
          <label htmlFor="orden" className="text-muted">
            Ordenar por
          </label>
          <SortSelect value={sort} />
        </div>
      </div>

      {products.length > 0 ? (
        <div className="grid grid-cols-2 gap-x-5 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <p className="text-muted">No hay productos en esta categoría todavía.</p>
      )}
    </Container>
  );
}
