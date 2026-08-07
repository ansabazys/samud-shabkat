import type { FastifyInstance } from "fastify";
import { usersController } from "../controllers/users.controller.js";
import {
  createUserSchema,
  updateUserSchema,
  userQuerySchema,
  userParamsSchema,
  type CreateUserInput,
  type UpdateUserInput,
  type UserQueryParams,
} from "../schemas/users.schema.js";
import { authenticate } from "../../../middleware/auth.middleware.js";
import { requireRole } from "../../../middleware/rbac.middleware.js";

export async function usersRoutes(app: FastifyInstance) {
  // All user management routes require admin role
  app.addHook("preHandler", authenticate);
  app.addHook("preHandler", requireRole("ADMIN", "SUPER_ADMIN"));

  app.get<{ Querystring: UserQueryParams }>(
    "/",
    {
      schema: {
        querystring: userQuerySchema,
      },
    },
    async (request, reply) => usersController.getUsers(request, reply),
  );

  app.get<{ Params: { id: string } }>(
    "/:id",
    {
      schema: {
        params: userParamsSchema,
      },
    },
    async (request, reply) => usersController.getUserById(request, reply),
  );

  app.post<{ Body: CreateUserInput }>(
    "/",
    {
      schema: {
        body: createUserSchema,
      },
    },
    async (request, reply) => usersController.createUser(request, reply),
  );

  app.patch<{ Params: { id: string }; Body: UpdateUserInput }>(
    "/:id",
    {
      schema: {
        params: userParamsSchema,
        body: updateUserSchema,
      },
    },
    async (request, reply) => usersController.updateUser(request, reply),
  );

  app.delete<{ Params: { id: string } }>(
    "/:id",
    {
      schema: {
        params: userParamsSchema,
      },
    },
    async (request, reply) => usersController.deactivateUser(request, reply),
  );
}
