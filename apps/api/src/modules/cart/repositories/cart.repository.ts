import {
  carts,
  cartItems,
  products,
  warehouses,
  productImages,
} from "@samud/database";
import { eq, and, isNull, sql } from "drizzle-orm";
import { getDb } from "../../../common/db.js";

export class CartRepository {
  async findOrCreateActiveCart(userId: string) {
    const database = getDb();
    const [existing] = await database
      .select()
      .from(carts)
      .where(
        and(
          eq(carts.userId, userId),
          eq(carts.status, "ACTIVE"),
          isNull(carts.deletedAt),
        ),
      )
      .limit(1);

    if (existing) return existing;

    const [created] = await database
      .insert(carts)
      .values({
        userId,
        status: "ACTIVE",
      })
      .returning();

    return created;
  }

  async getCartWithItems(userId: string) {
    const database = getDb();
    const cart = await this.findOrCreateActiveCart(userId);

    const items = await database
      .select({
        cartItem: cartItems,
        warehouseName: warehouses.name,
        warehouseCode: warehouses.code,
        currentProductPrice: products.price,
        isProductActive: products.isActive,
      })
      .from(cartItems)
      .innerJoin(warehouses, eq(cartItems.warehouseId, warehouses.id))
      .innerJoin(products, eq(cartItems.productId, products.id))
      .where(eq(cartItems.cartId, cart.id));

    const productIds = items.map((i) => i.cartItem.productId);
    let imagesMap: Record<string, string> = {};

    if (productIds.length > 0) {
      const images = await database
        .select()
        .from(productImages)
        .where(sql`${productImages.productId} IN ${productIds}`);

      imagesMap = images.reduce(
        (acc, img) => {
          if (!acc[img.productId] || img.isPrimary) {
            acc[img.productId] = img.url;
          }
          return acc;
        },
        {} as Record<string, string>,
      );
    }

    const formattedItems = items.map((item) => ({
      ...item.cartItem,
      warehouse: {
        id: item.cartItem.warehouseId,
        name: item.warehouseName,
        code: item.warehouseCode,
      },
      imageUrl: imagesMap[item.cartItem.productId] || null,
      currentProductPrice: item.currentProductPrice,
      isProductActive: item.isProductActive,
    }));

    const totalItems = formattedItems.reduce(
      (sum, item) => sum + item.quantity,
      0,
    );
    const subtotal = formattedItems
      .reduce((sum, item) => sum + Number(item.subtotal), 0)
      .toFixed(2);

    return {
      cartId: cart.id,
      userId: cart.userId,
      status: cart.status,
      items: formattedItems,
      totalItems,
      subtotal,
      estimatedTotal: subtotal,
      updatedAt: cart.updatedAt,
    };
  }

  async addItem(
    cartId: string,
    product: {
      id: string;
      name: string;
      sku: string;
      price: string | number;
      specifications?: Record<string, unknown> | unknown;
    },
    warehouseId: string,
    quantity: number,
  ) {
    const database = getDb();
    const unitPrice = Number(product.price).toFixed(2);

    const [existing] = await database
      .select()
      .from(cartItems)
      .where(
        and(
          eq(cartItems.cartId, cartId),
          eq(cartItems.productId, product.id),
          eq(cartItems.warehouseId, warehouseId),
        ),
      )
      .limit(1);

    if (existing) {
      const newQuantity = existing.quantity + quantity;
      const newSubtotal = (Number(unitPrice) * newQuantity).toFixed(2);

      const [updated] = await database
        .update(cartItems)
        .set({
          quantity: newQuantity,
          subtotal: newSubtotal,
          updatedAt: sql`NOW()`,
        })
        .where(eq(cartItems.id, existing.id))
        .returning();

      return updated;
    }

    const subtotal = (Number(unitPrice) * quantity).toFixed(2);

    const [inserted] = await database
      .insert(cartItems)
      .values({
        cartId,
        productId: product.id,
        warehouseId,
        productNameSnapshot: product.name,
        skuSnapshot: product.sku,
        unitPriceSnapshot: unitPrice,
        quantity,
        discount: "0.00",
        subtotal,
        specificationsSnapshot: product.specifications ?? {},
      })
      .returning();

    return inserted;
  }

  async updateItemQuantity(
    cartItemId: string,
    cartId: string,
    quantity: number,
  ) {
    const database = getDb();

    if (quantity <= 0) {
      await database
        .delete(cartItems)
        .where(and(eq(cartItems.id, cartItemId), eq(cartItems.cartId, cartId)));
      return null;
    }

    const [existing] = await database
      .select()
      .from(cartItems)
      .where(and(eq(cartItems.id, cartItemId), eq(cartItems.cartId, cartId)))
      .limit(1);

    if (!existing) return null;

    const subtotal = (Number(existing.unitPriceSnapshot) * quantity).toFixed(2);

    const [updated] = await database
      .update(cartItems)
      .set({
        quantity,
        subtotal,
        updatedAt: sql`NOW()`,
      })
      .where(eq(cartItems.id, cartItemId))
      .returning();

    return updated;
  }

  async removeItem(cartItemId: string, cartId: string) {
    const [deleted] = await getDb()
      .delete(cartItems)
      .where(and(eq(cartItems.id, cartItemId), eq(cartItems.cartId, cartId)))
      .returning();

    return !!deleted;
  }

  async clearCart(cartId: string) {
    await getDb().delete(cartItems).where(eq(cartItems.cartId, cartId));
  }
}

export const cartRepository = new CartRepository();
