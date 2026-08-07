import { Container } from "@/components/ui/Container";
import { LinkButton } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <Container className="flex flex-1 flex-col items-center justify-center gap-4 py-24 text-center">
      <h1 className="font-display text-3xl text-brand-900">Página no encontrada</h1>
      <p className="text-muted">La página que buscás no existe o fue movida.</p>
      <LinkButton href="/">Volver al inicio</LinkButton>
    </Container>
  );
}
