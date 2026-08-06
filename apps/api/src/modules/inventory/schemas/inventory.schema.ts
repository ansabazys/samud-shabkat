import { z } from "zod";

export const productInventoryParamsSchema = z.object({
  productId: z.string().uuid("Invalid product ID format"),
});

export const inventoryQuerySchema = z.object({
  warehouseId: z.string().uuid("Invalid warehouse ID format").optional(),
});

export type ProductInventoryParams = z.infer<
  typeof productInventoryParamsSchema
>;
export type InventoryQueryParams = z.infer<typeof inventoryQuerySchema>;
