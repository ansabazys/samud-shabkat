import { brandRepository } from "../repositories/brand.repository.js";
import { slugify } from "../../../common/utils.js";
import type {
  CreateBrandInput,
  UpdateBrandInput,
  BrandQueryParams,
} from "../schemas/brand.schema.js";

export class BrandService {
  async getBrands(params: BrandQueryParams) {
    return brandRepository.findAll(params);
  }

  async getBrandById(id: string) {
    const brand = await brandRepository.findById(id);
    if (!brand) {
      const error = new Error("Brand not found");
      Object.assign(error, { statusCode: 404 });
      throw error;
    }
    return brand;
  }

  async createBrand(input: CreateBrandInput) {
    let slug = slugify(input.name);

    const existing = await brandRepository.findBySlug(slug);
    if (existing) {
      slug = `${slug}-${Date.now().toString(36)}`;
    }

    return brandRepository.create({
      ...input,
      slug,
    });
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

    return brandRepository.update(id, {
      ...input,
      ...(slug ? { slug } : {}),
    });
  }

  async deleteBrand(id: string) {
    await this.getBrandById(id);
    await brandRepository.softDelete(id);
    return { message: "Brand deleted successfully" };
  }
}

export const brandService = new BrandService();
