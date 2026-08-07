import { usersRepository } from "../repositories/users.repository.js";
import { passwordService } from "../../auth/services/password.service.js";
import type {
  CreateUserInput,
  UpdateUserInput,
  UserQueryParams,
} from "../schemas/users.schema.js";

export class UsersService {
  async getUsers(params: UserQueryParams) {
    return usersRepository.findAll(params);
  }

  async getUserById(id: string) {
    const user = await usersRepository.findById(id);
    if (!user) {
      throw new Error("User not found");
    }
    return user;
  }

  async createUser(data: CreateUserInput) {
    const existing = await usersRepository.findByEmail(data.email);
    if (existing) {
      throw new Error("User with this email already exists");
    }

    const hashedPassword = await passwordService.hash(data.password);
    const role = data.role ?? "STAFF";

    return usersRepository.createUser(data, hashedPassword, role);
  }

  async updateUser(id: string, data: UpdateUserInput) {
    const existing = await usersRepository.findById(id);
    if (!existing) {
      throw new Error("User not found");
    }

    if (data.email && data.email !== existing.email) {
      const emailConflict = await usersRepository.findByEmail(data.email);
      if (emailConflict) {
        throw new Error("Email address is already in use");
      }
    }

    let hashedPassword: string | undefined;
    if (data.password) {
      hashedPassword = await passwordService.hash(data.password);
    }

    return usersRepository.updateUser(id, data, hashedPassword);
  }

  async deactivateUser(id: string) {
    const existing = await usersRepository.findById(id);
    if (!existing) {
      throw new Error("User not found");
    }
    return usersRepository.setUserActiveState(id, false);
  }
}

export const usersService = new UsersService();
