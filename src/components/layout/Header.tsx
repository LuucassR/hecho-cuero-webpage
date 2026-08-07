"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useCart } from "@/lib/cart/cart-context";
import { Container } from "@/components/ui/Container";

type NavCategory = { name: string; slug: string };

export function Header({ categories }: { categories: NavCategory[] }) {
  const { totalQuantity, openCart } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-cream-100/95 backdrop-blur">
      <Container className="flex h-20 items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/hecho-cuero-logo.png"
            alt="Hecho Cuero"
            width={48}
            height={48}
            className="h-12 w-12 rounded-full object-cover"
            priority
          />
          <span className="font-display text-lg tracking-wide text-brand-900 sm:text-xl">
            Hecho Cuero
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          <Link
            href="/productos"
            className="text-sm font-medium text-brand-800 hover:text-brand-950"
          >
            Todos los productos
          </Link>
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/categorias/${cat.slug}`}
              className="text-sm font-medium text-brand-800 hover:text-brand-950"
            >
              {cat.name}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button
            onClick={openCart}
            className="relative flex h-11 w-11 items-center justify-center rounded-full text-brand-900 hover:bg-brand-100"
            aria-label="Abrir carrito"
          >
            <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
              <circle cx="9" cy="21" r="1.4" fill="currentColor" stroke="none" />
              <circle cx="20" cy="21" r="1.4" fill="currentColor" stroke="none" />
            </svg>
            {totalQuantity > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-brand-900 px-1 text-[10px] font-semibold text-cream-100">
                {totalQuantity}
              </span>
            )}
          </button>
          <button
            className="flex h-11 w-11 items-center justify-center rounded-full text-brand-900 hover:bg-brand-100 md:hidden"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Abrir menú"
          >
            <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5" />
            </svg>
          </button>
        </div>
      </Container>

      {menuOpen && (
        <nav className="flex flex-col gap-1 border-t border-border px-4 py-3 md:hidden">
          <Link
            href="/productos"
            className="rounded-lg px-3 py-2 text-sm font-medium text-brand-800 hover:bg-brand-100"
            onClick={() => setMenuOpen(false)}
          >
            Todos los productos
          </Link>
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/categorias/${cat.slug}`}
              className="rounded-lg px-3 py-2 text-sm font-medium text-brand-800 hover:bg-brand-100"
              onClick={() => setMenuOpen(false)}
            >
              {cat.name}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
