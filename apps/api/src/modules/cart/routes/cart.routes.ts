import type { FastifyInstance } from "fastify";
import { cartController } from "../controllers/cart.controller.js";
import {
  addItemSchema,
  updateItemSchema,
  cartItemParamsSchema,
  type AddItemInput,
  type UpdateItemInput,
  type CartItemParams,
} from "../schemas/cart.schema.js";
import { authenticate } from "../../../middleware/auth.middleware.js";

export async function cartRoutes(app: FastifyInstance) {
  // All cart endpoints require user authentication
  app.addHook("preHandler", authenticate);

  app.get("/", async (request, reply) =>
    cartController.getCart(request, reply),
  );

  app.post<{ Body: AddItemInput }>(
    "/items",
    {
      schema: {
        body: addItemSchema,
      },
    },
    async (request, reply) => cartController.addItem(request, reply),
  );

  app.patch<{ Params: CartItemParams; Body: UpdateItemInput }>(
    "/items/:id",
    {
      schema: {
        params: cartItemParamsSchema,
        body: updateItemSchema,
      },
    },
    async (request, reply) => cartController.updateItem(request, reply),
  );

  app.delete<{ Params: CartItemParams }>(
    "/items/:id",
    {
      schema: {
        params: cartItemParamsSchema,
      },
    },
    async (request, reply) => cartController.removeItem(request, reply),
  );

  app.delete("/", async (request, reply) =>
    cartController.clearCart(request, reply),
  );

  app.post("/validate", async (request, reply) =>
    cartController.validateCart(request, reply),
  );
}
