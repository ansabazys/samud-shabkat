import { inventoryRepository } from "../repositories/inventory.repository.js";

export type StockStatus =
  "IN_STOCK" | "LOW_STOCK" | "OUT_OF_STOCK" | "PRE_ORDER" | "DISCONTINUED";

export interface ComputedInventory {
  productId: string;
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
  async getProductInventory(productId: string): Promise<ComputedInventory> {
    const inv = await inventoryRepository.findByProductId(productId);

    const availableStock = Math.max(0, inv.currentStock - inv.reservedStock);

    let stockStatus: StockStatus = "IN_STOCK";
    if (availableStock <= 0) {
      stockStatus = "OUT_OF_STOCK";
    } else if (availableStock <= inv.reorderLevel) {
      stockStatus = "LOW_STOCK";
    }

    return {
      productId: inv.productId,
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
  ) {
    const inv = await this.getProductInventory(productId);

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
        message: `Requested quantity (${requestedQuantity}) exceeds available stock (${inv.availableStock})`,
        availableStock: inv.availableStock,
      };
    }

    return {
      valid: true,
      availableStock: inv.availableStock,
    };
  }

  async adjustStock(
    input: {
      productId: string;
      adjustmentType: "ADD" | "SUBTRACT" | "SET";
      quantity: number;
      reference?: string;
      notes?: string;
    },
    userId?: string,
  ) {
    return inventoryRepository.adjustStock(
      input.productId,
      input.adjustmentType,
      input.quantity,
      input.reference,
      input.notes,
      userId,
    );
  }

  async getLowStock(params: { page: number; limit: number; search?: string }) {
    return inventoryRepository.findLowStock(params);
  }

  async getTransactions(params: {
    page: number;
    limit: number;
    productId?: string;
  }) {
    return inventoryRepository.findTransactions(params);
  }
}

export const inventoryService = new InventoryService();
