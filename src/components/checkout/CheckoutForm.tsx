"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/cart/cart-context";
import { formatCurrency } from "@/lib/format";
import { BANK_TRANSFER_DETAILS } from "@/lib/payments/bank-transfer";
import { createOrder } from "@/app/checkout/actions";
import { Button, LinkButton } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Textarea } from "@/components/ui/Textarea";

type PaymentMethod = "transferencia";

const paymentMethod: PaymentMethod = "transferencia";

export function CheckoutForm({ shippingCents }: { shippingCents: number }) {
  const { items, subtotalCents, clear } = useCart();
  const router = useRouter();

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const totalCents = subtotalCents + shippingCents;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const result = await createOrder({
      customerName: String(formData.get("customerName") ?? ""),
      customerEmail: String(formData.get("customerEmail") ?? ""),
      customerPhone: String(formData.get("customerPhone") ?? ""),
      shippingStreet: String(formData.get("shippingStreet") ?? ""),
      shippingCity: String(formData.get("shippingCity") ?? ""),
      shippingProvince: String(formData.get("shippingProvince") ?? ""),
      shippingPostalCode: String(formData.get("shippingPostalCode") ?? ""),
      shippingNotes: String(formData.get("shippingNotes") ?? ""),
      paymentMethod,
      items: items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
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
          <h2 className="mb-4 font-display text-xl text-brand-900">1. Datos de envío</h2>
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
            <div className="sm:col-span-2">
              <Label htmlFor="shippingStreet">Dirección</Label>
              <Input id="shippingStreet" name="shippingStreet" required />
            </div>
            <div>
              <Label htmlFor="shippingCity">Ciudad</Label>
              <Input id="shippingCity" name="shippingCity" required />
            </div>
            <div>
              <Label htmlFor="shippingProvince">Provincia</Label>
              <Input id="shippingProvince" name="shippingProvince" required />
            </div>
            <div>
              <Label htmlFor="shippingPostalCode">Código postal</Label>
              <Input id="shippingPostalCode" name="shippingPostalCode" required />
            </div>
            <div className="sm:col-span-2">
              <Label htmlFor="shippingNotes">Notas para la entrega (opcional)</Label>
              <Textarea id="shippingNotes" name="shippingNotes" rows={2} />
            </div>
          </div>
        </section>

        <section>
          <h2 className="mb-4 font-display text-xl text-brand-900">2. Método de pago</h2>
          <div className="rounded-xl border border-brand-900 bg-brand-100 p-5 text-sm text-brand-800">
            <p className="font-medium text-brand-900">Transferencia bancaria</p>
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
              Por el momento solo aceptamos pagos por transferencia.
            </p>
          </div>
        </section>
      </div>

      <aside className="h-fit space-y-4 rounded-2xl border border-border bg-surface p-6">
        <h2 className="font-display text-lg text-brand-900">Resumen</h2>
        <ul className="space-y-2 text-sm text-brand-800">
          {items.map((item) => (
            <li key={item.productId} className="flex justify-between gap-2">
              <span className="line-clamp-1">
                {item.name} × {item.quantity}
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
            <span>{formatCurrency(shippingCents)}</span>
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
