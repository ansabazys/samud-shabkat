import { categories } from "@samud/database";
import { eq, and, isNull, ilike, count, sql, desc, asc } from "drizzle-orm";
import { getDb } from "../../../common/db.js";
import type {
  CreateCategoryInput,
  UpdateCategoryInput,
  CategoryQueryParams,
} from "../schemas/category.schema.js";

export class CategoryRepository {
  async findAll(params: CategoryQueryParams) {
    const database = getDb();
    const { page, limit, search, isActive } = params;
    const offset = (page - 1) * limit;

    const conditions = [isNull(categories.deletedAt)];

    if (search) {
      conditions.push(ilike(categories.name, `%${search}%`));
    }

    if (isActive !== undefined) {
      conditions.push(eq(categories.isActive, isActive === "true"));
    }

    const whereClause = and(...conditions);

    const [countResult] = await database
      .select({ total: count() })
      .from(categories)
      .where(whereClause);

    const total = Number(countResult?.total ?? 0);

    const data = await database
      .select()
      .from(categories)
      .where(whereClause)
      .orderBy(asc(categories.sortOrder), desc(categories.createdAt))
      .limit(limit)
      .offset(offset);

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findById(id: string) {
    const [record] = await getDb()
      .select()
      .from(categories)
      .where(and(eq(categories.id, id), isNull(categories.deletedAt)))
      .limit(1);

    return record ?? null;
  }

  async findBySlug(slug: string) {
    const [record] = await getDb()
      .select()
      .from(categories)
      .where(and(eq(categories.slug, slug), isNull(categories.deletedAt)))
      .limit(1);

    return record ?? null;
  }

  async create(data: CreateCategoryInput & { slug: string }) {
    const [inserted] = await getDb()
      .insert(categories)
      .values({
        name: data.name,
        slug: data.slug,
        description: data.description ?? null,
        imageUrl: data.imageUrl ?? null,
        sortOrder: data.sortOrder ?? 0,
        isActive: data.isActive ?? true,
      })
      .returning();

    return inserted;
  }

  async update(id: string, data: UpdateCategoryInput & { slug?: string }) {
    const [updated] = await getDb()
      .update(categories)
      .set({
        ...data,
        updatedAt: sql`NOW()`,
      })
      .where(and(eq(categories.id, id), isNull(categories.deletedAt)))
      .returning();

    return updated ?? null;
  }

  async softDelete(id: string) {
    const [deleted] = await getDb()
      .update(categories)
      .set({
        deletedAt: sql`NOW()`,
        updatedAt: sql`NOW()`,
      })
      .where(and(eq(categories.id, id), isNull(categories.deletedAt)))
      .returning();

    return !!deleted;
  }
}

export const categoryRepository = new CategoryRepository();
