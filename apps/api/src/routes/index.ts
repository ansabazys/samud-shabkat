import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { sql } from "drizzle-orm";
import { getDb } from "../common/db.js";
import { authRoutes } from "../modules/auth/index.js";
import { usersRoutes } from "../modules/users/index.js";
import { categoryRoutes } from "../modules/categories/index.js";
import { brandRoutes } from "../modules/brands/index.js";
import { productRoutes } from "../modules/products/index.js";
import { orderRoutes } from "../modules/orders/index.js";
import { dashboardRoutes } from "../modules/dashboard/index.js";
import { settingsRoutes } from "../modules/settings/index.js";
import { cartRoutes } from "../modules/cart/index.js";
import { inventoryRoutes } from "../modules/inventory/index.js";
import { mediaRoutes } from "../modules/media/index.js";

export async function registerRoutes(app: FastifyInstance) {
  const checkHealth = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const database = getDb();
      const startTime = Date.now();
      await database.execute(sql`SELECT 1`);
      const latencyMs = Date.now() - startTime;

      return {
        status: "ok",
        database: {
          status: "connected",
          latencyMs,
        },
        timestamp: new Date().toISOString(),
      };
    } catch (error: unknown) {
      reply.status(503);
      const errorMessage =
        error instanceof Error ? error.message : "Database connection failed";
      return {
        status: "unhealthy",
        database: {
          status: "disconnected",
          error: errorMessage,
        },
        timestamp: new Date().toISOString(),
      };
    }
  };

  app.get("/health", checkHealth);

  await app.register(authRoutes, { prefix: "/api/v1/auth" });
  await app.register(usersRoutes, { prefix: "/api/v1/users" });
  await app.register(categoryRoutes, { prefix: "/api/v1/categories" });
  await app.register(brandRoutes, { prefix: "/api/v1/brands" });
  await app.register(productRoutes, { prefix: "/api/v1/products" });
  await app.register(orderRoutes, { prefix: "/api/v1/orders" });
  await app.register(dashboardRoutes, { prefix: "/api/v1/dashboard" });
  await app.register(settingsRoutes, { prefix: "/api/v1/settings" });
  await app.register(cartRoutes, { prefix: "/api/v1/cart" });
  await app.register(inventoryRoutes, { prefix: "/api/v1/inventory" });
  await app.register(mediaRoutes, { prefix: "/api/v1/media" });
}
