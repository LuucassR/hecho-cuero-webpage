import Link from "next/link";
import { ProductImage } from "./ProductImage";
import { formatCurrency } from "@/lib/format";
import { Badge } from "@/components/ui/Badge";

export type ProductSummary = {
  id: number;
  slug: string;
  name: string;
  priceCents: number;
  stock: number;
  imageUrl: string | null;
};

export function ProductCard({ product }: { product: ProductSummary }) {
  const outOfStock = product.stock <= 0;

  return (
    <Link href={`/productos/${product.slug}`} className="group block">
      <div className="relative aspect-square overflow-hidden rounded-2xl bg-brand-100">
        <ProductImage
          src={product.imageUrl}
          alt={product.name}
          className="h-full w-full transition-transform duration-300 group-hover:scale-105"
        />
        {outOfStock && (
          <div className="absolute left-3 top-3">
            <Badge tone="danger">Sin stock</Badge>
          </div>
        )}
      </div>
      <div className="mt-3 space-y-0.5">
        <h3 className="text-sm font-medium text-brand-900">{product.name}</h3>
        <p className="text-sm text-muted">{formatCurrency(product.priceCents)}</p>
      </div>
    </Link>
  );
}
