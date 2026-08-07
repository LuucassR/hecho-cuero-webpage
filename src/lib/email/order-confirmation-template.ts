import { formatCurrency } from "@/lib/format";
import { BANK_TRANSFER_DETAILS } from "@/lib/payments/bank-transfer";
import { STORE_INFO } from "@/lib/store-info";

export type OrderConfirmationEmailData = {
  id: string;
  customerName: string;
  deliveryMethod: "envio" | "retiro";
  paymentMethod: "tarjeta_credito" | "tarjeta_debito" | "mercado_pago" | "transferencia" | "efectivo";
  subtotalCents: number;
  shippingCents: number;
  totalCents: number;
  items: {
    productName: string;
    variantLabel?: string | null;
    quantity: number;
    lineTotalCents: number;
  }[];
};

const BRAND_BROWN = "#4b2e1e";
const BRAND_TAN = "#a97142";
const BG = "#f7f3ee";
const BORDER = "#e2d8ca";

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function buildOrderConfirmationEmail(order: OrderConfirmationEmailData): {
  subject: string;
  html: string;
  text: string;
} {
  const shortId = order.id.slice(0, 8).toUpperCase();
  const subject = `Pedido confirmado #${shortId} — Hecho Cuero`;

  const itemsRowsHtml = order.items
    .map((item) => {
      const nameWithVariant = item.variantLabel
        ? `${escapeHtml(item.productName)} <span style="color:#9a8b7c;">(${escapeHtml(item.variantLabel)})</span>`
        : escapeHtml(item.productName);
      return `
        <tr>
          <td style="padding:10px 0;border-bottom:1px solid ${BORDER};color:${BRAND_BROWN};font-size:14px;">
            ${nameWithVariant} &times; ${item.quantity}
          </td>
          <td style="padding:10px 0;border-bottom:1px solid ${BORDER};color:${BRAND_BROWN};font-size:14px;text-align:right;white-space:nowrap;">
            ${formatCurrency(item.lineTotalCents)}
          </td>
        </tr>`;
    })
    .join("");

  const itemsRowsText = order.items
    .map((item) => {
      const name = item.variantLabel ? `${item.productName} (${item.variantLabel})` : item.productName;
      return `  - ${name} x${item.quantity}: ${formatCurrency(item.lineTotalCents)}`;
    })
    .join("\n");

  const storeHours = `${STORE_INFO.hoursDays}, de ${STORE_INFO.hoursRanges.join(" y de ")}`;

  const paymentInfoHtml =
    order.paymentMethod === "efectivo"
      ? `<p style="margin:0 0 8px;font-size:14px;font-weight:bold;color:${BRAND_BROWN};">Pago en efectivo</p>
         <p style="margin:0;font-size:13px;color:#6b5c4f;">
           Pagás al retirar tu pedido en ${escapeHtml(STORE_INFO.address)}.<br />${escapeHtml(storeHours)}.
         </p>`
      : `<p style="margin:0 0 8px;font-size:14px;font-weight:bold;color:${BRAND_BROWN};">Datos para transferir</p>
         <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
           <tr>
             <td style="padding:2px 0;font-size:13px;color:#6b5c4f;">Titular</td>
             <td style="padding:2px 0;font-size:13px;color:${BRAND_BROWN};text-align:right;">${escapeHtml(BANK_TRANSFER_DETAILS.titular)}</td>
           </tr>
           <tr>
             <td style="padding:2px 0;font-size:13px;color:#6b5c4f;">CBU</td>
             <td style="padding:2px 0;font-size:13px;color:${BRAND_BROWN};text-align:right;">${BANK_TRANSFER_DETAILS.cbu}</td>
           </tr>
           <tr>
             <td style="padding:2px 0;font-size:13px;color:#6b5c4f;">Alias</td>
             <td style="padding:2px 0;font-size:13px;color:${BRAND_BROWN};text-align:right;">${BANK_TRANSFER_DETAILS.alias}</td>
           </tr>
         </table>
         <p style="margin:12px 0 0;font-size:13px;color:#6b5c4f;">
           Envianos el comprobante por WhatsApp para confirmar tu pedido.
           ${
             order.deliveryMethod === "retiro"
               ? `Una vez confirmado, te avisamos para que pases a retirar por ${escapeHtml(STORE_INFO.address)} (${escapeHtml(storeHours)}).`
               : "Una vez confirmado el pago, coordinamos el envío por WhatsApp."
           }
         </p>`;

  const paymentInfoText =
    order.paymentMethod === "efectivo"
      ? `Pago en efectivo al retirar tu pedido en ${STORE_INFO.address}.\n${storeHours}.`
      : `Datos para transferir:
  Titular: ${BANK_TRANSFER_DETAILS.titular}
  CBU: ${BANK_TRANSFER_DETAILS.cbu}
  Alias: ${BANK_TRANSFER_DETAILS.alias}

Envianos el comprobante por WhatsApp para confirmar tu pedido.${
          order.deliveryMethod === "retiro"
            ? ` Una vez confirmado, te avisamos para que pases a retirar por ${STORE_INFO.address} (${storeHours}).`
            : " Una vez confirmado el pago, coordinamos el envío por WhatsApp."
        }`;

  const html = `<!doctype html>
<html lang="es">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${subject}</title>
  </head>
  <body style="margin:0;padding:0;background-color:${BG};font-family:Georgia,'Times New Roman',serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:${BG};padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;background-color:#ffffff;border-radius:16px;overflow:hidden;border:1px solid ${BORDER};">
            <tr>
              <td style="background-color:${BRAND_BROWN};padding:28px 32px;text-align:center;">
                <span style="font-size:22px;letter-spacing:0.08em;color:#ffffff;text-transform:uppercase;">Hecho Cuero</span>
              </td>
            </tr>
            <tr>
              <td style="padding:32px;">
                <p style="margin:0 0 4px;font-size:13px;text-transform:uppercase;letter-spacing:0.06em;color:${BRAND_TAN};font-weight:bold;">
                  ¡Gracias por tu compra, ${escapeHtml(order.customerName)}!
                </p>
                <h1 style="margin:4px 0 0;font-size:22px;color:${BRAND_BROWN};">Pedido confirmado</h1>
                <p style="margin:12px 0 0;font-size:14px;color:#6b5c4f;">
                  Número de pedido: <strong style="color:${BRAND_BROWN};font-family:monospace;">#${shortId}</strong>
                </p>

                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:24px;">
                  ${itemsRowsHtml}
                </table>

                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:12px;">
                  <tr>
                    <td style="padding:4px 0;font-size:14px;color:#6b5c4f;">Subtotal</td>
                    <td style="padding:4px 0;font-size:14px;color:#6b5c4f;text-align:right;">${formatCurrency(order.subtotalCents)}</td>
                  </tr>
                  <tr>
                    <td style="padding:4px 0;font-size:14px;color:#6b5c4f;">Envío</td>
                    <td style="padding:4px 0;font-size:14px;color:#6b5c4f;text-align:right;">${formatCurrency(order.shippingCents)}</td>
                  </tr>
                  <tr>
                    <td style="padding:10px 0 0;font-size:16px;font-weight:bold;color:${BRAND_BROWN};border-top:1px solid ${BORDER};">Total</td>
                    <td style="padding:10px 0 0;font-size:16px;font-weight:bold;color:${BRAND_BROWN};text-align:right;border-top:1px solid ${BORDER};">${formatCurrency(order.totalCents)}</td>
                  </tr>
                </table>

                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:24px;background-color:${BG};border-radius:12px;">
                  <tr>
                    <td style="padding:18px 20px;">
                      ${paymentInfoHtml}
                    </td>
                  </tr>
                </table>

                <p style="margin:28px 0 0;font-size:13px;color:#6b5c4f;">
                  Guardá este email como comprobante de tu pedido. Ante cualquier consulta,
                  respondé este correo o escribinos por WhatsApp mencionando tu número de pedido.
                </p>
              </td>
            </tr>
            <tr>
              <td style="padding:18px 32px;background-color:${BG};text-align:center;">
                <p style="margin:0;font-size:12px;color:#9a8b7c;">Hecho Cuero</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;

  const text = `¡Gracias por tu compra, ${order.customerName}!

Pedido confirmado — número de pedido #${shortId}

Productos:
${itemsRowsText}

Subtotal: ${formatCurrency(order.subtotalCents)}
Envío: ${formatCurrency(order.shippingCents)}
Total: ${formatCurrency(order.totalCents)}

${paymentInfoText}

— Hecho Cuero`;

  return { subject, html, text };
}
