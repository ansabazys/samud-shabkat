import type { FastifyRequest, FastifyReply } from "fastify";
import { inventoryService } from "../services/inventory.service.js";
import type {
  ProductInventoryParams,
  InventoryQueryParams,
  AdjustInventoryInput,
  LowStockQueryParams,
  InventoryTxQueryParams,
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

  async adjustStock(
    request: FastifyRequest<{ Body: AdjustInventoryInput }>,
    reply: FastifyReply,
  ) {
    try {
      const userId = request.user?.id;
      const result = await inventoryService.adjustStock(request.body, userId);
      return reply.status(200).send({
        success: true,
        message: "Stock adjusted successfully",
        data: result,
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "An error occurred";
      return reply.status(400).send({ success: false, message });
    }
  }

  async getLowStock(
    request: FastifyRequest<{ Querystring: LowStockQueryParams }>,
    reply: FastifyReply,
  ) {
    const result = await inventoryService.getLowStock(request.query);
    return reply.send({ success: true, data: result });
  }

  async getTransactions(
    request: FastifyRequest<{ Querystring: InventoryTxQueryParams }>,
    reply: FastifyReply,
  ) {
    const result = await inventoryService.getTransactions(request.query);
    return reply.send({ success: true, data: result });
  }
}

export const inventoryController = new InventoryController();
