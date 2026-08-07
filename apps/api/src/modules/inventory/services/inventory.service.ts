import { inventoryRepository } from "../repositories/inventory.repository.js";

export type StockStatus =
  "IN_STOCK" | "LOW_STOCK" | "OUT_OF_STOCK" | "PRE_ORDER" | "DISCONTINUED";

export interface ComputedInventory {
  productId: string;
  warehouseId: string;
  warehouseName: string;
  warehouseCode: string;
  currentStock: number;
  reservedStock: number;
  availableStock: number;
  incomingStock: number;
  minStock: number;
  maxStock: number;
  reorderLevel: number;
  safetyStock: number;
  stockStatus: StockStatus;
  isAvailable: boolean;
}

export class InventoryService {
  async getProductInventory(
    productId: string,
    warehouseId?: string,
  ): Promise<ComputedInventory> {
    const targetWarehouse = warehouseId
      ? { id: warehouseId }
      : await inventoryRepository.getDefaultWarehouse();

    const inv = await inventoryRepository.findByProductIdAndWarehouseId(
      productId,
      targetWarehouse.id,
    );

    const availableStock = Math.max(0, inv.currentStock - inv.reservedStock);

    let stockStatus: StockStatus = "IN_STOCK";
    if (availableStock <= 0) {
      stockStatus = "OUT_OF_STOCK";
    } else if (availableStock <= inv.reorderLevel) {
      stockStatus = "LOW_STOCK";
    }

    return {
      productId: inv.productId,
      warehouseId: inv.warehouseId,
      warehouseName: inv.warehouseName,
      warehouseCode: inv.warehouseCode,
      currentStock: inv.currentStock,
      reservedStock: inv.reservedStock,
      availableStock,
      incomingStock: inv.incomingStock,
      minStock: inv.minStock,
      maxStock: inv.maxStock,
      reorderLevel: inv.reorderLevel,
      safetyStock: inv.safetyStock,
      stockStatus,
      isAvailable: availableStock > 0,
    };
  }

  async validateRequestedQuantity(
    productId: string,
    requestedQuantity: number,
    warehouseId?: string,
  ) {
    const inv = await this.getProductInventory(productId, warehouseId);

    if (requestedQuantity <= 0) {
      return {
        valid: false,
        message: "Quantity must be greater than zero",
        availableStock: inv.availableStock,
      };
    }

    if (requestedQuantity > inv.availableStock) {
      return {
        valid: false,
        message: `Requested quantity (${requestedQuantity}) exceeds available stock (${inv.availableStock}) in ${inv.warehouseName}`,
        availableStock: inv.availableStock,
      };
    }

    return {
      valid: true,
      availableStock: inv.availableStock,
      warehouseId: inv.warehouseId,
    };
  }

  async getAllWarehouses() {
    return inventoryRepository.getAllWarehouses();
  }

  async adjustStock(
    input: {
      productId: string;
      warehouseId?: string;
      adjustmentType: "ADD" | "SUBTRACT" | "SET";
      quantity: number;
      reference?: string;
      notes?: string;
    },
    userId?: string,
  ) {
    const targetWh = input.warehouseId
      ? { id: input.warehouseId }
      : await inventoryRepository.getDefaultWarehouse();

    return inventoryRepository.adjustStock(
      input.productId,
      targetWh.id,
      input.adjustmentType,
      input.quantity,
      input.reference,
      input.notes,
      userId,
    );
  }

  async getLowStock(params: {
    page: number;
    limit: number;
    search?: string;
    warehouseId?: string;
  }) {
    return inventoryRepository.findLowStock(params);
  }

  async getTransactions(params: {
    page: number;
    limit: number;
    productId?: string;
    warehouseId?: string;
  }) {
    return inventoryRepository.findTransactions(params);
  }
}

export const inventoryService = new InventoryService();
