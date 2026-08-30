import fs from "node:fs";
import path from "node:path";
import dotenv from "dotenv";
import postgres from "postgres";

dotenv.config({
  path: [
    path.resolve(process.cwd(), ".env"),
    path.resolve(process.cwd(), "../../.env"),
    path.resolve(process.cwd(), "../.env"),
  ],
});

let dbUrl = process.env.DATABASE_URL;
if (!dbUrl) {
  console.error("❌ DATABASE_URL is not set in environment.");
  process.exit(1);
}

if (dbUrl.includes("-pooler.")) {
  dbUrl = dbUrl.replace("-pooler.", ".");
}

async function main() {
  console.log("🔌 Connecting to database...");
  const sql = postgres(dbUrl!, { max: 1, ssl: "require" });

  try {
    console.log("🛠️ Initializing drizzle migration tracking table...");
    await sql`CREATE SCHEMA IF NOT EXISTS drizzle;`;
    await sql`
      CREATE TABLE IF NOT EXISTS drizzle.__drizzle_migrations (
        id SERIAL PRIMARY KEY,
        hash text NOT NULL,
        created_at bigint
      );
    `;

    const migrationsDir = path.resolve(
      fs.existsSync(path.resolve(process.cwd(), "src/migrations"))
        ? path.resolve(process.cwd(), "src/migrations")
        : path.resolve(process.cwd(), "packages/database/src/migrations")
    );
    const journalPath = path.join(migrationsDir, "meta", "_journal.json");
    const journal = JSON.parse(fs.readFileSync(journalPath, "utf-8"));

    const applied = await sql`SELECT hash FROM drizzle.__drizzle_migrations;`;
    const appliedTags = new Set(applied.map((r: any) => r.hash));

    for (const entry of journal.entries) {
      const tag = entry.tag;
      if (appliedTags.has(tag)) {
        console.log(`⏩ Migration ${tag} already applied. Skipping.`);
        continue;
      }

      const sqlFile = path.join(migrationsDir, `${tag}.sql`);
      console.log(`🚀 Executing migration: ${tag}.sql ...`);
      const sqlContent = fs.readFileSync(sqlFile, "utf-8");

      // Execute migration statements
      await sql.unsafe(sqlContent);

      // Record migration
      await sql`
        INSERT INTO drizzle.__drizzle_migrations (hash, created_at)
        VALUES (${tag}, ${entry.when});
      `;
      console.log(`✅ Applied migration: ${tag}`);
    }

    console.log("🎉 All database migrations applied successfully!");
  } catch (err) {
    console.error("❌ Migration failed with error:", err);
    process.exit(1);
  } finally {
    await sql.end();
  }
}

main();
