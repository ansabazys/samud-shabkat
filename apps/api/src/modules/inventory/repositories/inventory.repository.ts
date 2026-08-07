import {
  warehouses,
  productInventory,
  inventoryTransactions,
} from "@samud/database";
import { eq, and, sql, isNull } from "drizzle-orm";
import { getDb } from "../../../common/db.js";

export class InventoryRepository {
  async getDefaultWarehouse() {
    const database = getDb();
    const [warehouse] = await database
      .select()
      .from(warehouses)
      .where(and(eq(warehouses.isDefault, true), isNull(warehouses.deletedAt)))
      .limit(1);

    if (!warehouse) {
      // Fallback to first available warehouse or create default DXB-MAIN
      const [first] = await database
        .select()
        .from(warehouses)
        .where(isNull(warehouses.deletedAt))
        .limit(1);

      if (first) return first;

      const [created] = await database
        .insert(warehouses)
        .values({
          name: "Main Dubai Warehouse",
          code: "DXB-MAIN",
          address: "Dubai Silicon Oasis, Dubai, UAE",
          isDefault: true,
          isActive: true,
        })
        .returning();

      return created;
    }

    return warehouse;
  }

  async getAllWarehouses() {
    return getDb()
      .select()
      .from(warehouses)
      .where(and(eq(warehouses.isActive, true), isNull(warehouses.deletedAt)));
  }

  async findByProductIdAndWarehouseId(productId: string, warehouseId: string) {
    const database = getDb();
    const [record] = await database
      .select({
        inventory: productInventory,
        warehouseName: warehouses.name,
        warehouseCode: warehouses.code,
      })
      .from(productInventory)
      .innerJoin(warehouses, eq(productInventory.warehouseId, warehouses.id))
      .where(
        and(
          eq(productInventory.productId, productId),
          eq(productInventory.warehouseId, warehouseId),
        ),
      )
      .limit(1);

    if (!record) {
      // Initialize default inventory record (50 stock, 0 reserved) for active testing if not seeded
      const [created] = await database
        .insert(productInventory)
        .values({
          productId,
          warehouseId,
          currentStock: 50,
          reservedStock: 0,
          minStock: 5,
          reorderLevel: 10,
          safetyStock: 5,
        })
        .returning();

      const [wh] = await database
        .select()
        .from(warehouses)
        .where(eq(warehouses.id, warehouseId))
        .limit(1);

      return {
        ...created,
        warehouseName: wh?.name ?? "Main Dubai Warehouse",
        warehouseCode: wh?.code ?? "DXB-MAIN",
      };
    }

    return {
      ...record.inventory,
      warehouseName: record.warehouseName,
      warehouseCode: record.warehouseCode,
    };
  }

  async reserveStock(
    tx: unknown,
    productId: string,
    warehouseId: string,
    orderId: string,
    quantity: number,
    userId?: string,
  ) {
    const database = (tx as ReturnType<typeof getDb>) || getDb();
    const currentInv = await this.findByProductIdAndWarehouseId(
      productId,
      warehouseId,
    );

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
      warehouseId,
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
    warehouseId: string,
    orderId: string,
    quantity: number,
    userId?: string,
  ) {
    const database = (tx as ReturnType<typeof getDb>) || getDb();
    const currentInv = await this.findByProductIdAndWarehouseId(
      productId,
      warehouseId,
    );

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
      warehouseId,
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
    warehouseId: string,
    orderId: string,
    quantity: number,
    userId?: string,
  ) {
    const database = (tx as ReturnType<typeof getDb>) || getDb();
    const currentInv = await this.findByProductIdAndWarehouseId(
      productId,
      warehouseId,
    );

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
      warehouseId,
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
    warehouseId: string,
    adjustmentType: "ADD" | "SUBTRACT" | "SET",
    quantity: number,
    reference?: string,
    notes?: string,
    userId?: string,
  ) {
    const database = getDb();
    const currentInv = await this.findByProductIdAndWarehouseId(
      productId,
      warehouseId,
    );

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
        warehouseId,
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
      warehouseId,
      previousStock: currentInv.currentStock,
      currentStock: newCurrentStock,
      reservedStock: currentInv.reservedStock,
      availableStock: newCurrentStock - currentInv.reservedStock,
      transaction: txRow,
    };
  }

  async findLowStock(params: {
    page: number;
    limit: number;
    search?: string;
    warehouseId?: string;
  }) {
    const database = getDb();
    const { page, limit, warehouseId } = params;
    const offset = (page - 1) * limit;

    const conditions = [
      sql`${productInventory.currentStock} <= ${productInventory.reorderLevel}`,
    ];

    if (warehouseId) {
      conditions.push(eq(productInventory.warehouseId, warehouseId));
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
        warehouseName: warehouses.name,
        warehouseCode: warehouses.code,
      })
      .from(productInventory)
      .innerJoin(warehouses, eq(productInventory.warehouseId, warehouses.id))
      .where(whereClause)
      .limit(limit)
      .offset(offset);

    const data = rows.map((r) => ({
      ...r.inventory,
      warehouseName: r.warehouseName,
      warehouseCode: r.warehouseCode,
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
    warehouseId?: string;
  }) {
    const database = getDb();
    const { page, limit, productId, warehouseId } = params;
    const offset = (page - 1) * limit;

    const conditions = [];
    if (productId)
      conditions.push(eq(inventoryTransactions.productId, productId));
    if (warehouseId)
      conditions.push(eq(inventoryTransactions.warehouseId, warehouseId));

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
