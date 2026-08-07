import { inArray } from "drizzle-orm";
import { db } from "./index";
import { categories, productImages, products } from "./schema";

async function main() {
  console.log("Sembrando categorías...");
  await db
    .insert(categories)
    .values([
      {
        name: "Mates",
        slug: "mates",
        description: "Mates y accesorios para cebar.",
        imageUrl: "/bombilla-3.jpeg",
      },
      {
        name: "Cuero y Marroquinería",
        slug: "cuero-y-marroquineria",
        description: "Productos de cuero 100% argentino.",
        imageUrl: "/bolso-mate-1.jpeg",
      },
      {
        name: "Regionales",
        slug: "regionales",
        description: "Productos regionales y artesanales.",
        imageUrl: "/bolso-de-mate-afa-publicidad.jpeg",
      },
    ])
    .onConflictDoNothing();

  const categorySlugs = ["mates", "cuero-y-marroquineria", "regionales"] as const;
  const allCategories = await db.query.categories.findMany({
    where: inArray(categories.slug, categorySlugs),
  });
  const categoryId = (slug: (typeof categorySlugs)[number]) =>
    allCategories.find((c) => c.slug === slug)!.id;

  console.log("Limpiando productos existentes...");
  await db.delete(products);

  console.log("Sembrando productos...");
  const productDefs = [
    {
      slug: "canasta-gloria-negra",
      name: "Canasta Gloria Negra",
      description:
        "Canasta de cuero para mate, tejido tallado a mano en cuero vacuno negro, con doble asa y costura zigzag.",
      priceCents: 4500000,
      stock: 10,
      categoryId: categoryId("cuero-y-marroquineria"),
      specifications: [
        "Cuero vacuno 100% argentino",
        "Tallado a mano en el frente",
        "Costura zigzag reforzada",
        "Doble asa remachada",
        "Medidas aproximadas: 18 x 14 x 12 cm",
        "Ideal para llevar mate, yerba y termo",
      ],
      images: ["/bolso-mate-1.jpeg", "/bolsos-mates-3-colores.jpeg"],
    },
    {
      slug: "canasta-gloria-marron",
      name: "Canasta Gloria Marrón",
      description:
        "Canasta de cuero para mate, tejido tallado a mano en cuero vacuno marrón, con doble asa y costura zigzag.",
      priceCents: 4500000,
      stock: 8,
      categoryId: categoryId("cuero-y-marroquineria"),
      specifications: [
        "Cuero vacuno 100% argentino",
        "Tallado a mano en el frente",
        "Costura zigzag reforzada",
        "Doble asa remachada",
        "Medidas aproximadas: 18 x 14 x 12 cm",
        "Ideal para llevar mate, yerba y termo",
      ],
      images: ["/bolsos-mates-3-colores.jpeg"],
    },
    {
      slug: "canasta-gloria-bordo",
      name: "Canasta Gloria Bordó",
      description:
        "Canasta de cuero para mate, tejido tallado a mano en cuero vacuno bordó, con doble asa y costura zigzag.",
      priceCents: 4500000,
      stock: 8,
      categoryId: categoryId("cuero-y-marroquineria"),
      specifications: [
        "Cuero vacuno 100% argentino",
        "Tallado a mano en el frente",
        "Costura zigzag reforzada",
        "Doble asa remachada",
        "Medidas aproximadas: 18 x 14 x 12 cm",
        "Ideal para llevar mate, yerba y termo",
      ],
      images: ["/bolsos-mates-3-colores.jpeg"],
    },
    {
      slug: "bolso-mate-matelase",
      name: "Bolso Mate Matelasé",
      description:
        "Bolso de cuero texturado acolchado con medallón grabado, asas reforzadas y remaches metálicos.",
      priceCents: 5200000,
      stock: 10,
      categoryId: categoryId("cuero-y-marroquineria"),
      specifications: [
        "Cuero texturado acolchado",
        "Medallón de cuero grabado",
        "Asas reforzadas con remaches",
        "Costura zigzag en la base",
        "Medidas aproximadas: 20 x 15 x 10 cm",
      ],
      images: ["/bolso-mate-2.jpeg", "/bolso-mate-2-1.jpeg"],
    },
    {
      slug: "portayerba-de-cuero",
      name: "Portayerba de Cuero",
      description:
        "Estuche de cuero con cierre y grabado de sol, ideal para llevar yerba, azúcar o accesorios de mate.",
      priceCents: 2400000,
      stock: 15,
      categoryId: categoryId("cuero-y-marroquineria"),
      specifications: [
        "Cuero vacuno genuino",
        "Cierre con cremallera metálica",
        "Grabado sol de mayo",
        "Medidas aproximadas: 22 x 16 cm",
        "Ideal para yerba, azúcar o accesorios",
      ],
      images: ["/coso-de-mate.jpeg"],
    },
    {
      slug: "bombilla-alpaca-lisa",
      name: "Bombilla de Alpaca Lisa",
      description: "Bombilla clásica de alpaca con cuchara filtro de perforación fina.",
      priceCents: 1200000,
      stock: 25,
      categoryId: categoryId("mates"),
      specifications: [
        "Alpaca (metal blanco) de alta calidad",
        "Cuchara filtro con perforaciones finas",
        "Apta para lavavajillas",
        "Largo aproximado: 19 cm",
      ],
      images: ["/bombilla-1.jpeg"],
    },
    {
      slug: "bombilla-pico-de-bronce",
      name: "Bombilla Pico de Bronce",
      description:
        "Bombilla de acero inoxidable con boquilla de bronce, cuchara filtro removible.",
      priceCents: 1350000,
      stock: 20,
      categoryId: categoryId("mates"),
      specifications: [
        "Cuerpo de acero inoxidable con boquilla de bronce",
        "Cuchara filtro removible",
        "Resistente al uso diario",
        "Largo aproximado: 18 cm",
      ],
      images: ["/bombilla-2.jpeg"],
    },
    {
      slug: "bombilla-espiral-de-alpaca",
      name: "Bombilla Espiral de Alpaca",
      description: "Bombilla de diseño clásico argentino, cuerpo espiralado de alpaca.",
      priceCents: 1400000,
      stock: 20,
      categoryId: categoryId("mates"),
      specifications: [
        "Cuerpo espiralado de alpaca",
        "Diseño clásico argentino",
        "Filtro de perforación fina",
        "Largo aproximado: 19 cm",
      ],
      images: ["/bombilla-3.jpeg", "/bombilla-5.jpeg"],
    },
    {
      slug: "bombilla-pico-de-loro",
      name: "Bombilla Pico de Loro",
      description:
        "Bombilla de diseño tradicional pico de loro, cuerpo de acero con detalle en bronce.",
      priceCents: 1300000,
      stock: 18,
      categoryId: categoryId("mates"),
      specifications: [
        "Diseño tradicional pico de loro",
        "Cuerpo de acero inoxidable con detalle en bronce",
        "Boquilla plana, sin filtro removible",
        "Largo aproximado: 17 cm",
      ],
      images: ["/bombilla-4.jpeg"],
    },
  ];

  for (const def of productDefs) {
    const { images, ...productData } = def;
    const [inserted] = await db.insert(products).values(productData).returning({ id: products.id });
    await db.insert(productImages).values(
      images.map((url, position) => ({
        productId: inserted.id,
        url,
        alt: def.name,
        position,
      })),
    );
  }

  console.log("Listo.");
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
