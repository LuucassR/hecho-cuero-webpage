import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { ProductCard } from "@/components/product/ProductCard";
import { Pagination } from "@/components/product/Pagination";
import { getCategoryBySlug, getProductsPage } from "@/lib/products";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  return { title: category ? `${category.name} — Hecho Cuero` : "Categoría — Hecho Cuero" };
}

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ pagina?: string }>;
}) {
  const { slug } = await params;
  const { pagina } = await searchParams;
  const category = await getCategoryBySlug(slug);
  if (!category) notFound();

  const { items: products, page, totalPages } = await getProductsPage({
    categorySlug: slug,
    page: Number(pagina),
  });

  return (
    <Container className="py-12">
      {category.imageUrl && (
        <div className="relative mb-8 aspect-[16/6] w-full overflow-hidden rounded-2xl">
          <Image
            src={category.imageUrl}
            alt={category.name}
            fill
            sizes="(min-width: 1280px) 1216px, 100vw"
            className="object-cover"
          />
        </div>
      )}
      <h1 className="font-display text-3xl text-brand-900">{category.name}</h1>
      {category.description && (
        <p className="mt-2 max-w-xl text-muted">{category.description}</p>
      )}

      <div className="mt-8">
        {products.length > 0 ? (
          <>
            <div className="grid grid-cols-2 gap-x-5 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
            <Pagination page={page} totalPages={totalPages} basePath={`/categorias/${slug}`} />
          </>
        ) : (
          <p className="text-muted">No hay productos en esta categoría todavía.</p>
        )}
      </div>
    </Container>
  );
}
