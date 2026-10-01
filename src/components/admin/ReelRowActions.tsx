"use client";

import { useTransition } from "react";

export function ReelRowActions({
  onMoveUp,
  onMoveDown,
  onDelete,
}: {
  onMoveUp?: () => Promise<void>;
  onMoveDown?: () => Promise<void>;
  onDelete: () => Promise<void>;
}) {
  const [isPending, startTransition] = useTransition();
  const arrowClass =
    "rounded-md px-2 py-1 text-brand-800 hover:bg-brand-100 disabled:opacity-30 disabled:hover:bg-transparent";

  return (
    <div className="flex items-center justify-end gap-2">
      <button
        type="button"
        aria-label="Subir"
        disabled={isPending || !onMoveUp}
        onClick={() => onMoveUp && startTransition(onMoveUp)}
        className={arrowClass}
      >
        ↑
      </button>
      <button
        type="button"
        aria-label="Bajar"
        disabled={isPending || !onMoveDown}
        onClick={() => onMoveDown && startTransition(onMoveDown)}
        className={arrowClass}
      >
        ↓
      </button>
      <button
        type="button"
        disabled={isPending}
        onClick={() => {
          if (window.confirm("¿Quitar este reel de la página de inicio?")) {
            startTransition(onDelete);
          }
        }}
        className="ml-2 text-sm font-medium text-red-700 hover:underline disabled:opacity-50"
      >
        Eliminar
      </button>
    </div>
  );
}
