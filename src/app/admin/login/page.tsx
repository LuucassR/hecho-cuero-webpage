"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { loginAction } from "./actions";

export default function AdminLoginPage() {
  const [state, formAction, pending] = useActionState(loginAction, undefined);

  return (
    <div className="flex min-h-screen items-center justify-center bg-brand-950 px-4">
      <div className="w-full max-w-sm rounded-2xl bg-cream-100 p-8 shadow-xl">
        <h1 className="mb-1 text-center font-display text-2xl text-brand-900">
          Hecho Cuero
        </h1>
        <p className="mb-6 text-center text-sm text-muted">Panel de administración</p>
        <form action={formAction} className="space-y-4">
          <div>
            <Label htmlFor="password">Contraseña</Label>
            <Input
              id="password"
              name="password"
              type="password"
              required
              autoFocus
              placeholder="••••••••"
            />
          </div>
          {state?.error && (
            <p className="text-sm text-red-700">{state.error}</p>
          )}
          <Button type="submit" className="w-full" disabled={pending}>
            {pending ? "Ingresando..." : "Ingresar"}
          </Button>
        </form>
      </div>
    </div>
  );
}
