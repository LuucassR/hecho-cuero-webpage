import Link from "next/link";
import Image from "next/image";
import { count, desc } from "drizzle-orm";
import { db } from "@/db";
import { products } from "@/db/schema";
import { formatCurrency } from "@/lib/format";
import { LinkButton } from "@/components/ui/Button";
import { ActiveToggle } from "@/components/admin/ActiveToggle";
import { Pagination } from "@/components/product/Pagination";

// Table rows are light (a 40px thumbnail each), so a page can hold more than
// the storefront grid.
const ADMIN_PRODUCTS_PER_PAGE = 25;

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ pagina?: string }>;
}) {
  const params = await searchParams;
  const [{ total }] = await db.select({ total: count() }).from(products);
  const totalPages = Math.max(1, Math.ceil(total / ADMIN_PRODUCTS_PER_PAGE));
  const page = Math.min(Math.max(1, Math.trunc(Number(params.pagina)) || 1), totalPages);

  const allProducts = await db.query.products.findMany({
    // Many products share a createdAt (bulk loads), so `id` keeps the order
    // stable and stops rows from repeating or vanishing between pages.
    orderBy: [desc(products.createdAt), desc(products.id)],
    limit: ADMIN_PRODUCTS_PER_PAGE,
    offset: (page - 1) * ADMIN_PRODUCTS_PER_PAGE,
    with: {
      category: true,
      images: { orderBy: (img, { asc }) => [asc(img.position)], limit: 1 },
    },
  });

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl text-brand-900">Productos</h1>
          {total > 0 && <p className="mt-1 text-sm text-muted">{total} en total</p>}
        </div>
        <LinkButton href="/admin/productos/nuevo">+ Nuevo producto</LinkButton>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-border bg-surface">
        <table className="w-full min-w-[720px] text-sm">
          <thead>
            <tr className="border-b border-border text-left text-muted">
              <th className="px-4 py-3 font-medium">Producto</th>
              <th className="px-4 py-3 font-medium">Categoría</th>
              <th className="px-4 py-3 font-medium">Precio</th>
              <th className="px-4 py-3 font-medium">Stock</th>
              <th className="px-4 py-3 font-medium">Estado</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {allProducts.map((product) => (
              <tr key={product.id} className="border-b border-border last:border-0">
                <td className="flex items-center gap-3 px-4 py-3">
                  <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-brand-100">
                    {product.images[0] && (
                      <Image
                        src={product.images[0].url}
                        alt=""
                        fill
                        sizes="40px"
                        className="object-cover"
                      />
                    )}
                  </div>
                  <span className="font-medium text-brand-900">{product.name}</span>
                </td>
                <td className="px-4 py-3 text-brand-800">{product.category?.name ?? "—"}</td>
                <td className="px-4 py-3 text-brand-800">{formatCurrency(product.priceCents)}</td>
                <td className="px-4 py-3 text-brand-800">{product.stock}</td>
                <td className="px-4 py-3">
                  <ActiveToggle id={product.id} active={product.active} />
                </td>
                <td className="px-4 py-3 text-right">
                  <Link
                    href={`/admin/productos/${product.id}/editar`}
                    className="text-sm font-medium text-brand-800 hover:underline"
                  >
                    Editar
                  </Link>
                </td>
              </tr>
            ))}
            {allProducts.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-muted">
                  Todavía no cargaste productos.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Pagination page={page} totalPages={totalPages} basePath="/admin/productos" />
    </div>
  );
}
