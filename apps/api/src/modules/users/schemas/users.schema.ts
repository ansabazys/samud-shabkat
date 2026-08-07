import { z } from "zod";

export const createUserSchema = z.object({
  email: z.string().email("Invalid email format").trim().toLowerCase(),
  password: z.string().min(6, "Password must be at least 6 characters"),
  firstName: z.string().min(1, "First name is required").trim(),
  lastName: z.string().min(1, "Last name is required").trim(),
  role: z
    .enum(["SUPER_ADMIN", "ADMIN", "STAFF", "DELIVERY_BOY", "CUSTOMER"])
    .optional()
    .default("STAFF"),
  phoneNumber: z.string().optional(),
  isActive: z.boolean().optional().default(true),
});

export const updateUserSchema = z.object({
  email: z
    .string()
    .email("Invalid email format")
    .trim()
    .toLowerCase()
    .optional(),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .optional(),
  firstName: z.string().min(1, "First name is required").trim().optional(),
  lastName: z.string().min(1, "Last name is required").trim().optional(),
  role: z
    .enum(["SUPER_ADMIN", "ADMIN", "STAFF", "DELIVERY_BOY", "CUSTOMER"])
    .optional(),
  phoneNumber: z.string().optional(),
  isActive: z.boolean().optional(),
});

export const userQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional().default(1),
  limit: z.coerce.number().int().positive().max(100).optional().default(20),
  search: z.string().optional(),
  role: z.string().optional(),
  isActive: z
    .string()
    .transform((val) => val === "true")
    .optional(),
  sortBy: z
    .enum(["createdAt", "email", "firstName", "lastName"])
    .optional()
    .default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).optional().default("desc"),
});

export const userParamsSchema = z.object({
  id: z.string().uuid("Invalid user ID format"),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type UserQueryParams = z.infer<typeof userQuerySchema>;
