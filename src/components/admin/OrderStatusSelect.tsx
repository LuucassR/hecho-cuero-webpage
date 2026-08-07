"use client";

import { useTransition } from "react";
import { Select } from "@/components/ui/Select";
import { ORDER_STATUS_LABELS, type OrderStatus } from "@/lib/orders";
import { updateOrderStatus } from "@/app/admin/pedidos/actions";

export function OrderStatusSelect({ orderId, status }: { orderId: string; status: OrderStatus }) {
  const [isPending, startTransition] = useTransition();

  return (
    <div className="w-56">
      <Select
        value={status}
        disabled={isPending}
        onChange={(e) =>
          startTransition(() => updateOrderStatus(orderId, e.target.value as OrderStatus))
        }
      >
        {Object.entries(ORDER_STATUS_LABELS).map(([value, label]) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </Select>
    </div>
  );
}
