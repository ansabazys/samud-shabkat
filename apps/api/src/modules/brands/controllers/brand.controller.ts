import type { FastifyRequest, FastifyReply } from "fastify";
import { brandService } from "../services/brand.service.js";
import type {
  CreateBrandInput,
  UpdateBrandInput,
  BrandQueryParams,
} from "../schemas/brand.schema.js";

export class BrandController {
  async getBrands(
    request: FastifyRequest<{ Querystring: BrandQueryParams }>,
    reply: FastifyReply,
  ) {
    const result = await brandService.getBrands(request.query);
    return reply.status(200).send(result);
  }

  async getBrandById(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply,
  ) {
    const brand = await brandService.getBrandById(request.params.id);
    return reply.status(200).send(brand);
  }

  async createBrand(
    request: FastifyRequest<{ Body: CreateBrandInput }>,
    reply: FastifyReply,
  ) {
    const brand = await brandService.createBrand(request.body);
    return reply.status(201).send(brand);
  }

  async updateBrand(
    request: FastifyRequest<{ Params: { id: string }; Body: UpdateBrandInput }>,
    reply: FastifyReply,
  ) {
    const updated = await brandService.updateBrand(
      request.params.id,
      request.body,
    );
    return reply.status(200).send(updated);
  }

  async deleteBrand(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply,
  ) {
    const result = await brandService.deleteBrand(request.params.id);
    return reply.status(200).send(result);
  }
}

export const brandController = new BrandController();
