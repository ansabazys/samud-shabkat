import { categoryRepository } from "../repositories/category.repository.js";
import { slugify } from "../../../common/utils.js";
import { cacheService } from "../../cache/cache.service.js";
import type {
  CreateCategoryInput,
  UpdateCategoryInput,
  CategoryQueryParams,
} from "../schemas/category.schema.js";

export class CategoryService {
  async getCategories(params: CategoryQueryParams) {
    const cacheKey = `categories:list:${JSON.stringify(params)}`;
    return cacheService.getOrSet(
      cacheKey,
      () => categoryRepository.findAll(params),
      600, // 10 mins TTL
    );
  }

  async getCategoryById(id: string) {
    const cacheKey = `categories:detail:${id}`;
    return cacheService.getOrSet(
      cacheKey,
      async () => {
        const category = await categoryRepository.findById(id);
        if (!category) {
          const error = new Error("Category not found");
          Object.assign(error, { statusCode: 404 });
          throw error;
        }
        return category;
      },
      600,
    );
  }

  async createCategory(input: CreateCategoryInput) {
    let slug = slugify(input.name);

    // Ensure slug uniqueness
    const existing = await categoryRepository.findBySlug(slug);
    if (existing) {
      slug = `${slug}-${Date.now().toString(36)}`;
    }

    const created = await categoryRepository.create({
      ...input,
      slug,
    });

    cacheService.invalidateCatalog();
    return created;
  }

  async updateCategory(id: string, input: UpdateCategoryInput) {
    await this.getCategoryById(id);

    let slug: string | undefined;
    if (input.name) {
      slug = slugify(input.name);
      const existing = await categoryRepository.findBySlug(slug);
      if (existing && existing.id !== id) {
        slug = `${slug}-${Date.now().toString(36)}`;
      }
    }

    const updated = await categoryRepository.update(id, {
      ...input,
      ...(slug ? { slug } : {}),
    });

    cacheService.invalidateCatalog();
    return updated;
  }

  async deleteCategory(id: string) {
    await this.getCategoryById(id);
    await categoryRepository.softDelete(id);
    cacheService.invalidateCatalog();
    return { message: "Category deleted successfully" };
  }
}

export const categoryService = new CategoryService();
