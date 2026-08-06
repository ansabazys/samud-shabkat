import { brands } from "@samud/database";
import { eq, and, isNull, ilike, count, sql, desc, asc } from "drizzle-orm";
import { getDb } from "../../../common/db.js";
import type {
  CreateBrandInput,
  UpdateBrandInput,
  BrandQueryParams,
} from "../schemas/brand.schema.js";

export class BrandRepository {
  async findAll(params: BrandQueryParams) {
    const database = getDb();
    const { page, limit, search, isActive } = params;
    const offset = (page - 1) * limit;

    const conditions = [isNull(brands.deletedAt)];

    if (search) {
      conditions.push(ilike(brands.name, `%${search}%`));
    }

    if (isActive !== undefined) {
      conditions.push(eq(brands.isActive, isActive === "true"));
    }

    const whereClause = and(...conditions);

    const [countResult] = await database
      .select({ total: count() })
      .from(brands)
      .where(whereClause);

    const total = Number(countResult?.total ?? 0);

    const data = await database
      .select()
      .from(brands)
      .where(whereClause)
      .orderBy(asc(brands.name), desc(brands.createdAt))
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
      .from(brands)
      .where(and(eq(brands.id, id), isNull(brands.deletedAt)))
      .limit(1);

    return record ?? null;
  }

  async findBySlug(slug: string) {
    const [record] = await getDb()
      .select()
      .from(brands)
      .where(and(eq(brands.slug, slug), isNull(brands.deletedAt)))
      .limit(1);

    return record ?? null;
  }

  async create(data: CreateBrandInput & { slug: string }) {
    const [inserted] = await getDb()
      .insert(brands)
      .values({
        name: data.name,
        slug: data.slug,
        description: data.description ?? null,
        logoUrl: data.logoUrl ?? null,
        isActive: data.isActive ?? true,
      })
      .returning();

    return inserted;
  }

  async update(id: string, data: UpdateBrandInput & { slug?: string }) {
    const [updated] = await getDb()
      .update(brands)
      .set({
        ...data,
        updatedAt: sql`NOW()`,
      })
      .where(and(eq(brands.id, id), isNull(brands.deletedAt)))
      .returning();

    return updated ?? null;
  }

  async softDelete(id: string) {
    const [deleted] = await getDb()
      .update(brands)
      .set({
        deletedAt: sql`NOW()`,
        updatedAt: sql`NOW()`,
      })
      .where(and(eq(brands.id, id), isNull(brands.deletedAt)))
      .returning();

    return !!deleted;
  }
}

export const brandRepository = new BrandRepository();
