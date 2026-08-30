import dotenv from "dotenv";
import path from "node:path";
import { defineConfig } from "drizzle-kit";

dotenv.config({
  path: [
    path.resolve(process.cwd(), ".env"),
    path.resolve(process.cwd(), "../../.env"),
  ],
});

let dbUrl = process.env.DATABASE_URL ?? "";
if (dbUrl.includes("-pooler.")) {
  dbUrl = dbUrl.replace("-pooler.", ".");
}

export default defineConfig({
  schema: "./src/schema",
  out: "./src/migrations",
  dialect: "postgresql",
  dbCredentials: { url: dbUrl },
});

