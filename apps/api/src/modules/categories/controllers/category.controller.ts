import type { FastifyRequest, FastifyReply } from "fastify";
import { categoryService } from "../services/category.service.js";
import type {
  CreateCategoryInput,
  UpdateCategoryInput,
  CategoryQueryParams,
} from "../schemas/category.schema.js";

export class CategoryController {
  async getCategories(
    request: FastifyRequest<{ Querystring: CategoryQueryParams }>,
    reply: FastifyReply,
  ) {
    const result = await categoryService.getCategories(request.query);
    return reply.status(200).send(result);
  }

  async getCategoryById(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply,
  ) {
    const category = await categoryService.getCategoryById(request.params.id);
    return reply.status(200).send(category);
  }

  async createCategory(
    request: FastifyRequest<{ Body: CreateCategoryInput }>,
    reply: FastifyReply,
  ) {
    const category = await categoryService.createCategory(request.body);
    return reply.status(201).send(category);
  }

  async updateCategory(
    request: FastifyRequest<{
      Params: { id: string };
      Body: UpdateCategoryInput;
    }>,
    reply: FastifyReply,
  ) {
    const updated = await categoryService.updateCategory(
      request.params.id,
      request.body,
    );
    return reply.status(200).send(updated);
  }

  async deleteCategory(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply,
  ) {
    const result = await categoryService.deleteCategory(request.params.id);
    return reply.status(200).send(result);
  }
}

export const categoryController = new CategoryController();
