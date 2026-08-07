import { ProductForm } from "@/components/admin/ProductForm";
import { getAllCategories } from "@/lib/products";
import { createProduct } from "../actions";

export default async function NewProductPage() {
  const categories = await getAllCategories();

  return (
    <div>
      <h1 className="mb-8 font-display text-2xl text-brand-900">Nuevo producto</h1>
      <ProductForm action={createProduct} categories={categories} submitLabel="Crear producto" />
    </div>
  );
}
