import { v2 as cloudinary, type UploadApiResponse } from "cloudinary";
import { randomUUID } from "node:crypto";
import type {
  IStorageProvider,
  StorageUploadOptions,
  StorageUploadResult,
} from "./storage.types.js";

export class CloudinaryStorageProvider implements IStorageProvider {
  readonly name = "cloudinary";
  private initialized = false;

  constructor() {
    this.init();
  }

  private init() {
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;
    const cloudinaryUrl = process.env.CLOUDINARY_URL;

    if (cloudinaryUrl) {
      cloudinary.config({ url: cloudinaryUrl });
      this.initialized = true;
      console.log("☁️ [MediaService] Initialized Cloudinary via CLOUDINARY_URL");
    } else if (cloudName && apiKey && apiSecret) {
      cloudinary.config({
        cloud_name: cloudName,
        api_key: apiKey,
        api_secret: apiSecret,
        secure: true,
      });
      this.initialized = true;
      console.log(
        `☁️ [MediaService] Initialized Cloudinary for cloud: ${cloudName}`,
      );
    }
  }

  isAvailable(): boolean {
    return this.initialized;
  }

  async upload(options: StorageUploadOptions): Promise<StorageUploadResult> {
    if (!this.initialized) {
      this.init();
      if (!this.initialized) {
        throw new Error(
          "Cloudinary credentials missing. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET.",
        );
      }
    }

    const folder = options.folder || "products";
    const fileId = randomUUID();
    const cleanFilename = options.originalFilename
      .replace(/\.[^/.]+$/, "")
      .replace(/[^a-zA-Z0-9-_]/g, "_");
    const publicId = `${fileId}-${cleanFilename}`;

    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: `samud-shabkat/${folder}`,
          public_id: publicId,
          resource_type: "auto",
          overwrite: false,
        },
        (error, result: UploadApiResponse | undefined) => {
          if (error || !result) {
            return reject(
              error || new Error("Cloudinary upload returned an empty result"),
            );
          }

          resolve({
            id: fileId,
            key: result.public_id,
            url: result.secure_url,
            filename: options.originalFilename,
            mimetype: options.mimetype,
            size: result.bytes || options.fileBuffer.length,
            folder,
            provider: "cloudinary",
            createdAt: new Date().toISOString(),
          });
        },
      );

      uploadStream.end(options.fileBuffer);
    });
  }

  async delete(key: string): Promise<boolean> {
    if (!this.initialized) return false;
    try {
      const result = await cloudinary.uploader.destroy(key);
      return result.result === "ok";
    } catch (err) {
      console.warn(
        `[CloudinaryStorageProvider] Failed to delete file with key ${key}:`,
        err,
      );
      return false;
    }
  }
}
