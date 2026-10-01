"use client";

import { useRef, useState, useTransition } from "react";
import { upload } from "@vercel/blob/client";
import Image from "next/image";
import { refreshReelCover, setReelCover } from "@/app/admin/reels/actions";
import { BLOB_ACCESS, INCOMING_FOLDER } from "@/lib/blob-access";

export function ReelCoverControls({ id, coverUrl }: { id: number; coverUrl: string | null }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleFile(file: File | undefined) {
    if (!file) return;
    setError(null);
    startTransition(async () => {
      try {
        const blob = await upload(`${INCOMING_FOLDER}/${file.name}`, file, {
          access: BLOB_ACCESS,
          handleUploadUrl: "/api/blob/upload",
        });
        await setReelCover(id, blob.url);
      } catch (uploadError) {
        console.error(uploadError);
        setError("No pudimos subir la imagen.");
      } finally {
        if (inputRef.current) inputRef.current.value = "";
      }
    });
  }

  function handleRefresh() {
    setError(null);
    startTransition(async () => {
      const result = await refreshReelCover(id);
      if (result?.error) setError(result.error);
    });
  }

  const linkClass = "text-xs font-medium text-brand-800 hover:underline disabled:opacity-50";

  return (
    <div className="flex items-center gap-3">
      <div className="relative aspect-9/16 w-12 shrink-0 overflow-hidden rounded-md bg-brand-100">
        {coverUrl ? (
          <Image src={coverUrl} alt="" fill sizes="48px" className="object-cover" />
        ) : (
          <span className="flex h-full items-center justify-center text-[10px] text-muted">
            Sin portada
          </span>
        )}
      </div>
      <div className="flex flex-col items-start gap-1">
        <button type="button" onClick={handleRefresh} disabled={isPending} className={linkClass}>
          {isPending ? "Procesando..." : "Traer de Instagram"}
        </button>
        <label className={`${linkClass} cursor-pointer`}>
          Subir imagen
          <input
            ref={inputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp,image/avif"
            className="hidden"
            disabled={isPending}
            onChange={(e) => handleFile(e.target.files?.[0])}
          />
        </label>
        {error && <p className="max-w-48 text-xs text-red-700">{error}</p>}
      </div>
    </div>
  );
}
