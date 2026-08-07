import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { categories } from "@/db/schema";
import { CategoryForm } from "@/components/admin/CategoryForm";
import { updateCategory } from "../actions";

export default async function EditCategoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: idParam } = await params;
  const id = Number(idParam);
  if (Number.isNaN(id)) notFound();

  const category = await db.query.categories.findFirst({ where: eq(categories.id, id) });
  if (!category) notFound();

  return (
    <div>
      <h1 className="mb-8 font-display text-2xl text-brand-900">Editar categoría</h1>
      <CategoryForm
        action={updateCategory.bind(null, id)}
        submitLabel="Guardar cambios"
        defaultValues={category}
      />
    </div>
  );
}
