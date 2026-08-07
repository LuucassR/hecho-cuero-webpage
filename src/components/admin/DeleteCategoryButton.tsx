"use client";

import { useTransition } from "react";

export function DeleteCategoryButton({
  categoryName,
  onDelete,
}: {
  categoryName: string;
  onDelete: () => Promise<void>;
}) {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={isPending}
      onClick={() => {
        if (
          window.confirm(
            `¿Eliminar la categoría "${categoryName}"? Los productos quedarán sin categoría.`,
          )
        ) {
          startTransition(onDelete);
        }
      }}
      className="text-sm font-medium text-red-700 hover:underline disabled:opacity-50"
    >
      {isPending ? "Eliminando..." : "Eliminar"}
    </button>
  );
}
