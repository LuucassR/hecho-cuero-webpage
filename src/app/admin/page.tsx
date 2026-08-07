import Link from "next/link";
import { count, eq } from "drizzle-orm";
import { db } from "@/db";
import { categories, orders, products } from "@/db/schema";

async function getStats() {
  const [[{ value: activeProducts }], [{ value: totalCategories }], [{ value: pendingOrders }], [{ value: totalOrders }]] =
    await Promise.all([
      db.select({ value: count() }).from(products).where(eq(products.active, true)),
      db.select({ value: count() }).from(categories),
      db
        .select({ value: count() })
        .from(orders)
        .where(eq(orders.status, "pendiente_pago")),
      db.select({ value: count() }).from(orders),
    ]);
  return { activeProducts, totalCategories, pendingOrders, totalOrders };
}

export default async function AdminDashboardPage() {
  const stats = await getStats();

  const cards = [
    { label: "Productos activos", value: stats.activeProducts, href: "/admin/productos" },
    { label: "Categorías", value: stats.totalCategories, href: "/admin/categorias" },
    { label: "Pedidos pendientes de pago", value: stats.pendingOrders, href: "/admin/pedidos" },
    { label: "Pedidos totales", value: stats.totalOrders, href: "/admin/pedidos" },
  ];

  return (
    <div>
      <h1 className="mb-8 font-display text-2xl text-brand-900">Panel</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className="rounded-2xl border border-border bg-surface p-5 hover:border-brand-400"
          >
            <p className="text-sm text-muted">{card.label}</p>
            <p className="mt-2 font-display text-3xl text-brand-900">{card.value}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
