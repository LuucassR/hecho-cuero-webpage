"use server";

import { randomUUID } from "node:crypto";
import { eq, inArray, sql } from "drizzle-orm";
import { db } from "@/db";
import { orderItems, orders, products } from "@/db/schema";
import { checkoutSchema, type CheckoutInput } from "@/lib/validation/checkout";
import { sendOrderConfirmationEmail } from "@/lib/email/send-order-confirmation";

export type CreateOrderResult = { orderId: string } | { error: string };

export async function createOrder(input: CheckoutInput): Promise<CreateOrderResult> {
  const parsed = checkoutSchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Datos inválidos." };
  }
  const data = parsed.data;

  try {
    const order = await db.transaction(async (tx) => {
      const productIds = data.items.map((i) => i.productId);
      const dbProducts = await tx.query.products.findMany({
        where: inArray(products.id, productIds),
        with: { images: { orderBy: (img, { asc }) => [asc(img.position)], limit: 1 } },
      });

      const productMap = new Map(dbProducts.map((p) => [p.id, p]));
      let subtotalCents = 0;
      const itemsToInsert: (typeof orderItems.$inferInsert)[] = [];

      for (const item of data.items) {
        const product = productMap.get(item.productId);
        if (!product || !product.active) {
          throw new CheckoutError(`Uno de los productos ya no está disponible.`);
        }
        if (product.stock < item.quantity) {
          throw new CheckoutError(`No hay stock suficiente de "${product.name}".`);
        }
        const lineTotalCents = product.priceCents * item.quantity;
        subtotalCents += lineTotalCents;
        itemsToInsert.push({
          orderId: "", // filled in after order insert
          productId: product.id,
          productName: product.name,
          productImageUrl: product.images[0]?.url ?? null,
          unitPriceCents: product.priceCents,
          quantity: item.quantity,
          lineTotalCents,
        });
      }

      const settings = await tx.query.storeSettings.findFirst();
      const shippingCents = settings?.shippingFlatCents ?? 0;
      const totalCents = subtotalCents + shippingCents;
      const id = randomUUID();

      await tx.insert(orders).values({
        id,
        customerName: data.customerName,
        customerEmail: data.customerEmail,
        customerPhone: data.customerPhone,
        shippingStreet: data.shippingStreet,
        shippingCity: data.shippingCity,
        shippingProvince: data.shippingProvince,
        shippingPostalCode: data.shippingPostalCode,
        shippingNotes: data.shippingNotes || null,
        paymentMethod: data.paymentMethod,
        installments: null,
        subtotalCents,
        shippingCents,
        installmentsSurchargeCents: 0,
        totalCents,
        status: "pendiente_pago",
      });

      const insertedItems = itemsToInsert.map((item) => ({ ...item, orderId: id }));
      await tx.insert(orderItems).values(insertedItems);

      for (const item of data.items) {
        await tx
          .update(products)
          .set({ stock: sql`${products.stock} - ${item.quantity}` })
          .where(eq(products.id, item.productId));
      }

      return {
        id,
        customerName: data.customerName,
        customerEmail: data.customerEmail,
        subtotalCents,
        shippingCents,
        totalCents,
        items: insertedItems,
      };
    });

    // Best-effort: a failed email should never roll back or fail the order.
    try {
      await sendOrderConfirmationEmail(order);
    } catch (err) {
      console.error("No se pudo enviar el email de confirmación:", err);
    }

    return { orderId: order.id };
  } catch (err) {
    if (err instanceof CheckoutError) {
      return { error: err.message };
    }
    console.error(err);
    return { error: "No pudimos procesar tu pedido. Intentá de nuevo." };
  }
}

class CheckoutError extends Error {}
