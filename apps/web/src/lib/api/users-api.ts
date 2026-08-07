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
    const res = await api.get<{
      success: boolean;
      data: PaginatedUsersResponse;
    }>("/users", { params });
    return res.data.data;
  },

  async getUserById(id: string): Promise<UserRecord> {
    const res = await api.get<{ success: boolean; data: UserRecord }>(
      `/users/${id}`,
    );
    return res.data.data;
  },

  async createUser(input: CreateUserInput): Promise<UserRecord> {
    const res = await api.post<{ success: boolean; data: UserRecord }>(
      "/users",
      input,
    );
    return res.data.data;
  },

  async updateUser(id: string, input: UpdateUserInput): Promise<UserRecord> {
    const res = await api.patch<{ success: boolean; data: UserRecord }>(
      `/users/${id}`,
      input,
    );
    return res.data.data;
  },

  async deactivateUser(id: string): Promise<void> {
    await api.delete(`/users/${id}`);
  },
};
