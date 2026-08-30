import { users, roles, userRoles } from "@samud/database";
import { eq } from "drizzle-orm";
import { orderRepository } from "../repositories/order.repository.js";
import { inventoryService } from "../../inventory/services/inventory.service.js";
import { inventoryRepository } from "../../inventory/repositories/inventory.repository.js";
import { cartRepository } from "../../cart/repositories/cart.repository.js";
import { notificationService } from "../../notifications/index.js";
import { getDb } from "../../../common/db.js";
import type {
  CreateOrderInput,
  OrderQueryParams,
  UpdateOrderStatusInput,
  UpdatePaymentStatusInput,
} from "../schemas/order.schema.js";

export class OrderService {
  async findOrCreateGuestUser(email: string, fullName: string, phone?: string) {
    const database = getDb();
    const cleanEmail = email.trim().toLowerCase();
    const [existing] = await database
      .select()
      .from(users)
      .where(eq(users.email, cleanEmail))
      .limit(1);

    if (existing) {
      return existing;
    }

    const parts = fullName.trim().split(" ");
    const firstName = parts[0] || "Guest";
    const lastName = parts.slice(1).join(" ") || "Customer";

    const [newUser] = await database
      .insert(users)
      .values({
        email: cleanEmail,
        passwordHash: "$argon2id$v=19$m=65536,t=3,p=4$GUEST$ACCOUNT",
        firstName,
        lastName,
        isActive: true,
      })
      .returning();

    // Assign customer role
    const [customerRole] = await database
      .select()
      .from(roles)
      .where(eq(roles.name, "CUSTOMER"))
      .limit(1);

    if (customerRole && newUser) {
      await database.insert(userRoles).values({
        userId: newUser.id,
        roleId: customerRole.id,
      });
    }

    return newUser;
  }

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
    // 1. Stock Validation for every item before starting transaction
    for (const item of data.items) {
      if (item.productId) {
        const validation = await inventoryService.validateRequestedQuantity(
          item.productId,
          item.quantity,
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

    // Send order confirmation email asynchronously
    orderRepository.findById(createdOrder.id).then((fullOrder) => {
      if (fullOrder && fullOrder.user) {
        notificationService
          .notifyOrderPlaced(fullOrder, fullOrder.user)
          .catch((err) =>
            console.error("[OrderService] Order email error:", err),
          );
      }
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

    const database = getDb();

    const updated = await database.transaction(async (tx) => {
      const res = await orderRepository.updateOrderStatusWithTx(tx, id, data);

      // Handle stock reservation lifecycle on status transitions
      const fulfillStatuses = [
        "CONFIRMED",
        "SHIPPED",
        "OUT_FOR_DELIVERY",
        "READY_FOR_PICKUP",
        "DELIVERED",
        "COMPLETED",
      ];

      if (fulfillStatuses.includes(data.orderStatus)) {
        for (const item of existing.items) {
          if (item.productId) {
            await inventoryRepository.fulfillStock(
              tx,
              item.productId,
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
              existing.id,
              item.quantity,
              userId,
            );
          }
        }
      }

      return res;
    });

    // Send status change email notification
    if (existing && existing.user) {
      notificationService
        .notifyOrderStatusChanged(existing, existing.user, data.orderStatus)
        .catch((err) =>
          console.error("[OrderService] Status email error:", err),
        );
    }

    return updated;
  }

  async updatePaymentStatus(id: string, data: UpdatePaymentStatusInput) {
    const existing = await orderRepository.findById(id);
    if (!existing) {
      throw new Error("Order not found");
    }
    const updated = await orderRepository.updatePaymentStatus(id, data);
    if (data.paymentStatus === "PAID" && existing && existing.user) {
      notificationService
        .notifyCashCollected(existing, existing.user)
        .catch((err) => console.error("[OrderService] Cash email error:", err));
    }
    return updated;
  }

  async collectCash(id: string, paymentMethod?: string, notes?: string) {
    const existing = await orderRepository.findById(id);
    if (!existing) {
      throw new Error("Order not found");
    }
    const updated = await orderRepository.collectCash(id, paymentMethod, notes);
    if (existing && existing.user) {
      notificationService
        .notifyCashCollected(existing, existing.user)
        .catch((err) => console.error("[OrderService] Cash email error:", err));
    }
    return updated;
  }
}

export const orderService = new OrderService();
