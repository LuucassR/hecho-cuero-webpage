"use client";

import { Button } from "@/components/ui/Button";
import { formatCurrency } from "@/lib/format";
import { DELIVERY_METHOD_LABELS, PAYMENT_METHOD_LABELS } from "@/lib/orders";
import { STORE_INFO } from "@/lib/store-info";

type OrderWhatsAppButtonProps = {
  orderId: string;
  customerName: string;
  deliveryMethod: keyof typeof DELIVERY_METHOD_LABELS;
  paymentMethod: keyof typeof PAYMENT_METHOD_LABELS;
  totalCents: number;
  items: { productName: string; variantLabel: string | null; quantity: number; lineTotalCents: number }[];
};

export function OrderWhatsAppButton({
  orderId,
  customerName,
  deliveryMethod,
  paymentMethod,
  totalCents,
  items,
}: OrderWhatsAppButtonProps) {
  const isTransferencia = paymentMethod === "transferencia";

  function handleClick() {
    const lines = [
      `¡Hola! Soy ${customerName} y quiero confirmar mi pedido #${orderId}.`,
      "",
      "Productos:",
      ...items.map(
        (item) =>
          `- ${item.productName}${item.variantLabel ? ` (${item.variantLabel})` : ""} x${item.quantity} — ${formatCurrency(item.lineTotalCents)}`,
      ),
      "",
      `Total: ${formatCurrency(totalCents)}`,
      `Entrega: ${DELIVERY_METHOD_LABELS[deliveryMethod]}`,
      `Pago: ${PAYMENT_METHOD_LABELS[paymentMethod]}`,
      "",
      isTransferencia
        ? "Te paso el comprobante de la transferencia a continuación."
        : "Pago en efectivo al retirar el pedido en el local.",
    ];

    const message = encodeURIComponent(lines.join("\n"));
    window.open(`${STORE_INFO.whatsappHref}?text=${message}`, "_blank", "noopener,noreferrer");
  }

  return (
    <div className="mt-4 rounded-xl border border-brand-900 bg-brand-100 p-5 text-sm text-brand-800">
      <p className="font-medium text-brand-900">
        {isTransferencia ? "Enviá el comprobante por WhatsApp" : "Confirmá tu pedido por WhatsApp"}
      </p>
      <p className="mt-1 text-muted">
        {isTransferencia
          ? "Abrimos WhatsApp con el detalle de tu pedido ya redactado: adjuntá el comprobante de la transferencia para que confirmemos el pago."
          : "Abrimos WhatsApp con el detalle de tu pedido ya redactado para avisarnos que vas a pagar en efectivo al retirarlo."}
      </p>
      <Button type="button" onClick={handleClick} className="mt-3 w-full sm:w-auto">
        {isTransferencia ? "Enviar comprobante por WhatsApp" : "Confirmar pedido por WhatsApp"}
      </Button>
    </div>
  );
}
