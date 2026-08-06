import type { FastifyInstance } from "fastify";
import { brandController } from "../controllers/brand.controller.js";
import {
  createBrandSchema,
  updateBrandSchema,
  brandQuerySchema,
  brandParamsSchema,
  type CreateBrandInput,
  type UpdateBrandInput,
  type BrandQueryParams,
} from "../schemas/brand.schema.js";
import { authenticate } from "../../../middleware/auth.middleware.js";
import { requireRole } from "../../../middleware/rbac.middleware.js";

export async function brandRoutes(app: FastifyInstance) {
  app.get<{ Querystring: BrandQueryParams }>(
    "/",
    {
      schema: {
        querystring: brandQuerySchema,
      },
    },
    async (request, reply) => brandController.getBrands(request, reply),
  );

  app.get<{ Params: { id: string } }>(
    "/:id",
    {
      schema: {
        params: brandParamsSchema,
      },
    },
    async (request, reply) => brandController.getBrandById(request, reply),
  );

  app.post<{ Body: CreateBrandInput }>(
    "/",
    {
      preHandler: [authenticate, requireRole("ADMIN", "SUPER_ADMIN", "STAFF")],
      schema: {
        body: createBrandSchema,
      },
    },
    async (request, reply) => brandController.createBrand(request, reply),
  );

  app.put<{ Params: { id: string }; Body: UpdateBrandInput }>(
    "/:id",
    {
      preHandler: [authenticate, requireRole("ADMIN", "SUPER_ADMIN", "STAFF")],
      schema: {
        params: brandParamsSchema,
        body: updateBrandSchema,
      },
    },
    async (request, reply) => brandController.updateBrand(request, reply),
  );

  app.delete<{ Params: { id: string } }>(
    "/:id",
    {
      preHandler: [authenticate, requireRole("ADMIN", "SUPER_ADMIN")],
      schema: {
        params: brandParamsSchema,
      },
    },
    async (request, reply) => brandController.deleteBrand(request, reply),
  );
}
