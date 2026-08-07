"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { storeSettings } from "@/db/schema";

export type SettingsFormState = { error?: string; success?: boolean } | undefined;

export async function updateSettings(
  _prevState: SettingsFormState,
  formData: FormData,
): Promise<SettingsFormState> {
  const shippingFlatCents = Number(formData.get("shippingFlatCents"));
  if (!Number.isFinite(shippingFlatCents) || shippingFlatCents < 0) {
    return { error: "El costo de envío no es válido." };
  }

  await db
    .insert(storeSettings)
    .values({ id: 1, shippingFlatCents })
    .onConflictDoUpdate({
      target: storeSettings.id,
      set: { shippingFlatCents, updatedAt: new Date() },
    });

  revalidatePath("/admin/configuracion");
  revalidatePath("/checkout");
  return { success: true };
}
