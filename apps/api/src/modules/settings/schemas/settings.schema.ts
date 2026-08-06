import { z } from "zod";

export const updateSettingsSchema = z.object({
  companyName: z.string().min(1).max(255).optional(),
  supportEmail: z.string().email().optional(),
  contactPhone: z.string().min(5).max(50).optional(),
  officeAddress: z.string().min(5).optional(),
  defaultCurrency: z.string().max(10).optional(),
  isMaintenanceMode: z.boolean().optional(),
});

export type UpdateSettingsInput = z.infer<typeof updateSettingsSchema>;
