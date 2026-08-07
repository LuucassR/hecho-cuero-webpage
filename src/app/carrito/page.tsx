import { Container } from "@/components/ui/Container";
import { CartContents } from "@/components/cart/CartContents";

export default function CartPage() {
  return (
    <Container className="flex flex-1 flex-col py-12">
      <h1 className="mb-8 font-display text-3xl text-brand-900">Tu carrito</h1>
      <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col">
        <CartContents />
      </div>
    </Container>
  );
}
