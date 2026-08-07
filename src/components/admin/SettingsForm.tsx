"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { updateSettings } from "@/app/admin/configuracion/actions";

export function SettingsForm({ shippingFlatCents }: { shippingFlatCents: number }) {
  const [state, formAction, pending] = useActionState(updateSettings, undefined);

  return (
    <form action={formAction} className="max-w-sm space-y-4">
      <div>
        <Label htmlFor="shippingFlatCents">Costo de envío (en centavos)</Label>
        <Input
          id="shippingFlatCents"
          name="shippingFlatCents"
          type="number"
          min={0}
          required
          defaultValue={shippingFlatCents}
        />
        <p className="mt-1 text-xs text-muted">Ej: 500000 = $5.000</p>
      </div>
      {state?.error && <p className="text-sm text-red-700">{state.error}</p>}
      {state?.success && <p className="text-sm text-emerald-700">Guardado.</p>}
      <Button type="submit" disabled={pending}>
        {pending ? "Guardando..." : "Guardar"}
      </Button>
    </form>
  );
}
