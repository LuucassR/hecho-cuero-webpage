import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { STORE_INFO } from "@/lib/store-info";

const FAQS = [
  {
    question: "¿De qué material están hechos los productos?",
    answer:
      "Trabajamos con cuero 100% argentino, curtido en el país. Cada pieza se corta y se cose de forma artesanal en nuestro taller de Santa Fe.",
  },
  {
    question: "¿Cómo hago un pedido?",
    answer:
      "Elegís tus productos, los agregás al carrito y completás tus datos en el checkout. Podés pagar por transferencia bancaria o, si retirás en el local, en efectivo.",
  },
  {
    question: "¿Hacen envíos?",
    answer:
      "Sí. Una vez confirmado el pedido te contactamos por WhatsApp para coordinar la dirección y el costo del envío según la localidad.",
  },
  {
    question: "¿Puedo retirar en el local?",
    answer: `Sí, sin costo de envío. Estamos en ${STORE_INFO.address}, ${STORE_INFO.hoursDays.toLowerCase()} de ${STORE_INFO.hoursRanges.join(" y de ")}. Te avisamos por WhatsApp cuando tu pedido esté listo.`,
  },
  {
    question: "¿Cómo cuido mis productos de cuero?",
    answer:
      "Evitá la humedad y el sol directo por tiempos prolongados, y limpialos con un paño húmedo cuando lo necesiten. Con estos cuidados básicos, el cuero mejora con el uso y dura muchos años.",
  },
  {
    question: "¿Hacen pedidos corporativos o personalizados?",
    answer:
      "Sí, armamos regalos empresariales y pedidos a medida. Escribinos por WhatsApp para contarnos qué necesitás.",
  },
];

export function Faq() {
  return (
    <section className="py-16">
      <Container>
        <Reveal className="mx-auto mb-10 max-w-2xl text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-brand-500">
            Preguntas frecuentes
          </p>
          <h2 className="font-display text-2xl text-brand-900 sm:text-3xl">
            ¿Tenés dudas?
          </h2>
        </Reveal>

        <div className="mx-auto max-w-2xl space-y-3">
          {FAQS.map((faq, i) => (
            <Reveal key={faq.question} delay={i * 60}>
              <details className="group rounded-2xl border border-border bg-surface p-5 open:pb-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-display text-base text-brand-900 marker:content-none">
                  {faq.question}
                  <span
                    aria-hidden
                    className="shrink-0 text-xl leading-none text-brand-500 transition-transform duration-300 group-open:rotate-45"
                  >
                    +
                  </span>
                </summary>
                <p className="mt-3 text-sm text-muted">{faq.answer}</p>
              </details>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
