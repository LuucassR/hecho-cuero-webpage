import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { products } from "@/db/schema";
import { ProductForm } from "@/components/admin/ProductForm";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { DeleteProductButton } from "@/components/admin/DeleteProductButton";
import { getAllCategories } from "@/lib/products";
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
      with: { images: { orderBy: (img, { asc }) => [asc(img.position)] } },
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

      <ProductForm
        action={boundUpdate}
        categories={categories}
        submitLabel="Guardar cambios"
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
