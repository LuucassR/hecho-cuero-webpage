export const ORDER_STATUS_LABELS = {
  pendiente_pago: "Pendiente de pago",
  pago_confirmado: "Pago confirmado",
  en_preparacion: "En preparación",
  enviado: "Enviado",
  entregado: "Entregado",
  cancelado: "Cancelado",
} as const;

export type OrderStatus = keyof typeof ORDER_STATUS_LABELS;

export const ORDER_STATUS_TONES: Record<
  OrderStatus,
  "neutral" | "success" | "warning" | "danger"
> = {
  pendiente_pago: "warning",
  pago_confirmado: "success",
  en_preparacion: "neutral",
  enviado: "neutral",
  entregado: "success",
  cancelado: "danger",
};

export const PAYMENT_METHOD_LABELS = {
  tarjeta_credito: "Tarjeta de crédito",
  tarjeta_debito: "Tarjeta de débito",
  mercado_pago: "Mercado Pago",
  transferencia: "Transferencia bancaria",
  efectivo: "Efectivo en el local",
} as const;

export type PaymentMethod = keyof typeof PAYMENT_METHOD_LABELS;

export const DELIVERY_METHOD_LABELS = {
  envio: "Envío a domicilio",
  retiro: "Retiro en el local",
} as const;

export type DeliveryMethod = keyof typeof DELIVERY_METHOD_LABELS;
