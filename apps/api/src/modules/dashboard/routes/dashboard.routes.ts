import type { FastifyInstance } from "fastify";
import { dashboardController } from "../controllers/dashboard.controller.js";
import { authenticate } from "../../../middleware/auth.middleware.js";
import { requireRole } from "../../../middleware/rbac.middleware.js";

export async function dashboardRoutes(app: FastifyInstance) {
  app.get(
    "/stats",
    {
      preHandler: [authenticate, requireRole("ADMIN", "SUPER_ADMIN", "STAFF")],
    },
    async (request, reply) => dashboardController.getStats(request, reply),
  );
}
