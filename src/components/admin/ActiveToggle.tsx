"use client";

import { useTransition } from "react";
import { clsx } from "clsx";
import { toggleProductActive } from "@/app/admin/productos/actions";

export function ActiveToggle({ id, active }: { id: number; active: boolean }) {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={isPending}
      onClick={() => startTransition(() => toggleProductActive(id, !active))}
      className={clsx(
        "rounded-full px-3 py-1 text-xs font-medium",
        active ? "bg-emerald-100 text-emerald-800" : "bg-brand-100 text-brand-600",
      )}
    >
      {active ? "Visible" : "Oculto"}
    </button>
  );
}
