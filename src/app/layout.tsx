import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/lib/cart/cart-context";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { db } from "@/db";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

// The whole store reads live stock/cart/order data from Postgres, so nothing
// here should be statically prerendered at build time.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Hecho Cuero — Cuero, mates y productos regionales",
  description:
    "Cuero 100% argentino. Mates, marroquinería y productos regionales hechos a mano en Santa Fe.",
};

async function getNavCategories() {
  try {
    return await db.query.categories.findMany({
      columns: { name: true, slug: true },
      orderBy: (c, { asc }) => [asc(c.name)],
    });
  } catch {
    return [];
  }
}

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const navCategories = await getNavCategories();

  return (
    <html
      lang="es"
      className={`${fraunces.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <CartProvider>
          <Header categories={navCategories} />
          <main className="flex flex-1 flex-col">{children}</main>
          <Footer />
          <CartDrawer />
        </CartProvider>
      </body>
    </html>
  );
}
