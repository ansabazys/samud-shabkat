import type { FastifyInstance } from "fastify";
import type { AuthenticatedUser } from "../../../types/fastify.js";
import { AUTH_CONSTANTS } from "../constants/auth.constants.js";

export class JwtService {
  private app: FastifyInstance;

  constructor(app: FastifyInstance) {
    this.app = app;
  }

  /**
   * Generate a JWT Access Token utilizing configured domain lifetime.
   */
  generateAccessToken(user: AuthenticatedUser): string {
    return this.app.jwt.sign(user, {
      expiresIn: AUTH_CONSTANTS.ACCESS_TOKEN_EXPIRES_IN,
    });
  }

  /**
   * Verify an existing JWT Access Token.
   */
  verifyToken(token: string): AuthenticatedUser {
    return this.app.jwt.verify<AuthenticatedUser>(token);
  }
}
