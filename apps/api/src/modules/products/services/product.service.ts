import { productRepository } from "../repositories/product.repository.js";
import { categoryRepository } from "../../categories/repositories/category.repository.js";
import { brandRepository } from "../../brands/repositories/brand.repository.js";
import { slugify } from "../../../common/utils.js";
import type {
  CreateProductInput,
  UpdateProductInput,
  ProductQueryParams,
  AddProductImageInput,
} from "../schemas/product.schema.js";

export class ProductService {
  async getProducts(params: ProductQueryParams) {
    return productRepository.findAll(params);
  }

  async getProductById(id: string) {
    const product = await productRepository.findById(id);
    if (!product) {
      const error = new Error("Product not found");
      Object.assign(error, { statusCode: 404 });
      throw error;
    }
    return product;
  }

  async createProduct(input: CreateProductInput) {
    // 1. Verify category exists
    const category = await categoryRepository.findById(input.categoryId);
    if (!category) {
      const error = new Error("Invalid category ID");
      Object.assign(error, { statusCode: 400 });
      throw error;
    }

    // 2. Verify brand exists
    const brand = await brandRepository.findById(input.brandId);
    if (!brand) {
      const error = new Error("Invalid brand ID");
      Object.assign(error, { statusCode: 400 });
      throw error;
    }

    // 3. Verify SKU uniqueness
    const existingSku = await productRepository.findBySku(input.sku);
    if (existingSku) {
      const error = new Error("Product SKU already exists");
      Object.assign(error, { statusCode: 409 });
      throw error;
    }

    // 4. Generate unique slug
    let slug = slugify(input.name);
    const existingSlug = await productRepository.findBySlug(slug);
    if (existingSlug) {
      slug = `${slug}-${Date.now().toString(36)}`;
    }

    const inserted = await productRepository.create({
      ...input,
      slug,
    });

    return this.getProductById(inserted.id);
  }

  async updateProduct(id: string, input: UpdateProductInput) {
    await this.getProductById(id);

    if (input.categoryId) {
      const category = await categoryRepository.findById(input.categoryId);
      if (!category) {
        const error = new Error("Invalid category ID");
        Object.assign(error, { statusCode: 400 });
        throw error;
      }
    }

    if (input.brandId) {
      const brand = await brandRepository.findById(input.brandId);
      if (!brand) {
        const error = new Error("Invalid brand ID");
        Object.assign(error, { statusCode: 400 });
        throw error;
      }
    }

    if (input.sku) {
      const existingSku = await productRepository.findBySku(input.sku);
      if (existingSku && existingSku.id !== id) {
        const error = new Error("Product SKU already exists");
        Object.assign(error, { statusCode: 409 });
        throw error;
      }
    }

    let slug: string | undefined;
    if (input.name) {
      slug = slugify(input.name);
      const existingSlug = await productRepository.findBySlug(slug);
      if (existingSlug && existingSlug.id !== id) {
        slug = `${slug}-${Date.now().toString(36)}`;
      }
    }

    await productRepository.update(id, {
      ...input,
      ...(slug ? { slug } : {}),
    });

    return this.getProductById(id);
  }

  async deleteProduct(id: string) {
    await this.getProductById(id);
    await productRepository.softDelete(id);
    return { message: "Product deleted successfully" };
  }

  async addImage(productId: string, imageData: AddProductImageInput) {
    await this.getProductById(productId);
    return productRepository.addImage(productId, imageData);
  }

  async removeImage(productId: string, imageId: string) {
    await this.getProductById(productId);
    const removed = await productRepository.removeImage(imageId);
    if (!removed) {
      const error = new Error("Image not found");
      Object.assign(error, { statusCode: 404 });
      throw error;
    }
    return { message: "Product image removed successfully" };
  }
}

export const productService = new ProductService();
