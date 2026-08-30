import { api } from "../api";

export interface UserRecord {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  isActive: boolean;
  role: "SUPER_ADMIN" | "ADMIN" | "STAFF" | "DELIVERY_BOY" | "CUSTOMER";
  phoneNumber?: string | null;
  companyName?: string | null;
  createdAt: string;
  updatedAt?: string;
}

export interface PaginatedUsersResponse {
  data: UserRecord[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface UserQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  role?: string;
  isActive?: boolean;
}

export interface CreateUserInput {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role?: string;
  phoneNumber?: string;
  isActive?: boolean;
}

export interface UpdateUserInput {
  email?: string;
  password?: string;
  firstName?: string;
  lastName?: string;
  role?: string;
  phoneNumber?: string;
  isActive?: boolean;
}

export const usersApi = {
  async getUsers(params?: UserQueryParams): Promise<PaginatedUsersResponse> {
    const res = await api.get<any>("/users", { params });
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

  async getUserById(id: string): Promise<UserRecord> {
    const res = await api.get<any>(`/users/${id}`);
    return res.data?.data ?? res.data;
  },

  async createUser(input: CreateUserInput): Promise<UserRecord> {
    const res = await api.post<any>("/users", input);
    return res.data?.data ?? res.data;
  },

  async updateUser(id: string, input: UpdateUserInput): Promise<UserRecord> {
    const res = await api.patch<any>(`/users/${id}`, input);
    return res.data?.data ?? res.data;
  },

  async deactivateUser(id: string): Promise<void> {
    await api.delete(`/users/${id}`);
  },
};
