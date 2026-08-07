import { z } from "zod";

export const orderItemSchema = z.object({
  productId: z.string().uuid("Invalid product ID").optional(),
  productName: z.string().min(1, "Product name is required"),
  sku: z.string().min(1, "SKU is required"),
  unitPrice: z.coerce.number().positive("Unit price must be positive"),
  quantity: z.coerce.number().int().positive("Quantity must be at least 1"),
  specifications: z.record(z.unknown()).optional().default({}),
});

export const createOrderSchema = z.object({
  companyName: z.string().max(255).optional(),
  contactPhone: z.string().min(5, "Contact phone is required").max(30),
  billingAddress: z
    .string()
    .min(1, "Billing address is required")
    .optional()
    .default("Store Address"),
  shippingAddress: z
    .string()
    .min(1, "Shipping address is required")
    .optional()
    .default("Store Pickup"),
  fulfillmentType: z
    .enum(["STORE_PICKUP", "HOME_DELIVERY"])
    .optional()
    .default("HOME_DELIVERY"),
  paymentMethod: z
    .enum(["CASH_ON_DELIVERY", "CASH_ON_PICKUP", "CASH"])
    .optional()
    .default("CASH_ON_DELIVERY"),
  notes: z.string().optional(),
  items: z
    .array(orderItemSchema)
    .min(1, "At least one item is required in the order"),
});

export const updateOrderStatusSchema = z.object({
  orderStatus: z.enum([
    "PENDING",
    "CONFIRMED",
    "PROCESSING",
    "READY_FOR_COLLECTION",
    "READY_FOR_PICKUP",
    "OUT_FOR_DELIVERY",
    "DELIVERED",
    "COMPLETED",
    "CANCELLED",
  ]),
});

export const updatePaymentStatusSchema = z.object({
  paymentStatus: z.enum(["PENDING", "PAID", "FAILED", "REFUNDED"]),
});

export const collectCashSchema = z.object({
  notes: z.string().optional(),
  paymentMethod: z
    .enum(["CASH_ON_DELIVERY", "CASH_ON_PICKUP", "CASH"])
    .optional()
    .default("CASH"),
});

export const orderQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional().default(1),
  limit: z.coerce.number().int().positive().max(100).optional().default(20),
  search: z.string().optional(),
  orderStatus: z.string().optional(),
  paymentStatus: z.string().optional(),
  fulfillmentType: z.enum(["STORE_PICKUP", "HOME_DELIVERY"]).optional(),
  userId: z.string().uuid().optional(),
  sortBy: z
    .enum(["createdAt", "totalAmount", "orderNumber"])
    .optional()
    .default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).optional().default("desc"),
});

export const orderParamsSchema = z.object({
  id: z.string().uuid("Invalid order ID format"),
});

export type CreateOrderInput = z.infer<typeof createOrderSchema>;
export type UpdateOrderStatusInput = z.infer<typeof updateOrderStatusSchema>;
export type UpdatePaymentStatusInput = z.infer<
  typeof updatePaymentStatusSchema
>;
export type CollectCashInput = z.infer<typeof collectCashSchema>;
export type OrderQueryParams = z.infer<typeof orderQuerySchema>;
