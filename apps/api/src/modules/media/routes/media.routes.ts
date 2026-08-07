import type { FastifyInstance } from "fastify";
import { mediaController } from "../controllers/media.controller.js";
import { authenticate } from "../../../middleware/auth.middleware.js";

export async function mediaRoutes(app: FastifyInstance) {
  // Require authentication for uploads
  app.addHook("preHandler", authenticate);

  app.post("/upload", async (request, reply) =>
    mediaController.uploadSingle(request, reply),
  );
  app.post("/upload-multiple", async (request, reply) =>
    mediaController.uploadMultiple(request, reply),
  );
}
