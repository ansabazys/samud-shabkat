import type { FastifyRequest, FastifyReply } from "fastify";
import { usersService } from "../services/users.service.js";
import type {
  CreateUserInput,
  UpdateUserInput,
  UserQueryParams,
} from "../schemas/users.schema.js";

export class UsersController {
  async getUsers(
    request: FastifyRequest<{ Querystring: UserQueryParams }>,
    reply: FastifyReply,
  ) {
    const result = await usersService.getUsers(request.query);
    return reply.send({ success: true, data: result });
  }

  async getUserById(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply,
  ) {
    try {
      const user = await usersService.getUserById(request.params.id);
      return reply.send({ success: true, data: user });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "An error occurred";
      return reply.status(404).send({ success: false, message });
    }
  }

  async createUser(
    request: FastifyRequest<{ Body: CreateUserInput }>,
    reply: FastifyReply,
  ) {
    try {
      const user = await usersService.createUser(request.body);
      return reply.status(201).send({
        success: true,
        message: "User account created successfully",
        data: user,
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "An error occurred";
      return reply.status(400).send({ success: false, message });
    }
  }

  async updateUser(
    request: FastifyRequest<{
      Params: { id: string };
      Body: UpdateUserInput;
    }>,
    reply: FastifyReply,
  ) {
    try {
      const updated = await usersService.updateUser(
        request.params.id,
        request.body,
      );
      return reply.send({
        success: true,
        message: "User account updated successfully",
        data: updated,
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "An error occurred";
      return reply.status(400).send({ success: false, message });
    }
  }

  async deactivateUser(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply,
  ) {
    try {
      await usersService.deactivateUser(request.params.id);
      return reply.send({
        success: true,
        message: "User account deactivated successfully",
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "An error occurred";
      return reply.status(400).send({ success: false, message });
    }
  }
}

export const usersController = new UsersController();
