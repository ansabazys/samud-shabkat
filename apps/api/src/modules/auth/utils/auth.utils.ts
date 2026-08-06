import { db } from "@samud/database";
import type { UserResponse } from "../types/auth.types.js";

/**
 * Safely resolves the Drizzle database instance without early connection crashes.
 */
export function getAuthDb() {
  if (!db) {
    throw new Error("Database client not initialized (DATABASE_URL missing)");
  }
  return db;
}

/**
 * Transforms a raw user database record into a safe public user profile response.
 */
export function formatUserResponse(user: {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  companyName?: string | null;
}): UserResponse {
  return {
    id: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    role: user.role,
    companyName: user.companyName ?? null,
  };
}
