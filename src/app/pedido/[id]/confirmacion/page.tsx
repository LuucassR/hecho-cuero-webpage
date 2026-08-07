import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { orders } from "@/db/schema";
import { Container } from "@/components/ui/Container";
import { LinkButton } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { formatCurrency, formatDate } from "@/lib/format";
import {
  DELIVERY_METHOD_LABELS,
  ORDER_STATUS_LABELS,
  ORDER_STATUS_TONES,
  PAYMENT_METHOD_LABELS,
} from "@/lib/orders";
import { BANK_TRANSFER_DETAILS } from "@/lib/payments/bank-transfer";
import { STORE_INFO } from "@/lib/store-info";

export const metadata: Metadata = {
  title: "Pedido confirmado — Hecho Cuero",
};

export default async function OrderConfirmationPage({
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
    <Container className="max-w-2xl py-16">
      <div className="text-center">
        <p className="text-sm font-semibold uppercase tracking-wide text-brand-500">
          ¡Gracias por tu compra!
        </p>
        <h1 className="mt-2 font-display text-3xl text-brand-900">Pedido recibido</h1>
        <p className="mt-2 text-muted">
          Número de pedido: <span className="font-mono text-brand-800">{order.id}</span>
        </p>
      </div>

      <div className="mt-8 rounded-2xl border border-border bg-surface p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="text-sm text-muted">{formatDate(order.createdAt)}</span>
          <Badge tone={ORDER_STATUS_TONES[order.status]}>
            {ORDER_STATUS_LABELS[order.status]}
          </Badge>
        </div>

        <ul className="mt-5 space-y-2 divide-y divide-border text-sm">
          {order.items.map((item) => (
            <li key={item.id} className="flex justify-between gap-2 pt-2 first:pt-0">
              <span className="text-brand-800">
                {item.productName} × {item.quantity}
              </span>
              <span className="text-brand-900">{formatCurrency(item.lineTotalCents)}</span>
            </li>
          ))}
        </ul>

        <div className="mt-5 space-y-1.5 border-t border-border pt-4 text-sm">
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

        <div className="mt-5 space-y-1 border-t border-border pt-4 text-sm text-brand-800">
          <p>
            Entrega:{" "}
            <span className="font-medium text-brand-900">
              {DELIVERY_METHOD_LABELS[order.deliveryMethod]}
            </span>
          </p>
          <p>
            Método de pago:{" "}
            <span className="font-medium text-brand-900">
              {PAYMENT_METHOD_LABELS[order.paymentMethod]}
              {order.installments && order.installments > 1
                ? ` en ${order.installments} cuotas`
                : ""}
            </span>
          </p>
        </div>

        {order.deliveryMethod === "retiro" && (
          <div className="mt-4 rounded-xl bg-brand-50 p-4 text-sm text-brand-800">
            <p className="font-medium text-brand-900">Retiro en el local</p>
            <p className="mt-1">{STORE_INFO.address}</p>
            <p className="mt-1 text-muted">
              {STORE_INFO.hoursDays}, de {STORE_INFO.hoursRanges.join(" y de ")}.
            </p>
            <p className="mt-2 text-muted">
              Te avisamos por WhatsApp cuando esté listo para retirar.
            </p>
          </div>
        )}

        {order.deliveryMethod === "envio" && (
          <div className="mt-4 rounded-xl bg-brand-50 p-4 text-sm text-brand-800">
            <p className="text-muted">
              Coordinamos el envío y su costo por WhatsApp al teléfono que dejaste.
            </p>
          </div>
        )}

        {order.paymentMethod === "transferencia" && (
          <div className="mt-4 rounded-xl bg-brand-50 p-4 text-sm text-brand-800">
            <p className="font-medium text-brand-900">Datos para transferir</p>
            <dl className="mt-2 space-y-1">
              <div className="flex justify-between"><dt>Titular</dt><dd>{BANK_TRANSFER_DETAILS.titular}</dd></div>
              <div className="flex justify-between"><dt>CBU</dt><dd>{BANK_TRANSFER_DETAILS.cbu}</dd></div>
              <div className="flex justify-between"><dt>Alias</dt><dd>{BANK_TRANSFER_DETAILS.alias}</dd></div>
            </dl>
            <p className="mt-2 text-muted">
              Envianos el comprobante por WhatsApp para confirmar tu pedido.
            </p>
          </div>
        )}

        {order.paymentMethod === "mercado_pago" && (
          <div className="mt-4 rounded-xl bg-brand-50 p-4 text-sm text-brand-800">
            La integración con Mercado Pago está en camino — te contactaremos para
            coordinar el pago.
          </div>
        )}
      </div>

      <div className="mt-8 text-center">
        <LinkButton href="/productos" variant="outline">
          Seguir comprando
        </LinkButton>
      </div>
    </Container>
  );
}
