import type { FastifyInstance } from "fastify";
import { categoryController } from "../controllers/category.controller.js";
import {
  createCategorySchema,
  updateCategorySchema,
  categoryQuerySchema,
  categoryParamsSchema,
  type CreateCategoryInput,
  type UpdateCategoryInput,
  type CategoryQueryParams,
} from "../schemas/category.schema.js";
import { authenticate } from "../../../middleware/auth.middleware.js";
import { requireRole } from "../../../middleware/rbac.middleware.js";

export async function categoryRoutes(app: FastifyInstance) {
  app.get<{ Querystring: CategoryQueryParams }>(
    "/",
    {
      schema: {
        querystring: categoryQuerySchema,
      },
    },
    async (request, reply) => categoryController.getCategories(request, reply),
  );

  app.get<{ Params: { id: string } }>(
    "/:id",
    {
      schema: {
        params: categoryParamsSchema,
      },
    },
    async (request, reply) =>
      categoryController.getCategoryById(request, reply),
  );

  app.post<{ Body: CreateCategoryInput }>(
    "/",
    {
      preHandler: [authenticate, requireRole("ADMIN", "SUPER_ADMIN", "STAFF")],
      schema: {
        body: createCategorySchema,
      },
    },
    async (request, reply) => categoryController.createCategory(request, reply),
  );

  app.put<{ Params: { id: string }; Body: UpdateCategoryInput }>(
    "/:id",
    {
      preHandler: [authenticate, requireRole("ADMIN", "SUPER_ADMIN", "STAFF")],
      schema: {
        params: categoryParamsSchema,
        body: updateCategorySchema,
      },
    },
    async (request, reply) => categoryController.updateCategory(request, reply),
  );

  app.delete<{ Params: { id: string } }>(
    "/:id",
    {
      preHandler: [authenticate, requireRole("ADMIN", "SUPER_ADMIN")],
      schema: {
        params: categoryParamsSchema,
      },
    },
    async (request, reply) => categoryController.deleteCategory(request, reply),
  );
}
