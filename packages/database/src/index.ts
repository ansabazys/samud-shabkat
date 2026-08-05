import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema/index.js";
import * as relations from "./relations/index.js";

const databaseUrl = process.env.DATABASE_URL;
export const client = databaseUrl ? postgres(databaseUrl) : undefined;
export const db = client
  ? drizzle(client, { schema: { ...schema, ...relations } })
  : undefined;

export * from "./schema/index.js";
export * from "./relations/index.js";
