import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { products } from "@/db/schema";
import { ProductForm } from "@/components/admin/ProductForm";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { DeleteProductButton } from "@/components/admin/DeleteProductButton";
import { OptionsManager } from "@/components/admin/OptionsManager";
import { VariantsTable } from "@/components/admin/VariantsTable";
import { getAllCategories } from "@/lib/products";
import { mapVariant } from "@/lib/variants";
import { deleteProduct, updateProduct } from "../../actions";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: idParam } = await params;
  const id = Number(idParam);
  if (Number.isNaN(id)) notFound();

  const [product, categories] = await Promise.all([
    db.query.products.findFirst({
      where: eq(products.id, id),
      with: {
        images: { orderBy: (img, { asc }) => [asc(img.position)] },
        options: {
          orderBy: (opt, { asc }) => [asc(opt.position)],
          with: { values: { orderBy: (val, { asc }) => [asc(val.position)] } },
        },
        variants: { with: { variantValues: { with: { optionValue: true } } } },
      },
    }),
    getAllCategories(),
  ]);
  if (!product) notFound();

  const boundUpdate = updateProduct.bind(null, id);
  const boundDelete = deleteProduct.bind(null, id);

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <h1 className="font-display text-2xl text-brand-900">Editar producto</h1>
        <DeleteProductButton productName={product.name} onDelete={boundDelete} />
      </div>

      <div className="mb-10 max-w-2xl">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted">
          Imágenes
        </h2>
        <ImageUploader productId={product.id} images={product.images} />
      </div>

      <div className="mb-10">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted">
          Opciones (color, talle, etc.)
        </h2>
        <OptionsManager productId={product.id} defaultOptions={product.options} />
      </div>

      {product.options.length > 0 && (
        <div className="mb-10">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted">
            Variantes
          </h2>
          <VariantsTable
            productId={product.id}
            options={product.options.map((o) => ({
              id: o.id,
              name: o.name,
              values: o.values.map((v) => ({ id: v.id, value: v.value })),
            }))}
            variants={product.variants.map(mapVariant)}
          />
        </div>
      )}

      <ProductForm
        action={boundUpdate}
        categories={categories}
        submitLabel="Guardar cambios"
        hasVariants={product.variants.length > 0}
        defaultValues={{
          name: product.name,
          slug: product.slug,
          description: product.description,
          priceCents: product.priceCents,
          stock: product.stock,
          specifications: product.specifications,
          categoryId: product.categoryId,
          active: product.active,
        }}
      />
    </div>
  );
}
