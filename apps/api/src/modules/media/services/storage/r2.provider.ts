import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { randomUUID } from "node:crypto";
import type {
  IStorageProvider,
  StorageUploadOptions,
  StorageUploadResult,
} from "./storage.types.js";

export class R2StorageProvider implements IStorageProvider {
  readonly name = "r2";
  private client?: S3Client;
  private bucketName?: string;
  private publicCdnBaseUrl: string;

  constructor() {
    this.publicCdnBaseUrl =
      process.env.R2_PUBLIC_URL ||
      process.env.NEXT_PUBLIC_IMAGE_URL ||
      "https://cdn.samudshabkat.com";
    this.init();
  }

  private init() {
    const r2AccountId = process.env.R2_ACCOUNT_ID;
    const r2AccessKeyId =
      process.env.R2_ACCESS_KEY_ID || process.env.R2_ACCESS_KEY;
    const r2SecretAccessKey =
      process.env.R2_SECRET_ACCESS_KEY || process.env.R2_SECRET_KEY;
    this.bucketName = process.env.R2_BUCKET_NAME;

    if (r2AccountId && r2AccessKeyId && r2SecretAccessKey && this.bucketName) {
      const endpoint =
        process.env.R2_ENDPOINT ||
        `https://${r2AccountId}.r2.cloudflarestorage.com`;

      this.client = new S3Client({
        region: "auto",
        endpoint,
        credentials: {
          accessKeyId: r2AccessKeyId,
          secretAccessKey: r2SecretAccessKey,
        },
      });
      console.log(
        `⚡ [MediaService] Initialized Cloudflare R2 for bucket: ${this.bucketName}`,
      );
    }
  }

  isAvailable(): boolean {
    if (!this.client) {
      this.init();
    }
    return Boolean(this.client && this.bucketName);
  }

  async upload(options: StorageUploadOptions): Promise<StorageUploadResult> {
    if (!this.client || !this.bucketName) {
      this.init();
      if (!this.client || !this.bucketName) {
        throw new Error(
          "Cloudflare R2 is not configured. Set R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, and R2_BUCKET_NAME.",
        );
      }
    }

    const folder = options.folder || "products";
    const fileId = randomUUID();
    const timestamp = Date.now();
    const cleanExt = options.originalFilename.includes(".")
      ? options.originalFilename.split(".").pop()?.toLowerCase()
      : "png";

    const key = `${folder}/${fileId}-${timestamp}.${cleanExt}`;

    await this.client.send(
      new PutObjectCommand({
        Bucket: this.bucketName,
        Key: key,
        Body: options.fileBuffer,
        ContentType: options.mimetype,
        CacheControl: "public, max-age=31536000, immutable",
      }),
    );

    const cleanBaseUrl = this.publicCdnBaseUrl.replace(/\/+$/, "");
    const url = `${cleanBaseUrl}/${key}`;

    return {
      id: fileId,
      key,
      url,
      filename: options.originalFilename,
      mimetype: options.mimetype,
      size: options.fileBuffer.length,
      folder,
      provider: "r2",
      createdAt: new Date().toISOString(),
    };
  }

  async delete(key: string): Promise<boolean> {
    if (!this.client || !this.bucketName) return false;
    try {
      await this.client.send(
        new DeleteObjectCommand({
          Bucket: this.bucketName,
          Key: key,
        }),
      );
      return true;
    } catch (err) {
      console.warn(`[R2StorageProvider] Failed to delete key ${key}:`, err);
      return false;
    }
  }
}
