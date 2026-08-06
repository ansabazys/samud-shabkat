import { orderRepository } from "../repositories/order.repository.js";
import { inventoryService } from "../../inventory/services/inventory.service.js";
import { inventoryRepository } from "../../inventory/repositories/inventory.repository.js";
import { cartRepository } from "../../cart/repositories/cart.repository.js";
import { getDb } from "../../../common/db.js";
import type {
  CreateOrderInput,
  OrderQueryParams,
  UpdateOrderStatusInput,
  UpdatePaymentStatusInput,
} from "../schemas/order.schema.js";

export class OrderService {
  async getAllOrders(params: OrderQueryParams) {
    return orderRepository.findAll(params);
  }

  async getOrderById(id: string) {
    const order = await orderRepository.findById(id);
    if (!order) {
      throw new Error("Order not found");
    }
    return order;
  }

  async getUserOrders(userId: string, params: OrderQueryParams) {
    return orderRepository.findAll({ ...params, userId });
  }

  async createOrder(userId: string, data: CreateOrderInput) {
    const defaultWh = await inventoryRepository.getDefaultWarehouse();

    // 1. Stock Validation for every item before starting transaction
    for (const item of data.items) {
      if (item.productId) {
        const validation = await inventoryService.validateRequestedQuantity(
          item.productId,
          item.quantity,
          defaultWh.id,
        );

        if (!validation.valid) {
          throw new Error(validation.message);
        }
      }
    }

    // 2. Perform order creation, stock reservation, and cart clearance in database transaction
    const database = getDb();
    const createdOrder = await database.transaction(async (tx) => {
      const order = await orderRepository.createWithTransaction(
        tx,
        userId,
        data,
      );

      for (const item of data.items) {
        if (item.productId) {
          await inventoryRepository.reserveStock(
            tx,
            item.productId,
            defaultWh.id,
            order.id,
            item.quantity,
            userId,
          );
        }
      }

      // Clear user active cart
      const cart = await cartRepository.findOrCreateActiveCart(userId);
      await cartRepository.clearCart(cart.id);

      return order;
    });

    return createdOrder;
  }

  async updateOrderStatus(
    userId: string,
    id: string,
    data: UpdateOrderStatusInput,
  ) {
    const existing = await orderRepository.findById(id);
    if (!existing) {
      throw new Error("Order not found");
    }

    const defaultWh = await inventoryRepository.getDefaultWarehouse();
    const database = getDb();

    return database.transaction(async (tx) => {
      const updated = await orderRepository.updateOrderStatusWithTx(
        tx,
        id,
        data,
      );

      // Handle stock reservation lifecycle on status transitions
      if (data.orderStatus === "CONFIRMED" || data.orderStatus === "SHIPPED") {
        for (const item of existing.items) {
          if (item.productId) {
            await inventoryRepository.fulfillStock(
              tx,
              item.productId,
              defaultWh.id,
              existing.id,
              item.quantity,
              userId,
            );
          }
        }
      } else if (data.orderStatus === "CANCELLED") {
        for (const item of existing.items) {
          if (item.productId) {
            await inventoryRepository.releaseStock(
              tx,
              item.productId,
              defaultWh.id,
              existing.id,
              item.quantity,
              userId,
            );
          }
        }
      }

      return updated;
    });
  }

  async updatePaymentStatus(id: string, data: UpdatePaymentStatusInput) {
    const existing = await orderRepository.findById(id);
    if (!existing) {
      throw new Error("Order not found");
    }
    return orderRepository.updatePaymentStatus(id, data);
  }
}

export const orderService = new OrderService();
