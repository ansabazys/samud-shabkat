import type { FastifyInstance } from "fastify";
import { settingsController } from "../controllers/settings.controller.js";
import {
  updateSettingsSchema,
  type UpdateSettingsInput,
} from "../schemas/settings.schema.js";
import { authenticate } from "../../../middleware/auth.middleware.js";
import { requireRole } from "../../../middleware/rbac.middleware.js";

export async function settingsRoutes(app: FastifyInstance) {
  // Public route to fetch company settings
  app.get("/", async (request, reply) =>
    settingsController.getSettings(request, reply),
  );

  // Admin route to update settings
  app.put<{ Body: UpdateSettingsInput }>(
    "/",
    {
      preHandler: [authenticate, requireRole("ADMIN", "SUPER_ADMIN")],
      schema: {
        body: updateSettingsSchema,
      },
    },
    async (request, reply) => settingsController.updateSettings(request, reply),
  );
}
