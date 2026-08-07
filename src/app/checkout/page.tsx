import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { CheckoutForm } from "@/components/checkout/CheckoutForm";
import { db } from "@/db";

export const metadata: Metadata = {
  title: "Checkout — Hecho Cuero",
};

export default async function CheckoutPage() {
  const settings = await db.query.storeSettings.findFirst();
  const shippingCents = settings?.shippingFlatCents ?? 0;

  return (
    <Container className="py-12">
      <h1 className="mb-8 font-display text-3xl text-brand-900">Finalizar compra</h1>
      <CheckoutForm shippingCents={shippingCents} />
    </Container>
  );
}
