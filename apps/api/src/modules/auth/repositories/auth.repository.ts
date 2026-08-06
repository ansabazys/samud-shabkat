import { users, roles, userRoles, customerProfiles } from "@samud/database";
import { ROLES } from "@samud/config";
import { eq } from "drizzle-orm";
import type { RegisterInput, EnrichedUser } from "../types/auth.types.js";
import { getAuthDb } from "../utils/auth.utils.js";

export class AuthRepository {
  private async getFullUser(
    user: typeof users.$inferSelect,
  ): Promise<EnrichedUser> {
    const database = getAuthDb();
    const [userRoleRecord] = await database
      .select({
        roleName: roles.name,
      })
      .from(userRoles)
      .innerJoin(roles, eq(userRoles.roleId, roles.id))
      .where(eq(userRoles.userId, user.id))
      .limit(1);

    const [profileRecord] = await database
      .select({
        companyName: customerProfiles.companyName,
      })
      .from(customerProfiles)
      .where(eq(customerProfiles.userId, user.id))
      .limit(1);

    return {
      id: user.id,
      email: user.email,
      passwordHash: user.passwordHash,
      firstName: user.firstName,
      lastName: user.lastName,
      isActive: user.isActive,
      refreshToken: user.refreshToken,
      role: userRoleRecord?.roleName ?? ROLES.CUSTOMER,
      companyName: profileRecord?.companyName ?? null,
    };
  }

  async findByEmail(email: string): Promise<EnrichedUser | null> {
    const [user] = await getAuthDb()
      .select()
      .from(users)
      .where(eq(users.email, email.toLowerCase()))
      .limit(1);

    if (!user) {
      return null;
    }
    return this.getFullUser(user);
  }

  async findById(id: string): Promise<EnrichedUser | null> {
    const [user] = await getAuthDb()
      .select()
      .from(users)
      .where(eq(users.id, id))
      .limit(1);

    if (!user) {
      return null;
    }
    return this.getFullUser(user);
  }

  async findByRefreshToken(token: string): Promise<EnrichedUser | null> {
    const [user] = await getAuthDb()
      .select()
      .from(users)
      .where(eq(users.refreshToken, token))
      .limit(1);

    if (!user) {
      return null;
    }
    return this.getFullUser(user);
  }

  async createUserWithProfile(
    data: RegisterInput,
    passwordHash: string,
  ): Promise<EnrichedUser> {
    const database = getAuthDb();

    return database.transaction(async (tx) => {
      // 1. Insert user
      const [insertedUser] = await tx
        .insert(users)
        .values({
          email: data.email.toLowerCase(),
          passwordHash,
          firstName: data.firstName,
          lastName: data.lastName,
          isActive: true,
        })
        .returning();

      if (!insertedUser) {
        throw new Error("Failed to create user account");
      }

      // 2. Lookup default CUSTOMER role
      const [customerRole] = await tx
        .select({ id: roles.id, name: roles.name })
        .from(roles)
        .where(eq(roles.name, ROLES.CUSTOMER))
        .limit(1);

      if (customerRole) {
        await tx.insert(userRoles).values({
          userId: insertedUser.id,
          roleId: customerRole.id,
        });
      }

      // 3. Create customer profile
      const [insertedProfile] = await tx
        .insert(customerProfiles)
        .values({
          userId: insertedUser.id,
          companyName: data.companyName ?? null,
          phoneNumber: data.phoneNumber ?? null,
        })
        .returning();

      return {
        id: insertedUser.id,
        email: insertedUser.email,
        passwordHash: insertedUser.passwordHash,
        firstName: insertedUser.firstName,
        lastName: insertedUser.lastName,
        isActive: insertedUser.isActive,
        refreshToken: null,
        role: customerRole?.name ?? ROLES.CUSTOMER,
        companyName: insertedProfile?.companyName ?? null,
      };
    });
  }
}

export const authRepository = new AuthRepository();
