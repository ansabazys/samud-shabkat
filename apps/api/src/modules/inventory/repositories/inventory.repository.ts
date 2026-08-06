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
}

export const inventoryRepository = new InventoryRepository();
