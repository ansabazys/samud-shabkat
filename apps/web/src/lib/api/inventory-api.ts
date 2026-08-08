import { api } from "../api";

export interface InventoryDetails {
  productId: string;
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

export interface AdjustInventoryPayload {
  productId: string;
  adjustmentType: "ADD" | "SUBTRACT" | "SET";
  quantity: number;
  reference?: string;
  notes?: string;
}

export interface InventoryTransactionRecord {
  id: string;
  productId: string;
  orderId?: string | null;
  transactionType: string;
  quantityDelta: number;
  reservedDelta: number;
  stockAfter: number;
  reservedAfter: number;
  reference?: string | null;
  notes?: string | null;
  createdAt: string;
}

export interface PaginatedLowStockResponse {
  data: Array<{
    id: string;
    productId: string;
    productName: string;
    productSku: string;
    currentStock: number;
    reservedStock: number;
    availableStock: number;
    reorderLevel: number;
  }>;
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export const inventoryApi = {
  async getProductInventory(productId: string): Promise<InventoryDetails> {
    const res = await api.get<{ success: boolean; data: InventoryDetails }>(
      `/inventory/products/${productId}`,
    );
    return res.data.data;
  },

  async adjustStock(input: AdjustInventoryPayload) {
    const res = await api.post<{ success: boolean; data: unknown }>(
      "/inventory/adjust",
      input,
    );
    return res.data.data;
  },

  async getLowStock(params?: {
    page?: number;
    limit?: number;
    search?: string;
  }): Promise<PaginatedLowStockResponse> {
    const res = await api.get<{
      success: boolean;
      data: PaginatedLowStockResponse;
    }>("/inventory/low-stock", { params });
    return res.data.data;
  },

  async getTransactions(params?: {
    page?: number;
    limit?: number;
    productId?: string;
  }): Promise<{ data: InventoryTransactionRecord[]; total: number }> {
    const res = await api.get<{
      success: boolean;
      data: { data: InventoryTransactionRecord[]; total: number };
    }>("/inventory/transactions", { params });
    return res.data.data;
  },
};
