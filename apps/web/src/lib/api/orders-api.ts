import { api } from "../api";

export interface OrderItem {
  id: string;
  orderId: string;
  productId?: string;
  productName: string;
  sku: string;
  unitPrice: string;
  quantity: number;
  totalPrice: string;
}

export interface UserSummary {
  id: string;
  email: string;
  fullName: string;
}

export interface OrderRecord {
  id: string;
  orderNumber: string;
  userId: string;
  orderStatus:
    | "PENDING"
    | "CONFIRMED"
    | "PROCESSING"
    | "READY_FOR_COLLECTION"
    | "READY_FOR_PICKUP"
    | "OUT_FOR_DELIVERY"
    | "DELIVERED"
    | "COMPLETED"
    | "CANCELLED";
  paymentStatus: "PENDING" | "PAID" | "FAILED" | "REFUNDED";
  fulfillmentType: "STORE_PICKUP" | "HOME_DELIVERY";
  paymentMethod: "CASH_ON_DELIVERY" | "CASH_ON_PICKUP" | "CASH";
  totalAmount: string;
  companyName?: string | null;
  contactPhone: string;
  billingAddress: string;
  shippingAddress: string;
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
  user?: UserSummary;
  items: OrderItem[];
}

export interface PaginatedOrdersResponse {
  data: OrderRecord[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface OrderQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  orderStatus?: string;
  paymentStatus?: string;
  fulfillmentType?: string;
}

export interface CreateOrderPayload {
  companyName?: string;
  contactPhone: string;
  billingAddress?: string;
  shippingAddress?: string;
  fulfillmentType?: "STORE_PICKUP" | "HOME_DELIVERY";
  paymentMethod?: "CASH_ON_DELIVERY" | "CASH_ON_PICKUP" | "CASH";
  notes?: string;
  items: Array<{
    productId?: string;
    productName: string;
    sku: string;
    unitPrice: number;
    quantity: number;
    specifications?: Record<string, unknown>;
  }>;
}

export const ordersApi = {
  async getOrders(params?: OrderQueryParams): Promise<PaginatedOrdersResponse> {
    const res = await api.get<any>("/orders", { params });
    const payload = res.data?.data ?? res.data;
    if (Array.isArray(payload)) {
      return {
        data: payload,
        total: payload.length,
        page: params?.page || 1,
        limit: params?.limit || 20,
        totalPages: 1,
      };
    }
    return {
      data: Array.isArray(payload?.data) ? payload.data : [],
      total: payload?.total ?? (Array.isArray(payload?.data) ? payload.data.length : 0),
      page: payload?.page ?? 1,
      limit: payload?.limit ?? 20,
      totalPages: payload?.totalPages ?? 1,
    };
  },

  async getMyOrders(params?: OrderQueryParams): Promise<PaginatedOrdersResponse> {
    const res = await api.get<any>("/orders/my-orders", { params });
    const payload = res.data?.data ?? res.data;
    if (Array.isArray(payload)) {
      return {
        data: payload,
        total: payload.length,
        page: params?.page || 1,
        limit: params?.limit || 20,
        totalPages: 1,
      };
    }
    return {
      data: Array.isArray(payload?.data) ? payload.data : [],
      total: payload?.total ?? (Array.isArray(payload?.data) ? payload.data.length : 0),
      page: payload?.page ?? 1,
      limit: payload?.limit ?? 20,
      totalPages: payload?.totalPages ?? 1,
    };
  },

  async getOrderById(id: string): Promise<OrderRecord> {
    const res = await api.get<any>(`/orders/${id}`);
    return res.data?.data ?? res.data;
  },

  async createOrder(payload: CreateOrderPayload): Promise<OrderRecord> {
    const res = await api.post<any>("/orders", payload);
    return res.data?.data ?? res.data;
  },

  async updateOrderStatus(
    id: string,
    orderStatus: string,
  ): Promise<OrderRecord> {
    const res = await api.patch<any>(`/orders/${id}/status`, { orderStatus });
    return res.data?.data ?? res.data;
  },

  async updatePaymentStatus(
    id: string,
    paymentStatus: string,
  ): Promise<OrderRecord> {
    const res = await api.patch<any>(`/orders/${id}/payment-status`, { paymentStatus });
    return res.data?.data ?? res.data;
  },

  async collectCash(
    id: string,
    paymentMethod = "CASH",
    notes?: string,
  ): Promise<OrderRecord> {
    const res = await api.post<any>(`/orders/${id}/collect-cash`, { paymentMethod, notes });
    return res.data?.data ?? res.data;
  },
};
