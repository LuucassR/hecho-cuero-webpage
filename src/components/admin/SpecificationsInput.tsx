"use client";

import { useState } from "react";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";

export function SpecificationsInput({
  defaultValues,
}: {
  defaultValues?: string[];
}) {
  const [items, setItems] = useState<string[]>(
    defaultValues && defaultValues.length > 0 ? defaultValues : [""],
  );

  function updateItem(index: number, value: string) {
    setItems((prev) => prev.map((item, i) => (i === index ? value : item)));
  }

  function addItem() {
    setItems((prev) => [...prev, ""]);
  }

  function removeItem(index: number) {
    setItems((prev) => (prev.length > 1 ? prev.filter((_, i) => i !== index) : [""]));
  }

  return (
    <div>
      <Label>Especificaciones</Label>
      <div className="space-y-2">
        {items.map((item, index) => (
          <div key={index} className="flex gap-2">
            <Input
              name="specifications"
              value={item}
              onChange={(e) => updateItem(index, e.target.value)}
              placeholder="Ej: Cuero vacuno 100% argentino"
            />
            <button
              type="button"
              onClick={() => removeItem(index)}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-border text-brand-700 hover:bg-brand-100"
              aria-label="Quitar especificación"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={addItem}
        className="mt-2 text-sm font-medium text-brand-800 hover:underline"
      >
        + Agregar especificación
      </button>
    </div>
  );
}
