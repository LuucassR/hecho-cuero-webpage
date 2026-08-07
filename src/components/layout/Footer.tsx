import Link from "next/link";
import { Container } from "@/components/ui/Container";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-border bg-brand-950 text-cream-100">
      <Container className="grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <h3 className="font-display text-xl">Hecho Cuero</h3>
          <p className="mt-3 text-sm text-brand-200">
            Cuero, mates y productos regionales.
          </p>
          <p className="mt-1 text-sm text-brand-300">Cuero 100% argentino.</p>
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wide text-brand-300">
            Tienda
          </h4>
          <ul className="mt-3 space-y-2 text-sm text-brand-100">
            <li>
              <Link href="/productos" className="hover:text-cream-100">
                Todos los productos
              </Link>
            </li>
            <li>
              <Link href="/categorias/mates" className="hover:text-cream-100">
                Mates
              </Link>
            </li>
            <li>
              <Link href="/categorias/cuero-y-marroquineria" className="hover:text-cream-100">
                Cuero y Marroquinería
              </Link>
            </li>
            <li>
              <Link href="/categorias/regionales" className="hover:text-cream-100">
                Regionales
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wide text-brand-300">
            Visitanos
          </h4>
          <p className="mt-3 text-sm text-brand-100">San Martín al 2500</p>
          <p className="text-sm text-brand-100">Santa Fe capital, Argentina</p>
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wide text-brand-300">
            Contacto
          </h4>
          <ul className="mt-3 space-y-2 text-sm text-brand-100">
            <li>WhatsApp: 3424 23-9011</li>
            <li>
              Instagram:{" "}
              <a
                href="https://www.instagram.com/hechocuero.sf/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-cream-100"
              >
                @hechocuero.sf
              </a>
            </li>
          </ul>
        </div>
      </Container>
      <div className="border-t border-brand-800 py-5 text-center text-xs text-brand-300">
        © {new Date().getFullYear()} Hecho Cuero. Todos los derechos reservados.
      </div>
    </footer>
  );
}
