import { z } from "zod";

export const createProductSchema = z.object({
  name: z.string().min(1, "Product name is required").max(255).trim(),
  sku: z.string().min(1, "SKU is required").max(100).trim(),
  shortDescription: z.string().optional(),
  description: z.string().optional(),
  price: z.coerce.number().positive("Price must be a positive number"),
  categoryId: z.string().uuid("Invalid category ID"),
  brandId: z.string().uuid("Invalid brand ID"),
  specifications: z.record(z.unknown()).optional().default({}),
  isActive: z.boolean().optional().default(true),
  initialStock: z.coerce.number().int().nonnegative().optional().default(50),
  images: z
    .array(
      z.object({
        url: z.string().min(1, "Image URL is required"),
        storageKey: z.string().optional().default("direct-upload"),
        altText: z.string().optional(),
        sortOrder: z.number().int().optional().default(0),
        isPrimary: z.boolean().optional().default(false),
      }),
    )
    .optional(),
});

export const updateProductSchema = createProductSchema.partial();

export const productQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional().default(1),
  limit: z.coerce.number().int().positive().max(100).optional().default(20),
  search: z.string().optional(),
  categoryId: z.string().uuid().optional(),
  brandId: z.string().uuid().optional(),
  minPrice: z.coerce.number().optional(),
  maxPrice: z.coerce.number().optional(),
  isActive: z.enum(["true", "false"]).optional(),
  sortBy: z
    .enum(["name", "price", "createdAt"])
    .optional()
    .default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).optional().default("desc"),
});

export const productParamsSchema = z.object({
  id: z.string().min(1, "Product identifier is required"),
});

export const addProductImageSchema = z.object({
  url: z.string().min(1, "Image URL is required"),
  storageKey: z.string().optional().default("direct-upload"),
  altText: z.string().optional(),
  sortOrder: z.number().int().optional().default(0),
  isPrimary: z.boolean().optional().default(false),
});

export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
export type ProductQueryParams = z.infer<typeof productQuerySchema>;
export type AddProductImageInput = z.infer<typeof addProductImageSchema>;
