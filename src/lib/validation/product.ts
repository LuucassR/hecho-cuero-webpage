import { z } from "zod";

export const productSchema = z.object({
  name: z.string().trim().min(2, "El nombre es obligatorio"),
  slug: z
    .string()
    .trim()
    .min(2, "El slug es obligatorio")
    .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "El slug solo puede tener minúsculas, números y guiones"),
  description: z.string().trim().default(""),
  priceCents: z.coerce.number().int().min(0, "El precio no puede ser negativo"),
  stock: z.coerce.number().int().min(0, "El stock no puede ser negativo"),
  specifications: z
    .array(z.string().trim().min(1))
    .default([]),
  categoryId: z.coerce.number().int().positive().nullable(),
  active: z.coerce.boolean().default(true),
});

export type ProductInput = z.infer<typeof productSchema>;

export const categorySchema = z.object({
  name: z.string().trim().min(2, "El nombre es obligatorio"),
  slug: z
    .string()
    .trim()
    .min(2, "El slug es obligatorio")
    .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "El slug solo puede tener minúsculas, números y guiones"),
  description: z.string().trim().optional(),
});

export type CategoryInput = z.infer<typeof categorySchema>;
