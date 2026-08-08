import {
  productInventory,
  inventoryTransactions,
  products,
} from "@samud/database";
import { eq, and, sql, ilike } from "drizzle-orm";
import { getDb } from "../../../common/db.js";

export class InventoryRepository {
  async findByProductId(productId: string) {
    const database = getDb();
    const [record] = await database
      .select()
      .from(productInventory)
      .where(eq(productInventory.productId, productId))
      .limit(1);

    if (!record) {
      // Auto-create default single-pool inventory record if not pre-seeded
      const [created] = await database
        .insert(productInventory)
        .values({
          productId,
          currentStock: 50,
          reservedStock: 0,
          minStock: 5,
          reorderLevel: 10,
          safetyStock: 5,
        })
        .returning();

      return {
        ...created,
        availableStock: created.currentStock - created.reservedStock,
      };
    }

    return {
      ...record,
      availableStock: record.currentStock - record.reservedStock,
    };
  }

  async reserveStock(
    tx: unknown,
    productId: string,
    orderId: string,
    quantity: number,
    userId?: string,
  ) {
    const database = (tx as ReturnType<typeof getDb>) || getDb();
    const currentInv = await this.findByProductId(productId);

    const newReserved = currentInv.reservedStock + quantity;

    await database
      .update(productInventory)
      .set({
        reservedStock: newReserved,
        updatedAt: sql`NOW()`,
      })
      .where(eq(productInventory.id, currentInv.id));

    // Audit transaction
    await database.insert(inventoryTransactions).values({
      productId,
      orderId,
      transactionType: "RESERVATION",
      quantityDelta: 0,
      reservedDelta: quantity,
      stockAfter: currentInv.currentStock,
      reservedAfter: newReserved,
      reference: `Order Reservation`,
      createdById: userId ?? null,
    });
  }

  async releaseStock(
    tx: unknown,
    productId: string,
    orderId: string,
    quantity: number,
    userId?: string,
  ) {
    const database = (tx as ReturnType<typeof getDb>) || getDb();
    const currentInv = await this.findByProductId(productId);

    const newReserved = Math.max(0, currentInv.reservedStock - quantity);

    await database
      .update(productInventory)
      .set({
        reservedStock: newReserved,
        updatedAt: sql`NOW()`,
      })
      .where(eq(productInventory.id, currentInv.id));

    // Audit transaction
    await database.insert(inventoryTransactions).values({
      productId,
      orderId,
      transactionType: "RELEASE",
      quantityDelta: 0,
      reservedDelta: -quantity,
      stockAfter: currentInv.currentStock,
      reservedAfter: newReserved,
      reference: `Order Cancellation Release`,
      createdById: userId ?? null,
    });
  }

  async fulfillStock(
    tx: unknown,
    productId: string,
    orderId: string,
    quantity: number,
    userId?: string,
  ) {
    const database = (tx as ReturnType<typeof getDb>) || getDb();
    const currentInv = await this.findByProductId(productId);

    const newCurrent = Math.max(0, currentInv.currentStock - quantity);
    const newReserved = Math.max(0, currentInv.reservedStock - quantity);

    await database
      .update(productInventory)
      .set({
        currentStock: newCurrent,
        reservedStock: newReserved,
        updatedAt: sql`NOW()`,
      })
      .where(eq(productInventory.id, currentInv.id));

    // Audit transaction
    await database.insert(inventoryTransactions).values({
      productId,
      orderId,
      transactionType: "SALE",
      quantityDelta: -quantity,
      reservedDelta: -quantity,
      stockAfter: newCurrent,
      reservedAfter: newReserved,
      reference: `Order Fulfillment`,
      createdById: userId ?? null,
    });
  }

  async adjustStock(
    productId: string,
    adjustmentType: "ADD" | "SUBTRACT" | "SET",
    quantity: number,
    reference?: string,
    notes?: string,
    userId?: string,
  ) {
    const database = getDb();
    const currentInv = await this.findByProductId(productId);

    let newCurrentStock = currentInv.currentStock;
    let quantityDelta = 0;

    if (adjustmentType === "ADD") {
      quantityDelta = quantity;
      newCurrentStock = currentInv.currentStock + quantity;
    } else if (adjustmentType === "SUBTRACT") {
      quantityDelta = -quantity;
      newCurrentStock = Math.max(0, currentInv.currentStock - quantity);
    } else if (adjustmentType === "SET") {
      quantityDelta = quantity - currentInv.currentStock;
      newCurrentStock = Math.max(0, quantity);
    }

    await database
      .update(productInventory)
      .set({
        currentStock: newCurrentStock,
        updatedAt: sql`NOW()`,
      })
      .where(eq(productInventory.id, currentInv.id));

    const [txRow] = await database
      .insert(inventoryTransactions)
      .values({
        productId,
        transactionType: "ADJUSTMENT",
        quantityDelta,
        reservedDelta: 0,
        stockAfter: newCurrentStock,
        reservedAfter: currentInv.reservedStock,
        reference: reference ?? `Stock Adjustment (${adjustmentType})`,
        notes: notes ?? null,
        createdById: userId ?? null,
      })
      .returning();

    return {
      inventoryId: currentInv.id,
      productId,
      previousStock: currentInv.currentStock,
      currentStock: newCurrentStock,
      reservedStock: currentInv.reservedStock,
      availableStock: newCurrentStock - currentInv.reservedStock,
      transaction: txRow,
    };
  }

  async findLowStock(params: { page: number; limit: number; search?: string }) {
    const database = getDb();
    const { page, limit, search } = params;
    const offset = (page - 1) * limit;

    const conditions = [
      sql`${productInventory.currentStock} <= ${productInventory.reorderLevel}`,
    ];

    if (search) {
      conditions.push(
        sql`${productInventory.productId} IN (SELECT id FROM ${products} WHERE ${ilike(products.name, `%${search}%`)} OR ${ilike(products.sku, `%${search}%`)})`,
      );
    }

    const whereClause = and(...conditions);

    const [countResult] = await database
      .select({ total: sql<number>`count(*)` })
      .from(productInventory)
      .where(whereClause);

    const total = Number(countResult?.total ?? 0);

    const rows = await database
      .select({
        inventory: productInventory,
        productName: products.name,
        productSku: products.sku,
      })
      .from(productInventory)
      .innerJoin(products, eq(productInventory.productId, products.id))
      .where(whereClause)
      .limit(limit)
      .offset(offset);

    const data = rows.map((r) => ({
      ...r.inventory,
      productName: r.productName,
      productSku: r.productSku,
      availableStock: r.inventory.currentStock - r.inventory.reservedStock,
    }));

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findTransactions(params: {
    page: number;
    limit: number;
    productId?: string;
  }) {
    const database = getDb();
    const { page, limit, productId } = params;
    const offset = (page - 1) * limit;

    const conditions = [];
    if (productId)
      conditions.push(eq(inventoryTransactions.productId, productId));

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const [countResult] = await database
      .select({ total: sql<number>`count(*)` })
      .from(inventoryTransactions)
      .where(whereClause);

    const total = Number(countResult?.total ?? 0);

    const data = await database
      .select()
      .from(inventoryTransactions)
      .where(whereClause)
      .orderBy(sql`${inventoryTransactions.createdAt} DESC`)
      .limit(limit)
      .offset(offset);

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }
}

export const inventoryRepository = new InventoryRepository();
