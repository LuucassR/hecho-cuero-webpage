"use server";

import { randomUUID } from "node:crypto";
import { eq, inArray, sql } from "drizzle-orm";
import { db } from "@/db";
import { orderItems, orders, productVariants, products } from "@/db/schema";
import { checkoutSchema, type CheckoutInput } from "@/lib/validation/checkout";
import { sendOrderConfirmationEmail } from "@/lib/email/send-order-confirmation";
import { mapVariant, variantLabel } from "@/lib/variants";

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
        with: {
          images: { orderBy: (img, { asc }) => [asc(img.position)], limit: 1 },
          options: {
            orderBy: (opt, { asc }) => [asc(opt.position)],
            with: { values: { orderBy: (val, { asc }) => [asc(val.position)] } },
          },
          variants: { with: { variantValues: { with: { optionValue: true } } } },
        },
      });

      const productMap = new Map(dbProducts.map((p) => [p.id, p]));
      let subtotalCents = 0;
      const itemsToInsert: (typeof orderItems.$inferInsert)[] = [];
      const variantStockUpdates: { variantId: number; quantity: number }[] = [];

      for (const item of data.items) {
        const product = productMap.get(item.productId);
        if (!product || !product.active) {
          throw new CheckoutError(`Uno de los productos ya no está disponible.`);
        }

        let unitPriceCents = product.priceCents;
        let label: string | null = null;
        let variantId: number | null = null;

        if (product.variants.length > 0) {
          const mappedVariants = product.variants.map(mapVariant);
          const variant = mappedVariants.find((v) => v.id === item.variantId);
          if (!variant || !variant.active) {
            throw new CheckoutError(`Elegí las opciones de "${product.name}".`);
          }
          if (variant.stock < item.quantity) {
            throw new CheckoutError(`No hay stock suficiente de "${product.name}".`);
          }
          unitPriceCents = variant.priceCents ?? product.priceCents;
          label = variantLabel(
            variant,
            product.options.map((o) => ({
              id: o.id,
              name: o.name,
              values: o.values.map((v) => ({ id: v.id, value: v.value })),
            })),
          );
          variantId = variant.id;
          variantStockUpdates.push({ variantId: variant.id, quantity: item.quantity });
        } else {
          if (product.stock < item.quantity) {
            throw new CheckoutError(`No hay stock suficiente de "${product.name}".`);
          }
        }

        const lineTotalCents = unitPriceCents * item.quantity;
        subtotalCents += lineTotalCents;
        itemsToInsert.push({
          orderId: "", // filled in after order insert
          productId: product.id,
          productVariantId: variantId,
          productName: product.name,
          variantLabel: label,
          productImageUrl: product.images[0]?.url ?? null,
          unitPriceCents,
          quantity: item.quantity,
          lineTotalCents,
        });
      }

      const totalCents = subtotalCents;
      const id = randomUUID();

      await tx.insert(orders).values({
        id,
        customerName: data.customerName,
        customerEmail: data.customerEmail,
        customerPhone: data.customerPhone,
        deliveryMethod: data.deliveryMethod,
        shippingNotes: data.shippingNotes || null,
        paymentMethod: data.paymentMethod,
        installments: null,
        subtotalCents,
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
      for (const update of variantStockUpdates) {
        await tx
          .update(productVariants)
          .set({ stock: sql`${productVariants.stock} - ${update.quantity}` })
          .where(eq(productVariants.id, update.variantId));
      }

      return {
        id,
        customerName: data.customerName,
        customerEmail: data.customerEmail,
        deliveryMethod: data.deliveryMethod,
        paymentMethod: data.paymentMethod,
        subtotalCents,
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
