import { brandRepository } from "../repositories/brand.repository.js";
import { slugify } from "../../../common/utils.js";
import { cacheService } from "../../cache/cache.service.js";
import type {
  CreateBrandInput,
  UpdateBrandInput,
  BrandQueryParams,
} from "../schemas/brand.schema.js";

export class BrandService {
  async getBrands(params: BrandQueryParams) {
    const cacheKey = `brands:list:${JSON.stringify(params)}`;
    return cacheService.getOrSet(
      cacheKey,
      () => brandRepository.findAll(params),
      600, // 10 mins TTL
    );
  }

  async getBrandById(id: string) {
    const cacheKey = `brands:detail:${id}`;
    return cacheService.getOrSet(
      cacheKey,
      async () => {
        const brand = await brandRepository.findById(id);
        if (!brand) {
          const error = new Error("Brand not found");
          Object.assign(error, { statusCode: 404 });
          throw error;
        }
        return brand;
      },
      600,
    );
  }

  async createBrand(input: CreateBrandInput) {
    let slug = slugify(input.name);

    const existing = await brandRepository.findBySlug(slug);
    if (existing) {
      slug = `${slug}-${Date.now().toString(36)}`;
    }

    const created = await brandRepository.create({
      ...input,
      slug,
    });

    cacheService.invalidateCatalog();
    return created;
  }

  async updateBrand(id: string, input: UpdateBrandInput) {
    await this.getBrandById(id);

    let slug: string | undefined;
    if (input.name) {
      slug = slugify(input.name);
      const existing = await brandRepository.findBySlug(slug);
      if (existing && existing.id !== id) {
        slug = `${slug}-${Date.now().toString(36)}`;
      }
    }

    const updated = await brandRepository.update(id, {
      ...input,
      ...(slug ? { slug } : {}),
    });

    cacheService.invalidateCatalog();
    return updated;
  }

  async deleteBrand(id: string) {
    await this.getBrandById(id);
    await brandRepository.softDelete(id);
    cacheService.invalidateCatalog();
    return { message: "Brand deleted successfully" };
  }
}

export const brandService = new BrandService();
