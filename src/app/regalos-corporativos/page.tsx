import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { LinkButton } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { ProductCard } from "@/components/product/ProductCard";
import { CorporateGiftForm } from "@/components/corporate/CorporateGiftForm";
import { getFeaturedProducts } from "@/lib/products";

export const metadata: Metadata = {
  title: "Regalos Corporativos | Hecho Cuero",
  description:
    "Regalos empresariales de cuero, hechos a mano en Santa Fe. Pedidos personalizados para empresas y eventos, mínimo 10 unidades.",
};

const BENEFITS = [
  {
    title: "Identidad de marca",
    text: "Personalizamos cada pieza con el sello, logo o detalle que represente a tu empresa.",
  },
  {
    title: "Pedidos personalizados",
    text: "Elegimos juntos el producto, los materiales y la terminación ideal para tu evento u ocasión.",
  },
  {
    title: "Mínimo 10 unidades",
    text: "Trabajamos pedidos corporativos a partir de 10 unidades, sin techo máximo.",
  },
  {
    title: "Entrega a coordinar",
    text: "Coordinamos con vos la fecha y el lugar de entrega según los tiempos de tu evento.",
  },
];

const STEPS = [
  {
    title: "Nos contactás",
    text: "Contanos sobre tu empresa, la ocasión y qué tenés en mente a través del formulario o WhatsApp.",
  },
  {
    title: "Elegimos el producto",
    text: "Te proponemos piezas de cuero acordes a tu presupuesto y a la cantidad de regalos que necesitás.",
  },
  {
    title: "Personalizamos",
    text: "Sumamos el logo, las iniciales o el detalle que le dé identidad a cada regalo.",
  },
  {
    title: "Coordinamos la entrega",
    text: "Definimos juntos fecha y lugar de entrega para que todo llegue a tiempo.",
  },
];

export default async function RegalosCorporativosPage() {
  const products = await getFeaturedProducts(4);

  return (
    <div className="overflow-hidden">
      <section className="relative overflow-hidden bg-brand-950 text-cream-100">
        <div
          aria-hidden
          className="animate-float-slow pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-brand-700/30 blur-3xl"
        />
        <div
          aria-hidden
          className="animate-float-slow pointer-events-none absolute -bottom-32 left-1/4 h-80 w-80 rounded-full bg-brand-500/20 blur-3xl"
          style={{ animationDelay: "2.5s" }}
        />
        <Container className="relative py-20 text-center lg:py-28">
          <Reveal direction="up">
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-brand-300">
              Para empresas y eventos
            </p>
          </Reveal>
          <Reveal direction="up" delay={100}>
            <h1 className="mx-auto max-w-3xl font-display text-4xl leading-tight sm:text-6xl">
              Regalos corporativos con identidad de cuero argentino
            </h1>
          </Reveal>
          <Reveal direction="up" delay={200}>
            <p className="mx-auto mt-5 max-w-xl text-brand-200">
              Piezas hechas a mano en Santa Fe para sorprender a tu equipo, tus clientes o
              los invitados de tu próximo evento. Personalizamos cada pedido para que lleve
              la marca de tu empresa.
            </p>
          </Reveal>
          <Reveal direction="up" delay={300}>
            <div className="mt-9 flex flex-wrap justify-center gap-4">
              <LinkButton href="#contacto" size="lg">
                Contanos tu proyecto
              </LinkButton>
              <LinkButton
                href="#ideas"
                size="lg"
                variant="outline"
                className="border-cream-100 text-cream-100 hover:bg-brand-900"
              >
                Ver ideas de regalo
              </LinkButton>
            </div>
          </Reveal>
        </Container>
      </section>

      <section className="py-20 sm:py-24">
        <Container>
          <Reveal className="mx-auto max-w-2xl text-center">
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-brand-500">
              Por qué elegirnos
            </p>
            <h2 className="font-display text-3xl text-brand-900 sm:text-4xl">
              Regalos que hablan de tu marca
            </h2>
            <p className="mt-4 text-brand-700">
              Cada pieza sale de manos artesanas santafesinas. Así de personal queremos que
              sea el regalo que le llegue a tu equipo o a tus clientes.
            </p>
          </Reveal>

          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {BENEFITS.map((benefit, i) => (
              <Reveal key={benefit.title} delay={i * 110}>
                <div className="h-full rounded-2xl border border-border bg-surface p-6">
                  <span className="font-display text-3xl text-brand-300">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mt-3 font-display text-lg text-brand-900">{benefit.title}</h3>
                  <p className="mt-2 text-sm text-muted">{benefit.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {products.length > 0 && (
        <section id="ideas" className="py-16 sm:py-20">
          <Container>
            <Reveal className="mb-10 text-center">
              <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-brand-500">
                Ideas de regalo
              </p>
              <h2 className="font-display text-3xl text-brand-900">
                Piezas pensadas para regalar
              </h2>
              <p className="mx-auto mt-3 max-w-xl text-brand-700">
                Un punto de partida — cualquiera de nuestros productos se puede personalizar
                y adaptar a tu pedido corporativo.
              </p>
            </Reveal>
            <div className="grid grid-cols-2 gap-x-5 gap-y-10 lg:grid-cols-4">
              {products.map((product, i) => (
                <Reveal key={product.id} delay={(i % 4) * 90}>
                  <ProductCard product={product} />
                </Reveal>
              ))}
            </div>
          </Container>
        </section>
      )}

      <section className="bg-brand-100/60 py-20 sm:py-24">
        <Container>
          <Reveal className="mx-auto max-w-2xl text-center">
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-brand-500">
              Cómo funciona
            </p>
            <h2 className="font-display text-3xl text-brand-900 sm:text-4xl">
              De la idea al regalo, en cuatro pasos
            </h2>
          </Reveal>

          <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((step, i) => (
              <Reveal key={step.title} delay={i * 110} direction={i % 2 === 0 ? "left" : "right"}>
                <div className="relative h-full rounded-2xl bg-surface p-6">
                  <span className="font-display text-4xl text-brand-200">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mt-3 font-display text-lg text-brand-900">{step.title}</h3>
                  <p className="mt-2 text-sm text-muted">{step.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      <section id="contacto" className="py-20 sm:py-24">
        <Container>
          <Reveal className="relative overflow-hidden rounded-3xl bg-brand-950 px-6 py-14 text-cream-100 sm:px-12 lg:px-16">
            <div
              aria-hidden
              className="animate-float-slow pointer-events-none absolute -right-16 -top-16 h-72 w-72 rounded-full bg-brand-600/30 blur-3xl"
            />
            <div className="relative grid gap-10 lg:grid-cols-[1fr_1.2fr] lg:items-start">
              <div>
                <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-brand-300">
                  Hablemos de tu pedido
                </p>
                <h2 className="font-display text-3xl sm:text-4xl">
                  Contanos qué necesitás
                </h2>
                <p className="mt-4 max-w-md text-brand-200">
                  Completá el formulario y te vamos a escribir por WhatsApp para coordinar
                  producto, personalización, cantidades y entrega. Pedido mínimo: 10
                  unidades.
                </p>
                <ul className="mt-8 space-y-3 text-sm text-brand-200">
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-brand-300" />
                    Pedidos 100% personalizados
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-brand-300" />
                    Mínimo 10 unidades por pedido
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-brand-300" />
                    Entrega a coordinar según tu evento
                  </li>
                </ul>
              </div>
              <div className="rounded-2xl bg-brand-900/60 p-6 sm:p-8">
                <CorporateGiftForm />
              </div>
            </div>
          </Reveal>
        </Container>
      </section>
    </div>
  );
}
