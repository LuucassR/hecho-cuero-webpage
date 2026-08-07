"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { saveProductOptions } from "@/app/admin/productos/actions";

type OptionValue = { id: number | null; value: string };
type Option = { id: number | null; name: string; values: OptionValue[] };

function fromServer(options: { id: number; name: string; values: { id: number; value: string }[] }[]): Option[] {
  return options.map((o) => ({
    id: o.id,
    name: o.name,
    values: o.values.map((v) => ({ id: v.id, value: v.value })),
  }));
}

export function OptionsManager({
  productId,
  defaultOptions,
}: {
  productId: number;
  defaultOptions: { id: number; name: string; values: { id: number; value: string }[] }[];
}) {
  const [options, setOptions] = useState<Option[]>(() => fromServer(defaultOptions));
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  // Resync when the server state changes (e.g. after a save, or on load).
  const serialized = JSON.stringify(defaultOptions);
  const [syncedSerialized, setSyncedSerialized] = useState(serialized);
  if (serialized !== syncedSerialized) {
    setSyncedSerialized(serialized);
    setOptions(fromServer(defaultOptions));
  }

  function addOption() {
    setOptions((prev) => [...prev, { id: null, name: "", values: [{ id: null, value: "" }] }]);
  }

  function removeOption(index: number) {
    setOptions((prev) => prev.filter((_, i) => i !== index));
  }

  function renameOption(index: number, name: string) {
    setOptions((prev) => prev.map((o, i) => (i === index ? { ...o, name } : o)));
  }

  function addValue(optionIndex: number) {
    setOptions((prev) =>
      prev.map((o, i) =>
        i === optionIndex ? { ...o, values: [...o.values, { id: null, value: "" }] } : o,
      ),
    );
  }

  function removeValue(optionIndex: number, valueIndex: number) {
    setOptions((prev) =>
      prev.map((o, i) =>
        i === optionIndex ? { ...o, values: o.values.filter((_, j) => j !== valueIndex) } : o,
      ),
    );
  }

  function renameValue(optionIndex: number, valueIndex: number, value: string) {
    setOptions((prev) =>
      prev.map((o, i) =>
        i === optionIndex
          ? { ...o, values: o.values.map((v, j) => (j === valueIndex ? { ...v, value } : v)) }
          : o,
      ),
    );
  }

  function handleSave() {
    setError(null);
    const cleaned = options
      .map((o) => ({ ...o, name: o.name.trim(), values: o.values.filter((v) => v.value.trim()) }))
      .filter((o) => o.name && o.values.length > 0);

    startTransition(async () => {
      const result = await saveProductOptions(productId, cleaned);
      if (result?.error) setError(result.error);
    });
  }

  return (
    <div className="space-y-4">
      {options.map((option, optionIndex) => (
        <div key={option.id ?? `new-${optionIndex}`} className="rounded-lg border border-border p-4">
          <div className="mb-3 flex items-center gap-2">
            <Input
              value={option.name}
              onChange={(e) => renameOption(optionIndex, e.target.value)}
              placeholder="Ej: Color"
              className="max-w-xs"
            />
            <button
              type="button"
              onClick={() => removeOption(optionIndex)}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-border text-brand-700 hover:bg-brand-100"
              aria-label="Quitar opción"
            >
              ✕
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {option.values.map((value, valueIndex) => (
              <div key={value.id ?? `new-${valueIndex}`} className="flex items-center gap-1">
                <Input
                  value={value.value}
                  onChange={(e) => renameValue(optionIndex, valueIndex, e.target.value)}
                  placeholder="Ej: Rojo"
                  className="w-32"
                />
                <button
                  type="button"
                  onClick={() => removeValue(optionIndex, valueIndex)}
                  className="flex h-11 w-8 shrink-0 items-center justify-center text-brand-700 hover:text-red-700"
                  aria-label="Quitar valor"
                >
                  ✕
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => addValue(optionIndex)}
              className="h-11 rounded-lg border border-dashed border-border px-3 text-sm text-brand-800 hover:border-brand-400"
            >
              + Valor
            </button>
          </div>
        </div>
      ))}

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={addOption}
          className="text-sm font-medium text-brand-800 hover:underline"
        >
          + Agregar opción
        </button>
      </div>

      {error && <p className="text-sm text-red-700">{error}</p>}

      <Button type="button" onClick={handleSave} disabled={isPending} variant="secondary">
        {isPending ? "Guardando..." : "Guardar opciones"}
      </Button>
    </div>
  );
}
