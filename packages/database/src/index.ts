import dotenv from "dotenv";
import path from "node:path";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema/index.js";
import * as relations from "./relations/index.js";

function loadEnv() {
  if (!process.env.DATABASE_URL) {
    dotenv.config({
      path: [
        path.resolve(process.cwd(), ".env"),
        path.resolve(process.cwd(), "../../.env"),
        path.resolve(process.cwd(), "../.env"),
      ],
    });
  }
}

loadEnv();

let _client: ReturnType<typeof postgres> | undefined;
let _db: ReturnType<typeof drizzle> | undefined;

export function getDatabase() {
  loadEnv();
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    return undefined;
  }
  if (!_db) {
    _client = postgres(databaseUrl);
    _db = drizzle(_client, { schema: { ...schema, ...relations } });
  }
  return _db;
}

export const client = process.env.DATABASE_URL
  ? postgres(process.env.DATABASE_URL)
  : undefined;
export const db = getDatabase();

export * from "./schema/index.js";
export * from "./relations/index.js";
