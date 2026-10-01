"use client";

import { useActionState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import type { ReelFormState } from "@/app/admin/reels/actions";

export function ReelForm({
  action,
}: {
  action: (state: ReelFormState, formData: FormData) => Promise<ReelFormState>;
}) {
  const [state, formAction, pending] = useActionState(action, undefined);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state?.success) formRef.current?.reset();
  }, [state]);

  return (
    <form ref={formRef} action={formAction} className="max-w-lg space-y-4">
      <div>
        <Label htmlFor="url">Link del reel</Label>
        <Input
          id="url"
          name="url"
          type="url"
          required
          placeholder="https://www.instagram.com/reel/..."
        />
        <p className="mt-1.5 text-xs text-muted">
          En Instagram: abrí el reel → Compartir → Copiar enlace.
        </p>
      </div>
      {state?.error && <p className="text-sm text-red-700">{state.error}</p>}
      {state?.warning && <p className="text-sm text-amber-700">{state.warning}</p>}
      <Button type="submit" disabled={pending}>
        {pending ? "Guardando..." : "Agregar reel"}
      </Button>
    </form>
  );
}
