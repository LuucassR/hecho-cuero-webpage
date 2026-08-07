"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { orders, orderStatusEnum } from "@/db/schema";

export async function updateOrderStatus(id: string, status: (typeof orderStatusEnum.enumValues)[number]) {
  await db.update(orders).set({ status }).where(eq(orders.id, id));
  revalidatePath("/admin/pedidos");
  revalidatePath(`/admin/pedidos/${id}`);
}
