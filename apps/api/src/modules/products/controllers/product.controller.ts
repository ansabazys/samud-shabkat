import type { FastifyRequest, FastifyReply } from "fastify";
import { productService } from "../services/product.service.js";
import type {
  CreateProductInput,
  UpdateProductInput,
  ProductQueryParams,
  AddProductImageInput,
} from "../schemas/product.schema.js";

export class ProductController {
  async getProducts(
    request: FastifyRequest<{ Querystring: ProductQueryParams }>,
    reply: FastifyReply,
  ) {
    const result = await productService.getProducts(request.query);
    return reply.status(200).send(result);
  }

  async getProductById(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply,
  ) {
    const product = await productService.getProductById(request.params.id);
    return reply.status(200).send(product);
  }

  async createProduct(
    request: FastifyRequest<{ Body: CreateProductInput }>,
    reply: FastifyReply,
  ) {
    const product = await productService.createProduct(request.body);
    return reply.status(201).send(product);
  }

  async updateProduct(
    request: FastifyRequest<{
      Params: { id: string };
      Body: UpdateProductInput;
    }>,
    reply: FastifyReply,
  ) {
    const updated = await productService.updateProduct(
      request.params.id,
      request.body,
    );
    return reply.status(200).send(updated);
  }

  async deleteProduct(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply,
  ) {
    const result = await productService.deleteProduct(request.params.id);
    return reply.status(200).send(result);
  }

  async addImage(
    request: FastifyRequest<{
      Params: { id: string };
      Body: AddProductImageInput;
    }>,
    reply: FastifyReply,
  ) {
    const image = await productService.addImage(
      request.params.id,
      request.body,
    );
    return reply.status(201).send(image);
  }

  async removeImage(
    request: FastifyRequest<{ Params: { id: string; imageId: string } }>,
    reply: FastifyReply,
  ) {
    const result = await productService.removeImage(
      request.params.id,
      request.params.imageId,
    );
    return reply.status(200).send(result);
  }
}

export const productController = new ProductController();
