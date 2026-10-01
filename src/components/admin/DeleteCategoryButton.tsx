"use client";

import { useTransition } from "react";

export function DeleteCategoryButton({
  categoryName,
  onDelete,
}: {
  categoryName: string;
  onDelete: () => Promise<{ error?: string } | undefined>;
}) {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={isPending}
      onClick={() => {
        if (window.confirm(`¿Eliminar la categoría "${categoryName}"?`)) {
          startTransition(async () => {
            const result = await onDelete();
            if (result?.error) window.alert(result.error);
          });
        }
      }}
      className="text-sm font-medium text-red-700 hover:underline disabled:opacity-50"
    >
      {isPending ? "Eliminando..." : "Eliminar"}
    </button>
  );
}
