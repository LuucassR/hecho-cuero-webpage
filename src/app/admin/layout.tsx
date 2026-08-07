import Link from "next/link";
import { logoutAction } from "./login/actions";

const NAV_ITEMS = [
  { href: "/admin", label: "Panel" },
  { href: "/admin/productos", label: "Productos" },
  { href: "/admin/categorias", label: "Categorías" },
  { href: "/admin/pedidos", label: "Pedidos" },
  { href: "/admin/configuracion", label: "Configuración" },
];

export default function AdminLayout({ children }: LayoutProps<"/admin">) {
  return (
    <div className="flex min-h-screen bg-cream-200">
      <aside className="hidden w-60 shrink-0 flex-col border-r border-border bg-brand-950 text-cream-100 sm:flex">
        <div className="px-6 py-6">
          <span className="font-display text-lg">Hecho Cuero</span>
          <p className="text-xs text-brand-300">Administración</p>
        </div>
        <nav className="flex-1 space-y-1 px-3">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block rounded-lg px-3 py-2 text-sm text-brand-100 hover:bg-brand-900"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <form action={logoutAction} className="border-t border-brand-800 p-3">
          <button
            type="submit"
            className="w-full rounded-lg px-3 py-2 text-left text-sm text-brand-200 hover:bg-brand-900"
          >
            Cerrar sesión
          </button>
        </form>
      </aside>

      <div className="flex-1">
        <header className="border-b border-border bg-surface px-4 py-3 sm:hidden">
          <div className="flex items-center justify-between">
            <span className="font-display text-brand-900">Hecho Cuero — Admin</span>
            <form action={logoutAction}>
              <button type="submit" className="text-sm text-brand-800">
                Salir
              </button>
            </form>
          </div>
          <nav className="mt-2 flex flex-wrap gap-3">
            {NAV_ITEMS.map((item) => (
              <Link key={item.href} href={item.href} className="text-sm text-brand-700">
                {item.label}
              </Link>
            ))}
          </nav>
        </header>
        <main className="p-6 sm:p-10">{children}</main>
      </div>
    </div>
  );
}
