import type { UploadFolder } from "../../schemas/media.schema.js";

export interface StorageUploadOptions {
  fileBuffer: Buffer;
  originalFilename: string;
  mimetype: string;
  folder?: UploadFolder;
}

export interface StorageUploadResult {
  id: string;
  key: string;
  url: string;
  filename: string;
  mimetype: string;
  size: number;
  folder: UploadFolder;
  provider: "cloudinary" | "r2" | "local" | "fallback";
  createdAt: string;
}

export interface IStorageProvider {
  readonly name: string;
  isAvailable(): boolean;
  upload(options: StorageUploadOptions): Promise<StorageUploadResult>;
  delete?(key: string): Promise<boolean>;
}
