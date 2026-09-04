import type { FastifyRequest, FastifyReply } from "fastify";
import { orderService } from "../services/order.service.js";
import type {
  CreateOrderInput,
  OrderQueryParams,
  UpdateOrderStatusInput,
  UpdatePaymentStatusInput,
  CollectCashInput,
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
    try {
      let userId = request.user?.id;
      if (!userId) {
        const notesStr = request.body.notes || "";
        const emailMatch = notesStr.match(/Email:\s*([^\s;,\n]+)/i);
        const nameMatch = notesStr.match(/Customer:\s*([^.\n]+)/i);

        const guestEmail =
          emailMatch?.[1] ||
          emailMatch?.[1] ||
          `customer-${Date.now()}@samudshabkat.com`;
        const guestName =
          nameMatch?.[1]?.trim() || nameMatch?.[1]?.trim() || "Store Customer";

        const guestUser = await orderService.findOrCreateGuestUser(
          guestEmail,
          guestName,
          request.body.contactPhone,
        );
        userId = guestUser.id;
      }

      const order = await orderService.createOrder(userId, request.body);
      return reply.status(201).send({
        success: true,
        message: "Order created successfully",
        data: order,
      });
    } catch (err: unknown) {
      request.log.error(err);
      const error = err as { statusCode?: unknown; message?: unknown };
      const status =
        typeof error.statusCode === "number" ? error.statusCode : 400;
      return reply.status(status).send({
        success: false,
        message:
          typeof error.message === "string"
            ? error.message
            : "Failed to create order",
      });
    }
  }

  async updateOrderStatus(
    request: FastifyRequest<{
      Params: { id: string };
      Body: UpdateOrderStatusInput;
    }>,
    reply: FastifyReply,
  ) {
    try {
      const userId = request.user?.id || "";
      const updated = await orderService.updateOrderStatus(
        userId,
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

  async collectCash(
    request: FastifyRequest<{
      Params: { id: string };
      Body: CollectCashInput;
    }>,
    reply: FastifyReply,
  ) {
    try {
      const updated = await orderService.collectCash(
        request.params.id,
        request.body?.paymentMethod,
        request.body?.notes,
      );
      return reply.send({
        success: true,
        message: "Cash payment recorded successfully",
        data: updated,
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "An error occurred";
      return reply.status(400).send({ success: false, message });
    }
  }
}

export const orderController = new OrderController();
