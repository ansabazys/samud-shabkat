import type { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { AuthService } from "./auth.service.js";
import { registerSchema, loginSchema, refreshSchema } from "./auth.schema.js";

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

    reply.setCookie("refreshToken", result.refreshToken, {
      path: "/api/v1/auth",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 30 * 24 * 60 * 60, // 30 days
    });

    return reply.status(200).send(result);
  }

  async refresh(request: FastifyRequest, reply: FastifyReply) {
    const token =
      (request.body as { refreshToken?: string })?.refreshToken ??
      request.cookies.refreshToken;

    const validation = refreshSchema.safeParse({ refreshToken: token });
    if (!validation.success) {
      const error = new Error("Refresh token is required");
      Object.assign(error, { statusCode: 401 });
      throw error;
    }

    const result = await this.authService.refresh(validation.data.refreshToken);

    reply.setCookie("refreshToken", result.refreshToken, {
      path: "/api/v1/auth",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 30 * 24 * 60 * 60,
    });

    return reply.status(200).send(result);
  }

  async logout(request: FastifyRequest, reply: FastifyReply) {
    const userId = request.user.id;
    const result = await this.authService.logout(userId);

    reply.clearCookie("refreshToken", { path: "/api/v1/auth" });
    return reply.status(200).send(result);
  }
}
