import { z } from "zod";

export const checkoutCartItemSchema = z.object({
  productId: z.number().int().positive(),
  variantId: z.number().int().positive().nullable().optional(),
  quantity: z.number().int().positive(),
});

export const checkoutSchema = z
  .object({
    customerName: z.string().trim().min(2, "Ingresá tu nombre completo"),
    customerEmail: z.string().trim().email("Ingresá un email válido"),
    customerPhone: z.string().trim().min(6, "Ingresá un teléfono válido"),
    deliveryMethod: z.enum(["envio", "retiro"]),
    shippingNotes: z.string().trim().optional(),
    // Transferencia y efectivo (retiro en el local) están habilitados por ahora.
    paymentMethod: z.enum(["transferencia", "efectivo"]),
    installments: z.number().int().positive().optional(),
    items: z.array(checkoutCartItemSchema).min(1, "El carrito está vacío"),
  })
  .refine((data) => data.deliveryMethod === "retiro" || data.paymentMethod !== "efectivo", {
    message: "El pago en efectivo es solo para retiro en el local.",
    path: ["paymentMethod"],
  });

export type CheckoutInput = z.infer<typeof checkoutSchema>;
