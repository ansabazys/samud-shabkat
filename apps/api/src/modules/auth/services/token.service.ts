import crypto from "node:crypto";
import { users } from "@samud/database";
import { eq } from "drizzle-orm";
import { getAuthDb } from "../utils/auth.utils.js";
import { AUTH_CONSTANTS } from "../constants/auth.constants.js";

export class TokenService {
  /**
   * Generate a cryptographically secure random hex string using domain byte constraints.
   */
  generateRefreshToken(): string {
    return crypto
      .randomBytes(AUTH_CONSTANTS.REFRESH_TOKEN_BYTES)
      .toString("hex");
  }

  /**
   * Save or replace the user's refresh token in the database.
   */
  async saveRefreshToken(userId: string, token: string): Promise<void> {
    await getAuthDb()
      .update(users)
      .set({ refreshToken: token, updatedAt: new Date() })
      .where(eq(users.id, userId));
  }

  /**
   * Invalidate and remove a user's stored refresh token upon logout or compromise.
   */
  async revokeRefreshToken(userId: string): Promise<void> {
    await getAuthDb()
      .update(users)
      .set({ refreshToken: null, updatedAt: new Date() })
      .where(eq(users.id, userId));
  }
}

export const tokenService = new TokenService();
