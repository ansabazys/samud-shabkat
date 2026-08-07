import type { FastifyInstance } from "fastify";
import { orderController } from "../controllers/order.controller.js";
import {
  createOrderSchema,
  updateOrderStatusSchema,
  updatePaymentStatusSchema,
  collectCashSchema,
  orderQuerySchema,
  orderParamsSchema,
  type CreateOrderInput,
  type OrderQueryParams,
  type UpdateOrderStatusInput,
  type UpdatePaymentStatusInput,
  type CollectCashInput,
} from "../schemas/order.schema.js";
import { authenticate } from "../../../middleware/auth.middleware.js";
import { requireRole } from "../../../middleware/rbac.middleware.js";

export async function orderRoutes(app: FastifyInstance) {
  // Public / Customer routes (authenticated)
  app.post<{ Body: CreateOrderInput }>(
    "/",
    {
      preHandler: [authenticate],
      schema: {
        body: createOrderSchema,
      },
    },
    async (request, reply) => orderController.createOrder(request, reply),
  );

  app.get<{ Querystring: OrderQueryParams }>(
    "/my-orders",
    {
      preHandler: [authenticate],
      schema: {
        querystring: orderQuerySchema,
      },
    },
    async (request, reply) => orderController.getMyOrders(request, reply),
  );

  app.get<{ Params: { id: string } }>(
    "/:id",
    {
      preHandler: [authenticate],
      schema: {
        params: orderParamsSchema,
      },
    },
    async (request, reply) => orderController.getOrderById(request, reply),
  );

  // Admin routes
  app.get<{ Querystring: OrderQueryParams }>(
    "/",
    {
      preHandler: [authenticate, requireRole("ADMIN", "SUPER_ADMIN", "STAFF")],
      schema: {
        querystring: orderQuerySchema,
      },
    },
    async (request, reply) => orderController.getOrders(request, reply),
  );

  app.patch<{ Params: { id: string }; Body: UpdateOrderStatusInput }>(
    "/:id/status",
    {
      preHandler: [authenticate, requireRole("ADMIN", "SUPER_ADMIN", "STAFF")],
      schema: {
        params: orderParamsSchema,
        body: updateOrderStatusSchema,
      },
    },
    async (request, reply) => orderController.updateOrderStatus(request, reply),
  );

  app.patch<{ Params: { id: string }; Body: UpdatePaymentStatusInput }>(
    "/:id/payment-status",
    {
      preHandler: [authenticate, requireRole("ADMIN", "SUPER_ADMIN", "STAFF")],
      schema: {
        params: orderParamsSchema,
        body: updatePaymentStatusSchema,
      },
    },
    async (request, reply) =>
      orderController.updatePaymentStatus(request, reply),
  );

  app.post<{ Params: { id: string }; Body: CollectCashInput }>(
    "/:id/collect-cash",
    {
      preHandler: [authenticate, requireRole("ADMIN", "SUPER_ADMIN", "STAFF")],
      schema: {
        params: orderParamsSchema,
        body: collectCashSchema,
      },
    },
    async (request, reply) => orderController.collectCash(request, reply),
  );
}
