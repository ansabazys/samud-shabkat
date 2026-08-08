import { z } from "zod";

export const addItemSchema = z.object({
  productId: z.string().uuid("Invalid product ID format"),
  quantity: z.coerce
    .number()
    .int()
    .positive("Quantity must be at least 1")
    .default(1),
});

export const updateItemSchema = z.object({
  quantity: z.coerce.number().int().min(0, "Quantity cannot be negative"),
});

export const cartItemParamsSchema = z.object({
  id: z.string().uuid("Invalid cart item ID format"),
});

export type AddItemInput = z.infer<typeof addItemSchema>;
export type UpdateItemInput = z.infer<typeof updateItemSchema>;
export type CartItemParams = z.infer<typeof cartItemParamsSchema>;
