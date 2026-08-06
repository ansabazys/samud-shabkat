import { z } from "zod";

export const createBrandSchema = z.object({
  name: z.string().min(1, "Brand name is required").max(150).trim(),
  description: z.string().optional(),
  logoUrl: z.string().url("Invalid logo URL").optional().or(z.literal("")),
  isActive: z.boolean().optional().default(true),
});

export const updateBrandSchema = createBrandSchema.partial();

export const brandQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional().default(1),
  limit: z.coerce.number().int().positive().max(100).optional().default(20),
  search: z.string().optional(),
  isActive: z.enum(["true", "false"]).optional(),
});

export const brandParamsSchema = z.object({
  id: z.string().uuid("Invalid brand ID format"),
});

export type CreateBrandInput = z.infer<typeof createBrandSchema>;
export type UpdateBrandInput = z.infer<typeof updateBrandSchema>;
export type BrandQueryParams = z.infer<typeof brandQuerySchema>;
