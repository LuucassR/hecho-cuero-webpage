"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { clsx } from "clsx";
import { useCart } from "@/lib/cart/cart-context";
import { formatCurrency } from "@/lib/format";
import { BANK_TRANSFER_DETAILS } from "@/lib/payments/bank-transfer";
import { STORE_INFO } from "@/lib/store-info";
import { createOrder } from "@/app/checkout/actions";
import { Button, LinkButton } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Textarea } from "@/components/ui/Textarea";

type DeliveryMethod = "envio" | "retiro";
type PaymentMethod = "transferencia" | "efectivo";

export function CheckoutForm({ shippingCents }: { shippingCents: number }) {
  const { items, subtotalCents, clear } = useCart();
  const router = useRouter();

  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod>("envio");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("transferencia");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const effectiveShippingCents = deliveryMethod === "retiro" ? 0 : shippingCents;
  const totalCents = subtotalCents + effectiveShippingCents;

  function handleDeliveryChange(method: DeliveryMethod) {
    setDeliveryMethod(method);
    if (method === "envio" && paymentMethod === "efectivo") {
      setPaymentMethod("transferencia");
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const result = await createOrder({
      customerName: String(formData.get("customerName") ?? ""),
      customerEmail: String(formData.get("customerEmail") ?? ""),
      customerPhone: String(formData.get("customerPhone") ?? ""),
      deliveryMethod,
      shippingNotes: String(formData.get("shippingNotes") ?? ""),
      paymentMethod,
      items: items.map((i) => ({
        productId: i.productId,
        variantId: i.variantId,
        quantity: i.quantity,
      })),
    });

    setSubmitting(false);

    if ("error" in result) {
      setError(result.error);
      return;
    }

    clear();
    router.push(`/pedido/${result.orderId}/confirmacion`);
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center gap-4 py-24 text-center">
        <p className="text-muted">Tu carrito está vacío.</p>
        <LinkButton href="/productos">Ver productos</LinkButton>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-10 lg:grid-cols-[1fr_380px]">
      <div className="space-y-10">
        <section>
          <h2 className="mb-4 font-display text-xl text-brand-900">1. Tus datos</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <Label htmlFor="customerName">Nombre y apellido</Label>
              <Input id="customerName" name="customerName" required />
            </div>
            <div>
              <Label htmlFor="customerEmail">Email</Label>
              <Input id="customerEmail" name="customerEmail" type="email" required />
            </div>
            <div>
              <Label htmlFor="customerPhone">Teléfono</Label>
              <Input id="customerPhone" name="customerPhone" required />
            </div>
          </div>
        </section>

        <section>
          <h2 className="mb-4 font-display text-xl text-brand-900">2. Entrega</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => handleDeliveryChange("envio")}
              className={clsx(
                "rounded-xl border p-4 text-left transition",
                deliveryMethod === "envio"
                  ? "border-brand-900 bg-brand-100"
                  : "border-border hover:border-brand-300",
              )}
            >
              <p className="font-medium text-brand-900">Envío a domicilio</p>
              <p className="mt-1 text-sm text-muted">
                Coordinamos el envío y su costo por WhatsApp una vez confirmado el pedido.
              </p>
            </button>
            <button
              type="button"
              onClick={() => handleDeliveryChange("retiro")}
              className={clsx(
                "rounded-xl border p-4 text-left transition",
                deliveryMethod === "retiro"
                  ? "border-brand-900 bg-brand-100"
                  : "border-border hover:border-brand-300",
              )}
            >
              <p className="font-medium text-brand-900">Retiro en el local</p>
              <p className="mt-1 text-sm text-muted">Sin costo de envío. Pagás en efectivo.</p>
            </button>
          </div>

          {deliveryMethod === "envio" ? (
            <div className="mt-4">
              <Label htmlFor="shippingNotes">Localidad o referencia para el envío (opcional)</Label>
              <Textarea
                id="shippingNotes"
                name="shippingNotes"
                rows={2}
                placeholder="Ej: Santa Fe capital, barrio Candioti"
              />
              <p className="mt-2 text-sm text-muted">
                No hace falta que cargues la dirección completa acá: te vamos a escribir por
                WhatsApp al número que dejaste para coordinar la dirección y el costo del envío.
              </p>
            </div>
          ) : (
            <div className="mt-4 rounded-xl border border-brand-900 bg-brand-100 p-5 text-sm text-brand-800">
              <p className="font-medium text-brand-900">{STORE_INFO.address}</p>
              <p className="mt-1 text-muted">
                {STORE_INFO.hoursDays}, de {STORE_INFO.hoursRanges.join(" y de ")}.
              </p>
              <p className="mt-2 text-muted">
                Te avisamos por WhatsApp cuando tu pedido esté listo para retirar.
              </p>
              <input type="hidden" name="shippingNotes" value="" />
            </div>
          )}
        </section>

        <section>
          <h2 className="mb-4 font-display text-xl text-brand-900">3. Método de pago</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => setPaymentMethod("transferencia")}
              className={clsx(
                "rounded-xl border p-4 text-left transition",
                paymentMethod === "transferencia"
                  ? "border-brand-900 bg-brand-100"
                  : "border-border hover:border-brand-300",
              )}
            >
              <p className="font-medium text-brand-900">Transferencia bancaria</p>
              <p className="mt-1 text-sm text-muted">Confirmamos tu pedido por WhatsApp.</p>
            </button>
            <button
              type="button"
              onClick={() => deliveryMethod === "retiro" && setPaymentMethod("efectivo")}
              disabled={deliveryMethod !== "retiro"}
              className={clsx(
                "rounded-xl border p-4 text-left transition",
                paymentMethod === "efectivo"
                  ? "border-brand-900 bg-brand-100"
                  : "border-border hover:border-brand-300",
                deliveryMethod !== "retiro" && "cursor-not-allowed opacity-50",
              )}
            >
              <p className="font-medium text-brand-900">Efectivo en el local</p>
              <p className="mt-1 text-sm text-muted">
                {deliveryMethod === "retiro"
                  ? "Pagás al retirar tu pedido."
                  : "Disponible solo con retiro en el local."}
              </p>
            </button>
          </div>

          {paymentMethod === "transferencia" ? (
            <div className="mt-4 rounded-xl border border-border bg-surface p-5 text-sm text-brand-800">
              <p className="font-medium text-brand-900">Datos para transferir</p>
              <dl className="mt-2 space-y-1 text-muted">
                <div className="flex justify-between">
                  <dt>Titular</dt>
                  <dd>{BANK_TRANSFER_DETAILS.titular}</dd>
                </div>
                <div className="flex justify-between">
                  <dt>CBU</dt>
                  <dd>{BANK_TRANSFER_DETAILS.cbu}</dd>
                </div>
                <div className="flex justify-between">
                  <dt>Alias</dt>
                  <dd>{BANK_TRANSFER_DETAILS.alias}</dd>
                </div>
              </dl>
              <p className="mt-3 text-muted">
                Tu pedido queda pendiente hasta que confirmemos la transferencia por WhatsApp.
              </p>
            </div>
          ) : (
            <div className="mt-4 rounded-xl border border-border bg-surface p-5 text-sm text-brand-800">
              <p>
                Pagás en efectivo cuando pasás a retirar tu pedido por {STORE_INFO.address}
                {" — "}
                {STORE_INFO.hoursDays}, de {STORE_INFO.hoursRanges.join(" y de ")}.
              </p>
            </div>
          )}
        </section>
      </div>

      <aside className="h-fit space-y-4 rounded-2xl border border-border bg-surface p-6">
        <h2 className="font-display text-lg text-brand-900">Resumen</h2>
        <ul className="space-y-2 text-sm text-brand-800">
          {items.map((item) => (
            <li
              key={`${item.productId}-${item.variantId ?? "base"}`}
              className="flex justify-between gap-2"
            >
              <span className="line-clamp-1">
                {item.name}
                {item.variantLabel ? ` (${item.variantLabel})` : ""} × {item.quantity}
              </span>
              <span>{formatCurrency(item.priceCents * item.quantity)}</span>
            </li>
          ))}
        </ul>
        <div className="space-y-1.5 border-t border-border pt-3 text-sm">
          <div className="flex justify-between text-brand-800">
            <span>Subtotal</span>
            <span>{formatCurrency(subtotalCents)}</span>
          </div>
          <div className="flex justify-between text-brand-800">
            <span>Envío</span>
            <span>
              {deliveryMethod === "retiro" ? "Sin cargo" : formatCurrency(effectiveShippingCents)}
            </span>
          </div>
          <div className="flex justify-between pt-1 text-base font-semibold text-brand-900">
            <span>Total</span>
            <span>{formatCurrency(totalCents)}</span>
          </div>
        </div>

        {error && <p className="text-sm text-red-700">{error}</p>}

        <Button type="submit" size="lg" className="w-full" disabled={submitting}>
          {submitting ? "Procesando..." : "Confirmar pedido"}
        </Button>
        <p className="text-center text-xs text-muted">
          Te vamos a enviar un email con los detalles de tu pedido.
        </p>
      </aside>
    </form>
  );
}
