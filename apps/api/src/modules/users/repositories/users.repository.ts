import { users, roles, userRoles, customerProfiles } from "@samud/database";
import { eq, and, ilike, count, sql, desc, asc } from "drizzle-orm";
import { getDb } from "../../../common/db.js";
import type {
  CreateUserInput,
  UpdateUserInput,
  UserQueryParams,
} from "../schemas/users.schema.js";

export class UsersRepository {
  async findAll(params: UserQueryParams) {
    const database = getDb();
    const { page, limit, search, role, isActive, sortBy, sortOrder } = params;
    const offset = (page - 1) * limit;

    const conditions = [];

    if (typeof isActive === "boolean") {
      conditions.push(eq(users.isActive, isActive));
    }

    if (search) {
      conditions.push(
        sql`(${ilike(users.email, `%${search}%`)} OR ${ilike(
          users.firstName,
          `%${search}%`,
        )} OR ${ilike(users.lastName, `%${search}%`)})`,
      );
    }

    if (role) {
      conditions.push(eq(roles.name, role));
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const [countResult] = await database
      .select({ total: count() })
      .from(users)
      .leftJoin(userRoles, eq(users.id, userRoles.userId))
      .leftJoin(roles, eq(userRoles.roleId, roles.id))
      .where(whereClause);

    const total = Number(countResult?.total ?? 0);

    const sortColumn =
      sortBy === "email"
        ? users.email
        : sortBy === "firstName"
          ? users.firstName
          : sortBy === "lastName"
            ? users.lastName
            : users.createdAt;

    const direction = sortOrder === "asc" ? asc(sortColumn) : desc(sortColumn);

    const rows = await database
      .select({
        user: users,
        roleName: roles.name,
        phoneNumber: customerProfiles.phoneNumber,
      })
      .from(users)
      .leftJoin(userRoles, eq(users.id, userRoles.userId))
      .leftJoin(roles, eq(userRoles.roleId, roles.id))
      .leftJoin(customerProfiles, eq(users.id, customerProfiles.userId))
      .where(whereClause)
      .orderBy(direction)
      .limit(limit)
      .offset(offset);

    const data = rows.map((r) => ({
      id: r.user.id,
      email: r.user.email,
      firstName: r.user.firstName,
      lastName: r.user.lastName,
      isActive: r.user.isActive,
      role: r.roleName ?? "CUSTOMER",
      phoneNumber: r.phoneNumber ?? null,
      createdAt: r.user.createdAt,
      updatedAt: r.user.updatedAt,
    }));

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
    const [row] = await database
      .select({
        user: users,
        roleName: roles.name,
        phoneNumber: customerProfiles.phoneNumber,
        companyName: customerProfiles.companyName,
      })
      .from(users)
      .leftJoin(userRoles, eq(users.id, userRoles.userId))
      .leftJoin(roles, eq(userRoles.roleId, roles.id))
      .leftJoin(customerProfiles, eq(users.id, customerProfiles.userId))
      .where(eq(users.id, id))
      .limit(1);

    if (!row) return null;

    return {
      id: row.user.id,
      email: row.user.email,
      firstName: row.user.firstName,
      lastName: row.user.lastName,
      isActive: row.user.isActive,
      role: row.roleName ?? "CUSTOMER",
      phoneNumber: row.phoneNumber ?? null,
      companyName: row.companyName ?? null,
      createdAt: row.user.createdAt,
      updatedAt: row.user.updatedAt,
    };
  }

  async findByEmail(email: string) {
    const [row] = await getDb()
      .select()
      .from(users)
      .where(eq(users.email, email.toLowerCase()))
      .limit(1);
    return row ?? null;
  }

  async createUser(
    data: CreateUserInput,
    hashedPassword: string,
    targetRole = "STAFF",
  ) {
    const database = getDb();

    return database.transaction(async (tx) => {
      const [newUser] = await tx
        .insert(users)
        .values({
          email: data.email.toLowerCase(),
          passwordHash: hashedPassword,
          firstName: data.firstName,
          lastName: data.lastName,
          isActive: data.isActive ?? true,
        })
        .returning();

      // Find role by name
      const [foundRole] = await tx
        .select()
        .from(roles)
        .where(eq(roles.name, targetRole))
        .limit(1);

      if (foundRole) {
        await tx.insert(userRoles).values({
          userId: newUser.id,
          roleId: foundRole.id,
        });
      }

      if (data.phoneNumber) {
        await tx.insert(customerProfiles).values({
          userId: newUser.id,
          phoneNumber: data.phoneNumber,
        });
      }

      return {
        id: newUser.id,
        email: newUser.email,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        isActive: newUser.isActive,
        role: targetRole,
        phoneNumber: data.phoneNumber ?? null,
        createdAt: newUser.createdAt,
      };
    });
  }

  async updateUser(id: string, data: UpdateUserInput, hashedPassword?: string) {
    const database = getDb();

    return database.transaction(async (tx) => {
      const updatePayload: Record<string, unknown> = {
        updatedAt: sql`NOW()`,
      };

      if (data.email) updatePayload.email = data.email.toLowerCase();
      if (data.firstName) updatePayload.firstName = data.firstName;
      if (data.lastName) updatePayload.lastName = data.lastName;
      if (typeof data.isActive === "boolean")
        updatePayload.isActive = data.isActive;
      if (hashedPassword) updatePayload.passwordHash = hashedPassword;

      const [updatedUser] = await tx
        .update(users)
        .set(updatePayload)
        .where(eq(users.id, id))
        .returning();

      if (!updatedUser) return null;

      if (data.role) {
        const [foundRole] = await tx
          .select()
          .from(roles)
          .where(eq(roles.name, data.role))
          .limit(1);

        if (foundRole) {
          await tx.delete(userRoles).where(eq(userRoles.userId, id));
          await tx.insert(userRoles).values({
            userId: id,
            roleId: foundRole.id,
          });
        }
      }

      if (data.phoneNumber !== undefined) {
        const [existingProfile] = await tx
          .select()
          .from(customerProfiles)
          .where(eq(customerProfiles.userId, id))
          .limit(1);

        if (existingProfile) {
          await tx
            .update(customerProfiles)
            .set({ phoneNumber: data.phoneNumber, updatedAt: sql`NOW()` })
            .where(eq(customerProfiles.userId, id));
        } else {
          await tx.insert(customerProfiles).values({
            userId: id,
            phoneNumber: data.phoneNumber,
          });
        }
      }

      return this.findById(id);
    });
  }

  async setUserActiveState(id: string, isActive: boolean) {
    const [updated] = await getDb()
      .update(users)
      .set({ isActive, updatedAt: sql`NOW()` })
      .where(eq(users.id, id))
      .returning();

    return updated ?? null;
  }
}

export const usersRepository = new UsersRepository();
