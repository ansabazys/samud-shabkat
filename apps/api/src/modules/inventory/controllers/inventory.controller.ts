import type { FastifyRequest, FastifyReply } from "fastify";
import { inventoryService } from "../services/inventory.service.js";
import type {
  ProductInventoryParams,
  AdjustInventoryInput,
  LowStockQueryParams,
  InventoryTxQueryParams,
} from "../schemas/inventory.schema.js";

export class InventoryController {
  async getProductInventory(
    request: FastifyRequest<{
      Params: ProductInventoryParams;
    }>,
    reply: FastifyReply,
  ) {
    const { productId } = request.params;

    const inventory = await inventoryService.getProductInventory(productId);
    return reply.send({ success: true, data: inventory });
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
