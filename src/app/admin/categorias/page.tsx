import Link from "next/link";
import { asc } from "drizzle-orm";
import { db } from "@/db";
import { categories } from "@/db/schema";
import { CategoryForm } from "@/components/admin/CategoryForm";
import { DeleteCategoryButton } from "@/components/admin/DeleteCategoryButton";
import { createCategory, deleteCategory } from "./actions";

export default async function AdminCategoriesPage() {
  const allCategories = await db.query.categories.findMany({
    orderBy: asc(categories.name),
  });

  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_360px]">
      <div>
        <h1 className="mb-8 font-display text-2xl text-brand-900">Categorías</h1>
        <div className="overflow-hidden rounded-2xl border border-border bg-surface">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-muted">
                <th className="px-4 py-3 font-medium">Nombre</th>
                <th className="px-4 py-3 font-medium">Slug</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {allCategories.map((cat) => (
                <tr key={cat.id} className="border-b border-border last:border-0">
                  <td className="px-4 py-3 font-medium text-brand-900">{cat.name}</td>
                  <td className="px-4 py-3 text-brand-700">{cat.slug}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-4">
                      <Link
                        href={`/admin/categorias/${cat.id}`}
                        className="text-sm font-medium text-brand-800 hover:underline"
                      >
                        Editar
                      </Link>
                      <DeleteCategoryButton
                        categoryName={cat.name}
                        onDelete={deleteCategory.bind(null, cat.id)}
                      />
                    </div>
                  </td>
                </tr>
              ))}
              {allCategories.length === 0 && (
                <tr>
                  <td colSpan={3} className="px-4 py-8 text-center text-muted">
                    Todavía no hay categorías.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <h2 className="mb-4 font-display text-lg text-brand-900">Nueva categoría</h2>
        <CategoryForm action={createCategory} submitLabel="Crear categoría" />
      </div>
    </div>
  );
}
