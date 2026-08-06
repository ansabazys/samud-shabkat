import { db } from "@samud/database";

export function getDb() {
  if (!db) {
    throw new Error("Database client not initialized (DATABASE_URL missing)");
  }
  return db;
}
