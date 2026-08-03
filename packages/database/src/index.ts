import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

const databaseUrl = process.env.DATABASE_URL;
export const client = databaseUrl ? postgres(databaseUrl) : undefined;
export const db = client ? drizzle(client) : undefined;
