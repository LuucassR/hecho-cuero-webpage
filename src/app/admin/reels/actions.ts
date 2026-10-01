"use server";

import { asc, eq, min } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { instagramReels } from "@/db/schema";
import { requireAdmin } from "@/lib/auth/require-admin";
import { deleteStoredFile, optimizeUploadedImage } from "@/lib/blob";
import { fetchReelCover } from "@/lib/reel-cover";
import { reelUrlSchema } from "@/lib/validation/reel";

export type ReelFormState = { error?: string; warning?: string; success?: boolean } | undefined;

// New reels go first, matching how Instagram orders them. The cover is pulled
// from Instagram on a best-effort basis; the reel is saved either way.
export async function createReel(
  _prevState: ReelFormState,
  formData: FormData,
): Promise<ReelFormState> {
  await requireAdmin();
  const parsed = reelUrlSchema.safeParse(formData.get("url"));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Link inválido." };
  }
  const url = parsed.data;

  const existing = await db.$count(instagramReels, eq(instagramReels.url, url));
  if (existing > 0) return { error: "Ese reel ya está cargado." };

  const coverUrl = await fetchReelCover(url);
  const [{ first }] = await db.select({ first: min(instagramReels.position) }).from(instagramReels);
  try {
    await db.insert(instagramReels).values({ url, coverUrl, position: (first ?? 1) - 1 });
  } catch {
    await deleteStoredFile(coverUrl);
    return { error: "Ese reel ya está cargado." };
  }
  revalidatePath("/admin/reels");
  return coverUrl
    ? { success: true }
    : {
        success: true,
        warning: "Reel agregado, pero no pudimos traer la portada de Instagram. Subila a mano.",
      };
}

export async function deleteReel(id: number) {
  await requireAdmin();
  const [deleted] = await db
    .delete(instagramReels)
    .where(eq(instagramReels.id, id))
    .returning({ coverUrl: instagramReels.coverUrl });
  await deleteStoredFile(deleted?.coverUrl);
  revalidatePath("/admin/reels");
}

async function replaceCover(id: number, coverUrl: string) {
  const [previous] = await db
    .select({ coverUrl: instagramReels.coverUrl })
    .from(instagramReels)
    .where(eq(instagramReels.id, id));
  await db.update(instagramReels).set({ coverUrl }).where(eq(instagramReels.id, id));
  await deleteStoredFile(previous?.coverUrl);
  revalidatePath("/admin/reels");
}

// Re-pulls the cover from Instagram, e.g. for reels added before covers existed.
export async function refreshReelCover(id: number): Promise<{ error?: string } | undefined> {
  await requireAdmin();
  const reel = await db.query.instagramReels.findFirst({ where: eq(instagramReels.id, id) });
  if (!reel) return;
  const coverUrl = await fetchReelCover(reel.url);
  if (!coverUrl) {
    return { error: "No pudimos traer la portada de Instagram. Subila a mano." };
  }
  await replaceCover(id, coverUrl);
}

// Optimizes a cover the admin uploaded to Vercel Blob from the browser and
// stores it.
export async function setReelCover(id: number, blobUrl: string) {
  await requireAdmin();
  await replaceCover(id, await optimizeUploadedImage(blobUrl, "reels"));
}

// Swaps the reel with its neighbor and renumbers the whole list 0..n-1, which
// also repairs gaps or duplicate positions.
export async function moveReel(id: number, direction: "up" | "down") {
  await requireAdmin();
  await db.transaction(async (tx) => {
    const reels = await tx
      .select({ id: instagramReels.id })
      .from(instagramReels)
      .orderBy(asc(instagramReels.position), asc(instagramReels.id));
    const index = reels.findIndex((reel) => reel.id === id);
    const target = direction === "up" ? index - 1 : index + 1;
    if (index === -1 || target < 0 || target >= reels.length) return;

    [reels[index], reels[target]] = [reels[target], reels[index]];
    for (const [position, reel] of reels.entries()) {
      await tx.update(instagramReels).set({ position }).where(eq(instagramReels.id, reel.id));
    }
  });
  revalidatePath("/admin/reels");
}
