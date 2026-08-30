import type { UploadFolder } from "../schemas/media.schema.js";
import { CloudinaryStorageProvider } from "./storage/cloudinary.provider.js";
import { R2StorageProvider } from "./storage/r2.provider.js";
import { LocalStorageProvider } from "./storage/local.provider.js";
import type { IStorageProvider, StorageUploadResult } from "./storage/storage.types.js";

export type UploadedFileResult = StorageUploadResult;

export class MediaService {
  private cloudinaryProvider: CloudinaryStorageProvider;
  private r2Provider: R2StorageProvider;
  private localProvider: LocalStorageProvider;

  constructor() {
    this.cloudinaryProvider = new CloudinaryStorageProvider();
    this.r2Provider = new R2StorageProvider();
    this.localProvider = new LocalStorageProvider();
  }

  /**
   * Resolves which storage provider should be used:
   * 1. Explicit `STORAGE_PROVIDER` ("cloudinary" | "r2" | "local")
   * 2. In production -> default to Cloudflare R2 or Cloudinary if available
   * 3. In development / fallback -> Local Disk Storage
   */
  getStorageProvider(): IStorageProvider {
    const preference = process.env.STORAGE_PROVIDER?.toLowerCase();

    if (preference === "cloudinary" && this.cloudinaryProvider.isAvailable()) {
      return this.cloudinaryProvider;
    }
    if (preference === "r2" && this.r2Provider.isAvailable()) {
      return this.r2Provider;
    }
    if (preference === "local") {
      return this.localProvider;
    }

    const isProduction = process.env.NODE_ENV === "production";

    if (isProduction && this.r2Provider.isAvailable()) {
      return this.r2Provider;
    }

    if (this.cloudinaryProvider.isAvailable()) {
      return this.cloudinaryProvider;
    }

    if (this.r2Provider.isAvailable()) {
      return this.r2Provider;
    }

    // Default to local disk storage so real uploads work seamlessly
    return this.localProvider;
  }

  async processAndUploadFile(
    fileBuffer: Buffer,
    originalFilename: string,
    mimetype: string,
    folder: UploadFolder = "products",
  ): Promise<UploadedFileResult> {
    const provider = this.getStorageProvider();

    try {
      return await provider.upload({
        fileBuffer,
        originalFilename,
        mimetype,
        folder,
      });
    } catch (err) {
      console.error(`[MediaService] Upload failed via ${provider.name}:`, err);
      if (provider.name !== "local") {
        console.log("[MediaService] Falling back to local disk storage...");
        return await this.localProvider.upload({
          fileBuffer,
          originalFilename,
          mimetype,
          folder,
        });
      }
      throw err;
    }
  }

  async deleteFile(key: string, providerName?: string): Promise<boolean> {
    if (providerName === "cloudinary" || (!providerName && this.cloudinaryProvider.isAvailable())) {
      return this.cloudinaryProvider.delete(key);
    }
    if (providerName === "r2" || (!providerName && this.r2Provider.isAvailable())) {
      return this.r2Provider.delete(key);
    }
    return this.localProvider.delete(key);
  }
}

export const mediaService = new MediaService();
