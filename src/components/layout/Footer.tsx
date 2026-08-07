import Link from "next/link";
import { Container } from "@/components/ui/Container";

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
      <path d="M12.001 2C6.478 2 2 6.477 2 12c0 1.892.526 3.66 1.438 5.166L2 22l4.965-1.404A9.953 9.953 0 0 0 12.001 22C17.523 22 22 17.523 22 12S17.523 2 12.001 2zm0 18.062a8.02 8.02 0 0 1-4.099-1.126l-.294-.175-3.048.862.83-3.037-.192-.312A8.03 8.03 0 1 1 20.03 12a8.038 8.038 0 0 1-8.029 8.062z" />
    </svg>
  );
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className={className}>
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function Footer() {
  return (
    <footer className="mt-24 border-t border-border bg-brand-950 text-cream-100">
      <Container className="grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-5">
        <div>
          <h3 className="font-display text-xl">Hecho Cuero</h3>
          <p className="mt-3 text-sm italic text-brand-200">
            Acompañando tus pasos, compartiendo tu ritual...
          </p>
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

        <div className="lg:col-span-2">
          <h4 className="text-sm font-semibold uppercase tracking-wide text-brand-300">
            Visitanos
          </h4>
          <div className="mt-3 flex flex-col gap-4 sm:flex-row sm:items-start">
            <div>
              <p className="text-sm text-brand-100">San Martín al 2500</p>
              <p className="text-sm text-brand-100">Santa Fe capital, Argentina</p>
              <a
                href="https://www.google.com/maps/search/?api=1&query=San+Mart%C3%ADn+2500,+Santa+Fe,+Argentina"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-block text-sm text-brand-300 hover:text-cream-100 hover:underline"
              >
                Ver en Google Maps
              </a>
            </div>
            <iframe
              title="Ubicación de Hecho Cuero"
              src="https://www.google.com/maps?q=San+Mart%C3%ADn+2500,+Santa+Fe,+Argentina&output=embed"
              className="h-32 w-full shrink-0 rounded-lg border border-brand-800 sm:w-48"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wide text-brand-300">
            Contacto
          </h4>
          <ul className="mt-3 space-y-2 text-sm text-brand-100">
            <li>
              <a
                href="https://wa.me/5493424239011"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-cream-100"
              >
                <WhatsAppIcon className="h-4 w-4 shrink-0" />
                WhatsApp: 3424 23-9011
              </a>
            </li>
            <li>
              <a
                href="https://www.instagram.com/hechocuero.sf/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-cream-100"
              >
                <InstagramIcon className="h-4 w-4 shrink-0" />
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
