import type { FastifyInstance } from "fastify";
import { inventoryController } from "../controllers/inventory.controller.js";
import {
  productInventoryParamsSchema,
  inventoryQuerySchema,
  adjustInventorySchema,
  lowStockQuerySchema,
  inventoryTxQuerySchema,
  type ProductInventoryParams,
  type InventoryQueryParams,
  type AdjustInventoryInput,
  type LowStockQueryParams,
  type InventoryTxQueryParams,
} from "../schemas/inventory.schema.js";
import { authenticate } from "../../../middleware/auth.middleware.js";
import { requireRole } from "../../../middleware/rbac.middleware.js";

export async function inventoryRoutes(app: FastifyInstance) {
  app.get<{
    Params: ProductInventoryParams;
    Querystring: InventoryQueryParams;
  }>(
    "/products/:productId",
    {
      schema: {
        params: productInventoryParamsSchema,
        querystring: inventoryQuerySchema,
      },
    },
    async (request, reply) =>
      inventoryController.getProductInventory(request, reply),
  );

  app.get("/warehouses", async (request, reply) =>
    inventoryController.getWarehouses(request, reply),
  );

  // Administrative inventory management routes
  app.post<{ Body: AdjustInventoryInput }>(
    "/adjust",
    {
      preHandler: [authenticate, requireRole("ADMIN", "SUPER_ADMIN", "STAFF")],
      schema: {
        body: adjustInventorySchema,
      },
    },
    async (request, reply) => inventoryController.adjustStock(request, reply),
  );

  app.get<{ Querystring: LowStockQueryParams }>(
    "/low-stock",
    {
      preHandler: [authenticate, requireRole("ADMIN", "SUPER_ADMIN", "STAFF")],
      schema: {
        querystring: lowStockQuerySchema,
      },
    },
    async (request, reply) => inventoryController.getLowStock(request, reply),
  );

  app.get<{ Querystring: InventoryTxQueryParams }>(
    "/transactions",
    {
      preHandler: [authenticate, requireRole("ADMIN", "SUPER_ADMIN", "STAFF")],
      schema: {
        querystring: inventoryTxQuerySchema,
      },
    },
    async (request, reply) =>
      inventoryController.getTransactions(request, reply),
  );
}
