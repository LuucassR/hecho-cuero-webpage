"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Textarea } from "@/components/ui/Textarea";
import { STORE_INFO } from "@/lib/store-info";

export function CorporateGiftForm() {
  const [sending, setSending] = useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSending(true);

    const formData = new FormData(e.currentTarget);
    const company = String(formData.get("company") ?? "");
    const whatsapp = String(formData.get("whatsapp") ?? "");
    const email = String(formData.get("email") ?? "");
    const budget = String(formData.get("budget") ?? "");
    const info = String(formData.get("info") ?? "");

    const lines = [
      "¡Hola! Quiero cotizar un pedido de regalos corporativos para mi empresa.",
      "",
      `Empresa: ${company}`,
      `WhatsApp de contacto: ${whatsapp}`,
      `Email: ${email}`,
      budget ? `Presupuesto aproximado: ${budget}` : null,
      info ? `Información adicional: ${info}` : null,
    ].filter(Boolean);

    const message = encodeURIComponent(lines.join("\n"));
    window.open(`${STORE_INFO.whatsappHref}?text=${message}`, "_blank", "noopener,noreferrer");
    setSending(false);
    e.currentTarget.reset();
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="company" className="text-cream-100">
            Nombre de la empresa
          </Label>
          <Input id="company" name="company" required placeholder="Mi Empresa S.A." />
        </div>
        <div>
          <Label htmlFor="whatsapp" className="text-cream-100">
            WhatsApp de contacto
          </Label>
          <Input id="whatsapp" name="whatsapp" required placeholder="342 4123456" />
        </div>
        <div>
          <Label htmlFor="email" className="text-cream-100">
            Email
          </Label>
          <Input id="email" name="email" type="email" required placeholder="nombre@empresa.com" />
        </div>
        <div>
          <Label htmlFor="budget" className="text-cream-100">
            Presupuesto aproximado
          </Label>
          <Input id="budget" name="budget" placeholder="Ej: $500.000 o a coordinar" />
        </div>
        <div className="sm:col-span-2">
          <Label htmlFor="info" className="text-cream-100">
            Información extra
          </Label>
          <Textarea
            id="info"
            name="info"
            rows={4}
            placeholder="Cantidad de unidades, tipo de producto, fecha del evento, personalización deseada..."
          />
        </div>
      </div>

      <Button type="submit" size="lg" disabled={sending} className="mt-2 w-full sm:w-auto">
        {sending ? "Abriendo WhatsApp..." : "Enviar consulta por WhatsApp"}
      </Button>
      <p className="text-xs text-brand-300">
        Vas a ser redirigido a WhatsApp con tu consulta ya redactada, lista para enviarnos.
      </p>
    </form>
  );
}
