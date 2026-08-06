import * as argon2 from "argon2";
import { AUTH_CONSTANTS } from "../constants/auth.constants.js";

export class PasswordService {
  /**
   * Securely hash a plaintext password using Argon2id algorithm and constants configured in domain.
   */
  async hash(password: string): Promise<string> {
    return argon2.hash(password, {
      type: argon2.argon2id,
      memoryCost: AUTH_CONSTANTS.ARGON2_MEMORY_COST,
      timeCost: AUTH_CONSTANTS.ARGON2_TIME_COST,
      parallelism: AUTH_CONSTANTS.ARGON2_PARALLELISM,
    });
  }

  /**
   * Verify an incoming plaintext password against a stored Argon2 hash.
   */
  async verify(hash: string, plain: string): Promise<boolean> {
    try {
      return await argon2.verify(hash, plain);
    } catch {
      return false;
    }
  }
}

export const passwordService = new PasswordService();
