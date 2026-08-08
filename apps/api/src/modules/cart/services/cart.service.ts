import { cartRepository } from "../repositories/cart.repository.js";
import { productService } from "../../products/services/product.service.js";
import { inventoryService } from "../../inventory/services/inventory.service.js";
import type { AddItemInput, UpdateItemInput } from "../schemas/cart.schema.js";

export class CartService {
  async getCart(userId: string) {
    const cart = await cartRepository.getCartWithItems(userId);

    // Populate live stock availability & validation flags for each item
    const itemsWithValidation = await Promise.all(
      cart.items.map(async (item) => {
        const inventory = await inventoryService.getProductInventory(
          item.productId,
        );

        const isStockValid = item.quantity <= inventory.availableStock;

        return {
          ...item,
          availableStock: inventory.availableStock,
          stockStatus: inventory.stockStatus,
          isStockValid,
          validationMessage: isStockValid
            ? null
            : `Quantity (${item.quantity}) exceeds available stock (${inventory.availableStock})`,
        };
      }),
    );

    const isCartValid = itemsWithValidation.every(
      (item) => item.isStockValid && item.isProductActive,
    );

    return {
      ...cart,
      items: itemsWithValidation,
      isCartValid,
    };
  }

  async addItem(userId: string, input: AddItemInput) {
    const product = await productService.getProductById(input.productId);
    if (!product || !product.isActive) {
      throw new Error("Product is unavailable or inactive");
    }

    // Check existing cart items to compute cumulative requested quantity
    const cart = await cartRepository.findOrCreateActiveCart(userId);
    const cartDetails = await cartRepository.getCartWithItems(userId);
    const existingItem = cartDetails.items.find(
      (item) => item.productId === input.productId,
    );

    const totalRequestedQuantity =
      (existingItem?.quantity ?? 0) + input.quantity;

    const stockValidation = await inventoryService.validateRequestedQuantity(
      input.productId,
      totalRequestedQuantity,
    );

    if (!stockValidation.valid) {
      throw new Error(stockValidation.message);
    }

    await cartRepository.addItem(
      cart.id,
      {
        id: product.id,
        name: product.name,
        sku: product.sku,
        price: product.price,
        specifications: product.specifications,
      },
      input.quantity,
    );

    return this.getCart(userId);
  }

  async updateItemQuantity(
    userId: string,
    itemId: string,
    input: UpdateItemInput,
  ) {
    const cart = await cartRepository.findOrCreateActiveCart(userId);
    const cartDetails = await cartRepository.getCartWithItems(userId);
    const targetItem = cartDetails.items.find((item) => item.id === itemId);

    if (!targetItem) {
      throw new Error("Cart item not found");
    }

    if (input.quantity > 0) {
      const stockValidation = await inventoryService.validateRequestedQuantity(
        targetItem.productId,
        input.quantity,
      );

      if (!stockValidation.valid) {
        throw new Error(stockValidation.message);
      }
    }

    await cartRepository.updateItemQuantity(itemId, cart.id, input.quantity);
    return this.getCart(userId);
  }

  async removeItem(userId: string, itemId: string) {
    const cart = await cartRepository.findOrCreateActiveCart(userId);
    await cartRepository.removeItem(itemId, cart.id);
    return this.getCart(userId);
  }

  async clearCart(userId: string) {
    const cart = await cartRepository.findOrCreateActiveCart(userId);
    await cartRepository.clearCart(cart.id);
    return this.getCart(userId);
  }

  async validateCartForCheckout(userId: string) {
    const cart = await this.getCart(userId);

    if (cart.items.length === 0) {
      return { valid: false, message: "Cart is empty", cart };
    }

    const invalidItems = cart.items.filter(
      (item) => !item.isStockValid || !item.isProductActive,
    );

    if (invalidItems.length > 0) {
      return {
        valid: false,
        message:
          "One or more items in your cart exceed available stock or are inactive.",
        invalidItems,
        cart,
      };
    }

    return { valid: true, cart };
  }
}

export const cartService = new CartService();
