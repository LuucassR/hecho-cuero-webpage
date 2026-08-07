"use client";

import { useRef, useState, useTransition } from "react";
import { upload } from "@vercel/blob/client";
import Image from "next/image";
import { attachProductImage, removeProductImage } from "@/app/admin/productos/actions";

type ImageItem = { id: number; url: string };

export function ImageUploader({
  productId,
  images,
}: {
  productId: number;
  images: ImageItem[];
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    setUploading(true);
    setError(null);

    try {
      for (const file of Array.from(files)) {
        const blob = await upload(file.name, file, {
          access: "public",
          handleUploadUrl: "/api/blob/upload",
        });
        await attachProductImage(productId, blob.url);
      }
    } catch {
      setError("No pudimos subir una o más imágenes.");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  function handleRemove(imageId: number) {
    startTransition(() => {
      removeProductImage(imageId, productId);
    });
  }

  return (
    <div>
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
        {images.map((img) => (
          <div key={img.id} className="group relative aspect-square overflow-hidden rounded-lg bg-brand-100">
            <Image src={img.url} alt="" fill sizes="150px" className="object-cover" />
            <button
              type="button"
              onClick={() => handleRemove(img.id)}
              disabled={isPending}
              className="absolute right-1 top-1 flex h-7 w-7 items-center justify-center rounded-full bg-brand-950/80 text-cream-100 opacity-0 transition-opacity group-hover:opacity-100"
              aria-label="Quitar imagen"
            >
              ✕
            </button>
          </div>
        ))}
        <label className="flex aspect-square cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-border text-xs text-muted hover:border-brand-400">
          {uploading ? "Subiendo..." : "+ Agregar"}
          <input
            ref={inputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp,image/avif"
            multiple
            className="hidden"
            onChange={(e) => handleFiles(e.target.files)}
            disabled={uploading}
          />
        </label>
      </div>
      {error && <p className="mt-2 text-sm text-red-700">{error}</p>}
    </div>
  );
}
