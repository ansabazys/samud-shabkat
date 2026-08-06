import { api } from "../api";

export interface InventoryDetails {
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
  stockStatus:
    "IN_STOCK" | "LOW_STOCK" | "OUT_OF_STOCK" | "PRE_ORDER" | "DISCONTINUED";
  isAvailable: boolean;
}

export const inventoryApi = {
  async getProductInventory(
    productId: string,
    warehouseId?: string,
  ): Promise<InventoryDetails> {
    const res = await api.get<{ success: boolean; data: InventoryDetails }>(
      `/inventory/products/${productId}`,
      {
        params: { warehouseId },
      },
    );
    return res.data.data;
  },
};
