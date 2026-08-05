import type { FastifyInstance } from "fastify";
import type { AuthenticatedUser } from "../../types/fastify.js";

export class JwtService {
  private app: FastifyInstance;

  constructor(app: FastifyInstance) {
    this.app = app;
  }

  /**
   * Generate a JWT Access Token with 15-minute expiration as specified in architecture.
   */
  generateAccessToken(user: AuthenticatedUser): string {
    return this.app.jwt.sign(user, { expiresIn: "15m" });
  }

  /**
   * Verify an existing JWT Access Token.
   */
  verifyToken(token: string): AuthenticatedUser {
    return this.app.jwt.verify<AuthenticatedUser>(token);
  }
}
