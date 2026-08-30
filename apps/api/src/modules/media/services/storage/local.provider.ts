import fs from "node:fs";
import path from "node:path";
import { randomUUID } from "node:crypto";
import type {
  IStorageProvider,
  StorageUploadOptions,
  StorageUploadResult,
} from "./storage.types.js";
import type { UploadFolder } from "../../schemas/media.schema.js";

export class LocalStorageProvider implements IStorageProvider {
  readonly name = "local";
  private uploadDir: string;
  private baseUrl: string;

  constructor() {
    this.uploadDir = path.resolve(process.cwd(), "public", "uploads");
    const port = process.env.PORT || "4000";
    this.baseUrl = process.env.API_PUBLIC_URL || `http://localhost:${port}`;
    this.ensureDirectoryExists(this.uploadDir);
  }

  private ensureDirectoryExists(dirPath: string) {
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
  }

  isAvailable(): boolean {
    return true;
  }

  async upload(options: StorageUploadOptions): Promise<StorageUploadResult> {
    const folder: UploadFolder = options.folder || "products";
    const targetFolderDir = path.join(this.uploadDir, folder);
    this.ensureDirectoryExists(targetFolderDir);

    const ext = path.extname(options.originalFilename) || ".png";
    const safeBaseName = path
      .basename(options.originalFilename, ext)
      .replace(/[^a-zA-Z0-9_-]/g, "_")
      .toLowerCase();

    const uniqueId = randomUUID().slice(0, 8);
    const filename = `${Date.now()}_${uniqueId}_${safeBaseName}${ext}`;
    const filePath = path.join(targetFolderDir, filename);

    await fs.promises.writeFile(filePath, options.fileBuffer);

    const relativeKey = `${folder}/${filename}`;
    const url = `${this.baseUrl}/uploads/${relativeKey}`;

    return {
      id: uniqueId,
      key: relativeKey,
      url,
      filename: options.originalFilename,
      mimetype: options.mimetype,
      size: options.fileBuffer.length,
      folder,
      provider: "local",
      createdAt: new Date().toISOString(),
    };
  }

  async delete(key: string): Promise<boolean> {
    try {
      const filePath = path.join(this.uploadDir, key);
      if (fs.existsSync(filePath)) {
        await fs.promises.unlink(filePath);
        return true;
      }
      return false;
    } catch (err) {
      console.error("[LocalStorageProvider] Failed to delete file:", err);
      return false;
    }
  }
}
