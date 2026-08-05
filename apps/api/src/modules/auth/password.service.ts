import * as argon2 from "argon2";

export class PasswordService {
  /**
   * Securely hash a plaintext password using Argon2id algorithm.
   */
  async hash(password: string): Promise<string> {
    return argon2.hash(password, {
      type: argon2.argon2id,
      memoryCost: 65536,
      timeCost: 3,
      parallelism: 4,
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
