"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/Button";

export function DeleteProductButton({
  productName,
  onDelete,
}: {
  productName: string;
  onDelete: () => Promise<void>;
}) {
  const [isPending, startTransition] = useTransition();

  return (
    <Button
      type="button"
      variant="danger"
      size="sm"
      disabled={isPending}
      onClick={() => {
        if (window.confirm(`¿Eliminar "${productName}"? Esta acción no se puede deshacer.`)) {
          startTransition(onDelete);
        }
      }}
    >
      {isPending ? "Eliminando..." : "Eliminar producto"}
    </Button>
  );
}
