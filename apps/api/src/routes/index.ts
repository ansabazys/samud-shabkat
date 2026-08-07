import type { FastifyInstance } from "fastify";
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
  app.get("/health", async () => ({ status: "ok" }));

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
