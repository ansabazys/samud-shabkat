import type { FastifyInstance } from "fastify";
import { productController } from "../controllers/product.controller.js";
import {
  createProductSchema,
  updateProductSchema,
  productQuerySchema,
  productParamsSchema,
  addProductImageSchema,
  type CreateProductInput,
  type UpdateProductInput,
  type ProductQueryParams,
  type AddProductImageInput,
} from "../schemas/product.schema.js";
import { authenticate } from "../../../middleware/auth.middleware.js";
import { requireRole } from "../../../middleware/rbac.middleware.js";

export async function productRoutes(app: FastifyInstance) {
  app.get<{ Querystring: ProductQueryParams }>(
    "/",
    {
      schema: {
        querystring: productQuerySchema,
      },
    },
    async (request, reply) => productController.getProducts(request, reply),
  );

  app.get<{ Params: { id: string } }>(
    "/:id",
    {
      schema: {
        params: productParamsSchema,
      },
    },
    async (request, reply) => productController.getProductById(request, reply),
  );

  app.post<{ Body: CreateProductInput }>(
    "/",
    {
      preHandler: [authenticate, requireRole("ADMIN", "SUPER_ADMIN", "STAFF")],
      schema: {
        body: createProductSchema,
      },
    },
    async (request, reply) => productController.createProduct(request, reply),
  );

  app.put<{ Params: { id: string }; Body: UpdateProductInput }>(
    "/:id",
    {
      preHandler: [authenticate, requireRole("ADMIN", "SUPER_ADMIN", "STAFF")],
      schema: {
        params: productParamsSchema,
        body: updateProductSchema,
      },
    },
    async (request, reply) => productController.updateProduct(request, reply),
  );

  app.delete<{ Params: { id: string } }>(
    "/:id",
    {
      preHandler: [authenticate, requireRole("ADMIN", "SUPER_ADMIN")],
      schema: {
        params: productParamsSchema,
      },
    },
    async (request, reply) => productController.deleteProduct(request, reply),
  );

  app.post<{ Params: { id: string }; Body: AddProductImageInput }>(
    "/:id/images",
    {
      preHandler: [authenticate, requireRole("ADMIN", "SUPER_ADMIN", "STAFF")],
      schema: {
        params: productParamsSchema,
        body: addProductImageSchema,
      },
    },
    async (request, reply) => productController.addImage(request, reply),
  );

  app.delete<{ Params: { id: string; imageId: string } }>(
    "/:id/images/:imageId",
    {
      preHandler: [authenticate, requireRole("ADMIN", "SUPER_ADMIN")],
    },
    async (request, reply) => productController.removeImage(request, reply),
  );
}
