import Link from "next/link";
import { clsx } from "clsx";
import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { orders } from "@/db/schema";
import { formatCurrency, formatDate } from "@/lib/format";
import { Badge } from "@/components/ui/Badge";
import {
  ORDER_STATUS_LABELS,
  ORDER_STATUS_TONES,
  PAYMENT_METHOD_LABELS,
  type OrderStatus,
} from "@/lib/orders";

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ estado?: string }>;
}) {
  const { estado } = await searchParams;
  const statusFilter = estado as OrderStatus | undefined;

  const allOrders = await db.query.orders.findMany({
    where: statusFilter ? eq(orders.status, statusFilter) : undefined,
    orderBy: desc(orders.createdAt),
  });

  return (
    <div>
      <h1 className="mb-8 font-display text-2xl text-brand-900">Pedidos</h1>

      <div className="mb-6 flex flex-wrap gap-2">
        <Link
          href="/admin/pedidos"
          className={clsx(
            "rounded-full px-4 py-1.5 text-sm font-medium",
            !statusFilter ? "bg-brand-900 text-cream-100" : "bg-brand-100 text-brand-800",
          )}
        >
          Todos
        </Link>
        {Object.entries(ORDER_STATUS_LABELS).map(([value, label]) => (
          <Link
            key={value}
            href={`/admin/pedidos?estado=${value}`}
            className={clsx(
              "rounded-full px-4 py-1.5 text-sm font-medium",
              statusFilter === value ? "bg-brand-900 text-cream-100" : "bg-brand-100 text-brand-800",
            )}
          >
            {label}
          </Link>
        ))}
      </div>

      <div className="overflow-x-auto rounded-2xl border border-border bg-surface">
        <table className="w-full min-w-[720px] text-sm">
          <thead>
            <tr className="border-b border-border text-left text-muted">
              <th className="px-4 py-3 font-medium">Fecha</th>
              <th className="px-4 py-3 font-medium">Cliente</th>
              <th className="px-4 py-3 font-medium">Pago</th>
              <th className="px-4 py-3 font-medium">Total</th>
              <th className="px-4 py-3 font-medium">Estado</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {allOrders.map((order) => (
              <tr key={order.id} className="border-b border-border last:border-0">
                <td className="px-4 py-3 text-brand-800">{formatDate(order.createdAt)}</td>
                <td className="px-4 py-3 text-brand-900">{order.customerName}</td>
                <td className="px-4 py-3 text-brand-800">
                  {PAYMENT_METHOD_LABELS[order.paymentMethod]}
                </td>
                <td className="px-4 py-3 text-brand-800">{formatCurrency(order.totalCents)}</td>
                <td className="px-4 py-3">
                  <Badge tone={ORDER_STATUS_TONES[order.status]}>
                    {ORDER_STATUS_LABELS[order.status]}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-right">
                  <Link
                    href={`/admin/pedidos/${order.id}`}
                    className="text-sm font-medium text-brand-800 hover:underline"
                  >
                    Ver
                  </Link>
                </td>
              </tr>
            ))}
            {allOrders.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-muted">
                  No hay pedidos todavía.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
