import type { FastifyRequest, FastifyReply } from "fastify";
import { inventoryService } from "../services/inventory.service.js";
import type {
  ProductInventoryParams,
  InventoryQueryParams,
} from "../schemas/inventory.schema.js";

export class InventoryController {
  async getProductInventory(
    request: FastifyRequest<{
      Params: ProductInventoryParams;
      Querystring: InventoryQueryParams;
    }>,
    reply: FastifyReply,
  ) {
    const { productId } = request.params;
    const { warehouseId } = request.query;

    const inventory = await inventoryService.getProductInventory(
      productId,
      warehouseId,
    );
    return reply.send({ success: true, data: inventory });
  }

  async getWarehouses(_request: FastifyRequest, reply: FastifyReply) {
    const warehousesList = await inventoryService.getAllWarehouses();
    return reply.send({ success: true, data: warehousesList });
  }
}

export const inventoryController = new InventoryController();
