import crypto from "node:crypto";
import { db, users } from "@samud/database";
import { eq } from "drizzle-orm";

function getDb() {
  if (!db) {
    throw new Error("Database client not initialized (DATABASE_URL missing)");
  }
  return db;
}

export class TokenService {
  /**
   * Generate a cryptographically secure random string for refresh token (30 days lifespan).
   */
  generateRefreshToken(): string {
    return crypto.randomBytes(64).toString("hex");
  }

  /**
   * Save or replace the user's refresh token in the database.
   */
  async saveRefreshToken(userId: string, token: string): Promise<void> {
    await getDb()
      .update(users)
      .set({ refreshToken: token, updatedAt: new Date() })
      .where(eq(users.id, userId));
  }

  /**
   * Invalidate and remove a user's stored refresh token upon logout or compromise.
   */
  async revokeRefreshToken(userId: string): Promise<void> {
    await getDb()
      .update(users)
      .set({ refreshToken: null, updatedAt: new Date() })
      .where(eq(users.id, userId));
  }
}

export const tokenService = new TokenService();
