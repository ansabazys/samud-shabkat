import type { FastifyRequest, FastifyReply } from "fastify";
import { orderService } from "../services/order.service.js";
import type {
  CreateOrderInput,
  OrderQueryParams,
  UpdateOrderStatusInput,
  UpdatePaymentStatusInput,
} from "../schemas/order.schema.js";

export class OrderController {
  async getOrders(
    request: FastifyRequest<{ Querystring: OrderQueryParams }>,
    reply: FastifyReply,
  ) {
    const result = await orderService.getAllOrders(request.query);
    return reply.send({ success: true, data: result });
  }

  async getMyOrders(
    request: FastifyRequest<{ Querystring: OrderQueryParams }>,
    reply: FastifyReply,
  ) {
    const userId = request.user?.id;
    if (!userId) {
      return reply
        .status(401)
        .send({ success: false, message: "Unauthorized" });
    }
    const result = await orderService.getUserOrders(userId, request.query);
    return reply.send({ success: true, data: result });
  }

  async getOrderById(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply,
  ) {
    try {
      const order = await orderService.getOrderById(request.params.id);
      return reply.send({ success: true, data: order });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "An error occurred";
      return reply.status(404).send({ success: false, message });
    }
  }

  async createOrder(
    request: FastifyRequest<{ Body: CreateOrderInput }>,
    reply: FastifyReply,
  ) {
    const userId = request.user?.id;
    if (!userId) {
      return reply
        .status(401)
        .send({ success: false, message: "Unauthorized" });
    }
    const order = await orderService.createOrder(userId, request.body);
    return reply.status(201).send({
      success: true,
      message: "Order created successfully",
      data: order,
    });
  }

  async updateOrderStatus(
    request: FastifyRequest<{
      Params: { id: string };
      Body: UpdateOrderStatusInput;
    }>,
    reply: FastifyReply,
  ) {
    try {
      const updated = await orderService.updateOrderStatus(
        request.params.id,
        request.body,
      );
      return reply.send({
        success: true,
        message: "Order status updated",
        data: updated,
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "An error occurred";
      return reply.status(400).send({ success: false, message });
    }
  }

  async updatePaymentStatus(
    request: FastifyRequest<{
      Params: { id: string };
      Body: UpdatePaymentStatusInput;
    }>,
    reply: FastifyReply,
  ) {
    try {
      const updated = await orderService.updatePaymentStatus(
        request.params.id,
        request.body,
      );
      return reply.send({
        success: true,
        message: "Payment status updated",
        data: updated,
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "An error occurred";
      return reply.status(400).send({ success: false, message });
    }
  }
}

export const orderController = new OrderController();
