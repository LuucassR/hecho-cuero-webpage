import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { ProductGallery } from "@/components/product/ProductGallery";
import { ProductFeatures } from "@/components/product/ProductFeatures";
import { AddToCartForm } from "@/components/product/AddToCartForm";
import { formatCurrency } from "@/lib/format";
import { getProductBySlug } from "@/lib/products";
import { mapVariant } from "@/lib/variants";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  return { title: product ? `${product.name} — Hecho Cuero` : "Producto — Hecho Cuero" };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const options = product.options.map((opt) => ({
    id: opt.id,
    name: opt.name,
    values: opt.values.map((v) => ({ id: v.id, value: v.value })),
  }));
  const variants = product.variants.map(mapVariant);

  return (
    <Container className="py-12">
      <nav className="mb-6 text-sm text-muted">
        <Link href="/productos" className="hover:underline">
          Productos
        </Link>
        {product.category && (
          <>
            {" / "}
            <Link href={`/categorias/${product.category.slug}`} className="hover:underline">
              {product.category.name}
            </Link>
          </>
        )}
        {" / "}
        <span className="text-brand-900">{product.name}</span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-2">
        <div>
          <ProductGallery
            images={product.images.map((img) => ({ url: img.url, alt: img.alt }))}
            productName={product.name}
          />
          {product.specifications.length > 0 && (
            <div className="mt-6 border-t border-border pt-6">
              <h2 className="mb-1 text-sm font-semibold uppercase tracking-wide text-muted">
                Lo que hace especial a esta pieza
              </h2>
              <ProductFeatures items={product.specifications} />
            </div>
          )}
        </div>

        <div>
          <h1 className="font-display text-3xl text-brand-900">{product.name}</h1>
          <p className="mt-3 text-2xl font-semibold text-brand-900">
            {formatCurrency(product.priceCents)}
          </p>
          {product.description && (
            <p className="mt-5 whitespace-pre-line text-brand-800">{product.description}</p>
          )}

          <div className="mt-8 border-t border-border pt-6">
            <AddToCartForm
              productId={product.id}
              slug={product.slug}
              name={product.name}
              priceCents={product.priceCents}
              imageUrl={product.images[0]?.url ?? null}
              stock={product.stock}
              options={options}
              variants={variants}
            />
          </div>
        </div>
      </div>
    </Container>
  );
}
