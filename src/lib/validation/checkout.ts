import { z } from "zod";

export const checkoutCartItemSchema = z.object({
  productId: z.number().int().positive(),
  quantity: z.number().int().positive(),
});

export const checkoutSchema = z.object({
  customerName: z.string().trim().min(2, "Ingresá tu nombre completo"),
  customerEmail: z.string().trim().email("Ingresá un email válido"),
  customerPhone: z.string().trim().min(6, "Ingresá un teléfono válido"),
  shippingStreet: z.string().trim().min(3, "Ingresá tu dirección"),
  shippingCity: z.string().trim().min(2, "Ingresá tu ciudad"),
  shippingProvince: z.string().trim().min(2, "Ingresá tu provincia"),
  shippingPostalCode: z.string().trim().min(3, "Ingresá tu código postal"),
  shippingNotes: z.string().trim().optional(),
  // Solo transferencia bancaria está habilitada por ahora.
  paymentMethod: z.enum(["transferencia"]),
  installments: z.number().int().positive().optional(),
  items: z.array(checkoutCartItemSchema).min(1, "El carrito está vacío"),
});

export type CheckoutInput = z.infer<typeof checkoutSchema>;
