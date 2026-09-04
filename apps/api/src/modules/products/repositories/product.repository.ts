import {
  products,
  categories,
  brands,
  productImages,
  productInventory,
} from "@samud/database";
import {
  eq,
  and,
  isNull,
  ilike,
  gte,
  lte,
  count,
  sql,
  desc,
  asc,
} from "drizzle-orm";
import { getDb } from "../../../common/db.js";
import type {
  CreateProductInput,
  UpdateProductInput,
  ProductQueryParams,
  AddProductImageInput,
} from "../schemas/product.schema.js";

export class ProductRepository {
  async findAll(params: ProductQueryParams) {
    const database = getDb();
    const {
      page,
      limit,
      search,
      categoryId,
      brandId,
      minPrice,
      maxPrice,
      isActive,
      sortBy,
      sortOrder,
    } = params;
    const offset = (page - 1) * limit;

    const conditions = [isNull(products.deletedAt)];

    if (search) {
      conditions.push(
        sql`(${ilike(products.name, `%${search}%`)} OR ${ilike(products.sku, `%${search}%`)} OR ${ilike(products.description, `%${search}%`)})`,
      );
    }

    if (categoryId) {
      conditions.push(eq(products.categoryId, categoryId));
    }

    if (brandId) {
      conditions.push(eq(products.brandId, brandId));
    }

    if (minPrice !== undefined) {
      conditions.push(gte(products.price, minPrice.toString()));
    }

    if (maxPrice !== undefined) {
      conditions.push(lte(products.price, maxPrice.toString()));
    }

    if (isActive !== undefined) {
      conditions.push(eq(products.isActive, isActive === "true"));
    }

    const whereClause = and(...conditions);

    const [countResult] = await database
      .select({ total: count() })
      .from(products)
      .where(whereClause);

    const total = Number(countResult?.total ?? 0);

    const orderColumn =
      sortBy === "name"
        ? products.name
        : sortBy === "price"
          ? products.price
          : products.createdAt;

    const orderDirection =
      sortOrder === "asc" ? asc(orderColumn) : desc(orderColumn);

    const rawProducts = await database
      .select({
        product: products,
        categoryName: categories.name,
        categorySlug: categories.slug,
        brandName: brands.name,
        brandSlug: brands.slug,
        currentStock: productInventory.currentStock,
        reservedStock: productInventory.reservedStock,
        minStock: productInventory.minStock,
      })
      .from(products)
      .innerJoin(categories, eq(products.categoryId, categories.id))
      .innerJoin(brands, eq(products.brandId, brands.id))
      .leftJoin(productInventory, eq(products.id, productInventory.productId))
      .where(whereClause)
      .orderBy(orderDirection)
      .limit(limit)
      .offset(offset);

    // Populate primary images for product list
    const productIds = rawProducts.map((p) => p.product.id);
    let imagesMap: Record<string, (typeof productImages.$inferSelect)[]> = {};

    if (productIds.length > 0) {
      const images = await database
        .select()
        .from(productImages)
        .where(sql`${productImages.productId} IN ${productIds}`)
        .orderBy(asc(productImages.sortOrder));

      imagesMap = images.reduce(
        (acc, img) => {
          if (!acc[img.productId]) acc[img.productId] = [];
          acc[img.productId].push(img);
          return acc;
        },
        {} as Record<string, (typeof productImages.$inferSelect)[]>,
      );
    }

    const data = rawProducts.map((item) => {
      const currentStock = item.currentStock ?? 50;
      const reservedStock = item.reservedStock ?? 0;
      const availableStock = Math.max(0, currentStock - reservedStock);

      let stockStatus: "IN_STOCK" | "LOW_STOCK" | "OUT_OF_STOCK" = "IN_STOCK";
      if (
        !item.product.isActive ||
        (item.currentStock !== null &&
          item.currentStock !== undefined &&
          availableStock <= 0)
      ) {
        stockStatus = "OUT_OF_STOCK";
      } else if (item.minStock && availableStock <= item.minStock) {
        stockStatus = "LOW_STOCK";
      } else {
        stockStatus = "IN_STOCK";
      }

      return {
        ...item.product,
        category: {
          id: item.product.categoryId,
          name: item.categoryName,
          slug: item.categorySlug,
        },
        brand: {
          id: item.product.brandId,
          name: item.brandName,
          slug: item.brandSlug,
        },
        images: imagesMap[item.product.id] ?? [],
        currentStock,
        reservedStock,
        availableStock,
        stockStatus,
      };
    });

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findById(id: string) {
    const database = getDb();
    const [result] = await database
      .select({
        product: products,
        categoryName: categories.name,
        categorySlug: categories.slug,
        brandName: brands.name,
        brandSlug: brands.slug,
        currentStock: productInventory.currentStock,
        reservedStock: productInventory.reservedStock,
        minStock: productInventory.minStock,
      })
      .from(products)
      .innerJoin(categories, eq(products.categoryId, categories.id))
      .innerJoin(brands, eq(products.brandId, brands.id))
      .leftJoin(productInventory, eq(products.id, productInventory.productId))
      .where(and(eq(products.id, id), isNull(products.deletedAt)))
      .limit(1);

    if (!result) return null;

    const currentStock = result.currentStock ?? 50;
    const reservedStock = result.reservedStock ?? 0;
    const availableStock = Math.max(0, currentStock - reservedStock);

    let stockStatus: "IN_STOCK" | "LOW_STOCK" | "OUT_OF_STOCK" = "IN_STOCK";
    if (
      !result.product.isActive ||
      (result.currentStock !== null &&
        result.currentStock !== undefined &&
        availableStock <= 0)
    ) {
      stockStatus = "OUT_OF_STOCK";
    } else if (result.minStock && availableStock <= result.minStock) {
      stockStatus = "LOW_STOCK";
    } else {
      stockStatus = "IN_STOCK";
    }

    const images = await database
      .select()
      .from(productImages)
      .where(eq(productImages.productId, id))
      .orderBy(asc(productImages.sortOrder));

    return {
      ...result.product,
      category: {
        id: result.product.categoryId,
        name: result.categoryName,
        slug: result.categorySlug,
      },
      brand: {
        id: result.product.brandId,
        name: result.brandName,
        slug: result.brandSlug,
      },
      images,
      currentStock,
      reservedStock,
      availableStock,
      stockStatus,
    };
  }

  async findBySlug(slug: string) {
    const database = getDb();
    const [result] = await database
      .select({
        product: products,
        categoryName: categories.name,
        categorySlug: categories.slug,
        brandName: brands.name,
        brandSlug: brands.slug,
        currentStock: productInventory.currentStock,
        reservedStock: productInventory.reservedStock,
        minStock: productInventory.minStock,
      })
      .from(products)
      .innerJoin(categories, eq(products.categoryId, categories.id))
      .innerJoin(brands, eq(products.brandId, brands.id))
      .leftJoin(productInventory, eq(products.id, productInventory.productId))
      .where(and(eq(products.slug, slug), isNull(products.deletedAt)))
      .limit(1);

    if (!result) return null;

    const currentStock = result.currentStock ?? 50;
    const reservedStock = result.reservedStock ?? 0;
    const availableStock = Math.max(0, currentStock - reservedStock);

    let stockStatus: "IN_STOCK" | "LOW_STOCK" | "OUT_OF_STOCK" = "IN_STOCK";
    if (
      !result.product.isActive ||
      (result.currentStock !== null &&
        result.currentStock !== undefined &&
        availableStock <= 0)
    ) {
      stockStatus = "OUT_OF_STOCK";
    } else if (result.minStock && availableStock <= result.minStock) {
      stockStatus = "LOW_STOCK";
    } else {
      stockStatus = "IN_STOCK";
    }

    const images = await database
      .select()
      .from(productImages)
      .where(eq(productImages.productId, result.product.id))
      .orderBy(asc(productImages.sortOrder));

    return {
      ...result.product,
      category: {
        id: result.product.categoryId,
        name: result.categoryName,
        slug: result.categorySlug,
      },
      brand: {
        id: result.product.brandId,
        name: result.brandName,
        slug: result.brandSlug,
      },
      images,
      currentStock,
      reservedStock,
      availableStock,
      stockStatus,
    };
  }

  async findBySku(sku: string) {
    const [record] = await getDb()
      .select()
      .from(products)
      .where(and(eq(products.sku, sku), isNull(products.deletedAt)))
      .limit(1);

    return record ?? null;
  }

  async create(data: CreateProductInput & { slug: string }) {
    const database = getDb();

    return database.transaction(async (tx) => {
      const [insertedProduct] = await tx
        .insert(products)
        .values({
          name: data.name,
          slug: data.slug,
          sku: data.sku,
          shortDescription: data.shortDescription ?? null,
          description: data.description ?? null,
          price: data.price.toString(),
          categoryId: data.categoryId,
          brandId: data.brandId,
          specifications: data.specifications ?? {},
          isActive: data.isActive ?? true,
        })
        .returning();

      if (data.images && data.images.length > 0) {
        await tx.insert(productImages).values(
          data.images.map((img) => ({
            productId: insertedProduct.id,
            url: img.url,
            storageKey: img.storageKey,
            altText: img.altText ?? null,
            sortOrder: img.sortOrder ?? 0,
            isPrimary: img.isPrimary ?? false,
          })),
        );
      }

      await tx.insert(productInventory).values({
        productId: insertedProduct.id,
        currentStock: data.initialStock ?? 50,
        reservedStock: 0,
        reorderLevel: 10,
      });

      return insertedProduct;
    });
  }

  async update(id: string, data: UpdateProductInput & { slug?: string }) {
    const database = getDb();

    const { images: _images, price, ...updateFields } = data;
    void _images;

    const [updated] = await database
      .update(products)
      .set({
        ...updateFields,
        ...(price !== undefined ? { price: price.toString() } : {}),
        updatedAt: sql`NOW()`,
      })
      .where(and(eq(products.id, id), isNull(products.deletedAt)))
      .returning();

    return updated ?? null;
  }

  async softDelete(id: string) {
    const [deleted] = await getDb()
      .update(products)
      .set({
        deletedAt: sql`NOW()`,
        updatedAt: sql`NOW()`,
      })
      .where(and(eq(products.id, id), isNull(products.deletedAt)))
      .returning();

    return !!deleted;
  }

  async addImage(productId: string, imageData: AddProductImageInput) {
    const [inserted] = await getDb()
      .insert(productImages)
      .values({
        productId,
        url: imageData.url,
        storageKey: imageData.storageKey,
        altText: imageData.altText ?? null,
        sortOrder: imageData.sortOrder ?? 0,
        isPrimary: imageData.isPrimary ?? false,
      })
      .returning();

    return inserted;
  }

  async removeImage(imageId: string) {
    const [deleted] = await getDb()
      .delete(productImages)
      .where(eq(productImages.id, imageId))
      .returning();

    return !!deleted;
  }
}

export const productRepository = new ProductRepository();
