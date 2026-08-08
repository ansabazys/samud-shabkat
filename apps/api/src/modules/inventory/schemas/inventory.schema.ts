import { z } from "zod";

export const productInventoryParamsSchema = z.object({
  productId: z.string().uuid("Invalid product ID format"),
});

export const adjustInventorySchema = z.object({
  productId: z.string().uuid("Invalid product ID format"),
  adjustmentType: z.enum(["ADD", "SUBTRACT", "SET"]),
  quantity: z.coerce
    .number()
    .int()
    .nonnegative("Quantity must be a positive integer"),
  reference: z.string().optional(),
  notes: z.string().optional(),
});

export const lowStockQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional().default(1),
  limit: z.coerce.number().int().positive().max(100).optional().default(20),
  search: z.string().optional(),
});

export const inventoryTxQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional().default(1),
  limit: z.coerce.number().int().positive().max(100).optional().default(20),
  productId: z.string().uuid().optional(),
});

export type ProductInventoryParams = z.infer<
  typeof productInventoryParamsSchema
>;
export type AdjustInventoryInput = z.infer<typeof adjustInventorySchema>;
export type LowStockQueryParams = z.infer<typeof lowStockQuerySchema>;
export type InventoryTxQueryParams = z.infer<typeof inventoryTxQuerySchema>;
