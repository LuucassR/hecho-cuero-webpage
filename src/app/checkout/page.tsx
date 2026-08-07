import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { CheckoutForm } from "@/components/checkout/CheckoutForm";

export const metadata: Metadata = {
  title: "Checkout — Hecho Cuero",
};

export default function CheckoutPage() {
  return (
    <Container className="py-12">
      <h1 className="mb-8 font-display text-3xl text-brand-900">Finalizar compra</h1>
      <CheckoutForm />
    </Container>
  );
}
