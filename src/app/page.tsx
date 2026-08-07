import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { LinkButton } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { ProductCard } from "@/components/product/ProductCard";
import { InstagramReels } from "@/components/home/InstagramReels";
import { Faq } from "@/components/home/Faq";
import { getAllCategories, getFeaturedProducts } from "@/lib/products";

// const PILLARS = [
//   {
//     title: "Cuero 100% argentino",
//     text: "Seleccionamos cuero de primera calidad, curtido en el país, para que cada pieza envejezca con carácter.",
//   },
//   {
//     title: "Hecho a mano",
//     text: "Cada mate, cada bolso, cada detalle pasa por manos artesanas antes de llegar a las tuyas.",
//   },
//   {
//     title: "Piezas para toda la vida",
//     text: "Diseñamos productos duraderos, pensados para acompañarte durante años, no temporadas.",
//   },
// ];

export default async function Home() {
  const [categories, featured] = await Promise.all([
    getAllCategories(),
    getFeaturedProducts(8),
  ]);

  return (
    <div className="overflow-hidden">
      <section className="relative overflow-hidden bg-brand-950 text-cream-100">
        <div
          aria-hidden
          className="animate-float-slow pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-brand-700/30 blur-3xl"
        />
        <div
          aria-hidden
          className="animate-float-slow pointer-events-none absolute -bottom-32 left-1/3 h-80 w-80 rounded-full bg-brand-500/20 blur-3xl"
          style={{ animationDelay: "2.5s" }}
        />
        <Container className="relative grid items-center gap-10 py-20 lg:grid-cols-2 lg:py-28">
          <div>
            <Reveal direction="up">
              <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-brand-300">
                Cuero 100% argentino
              </p>
            </Reveal>
            <Reveal direction="up" delay={100}>
              <h1 className="font-display text-4xl leading-tight sm:text-5xl">
                Cuero, mates y productos regionales
              </h1>
            </Reveal>
            <Reveal direction="up" delay={200}>
              <p className="mt-5 max-w-md text-brand-200">
                Piezas hechas a mano en Santa Fe, pensadas para durar toda la vida.
              </p>
            </Reveal>
            <Reveal direction="up" delay={300}>
              <div className="mt-8 flex flex-wrap gap-4">
                <LinkButton href="/productos" size="lg">
                  Ver productos
                </LinkButton>
                <LinkButton
                  href="#destacados"
                  size="lg"
                  variant="outline"
                  className="border-cream-100 text-cream-100 hover:bg-brand-900"
                >
                  Ver destacados
                </LinkButton>
              </div>
            </Reveal>
          </div>
          <Reveal direction="none" delay={150} className="mx-auto">
            <Image
              src="/hecho-cuero-logo.png"
              alt="Hecho Cuero — Cuero 100% argentino"
              width={340}
              height={340}
              className="animate-float-slow h-auto w-64 rounded-full sm:w-80"
              priority
            />
          </Reveal>
        </Container>
      </section>

      <section className="py-20 sm:py-24">
        <Container>
          <Reveal className="mx-auto max-w-2xl text-center">
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-brand-500">
              Nuestra historia
            </p>
            <h2 className="font-display text-3xl text-brand-900 sm:text-4xl">
              ¿Que es Echo Cuero?
            </h2>
            <p className="mt-4 text-brand-700">
              Somos una tienda que vende productos de cuero genuino de Santa Fe capital. Cada pieza esta trabajada de
              forma artesanal, cuidando el detalle desde el corte hasta la última
              costura, para que lo que te llevás dure de verdad.
            </p>
          </Reveal>

          {/* <div className="mt-14 grid gap-8 sm:grid-cols-3">
            {PILLARS.map((pillar, i) => (
              <Reveal key={pillar.title} delay={i * 120}>
                <div className="h-full rounded-2xl border border-border bg-surface p-6">
                  <span className="font-display text-3xl text-brand-300">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mt-3 font-display text-lg text-brand-900">
                    {pillar.title}
                  </h3>
                  <p className="mt-2 text-sm text-muted">{pillar.text}</p>
                </div>
              </Reveal>
            ))}
          </div> */}
        </Container>
      </section>

      {categories.length > 0 && (
        <section className="py-16">
          <Container>
            <Reveal>
              <h2 className="mb-8 font-display text-2xl text-brand-900">
                Explorá por categoría
              </h2>
            </Reveal>
            <div className="grid gap-5 sm:grid-cols-3">
              {categories.map((cat, i) => (
                <Reveal key={cat.slug} delay={i * 100}>
                  <Link
                    href={`/categorias/${cat.slug}`}
                    className="group relative flex aspect-[4/3] flex-col items-start justify-end overflow-hidden rounded-2xl bg-gradient-to-br from-brand-700 to-brand-900 p-6 text-cream-100 transition-transform duration-300 hover:scale-[1.02]"
                  >
                    {cat.imageUrl && (
                      <>
                        <Image
                          src={cat.imageUrl}
                          alt={cat.name}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                        <div
                          aria-hidden
                          className="absolute inset-0 bg-gradient-to-t from-brand-950/90 via-brand-950/20 to-transparent"
                        />
                      </>
                    )}
                    <span className="relative font-display text-xl">{cat.name}</span>
                    <span className="relative mt-1 flex items-center gap-1 text-sm text-brand-200 group-hover:underline">
                      Ver productos
                      <span className="transition-transform duration-300 group-hover:translate-x-1">
                        →
                      </span>
                    </span>
                  </Link>
                </Reveal>
              ))}
            </div>
          </Container>
        </section>
      )}

      <section id="destacados" className="py-16">
        <Container>
          <Reveal className="mb-8 flex items-end justify-between">
            <h2 className="font-display text-2xl text-brand-900">Productos destacados</h2>
            <Link href="/productos" className="text-sm font-medium text-brand-800 hover:underline">
              Ver todos
            </Link>
          </Reveal>
          {featured.length > 0 ? (
            <div className="grid grid-cols-2 gap-x-5 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
              {featured.map((product, i) => (
                <Reveal key={product.id} delay={(i % 4) * 90}>
                  <ProductCard product={product} />
                </Reveal>
              ))}
            </div>
          ) : (
            <p className="text-muted">Todavía no hay productos cargados.</p>
          )}
        </Container>
      </section>

      <InstagramReels />

      <Faq />

      <section className="py-20">
        <Container>
          <Reveal className="relative overflow-hidden rounded-3xl bg-brand-950 px-8 py-14 text-center text-cream-100 sm:px-16">
            <div
              aria-hidden
              className="animate-float-slow pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-brand-600/30 blur-3xl"
            />
            <h2 className="relative font-display text-2xl sm:text-3xl">
              ¿Buscás algo especial?
            </h2>
            <p className="relative mx-auto mt-3 max-w-md text-brand-200">
              Descubrí toda nuestra colección de cuero, mates y productos regionales
              hechos a mano.
            </p>
            <div className="relative mt-7">
              <LinkButton href="/productos" size="lg">
                Ver todos los productos
              </LinkButton>
            </div>
          </Reveal>
        </Container>
      </section>
    </div>
  );
}
