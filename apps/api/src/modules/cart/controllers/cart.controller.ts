import type { FastifyRequest, FastifyReply } from "fastify";
import { cartService } from "../services/cart.service.js";
import type {
  AddItemInput,
  UpdateItemInput,
  CartItemParams,
} from "../schemas/cart.schema.js";

export class CartController {
  async getCart(request: FastifyRequest, reply: FastifyReply) {
    const userId = request.user.id;
    const cart = await cartService.getCart(userId);
    return reply.send({ success: true, data: cart });
  }

  async addItem(
    request: FastifyRequest<{ Body: AddItemInput }>,
    reply: FastifyReply,
  ) {
    const userId = request.user.id;
    try {
      const cart = await cartService.addItem(userId, request.body);
      return reply.send({
        success: true,
        message: "Item added to cart successfully",
        data: cart,
      });
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to add item to cart";
      return reply.status(400).send({ success: false, message });
    }
  }

  async updateItem(
    request: FastifyRequest<{ Params: CartItemParams; Body: UpdateItemInput }>,
    reply: FastifyReply,
  ) {
    const userId = request.user.id;
    try {
      const cart = await cartService.updateItemQuantity(
        userId,
        request.params.id,
        request.body,
      );
      return reply.send({
        success: true,
        message: "Cart item updated successfully",
        data: cart,
      });
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to update cart item";
      return reply.status(400).send({ success: false, message });
    }
  }

  async removeItem(
    request: FastifyRequest<{ Params: CartItemParams }>,
    reply: FastifyReply,
  ) {
    const userId = request.user.id;
    const cart = await cartService.removeItem(userId, request.params.id);
    return reply.send({
      success: true,
      message: "Item removed from cart",
      data: cart,
    });
  }

  async clearCart(request: FastifyRequest, reply: FastifyReply) {
    const userId = request.user.id;
    const cart = await cartService.clearCart(userId);
    return reply.send({
      success: true,
      message: "Cart cleared",
      data: cart,
    });
  }

  async validateCart(request: FastifyRequest, reply: FastifyReply) {
    const userId = request.user.id;
    const result = await cartService.validateCartForCheckout(userId);
    return reply.send({
      success: result.valid,
      message: result.message || "Cart validation successful",
      data: result,
    });
  }
}

export const cartController = new CartController();
