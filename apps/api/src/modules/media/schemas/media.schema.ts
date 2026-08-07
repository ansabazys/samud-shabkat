import { z } from "zod";

export const uploadFolderSchema = z
  .enum(["products", "categories", "brands", "general"])
  .default("products");

export const uploadQuerySchema = z.object({
  folder: uploadFolderSchema,
});

export type UploadFolder = z.infer<typeof uploadFolderSchema>;
export type UploadQuery = z.infer<typeof uploadQuerySchema>;
