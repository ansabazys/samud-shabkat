import { orderRepository } from "../repositories/order.repository.js";
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
    return orderRepository.create(userId, data);
  }

  async updateOrderStatus(id: string, data: UpdateOrderStatusInput) {
    const existing = await orderRepository.findById(id);
    if (!existing) {
      throw new Error("Order not found");
    }
    return orderRepository.updateOrderStatus(id, data);
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
