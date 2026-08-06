import type { FastifyInstance } from "fastify";
import { AuthController } from "./controllers/auth.controller.js";
import { authenticate } from "../../middleware/auth.middleware.js";

export async function authRoutes(app: FastifyInstance) {
  const controller = new AuthController(app);

  app.post("/register", async (request, reply) =>
    controller.register(request, reply),
  );
  app.post("/login", async (request, reply) =>
    controller.login(request, reply),
  );
  app.post("/refresh", async (request, reply) =>
    controller.refresh(request, reply),
  );

  app.post("/logout", { preHandler: [authenticate] }, async (request, reply) =>
    controller.logout(request, reply),
  );
}
