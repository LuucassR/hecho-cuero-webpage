import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { orders } from "@/db/schema";
import { formatCurrency, formatDate } from "@/lib/format";
import { OrderStatusSelect } from "@/components/admin/OrderStatusSelect";
import { DELIVERY_METHOD_LABELS, PAYMENT_METHOD_LABELS } from "@/lib/orders";

export default async function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const order = await db.query.orders.findFirst({
    where: eq(orders.id, id),
    with: { items: true },
  });
  if (!order) notFound();

  return (
    <div className="max-w-3xl">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl text-brand-900">Pedido {order.id.slice(0, 8)}</h1>
          <p className="text-sm text-muted">{formatDate(order.createdAt)}</p>
        </div>
        <OrderStatusSelect orderId={order.id} status={order.status} />
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="rounded-2xl border border-border bg-surface p-5">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted">
            Cliente
          </h2>
          <p className="text-sm text-brand-900">{order.customerName}</p>
          <p className="text-sm text-brand-800">{order.customerEmail}</p>
          <p className="text-sm text-brand-800">{order.customerPhone}</p>
        </div>

        <div className="rounded-2xl border border-border bg-surface p-5">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted">
            Entrega
          </h2>
          <p className="text-sm text-brand-900">{DELIVERY_METHOD_LABELS[order.deliveryMethod]}</p>
          {order.deliveryMethod === "envio" && (
            <p className="mt-1 text-sm text-muted">
              Coordinar dirección y costo por WhatsApp.
            </p>
          )}
          {(order.shippingStreet || order.shippingCity) && (
            <p className="mt-1 text-sm text-brand-800">
              {[order.shippingStreet, order.shippingCity, order.shippingProvince]
                .filter(Boolean)
                .join(", ")}
              {order.shippingPostalCode ? ` (${order.shippingPostalCode})` : ""}
            </p>
          )}
          {order.shippingNotes && (
            <p className="mt-1 text-sm text-muted">{order.shippingNotes}</p>
          )}
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-border bg-surface p-5">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted">
          Pago
        </h2>
        <p className="text-sm text-brand-900">
          {PAYMENT_METHOD_LABELS[order.paymentMethod]}
          {order.installments && order.installments > 1 ? ` en ${order.installments} cuotas` : ""}
        </p>
      </div>

      <div className="mt-6 rounded-2xl border border-border bg-surface p-5">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted">
          Productos
        </h2>
        <ul className="divide-y divide-border text-sm">
          {order.items.map((item) => (
            <li key={item.id} className="flex justify-between gap-2 py-2 first:pt-0">
              <span className="text-brand-800">
                {item.productName}
                {item.variantLabel && (
                  <span className="text-muted"> ({item.variantLabel})</span>
                )}{" "}
                × {item.quantity}
              </span>
              <span className="text-brand-900">{formatCurrency(item.lineTotalCents)}</span>
            </li>
          ))}
        </ul>
        <div className="mt-4 space-y-1 border-t border-border pt-3 text-sm">
          <div className="flex justify-between text-brand-800">
            <span>Subtotal</span>
            <span>{formatCurrency(order.subtotalCents)}</span>
          </div>
          {order.installmentsSurchargeCents > 0 && (
            <div className="flex justify-between text-brand-800">
              <span>Recargo por cuotas</span>
              <span>{formatCurrency(order.installmentsSurchargeCents)}</span>
            </div>
          )}
          <div className="flex justify-between pt-1 text-base font-semibold text-brand-900">
            <span>Total</span>
            <span>{formatCurrency(order.totalCents)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
