import type { FastifyInstance } from "fastify";
import { authRoutes } from "../modules/auth/auth.routes.js";

export async function registerRoutes(app: FastifyInstance) {
  app.get("/health", async () => ({ status: "ok" }));

  await app.register(authRoutes, { prefix: "/api/v1/auth" });
}
