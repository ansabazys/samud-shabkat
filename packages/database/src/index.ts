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

export function createClient(databaseUrl: string) {
  const isNeon = databaseUrl.includes("neon.tech");
  const requiresSsl =
    isNeon ||
    databaseUrl.includes("sslmode=require") ||
    process.env.DATABASE_SSL === "true" ||
    (process.env.NODE_ENV === "production" && !databaseUrl.includes("localhost") && !databaseUrl.includes("127.0.0.1"));

  const maxConnections = process.env.DATABASE_MAX_CONNECTIONS
    ? parseInt(process.env.DATABASE_MAX_CONNECTIONS, 10)
    : isNeon
      ? 10
      : 20;

  const clientOptions: postgres.Options<Record<string, never>> = {
    max: maxConnections,
    idle_timeout: 20,
    connect_timeout: 15,
    ...(requiresSsl ? { ssl: "require" } : {}),
  };

  return postgres(databaseUrl, clientOptions);
}

export function getClient(): ReturnType<typeof postgres> | undefined {
  loadEnv();
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    return undefined;
  }
  if (!_client) {
    _client = createClient(databaseUrl);
  }
  return _client;
}

export function getDatabase() {
  const clientInstance = getClient();
  if (!clientInstance) {
    return undefined;
  }
  if (!_db) {
    _db = drizzle(clientInstance, { schema: { ...schema, ...relations } });
  }
  return _db;
}

export async function closeDatabase() {
  if (_client) {
    await _client.end();
    _client = undefined;
    _db = undefined;
  }
}

export const client = getClient();
export const db = getDatabase();

export * from "./schema/index.js";
export * from "./relations/index.js";
