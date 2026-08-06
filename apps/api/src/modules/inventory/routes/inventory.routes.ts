import type { FastifyInstance } from "fastify";
import { inventoryController } from "../controllers/inventory.controller.js";
import {
  productInventoryParamsSchema,
  inventoryQuerySchema,
  type ProductInventoryParams,
  type InventoryQueryParams,
} from "../schemas/inventory.schema.js";

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
}
