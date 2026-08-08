import { db, getDatabase } from "@samud/database";

export function getDb() {
  const instance = db ?? getDatabase();
  if (!instance) {
    throw new Error("Database client not initialized (DATABASE_URL missing)");
  }
  return instance;
}
