import type { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { AuthService } from "../services/auth.service.js";
import {
  registerSchema,
  loginSchema,
  refreshSchema,
} from "../schemas/auth.schema.js";
import { AUTH_CONSTANTS } from "../constants/auth.constants.js";

export class AuthController {
  private authService: AuthService;

  constructor(app: FastifyInstance) {
    this.authService = new AuthService(app);
  }

  async register(request: FastifyRequest, reply: FastifyReply) {
    const validation = registerSchema.safeParse(request.body);
    if (!validation.success) {
      const error = new Error(
        validation.error.errors[0]?.message ?? "Invalid registration payload",
      );
      Object.assign(error, { statusCode: 400 });
      throw error;
    }

    const result = await this.authService.register(validation.data);

    reply.setCookie(AUTH_CONSTANTS.COOKIE_NAME, result.refreshToken, {
      path: AUTH_CONSTANTS.COOKIE_PATH,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: AUTH_CONSTANTS.COOKIE_MAX_AGE,
    });

    return reply.status(201).send(result);
  }

  async login(request: FastifyRequest, reply: FastifyReply) {
    const validation = loginSchema.safeParse(request.body);
    if (!validation.success) {
      const error = new Error(
        validation.error.errors[0]?.message ?? "Invalid login payload",
      );
      Object.assign(error, { statusCode: 400 });
      throw error;
    }

    const result = await this.authService.login(validation.data);

    reply.setCookie(AUTH_CONSTANTS.COOKIE_NAME, result.refreshToken, {
      path: AUTH_CONSTANTS.COOKIE_PATH,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: AUTH_CONSTANTS.COOKIE_MAX_AGE,
    });

    return reply.status(200).send(result);
  }

  async refresh(request: FastifyRequest, reply: FastifyReply) {
    try {
      const token =
        (request.body as { refreshToken?: string })?.refreshToken ??
        request.cookies[AUTH_CONSTANTS.COOKIE_NAME];

      const validation = refreshSchema.safeParse({ refreshToken: token });
      if (!validation.success || !validation.data.refreshToken) {
        return reply.status(401).send({
          statusCode: 401,
          message: "Refresh token is required",
        });
      }

      const result = await this.authService.refresh(
        validation.data.refreshToken,
      );

      reply.setCookie(AUTH_CONSTANTS.COOKIE_NAME, result.refreshToken, {
        path: AUTH_CONSTANTS.COOKIE_PATH,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: AUTH_CONSTANTS.COOKIE_MAX_AGE,
      });

      return reply.status(200).send(result);
    } catch (err: unknown) {
      const error = err as { statusCode?: unknown; message?: unknown };
      const status =
        typeof error.statusCode === "number" &&
        error.statusCode >= 400 &&
        error.statusCode < 500
          ? error.statusCode
          : 401;
      return reply.status(status).send({
        statusCode: status,
        message:
          typeof error.message === "string"
            ? error.message
            : "Invalid or expired refresh token",
      });
    }
  }

  async logout(request: FastifyRequest, reply: FastifyReply) {
    const userId = request.user.id;
    const result = await this.authService.logout(userId);

    reply.clearCookie(AUTH_CONSTANTS.COOKIE_NAME, {
      path: AUTH_CONSTANTS.COOKIE_PATH,
    });
    return reply.status(200).send(result);
  }
}
