import type { FastifyInstance } from "fastify";
export async function registerRoutes(app: FastifyInstance) {
  app.get("/health", async () => ({ status: "ok" }));
}
